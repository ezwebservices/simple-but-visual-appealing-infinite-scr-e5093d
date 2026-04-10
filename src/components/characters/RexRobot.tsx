import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface RexRobotProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * RexRobot — Friendly cyan robot character with antenna and chest panel.
 */
export default function RexRobot(props: RexRobotProps) {
  return <CharacterRig palette={PALETTES.rex} characterId="rex" {...props} />;
}
