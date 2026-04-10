import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface RosieOwlProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * RosieOwl — Wise plush purple owl character.
 */
export default function RosieOwl(props: RosieOwlProps) {
  return <CharacterRig palette={PALETTES.rosie} characterId="rosie" {...props} />;
}
