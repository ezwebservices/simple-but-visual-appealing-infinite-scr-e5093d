import type { CharacterMood } from '../../types';

interface RosieOwlProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * RosieOwl — Kawaii plush stuffed owl character.
 *
 * Big round body, stubby plush wing-arms, visible seam lines, button details.
 * Purple palette with glasses and ear tufts. Named limb groups for animation.
 * viewBox 0 0 200 300.
 */
export default function RosieOwl({ mood = 'happy', className, isSpeaking }: RosieOwlProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="ro-body" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#B898D8" />
          <stop offset="100%" stopColor="#9878B8" />
        </radialGradient>
        <radialGradient id="ro-chest" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#EDE0F8" />
          <stop offset="100%" stopColor="#D8C0F0" />
        </radialGradient>
        <radialGradient id="ro-head" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#C8A8E8" />
          <stop offset="60%" stopColor="#9878B8" />
          <stop offset="100%" stopColor="#7858A0" />
        </radialGradient>
      </defs>

      {/* ── LEFT LEG ── stubby plush talon */}
      <g id="left-leg" className="char-left-leg" style={{ transformOrigin: '82px 218px' }}>
        <ellipse cx="82" cy="234" rx="20" ry="16" fill="url(#ro-body)" />
        {/* Talon foot */}
        <ellipse cx="75" cy="248" rx="5.5" ry="6" fill="#E8A830" />
        <ellipse cx="84" cy="249" rx="5.5" ry="5.5" fill="#E8A830" />
        <ellipse cx="92" cy="247" rx="5" ry="5.5" fill="#E8A830" />
        <path d="M82,220 Q84,234 82,250" fill="none" stroke="#7858A0" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT LEG ── */}
      <g id="right-leg" className="char-right-leg" style={{ transformOrigin: '118px 218px' }}>
        <ellipse cx="118" cy="234" rx="20" ry="16" fill="url(#ro-body)" />
        <ellipse cx="111" cy="248" rx="5.5" ry="6" fill="#E8A830" />
        <ellipse cx="120" cy="249" rx="5.5" ry="5.5" fill="#E8A830" />
        <ellipse cx="128" cy="247" rx="5" ry="5.5" fill="#E8A830" />
        <path d="M118,220 Q120,234 118,250" fill="none" stroke="#7858A0" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── TORSO ── big round plush body */}
      <g id="torso" className="char-torso" style={{ transformOrigin: '100px 195px' }}>
        <ellipse cx="100" cy="195" rx="52" ry="44" fill="url(#ro-body)" />
        {/* Chest feather pattern — soft scallops */}
        <ellipse cx="100" cy="188" rx="30" ry="20" fill="url(#ro-chest)" opacity="0.6" />
        <ellipse cx="100" cy="208" rx="28" ry="16" fill="url(#ro-chest)" opacity="0.4" />
        {/* Center seam */}
        <path d="M100,155 Q102,195 100,236" fill="none" stroke="#7858A0" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.25" />
        {/* Button */}
        <circle cx="100" cy="200" r="3.5" fill="#D8C0F0" stroke="#9878B8" strokeWidth="0.8" />
        <line x1="98.5" y1="198.5" x2="101.5" y2="201.5" stroke="#9878B8" strokeWidth="0.5" opacity="0.6" />
        <line x1="101.5" y1="198.5" x2="98.5" y2="201.5" stroke="#9878B8" strokeWidth="0.5" opacity="0.6" />
      </g>

      {/* ── LEFT ARM (wing) ── stubby plush wing */}
      <g id="left-arm" className="char-left-arm" style={{ transformOrigin: '60px 188px' }}>
        <ellipse cx="52" cy="190" rx="18" ry="12" fill="url(#ro-body)" />
        {/* Feather tips */}
        <ellipse cx="38" cy="192" rx="8" ry="6" fill="#7858A0" />
        <ellipse cx="42" cy="198" rx="6" ry="5" fill="#7858A0" opacity="0.8" />
        <path d="M66,190 Q52,188 36,190" fill="none" stroke="#7858A0" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT ARM (wing) ── */}
      <g id="right-arm" className="char-right-arm" style={{ transformOrigin: '140px 188px' }}>
        <ellipse cx="148" cy="190" rx="18" ry="12" fill="url(#ro-body)" />
        <ellipse cx="162" cy="192" rx="8" ry="6" fill="#7858A0" />
        <ellipse cx="158" cy="198" rx="6" ry="5" fill="#7858A0" opacity="0.8" />
        <path d="M134,190 Q148,188 164,190" fill="none" stroke="#7858A0" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── HEAD ── */}
      <g id="head" className="char-head" style={{ transformOrigin: '100px 88px' }}>
        {/* Ear tufts */}
        <g className="char-ears">
          <ellipse cx="52" cy="28" rx="8" ry="20" fill="#7858A0" transform="rotate(-20 52 28)" />
          <ellipse cx="148" cy="28" rx="8" ry="20" fill="#7858A0" transform="rotate(20 148 28)" />
        </g>

        {/* Big round head */}
        <ellipse cx="100" cy="88" rx="62" ry="58" fill="url(#ro-head)" />

        {/* Soft highlight */}
        <ellipse cx="82" cy="52" rx="26" ry="12" fill="white" opacity="0.1" />

        {/* Head seam */}
        <path d="M100,32 Q102,60 100,88 Q98,116 100,144" fill="none" stroke="#7858A0" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.2" />

        {/* Facial disc */}
        <ellipse cx="100" cy="82" rx="42" ry="32" fill="#D8C0F0" opacity="0.3" />

        {/* Glasses */}
        <g className="char-accessory">
          <circle cx="78" cy="80" r="18" fill="none" stroke="#5098D8" strokeWidth="2.5" />
          <circle cx="122" cy="80" r="18" fill="none" stroke="#5098D8" strokeWidth="2.5" />
          <line x1="96" y1="80" x2="104" y2="80" stroke="#5098D8" strokeWidth="2.5" />
          {/* Lens tint */}
          <circle cx="78" cy="80" r="16" fill="rgba(80,152,216,0.05)" />
          <circle cx="122" cy="80" r="16" fill="rgba(80,152,216,0.05)" />
        </g>

        {/* Beak */}
        <ellipse cx="100" cy="104" rx="8" ry="6" fill="#E8A830" />
        <ellipse cx="100" cy="102" rx="6" ry="3.5" fill="#F0C050" opacity="0.5" />

        {/* Rosy cheeks */}
        <circle cx="56" cy="96" r="9" fill="#FF99BB" opacity="0.35" />
        <circle cx="144" cy="96" r="9" fill="#FF99BB" opacity="0.35" />

        {/* Eyes */}
        <g className="eyes">
          <OwlEyes mood={mood} />
        </g>

        {/* Mouth */}
        <g className="mouth">
          <OwlMouth mood={mood} isSpeaking={isSpeaking} />
        </g>
      </g>
    </svg>
  );
}

function OwlEyes({ mood }: { mood: CharacterMood }) {
  const lx = 78, rx = 122, baseY = 78;

  const eye = (cx: number, irisY: number, irisR = 11, pupilR = 5) => (
    <g>
      <ellipse cx={cx} cy={baseY} rx="12" ry="13" fill="white" />
      <circle cx={cx} cy={irisY} r={irisR} fill="#B060FF" />
      <circle cx={cx} cy={irisY} r={pupilR} fill="#0E0820" />
      <circle cx={cx + 3.5} cy={irisY - 5} r="3.5" fill="white" opacity="0.95" />
      <circle cx={cx - 2} cy={irisY + 4} r="1.8" fill="white" opacity="0.6" />
      <circle cx={cx + 6} cy={irisY - 1} r="1.2" fill="white" opacity="0.7" />
    </g>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eye(lx, 77, 12, 4.5)}
          {eye(rx, 77, 12, 4.5)}
          <path d={`M${lx - 14},${66} l2,-5 l2,5 l-4,0 Z`} fill="#FFE66D" />
          <path d={`M${rx + 11},${64} l1.5,-4 l1.5,4 l-3,0 Z`} fill="#FFE66D" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {eye(lx + 2, baseY + 2, 10, 4.5)}
          {eye(rx + 2, baseY + 2, 10, 4.5)}
        </>
      );
    case 'encouraging':
      return (
        <>
          {eye(lx, baseY + 1, 11, 5)}
          {eye(rx, baseY + 1, 11, 5)}
          <path d={`M${lx - 11},${baseY - 14} Q${lx},${baseY - 20} ${lx + 11},${baseY - 14}`} fill="none" stroke="#583880" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d={`M${rx - 11},${baseY - 14} Q${rx},${baseY - 20} ${rx + 11},${baseY - 14}`} fill="none" stroke="#583880" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eye(lx, 80, 10, 5)}
          {eye(rx, 80, 10, 5)}
          <path d={`M${lx - 9},${baseY - 14} Q${lx},${baseY - 11} ${lx + 9},${baseY - 14}`} fill="none" stroke="#583880" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M${rx - 9},${baseY - 14} Q${rx},${baseY - 17} ${rx + 9},${baseY - 14}`} fill="none" stroke="#583880" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default:
      return (
        <>
          {eye(lx, 77)}
          {eye(rx, 77)}
        </>
      );
  }
}

function OwlMouth({ mood, isSpeaking }: { mood: CharacterMood; isSpeaking?: boolean }) {
  const glow = isSpeaking ? 1 : 0;
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M94,112 Q100,117 106,112" fill="none" stroke="#B060FF" strokeWidth="2" strokeLinecap="round" />
          {glow > 0 && <path d="M96,114 Q100,116 104,114" fill="none" stroke="#D8A0FF" strokeWidth="1" opacity="0.5" />}
        </g>
      );
    case 'thinking':
      return <ellipse cx="101" cy="113" rx="3" ry="2.5" fill="#B060FF" opacity="0.5" />;
    case 'encouraging':
      return <path d="M94,112 Q100,117 106,112" fill="none" stroke="#B060FF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />;
    case 'headShake':
      return <path d="M96,113 Q100,111 104,113" fill="none" stroke="#B060FF" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />;
    default:
      return (
        <g>
          <path d="M94,112 Q100,117 106,112" fill="none" stroke="#B060FF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          {glow > 0 && <path d="M96,113 Q100,115 104,113" fill="none" stroke="#D8A0FF" strokeWidth="1" opacity="0.4" />}
        </g>
      );
  }
}
