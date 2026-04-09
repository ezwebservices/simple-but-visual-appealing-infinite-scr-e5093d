import type { CharacterMood } from '../../types';

interface ZiggyZebraProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * ZiggyZebra — Robot-head SVG character.
 *
 * Metallic zebra-shaped robot head with elongated face panel, pointy ear
 * fins, rainbow LED stripes, glowing eyes, single antenna, and sound-wave
 * bars for speech. Preserves all 5 mood states and existing transformOrigin.
 */
export default function ZiggyZebra({ mood = 'happy', className, isSpeaking }: ZiggyZebraProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <style>{`
          @keyframes zz-wave1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
          @keyframes zz-wave2 { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(0.8)} }
          @keyframes zz-wave3 { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
          @keyframes zz-antenna-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        `}</style>

        {/* Body — white/silver metallic */}
        <radialGradient id="zz-body-metal" cx="38%" cy="28%" r="65%" fx="35%" fy="26%">
          <stop offset="0%" stopColor="#F0F4F8" />
          <stop offset="35%" stopColor="#D8E0E8" />
          <stop offset="70%" stopColor="#B8C4D0" />
          <stop offset="100%" stopColor="#98A8B8" />
        </radialGradient>

        {/* Head — slightly brighter silver */}
        <radialGradient id="zz-head-metal" cx="42%" cy="32%" r="58%" fx="40%" fy="30%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="35%" stopColor="#E8EDF2" />
          <stop offset="70%" stopColor="#D0D8E0" />
          <stop offset="100%" stopColor="#B0BCC8" />
        </radialGradient>

        {/* Belly panel */}
        <radialGradient id="zz-belly-metal" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F0F2F5" />
          <stop offset="100%" stopColor="#E0E4E8" />
        </radialGradient>

        {/* Limb metallic */}
        <linearGradient id="zz-limb-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D8E0E8" />
          <stop offset="50%" stopColor="#B8C4D0" />
          <stop offset="100%" stopColor="#98A8B8" />
        </linearGradient>

        {/* Muzzle panel */}
        <radialGradient id="zz-muzzle-metal" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="50%" stopColor="#E8ECF0" />
          <stop offset="100%" stopColor="#D0D8E0" />
        </radialGradient>

        {/* Hoof — dark metallic */}
        <linearGradient id="zz-hoof-metal" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#707880" />
          <stop offset="50%" stopColor="#505860" />
          <stop offset="100%" stopColor="#383E48" />
        </linearGradient>

        {/* Ear inner LED pink */}
        <radialGradient id="zz-ear-led" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFD0D8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.3" />
        </radialGradient>

        {/* Eye glow — rainbow-ish warm */}
        <radialGradient id="zz-eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE080" />
          <stop offset="60%" stopColor="#E8A840" />
          <stop offset="100%" stopColor="#D08820" />
        </radialGradient>

        {/* Antenna tip glow — rainbow */}
        <radialGradient id="zz-antenna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB8C0" />
          <stop offset="33%" stopColor="#A8E0FF" />
          <stop offset="66%" stopColor="#A8F0C8" />
          <stop offset="100%" stopColor="#FFE070" />
        </radialGradient>

        {/* Shadow */}
        <linearGradient id="zz-shadow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Speaker grille */}
        <linearGradient id="zz-grille" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#606870" />
          <stop offset="100%" stopColor="#484E58" />
        </linearGradient>
      </defs>

      {/* ════════════════════════════════════════════
          LEGS — metallic struts with hooves
          ════════════════════════════════════════════ */}
      <g className="leg-left" style={{ transformOrigin: '80px 180px' }}>
        <path d="M74,178 Q70,188 72,196 L88,196 Q90,188 86,178 Z"
          fill="url(#zz-limb-metal)" stroke="#98A8B8" strokeWidth="0.5" />
        <rect x="70" y="194" width="20" height="5" rx="2.5" fill="url(#zz-hoof-metal)" />
        <line x1="80" y1="178" x2="80" y2="194" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
        <path d="M76,178 Q72,186 73,194" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      </g>
      <g className="leg-right" style={{ transformOrigin: '120px 180px' }}>
        <path d="M114,178 Q110,188 112,196 L128,196 Q130,188 126,178 Z"
          fill="url(#zz-limb-metal)" stroke="#98A8B8" strokeWidth="0.5" />
        <rect x="110" y="194" width="20" height="5" rx="2.5" fill="url(#zz-hoof-metal)" />
        <line x1="120" y1="178" x2="120" y2="194" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
        <path d="M116,178 Q112,186 113,194" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* ════════════════════════════════════════════
          BODY — metallic torso with LED stripes
          ════════════════════════════════════════════ */}
      <g className="body" style={{ transformOrigin: '100px 148px' }}>
        <path
          d="M56,115 Q44,130 48,155 Q52,175 72,185
             Q85,190 100,190 Q115,190 128,185
             Q148,175 152,155 Q156,130 144,115
             Q130,105 100,103 Q70,105 56,115 Z"
          fill="url(#zz-body-metal)" stroke="#98A8B8" strokeWidth="0.8"
        />
        {/* Rainbow LED stripes on body */}
        <path d="M66,126 Q82,121 94,126" stroke="#FFB6C1" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M62,138 Q82,131 98,138" stroke="#87CEEB" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M64,150 Q84,143 100,150" stroke="#A8E6CF" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M68,162 Q86,155 100,162" stroke="#B8A9C9" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M106,126 Q118,121 134,126" stroke="#FFE66D" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M102,138 Q118,131 138,138" stroke="#FFB6C1" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M100,150 Q116,143 136,150" stroke="#87CEEB" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M100,162 Q114,155 132,162" stroke="#A8E6CF" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        {/* Belly panel */}
        <ellipse cx="100" cy="155" rx="24" ry="20" fill="url(#zz-belly-metal)" opacity="0.5" />
        {/* ── Display Screen ── */}
        <rect x="80" y="148" width="40" height="24" rx="5" fill="#2A3040" stroke="#87CEEB" strokeWidth="0.8" opacity="0.9" />
        <rect x="82" y="150" width="36" height="20" rx="4" fill="#151C28" />
        {isSpeaking && (
          <g className="screen-waves">
            <rect x="87" y="160" width="4" height="8" rx="2" fill="#87CEEB" opacity="0.9"
              style={{ transformOrigin: '89px 164px', animation: 'zz-wave1 0.4s ease-in-out infinite' }} />
            <rect x="94" y="156" width="4" height="12" rx="2" fill="#FFB6C1" opacity="0.8"
              style={{ transformOrigin: '96px 162px', animation: 'zz-wave2 0.35s ease-in-out infinite 0.1s' }} />
            <rect x="101" y="158" width="4" height="10" rx="2" fill="#A8E6CF" opacity="0.85"
              style={{ transformOrigin: '103px 163px', animation: 'zz-wave3 0.45s ease-in-out infinite 0.2s' }} />
            <rect x="108" y="160" width="4" height="8" rx="2" fill="#B8A9C9" opacity="0.75"
              style={{ transformOrigin: '110px 164px', animation: 'zz-wave1 0.38s ease-in-out infinite 0.15s' }} />
          </g>
        )}
        {!isSpeaking && (
          <g className="screen-idle">
            <line x1="86" y1="160" x2="114" y2="160" stroke="#87CEEB" strokeWidth="0.5" opacity="0.2" />
          </g>
        )}
        {/* Specular */}
        <path d="M60,112 Q100,100 140,112" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
        {/* Panel seams */}
        <path d="M70,108 Q66,145 74,185" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
        <path d="M130,108 Q134,145 126,185" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          ARMS — metallic appendages
          ════════════════════════════════════════════ */}
      <g className="arm-left" style={{ transformOrigin: '56px 118px' }}>
        <path
          d="M56,115 Q42,125 36,142 Q34,152 38,160 Q42,164 46,158
             Q48,148 50,140 Q52,130 56,122 Z"
          fill="url(#zz-limb-metal)" stroke="#98A8B8" strokeWidth="0.5"
        />
        <circle cx="44" cy="140" r="2.5" fill="#98A8B8" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>
      <g className="arm-right" style={{ transformOrigin: '144px 118px' }}>
        <path
          d="M144,115 Q158,125 164,142 Q166,152 162,160 Q158,164 154,158
             Q152,148 150,140 Q148,130 144,122 Z"
          fill="url(#zz-limb-metal)" stroke="#98A8B8" strokeWidth="0.5"
        />
        <circle cx="156" cy="140" r="2.5" fill="#98A8B8" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          HEAD — robot zebra head
          ════════════════════════════════════════════ */}
      <g className="head" style={{ transformOrigin: '100px 68px' }}>
        {/* Neck shadow */}
        <ellipse cx="100" cy="108" rx="26" ry="7" fill="url(#zz-shadow)" />

        {/* ── Single Robot Antenna ── */}
        <g className="antenna" style={{ transformOrigin: '100px 2px' }}>
          <line x1="100" y1="22" x2="100" y2="4" stroke="#B0BCC8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="2" r="5" fill="url(#zz-antenna-glow)" style={{ animation: 'zz-antenna-pulse 2s ease-in-out infinite' }} />
          <circle cx="99" cy="0.5" r="1.8" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* ── Ears — metallic pointed panels ── */}
        <g className="ear-left" style={{ transformOrigin: '72px 30px' }}>
          <path d="M72,35 Q64,16 72,20 Q78,24 74,38" fill="url(#zz-head-metal)" stroke="#98A8B8" strokeWidth="0.6" />
          <path d="M72,33 Q66,20 71,22" fill="url(#zz-ear-led)" />
        </g>
        <g className="ear-right" style={{ transformOrigin: '128px 30px' }}>
          <path d="M128,35 Q136,16 128,20 Q122,24 126,38" fill="url(#zz-head-metal)" stroke="#98A8B8" strokeWidth="0.6" />
          <path d="M128,33 Q134,20 129,22" fill="url(#zz-ear-led)" />
        </g>

        {/* ── Head — elongated metallic horse shape ── */}
        <path
          d="M68,55 Q60,38 70,28 Q85,18 100,20 Q115,18 130,28 Q140,38 132,55
             Q138,75 132,95 Q120,108 100,110 Q80,108 68,95 Q62,75 68,55"
          fill="url(#zz-head-metal)" stroke="#98A8B8" strokeWidth="0.8"
        />

        {/* Specular rim */}
        <path d="M74,38 Q95,28 120,32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Panel lines */}
        <path d="M70,50 Q100,44 130,50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.6" />
        <path d="M66,68 Q100,62 134,68" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.6" />
        <path d="M68,85 Q100,80 132,85" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.6" />
        {/* Vertical center seam */}
        <line x1="100" y1="22" x2="100" y2="50" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
        {/* Side bolts */}
        <circle cx="64" cy="75" r="2" fill="#98A8B8" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <circle cx="136" cy="75" r="2" fill="#98A8B8" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

        {/* Rainbow LED stripes on face */}
        <path d="M74,43 Q88,38 96,43" stroke="#FFB6C1" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M104,43 Q112,38 126,43" stroke="#87CEEB" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M72,53 Q86,48 96,53" stroke="#A8E6CF" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M104,53 Q114,48 128,53" stroke="#B8A9C9" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />

        {/* ── Cheek LEDs ── */}
        <circle cx="74" cy="80" r="4" fill="#FFB6C1" opacity="0.3" />
        <circle cx="126" cy="80" r="4" fill="#87CEEB" opacity="0.3" />

        {/* ── Eyes ── */}
        <g className="eyes">
          <ZebraEyes mood={mood} />
        </g>

        {/* ── Muzzle — metallic panel ── */}
        <ellipse cx="100" cy="92" rx="20" ry="14" fill="url(#zz-muzzle-metal)" stroke="#B0BCC8" strokeWidth="0.6" />
        {/* Muzzle panel lines */}
        <path d="M86,86 Q100,82 114,86" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
        {/* Nostril sensors */}
        <ellipse cx="93" cy="91" rx="2.5" ry="2" fill="#707880" />
        <ellipse cx="93" cy="90.5" rx="1" ry="0.6" fill="rgba(255,255,255,0.15)" />
        <ellipse cx="107" cy="91" rx="2.5" ry="2" fill="#707880" />
        <ellipse cx="107" cy="90.5" rx="1" ry="0.6" fill="rgba(255,255,255,0.15)" />

        {/* ── Mouth ── */}
        <g className="mouth">
          <ZebraMouth mood={mood} />
        </g>

      </g>
    </svg>
  );
}

/* ─── Eye rendering per mood — big cute anime eyes ─── */
function ZebraEyes({ mood }: { mood: CharacterMood }) {
  const scleraL = <ellipse cx="84" cy="64" rx="10" ry="11" fill="white" stroke="#98A8B8" strokeWidth="0.8" />;
  const scleraR = <ellipse cx="116" cy="64" rx="10" ry="11" fill="white" stroke="#98A8B8" strokeWidth="0.8" />;

  const eyePair = (irisY: number, irisR = 7, pupilR = 3) => (
    <>
      {scleraL}
      <circle cx="84" cy={irisY} r={irisR} fill="url(#zz-eye-glow)" />
      <circle cx="84" cy={irisY} r={pupilR} fill="#1A1420" />
      <circle cx="87" cy={irisY - 4} r="2.8" fill="white" opacity="0.9" />
      <circle cx="83" cy={irisY + 3} r="1.3" fill="white" opacity="0.6" />
      {scleraR}
      <circle cx="116" cy={irisY} r={irisR} fill="url(#zz-eye-glow)" />
      <circle cx="116" cy={irisY} r={pupilR} fill="#1A1420" />
      <circle cx="119" cy={irisY - 4} r="2.8" fill="white" opacity="0.9" />
      <circle cx="115" cy={irisY + 3} r="1.3" fill="white" opacity="0.6" />
    </>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eyePair(63, 8)}
          <path d="M74,54 l1.5,-4 l1.5,4 l-3,0 Z" fill="#FFE66D" />
          <path d="M124,53 l1,-3 l1,3 l-2,0 Z" fill="#FFE66D" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {scleraL}
          <circle cx="86" cy="65" r="6.5" fill="url(#zz-eye-glow)" />
          <circle cx="86" cy="65" r="2.8" fill="#1A1420" />
          <circle cx="88" cy="61" r="2.5" fill="white" opacity="0.9" />
          {scleraR}
          <circle cx="118" cy="65" r="6.5" fill="url(#zz-eye-glow)" />
          <circle cx="118" cy="65" r="2.8" fill="#1A1420" />
          <circle cx="120" cy="61" r="2.5" fill="white" opacity="0.9" />
        </>
      );
    case 'encouraging':
      return (
        <>
          {scleraL}
          <circle cx="84" cy="66" r="7" fill="url(#zz-eye-glow)" />
          <circle cx="84" cy="66" r="3" fill="#1A1420" />
          <circle cx="87" cy="62" r="2.8" fill="white" opacity="0.9" />
          <path d="M75,59 Q84,54 93,59" fill="white" stroke="#98A8B8" strokeWidth="0.5" />
          {scleraR}
          <circle cx="116" cy="66" r="7" fill="url(#zz-eye-glow)" />
          <circle cx="116" cy="66" r="3" fill="#1A1420" />
          <circle cx="119" cy="62" r="2.8" fill="white" opacity="0.9" />
          <path d="M107,59 Q116,54 125,59" fill="white" stroke="#98A8B8" strokeWidth="0.5" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eyePair(65, 7)}
          <path d="M76,56 Q84,58 92,56" fill="none" stroke="#98A8B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M108,56 Q116,54 124,56" fill="none" stroke="#98A8B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default: // happy
      return eyePair(63);
  }
}

/* ─── Mouth rendering per mood — LED mouth ─── */
function ZebraMouth({ mood }: { mood: CharacterMood }) {
  switch (mood) {
    case 'excited':
      return (
        <path d="M90,100 Q100,108 110,100" fill="none" stroke="#E8A840" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      );
    case 'thinking':
      return (
        <path d="M94,102 Q100,100 106,102" fill="none" stroke="#E8A840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      );
    case 'encouraging':
      return (
        <path d="M90,101 Q100,107 110,101" fill="none" stroke="#E8A840" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      );
    case 'headShake':
      return (
        <path d="M94,102 Q100,100 106,102" fill="none" stroke="#E8A840" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      );
    default: // happy
      return (
        <path d="M88,100 Q100,110 112,100" fill="none" stroke="#E8A840" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      );
  }
}
