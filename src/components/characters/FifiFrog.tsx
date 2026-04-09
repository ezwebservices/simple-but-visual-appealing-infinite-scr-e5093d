import type { CharacterMood } from '../../types';

interface FifiFrogProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * FifiFrog — Robot-head SVG character.
 *
 * Metallic frog-shaped robot head with bulging sensor domes for eyes,
 * wide head panel, glowing green eyes, single antenna, and sound-wave
 * bars for speech. Preserves all 5 mood states and existing transformOrigin.
 */
export default function FifiFrog({ mood = 'happy', className, isSpeaking }: FifiFrogProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <style>{`
          @keyframes ff-wave1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
          @keyframes ff-wave2 { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(0.8)} }
          @keyframes ff-wave3 { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
          @keyframes ff-antenna-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        `}</style>

        {/* Main skin — metallic green */}
        <radialGradient id="ff-metal-main" cx="38%" cy="30%" r="65%" fx="35%" fy="28%">
          <stop offset="0%" stopColor="#80E8A8" />
          <stop offset="35%" stopColor="#48C878" />
          <stop offset="70%" stopColor="#30B060" />
          <stop offset="100%" stopColor="#208848" />
        </radialGradient>

        {/* Head — brighter metallic green */}
        <radialGradient id="ff-metal-head" cx="42%" cy="32%" r="58%" fx="40%" fy="30%">
          <stop offset="0%" stopColor="#90F0B8" />
          <stop offset="35%" stopColor="#58D888" />
          <stop offset="70%" stopColor="#38C068" />
          <stop offset="100%" stopColor="#28A050" />
        </radialGradient>

        {/* Belly panel */}
        <radialGradient id="ff-belly-panel" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#D8F8E8" />
          <stop offset="50%" stopColor="#B0E8C8" />
          <stop offset="100%" stopColor="#88D0A8" />
        </radialGradient>

        {/* Limb metallic */}
        <linearGradient id="ff-limb-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#58D888" />
          <stop offset="50%" stopColor="#30B060" />
          <stop offset="100%" stopColor="#208848" />
        </linearGradient>

        {/* Webbed part — darker metallic */}
        <radialGradient id="ff-web-metal" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#38C068" />
          <stop offset="100%" stopColor="#187838" />
        </radialGradient>

        {/* Eye bump sensor dome */}
        <radialGradient id="ff-dome" cx="40%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#90F0B8" />
          <stop offset="50%" stopColor="#58D888" />
          <stop offset="100%" stopColor="#30B060" />
        </radialGradient>

        {/* Eye glow */}
        <radialGradient id="ff-eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#80FFA0" />
          <stop offset="60%" stopColor="#40E060" />
          <stop offset="100%" stopColor="#20C040" />
        </radialGradient>

        {/* Antenna tip glow */}
        <radialGradient id="ff-antenna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#80FFA0" />
          <stop offset="50%" stopColor="#40E060" />
          <stop offset="100%" stopColor="#20B040" />
        </radialGradient>

        {/* Shadow */}
        <linearGradient id="ff-shadow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Lily pad metallic */}
        <radialGradient id="ff-lily-metal" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#68C080" />
          <stop offset="50%" stopColor="#50A868" />
          <stop offset="100%" stopColor="#309050" />
        </radialGradient>

        {/* Speaker grille */}
        <linearGradient id="ff-grille" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#186838" />
          <stop offset="100%" stopColor="#105028" />
        </linearGradient>
      </defs>

      {/* ════════════════════════════════════════════
          LILY PAD — metallic platform
          ════════════════════════════════════════════ */}
      <g className="lilypad">
        <ellipse cx="102" cy="183" rx="62" ry="15" fill="rgba(0,0,0,0.08)" />
        <ellipse cx="100" cy="180" rx="65" ry="18" fill="url(#ff-lily-metal)" stroke="#187838" strokeWidth="0.8" />
        <path d="M100,162 L94,180 L106,180 Z" fill="rgba(255,255,255,0.15)" />
        {/* Mechanical veins */}
        <path d="M100,180 Q80,175 48,178" fill="none" stroke="rgba(24,120,56,0.3)" strokeWidth="0.8" />
        <path d="M100,180 Q120,175 152,178" fill="none" stroke="rgba(24,120,56,0.3)" strokeWidth="0.8" />
        <path d="M50,172 Q80,162 130,165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* ════════════════════════════════════════════
          BACK LEGS — metallic struts
          ════════════════════════════════════════════ */}
      <g className="leg-left" style={{ transformOrigin: '68px 165px' }}>
        <path d="M68,160 Q55,168 48,168 Q42,166 46,162 Q50,158 60,158 Z"
          fill="url(#ff-limb-metal)" stroke="#208848" strokeWidth="0.5" />
        <path d="M44,166 Q40,172 44,175 Q48,172 48,168" fill="url(#ff-web-metal)" />
        <path d="M48,168 Q46,174 50,176 Q52,172 52,166" fill="url(#ff-web-metal)" />
        {/* Joint rivet */}
        <circle cx="55" cy="163" r="2" fill="#208848" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>

      <g className="leg-right" style={{ transformOrigin: '132px 165px' }}>
        <path d="M132,160 Q145,168 152,168 Q158,166 154,162 Q150,158 140,158 Z"
          fill="url(#ff-limb-metal)" stroke="#208848" strokeWidth="0.5" />
        <path d="M156,166 Q160,172 156,175 Q152,172 152,168" fill="url(#ff-web-metal)" />
        <path d="M152,168 Q154,174 150,176 Q148,172 148,166" fill="url(#ff-web-metal)" />
        <circle cx="145" cy="163" r="2" fill="#208848" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          BODY — metallic torso chassis
          ════════════════════════════════════════════ */}
      <g className="body" style={{ transformOrigin: '100px 145px' }}>
        <path
          d="M58,120 Q48,135 52,155 Q58,172 80,178
             Q90,180 100,178 Q110,180 120,178
             Q142,172 148,155 Q152,135 142,120
             Q125,108 100,110 Q75,108 58,120 Z"
          fill="url(#ff-metal-main)" stroke="#208848" strokeWidth="0.8"
        />
        <ellipse cx="100" cy="150" rx="32" ry="24" fill="url(#ff-belly-panel)" opacity="0.6" />
        {/* ── Display Screen ── */}
        <rect x="80" y="140" width="40" height="24" rx="5" fill="#0A2818" stroke="#40E060" strokeWidth="0.8" opacity="0.9" />
        <rect x="82" y="142" width="36" height="20" rx="4" fill="#051410" />
        {isSpeaking && (
          <g className="screen-waves">
            <rect x="87" y="152" width="4" height="8" rx="2" fill="#40E060" opacity="0.9"
              style={{ transformOrigin: '89px 156px', animation: 'ff-wave1 0.4s ease-in-out infinite' }} />
            <rect x="94" y="148" width="4" height="12" rx="2" fill="#60FF80" opacity="0.8"
              style={{ transformOrigin: '96px 154px', animation: 'ff-wave2 0.35s ease-in-out infinite 0.1s' }} />
            <rect x="101" y="150" width="4" height="10" rx="2" fill="#40E060" opacity="0.85"
              style={{ transformOrigin: '103px 155px', animation: 'ff-wave3 0.45s ease-in-out infinite 0.2s' }} />
            <rect x="108" y="152" width="4" height="8" rx="2" fill="#60FF80" opacity="0.75"
              style={{ transformOrigin: '110px 156px', animation: 'ff-wave1 0.38s ease-in-out infinite 0.15s' }} />
          </g>
        )}
        {!isSpeaking && (
          <g className="screen-idle">
            <line x1="86" y1="152" x2="114" y2="152" stroke="#40E060" strokeWidth="0.5" opacity="0.2" />
          </g>
        )}
        {/* Panel seams */}
        <path d="M72,120 Q76,140 74,165" fill="none" stroke="rgba(32,136,72,0.12)" strokeWidth="0.6" />
        <path d="M128,120 Q124,140 126,165" fill="none" stroke="rgba(32,136,72,0.12)" strokeWidth="0.6" />
        <path d="M56,142 Q100,150 144,142" fill="none" stroke="rgba(32,136,72,0.08)" strokeWidth="0.6" />
        {/* Rim light */}
        <path d="M62,118 Q100,106 138,118" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ════════════════════════════════════════════
          ARMS — metallic appendages
          ════════════════════════════════════════════ */}
      <g className="arm-left" style={{ transformOrigin: '58px 125px' }}>
        <path
          d="M58,120 Q46,128 40,140 Q36,150 40,158 Q44,162 48,158
             Q52,148 54,138 Q56,130 60,125 Z"
          fill="url(#ff-limb-metal)" stroke="#208848" strokeWidth="0.5"
        />
        <path d="M38,156 Q34,162 38,166 Q42,163 42,158" fill="url(#ff-web-metal)" />
        <path d="M42,158 Q40,164 44,167 Q46,162 46,156" fill="url(#ff-web-metal)" />
        <path d="M46,156 Q44,162 48,164 Q50,160 48,154" fill="url(#ff-web-metal)" />
        <circle cx="46" cy="140" r="2.5" fill="#208848" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>

      <g className="arm-right" style={{ transformOrigin: '142px 125px' }}>
        <path
          d="M142,120 Q154,128 160,140 Q164,150 160,158 Q156,162 152,158
             Q148,148 146,138 Q144,130 140,125 Z"
          fill="url(#ff-limb-metal)" stroke="#208848" strokeWidth="0.5"
        />
        <path d="M162,156 Q166,162 162,166 Q158,163 158,158" fill="url(#ff-web-metal)" />
        <path d="M158,158 Q160,164 156,167 Q154,162 154,156" fill="url(#ff-web-metal)" />
        <path d="M154,156 Q156,162 152,164 Q150,160 152,154" fill="url(#ff-web-metal)" />
        <circle cx="154" cy="140" r="2.5" fill="#208848" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          HEAD — robot frog head
          ════════════════════════════════════════════ */}
      <g className="head" style={{ transformOrigin: '100px 82px' }}>
        {/* Neck shadow */}
        <ellipse cx="100" cy="112" rx="30" ry="8" fill="url(#ff-shadow)" />

        {/* ── Single Robot Antenna ── */}
        <g className="antenna" style={{ transformOrigin: '100px 28px' }}>
          <line x1="100" y1="48" x2="100" y2="24" stroke="#38C068" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="22" r="5" fill="url(#ff-antenna-glow)" style={{ animation: 'ff-antenna-pulse 2s ease-in-out infinite' }} />
          <circle cx="99" cy="20.5" r="1.8" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* ── Bulging eye sensor domes ── */}
        <g className="eyebump-left" style={{ transformOrigin: '74px 62px' }}>
          <circle cx="74" cy="62" r="18" fill="url(#ff-dome)" stroke="#208848" strokeWidth="0.8" />
          <path d="M62,52 Q68,46 80,50" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Dome panel ring */}
          <circle cx="74" cy="62" r="13" fill="none" stroke="rgba(32,136,72,0.15)" strokeWidth="0.5" />
        </g>
        <g className="eyebump-right" style={{ transformOrigin: '126px 62px' }}>
          <circle cx="126" cy="62" r="18" fill="url(#ff-dome)" stroke="#208848" strokeWidth="0.8" />
          <path d="M114,52 Q120,46 132,50" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="126" cy="62" r="13" fill="none" stroke="rgba(32,136,72,0.15)" strokeWidth="0.5" />
        </g>

        {/* ── Head panel — wide frog head ── */}
        <ellipse cx="100" cy="90" rx="48" ry="35" fill="url(#ff-metal-head)" stroke="#208848" strokeWidth="0.8" />

        {/* Specular rim */}
        <path d="M60,72 Q85,58 125,65" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Panel lines */}
        <path d="M58,78 Q100,70 142,78" fill="none" stroke="rgba(32,136,72,0.1)" strokeWidth="0.6" />
        <path d="M55,92 Q100,86 145,92" fill="none" stroke="rgba(32,136,72,0.08)" strokeWidth="0.6" />
        {/* Side bolts */}
        <circle cx="55" cy="90" r="2" fill="#208848" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <circle cx="145" cy="90" r="2" fill="#208848" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

        {/* ── Cheek indicator LEDs — orange ── */}
        <circle cx="64" cy="95" r="5" fill="#E87820" opacity="0.35" />
        <circle cx="136" cy="95" r="5" fill="#E87820" opacity="0.35" />

        {/* ── Eyes ── */}
        <g className="eyes">
          <FrogEyes mood={mood} />
        </g>

        {/* ── Nostril sensors ── */}
        <ellipse cx="92" cy="90" rx="2.5" ry="2" fill="#187838" />
        <ellipse cx="92" cy="89.5" rx="1" ry="0.6" fill="rgba(64,224,96,0.2)" />
        <ellipse cx="108" cy="90" rx="2.5" ry="2" fill="#187838" />
        <ellipse cx="108" cy="89.5" rx="1" ry="0.6" fill="rgba(64,224,96,0.2)" />

        {/* ── Speaker grille mouth area ── */}
        <ellipse cx="100" cy="104" rx="20" ry="8" fill="url(#ff-grille)" stroke="#187838" strokeWidth="0.4" />
        <line x1="84" y1="102" x2="116" y2="102" stroke="rgba(64,224,96,0.08)" strokeWidth="0.4" />
        <line x1="82" y1="105" x2="118" y2="105" stroke="rgba(64,224,96,0.08)" strokeWidth="0.4" />
        <line x1="84" y1="108" x2="116" y2="108" stroke="rgba(64,224,96,0.08)" strokeWidth="0.4" />

        {/* ── Mouth ── */}
        <g className="mouth">
          <FrogMouth mood={mood} />
        </g>


      </g>
    </svg>
  );
}

/* ─── Eye rendering per mood — big cute anime eyes ─── */
function FrogEyes({ mood }: { mood: CharacterMood }) {
  const scleraL = <ellipse cx="74" cy="58" rx="12" ry="13" fill="white" stroke="#208848" strokeWidth="0.8" />;
  const scleraR = <ellipse cx="126" cy="58" rx="12" ry="13" fill="white" stroke="#208848" strokeWidth="0.8" />;

  const eyePair = (irisY: number, irisR = 8.5, pupilR = 3.5) => (
    <>
      {scleraL}
      <circle cx="74" cy={irisY} r={irisR} fill="url(#ff-eye-glow)" />
      <circle cx="74" cy={irisY} r={pupilR} fill="#082010" />
      <circle cx="77" cy={irisY - 5} r="3" fill="white" opacity="0.9" />
      <circle cx="73" cy={irisY + 4} r="1.5" fill="white" opacity="0.6" />
      {scleraR}
      <circle cx="126" cy={irisY} r={irisR} fill="url(#ff-eye-glow)" />
      <circle cx="126" cy={irisY} r={pupilR} fill="#082010" />
      <circle cx="129" cy={irisY - 5} r="3" fill="white" opacity="0.9" />
      <circle cx="125" cy={irisY + 4} r="1.5" fill="white" opacity="0.6" />
    </>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eyePair(56, 9.5)}
          <path d="M62,46 l2,-5 l2,5 l-4,0 Z" fill="#FFE66D" />
          <path d="M134,45 l1.5,-3.5 l1.5,3.5 l-3,0 Z" fill="#FFE66D" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {scleraL}
          <circle cx="76" cy="59" r="8" fill="url(#ff-eye-glow)" />
          <circle cx="76" cy="59" r="3.2" fill="#082010" />
          <circle cx="79" cy="54" r="2.8" fill="white" opacity="0.9" />
          {scleraR}
          <circle cx="128" cy="59" r="8" fill="url(#ff-eye-glow)" />
          <circle cx="128" cy="59" r="3.2" fill="#082010" />
          <circle cx="131" cy="54" r="2.8" fill="white" opacity="0.9" />
        </>
      );
    case 'encouraging':
      return (
        <>
          {scleraL}
          <circle cx="74" cy="60" r="8.5" fill="url(#ff-eye-glow)" />
          <circle cx="74" cy="60" r="3.5" fill="#082010" />
          <circle cx="77" cy="55" r="3" fill="white" opacity="0.9" />
          <path d="M63,53 Q74,47 85,53" fill="white" stroke="#208848" strokeWidth="0.5" />
          {scleraR}
          <circle cx="126" cy="60" r="8.5" fill="url(#ff-eye-glow)" />
          <circle cx="126" cy="60" r="3.5" fill="#082010" />
          <circle cx="129" cy="55" r="3" fill="white" opacity="0.9" />
          <path d="M115,53 Q126,47 137,53" fill="white" stroke="#208848" strokeWidth="0.5" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eyePair(59, 8.5)}
          <path d="M64,48 Q74,51 84,48" fill="none" stroke="#208848" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M116,48 Q126,45 136,48" fill="none" stroke="#208848" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default: // happy
      return eyePair(57);
  }
}

/* ─── Mouth rendering per mood — LED mouth ─── */
function FrogMouth({ mood }: { mood: CharacterMood }) {
  switch (mood) {
    case 'excited':
      return (
        <path d="M78,104 Q100,114 122,104" fill="none" stroke="#40E060" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      );
    case 'thinking':
      return (
        <path d="M90,105 Q100,103 110,105" fill="none" stroke="#40E060" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      );
    case 'encouraging':
      return (
        <path d="M82,104 Q100,110 118,104" fill="none" stroke="#40E060" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
      );
    case 'headShake':
      return (
        <path d="M88,105 Q100,103 112,105" fill="none" stroke="#40E060" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      );
    default: // happy — wide grin
      return (
        <path d="M78,104 Q100,112 122,104" fill="none" stroke="#40E060" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      );
  }
}
