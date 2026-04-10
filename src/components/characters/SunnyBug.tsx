import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface SunnyBugProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * SunnyBug — Cheerful coral ladybug character with black belly spots.
 */
export default function SunnyBug(props: SunnyBugProps) {
  return <CharacterRig palette={PALETTES.sunny} characterId="sunny" {...props} />;
}
