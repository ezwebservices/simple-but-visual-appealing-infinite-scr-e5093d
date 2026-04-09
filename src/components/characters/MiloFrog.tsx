import type { CharacterMood } from '../../types';

interface MiloFrogProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * MiloFrog — Kawaii plush stuffed frog character.
 *
 * Big round body, stubby plush limbs, visible seam lines, button details.
 * Green palette with bulging eyes. Named limb groups for animation.
 * viewBox 0 0 200 300.
 */
export default function MiloFrog({ mood = 'happy', className, isSpeaking }: MiloFrogProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="mf-body" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6DE898" />
          <stop offset="100%" stopColor="#48C878" />
        </radialGradient>
        <radialGradient id="mf-belly" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#EAFFF2" />
          <stop offset="100%" stopColor="#D8F8E8" />
        </radialGradient>
        <radialGradient id="mf-head" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#78F0A8" />
          <stop offset="60%" stopColor="#48C878" />
          <stop offset="100%" stopColor="#30B060" />
        </radialGradient>
      </defs>

      {/* ── LEFT LEG ── stubby plush leg */}
      <g id="left-leg" className="char-left-leg" style={{ transformOrigin: '82px 215px' }}>
        <ellipse cx="82" cy="230" rx="22" ry="16" fill="url(#mf-body)" />
        {/* Webbed foot */}
        <ellipse cx="82" cy="244" rx="18" ry="7" fill="#30B060" />
        <ellipse cx="74" cy="248" rx="5" ry="5" fill="#30B060" />
        <ellipse cx="90" cy="248" rx="5" ry="5" fill="#30B060" />
        <path d="M82,216 Q84,230 82,248" fill="none" stroke="#208848" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT LEG ── */}
      <g id="right-leg" className="char-right-leg" style={{ transformOrigin: '118px 215px' }}>
        <ellipse cx="118" cy="230" rx="22" ry="16" fill="url(#mf-body)" />
        <ellipse cx="118" cy="244" rx="18" ry="7" fill="#30B060" />
        <ellipse cx="110" cy="248" rx="5" ry="5" fill="#30B060" />
        <ellipse cx="126" cy="248" rx="5" ry="5" fill="#30B060" />
        <path d="M118,216 Q120,230 118,248" fill="none" stroke="#208848" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── TORSO ── big round plush body */}
      <g id="torso" className="char-torso" style={{ transformOrigin: '100px 190px' }}>
        <ellipse cx="100" cy="192" rx="52" ry="44" fill="url(#mf-body)" />
        {/* Belly */}
        <ellipse cx="100" cy="198" rx="34" ry="30" fill="url(#mf-belly)" opacity="0.55" />
        {/* Center seam */}
        <path d="M100,152 Q102,192 100,234" fill="none" stroke="#208848" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.25" />
        {/* Button */}
        <circle cx="100" cy="190" r="4" fill="#D8F8E8" stroke="#48C878" strokeWidth="0.8" />
        <line x1="98" y1="188" x2="102" y2="192" stroke="#48C878" strokeWidth="0.6" opacity="0.6" />
        <line x1="102" y1="188" x2="98" y2="192" stroke="#48C878" strokeWidth="0.6" opacity="0.6" />
      </g>

      {/* ── LEFT ARM ── stubby plush arm */}
      <g id="left-arm" className="char-left-arm" style={{ transformOrigin: '60px 185px' }}>
        <ellipse cx="52" cy="188" rx="16" ry="11" fill="url(#mf-body)" />
        {/* Webbed hand */}
        <circle cx="40" cy="188" r="10" fill="#48C878" />
        <ellipse cx="34" cy="184" rx="4" ry="5" fill="#30B060" opacity="0.7" />
        <ellipse cx="32" cy="190" rx="4" ry="4.5" fill="#30B060" opacity="0.7" />
        <ellipse cx="36" cy="196" rx="4" ry="4.5" fill="#30B060" opacity="0.7" />
        <path d="M64,188 Q52,186 38,188" fill="none" stroke="#208848" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT ARM ── */}
      <g id="right-arm" className="char-right-arm" style={{ transformOrigin: '140px 185px' }}>
        <ellipse cx="148" cy="188" rx="16" ry="11" fill="url(#mf-body)" />
        <circle cx="160" cy="188" r="10" fill="#48C878" />
        <ellipse cx="166" cy="184" rx="4" ry="5" fill="#30B060" opacity="0.7" />
        <ellipse cx="168" cy="190" rx="4" ry="4.5" fill="#30B060" opacity="0.7" />
        <ellipse cx="164" cy="196" rx="4" ry="4.5" fill="#30B060" opacity="0.7" />
        <path d="M136,188 Q148,186 162,188" fill="none" stroke="#208848" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── HEAD ── wide frog head */}
      <g id="head" className="char-head" style={{ transformOrigin: '100px 95px' }}>
        {/* Bulging eye domes (act as "ears" for frog) */}
        <g className="char-ears">
          <circle cx="60" cy="42" r="22" fill="url(#mf-head)" />
          <circle cx="140" cy="42" r="22" fill="url(#mf-head)" />
        </g>

        {/* Big round head */}
        <ellipse cx="100" cy="88" rx="65" ry="55" fill="url(#mf-head)" />

        {/* Soft highlight */}
        <ellipse cx="82" cy="55" rx="26" ry="12" fill="white" opacity="0.1" />

        {/* Head seam */}
        <path d="M100,35 Q102,60 100,88 Q98,116 100,142" fill="none" stroke="#208848" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.2" />

        {/* Rosy cheeks */}
        <circle cx="58" cy="98" r="10" fill="#FF9966" opacity="0.3" />
        <circle cx="142" cy="98" r="10" fill="#FF9966" opacity="0.3" />

        {/* Nostrils */}
        <ellipse cx="92" cy="100" rx="2.5" ry="2" fill="#208848" />
        <ellipse cx="108" cy="100" rx="2.5" ry="2" fill="#208848" />

        {/* Eyes */}
        <g className="eyes">
          <FrogEyes mood={mood} />
        </g>

        {/* Mouth */}
        <g className="mouth">
          <FrogMouth mood={mood} isSpeaking={isSpeaking} />
        </g>
      </g>
    </svg>
  );
}

function FrogEyes({ mood }: { mood: CharacterMood }) {
  const lx = 68, rx = 132, baseY = 50;

  const eye = (cx: number, irisY: number, irisR = 13, pupilR = 5.5) => (
    <g>
      <ellipse cx={cx} cy={baseY} rx="15" ry="16" fill="white" />
      <circle cx={cx} cy={irisY} r={irisR} fill="#40E060" />
      <circle cx={cx} cy={irisY} r={pupilR} fill="#082010" />
      <circle cx={cx + 4} cy={irisY - 6} r="4.5" fill="white" opacity="0.95" />
      <circle cx={cx - 2} cy={irisY + 5} r="2" fill="white" opacity="0.6" />
      <circle cx={cx + 7} cy={irisY - 2} r="1.3" fill="white" opacity="0.7" />
    </g>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eye(lx, 49, 14, 5)}
          {eye(rx, 49, 14, 5)}
          <path d={`M${lx - 17},${37} l2,-5 l2,5 l-4,0 Z`} fill="#FFE66D" />
          <path d={`M${rx + 14},${35} l1.5,-4 l1.5,4 l-3,0 Z`} fill="#FFE66D" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {eye(lx + 3, baseY + 2, 12, 5)}
          {eye(rx + 3, baseY + 2, 12, 5)}
        </>
      );
    case 'encouraging':
      return (
        <>
          {eye(lx, baseY + 1, 13, 5.5)}
          {eye(rx, baseY + 1, 13, 5.5)}
          <path d={`M${lx - 13},${baseY - 16} Q${lx},${baseY - 22} ${lx + 13},${baseY - 16}`} fill="none" stroke="#208848" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d={`M${rx - 13},${baseY - 16} Q${rx},${baseY - 22} ${rx + 13},${baseY - 16}`} fill="none" stroke="#208848" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eye(lx, 52, 12, 5.5)}
          {eye(rx, 52, 12, 5.5)}
          <path d={`M${lx - 10},${baseY - 14} Q${lx},${baseY - 11} ${lx + 10},${baseY - 14}`} fill="none" stroke="#208848" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M${rx - 10},${baseY - 14} Q${rx},${baseY - 17} ${rx + 10},${baseY - 14}`} fill="none" stroke="#208848" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default:
      return (
        <>
          {eye(lx, 49)}
          {eye(rx, 49)}
        </>
      );
  }
}

function FrogMouth({ mood, isSpeaking }: { mood: CharacterMood; isSpeaking?: boolean }) {
  const glow = isSpeaking ? 1 : 0;
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M80,108 Q100,120 120,108" fill="none" stroke="#30B060" strokeWidth="2.5" strokeLinecap="round" />
          {glow > 0 && <path d="M84,110 Q100,117 116,110" fill="none" stroke="#80FFA0" strokeWidth="1.2" opacity="0.5" />}
        </g>
      );
    case 'thinking':
      return <ellipse cx="101" cy="109" rx="4" ry="3" fill="#30B060" opacity="0.5" />;
    case 'encouraging':
      return <path d="M84,107 Q100,115 116,107" fill="none" stroke="#30B060" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />;
    case 'headShake':
      return <path d="M92,109 Q100,107 108,109" fill="none" stroke="#30B060" strokeWidth="2" strokeLinecap="round" opacity="0.5" />;
    default:
      return (
        <g>
          <path d="M82,108 Q100,117 118,108" fill="none" stroke="#30B060" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
          {glow > 0 && <path d="M86,110 Q100,115 114,110" fill="none" stroke="#80FFA0" strokeWidth="1" opacity="0.4" />}
        </g>
      );
  }
}
