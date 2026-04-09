interface SoundWaveOverlayProps {
  active: boolean;
  color?: string;
  className?: string;
}

/**
 * SoundWaveOverlay — Reusable animated sound-wave bars SVG element.
 *
 * Renders 4 vertical bars that pulse/oscillate to indicate speech is active.
 * Accepts an `active` boolean prop to start/stop the animation.
 * Can be composed into any character or UI element.
 */
export default function SoundWaveOverlay({
  active,
  color = '#40D0E8',
  className,
}: SoundWaveOverlayProps) {
  if (!active) return null;

  return (
    <svg
      viewBox="0 0 40 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <style>{`
          @keyframes swo-bar1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
          @keyframes swo-bar2 { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(0.8)} }
          @keyframes swo-bar3 { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
          @keyframes swo-bar4 { 0%,100%{transform:scaleY(0.35)} 50%{transform:scaleY(0.9)} }
        `}</style>
      </defs>

      <rect x="2" y="4" width="4" height="16" rx="2" fill={color} opacity="0.8"
        style={{ transformOrigin: '4px 12px', animation: 'swo-bar1 0.4s ease-in-out infinite' }} />
      <rect x="10" y="2" width="4" height="20" rx="2" fill={color} opacity="0.6"
        style={{ transformOrigin: '12px 12px', animation: 'swo-bar2 0.35s ease-in-out infinite 0.1s' }} />
      <rect x="18" y="5" width="4" height="14" rx="2" fill={color} opacity="0.75"
        style={{ transformOrigin: '20px 12px', animation: 'swo-bar3 0.45s ease-in-out infinite 0.2s' }} />
      <rect x="26" y="3" width="4" height="18" rx="2" fill={color} opacity="0.55"
        style={{ transformOrigin: '28px 12px', animation: 'swo-bar4 0.38s ease-in-out infinite 0.15s' }} />
    </svg>
  );
}
