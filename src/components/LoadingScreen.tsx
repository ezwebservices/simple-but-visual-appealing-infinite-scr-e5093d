import { motion } from 'framer-motion';
import CharacterDisplay from './characters/CharacterDisplay';
import { colors, fontStack } from '../styles/theme';
import type { CharacterName } from '../types';

const characters: CharacterName[] = ['bloo', 'clementine', 'rosie', 'jax', 'milo', 'vex', 'pip', 'moss', 'rex', 'glitch', 'coralie', 'sunny'];

export default function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(180deg, ${colors.cream}, ${colors.lavender})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontStack,
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: '2.2rem',
          fontWeight: 700,
          color: colors.charcoal,
          marginBottom: 32,
          letterSpacing: '-0.02em',
        }}
      >
        NumPals
      </motion.h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {characters.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
            style={{ width: 90 }}
          >
            <CharacterDisplay
              character={name}
              mood="excited"
              animation="dance"
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        style={{
          marginTop: 28,
          fontSize: '1.1rem',
          color: 'rgba(0,0,0,0.4)',
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
