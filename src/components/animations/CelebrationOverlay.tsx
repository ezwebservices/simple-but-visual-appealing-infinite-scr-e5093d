import { motion, AnimatePresence } from 'framer-motion';
import { confettiColors } from '../../styles/theme';

interface CelebrationOverlayProps {
  show: boolean;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: randomBetween(5, 95),
  color: confettiColors[i % confettiColors.length],
  delay: i * 0.05,
  size: randomBetween(6, 12),
  drift: randomBetween(-30, 30),
}));

export default function CelebrationOverlay({ show }: CelebrationOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 1,
                y: '-5vh',
                x: `${p.x}vw`,
                rotate: 0,
                scale: 1,
              }}
              animate={{
                y: '105vh',
                x: `${p.x + p.drift}vw`,
                rotate: 720,
                scale: [1, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: p.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: p.id % 3 === 0 ? '50%' : '2px',
                backgroundColor: p.color,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
