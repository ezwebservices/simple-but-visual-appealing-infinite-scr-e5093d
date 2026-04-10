import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface BlooBearProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * BlooBear — Kawaii plush blue bear, the hero NumPal.
 * Wraps the shared CharacterRig with the blue palette + heart belly accent.
 */
export default function BlooBear(props: BlooBearProps) {
  return <CharacterRig palette={PALETTES.bloo} characterId="bloo" {...props} />;
}
