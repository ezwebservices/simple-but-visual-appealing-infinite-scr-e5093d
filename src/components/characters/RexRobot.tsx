import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface RexRobotProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * RexRobot — Inventor, Guardian of Shapes & Geometry. Compact kid-shaped
 * mech with exposed joint wiring, a bent antenna, and an amber-lit chest HUD.
 */
export default function RexRobot(props: RexRobotProps) {
  return <CharacterRig palette={PALETTES.rex} characterId="rex" {...props} />;
}
