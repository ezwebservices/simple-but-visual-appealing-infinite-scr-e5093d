import type { CharacterMood } from '../../types';
import CharacterRig, { PALETTES } from './CharacterRig';

interface PipZebraProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * PipZebra — Speedster, Guardian of Sequencing. Humanoid racer kid in a
 * zebra-stripe jacket and visored helmet, ponytail flying out the back.
 */
export default function PipZebra(props: PipZebraProps) {
  return <CharacterRig palette={PALETTES.pip} characterId="pip" {...props} />;
}
