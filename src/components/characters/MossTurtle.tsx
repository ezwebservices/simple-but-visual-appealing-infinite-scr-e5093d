import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface Props {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

export default function MossTurtle(props: Props) {
  return <CharacterRig palette={PALETTES.moss} characterId="moss" {...props} />;
}
