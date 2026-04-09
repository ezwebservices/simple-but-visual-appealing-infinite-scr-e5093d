interface StarProps {
  className?: string;
}

export default function Star({ className }: StarProps) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} width="40" height="40">
      <defs>
        <radialGradient id="star-g" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="100%" stopColor="#FFE66D" />
        </radialGradient>
      </defs>
      <path
        d="M20,2 L24.5,14.5 L38,15 L27.5,23.5 L31,37 L20,29 L9,37 L12.5,23.5 L2,15 L15.5,14.5 Z"
        fill="url(#star-g)"
        stroke="#F4A623"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Inner shine */}
      <path
        d="M20,8 L22,15 L16,15 Z"
        fill="white"
        opacity="0.2"
      />
    </svg>
  );
}
