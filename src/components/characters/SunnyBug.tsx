import type { CharacterMood } from '../../types';

interface SunnyBugProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * SunnyBug — Kawaii plush stuffed ladybug character.
 *
 * Big round shell body, stubby plush limbs, visible seam lines, button details.
 * Red/dark palette with shell spots. Named limb groups for animation.
 * viewBox 0 0 200 300.
 */
export default function SunnyBug({ mood = 'happy', className, isSpeaking }: SunnyBugProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="sb-shell" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F07060" />
          <stop offset="100%" stopColor="#E05848" />
        </radialGradient>
        <radialGradient id="sb-head" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#5A6A7C" />
          <stop offset="60%" stopColor="#3A4A5C" />
          <stop offset="100%" stopColor="#2A3848" />
        </radialGradient>
      </defs>

      {/* ── LEFT LEG ── stubby plush leg */}
      <g id="left-leg" className="char-left-leg" style={{ transformOrigin: '82px 218px' }}>
        <ellipse cx="82" cy="234" rx="20" ry="16" fill="url(#sb-shell)" />
        {/* Shoe */}
        <ellipse cx="82" cy="248" rx="16" ry="7" fill="#2A2A38" />
        {/* Seam */}
        <path d="M82,220 Q84,234 82,250" fill="none" stroke="#C83830" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.3" />
      </g>

      {/* ── RIGHT LEG ── */}
      <g id="right-leg" className="char-right-leg" style={{ transformOrigin: '118px 218px' }}>
        <ellipse cx="118" cy="234" rx="20" ry="16" fill="url(#sb-shell)" />
        <ellipse cx="118" cy="248" rx="16" ry="7" fill="#2A2A38" />
        <path d="M118,220 Q120,234 118,250" fill="none" stroke="#C83830" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.3" />
      </g>

      {/* ── TORSO ── big round shell dome */}
      <g id="torso" className="char-torso" style={{ transformOrigin: '100px 195px' }}>
        <ellipse cx="100" cy="195" rx="54" ry="44" fill="url(#sb-shell)" />
        {/* Center ridge seam */}
        <line x1="100" y1="155" x2="100" y2="236" stroke="#C83830" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4,3" opacity="0.35" />
        {/* Spots */}
        <circle cx="78" cy="180" r="9" fill="#2A2A38" opacity="0.55" />
        <circle cx="122" cy="180" r="9" fill="#2A2A38" opacity="0.55" />
        <circle cx="76" cy="208" r="8" fill="#2A2A38" opacity="0.5" />
        <circle cx="124" cy="208" r="8" fill="#2A2A38" opacity="0.5" />
        {/* Button detail */}
        <circle cx="100" cy="195" r="4" fill="#2A2A38" stroke="#1A1A28" strokeWidth="0.8" />
        <line x1="98" y1="193" x2="102" y2="197" stroke="#1A1A28" strokeWidth="0.6" opacity="0.6" />
        <line x1="102" y1="193" x2="98" y2="197" stroke="#1A1A28" strokeWidth="0.6" opacity="0.6" />
      </g>

      {/* ── LEFT ARM ── stubby plush arm */}
      <g id="left-arm" className="char-left-arm" style={{ transformOrigin: '58px 188px' }}>
        <ellipse cx="50" cy="192" rx="16" ry="10" fill="url(#sb-shell)" />
        {/* Mitten hand */}
        <circle cx="38" cy="192" r="9" fill="#2A2A38" />
        <path d="M62,192 Q50,190 36,192" fill="none" stroke="#C83830" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT ARM ── */}
      <g id="right-arm" className="char-right-arm" style={{ transformOrigin: '142px 188px' }}>
        <ellipse cx="150" cy="192" rx="16" ry="10" fill="url(#sb-shell)" />
        <circle cx="162" cy="192" r="9" fill="#2A2A38" />
        <path d="M138,192 Q150,190 164,192" fill="none" stroke="#C83830" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── HEAD ── */}
      <g id="head" className="char-head" style={{ transformOrigin: '100px 88px' }}>
        {/* Antennae */}
        <g className="char-accessory">
          <line x1="78" y1="42" x2="62" y2="14" stroke="#2A2A38" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="12" r="6" fill="#2A2A38" />
          <circle cx="60" cy="12" r="3.5" fill="#E05848" opacity="0.6" />
          <line x1="122" y1="42" x2="138" y2="14" stroke="#2A2A38" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="140" cy="12" r="6" fill="#2A2A38" />
          <circle cx="140" cy="12" r="3.5" fill="#E05848" opacity="0.6" />
        </g>

        {/* Big round head */}
        <ellipse cx="100" cy="88" rx="58" ry="54" fill="url(#sb-head)" />

        {/* Soft highlight */}
        <ellipse cx="82" cy="55" rx="24" ry="11" fill="white" opacity="0.08" />

        {/* Head seam */}
        <path d="M100,36 Q102,60 100,88 Q98,116 100,140" fill="none" stroke="#2A3848" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.2" />

        {/* Rosy cheeks */}
        <circle cx="60" cy="98" r="9" fill="#E05848" opacity="0.4" />
        <circle cx="140" cy="98" r="9" fill="#E05848" opacity="0.4" />

        {/* Eyes */}
        <g className="eyes">
          <BugEyes mood={mood} />
        </g>

        {/* Mouth */}
        <g className="mouth">
          <BugMouth mood={mood} isSpeaking={isSpeaking} />
        </g>
      </g>
    </svg>
  );
}

function BugEyes({ mood }: { mood: CharacterMood }) {
  const lx = 80, rx = 120, baseY = 78;

  const eye = (cx: number, irisY: number, irisR = 11, pupilR = 5) => (
    <g>
      <ellipse cx={cx} cy={baseY} rx="13" ry="14" fill="white" />
      <circle cx={cx} cy={irisY} r={irisR} fill="#FF6050" />
      <circle cx={cx} cy={irisY} r={pupilR} fill="#1A0808" />
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
          <path d={`M${lx - 11},${baseY - 14} Q${lx},${baseY - 20} ${lx + 11},${baseY - 14}`} fill="none" stroke="#3A4A5C" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d={`M${rx - 11},${baseY - 14} Q${rx},${baseY - 20} ${rx + 11},${baseY - 14}`} fill="none" stroke="#3A4A5C" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eye(lx, 80, 10, 5)}
          {eye(rx, 80, 10, 5)}
          <path d={`M${lx - 9},${baseY - 14} Q${lx},${baseY - 11} ${lx + 9},${baseY - 14}`} fill="none" stroke="#3A4A5C" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M${rx - 9},${baseY - 14} Q${rx},${baseY - 17} ${rx + 9},${baseY - 14}`} fill="none" stroke="#3A4A5C" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
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

function BugMouth({ mood, isSpeaking }: { mood: CharacterMood; isSpeaking?: boolean }) {
  const glow = isSpeaking ? 1 : 0;
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M92,108 Q100,115 108,108" fill="none" stroke="#FF4040" strokeWidth="2.2" strokeLinecap="round" />
          {glow > 0 && <path d="M94,110 Q100,113 106,110" fill="none" stroke="#FF8080" strokeWidth="1.2" opacity="0.5" />}
        </g>
      );
    case 'thinking':
      return <ellipse cx="101" cy="109" rx="3.5" ry="2.8" fill="#FF4040" opacity="0.5" />;
    case 'encouraging':
      return <path d="M93,108 Q100,113 107,108" fill="none" stroke="#FF4040" strokeWidth="2" strokeLinecap="round" opacity="0.8" />;
    case 'headShake':
      return <path d="M96,109 Q100,107 104,109" fill="none" stroke="#FF4040" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />;
    default:
      return (
        <g>
          <path d="M92,108 Q100,114 108,108" fill="none" stroke="#FF4040" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
          {glow > 0 && <path d="M95,110 Q100,112 105,110" fill="none" stroke="#FF8080" strokeWidth="1" opacity="0.4" />}
        </g>
      );
  }
}
