interface HeartProps {
  className?: string;
}

export default function Heart({ className }: HeartProps) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} width="40" height="40">
      <defs>
        <radialGradient id="heart-g" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FF8A8A" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </radialGradient>
      </defs>
      <path
        d="M20,35 C10,28 1,20 1,13 C1,6 6,2 12,2 C16,2 18.5,4 20,7 C21.5,4 24,2 28,2 C34,2 39,6 39,13 C39,20 30,28 20,35Z"
        fill="url(#heart-g)"
      />
      {/* Shine */}
      <ellipse cx="12" cy="12" rx="4" ry="5" fill="white" opacity="0.25" transform="rotate(-20 12 12)" />
    </svg>
  );
}
