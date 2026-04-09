import type { CharacterMood } from '../../types';

interface OllieOwlProps {
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/**
 * OllieOwl — Robot-head SVG character.
 *
 * Metallic owl-shaped robot head with ear-tuft antennae panels, glowing purple
 * sensor eyes behind glasses frames, single antenna, and sound-wave bars for speech.
 * Preserves all 5 mood states and existing transformOrigin layout.
 */
export default function OllieOwl({ mood = 'happy', className, isSpeaking }: OllieOwlProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <style>{`
          @keyframes oo-wave1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
          @keyframes oo-wave2 { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(0.8)} }
          @keyframes oo-wave3 { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
          @keyframes oo-antenna-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        `}</style>

        {/* Body metallic purple */}
        <radialGradient id="oo-body-metal" cx="38%" cy="28%" r="65%" fx="35%" fy="26%">
          <stop offset="0%" stopColor="#C8A8E0" />
          <stop offset="35%" stopColor="#9878B8" />
          <stop offset="70%" stopColor="#7858A0" />
          <stop offset="100%" stopColor="#583880" />
        </radialGradient>

        {/* Head metallic */}
        <radialGradient id="oo-head-metal" cx="42%" cy="32%" r="58%" fx="40%" fy="30%">
          <stop offset="0%" stopColor="#D8C0F0" />
          <stop offset="35%" stopColor="#B090D0" />
          <stop offset="70%" stopColor="#8868B0" />
          <stop offset="100%" stopColor="#684890" />
        </radialGradient>

        {/* Chest plate */}
        <radialGradient id="oo-chest-metal" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#E8E0F0" />
          <stop offset="50%" stopColor="#D0C0E0" />
          <stop offset="100%" stopColor="#B8A0D0" />
        </radialGradient>

        {/* Wing metallic */}
        <linearGradient id="oo-wing-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8868B0" />
          <stop offset="50%" stopColor="#6848A0" />
          <stop offset="100%" stopColor="#483880" />
        </linearGradient>

        {/* Facial disc — lighter metallic */}
        <radialGradient id="oo-disc-metal" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#E0D8F0" />
          <stop offset="50%" stopColor="#C8B8E0" />
          <stop offset="100%" stopColor="#B0A0D0" />
        </radialGradient>

        {/* Beak metallic */}
        <linearGradient id="oo-beak-metal" x1="0.3" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#E8A830" />
          <stop offset="50%" stopColor="#D08818" />
          <stop offset="100%" stopColor="#B06800" />
        </linearGradient>

        {/* Foot metallic */}
        <linearGradient id="oo-foot-metal" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#D09020" />
          <stop offset="100%" stopColor="#A06800" />
        </linearGradient>

        {/* Glasses — blue metallic */}
        <linearGradient id="oo-glass-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#70B8F0" />
          <stop offset="50%" stopColor="#5098D8" />
          <stop offset="100%" stopColor="#3878B8" />
        </linearGradient>

        {/* Eye glow */}
        <radialGradient id="oo-eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D8A0FF" />
          <stop offset="60%" stopColor="#B060FF" />
          <stop offset="100%" stopColor="#8030E0" />
        </radialGradient>

        {/* Antenna tip glow */}
        <radialGradient id="oo-antenna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D8A0FF" />
          <stop offset="50%" stopColor="#B060FF" />
          <stop offset="100%" stopColor="#8838D0" />
        </radialGradient>

        {/* Ear tuft metallic */}
        <linearGradient id="oo-tuft-metal" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#8868B0" />
          <stop offset="100%" stopColor="#583880" />
        </linearGradient>

        {/* Shadow */}
        <linearGradient id="oo-shadow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Speaker grille */}
        <linearGradient id="oo-grille" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3A3050" />
          <stop offset="100%" stopColor="#2A2040" />
        </linearGradient>
      </defs>

      {/* ════════════════════════════════════════════
          FEET — metallic talons
          ════════════════════════════════════════════ */}
      <g className="leg-left" style={{ transformOrigin: '78px 186px' }}>
        <path d="M78,182 L68,194 L78,190 L88,194 L78,182" fill="url(#oo-foot-metal)" stroke="#A06800" strokeWidth="0.5" />
      </g>
      <g className="leg-right" style={{ transformOrigin: '122px 186px' }}>
        <path d="M122,182 L112,194 L122,190 L132,194 L122,182" fill="url(#oo-foot-metal)" stroke="#A06800" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          BODY — metallic torso
          ════════════════════════════════════════════ */}
      <g className="body" style={{ transformOrigin: '100px 140px' }}>
        <path
          d="M52,105 Q42,125 46,150 Q50,172 68,185
             Q82,192 100,193 Q118,192 132,185
             Q150,172 154,150 Q158,125 148,105
             Q132,90 100,88 Q68,90 52,105 Z"
          fill="url(#oo-body-metal)" stroke="#583880" strokeWidth="0.8"
        />
        {/* Chest plate — scalloped metallic */}
        <path
          d="M72,115 Q80,107 88,115 Q96,107 104,115 Q112,107 120,115 Q128,107 128,115
             L128,155 Q128,172 100,178 Q72,172 72,155 Z"
          fill="url(#oo-chest-metal)" stroke="rgba(136,104,176,0.4)" strokeWidth="0.5"
        />
        {/* Panel seams on chest */}
        <path d="M74,128 Q82,122 90,128 Q98,122 106,128 Q114,122 122,128" fill="none" stroke="rgba(104,72,144,0.15)" strokeWidth="0.5" />
        <path d="M76,142 Q84,136 92,142 Q100,136 108,142 Q116,136 124,142" fill="none" stroke="rgba(104,72,144,0.12)" strokeWidth="0.5" />
        {/* ── Display Screen ── */}
        <rect x="80" y="150" width="40" height="24" rx="5" fill="#1A1030" stroke="#B060FF" strokeWidth="0.8" opacity="0.9" />
        <rect x="82" y="152" width="36" height="20" rx="4" fill="#0D0820" />
        {isSpeaking && (
          <g className="screen-waves">
            <rect x="87" y="162" width="4" height="8" rx="2" fill="#B060FF" opacity="0.9"
              style={{ transformOrigin: '89px 166px', animation: 'oo-wave1 0.4s ease-in-out infinite' }} />
            <rect x="94" y="158" width="4" height="12" rx="2" fill="#C880FF" opacity="0.8"
              style={{ transformOrigin: '96px 164px', animation: 'oo-wave2 0.35s ease-in-out infinite 0.1s' }} />
            <rect x="101" y="160" width="4" height="10" rx="2" fill="#B060FF" opacity="0.85"
              style={{ transformOrigin: '103px 165px', animation: 'oo-wave3 0.45s ease-in-out infinite 0.2s' }} />
            <rect x="108" y="162" width="4" height="8" rx="2" fill="#C880FF" opacity="0.75"
              style={{ transformOrigin: '110px 166px', animation: 'oo-wave1 0.38s ease-in-out infinite 0.15s' }} />
          </g>
        )}
        {!isSpeaking && (
          <g className="screen-idle">
            <line x1="86" y1="162" x2="114" y2="162" stroke="#B060FF" strokeWidth="0.5" opacity="0.2" />
          </g>
        )}
        {/* Specular highlight */}
        <path d="M58,100 Q100,86 142,100" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />
        {/* Longitudinal panel lines */}
        <path d="M72,95 Q68,140 74,185" fill="none" stroke="rgba(88,56,128,0.08)" strokeWidth="0.5" />
        <path d="M128,95 Q132,140 126,185" fill="none" stroke="rgba(88,56,128,0.08)" strokeWidth="0.5" />
      </g>

      {/* ════════════════════════════════════════════
          WINGS — metallic panels
          ════════════════════════════════════════════ */}
      <g className="arm-left" style={{ transformOrigin: '55px 118px' }}>
        <path
          d="M55,110 Q36,122 30,140 Q26,155 32,162 Q38,168 44,160
             Q48,148 50,138 Q52,128 55,118 Z"
          fill="url(#oo-wing-metal)" stroke="#483880" strokeWidth="0.5"
        />
        <path d="M32,160 Q28,155 34,150" fill="#483880" />
        <path d="M38,156 Q34,150 40,146" fill="#483880" />
        <path d="M42,152 Q38,146 44,142" fill="#483880" />
        <path d="M54,112 Q40,126 32,145" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <g className="arm-right" style={{ transformOrigin: '145px 118px' }}>
        <path
          d="M145,110 Q164,122 170,140 Q174,155 168,162 Q162,168 156,160
             Q152,148 150,138 Q148,128 145,118 Z"
          fill="url(#oo-wing-metal)" stroke="#483880" strokeWidth="0.5"
        />
        <path d="M168,160 Q172,155 166,150" fill="#483880" />
        <path d="M162,156 Q166,150 160,146" fill="#483880" />
        <path d="M158,152 Q162,146 156,142" fill="#483880" />
        <path d="M146,112 Q160,126 168,145" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* ════════════════════════════════════════════
          HEAD — robot owl head
          ════════════════════════════════════════════ */}
      <g className="head" style={{ transformOrigin: '100px 76px' }}>
        {/* Neck shadow */}
        <ellipse cx="100" cy="96" rx="26" ry="7" fill="url(#oo-shadow)" />

        {/* ── Single Robot Antenna ── */}
        <g className="antenna" style={{ transformOrigin: '100px 18px' }}>
          <line x1="100" y1="38" x2="100" y2="14" stroke="#8868B0" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="12" r="5" fill="url(#oo-antenna-glow)" style={{ animation: 'oo-antenna-pulse 2s ease-in-out infinite' }} />
          <circle cx="99" cy="10.5" r="1.8" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* ── Ear tufts — metallic pointed panels ── */}
        <g style={{ transformOrigin: '66px 42px' }}>
          <path d="M64,48 Q56,26 66,30 Q74,34 68,50" fill="url(#oo-tuft-metal)" stroke="#483880" strokeWidth="0.6" />
          <path d="M62,40 Q58,30 64,32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeLinecap="round" />
        </g>
        <g style={{ transformOrigin: '134px 42px' }}>
          <path d="M136,48 Q144,26 134,30 Q126,34 132,50" fill="url(#oo-tuft-metal)" stroke="#483880" strokeWidth="0.6" />
          <path d="M138,40 Q142,30 136,32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ── Head sphere — metallic ── */}
        <circle cx="100" cy="76" r="44" fill="url(#oo-head-metal)" stroke="#583880" strokeWidth="0.8" />

        {/* Specular rim */}
        <path d="M68,44 Q88,34 118,38" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Panel lines */}
        <path d="M60,58 Q100,50 140,58" fill="none" stroke="rgba(88,56,128,0.08)" strokeWidth="0.6" />
        <path d="M58,76 Q100,70 142,76" fill="none" stroke="rgba(88,56,128,0.06)" strokeWidth="0.6" />
        {/* Side bolts */}
        <circle cx="58" cy="76" r="2" fill="#583880" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <circle cx="142" cy="76" r="2" fill="#583880" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

        {/* ── Facial disc — lighter metallic panel ── */}
        <path
          d="M66,62 Q100,48 134,62 Q142,76 134,92 Q100,106 66,92 Q58,76 66,62"
          fill="url(#oo-disc-metal)" stroke="rgba(136,104,176,0.3)" strokeWidth="0.5"
        />

        {/* ── Glasses — metallic frames ── */}
        <g className="glasses">
          <circle cx="82" cy="74" r="17" fill="none" stroke="url(#oo-glass-metal)" strokeWidth="3.5" />
          <circle cx="118" cy="74" r="17" fill="none" stroke="url(#oo-glass-metal)" strokeWidth="3.5" />
          <path d="M99,74 L101,74" stroke="url(#oo-glass-metal)" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="82" cy="74" r="15" fill="rgba(80,152,216,0.06)" />
          <circle cx="118" cy="74" r="15" fill="rgba(80,152,216,0.06)" />
          <path d="M72,68 Q78,64 84,68" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M108,68 Q114,64 120,68" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* ── Eyes ── */}
        <g className="eyes">
          <OwlEyes mood={mood} />
        </g>

        {/* ── Beak — metallic ── */}
        <g className="beak">
          <path d="M96,88 L100,98 L104,88" fill="url(#oo-beak-metal)" stroke="#A06800" strokeWidth="0.5" />
          <path d="M97,89 L100,96" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ── Mouth ── */}
        <g className="mouth">
          <OwlMouth mood={mood} />
        </g>


      </g>
    </svg>
  );
}

/* ─── Eye rendering per mood — big cute anime eyes ─── */
function OwlEyes({ mood }: { mood: CharacterMood }) {
  const scleraL = <ellipse cx="82" cy="72" rx="11" ry="12" fill="white" stroke="#684890" strokeWidth="0.8" />;
  const scleraR = <ellipse cx="118" cy="72" rx="11" ry="12" fill="white" stroke="#684890" strokeWidth="0.8" />;

  const eyePair = (irisY: number, irisR = 7.5, pupilR = 3.2) => (
    <>
      {scleraL}
      <circle cx="82" cy={irisY} r={irisR} fill="url(#oo-eye-glow)" />
      <circle cx="82" cy={irisY} r={pupilR} fill="#0E0820" />
      <circle cx="85" cy={irisY - 4} r="2.8" fill="white" opacity="0.9" />
      <circle cx="81" cy={irisY + 3} r="1.3" fill="white" opacity="0.6" />
      {scleraR}
      <circle cx="118" cy={irisY} r={irisR} fill="url(#oo-eye-glow)" />
      <circle cx="118" cy={irisY} r={pupilR} fill="#0E0820" />
      <circle cx="121" cy={irisY - 4} r="2.8" fill="white" opacity="0.9" />
      <circle cx="117" cy={irisY + 3} r="1.3" fill="white" opacity="0.6" />
    </>
  );

  switch (mood) {
    case 'excited':
      return (
        <>
          {eyePair(71, 8.5)}
          <path d="M72,60 l1.5,-4 l1.5,4 l-3,0 Z" fill="#FFE66D" />
          <path d="M126,59 l1,-3 l1,3 l-2,0 Z" fill="#FFE66D" opacity="0.8" />
        </>
      );
    case 'thinking':
      return (
        <>
          {scleraL}
          <circle cx="84" cy="73" r="7" fill="url(#oo-eye-glow)" />
          <circle cx="84" cy="73" r="3" fill="#0E0820" />
          <circle cx="86" cy="69" r="2.5" fill="white" opacity="0.9" />
          {scleraR}
          <circle cx="120" cy="73" r="7" fill="url(#oo-eye-glow)" />
          <circle cx="120" cy="73" r="3" fill="#0E0820" />
          <circle cx="122" cy="69" r="2.5" fill="white" opacity="0.9" />
        </>
      );
    case 'encouraging':
      return (
        <>
          {scleraL}
          <circle cx="82" cy="74" r="7.5" fill="url(#oo-eye-glow)" />
          <circle cx="82" cy="74" r="3.2" fill="#0E0820" />
          <circle cx="85" cy="70" r="2.8" fill="white" opacity="0.9" />
          <path d="M72,67 Q82,62 92,67" fill="white" stroke="#684890" strokeWidth="0.5" />
          {scleraR}
          <circle cx="118" cy="74" r="7.5" fill="url(#oo-eye-glow)" />
          <circle cx="118" cy="74" r="3.2" fill="#0E0820" />
          <circle cx="121" cy="70" r="2.8" fill="white" opacity="0.9" />
          <path d="M108,67 Q118,62 128,67" fill="white" stroke="#684890" strokeWidth="0.5" />
        </>
      );
    case 'headShake':
      return (
        <>
          {eyePair(73, 7.5)}
          <path d="M74,62 Q82,64 90,62" fill="none" stroke="#684890" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M110,62 Q118,60 126,62" fill="none" stroke="#684890" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      );
    default: // happy
      return eyePair(72);
  }
}

/* ─── Mouth rendering per mood — LED mouth ─── */
function OwlMouth({ mood }: { mood: CharacterMood }) {
  switch (mood) {
    case 'excited':
      return (
        <path d="M94,101 Q100,108 106,101" fill="none" stroke="#B060FF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      );
    case 'thinking':
      return (
        <path d="M96,102 Q100,100 104,102" fill="none" stroke="#B060FF" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      );
    case 'encouraging':
      return (
        <path d="M94,101 Q100,106 106,101" fill="none" stroke="#B060FF" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      );
    case 'headShake':
      return (
        <path d="M95,102 Q100,100 105,102" fill="none" stroke="#B060FF" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      );
    default: // happy
      return (
        <path d="M94,101 Q100,107 106,101" fill="none" stroke="#B060FF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      );
  }
}
