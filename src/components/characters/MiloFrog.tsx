import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface MiloFrogProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * MiloFrog — Athlete, Guardian of Measurement. Bipedal frog in an athletic
 * tank with sweatband, taped fingers, and hot-pink-laced Leap-Meter Sneakers.
 */
export default function MiloFrog(props: MiloFrogProps) {
  return <CharacterRig palette={PALETTES.milo} characterId="milo" {...props} />;
}
