import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface Props {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

export default function VexBat(props: Props) {
  return <CharacterRig palette={PALETTES.vex} characterId="vex" {...props} />;
}
