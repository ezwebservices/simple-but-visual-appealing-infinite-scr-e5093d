import { motion } from 'framer-motion';
import { colors, fontStack } from '../../styles/theme';

type ButtonState = 'default' | 'correct' | 'wrong-selected' | 'wrong-unselected' | 'correct-reveal';

interface AnswerButtonProps {
  value: number;
  state: ButtonState;
  disabled: boolean;
  onSelect: (value: number) => void;
}

const bgByState: Record<ButtonState, string> = {
  default: '#7C6DAF',
  correct: colors.mint,
  'wrong-selected': colors.coral,
  'wrong-unselected': '#7C6DAF',
  'correct-reveal': colors.mint,
};

const animByState: Record<ButtonState, object> = {
  default: {},
  correct: { scale: [1, 1.2, 1] },
  'wrong-selected': { x: [-5, 5, -5, 0] },
  'wrong-unselected': { opacity: 0.5 },
  'correct-reveal': { scale: [1, 1.1, 1], opacity: [0.5, 1, 1] },
};

export default function AnswerButton({ value, state, disabled, onSelect }: AnswerButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(value)}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      animate={{
        backgroundColor: bgByState[state],
        ...animByState[state],
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        minHeight: '90px',
        width: '28vw',
        maxWidth: '140px',
        borderRadius: '24px',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: fontStack,
        fontSize: '2.5rem',
        fontWeight: 800,
        color: 'white',
        backgroundColor: bgByState[state],
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
      }}
    >
      {value}
    </motion.button>
  );
}
