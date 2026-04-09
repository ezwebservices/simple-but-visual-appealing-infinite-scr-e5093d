import { useState } from 'react';

interface BalloonProps {
  className?: string;
}

const balloonColors = ['#FF6B6B', '#4ECDC4', '#B8A9C9', '#FFE66D', '#87CEEB'] as const;

export default function Balloon({ className }: BalloonProps) {
  const [color] = useState(() => balloonColors[Math.floor(Math.random() * balloonColors.length)]);

  return (
    <svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg" className={className} width="40" height="48">
      <defs>
        <radialGradient id="balloon-g" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      {/* Balloon body */}
      <ellipse cx="20" cy="18" rx="14" ry="17" fill={color} />
      {/* Shine overlay */}
      <ellipse cx="20" cy="18" rx="14" ry="17" fill="url(#balloon-g)" />
      {/* Knot */}
      <path d="M18,35 L20,37 L22,35" fill={color} />
      {/* String */}
      <path d="M20,37 Q18,42 20,47" stroke="#AAA" strokeWidth="0.8" fill="none" />
      {/* Highlight */}
      <ellipse cx="14" cy="12" rx="3" ry="5" fill="white" opacity="0.3" transform="rotate(-15 14 12)" />
    </svg>
  );
}
