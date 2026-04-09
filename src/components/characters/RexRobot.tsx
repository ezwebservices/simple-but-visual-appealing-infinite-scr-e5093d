import type { CharacterMood } from '../../types';

interface RexRobotProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * RexRobot — Pure robot SVG character.
 *
 * Boxy metallic robot with a rounded-rect head, visor-style eyes,
 * dual antennae with glowing cyan tips, speaker-grille mouth,
 * and articulated limbs. Cyan/teal accent palette.
 * Supports all 5 mood states and isSpeaking sound-wave bars.
 */
export default function RexRobot({ mood = 'happy', className, isSpeaking }: RexRobotProps) {
  const eyeLeft = getEyes(mood, 'left');
  const eyeRight = getEyes(mood, 'right');
  const mouth = getMouth(mood);

  return (
    <svg
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <style>{`
          @keyframes rr-wave1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
          @keyframes rr-wave2 { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(0.8)} }
          @keyframes rr-wave3 { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
          @keyframes rr-wave4 { 0%,100%{transform:scaleY(0.35)} 50%{transform:scaleY(0.9)} }
          @keyframes rr-antenna-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
          @keyframes rr-antenna-pulse-r { 0%,100%{opacity:0.5} 50%{opacity:1} }
        `}</style>

        {/* Metallic body gradient */}
        <radialGradient id="rr-metal" cx="38%" cy="30%" r="65%" fx="35%" fy="28%">
          <stop offset="0%" stopColor="#D0D8E0" />
          <stop offset="35%" stopColor="#A0AEB8" />
          <stop offset="70%" stopColor="#748898" />
          <stop offset="100%" stopColor="#4E6070" />
        </radialGradient>

        {/* Head metallic — slightly brighter */}
        <radialGradient id="rr-metal-head" cx="42%" cy="32%" r="58%" fx="40%" fy="30%">
          <stop offset="0%" stopColor="#E2EAF2" />
          <stop offset="35%" stopColor="#B4C4D4" />
          <stop offset="70%" stopColor="#8CA0B4" />
          <stop offset="100%" stopColor="#607890" />
        </radialGradient>

        {/* Accent — cyan/teal for robot identity */}
        <radialGradient id="rr-accent" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#80EFFF" />
          <stop offset="100%" stopColor="#40B8D0" />
        </radialGradient>

        {/* Eye glow — cyan LED */}
        <radialGradient id="rr-eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B0F4FF" />
          <stop offset="60%" stopColor="#40D0E8" />
          <stop offset="100%" stopColor="#20A8C0" />
        </radialGradient>

        {/* Antenna tip glow — left cyan */}
        <radialGradient id="rr-antenna-glow-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B0F4FF" />
          <stop offset="50%" stopColor="#40D0E8" />
          <stop offset="100%" stopColor="#00B0D0" />
        </radialGradient>

        {/* Antenna tip glow — right cyan */}
        <radialGradient id="rr-antenna-glow-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A0F0FF" />
          <stop offset="50%" stopColor="#38C8E0" />
          <stop offset="100%" stopColor="#00A0C0" />
        </radialGradient>

        {/* Dark panel */}
        <linearGradient id="rr-dark-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A4858" />
          <stop offset="100%" stopColor="#222E3A" />
        </linearGradient>

        {/* Limb metallic */}
        <linearGradient id="rr-limb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A0AEB8" />
          <stop offset="50%" stopColor="#748898" />
          <stop offset="100%" stopColor="#4E6070" />
        </linearGradient>

        {/* Shadow */}
        <linearGradient id="rr-shadow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Speaker grille */}
        <linearGradient id="rr-grille" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#2E3E4E" />
          <stop offset="100%" stopColor="#1E2E3E" />
        </linearGradient>

        {/* Visor gradient */}
        <linearGradient id="rr-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A2A38" />
          <stop offset="100%" stopColor="#0E1E2A" />
        </linearGradient>
      </defs>

      {/* ════════════════════════════════════════════
          LEGS — boxy metallic struts
          ════════════════════════════════════════════ */}
      <g className="leg-left" style={{ transformOrigin: '78px 175px' }}>
        <rect x="64" y="170" width="26" height="42" rx="4" fill="url(#rr-limb)" stroke="#4E6070" strokeWidth="0.5" />
        <rect x="60" y="210" width="34" height="10" rx="4" fill="#3A4858" stroke="#4E6070" strokeWidth="0.5" />
        {/* Knee joint */}
        <circle cx="77" cy="185" r="4" fill="#3A4858" stroke="rgba(64,208,232,0.3)" strokeWidth="0.8" />
        <path d="M66,172 L66,207" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </g>

      <g className="leg-right" style={{ transformOrigin: '122px 175px' }}>
        <rect x="110" y="170" width="26" height="42" rx="4" fill="url(#rr-limb)" stroke="#4E6070" strokeWidth="0.5" />
        <rect x="106" y="210" width="34" height="10" rx="4" fill="#3A4858" stroke="#4E6070" strokeWidth="0.5" />
        <circle cx="123" cy="185" r="4" fill="#3A4858" stroke="rgba(64,208,232,0.3)" strokeWidth="0.8" />
        <path d="M112,172 L112,207" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </g>

      {/* ════════════════════════════════════════════
          BODY — boxy torso chassis
          ════════════════════════════════════════════ */}
      <g className="body" style={{ transformOrigin: '100px 145px' }}>
        <rect x="52" y="108" width="96" height="72" rx="12" fill="url(#rr-metal)" stroke="#4E6070" strokeWidth="0.6" />
        {/* Chest plate — glowing accent panel */}
        <rect x="68" y="120" width="64" height="48" rx="6" fill="url(#rr-accent)" opacity="0.15" />
        {/* Chest vent lines */}
        <line x1="78" y1="132" x2="122" y2="132" stroke="rgba(64,208,232,0.15)" strokeWidth="0.8" />
        <line x1="76" y1="140" x2="124" y2="140" stroke="rgba(64,208,232,0.15)" strokeWidth="0.8" />
        <line x1="78" y1="148" x2="122" y2="148" stroke="rgba(64,208,232,0.15)" strokeWidth="0.8" />
        <line x1="80" y1="156" x2="120" y2="156" stroke="rgba(64,208,232,0.15)" strokeWidth="0.8" />
        {/* Center power core */}
        <circle cx="100" cy="144" r="8" fill="none" stroke="rgba(64,208,232,0.3)" strokeWidth="1" />
        <circle cx="100" cy="144" r="4" fill="rgba(64,208,232,0.4)" />
        <circle cx="100" cy="144" r="2" fill="#B0F4FF" opacity="0.6" />
        {/* ── Display Screen ── */}
        <rect x="76" y="116" width="48" height="28" rx="6" fill="#1A2838" stroke="#40D0E8" strokeWidth="1" opacity="0.9" />
        <rect x="78" y="118" width="44" height="24" rx="5" fill="#0D1520" />
        {isSpeaking && (
          <g className="screen-waves">
            <rect x="84" y="130" width="5" height="10" rx="2" fill="#40D0E8" opacity="0.9"
              style={{ transformOrigin: '86.5px 135px', animation: 'rr-wave1 0.4s ease-in-out infinite' }} />
            <rect x="92" y="126" width="5" height="14" rx="2" fill="#80EFFF" opacity="0.8"
              style={{ transformOrigin: '94.5px 133px', animation: 'rr-wave2 0.35s ease-in-out infinite 0.1s' }} />
            <rect x="100" y="128" width="5" height="12" rx="2" fill="#40D0E8" opacity="0.85"
              style={{ transformOrigin: '102.5px 134px', animation: 'rr-wave3 0.45s ease-in-out infinite 0.2s' }} />
            <rect x="108" y="130" width="5" height="10" rx="2" fill="#80EFFF" opacity="0.75"
              style={{ transformOrigin: '110.5px 135px', animation: 'rr-wave4 0.38s ease-in-out infinite 0.15s' }} />
          </g>
        )}
        {!isSpeaking && (
          <g className="screen-idle">
            <line x1="82" y1="130" x2="118" y2="130" stroke="#40D0E8" strokeWidth="0.5" opacity="0.2" />
          </g>
        )}
        {/* Panel seams */}
        <line x1="52" y1="130" x2="148" y2="130" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        {/* Rim highlight */}
        <path d="M58,108 Q100,104 142,108" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ════════════════════════════════════════════
          ARMS — boxy metallic appendages
          ════════════════════════════════════════════ */}
      <g className="arm-left" style={{ transformOrigin: '52px 118px' }}>
        <rect x="26" y="112" width="28" height="52" rx="6" fill="url(#rr-limb)" stroke="#4E6070" strokeWidth="0.5" />
        {/* Shoulder joint */}
        <circle cx="52" cy="120" r="6" fill="#3A4858" stroke="rgba(64,208,232,0.3)" strokeWidth="0.8" />
        {/* Elbow joint */}
        <circle cx="40" cy="142" r="3.5" fill="#3A4858" stroke="rgba(64,208,232,0.2)" strokeWidth="0.6" />
        {/* Hand */}
        <rect x="30" y="162" width="20" height="14" rx="5" fill="#3A4858" stroke="#4E6070" strokeWidth="0.5" />
        <path d="M28,116 L28,158" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </g>

      <g className="arm-right" style={{ transformOrigin: '148px 118px' }}>
        <rect x="146" y="112" width="28" height="52" rx="6" fill="url(#rr-limb)" stroke="#4E6070" strokeWidth="0.5" />
        <circle cx="148" cy="120" r="6" fill="#3A4858" stroke="rgba(64,208,232,0.3)" strokeWidth="0.8" />
        <circle cx="160" cy="142" r="3.5" fill="#3A4858" stroke="rgba(64,208,232,0.2)" strokeWidth="0.6" />
        <rect x="150" y="162" width="20" height="14" rx="5" fill="#3A4858" stroke="#4E6070" strokeWidth="0.5" />
        <path d="M172,116 L172,158" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </g>

      {/* ════════════════════════════════════════════
          HEAD — boxy robot head with visor
          ════════════════════════════════════════════ */}
      <g className="head" style={{ transformOrigin: '100px 68px' }}>
        {/* Neck shadow */}
        <ellipse cx="100" cy="108" rx="24" ry="6" fill="url(#rr-shadow)" />

        {/* ── Dual Antennae ── */}
        <g className="antenna-left" style={{ transformOrigin: '82px 22px' }}>
          <line x1="82" y1="34" x2="78" y2="10" stroke="#748898" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="78" cy="8" r="4.5" fill="url(#rr-antenna-glow-l)"
            style={{ animation: 'rr-antenna-pulse 2s ease-in-out infinite' }} />
          <circle cx="77" cy="6.5" r="1.5" fill="rgba(255,255,255,0.5)" />
        </g>
        <g className="antenna-right" style={{ transformOrigin: '118px 22px' }}>
          <line x1="118" y1="34" x2="122" y2="10" stroke="#748898" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="122" cy="8" r="4.5" fill="url(#rr-antenna-glow-r)"
            style={{ animation: 'rr-antenna-pulse-r 2s ease-in-out infinite 0.5s' }} />
          <circle cx="123" cy="6.5" r="1.5" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* ── Head shell — rounded rectangle ── */}
        <rect x="58" y="32" width="84" height="72" rx="16" fill="url(#rr-metal-head)" stroke="#4E6070" strokeWidth="0.8" />

        {/* Specular rim */}
        <path d="M68,36 Q100,28 132,36" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Panel lines */}
        <path d="M64,52 Q100,48 136,52" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
        <line x1="100" y1="34" x2="100" y2="48" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />

        {/* Side bolts */}
        <circle cx="62" cy="68" r="2.5" fill="#4E6070" stroke="rgba(64,208,232,0.2)" strokeWidth="0.5" />
        <circle cx="138" cy="68" r="2.5" fill="#4E6070" stroke="rgba(64,208,232,0.2)" strokeWidth="0.5" />

        {/* ── Visor — dark eye band ── */}
        <rect x="70" y="54" width="60" height="22" rx="8" fill="url(#rr-visor)" stroke="#3A4858" strokeWidth="0.6" />

        {/* ── Eyes — glowing LED in visor ── */}
        <g className="eyes">
          {eyeLeft}
          {eyeRight}
        </g>

        {/* ── Nose sensor ── */}
        <rect x="96" y="80" width="8" height="4" rx="2" fill="#3A4858" stroke="rgba(64,208,232,0.2)" strokeWidth="0.5" />

        {/* ── Speaker grille mouth area ── */}
        <rect x="80" y="86" width="40" height="14" rx="4" fill="url(#rr-grille)" stroke="#3A4858" strokeWidth="0.5" />
        {/* Grille lines */}
        <line x1="84" y1="89" x2="116" y2="89" stroke="rgba(64,208,232,0.08)" strokeWidth="0.5" />
        <line x1="84" y1="93" x2="116" y2="93" stroke="rgba(64,208,232,0.08)" strokeWidth="0.5" />
        <line x1="84" y1="97" x2="116" y2="97" stroke="rgba(64,208,232,0.08)" strokeWidth="0.5" />

        {/* ── Cheek indicator LEDs ── */}
        <circle cx="72" cy="78" r="3" fill="#40D0E8" opacity="0.25" />
        <circle cx="128" cy="78" r="3" fill="#40D0E8" opacity="0.25" />

        {/* ── Mouth ── */}
        <g className="mouth">{mouth}</g>


      </g>
    </svg>
  );
}

/* ─── Eye rendering per mood — big cute anime eyes ─── */
function getEyes(mood: CharacterMood, side: 'left' | 'right') {
  const cx = side === 'left' ? 88 : 112;

  // Large white sclera
  const sclera = (
    <ellipse cx={cx} cy="64" rx="10" ry="11" fill="white" stroke="#4E6070" strokeWidth="0.8" />
  );

  // Colored iris
  const iris = (irisY: number, irisR = 7) => (
    <circle cx={cx} cy={irisY} r={irisR} fill="url(#rr-eye-glow)" />
  );

  // Pupil
  const pupilEl = (py: number) => (
    <circle cx={cx} cy={py} r="3" fill="#0A1520" />
  );

  // Highlights
  const highlights = (hy: number) => (
    <>
      <circle cx={cx + 3} cy={hy} r="2.8" fill="white" opacity="0.9" />
      <circle cx={cx - 2} cy={hy + 6} r="1.3" fill="white" opacity="0.6" />
    </>
  );

  switch (mood) {
    case 'excited':
      return (
        <g>
          {sclera}
          {iris(63, 8)}
          {pupilEl(63)}
          {highlights(59)}
          <path d={`M${cx - 11},${54} l1.5,-4 l1.5,4 l-3,0 Z`} fill="#80EFFF" />
          <path d={`M${cx + 8},${52} l1,-3 l1,3 l-2,0 Z`} fill="#80EFFF" opacity="0.8" />
        </g>
      );
    case 'thinking':
      return (
        <g>
          {sclera}
          {iris(65, 6.5)}
          <circle cx={cx + (side === 'right' ? 2 : -2)} cy="65" r="2.8" fill="#0A1520" />
          {highlights(60)}
        </g>
      );
    case 'encouraging':
      return (
        <g>
          {sclera}
          {iris(66, 7)}
          {pupilEl(66)}
          {highlights(61)}
          <path
            d={`M${cx - 10},${60} Q${cx},${56} ${cx + 10},${60}`}
            fill="white" stroke="#4E6070" strokeWidth="0.5"
          />
        </g>
      );
    case 'headShake':
      return (
        <g>
          {sclera}
          {iris(65, 7)}
          {pupilEl(65)}
          {highlights(60)}
          <path
            d={`M${cx - 8},${55} Q${cx},${side === 'left' ? 52 : 57} ${cx + 8},${55}`}
            fill="none" stroke="#4E6070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"
          />
        </g>
      );
    default: // happy
      return (
        <g>
          {sclera}
          {iris(64)}
          {pupilEl(64)}
          {highlights(59)}
        </g>
      );
  }
}

/* ─── Mouth rendering per mood — LED mouth on speaker grille ─── */
function getMouth(mood: CharacterMood) {
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M88,92 Q100,100 112,92" fill="none" stroke="#40D0E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M92,94 Q100,98 108,94" fill="none" stroke="#80EFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </g>
      );
    case 'thinking':
      return (
        <path d="M94,94 Q100,92 106,94" fill="none" stroke="#40D0E8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      );
    case 'encouraging':
      return (
        <path d="M88,93 Q100,99 112,93" fill="none" stroke="#40D0E8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      );
    case 'headShake':
      return (
        <path d="M92,94 Q100,93 108,94" fill="none" stroke="#40D0E8" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      );
    default: // happy
      return (
        <path d="M88,92 Q100,100 112,92" fill="none" stroke="#40D0E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      );
  }
}
