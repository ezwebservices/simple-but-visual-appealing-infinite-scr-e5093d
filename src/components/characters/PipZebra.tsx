import type { CharacterMood } from '../../types';

interface PipZebraProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * PipZebra — Kawaii plush stuffed zebra character.
 *
 * Big round body, stubby plush limbs, visible seam lines, button details.
 * White/silver palette with rainbow stripes. Named limb groups for animation.
 * viewBox 0 0 200 300.
 */
export default function PipZebra({ mood = 'happy', className, isSpeaking }: PipZebraProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="pz-body" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F4F6FA" />
          <stop offset="100%" stopColor="#E0E6EE" />
        </radialGradient>
        <radialGradient id="pz-head" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FAFCFF" />
          <stop offset="60%" stopColor="#E8ECF0" />
          <stop offset="100%" stopColor="#D0D8E0" />
        </radialGradient>
      </defs>

      {/* ── LEFT LEG ── stubby plush leg */}
      <g id="left-leg" className="char-left-leg" style={{ transformOrigin: '82px 215px' }}>
        <ellipse cx="82" cy="230" rx="22" ry="16" fill="url(#pz-body)" />
        {/* Rainbow stripe */}
        <ellipse cx="82" cy="226" rx="16" ry="3" fill="#FFB6C1" opacity="0.5" />
        <ellipse cx="82" cy="234" rx="16" ry="3" fill="#87CEEB" opacity="0.5" />
        {/* Hoof */}
        <ellipse cx="82" cy="244" rx="16" ry="6" fill="#505860" />
        <path d="M82,216 Q84,230 82,246" fill="none" stroke="#B0BCC8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT LEG ── */}
      <g id="right-leg" className="char-right-leg" style={{ transformOrigin: '118px 215px' }}>
        <ellipse cx="118" cy="230" rx="22" ry="16" fill="url(#pz-body)" />
        <ellipse cx="118" cy="226" rx="16" ry="3" fill="#B8A9C9" opacity="0.5" />
        <ellipse cx="118" cy="234" rx="16" ry="3" fill="#A8E6CF" opacity="0.5" />
        <ellipse cx="118" cy="244" rx="16" ry="6" fill="#505860" />
        <path d="M118,216 Q120,230 118,246" fill="none" stroke="#B0BCC8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── TORSO ── big round plush body */}
      <g id="torso" className="char-torso" style={{ transformOrigin: '100px 190px' }}>
        <ellipse cx="100" cy="192" rx="52" ry="42" fill="url(#pz-body)" />
        {/* Rainbow stripes on body */}
        <ellipse cx="100" cy="174" rx="44" ry="3.5" fill="#FFB6C1" opacity="0.45" />
        <ellipse cx="100" cy="183" rx="48" ry="3.5" fill="#87CEEB" opacity="0.45" />
        <ellipse cx="100" cy="192" rx="50" ry="3.5" fill="#A8E6CF" opacity="0.45" />
        <ellipse cx="100" cy="201" rx="48" ry="3.5" fill="#B8A9C9" opacity="0.45" />
        <ellipse cx="100" cy="210" rx="44" ry="3.5" fill="#FFE66D" opacity="0.45" />
        {/* Center seam */}
        <path d="M100,154 Q102,192 100,232" fill="none" stroke="#B0BCC8" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.25" />
        {/* Button */}
        <circle cx="100" cy="192" r="3.5" fill="#FFB6C1" stroke="#D09AA8" strokeWidth="0.8" />
        <line x1="98.5" y1="190.5" x2="101.5" y2="193.5" stroke="#D09AA8" strokeWidth="0.5" opacity="0.6" />
        <line x1="101.5" y1="190.5" x2="98.5" y2="193.5" stroke="#D09AA8" strokeWidth="0.5" opacity="0.6" />
      </g>

      {/* ── LEFT ARM ── stubby plush arm */}
      <g id="left-arm" className="char-left-arm" style={{ transformOrigin: '62px 182px' }}>
        <ellipse cx="54" cy="186" rx="16" ry="11" fill="url(#pz-body)" />
        <ellipse cx="48" cy="186" rx="8" ry="3" fill="#FFB6C1" opacity="0.4" />
        {/* Hoof hand */}
        <ellipse cx="42" cy="186" rx="8" ry="7" fill="#505860" />
        <path d="M66,186 Q54,184 40,186" fill="none" stroke="#B0BCC8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT ARM ── */}
      <g id="right-arm" className="char-right-arm" style={{ transformOrigin: '138px 182px' }}>
        <ellipse cx="146" cy="186" rx="16" ry="11" fill="url(#pz-body)" />
        <ellipse cx="152" cy="186" rx="8" ry="3" fill="#A8E6CF" opacity="0.4" />
        <ellipse cx="158" cy="186" rx="8" ry="7" fill="#505860" />
        <path d="M134,186 Q146,184 160,186" fill="none" stroke="#B0BCC8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── HEAD ── */}
      <g id="head" className="char-head" style={{ transformOrigin: '100px 88px' }}>
        {/* Pointy ears */}
        <g className="char-ears">
          <ellipse cx="58" cy="28" rx="10" ry="22" fill="#E8ECF0" transform="rotate(-15 58 28)" />
          <ellipse cx="58" cy="28" rx="5" ry="14" fill="#FFD0D8" opacity="0.5" transform="rotate(-15 58 28)" />
          <ellipse cx="142" cy="28" rx="10" ry="22" fill="#E8ECF0" transform="rotate(15 142 28)" />
          <ellipse cx="142" cy="28" rx="5" ry="14" fill="#FFD0D8" opacity="0.5" transform="rotate(15 142 28)" />
        </g>

        {/* Big round head */}
        <ellipse cx="100" cy="88" rx="60" ry="56" fill="url(#pz-head)" />

        {/* Soft highlight */}
        <ellipse cx="84" cy="52" rx="26" ry="12" fill="white" opacity="0.15" />

        {/* Head seam */}
        <path d="M100,34 Q102,60 100,88 Q98,116 100,142" fill="none" stroke="#B0BCC8" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.2" />

        {/* Rainbow face stripes */}
        <ellipse cx="76" cy="62" rx="18" ry="3" fill="#FFB6C1" opacity="0.4" transform="rotate(-5 76 62)" />
        <ellipse cx="124" cy="62" rx="18" ry="3" fill="#87CEEB" opacity="0.4" transform="rotate(5 124 62)" />
        <ellipse cx="78" cy="72" rx="16" ry="2.5" fill="#A8E6CF" opacity="0.35" transform="rotate(-5 78 72)" />
        <ellipse cx="122" cy="72" rx="16" ry="2.5" fill="#B8A9C9" opacity="0.35" transform="rotate(5 122 72)" />

        {/* Muzzle */}
        <ellipse cx="100" cy="106" rx="20" ry="14" fill="#D8DDE4" opacity="0.5" />

        {/* Nostrils */}
        <ellipse cx="93" cy="106" rx="2.5" ry="2" fill="#707880" />
        <ellipse cx="107" cy="106" rx="2.5" ry="2" fill="#707880" />

        {/* Rosy cheeks */}
        <circle cx="62" cy="96" r="9" fill="#FFB6C1" opacity="0.3" />
        <circle cx="138" cy="96" r="9" fill="#87CEEB" opacity="0.3" />

        {/* Eyes */}
        <g className="eyes">
          <ZebraEyes mood={mood} />
        </g>

        {/* Mouth */}
        <g className="mouth">
          <ZebraMouth mood={mood} isSpeaking={isSpeaking} />
        </g>
      </g>
    </svg>
  );
}

function ZebraEyes({ mood }: { mood: CharacterMood }) {
  const lx = 80, rx = 120, baseY = 80;

  const eye = (cx: number, irisY: number, irisR = 11, pupilR = 5) => (
    <g>
      <ellipse cx={cx} cy={baseY} rx="12" ry="13" fill="white" />
      <circle cx={cx} cy={irisY} r={irisR} fill="#E8A840" />
      <circle cx={cx} cy={irisY} r={pupilR} fill="#1A1420" />
      <circle cx={cx + 3.5} cy={irisY - 5} r="3.5" fill="white" opacity="0.95" />
      <circle cx={cx - 2} cy={irisY + 4} r="1.8" fill="white" opacity="0.6" />
      <circle cx={cx + 6} cy={irisY - 1} r="1.2" fill="white" opacity="0.7" />
    </g>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eye(lx, 79, 12, 4.5)}
          {eye(rx, 79, 12, 4.5)}
          <path d={`M${lx - 14},${68} l2,-5 l2,5 l-4,0 Z`} fill="#FFE66D" />
          <path d={`M${rx + 11},${66} l1.5,-4 l1.5,4 l-3,0 Z`} fill="#FFE66D" opacity="0.8" />
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
          <path d={`M${lx - 11},${baseY - 14} Q${lx},${baseY - 20} ${lx + 11},${baseY - 14}`} fill="none" stroke="#B0BCC8" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d={`M${rx - 11},${baseY - 14} Q${rx},${baseY - 20} ${rx + 11},${baseY - 14}`} fill="none" stroke="#B0BCC8" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eye(lx, 82, 10, 5)}
          {eye(rx, 82, 10, 5)}
          <path d={`M${lx - 9},${baseY - 14} Q${lx},${baseY - 11} ${lx + 9},${baseY - 14}`} fill="none" stroke="#B0BCC8" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M${rx - 9},${baseY - 14} Q${rx},${baseY - 17} ${rx + 9},${baseY - 14}`} fill="none" stroke="#B0BCC8" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default:
      return (
        <>
          {eye(lx, 79)}
          {eye(rx, 79)}
        </>
      );
  }
}

function ZebraMouth({ mood, isSpeaking }: { mood: CharacterMood; isSpeaking?: boolean }) {
  const glow = isSpeaking ? 1 : 0;
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M92,114 Q100,120 108,114" fill="none" stroke="#E8A840" strokeWidth="2" strokeLinecap="round" />
          {glow > 0 && <path d="M94,116 Q100,119 106,116" fill="none" stroke="#FFE080" strokeWidth="1" opacity="0.5" />}
        </g>
      );
    case 'thinking':
      return <ellipse cx="101" cy="115" rx="3" ry="2.5" fill="#E8A840" opacity="0.5" />;
    case 'encouraging':
      return <path d="M93,114 Q100,119 107,114" fill="none" stroke="#E8A840" strokeWidth="2" strokeLinecap="round" opacity="0.8" />;
    case 'headShake':
      return <path d="M96,115 Q100,113 104,115" fill="none" stroke="#E8A840" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />;
    default:
      return (
        <g>
          <path d="M92,114 Q100,120 108,114" fill="none" stroke="#E8A840" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          {glow > 0 && <path d="M95,116 Q100,118 105,116" fill="none" stroke="#FFE080" strokeWidth="1" opacity="0.4" />}
        </g>
      );
  }
}
