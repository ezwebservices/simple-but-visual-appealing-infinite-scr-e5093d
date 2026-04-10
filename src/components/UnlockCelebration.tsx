import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterName } from '../types';
import { CharacterDisplay } from './characters';
import type { UnlockEvent } from '../hooks/useUnlocks';

interface UnlockCelebrationProps {
  unlock: UnlockEvent | null;
  onDismiss: () => void;
}

/**
 * Full-screen unlock celebration shown when a child masters enough sub-concepts
 * to unlock a new character or dance move. Pure visual + auditory (no text).
 *
 * Auto-dismisses after 4 seconds.
 */
export default function UnlockCelebration({ unlock, onDismiss }: UnlockCelebrationProps) {
  useEffect(() => {
    if (!unlock) return;
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [unlock, onDismiss]);

  if (!unlock) return null;

  // Pick what to highlight (character first, then dance move)
  const newChar: CharacterName | null = unlock.newCharacters[0] ?? null;
  const newDance = unlock.newDanceMoves[0] ?? null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(255,217,61,0.4) 0%, rgba(255,107,107,0.5) 50%, rgba(0,0,0,0.85) 100%)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          cursor: 'pointer',
        }}
      >
        {/* Confetti burst */}
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = (i / 30) * Math.PI * 2;
          const distance = 200 + Math.random() * 150;
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance;
          const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A78BFA', '#FFB3C1'];
          const color = colors[i % colors.length];
          return (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                x: dx,
                y: dy,
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.5],
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 14,
                height: 14,
                borderRadius: i % 3 === 0 ? '50%' : 2,
                background: color,
              }}
            />
          );
        })}

        {/* Star burst rays */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * 360;
          return (
            <motion.div
              key={`ray-${i}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 400,
                height: 6,
                background: 'linear-gradient(90deg, rgba(255,217,61,0.8) 0%, transparent 100%)',
                transformOrigin: 'left center',
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}

        {/* Big character or dance star reveal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.3 }}
          style={{
            width: 280,
            height: 280,
            zIndex: 2,
          }}
        >
          {newChar ? (
            <CharacterDisplay character={newChar} mood="excited" animation="dance-1" />
          ) : (
            // Big golden star for dance move unlock
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <defs>
                <radialGradient id="unlock-star" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFF8C8" />
                  <stop offset="60%" stopColor="#FFD93D" />
                  <stop offset="100%" stopColor="#C49C00" />
                </radialGradient>
              </defs>
              <path
                d="M50 8 L62 38 L94 38 L68 58 L78 90 L50 70 L22 90 L32 58 L6 38 L38 38 Z"
                fill="url(#unlock-star)"
                stroke="#C49C00"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Star number badge */}
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fontSize="28"
                fontWeight="900"
                fill="#1A0F08"
                fontFamily="system-ui, sans-serif"
              >
                {newDance}
              </text>
            </svg>
          )}
        </motion.div>

        {/* Subtle "tap to dismiss" indicator (animated chevron, no text) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.5, delay: 2.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 60,
            zIndex: 2,
          }}
        >
          <svg width={48} height={24} viewBox="0 0 48 24">
            <path d="M4 4 L24 20 L44 4" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
