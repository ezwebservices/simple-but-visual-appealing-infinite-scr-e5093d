import { motion } from 'framer-motion';
import type { ChildProfile } from '../types';
import { CHARACTER_UNLOCK_ORDER } from '../types';
import {
  getUnlockedCharacters,
  getUnlockedDanceMoves,
  countMastered,
  progressToNextCharacter,
  progressToNextDance,
} from '../hooks/useUnlocks';
import { PALETTES } from './characters/CharacterRig';

interface UnlockProgressProps {
  child: ChildProfile;
}

/**
 * Visual unlock progress for non-readers (4-year-old design).
 * Shows a row of character avatars (locked = grayscale silhouette,
 * unlocked = colored) and a row of dance star icons.
 *
 * NO TEXT. Position-only feedback. Tap-to-hear-name (auditory) handled
 * elsewhere via the audio hook.
 */
export default function UnlockProgress({ child }: UnlockProgressProps) {
  const unlockedChars = new Set(getUnlockedCharacters(child));
  const unlockedDance = getUnlockedDanceMoves(child);
  const mastered = countMastered(child);
  const nextChar = progressToNextCharacter(child);
  const nextDance = progressToNextDance(child);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: 24,
        border: '2px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Character row — circles */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {CHARACTER_UNLOCK_ORDER.map((name) => {
          const unlocked = unlockedChars.has(name);
          const palette = PALETTES[name];
          const bodyColor = palette?.body[2] ?? '#A5C8E5';
          return (
            <motion.div
              key={name}
              initial={false}
              animate={{
                scale: unlocked ? 1 : 0.85,
                opacity: unlocked ? 1 : 0.35,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: unlocked
                  ? `radial-gradient(circle at 35% 30%, ${palette?.body[0] ?? '#fff'}, ${bodyColor})`
                  : 'linear-gradient(180deg, #CCC, #888)',
                border: unlocked
                  ? `2.5px solid ${palette?.stroke ?? '#888'}`
                  : '2.5px solid #999',
                position: 'relative',
                boxShadow: unlocked ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {/* Tiny eyes for each character icon */}
              {unlocked && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 9,
                      width: 7,
                      height: 8,
                      borderRadius: '50%',
                      background: '#1A0F08',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 9,
                      width: 7,
                      height: 8,
                      borderRadius: '50%',
                      background: '#1A0F08',
                    }}
                  />
                </>
              )}
              {!unlocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 18,
                    opacity: 0.7,
                  }}
                >
                  🔒
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar to next character unlock */}
      {nextChar && (
        <div style={{ width: '100%', maxWidth: 240 }}>
          <div
            style={{
              width: '100%',
              height: 6,
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${nextChar.progress * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #4ECDC4, #FFD93D)',
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      )}

      {/* Dance move stars row */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((moveNum) => {
          const unlocked = unlockedDance >= moveNum;
          return (
            <motion.svg
              key={moveNum}
              width={28}
              height={28}
              viewBox="0 0 24 24"
              initial={false}
              animate={{
                scale: unlocked ? 1 : 0.8,
                opacity: unlocked ? 1 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <path
                d="M12 2 L14.4 8.4 L21 8.4 L15.8 12.6 L17.6 19.2 L12 15 L6.4 19.2 L8.2 12.6 L3 8.4 L9.6 8.4 Z"
                fill={unlocked ? '#FFD93D' : '#CCCCCC'}
                stroke={unlocked ? '#C49C00' : '#999'}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </motion.svg>
          );
        })}
      </div>

      {/* Progress bar to next dance unlock */}
      {nextDance && (
        <div style={{ width: '100%', maxWidth: 240 }}>
          <div
            style={{
              width: '100%',
              height: 6,
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${nextDance.progress * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #FF6B6B, #FFD93D)',
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      )}

      {/* Hidden — for tests/debug */}
      <span style={{ display: 'none' }} aria-hidden>{mastered}</span>
    </div>
  );
}
