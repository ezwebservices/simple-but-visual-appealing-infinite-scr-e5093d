interface FishProps {
  className?: string;
}

export default function Fish({ className }: FishProps) {
  return (
    <svg viewBox="0 0 44 32" xmlns="http://www.w3.org/2000/svg" className={className} width="44" height="32">
      <defs>
        <radialGradient id="fish-g" cx="40%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#A8E0F5" />
          <stop offset="100%" stopColor="#87CEEB" />
        </radialGradient>
      </defs>
      {/* Body */}
      <path
        d="M10,16 C10,6 22,2 30,8 Q36,12 34,16 Q36,20 30,24 C22,30 10,26 10,16Z"
        fill="url(#fish-g)"
      />
      {/* Tail */}
      <path d="M10,16 Q4,8 2,4 Q8,10 10,16 Q8,22 2,28 Q4,24 10,16" fill="#FFE66D" />
      {/* Dorsal fin */}
      <path d="M22,8 Q24,3 28,6" fill="#FFE66D" opacity="0.8" />
      {/* Bottom fin */}
      <path d="M22,24 Q24,29 20,27" fill="#FFE66D" opacity="0.8" />
      {/* Eye */}
      <circle cx="28" cy="14" r="3" fill="white" />
      <circle cx="29" cy="13.5" r="1.8" fill="#2D3436" />
      <circle cx="29.5" cy="13" r="0.6" fill="white" />
      {/* Smile */}
      <path d="M26,18 Q29,20 31,18" fill="none" stroke="#5B8FA8" strokeWidth="0.8" strokeLinecap="round" />
      {/* Scale hints */}
      <path d="M18,13 Q20,12 22,13" fill="none" stroke="#6DBDE0" strokeWidth="0.5" opacity="0.5" />
      <path d="M16,17 Q18,16 20,17" fill="none" stroke="#6DBDE0" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
