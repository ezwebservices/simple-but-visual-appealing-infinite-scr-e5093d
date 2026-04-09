import { motion, AnimatePresence } from 'framer-motion';
import type { ConceptArea } from '../../types';
import { colors, fontStack, confettiColors, dashboard } from '../../styles/theme';

interface ConceptUnlockedCelebrationProps {
  show: boolean;
  concept: ConceptArea | null;
  onDismiss: () => void;
}

const CONCEPT_LABELS: Record<ConceptArea, string> = {
  counting: 'Counting',
  addition: 'Addition',
  subtraction: 'Subtraction',
};

const CONCEPT_MESSAGES: Record<ConceptArea, string> = {
  counting: 'You can count like a pro!',
  addition: 'Time to learn adding numbers!',
  subtraction: 'Time to learn taking away!',
};

export default function ConceptUnlockedCelebration({ show, concept, onDismiss }: ConceptUnlockedCelebrationProps) {
  if (!concept) return null;

  const color = dashboard.conceptColors[concept];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            pointerEvents: 'auto',
          }}
        >
          {/* Radial burst particles */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const dist = 80 + (i % 3) * 40;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 2, 1],
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.5, delay: i * 0.03, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  borderRadius: i % 3 === 0 ? '50%' : 3,
                  background: confettiColors[i % confettiColors.length],
                }}
              />
            );
          })}

          {/* Star badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color}, ${colors.sunny})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 60px ${color}66, 0 8px 32px rgba(0,0,0,0.2)`,
              marginBottom: 24,
            }}
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: fontStack,
              fontWeight: 900,
              fontSize: '1.8rem',
              color: '#fff',
              textAlign: 'center',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              marginBottom: 8,
            }}
          >
            {CONCEPT_LABELS[concept]} Unlocked!
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontFamily: fontStack,
              fontWeight: 500,
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            {CONCEPT_MESSAGES[concept]}
          </motion.div>

          {/* Continue button */}
          <motion.button
            type="button"
            onClick={onDismiss}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, scale: [1, 1.05, 1] }}
            transition={{
              delay: 0.8,
              scale: { repeat: Infinity, duration: 1.8, delay: 1 },
            }}
            whileTap={{ scale: 0.92 }}
            style={{
              padding: '16px 48px',
              border: 'none',
              borderRadius: 24,
              background: `linear-gradient(135deg, ${color}, ${colors.mint})`,
              color: '#fff',
              fontFamily: fontStack,
              fontWeight: 800,
              fontSize: '1.2rem',
              cursor: 'pointer',
              boxShadow: `0 4px 24px ${color}44`,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Let&apos;s Go!
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
