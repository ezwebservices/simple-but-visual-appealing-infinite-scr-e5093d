import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface Props {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

export default function GlitchSprite(props: Props) {
  return <CharacterRig palette={PALETTES.glitch} characterId="glitch" {...props} />;
}
