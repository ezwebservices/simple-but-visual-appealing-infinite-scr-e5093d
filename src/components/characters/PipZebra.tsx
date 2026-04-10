import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface PipZebraProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * PipZebra — Plush white-and-grey zebra character with belly stripes.
 */
export default function PipZebra(props: PipZebraProps) {
  return <CharacterRig palette={PALETTES.pip} characterId="pip" {...props} />;
}
