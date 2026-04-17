import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface BlooBearProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * BlooBear — Captain of Team Prime, Guardian of Counting. Humanoid hero-kid
 * in an ice-blue bear-hooded jacket, Tally Gauntlet on the right hand.
 */
export default function BlooBear(props: BlooBearProps) {
  return <CharacterRig palette={PALETTES.bloo} characterId="bloo" {...props} />;
}
