interface RobotCoinIconProps {
  size?: number;
  className?: string;
}

/**
 * RobotCoinIcon — A friendly robot face on a gold/bronze coin.
 * Designed to work at 24-32px inline, matching the app's playful SVG style.
 */
export default function RobotCoinIcon({ size = 28, className }: RobotCoinIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        {/* Gold coin gradient */}
        <radialGradient id="rc-coin" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="40%" stopColor="#F5C842" />
          <stop offset="80%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#B8860B" />
        </radialGradient>
        {/* Coin edge */}
        <radialGradient id="rc-edge" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#C8920A" />
          <stop offset="100%" stopColor="#8B6914" />
        </radialGradient>
        {/* Robot face metallic */}
        <radialGradient id="rc-face" cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#E8F0F8" />
          <stop offset="60%" stopColor="#B0C0D0" />
          <stop offset="100%" stopColor="#7890A4" />
        </radialGradient>
        {/* Eye glow */}
        <radialGradient id="rc-eye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B0F4FF" />
          <stop offset="100%" stopColor="#40D0E8" />
        </radialGradient>
      </defs>

      {/* Coin outer ring (edge) */}
      <circle cx="32" cy="32" r="30" fill="url(#rc-edge)" />

      {/* Coin face */}
      <circle cx="32" cy="32" r="27" fill="url(#rc-coin)" />

      {/* Coin inner ring detail */}
      <circle cx="32" cy="32" r="24" fill="none" stroke="#C8920A" strokeWidth="0.8" opacity="0.5" />

      {/* Coin highlight */}
      <ellipse cx="26" cy="22" rx="12" ry="8" fill="white" opacity="0.18" />

      {/* === Robot Face === */}

      {/* Antenna */}
      <line x1="32" y1="18" x2="32" y2="13" stroke="#7890A4" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="12" r="2.5" fill="#40D0E8" opacity="0.9" />
      <circle cx="32.8" cy="11.2" r="0.8" fill="white" opacity="0.6" />

      {/* Head — rounded rectangle */}
      <rect x="19" y="18" width="26" height="22" rx="7" fill="url(#rc-face)" stroke="#6880A0" strokeWidth="0.6" />

      {/* Head highlight */}
      <path d="M23,20 Q32,17 41,20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Visor band */}
      <rect x="22" y="24" width="20" height="9" rx="4" fill="#1A2A38" opacity="0.85" />

      {/* Eyes */}
      <circle cx="28" cy="28.5" r="3" fill="white" />
      <circle cx="36" cy="28.5" r="3" fill="white" />
      <circle cx="28" cy="28.5" r="2" fill="url(#rc-eye)" />
      <circle cx="36" cy="28.5" r="2" fill="url(#rc-eye)" />
      <circle cx="28" cy="28.5" r="0.9" fill="#0A1520" />
      <circle cx="36" cy="28.5" r="0.9" fill="#0A1520" />
      {/* Eye highlights */}
      <circle cx="29.2" cy="27.5" r="0.8" fill="white" opacity="0.9" />
      <circle cx="37.2" cy="27.5" r="0.8" fill="white" opacity="0.9" />

      {/* Cheek LEDs */}
      <circle cx="22" cy="33" r="1.5" fill="#40D0E8" opacity="0.3" />
      <circle cx="42" cy="33" r="1.5" fill="#40D0E8" opacity="0.3" />

      {/* Mouth — happy smile */}
      <path d="M27,36 Q32,40 37,36" fill="none" stroke="#40D0E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Coin star accents */}
      <circle cx="14" cy="32" r="1" fill="#FFE066" opacity="0.4" />
      <circle cx="50" cy="32" r="1" fill="#FFE066" opacity="0.4" />
      <circle cx="32" cy="50" r="1" fill="#FFE066" opacity="0.4" />
    </svg>
  );
}
