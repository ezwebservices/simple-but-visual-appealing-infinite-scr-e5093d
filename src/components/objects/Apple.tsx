interface AppleProps {
  className?: string;
}

export default function Apple({ className }: AppleProps) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} width="40" height="40">
      <defs>
        <radialGradient id="apple-g" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FF7B7B" />
          <stop offset="100%" stopColor="#E74C3C" />
        </radialGradient>
      </defs>
      {/* Body */}
      <path
        d="M20,36 C8,36 2,26 4,18 C6,10 12,8 16,10 Q18,6 20,8 Q22,6 24,10 C28,8 34,10 36,18 C38,26 32,36 20,36Z"
        fill="url(#apple-g)"
      />
      {/* Stem */}
      <path d="M20,10 Q19,4 20,2" stroke="#8B5E3C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M20,6 Q26,2 28,5 Q24,6 20,6" fill="#4CAF50" />
      {/* Shine */}
      <ellipse cx="14" cy="18" rx="3" ry="5" fill="white" opacity="0.25" transform="rotate(-15 14 18)" />
    </svg>
  );
}
