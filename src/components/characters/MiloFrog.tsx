import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface MiloFrogProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * MiloFrog — Bouncy plush green frog character.
 */
export default function MiloFrog(props: MiloFrogProps) {
  return <CharacterRig palette={PALETTES.milo} characterId="milo" {...props} />;
}
