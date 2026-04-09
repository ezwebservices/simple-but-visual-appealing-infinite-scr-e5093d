import type { CharacterMood } from '../../types';

interface BennyBearProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * BennyBear — Robot-head SVG character.
 *
 * Metallic bear-shaped robot head with round ear panels, glowing amber eyes,
 * panel lines, single antenna, and sound-wave bars for speech.
 * Preserves all 5 mood states and existing transformOrigin layout.
 */
export default function BennyBear({ mood = 'happy', className, isSpeaking }: BennyBearProps) {
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
          @keyframes bb-wave1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
          @keyframes bb-wave2 { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(0.8)} }
          @keyframes bb-wave3 { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
          @keyframes bb-antenna-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        `}</style>

        {/* Metallic body gradient */}
        <radialGradient id="bb-metal" cx="38%" cy="30%" r="65%" fx="35%" fy="28%">
          <stop offset="0%" stopColor="#D4DCE4" />
          <stop offset="35%" stopColor="#A8B8C8" />
          <stop offset="70%" stopColor="#7A8FA0" />
          <stop offset="100%" stopColor="#546878" />
        </radialGradient>

        {/* Head metallic — slightly brighter */}
        <radialGradient id="bb-metal-head" cx="42%" cy="32%" r="58%" fx="40%" fy="30%">
          <stop offset="0%" stopColor="#E0E8F0" />
          <stop offset="35%" stopColor="#B8C8D8" />
          <stop offset="70%" stopColor="#90A4B8" />
          <stop offset="100%" stopColor="#6882A0" />
        </radialGradient>

        {/* Accent — warm amber for bear identity */}
        <radialGradient id="bb-accent" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFD080" />
          <stop offset="100%" stopColor="#D4A040" />
        </radialGradient>

        {/* Ear panel inner */}
        <radialGradient id="bb-ear-panel" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFD080" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#C89030" stopOpacity="0.4" />
        </radialGradient>

        {/* Eye glow */}
        <radialGradient id="bb-eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE0A0" />
          <stop offset="60%" stopColor="#FFBF40" />
          <stop offset="100%" stopColor="#E8A020" />
        </radialGradient>

        {/* Antenna tip glow */}
        <radialGradient id="bb-antenna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE880" />
          <stop offset="50%" stopColor="#FFBF40" />
          <stop offset="100%" stopColor="#FF9800" />
        </radialGradient>

        {/* Dark panel */}
        <linearGradient id="bb-dark-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="100%" stopColor="#2D3748" />
        </linearGradient>

        {/* Limb metallic */}
        <linearGradient id="bb-limb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8B8C8" />
          <stop offset="50%" stopColor="#7A8FA0" />
          <stop offset="100%" stopColor="#546878" />
        </linearGradient>

        {/* Shadow */}
        <linearGradient id="bb-shadow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Speaker grille */}
        <linearGradient id="bb-grille" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3A4A5A" />
          <stop offset="100%" stopColor="#2A3A4A" />
        </linearGradient>
      </defs>

      {/* ════════════════════════════════════════════
          LEGS — metallic struts
          ════════════════════════════════════════════ */}
      <g className="leg-left" style={{ transformOrigin: '78px 175px' }}>
        <path
          d="M68,168 Q62,185 60,200 Q58,212 64,220 L90,220 Q94,212 92,200 Q90,185 88,168 Z"
          fill="url(#bb-limb)" stroke="#546878" strokeWidth="0.5"
        />
        <ellipse cx="77" cy="218" rx="14" ry="6" fill="#4A5568" />
        <path d="M70,170 Q64,188 62,202" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Panel line */}
        <line x1="78" y1="170" x2="78" y2="215" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      </g>

      <g className="leg-right" style={{ transformOrigin: '122px 175px' }}>
        <path
          d="M112,168 Q108,185 108,200 Q106,212 112,220 L138,220 Q142,212 140,200 Q138,185 132,168 Z"
          fill="url(#bb-limb)" stroke="#546878" strokeWidth="0.5"
        />
        <ellipse cx="125" cy="218" rx="14" ry="6" fill="#4A5568" />
        <path d="M114,170 Q110,188 109,202" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="125" y1="170" x2="125" y2="215" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          BODY — metallic torso chassis
          ════════════════════════════════════════════ */}
      <g className="body" style={{ transformOrigin: '100px 145px' }}>
        <path
          d="M48,115 Q38,125 42,140 Q46,160 55,180 Q70,190 100,185
             Q130,190 145,180 Q154,160 158,140 Q162,125 152,115
             Q130,102 100,105 Q70,102 48,115 Z"
          fill="url(#bb-metal)" stroke="#546878" strokeWidth="0.6"
        />
        {/* Chest plate */}
        <ellipse cx="100" cy="152" rx="38" ry="30" fill="url(#bb-accent)" opacity="0.3" />
        {/* ── Display Screen ── */}
        <rect x="78" y="132" width="44" height="28" rx="6" fill="#1A2030" stroke="#FFBF40" strokeWidth="1" opacity="0.9" />
        <rect x="80" y="134" width="40" height="24" rx="5" fill="#0D1520" />
        {isSpeaking && (
          <g className="screen-waves">
            <rect x="85" y="146" width="5" height="10" rx="2" fill="#FFBF40" opacity="0.9"
              style={{ transformOrigin: '87.5px 151px', animation: 'bb-wave1 0.4s ease-in-out infinite' }} />
            <rect x="93" y="142" width="5" height="14" rx="2" fill="#FFD060" opacity="0.8"
              style={{ transformOrigin: '95.5px 149px', animation: 'bb-wave2 0.35s ease-in-out infinite 0.1s' }} />
            <rect x="101" y="144" width="5" height="12" rx="2" fill="#FFBF40" opacity="0.85"
              style={{ transformOrigin: '103.5px 150px', animation: 'bb-wave3 0.45s ease-in-out infinite 0.2s' }} />
            <rect x="109" y="146" width="5" height="10" rx="2" fill="#FFD060" opacity="0.75"
              style={{ transformOrigin: '111.5px 151px', animation: 'bb-wave1 0.38s ease-in-out infinite 0.15s' }} />
          </g>
        )}
        {!isSpeaking && (
          <g className="screen-idle">
            <line x1="84" y1="146" x2="116" y2="146" stroke="#FFBF40" strokeWidth="0.5" opacity="0.2" />
          </g>
        )}
        {/* Panel seams */}
        <path d="M68,115 Q72,140 70,170" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
        <path d="M132,115 Q128,140 130,170" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
        {/* Rim highlight */}
        <path d="M55,112 Q100,100 145,112" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ════════════════════════════════════════════
          ARMS — metallic appendages
          ════════════════════════════════════════════ */}
      <g className="arm-left" style={{ transformOrigin: '48px 118px' }}>
        <path
          d="M48,115 Q38,120 32,132 Q26,148 22,165 Q20,175 30,180 Q38,178 40,172
             Q42,158 44,145 Q46,132 50,122 Z"
          fill="url(#bb-limb)" stroke="#546878" strokeWidth="0.5"
        />
        <ellipse cx="28" cy="177" rx="10" ry="7" fill="#4A5568" />
        <path d="M46,118 Q36,126 30,140 Q24,155 23,168" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Joint rivet */}
        <circle cx="36" cy="148" r="3" fill="#546878" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>

      <g className="arm-right" style={{ transformOrigin: '152px 118px' }}>
        <path
          d="M152,115 Q162,120 168,132 Q174,148 178,165 Q180,175 170,180 Q162,178 160,172
             Q158,158 156,145 Q154,132 150,122 Z"
          fill="url(#bb-limb)" stroke="#546878" strokeWidth="0.5"
        />
        <ellipse cx="172" cy="177" rx="10" ry="7" fill="#4A5568" />
        <path d="M154,118 Q164,126 170,140 Q176,155 177,168" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="164" cy="148" r="3" fill="#546878" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          HEAD — robot bear head
          ════════════════════════════════════════════ */}
      <g className="head" style={{ transformOrigin: '100px 78px' }}>
        {/* Neck shadow */}
        <ellipse cx="100" cy="108" rx="28" ry="8" fill="url(#bb-shadow)" />

        {/* ── Antenna ── */}
        <g className="antenna" style={{ transformOrigin: '100px 22px' }}>
          <line x1="100" y1="38" x2="100" y2="14" stroke="#7A8FA0" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="12" r="5" fill="url(#bb-antenna-glow)" style={{ animation: 'bb-antenna-pulse 2s ease-in-out infinite' }} />
          <circle cx="99" cy="10.5" r="1.8" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* ── Ear panels — round metallic bear ears ── */}
        <g className="ear-left" style={{ transformOrigin: '60px 48px' }}>
          <circle cx="60" cy="48" r="20" fill="url(#bb-metal-head)" stroke="#546878" strokeWidth="0.8" />
          <circle cx="60" cy="48" r="11" fill="url(#bb-ear-panel)" />
          {/* Ear bolts */}
          <circle cx="52" cy="40" r="1.5" fill="#546878" />
          <circle cx="68" cy="40" r="1.5" fill="#546878" />
          <path d="M48,36 Q55,30 68,34" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        <g className="ear-right" style={{ transformOrigin: '140px 48px' }}>
          <circle cx="140" cy="48" r="20" fill="url(#bb-metal-head)" stroke="#546878" strokeWidth="0.8" />
          <circle cx="140" cy="48" r="11" fill="url(#bb-ear-panel)" />
          <circle cx="132" cy="40" r="1.5" fill="#546878" />
          <circle cx="148" cy="40" r="1.5" fill="#546878" />
          <path d="M132,34 Q140,30 152,36" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* ── Head shell — metallic sphere ── */}
        <circle cx="100" cy="78" r="48" fill="url(#bb-metal-head)" stroke="#546878" strokeWidth="0.8" />

        {/* Specular rim */}
        <path d="M65,45 Q85,32 115,38" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Panel lines */}
        <path d="M60,58 Q100,50 140,58" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
        <path d="M58,78 Q100,72 142,78" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.6" />
        {/* Vertical center seam */}
        <line x1="100" y1="32" x2="100" y2="55" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
        {/* Side bolts */}
        <circle cx="56" cy="78" r="2" fill="#546878" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <circle cx="144" cy="78" r="2" fill="#546878" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

        {/* ── Muzzle — speaker grille area ── */}
        <ellipse cx="100" cy="91" rx="24" ry="18" fill="url(#bb-grille)" stroke="#4A5568" strokeWidth="0.6" />
        {/* Grille lines */}
        <line x1="82" y1="86" x2="118" y2="86" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <line x1="80" y1="91" x2="120" y2="91" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <line x1="82" y1="96" x2="118" y2="96" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

        {/* ── Cheek indicator LEDs ── */}
        <circle cx="68" cy="82" r="4" fill="#FFD080" opacity="0.3" />
        <circle cx="132" cy="82" r="4" fill="#FFD080" opacity="0.3" />

        {/* ── Eyes — glowing LED ── */}
        <g className="eyes">
          {eyeLeft}
          {eyeRight}
        </g>

        {/* ── Nose sensor ── */}
        <ellipse cx="100" cy="84" rx="5" ry="3.5" fill="#4A5568" stroke="#546878" strokeWidth="0.5" />
        <ellipse cx="99" cy="83" rx="2" ry="1" fill="rgba(255,200,80,0.3)" />

        {/* ── Mouth ── */}
        <g className="mouth">{mouth}</g>
      </g>
    </svg>
  );
}

/* ─── Eye rendering per mood — big cute anime eyes ─── */
function getEyes(mood: CharacterMood, side: 'left' | 'right') {
  const cx = side === 'left' ? 85 : 115;

  // Large white sclera
  const sclera = (
    <ellipse cx={cx} cy="72" rx="11" ry="12" fill="white" stroke="#D4A040" strokeWidth="0.8" />
  );

  // Big colored iris
  const iris = (irisY: number, irisR = 8) => (
    <circle cx={cx} cy={irisY} r={irisR} fill="url(#bb-eye-glow)" />
  );

  // Pupil
  const pupil = (py: number) => (
    <circle cx={cx} cy={py} r="3.5" fill="#2D1810" />
  );

  // Main highlight sparkle
  const highlight = (hx: number, hy: number) => (
    <>
      <circle cx={hx} cy={hy} r="3" fill="white" opacity="0.9" />
      <circle cx={hx - 4} cy={hy + 5} r="1.5" fill="white" opacity="0.6" />
    </>
  );

  switch (mood) {
    case 'excited':
      return (
        <g>
          {sclera}
          {iris(71, 9)}
          {pupil(71)}
          {highlight(cx + 3, 67)}
          {/* Sparkle stars */}
          <path d={`M${cx - 12},${62} l1.5,-4 l1.5,4 l-3,0 Z`} fill="#FFE66D" />
          <path d={`M${cx + 10},${60} l1,-3 l1,3 l-2,0 Z`} fill="#FFE66D" opacity="0.8" />
        </g>
      );
    case 'thinking':
      return (
        <g>
          {sclera}
          {iris(73, 7.5)}
          <circle cx={cx + (side === 'right' ? 2 : -2)} cy="73" r="3" fill="#2D1810" />
          {highlight(cx + 3, 68)}
        </g>
      );
    case 'encouraging':
      return (
        <g>
          {sclera}
          {iris(74, 8)}
          {pupil(74)}
          {highlight(cx + 3, 69)}
          {/* Happy squint — curved upper lid */}
          <path
            d={`M${cx - 11},${68} Q${cx},${63} ${cx + 11},${68}`}
            fill="white" stroke="#D4A040" strokeWidth="0.6"
          />
        </g>
      );
    case 'headShake':
      return (
        <g>
          {sclera}
          {iris(73, 8)}
          {pupil(73)}
          {highlight(cx + 3, 68)}
          {/* Worried brow */}
          <path
            d={`M${cx - 8},${60} Q${cx},${side === 'left' ? 57 : 62} ${cx + 8},${60}`}
            fill="none" stroke="#D4A040" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"
          />
        </g>
      );
    default: // happy
      return (
        <g>
          {sclera}
          {iris(72)}
          {pupil(72)}
          {highlight(cx + 3, 67)}
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
          <path d="M88,96 Q100,105 112,96" fill="none" stroke="#FFBF40" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M92,98 Q100,103 108,98" fill="none" stroke="#FFE080" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </g>
      );
    case 'thinking':
      return (
        <path d="M94,98 Q100,96 106,98" fill="none" stroke="#FFBF40" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      );
    case 'encouraging':
      return (
        <path d="M88,97 Q100,104 112,97" fill="none" stroke="#FFBF40" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      );
    case 'headShake':
      return (
        <path d="M92,98 Q100,97 108,98" fill="none" stroke="#FFBF40" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      );
    default: // happy
      return (
        <path d="M88,96 Q100,106 112,96" fill="none" stroke="#FFBF40" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      );
  }
}
