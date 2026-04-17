import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface RosieOwlProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * RosieOwl — Strategist, Guardian of Logic & Sorting. Humanoid scholar-kid
 * in an owl-feather cloak with a brass Ledger Lantern.
 */
export default function RosieOwl(props: RosieOwlProps) {
  return <CharacterRig palette={PALETTES.rosie} characterId="rosie" {...props} />;
}
