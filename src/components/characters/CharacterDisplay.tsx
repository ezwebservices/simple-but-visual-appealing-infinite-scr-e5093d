import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterName, CharacterMood } from '../../types';
import BlooBear from './BlooBear';
import SunnyBug from './SunnyBug';
import RosieOwl from './RosieOwl';
import MiloFrog from './MiloFrog';
import PipZebra from './PipZebra';
import RexRobot from './RexRobot';

interface CharacterDisplayProps {
  character: CharacterName;
  mood: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

const characterMap: Record<CharacterName, typeof BlooBear> = {
  bloo: BlooBear,
  sunny: SunnyBug,
  rosie: RosieOwl,
  milo: MiloFrog,
  pip: PipZebra,
  rex: RexRobot,
  robo: RexRobot,
};

// Head-shake: rotates the character left-right like shaking "no"
const shakeKeyframes = [0, -12, 10, -8, 6, -3, 0];
const shakeTimes = [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1];

export default function CharacterDisplay({ character, mood, className, isSpeaking }: CharacterDisplayProps) {
  const Character = characterMap[character];
  const isShaking = mood === 'encouraging' || mood === 'headShake';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${character}-${mood}`}
        initial={{ opacity: 0.6, scale: 0.95, rotate: 0 }}
        animate={
          isShaking
            ? { opacity: 1, scale: 1, rotate: shakeKeyframes }
            : { opacity: 1, scale: 1, rotate: 0 }
        }
        exit={{ opacity: 0.6, scale: 0.95 }}
        transition={
          isShaking
            ? {
                duration: 0.6,
                ease: [0.36, 0.07, 0.19, 0.97],
                times: shakeTimes,
              }
            : { duration: 0.3, ease: 'easeOut' }
        }
        className={className}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformOrigin: 'center 60%', // pivot near neck for natural head-shake
        }}
      >
        <Character mood={mood === 'headShake' ? 'encouraging' : mood} isSpeaking={isSpeaking} />
      </motion.div>
    </AnimatePresence>
  );
}
