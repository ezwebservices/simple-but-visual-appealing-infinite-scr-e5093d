import { motion } from 'framer-motion';
import type { ObjectType } from '../../types';
import Apple from './Apple';
import Star from './Star';
import Heart from './Heart';
import Balloon from './Balloon';
import Fish from './Fish';

interface ObjectGroupProps {
  count: number;
  objectType: ObjectType;
  onTap?: () => void;
  /** When true, objects appear one-by-one with ~800ms delay for counting along */
  staggerEntrance?: boolean;
}

const objectMap = {
  apple: Apple,
  star: Star,
  heart: Heart,
  balloon: Balloon,
  fish: Fish,
} as const;

/** Per-object delay in seconds when staggering entrance for counting */
const COUNTING_STAGGER = 0.8;

export default function ObjectGroup({ count, objectType, onTap, staggerEntrance = false }: ObjectGroupProps) {
  const ObjectComponent = objectMap[objectType];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={staggerEntrance ? { scale: 0, opacity: 0 } : undefined}
          animate={{
            y: [-2, 2, -2],
            scale: 1,
            opacity: 1,
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: staggerEntrance ? i * COUNTING_STAGGER + 0.3 : i * 0.1,
            },
            scale: staggerEntrance
              ? { type: 'spring', stiffness: 300, damping: 15, delay: i * COUNTING_STAGGER + 0.3 }
              : { duration: 0 },
            opacity: staggerEntrance
              ? { duration: 0.2, delay: i * COUNTING_STAGGER + 0.3 }
              : { duration: 0 },
          }}
          whileTap={{ scale: 1.3 }}
          onTap={onTap}
          style={{ cursor: 'pointer' }}
        >
          <ObjectComponent />
        </motion.div>
      ))}
    </div>
  );
}
