import type { CharacterMood } from '../../types';

interface BlooBearProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * BlooBear — Kawaii plush stuffed bear character.
 *
 * Big round body, stubby plush limbs, visible seam lines, button details.
 * Blue/amber palette. Named limb groups for animation.
 * viewBox 0 0 200 300.
 */
export default function BlooBear({ mood = 'happy', className, isSpeaking }: BlooBearProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="bb-body" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6BB0F0" />
          <stop offset="100%" stopColor="#4A90D9" />
        </radialGradient>
        <radialGradient id="bb-belly" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFE8C0" />
          <stop offset="100%" stopColor="#FFD080" />
        </radialGradient>
        <radialGradient id="bb-head" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7EC8FF" />
          <stop offset="60%" stopColor="#4A90D9" />
          <stop offset="100%" stopColor="#3B78C0" />
        </radialGradient>
      </defs>

      {/* ── LEFT LEG ── stubby plush leg */}
      <g id="left-leg" className="char-left-leg" style={{ transformOrigin: '82px 215px' }}>
        <ellipse cx="82" cy="232" rx="22" ry="18" fill="url(#bb-body)" />
        {/* Paw pad */}
        <ellipse cx="82" cy="244" rx="16" ry="8" fill="#FFD080" opacity="0.5" />
        <circle cx="76" cy="242" r="3.5" fill="#FFD080" opacity="0.4" />
        <circle cx="88" cy="242" r="3.5" fill="#FFD080" opacity="0.4" />
        {/* Plush seam */}
        <path d="M82,216 Q84,232 82,248" fill="none" stroke="#3B78C0" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.3" />
      </g>

      {/* ── RIGHT LEG ── */}
      <g id="right-leg" className="char-right-leg" style={{ transformOrigin: '118px 215px' }}>
        <ellipse cx="118" cy="232" rx="22" ry="18" fill="url(#bb-body)" />
        <ellipse cx="118" cy="244" rx="16" ry="8" fill="#FFD080" opacity="0.5" />
        <circle cx="112" cy="242" r="3.5" fill="#FFD080" opacity="0.4" />
        <circle cx="124" cy="242" r="3.5" fill="#FFD080" opacity="0.4" />
        <path d="M118,216 Q120,232 118,248" fill="none" stroke="#3B78C0" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.3" />
      </g>

      {/* ── TORSO ── big round plush body */}
      <g id="torso" className="char-torso" style={{ transformOrigin: '100px 190px' }}>
        <ellipse cx="100" cy="192" rx="52" ry="44" fill="url(#bb-body)" />
        {/* Belly patch */}
        <ellipse cx="100" cy="198" rx="32" ry="28" fill="url(#bb-belly)" opacity="0.6" />
        {/* Center seam line */}
        <path d="M100,152 Q102,192 100,234" fill="none" stroke="#3B78C0" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.25" />
        {/* Button detail */}
        <circle cx="100" cy="186" r="4" fill="#FFD080" stroke="#D4A040" strokeWidth="0.8" />
        <line x1="98" y1="184" x2="102" y2="188" stroke="#D4A040" strokeWidth="0.6" opacity="0.6" />
        <line x1="102" y1="184" x2="98" y2="188" stroke="#D4A040" strokeWidth="0.6" opacity="0.6" />
      </g>

      {/* ── LEFT ARM ── stubby plush arm */}
      <g id="left-arm" className="char-left-arm" style={{ transformOrigin: '62px 180px' }}>
        <ellipse cx="56" cy="186" rx="16" ry="12" fill="url(#bb-body)" />
        {/* Paw */}
        <circle cx="44" cy="186" r="10" fill="#4A90D9" />
        <ellipse cx="42" cy="190" rx="6" ry="4" fill="#FFD080" opacity="0.5" />
        {/* Seam */}
        <path d="M68,186 Q56,184 42,186" fill="none" stroke="#3B78C0" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT ARM ── */}
      <g id="right-arm" className="char-right-arm" style={{ transformOrigin: '138px 180px' }}>
        <ellipse cx="144" cy="186" rx="16" ry="12" fill="url(#bb-body)" />
        <circle cx="156" cy="186" r="10" fill="#4A90D9" />
        <ellipse cx="158" cy="190" rx="6" ry="4" fill="#FFD080" opacity="0.5" />
        <path d="M132,186 Q144,184 158,186" fill="none" stroke="#3B78C0" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── HEAD ── */}
      <g id="head" className="char-head" style={{ transformOrigin: '100px 100px' }}>
        {/* Round ears */}
        <g className="char-ears">
          <circle cx="48" cy="48" r="24" fill="#4A90D9" />
          <circle cx="48" cy="48" r="14" fill="#FFD080" opacity="0.45" />
          {/* Ear seam */}
          <path d="M36,36 Q48,32 60,36" fill="none" stroke="#3B78C0" strokeWidth="0.7" strokeDasharray="2,2" opacity="0.3" />
          <circle cx="152" cy="48" r="24" fill="#4A90D9" />
          <circle cx="152" cy="48" r="14" fill="#FFD080" opacity="0.45" />
          <path d="M140,36 Q152,32 164,36" fill="none" stroke="#3B78C0" strokeWidth="0.7" strokeDasharray="2,2" opacity="0.3" />
        </g>

        {/* Big round head */}
        <ellipse cx="100" cy="90" rx="62" ry="58" fill="url(#bb-head)" />

        {/* Fluffy highlight */}
        <ellipse cx="85" cy="55" rx="28" ry="14" fill="white" opacity="0.12" />

        {/* Head seam */}
        <path d="M100,34 Q102,60 100,90 Q98,120 100,146" fill="none" stroke="#3B78C0" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.2" />

        {/* Muzzle */}
        <ellipse cx="100" cy="108" rx="22" ry="16" fill="#5EA8E8" opacity="0.5" />

        {/* Nose */}
        <ellipse cx="100" cy="102" rx="6" ry="4.5" fill="#2D1810" />
        <ellipse cx="98" cy="100.5" rx="2" ry="1.5" fill="white" opacity="0.4" />

        {/* Rosy cheeks */}
        <circle cx="62" cy="100" r="10" fill="#FF9999" opacity="0.35" />
        <circle cx="138" cy="100" r="10" fill="#FF9999" opacity="0.35" />

        {/* Eyes */}
        <g className="eyes">
          <BearEyes mood={mood} />
        </g>

        {/* Mouth */}
        <g className="mouth">
          <BearMouth mood={mood} isSpeaking={isSpeaking} />
        </g>
      </g>
    </svg>
  );
}

function BearEyes({ mood }: { mood: CharacterMood }) {
  const lx = 78, rx = 122, baseY = 82;

  const eye = (cx: number, irisY: number, irisR = 12, pupilR = 6) => (
    <g>
      <ellipse cx={cx} cy={baseY} rx="13" ry="14" fill="white" />
      <circle cx={cx} cy={irisY} r={irisR} fill="#FFD080" />
      <circle cx={cx} cy={irisY} r={pupilR} fill="#2D1810" />
      {/* Big anime highlight */}
      <circle cx={cx + 4} cy={irisY - 5} r="4" fill="white" opacity="0.95" />
      {/* Secondary highlight */}
      <circle cx={cx - 2} cy={irisY + 4} r="2" fill="white" opacity="0.6" />
      {/* Tiny sparkle */}
      <circle cx={cx + 6} cy={irisY - 2} r="1.2" fill="white" opacity="0.7" />
    </g>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eye(lx, 81, 13, 5)}
          {eye(rx, 81, 13, 5)}
          {/* Star sparkles */}
          <path d={`M${lx - 16},${70} l2,-5 l2,5 l-4,0 Z`} fill="#FFE66D" />
          <path d={`M${rx + 13},${68} l1.5,-4 l1.5,4 l-3,0 Z`} fill="#FFE66D" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {eye(lx - 2, baseY + 2, 11, 5)}
          {eye(rx + 3, baseY + 2, 11, 5)}
        </>
      );
    case 'encouraging':
      return (
        <>
          {eye(lx, baseY + 1, 12, 6)}
          {eye(rx, baseY + 1, 12, 6)}
          {/* Happy arched brows */}
          <path d={`M${lx - 12},${baseY - 14} Q${lx},${baseY - 20} ${lx + 12},${baseY - 14}`} fill="none" stroke="#3B78C0" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d={`M${rx - 12},${baseY - 14} Q${rx},${baseY - 20} ${rx + 12},${baseY - 14}`} fill="none" stroke="#3B78C0" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eye(lx, 83, 11, 6)}
          {eye(rx, 83, 11, 6)}
          {/* Worried brows */}
          <path d={`M${lx - 10},${baseY - 16} Q${lx},${baseY - 13} ${lx + 10},${baseY - 16}`} fill="none" stroke="#3B78C0" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M${rx - 10},${baseY - 16} Q${rx},${baseY - 19} ${rx + 10},${baseY - 16}`} fill="none" stroke="#3B78C0" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default:
      return (
        <>
          {eye(lx, 81)}
          {eye(rx, 81)}
        </>
      );
  }
}

function BearMouth({ mood, isSpeaking }: { mood: CharacterMood; isSpeaking?: boolean }) {
  const glow = isSpeaking ? 1 : 0;

  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M92,112 Q100,120 108,112" fill="none" stroke="#D4A040" strokeWidth="2.2" strokeLinecap="round" />
          {glow > 0 && <path d="M94,114 Q100,118 106,114" fill="none" stroke="#FFD080" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />}
        </g>
      );
    case 'thinking':
      return <ellipse cx="101" cy="113" rx="3.5" ry="3" fill="#D4A040" opacity="0.6" />;
    case 'encouraging':
      return <path d="M93,112 Q100,118 107,112" fill="none" stroke="#D4A040" strokeWidth="2" strokeLinecap="round" opacity="0.85" />;
    case 'headShake':
      return <path d="M95,113 Q100,111 105,113" fill="none" stroke="#D4A040" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />;
    default:
      return (
        <g>
          <path d="M93,112 Q100,118 107,112" fill="none" stroke="#D4A040" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          {glow > 0 && <path d="M95,113 Q100,116 105,113" fill="none" stroke="#FFD080" strokeWidth="1" strokeLinecap="round" opacity="0.4" />}
        </g>
      );
  }
}
