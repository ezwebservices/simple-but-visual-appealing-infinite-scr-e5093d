import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface Props {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

export default function JaxFox(props: Props) {
  return <CharacterRig palette={PALETTES.jax} characterId="jax" {...props} />;
}
