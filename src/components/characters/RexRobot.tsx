import type { CharacterMood } from '../../types';

interface RexRobotProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * RexRobot — Kawaii plush stuffed dino character.
 *
 * Big round body, stubby plush limbs, visible seam lines, button details.
 * Cyan/teal palette with small horns. Named limb groups for animation.
 * viewBox 0 0 200 300.
 */
export default function RexRobot({ mood = 'happy', className, isSpeaking }: RexRobotProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="rx-body" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#88E8F8" />
          <stop offset="100%" stopColor="#60D0E8" />
        </radialGradient>
        <radialGradient id="rx-belly" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#D8FCFF" />
          <stop offset="100%" stopColor="#B0F4FF" />
        </radialGradient>
        <radialGradient id="rx-head" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#98F0FF" />
          <stop offset="60%" stopColor="#60D0E8" />
          <stop offset="100%" stopColor="#40B0C8" />
        </radialGradient>
      </defs>

      {/* ── LEFT LEG ── stubby plush leg */}
      <g id="left-leg" className="char-left-leg" style={{ transformOrigin: '82px 218px' }}>
        <ellipse cx="82" cy="234" rx="22" ry="18" fill="url(#rx-body)" />
        {/* Three-toed foot */}
        <ellipse cx="76" cy="250" rx="6" ry="6" fill="#40B0C8" />
        <ellipse cx="86" cy="251" rx="6" ry="5.5" fill="#40B0C8" />
        <ellipse cx="68" cy="248" rx="5" ry="5.5" fill="#40B0C8" />
        <path d="M82,218 Q84,234 82,252" fill="none" stroke="#2090A8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT LEG ── */}
      <g id="right-leg" className="char-right-leg" style={{ transformOrigin: '118px 218px' }}>
        <ellipse cx="118" cy="234" rx="22" ry="18" fill="url(#rx-body)" />
        <ellipse cx="124" cy="250" rx="6" ry="6" fill="#40B0C8" />
        <ellipse cx="114" cy="251" rx="6" ry="5.5" fill="#40B0C8" />
        <ellipse cx="132" cy="248" rx="5" ry="5.5" fill="#40B0C8" />
        <path d="M118,218 Q120,234 118,252" fill="none" stroke="#2090A8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── TORSO ── big round plush body */}
      <g id="torso" className="char-torso" style={{ transformOrigin: '100px 195px' }}>
        <ellipse cx="100" cy="195" rx="52" ry="44" fill="url(#rx-body)" />
        {/* Belly */}
        <ellipse cx="100" cy="202" rx="34" ry="30" fill="url(#rx-belly)" opacity="0.5" />
        {/* Center seam */}
        <path d="M100,155 Q102,195 100,236" fill="none" stroke="#2090A8" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.25" />
        {/* Button */}
        <circle cx="100" cy="195" r="4" fill="#B0F4FF" stroke="#60D0E8" strokeWidth="0.8" />
        <line x1="98" y1="193" x2="102" y2="197" stroke="#60D0E8" strokeWidth="0.6" opacity="0.6" />
        <line x1="102" y1="193" x2="98" y2="197" stroke="#60D0E8" strokeWidth="0.6" opacity="0.6" />
      </g>

      {/* ── LEFT ARM ── stubby plush dino arm */}
      <g id="left-arm" className="char-left-arm" style={{ transformOrigin: '60px 188px' }}>
        <ellipse cx="54" cy="192" rx="14" ry="10" fill="url(#rx-body)" />
        {/* Claw hand */}
        <circle cx="44" cy="192" r="9" fill="#60D0E8" />
        <ellipse cx="38" cy="188" rx="3.5" ry="5" fill="#40B0C8" opacity="0.7" />
        <ellipse cx="36" cy="194" rx="3.5" ry="4.5" fill="#40B0C8" opacity="0.7" />
        <ellipse cx="40" cy="200" rx="3.5" ry="4.5" fill="#40B0C8" opacity="0.7" />
        <path d="M64,192 Q54,190 42,192" fill="none" stroke="#2090A8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── RIGHT ARM ── */}
      <g id="right-arm" className="char-right-arm" style={{ transformOrigin: '140px 188px' }}>
        <ellipse cx="146" cy="192" rx="14" ry="10" fill="url(#rx-body)" />
        <circle cx="156" cy="192" r="9" fill="#60D0E8" />
        <ellipse cx="162" cy="188" rx="3.5" ry="5" fill="#40B0C8" opacity="0.7" />
        <ellipse cx="164" cy="194" rx="3.5" ry="4.5" fill="#40B0C8" opacity="0.7" />
        <ellipse cx="160" cy="200" rx="3.5" ry="4.5" fill="#40B0C8" opacity="0.7" />
        <path d="M136,192 Q146,190 158,192" fill="none" stroke="#2090A8" strokeWidth="0.7" strokeDasharray="2,3" opacity="0.25" />
      </g>

      {/* ── HEAD ── */}
      <g id="head" className="char-head" style={{ transformOrigin: '100px 90px' }}>
        {/* Small horns/spikes */}
        <g className="char-accessory">
          <ellipse cx="78" cy="20" rx="6" ry="14" fill="#40B0C8" transform="rotate(-10 78 20)" />
          <ellipse cx="100" cy="14" rx="5" ry="12" fill="#40B0C8" />
          <ellipse cx="122" cy="20" rx="6" ry="14" fill="#40B0C8" transform="rotate(10 122 20)" />
        </g>

        {/* Big round head */}
        <ellipse cx="100" cy="88" rx="62" ry="56" fill="url(#rx-head)" />

        {/* Soft highlight */}
        <ellipse cx="82" cy="52" rx="26" ry="12" fill="white" opacity="0.12" />

        {/* Head seam */}
        <path d="M100,34 Q102,60 100,88 Q98,116 100,142" fill="none" stroke="#2090A8" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.2" />

        {/* Snout */}
        <ellipse cx="100" cy="106" rx="22" ry="15" fill="#50C0D8" opacity="0.5" />

        {/* Nostrils */}
        <ellipse cx="92" cy="103" rx="2.5" ry="2" fill="#2090A8" />
        <ellipse cx="108" cy="103" rx="2.5" ry="2" fill="#2090A8" />

        {/* Rosy cheeks */}
        <circle cx="60" cy="96" r="10" fill="#FF9999" opacity="0.3" />
        <circle cx="140" cy="96" r="10" fill="#FF9999" opacity="0.3" />

        {/* Eyes */}
        <g className="eyes">
          <RexEyes mood={mood} />
        </g>

        {/* Mouth */}
        <g className="mouth">
          <RexMouth mood={mood} isSpeaking={isSpeaking} />
        </g>
      </g>
    </svg>
  );
}

function RexEyes({ mood }: { mood: CharacterMood }) {
  const lx = 78, rx = 122, baseY = 78;

  const eye = (cx: number, irisY: number, irisR = 13, pupilR = 5) => (
    <g>
      <ellipse cx={cx} cy={baseY} rx="13" ry="14" fill="#F0FAFF" />
      <circle cx={cx} cy={irisY} r={irisR} fill="#40D0E8" />
      <circle cx={cx} cy={irisY} r={pupilR} fill="#1A4858" />
      <circle cx={cx + 3} cy={irisY - 3} r="3.5" fill="white" opacity="0.9" />
    </g>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eye(lx, 77, 14, 4.5)}
          {eye(rx, 77, 14, 4.5)}
          <path d={`M${lx - 16},${66} l2,-5 l2,5 l-4,0 Z`} fill="#80EFFF" />
          <path d={`M${rx + 13},${64} l1.5,-4 l1.5,4 l-3,0 Z`} fill="#80EFFF" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {eye(lx - 2, baseY + 2, 12, 4.5)}
          {eye(rx + 2, baseY + 2, 12, 4.5)}
        </>
      );
    case 'encouraging':
      return (
        <>
          {eye(lx, baseY + 1, 13, 5)}
          {eye(rx, baseY + 1, 13, 5)}
          <path d={`M${lx - 12},${baseY - 14} Q${lx},${baseY - 20} ${lx + 12},${baseY - 14}`} fill="none" stroke="#2090A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d={`M${rx - 12},${baseY - 14} Q${rx},${baseY - 20} ${rx + 12},${baseY - 14}`} fill="none" stroke="#2090A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eye(lx, 80, 12, 5)}
          {eye(rx, 80, 12, 5)}
          <path d={`M${lx - 10},${baseY - 14} Q${lx},${baseY - 11} ${lx + 10},${baseY - 14}`} fill="none" stroke="#2090A8" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M${rx - 10},${baseY - 14} Q${rx},${baseY - 17} ${rx + 10},${baseY - 14}`} fill="none" stroke="#2090A8" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
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

function RexMouth({ mood, isSpeaking }: { mood: CharacterMood; isSpeaking?: boolean }) {
  const glow = isSpeaking ? 1 : 0;
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M88,111 Q100,122 112,111" fill="none" stroke="#40D0E8" strokeWidth="2.2" strokeLinecap="round" />
          {glow > 0 && <path d="M91,113 Q100,119 109,113" fill="none" stroke="#B0F4FF" strokeWidth="1.2" opacity="0.5" />}
          {/* Tiny cute teeth */}
          <path d="M95,111 l2,2.5 l2,-2.5" fill="white" opacity="0.7" />
          <path d="M101,111 l2,2.5 l2,-2.5" fill="white" opacity="0.7" />
        </g>
      );
    case 'thinking':
      return <ellipse cx="101" cy="113" rx="3.5" ry="3" fill="#40D0E8" opacity="0.5" />;
    case 'encouraging':
      return <path d="M90,111 Q100,120 110,111" fill="none" stroke="#40D0E8" strokeWidth="2" strokeLinecap="round" opacity="0.85" />;
    case 'headShake':
      return <path d="M94,113 Q100,111 106,113" fill="none" stroke="#40D0E8" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />;
    default:
      return (
        <g>
          <path d="M90,111 Q100,120 110,111" fill="none" stroke="#40D0E8" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          {glow > 0 && <path d="M93,113 Q100,117 107,113" fill="none" stroke="#B0F4FF" strokeWidth="1" opacity="0.4" />}
        </g>
      );
  }
}
