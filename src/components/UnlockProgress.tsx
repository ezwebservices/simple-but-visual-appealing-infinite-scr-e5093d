import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChildProfile, CharacterName, SubConcept } from '../types';
import { CHARACTER_UNLOCK_ORDER, CHARACTER_UNLOCK_THRESHOLDS, DANCE_MOVE_THRESHOLDS, SUB_CONCEPT_ORDER } from '../types';
import {
  getUnlockedCharacters,
  getUnlockedDanceMoves,
  countMastered,
  progressToNextCharacter,
  progressToNextDance,
} from '../hooks/useUnlocks';
import {
  MIN_ATTEMPTS,
  MASTERY_WINDOW,
  MASTERY_ACCURACY,
  STREAK_SHORTCUT,
} from '../hooks/useMastery';
import CharacterDisplay from './characters/CharacterDisplay';
import { PALETTES } from './characters/CharacterRig';

/**
 * Current-concept progress toward mastery, 0..1. Updates every problem so the
 * kid sees the ring move after every answer.
 *
 * The mastery algorithm accepts EITHER a streak shortcut (STREAK_SHORTCUT
 * correct in a row) OR a combined "enough attempts + accuracy window"
 * condition. We surface the more optimistic of those two paths so the ring
 * always reflects the closest route to mastery.
 */
function getCurrentConceptProgress(child: ChildProfile): number {
  // Find the first 'active' concept — same logic as useMastery.getActiveConcept
  let active: SubConcept | null = null;
  for (const c of SUB_CONCEPT_ORDER) {
    if (child.conceptProgress[c]?.status === 'active') { active = c; break; }
  }
  if (!active) {
    // Everything mastered — show full ring
    return 1;
  }
  const cp = child.conceptProgress[active];
  if (!cp) return 0;

  const streakProgress = Math.min(1, cp.streak / STREAK_SHORTCUT);

  const correctInWindow = cp.recentAttempts.filter(Boolean).length;
  const correctNeeded = Math.ceil(MASTERY_WINDOW * MASTERY_ACCURACY);
  const accuracyProgress = Math.min(1, correctInWindow / correctNeeded);
  const attemptsProgress = Math.min(1, cp.totalAttempted / MIN_ATTEMPTS);
  // Accuracy path requires BOTH enough attempts AND enough correct answers
  const pathTwoProgress = Math.min(accuracyProgress, attemptsProgress);

  return Math.max(streakProgress, pathTwoProgress);
}

interface UnlockProgressProps {
  child: ChildProfile;
}

/**
 * Unlock progress UI: a single floating button (top-right) that opens a
 * full-screen modal showing live character previews and dance previews.
 *
 * Designed for 4-year-olds: no text labels, big animated characters, big
 * stars, lock icons on locked items.
 */
export default function UnlockProgress({ child }: UnlockProgressProps) {
  const [open, setOpen] = useState(false);
  const unlockedChars = new Set(getUnlockedCharacters(child));
  const unlockedDance = getUnlockedDanceMoves(child);
  const mastered = countMastered(child);
  const nextChar = progressToNextCharacter(child);
  const nextDance = progressToNextDance(child);

  // Selected character for the "see your dance moves" preview row.
  // Defaults to the child's active avatar; falls back to bloo.
  const [selectedChar, setSelectedChar] = useState<CharacterName>(
    unlockedChars.has(child.avatar) ? child.avatar : 'bloo',
  );

  // Progress toward mastering the CURRENT active concept (0..1). Updates every
  // problem, so the ring visibly moves after each answer.
  const conceptProgress = getCurrentConceptProgress(child);
  // Ring geometry — SVG viewBox 100x100 so we can place everything in %-like coords
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <>
      {/* Floating button — top-right corner. SVG-based so a progress ring
          can wrap the star and update every problem. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open unlocks"
        title="My collection"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 40,
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          cursor: 'pointer',
          padding: 0,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg viewBox="0 0 100 100" width="64" height="64">
          <defs>
            <radialGradient id="unlock-btn-bg" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFE37B" />
              <stop offset="100%" stopColor="#FF9500" />
            </radialGradient>
            <linearGradient id="unlock-btn-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#9BE3DE" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle cx="50" cy="50" r="46" fill="url(#unlock-btn-bg)" stroke="white" strokeWidth="3" />
          {/* Track for the progress ring */}
          <circle
            cx="50"
            cy="50"
            r={ringRadius}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="6"
          />
          {/* Animated progress ring — rotates -90° so it starts at 12 o'clock */}
          <motion.circle
            cx="50"
            cy="50"
            r={ringRadius}
            fill="none"
            stroke="url(#unlock-btn-ring)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            animate={{ strokeDashoffset: ringCircumference * (1 - conceptProgress) }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
          />
          {/* Star icon in the center */}
          <path
            d="M50 22 L58.5 42.5 L80 42.5 L62.75 55.5 L68.75 76 L50 63 L31.25 76 L37.25 55.5 L20 42.5 L41.5 42.5 Z"
            fill="white"
            stroke="#C49C00"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
        {/* Tiny badge — still shows total rewards earned so far */}
        <span
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            background: '#FF6B6B',
            color: 'white',
            borderRadius: 999,
            minWidth: 22,
            height: 22,
            fontSize: 13,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            padding: '0 5px',
          }}
        >
          {unlockedChars.size + unlockedDance}
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              overflowY: 'auto',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(180deg, #FFFAF0 0%, #FFF0DC 100%)',
                borderRadius: 32,
                padding: '24px 20px 32px',
                maxWidth: 720,
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 12px 60px rgba(0,0,0,0.35)',
                position: 'relative',
              }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#666',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                ✕
              </button>

              {/* CHARACTERS section */}
              <div style={{ marginTop: 8 }}>
                <SectionHeader icon="👥" />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  {CHARACTER_UNLOCK_ORDER.map((name) => {
                    const unlocked = unlockedChars.has(name);
                    return (
                      <CharacterCard
                        key={name}
                        name={name}
                        unlocked={unlocked}
                        selected={selectedChar === name}
                        onSelect={() => unlocked && setSelectedChar(name)}
                        threshold={CHARACTER_UNLOCK_THRESHOLDS[name]}
                        currentMastered={mastered}
                      />
                    );
                  })}
                </div>

                {/* Progress bar to next character */}
                {nextChar && (
                  <ProgressBar
                    progress={nextChar.progress}
                    color1="#4ECDC4"
                    color2="#FFD93D"
                    label={`${nextChar.current}/${nextChar.needed}`}
                  />
                )}
              </div>

              {/* DANCES section — the 5 dance cards use whichever pal the
                  kid just selected above, so they see their own favourite
                  character doing each move. */}
              <div style={{ marginTop: 28 }}>
                <SectionHeader icon="💫" />
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#8A6A30',
                    marginTop: -4,
                    marginBottom: 10,
                    letterSpacing: 0.3,
                  }}
                >
                  tap a pal above to see their moves
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((moveNum) => (
                    <DanceCard
                      key={`${selectedChar}-${moveNum}`}
                      moveNum={moveNum}
                      character={selectedChar}
                      unlocked={unlockedDance >= moveNum}
                      threshold={DANCE_MOVE_THRESHOLDS[moveNum - 1]}
                      currentMastered={mastered}
                    />
                  ))}
                </div>

                {nextDance && (
                  <ProgressBar
                    progress={nextDance.progress}
                    color1="#FF6B6B"
                    color2="#FFD93D"
                    label={`${nextDance.current}/${nextDance.needed}`}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Section header — emoji-only (no text for non-readers)
// ──────────────────────────────────────────────────────────────────
function SectionHeader({ icon }: { icon: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: 32,
        marginBottom: 12,
      }}
    >
      {icon}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Character card — animated character preview, locked state shows
// silhouette + lock icon over a hint of the character's color
// ──────────────────────────────────────────────────────────────────
function CharacterCard({
  name,
  unlocked,
  selected,
  onSelect,
  threshold,
  currentMastered,
}: {
  name: CharacterName;
  unlocked: boolean;
  selected: boolean;
  onSelect: () => void;
  threshold: number;
  currentMastered: number;
}) {
  const palette = PALETTES[name];
  const remaining = Math.max(0, threshold - currentMastered);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!unlocked}
      aria-pressed={selected}
      aria-label={unlocked ? `Select ${name}` : `${name} — locked`}
      style={{
        background: unlocked
          ? `linear-gradient(180deg, ${palette?.body[0] ?? '#fff'} 0%, ${palette?.body[1] ?? '#eee'} 100%)`
          : 'linear-gradient(180deg, #ECECF0 0%, #CCCCD0 100%)',
        borderRadius: 20,
        padding: 8,
        border: selected
          ? '4px solid #FFB200'
          : unlocked
            ? `3px solid ${palette?.body[3] ?? '#999'}`
            : '3px solid #BBB',
        boxShadow: selected
          ? '0 0 0 4px rgba(255,178,0,0.25), 0 6px 18px rgba(255,178,0,0.35)'
          : unlocked ? '0 4px 12px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.08)',
        position: 'relative',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        transform: selected ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: unlocked ? 'none' : 'grayscale(1) brightness(0.7) contrast(0.7)',
          opacity: unlocked ? 1 : 0.5,
        }}
      >
        <CharacterDisplay
          character={name}
          mood={unlocked ? 'happy' : 'happy'}
          animation={unlocked ? 'idle' : 'none'}
        />
      </div>

      {!unlocked && (
        <>
          {/* Lock overlay */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            🔒
          </div>
          {/* Stars-needed badge */}
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#FFD93D',
              color: '#5C4500',
              padding: '3px 10px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24">
              <path
                d="M12 2 L14.4 8.4 L21 8.4 L15.8 12.6 L17.6 19.2 L12 15 L6.4 19.2 L8.2 12.6 L3 8.4 L9.6 8.4 Z"
                fill="#5C4500"
              />
            </svg>
            {remaining}
          </div>
        </>
      )}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────
// Dance card — uses the character the kid selected above, so they
// see their own favourite pal doing each dance move.
// ──────────────────────────────────────────────────────────────────
function DanceCard({
  moveNum,
  character,
  unlocked,
  threshold,
  currentMastered,
}: {
  moveNum: number;
  character: CharacterName;
  unlocked: boolean;
  threshold: number;
  currentMastered: number;
}) {
  const remaining = Math.max(0, threshold - currentMastered);

  return (
    <div
      style={{
        background: unlocked
          ? 'linear-gradient(180deg, #FFF8E5 0%, #FFE9B0 100%)'
          : 'linear-gradient(180deg, #ECECF0 0%, #CCCCD0 100%)',
        borderRadius: 16,
        padding: 4,
        border: unlocked ? '3px solid #FFD93D' : '3px solid #BBB',
        boxShadow: unlocked ? '0 4px 12px rgba(255,217,61,0.4)' : '0 1px 4px rgba(0,0,0,0.08)',
        position: 'relative',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: unlocked ? 'none' : 'grayscale(1) brightness(0.7) contrast(0.7)',
          opacity: unlocked ? 1 : 0.5,
        }}
      >
        <CharacterDisplay
          character={character}
          mood={unlocked ? 'excited' : 'happy'}
          animation={unlocked ? (`dance-${moveNum}` as 'dance-1') : 'none'}
        />
      </div>

      {/* Move number badge — top-left */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: unlocked ? '#FFD93D' : '#888',
          color: unlocked ? '#5C4500' : 'white',
          fontSize: 13,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        {moveNum}
      </div>

      {!unlocked && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            🔒
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#FFD93D',
              color: '#5C4500',
              padding: '2px 8px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24">
              <path
                d="M12 2 L14.4 8.4 L21 8.4 L15.8 12.6 L17.6 19.2 L12 15 L6.4 19.2 L8.2 12.6 L3 8.4 L9.6 8.4 Z"
                fill="#5C4500"
              />
            </svg>
            {remaining}
          </div>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Progress bar with star count badge
// ──────────────────────────────────────────────────────────────────
function ProgressBar({
  progress,
  color1,
  color2,
  label,
}: {
  progress: number;
  color1: string;
  color2: string;
  label: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
      <div
        style={{
          flex: 1,
          height: 12,
          background: 'rgba(0, 0, 0, 0.08)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress * 100)}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color1}, ${color2})`,
            borderRadius: 999,
          }}
        />
      </div>
      <div
        style={{
          minWidth: 50,
          background: '#FFD93D',
          color: '#5C4500',
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 800,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24">
          <path
            d="M12 2 L14.4 8.4 L21 8.4 L15.8 12.6 L17.6 19.2 L12 15 L6.4 19.2 L8.2 12.6 L3 8.4 L9.6 8.4 Z"
            fill="#5C4500"
          />
        </svg>
        {label}
      </div>
    </div>
  );
}
