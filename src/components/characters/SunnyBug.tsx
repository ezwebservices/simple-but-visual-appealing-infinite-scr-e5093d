import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface SunnyBugProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * SunnyBug — Scout, Guardian of Patterns. Coral rhino-beetle creature with
 * a hard elytra shell and a horn-stub on the head.
 */
export default function SunnyBug(props: SunnyBugProps) {
  return <CharacterRig palette={PALETTES.sunny} characterId="sunny" {...props} />;
}
