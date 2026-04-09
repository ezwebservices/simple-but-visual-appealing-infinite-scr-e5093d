import type { CharacterMood } from '../../types';

interface SunnyBugProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * SunnyBug — Robot-head SVG character.
 *
 * Metallic ladybug-shaped robot head with dome shell, red accent panels,
 * glowing red eyes, single antenna, and sound-wave bars for speech.
 * Preserves all 5 mood states and existing transformOrigin layout.
 */
export default function SunnyBug({ mood = 'happy', className, isSpeaking }: SunnyBugProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <style>{`
          @keyframes ll-wave1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
          @keyframes ll-wave2 { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(0.8)} }
          @keyframes ll-wave3 { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
          @keyframes ll-antenna-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        `}</style>

        {/* Shell metallic red */}
        <radialGradient id="ll-shell-metal" cx="38%" cy="28%" r="65%" fx="35%" fy="26%">
          <stop offset="0%" stopColor="#FF8878" />
          <stop offset="30%" stopColor="#E05848" />
          <stop offset="65%" stopColor="#C83830" />
          <stop offset="100%" stopColor="#A02820" />
        </radialGradient>

        {/* Head metallic dark */}
        <radialGradient id="ll-head-metal" cx="42%" cy="32%" r="58%" fx="40%" fy="30%">
          <stop offset="0%" stopColor="#808898" />
          <stop offset="35%" stopColor="#5A6678" />
          <stop offset="70%" stopColor="#3A4A5C" />
          <stop offset="100%" stopColor="#2A3648" />
        </radialGradient>

        {/* Spot — dark metallic indent */}
        <radialGradient id="ll-spot-metal" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#4A4A5A" />
          <stop offset="100%" stopColor="#2A2A38" />
        </radialGradient>

        {/* Wing panel — translucent metallic */}
        <radialGradient id="ll-wing-metal" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#C8D0E0" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#90A0B8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#607080" stopOpacity="0.15" />
        </radialGradient>

        {/* Antenna tip glow */}
        <radialGradient id="ll-antenna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6860" />
          <stop offset="50%" stopColor="#E84040" />
          <stop offset="100%" stopColor="#C02020" />
        </radialGradient>

        {/* Eye glow */}
        <radialGradient id="ll-eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF8080" />
          <stop offset="60%" stopColor="#FF4040" />
          <stop offset="100%" stopColor="#E02020" />
        </radialGradient>

        {/* Shadow */}
        <linearGradient id="ll-shadow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Limb metallic */}
        <linearGradient id="ll-limb-metal" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#5A6678" />
          <stop offset="100%" stopColor="#2A3648" />
        </linearGradient>

        {/* Speaker grille */}
        <linearGradient id="ll-grille" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3A4A5A" />
          <stop offset="100%" stopColor="#2A3648" />
        </linearGradient>
      </defs>

      {/* ════════════════════════════════════════════
          WINGS — metallic panels behind body
          ════════════════════════════════════════════ */}
      <g className="wings">
        <g className="wing-left" style={{ transformOrigin: '80px 110px' }}>
          <ellipse cx="68" cy="110" rx="30" ry="40" fill="url(#ll-wing-metal)" transform="rotate(-15 68 110)" stroke="rgba(100,120,140,0.3)" strokeWidth="0.5" />
          <path d="M52,90 Q62,105 58,130" fill="none" stroke="rgba(100,120,140,0.15)" strokeWidth="0.5" transform="rotate(-15 68 110)" />
        </g>
        <g className="wing-right" style={{ transformOrigin: '120px 110px' }}>
          <ellipse cx="132" cy="110" rx="30" ry="40" fill="url(#ll-wing-metal)" transform="rotate(15 132 110)" stroke="rgba(100,120,140,0.3)" strokeWidth="0.5" />
          <path d="M148,90 Q138,105 142,130" fill="none" stroke="rgba(100,120,140,0.15)" strokeWidth="0.5" transform="rotate(15 132 110)" />
        </g>
      </g>

      {/* ════════════════════════════════════════════
          LEGS — metallic struts
          ════════════════════════════════════════════ */}
      <g className="leg-left" style={{ transformOrigin: '77px 170px' }}>
        <path d="M72,168 Q64,178 58,184" fill="none" stroke="url(#ll-limb-metal)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M82,172 Q77,182 73,188" fill="none" stroke="url(#ll-limb-metal)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="57" cy="185" r="2.5" fill="#3A4A5A" />
        <circle cx="72" cy="189" r="2.5" fill="#3A4A5A" />
      </g>
      <g className="leg-right" style={{ transformOrigin: '123px 170px' }}>
        <path d="M128,168 Q136,178 142,184" fill="none" stroke="url(#ll-limb-metal)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M118,172 Q123,182 127,188" fill="none" stroke="url(#ll-limb-metal)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="143" cy="185" r="2.5" fill="#3A4A5A" />
        <circle cx="128" cy="189" r="2.5" fill="#3A4A5A" />
      </g>

      {/* ════════════════════════════════════════════
          BODY — metallic shell dome
          ════════════════════════════════════════════ */}
      <g className="body" style={{ transformOrigin: '100px 130px' }}>
        <path
          d="M55,90 Q45,110 50,140 Q55,165 72,178
             Q85,185 100,186 Q115,185 128,178
             Q145,165 150,140 Q155,110 145,90
             Q130,78 100,76 Q70,78 55,90 Z"
          fill="url(#ll-shell-metal)" stroke="#A02820" strokeWidth="0.8"
        />
        {/* Center ridge line */}
        <path d="M100,78 L100,184" stroke="#801818" strokeWidth="2" />
        <path d="M99,78 L99,184" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        {/* Metallic spots */}
        <circle cx="78" cy="108" r="9" fill="url(#ll-spot-metal)" stroke="#2A2A38" strokeWidth="0.5" />
        <circle cx="122" cy="104" r="8" fill="url(#ll-spot-metal)" stroke="#2A2A38" strokeWidth="0.5" />
        <circle cx="83" cy="142" r="10" fill="url(#ll-spot-metal)" stroke="#2A2A38" strokeWidth="0.5" />
        <circle cx="117" cy="146" r="8.5" fill="url(#ll-spot-metal)" stroke="#2A2A38" strokeWidth="0.5" />
        {/* ── Display Screen ── */}
        <rect x="80" y="152" width="40" height="24" rx="5" fill="#1A1020" stroke="#FF4040" strokeWidth="0.8" opacity="0.9" />
        <rect x="82" y="154" width="36" height="20" rx="4" fill="#0D0818" />
        {isSpeaking && (
          <g className="screen-waves">
            <rect x="87" y="164" width="4" height="8" rx="2" fill="#FF4040" opacity="0.9"
              style={{ transformOrigin: '89px 168px', animation: 'll-wave1 0.4s ease-in-out infinite' }} />
            <rect x="94" y="160" width="4" height="12" rx="2" fill="#FF6060" opacity="0.8"
              style={{ transformOrigin: '96px 166px', animation: 'll-wave2 0.35s ease-in-out infinite 0.1s' }} />
            <rect x="101" y="162" width="4" height="10" rx="2" fill="#FF4040" opacity="0.85"
              style={{ transformOrigin: '103px 167px', animation: 'll-wave3 0.45s ease-in-out infinite 0.2s' }} />
            <rect x="108" y="164" width="4" height="8" rx="2" fill="#FF6060" opacity="0.75"
              style={{ transformOrigin: '110px 168px', animation: 'll-wave1 0.38s ease-in-out infinite 0.15s' }} />
          </g>
        )}
        {!isSpeaking && (
          <g className="screen-idle">
            <line x1="86" y1="164" x2="114" y2="164" stroke="#FF4040" strokeWidth="0.5" opacity="0.2" />
          </g>
        )}
        {/* Specular highlight */}
        <path d="M62,86 Q100,72 138,86" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Panel seams */}
        <path d="M75,82 Q72,130 78,178" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        <path d="M125,82 Q128,130 122,178" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          HEAD — robot ladybug head
          ════════════════════════════════════════════ */}
      <g className="head" style={{ transformOrigin: '100px 68px' }}>
        {/* Neck shadow */}
        <ellipse cx="100" cy="82" rx="22" ry="6" fill="url(#ll-shadow)" />

        {/* ── Single Robot Antenna ── */}
        <g className="antenna" style={{ transformOrigin: '100px 20px' }}>
          <line x1="100" y1="42" x2="100" y2="16" stroke="#5A6678" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="14" r="6" fill="url(#ll-antenna-glow)" style={{ animation: 'll-antenna-pulse 2s ease-in-out infinite' }} />
          <circle cx="99" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* ── Head sphere — metallic ── */}
        <circle cx="100" cy="68" r="30" fill="url(#ll-head-metal)" stroke="#2A3648" strokeWidth="0.8" />

        {/* Specular rim */}
        <path d="M78,46 Q92,38 112,42" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Panel lines */}
        <path d="M74,55 Q100,50 126,55" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
        <path d="M72,68 Q100,64 128,68" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
        {/* Side bolts */}
        <circle cx="72" cy="68" r="1.5" fill="#4A5568" />
        <circle cx="128" cy="68" r="1.5" fill="#4A5568" />

        {/* ── Cheek LEDs ── */}
        <circle cx="78" cy="76" r="4" fill="#FF4040" opacity="0.25" />
        <circle cx="122" cy="76" r="4" fill="#FF4040" opacity="0.25" />

        {/* ── Eyes ── */}
        <g className="eyes">
          <Eyes mood={mood} />
        </g>

        {/* ── Speaker grille mouth area ── */}
        <ellipse cx="100" cy="80" rx="14" ry="8" fill="url(#ll-grille)" stroke="#2A3648" strokeWidth="0.4" />
        <line x1="88" y1="78" x2="112" y2="78" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
        <line x1="87" y1="81" x2="113" y2="81" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
        <line x1="88" y1="84" x2="112" y2="84" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />

        {/* ── Mouth ── */}
        <g className="mouth">
          <Mouth mood={mood} />
        </g>


      </g>
    </svg>
  );
}

/* ─── Eye rendering per mood — big cute anime eyes ─── */
function Eyes({ mood }: { mood: CharacterMood }) {
  const scleraL = <ellipse cx="88" cy="64" rx="10" ry="11" fill="white" stroke="#C83830" strokeWidth="0.8" />;
  const scleraR = <ellipse cx="112" cy="64" rx="10" ry="11" fill="white" stroke="#C83830" strokeWidth="0.8" />;

  const eyePair = (irisY: number, irisR = 7, pupilR = 3) => (
    <>
      {scleraL}
      <circle cx="88" cy={irisY} r={irisR} fill="url(#ll-eye-glow)" />
      <circle cx="88" cy={irisY} r={pupilR} fill="#1A0808" />
      <circle cx="91" cy={irisY - 4} r="2.8" fill="white" opacity="0.9" />
      <circle cx="87" cy={irisY + 3} r="1.3" fill="white" opacity="0.6" />
      {scleraR}
      <circle cx="112" cy={irisY} r={irisR} fill="url(#ll-eye-glow)" />
      <circle cx="112" cy={irisY} r={pupilR} fill="#1A0808" />
      <circle cx="115" cy={irisY - 4} r="2.8" fill="white" opacity="0.9" />
      <circle cx="111" cy={irisY + 3} r="1.3" fill="white" opacity="0.6" />
    </>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eyePair(63, 8)}
          {/* Sparkle stars */}
          <path d="M78,54 l1.5,-4 l1.5,4 l-3,0 Z" fill="#FFE66D" />
          <path d="M120,53 l1,-3 l1,3 l-2,0 Z" fill="#FFE66D" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {scleraL}
          <circle cx="90" cy="65" r="6.5" fill="url(#ll-eye-glow)" />
          <circle cx="90" cy="65" r="2.8" fill="#1A0808" />
          <circle cx="92" cy="61" r="2.5" fill="white" opacity="0.9" />
          {scleraR}
          <circle cx="114" cy="65" r="6.5" fill="url(#ll-eye-glow)" />
          <circle cx="114" cy="65" r="2.8" fill="#1A0808" />
          <circle cx="116" cy="61" r="2.5" fill="white" opacity="0.9" />
        </>
      );
    case 'encouraging':
      return (
        <>
          {scleraL}
          <circle cx="88" cy="66" r="7" fill="url(#ll-eye-glow)" />
          <circle cx="88" cy="66" r="3" fill="#1A0808" />
          <circle cx="91" cy="62" r="2.8" fill="white" opacity="0.9" />
          <path d="M79,60 Q88,55 97,60" fill="white" stroke="#C83830" strokeWidth="0.5" />
          {scleraR}
          <circle cx="112" cy="66" r="7" fill="url(#ll-eye-glow)" />
          <circle cx="112" cy="66" r="3" fill="#1A0808" />
          <circle cx="115" cy="62" r="2.8" fill="white" opacity="0.9" />
          <path d="M103,60 Q112,55 121,60" fill="white" stroke="#C83830" strokeWidth="0.5" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eyePair(65, 7)}
          <path d="M80,55 Q88,57 96,55" fill="none" stroke="#C83830" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M104,55 Q112,53 120,55" fill="none" stroke="#C83830" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default: // happy
      return eyePair(64);
  }
}

/* ─── Mouth rendering per mood — LED mouth ─── */
function Mouth({ mood }: { mood: CharacterMood }) {
  switch (mood) {
    case 'excited':
      return (
        <path d="M90,81 Q100,88 110,81" fill="none" stroke="#FF4040" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      );
    case 'thinking':
      return (
        <ellipse cx="102" cy="82" rx="3" ry="2.5" fill="#FF4040" opacity="0.5" />
      );
    case 'encouraging':
      return (
        <path d="M92,80 Q100,85 108,80" fill="none" stroke="#FF4040" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      );
    case 'headShake':
      return (
        <path d="M94,82 Q100,80 106,82" fill="none" stroke="#FF4040" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      );
    default: // happy
      return (
        <path d="M88,80 Q100,88 112,80" fill="none" stroke="#FF4040" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      );
  }
}
