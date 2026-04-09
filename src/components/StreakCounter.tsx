import { motion, AnimatePresence } from 'framer-motion';
import { colors, fontStack } from '../styles/theme';
import RobotCoinIcon from './ui/RobotCoinIcon';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="wait">
        {streak > 0 && (
          <motion.div
            key={streak}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 20,
              padding: '8px 16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              fontFamily: fontStack,
              fontSize: '1.5rem',
              fontWeight: 700,
              color: colors.charcoal,
            }}
          >
            <motion.span
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <RobotCoinIcon size={30} />
            </motion.span>
            {streak}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
