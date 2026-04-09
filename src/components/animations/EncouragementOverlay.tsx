import { motion, AnimatePresence } from 'framer-motion';

interface EncouragementOverlayProps {
  show: boolean;
}

const hearts = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  xOffset: (i - 2) * 25,
  delay: i * 0.1,
}));

export default function EncouragementOverlay({ show }: EncouragementOverlayProps) {
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, y: 0, x: h.xOffset, scale: 0.5 }}
              animate={{ opacity: 0, y: -120, scale: 1 }}
              transition={{
                duration: 1.5,
                delay: h.delay,
                ease: 'easeOut',
              }}
              style={{ position: 'absolute' }}
            >
              <svg width="32" height="32" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20,35 C10,28 1,20 1,13 C1,6 6,2 12,2 C16,2 18.5,4 20,7 C21.5,4 24,2 28,2 C34,2 39,6 39,13 C39,20 30,28 20,35Z"
                  fill="#FF6B6B"
                  opacity="0.8"
                />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
