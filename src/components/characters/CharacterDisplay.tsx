import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterName, CharacterMood, CharacterAnimation } from '../../types';
import BlooBear from './BlooBear';
import SunnyBug from './SunnyBug';
import RosieOwl from './RosieOwl';
import MiloFrog from './MiloFrog';
import PipZebra from './PipZebra';
import RexRobot from './RexRobot';

interface CharacterDisplayProps {
  character: CharacterName;
  mood: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
  animation?: CharacterAnimation;
}

const characterMap: Record<CharacterName, typeof BlooBear> = {
  bloo: BlooBear,
  sunny: SunnyBug,
  rosie: RosieOwl,
  milo: MiloFrog,
  pip: PipZebra,
  rex: RexRobot,
  robo: RexRobot,
};

// Head-shake: rotates the character left-right like shaking "no"
const shakeKeyframes = [0, -12, 10, -8, 6, -3, 0];
const shakeTimes = [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1];

/** CSS keyframes for dance, spin, and idle animations */
const animationCSS = `
/* ══════════════════════════════════════════
   DANCE — Gentle Happy Sway (~2.0s) with soft motion
   ══════════════════════════════════════════ */

/* Arms wave gently (±12deg), staggered L/R timing */
@keyframes char-arm-wave-l {
  0%, 100% { transform: rotate(0deg); }
  12% { transform: rotate(12deg); }
  28% { transform: rotate(-6deg); }
  44% { transform: rotate(10deg); }
  60% { transform: rotate(-5deg); }
  76% { transform: rotate(12deg); }
  90% { transform: rotate(-3deg); }
}
@keyframes char-arm-wave-r {
  0%, 100% { transform: rotate(0deg); }
  8% { transform: rotate(-10deg); }
  24% { transform: rotate(8deg); }
  40% { transform: rotate(-12deg); }
  56% { transform: rotate(6deg); }
  72% { transform: rotate(-12deg); }
  88% { transform: rotate(4deg); }
}

/* Legs with gentle offset sway */
@keyframes char-leg-stomp-l {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  20% { transform: rotate(4deg) translateY(-1px); }
  40% { transform: rotate(-3deg) translateY(0px); }
  60% { transform: rotate(3deg) translateY(-1px); }
  80% { transform: rotate(-2deg) translateY(0px); }
}
@keyframes char-leg-stomp-r {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  15% { transform: rotate(-3deg) translateY(-1px); }
  35% { transform: rotate(4deg) translateY(0px); }
  55% { transform: rotate(-4deg) translateY(-1px); }
  75% { transform: rotate(2deg) translateY(0px); }
}

/* Body: gentle vertical bounce (±6px), no squash/stretch */
@keyframes char-body-bounce {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  10% { transform: rotate(1deg) translateY(-5px); }
  20% { transform: rotate(0deg) translateY(-1px); }
  30% { transform: rotate(-1deg) translateY(-6px); }
  40% { transform: rotate(0deg) translateY(0px); }
  50% { transform: rotate(1deg) translateY(-5px); }
  60% { transform: rotate(0deg) translateY(-1px); }
  70% { transform: rotate(-1deg) translateY(-5px); }
  80% { transform: rotate(0deg) translateY(0px); }
  90% { transform: rotate(0.5deg) translateY(-4px); }
}

/* Head bobs gently — small tilts on each bounce */
@keyframes char-head-bop {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  10% { transform: rotate(-2deg) translateY(-3px); }
  20% { transform: rotate(1deg) translateY(0px); }
  30% { transform: rotate(3deg) translateY(-4px); }
  40% { transform: rotate(-1deg) translateY(0px); }
  50% { transform: rotate(-2deg) translateY(-3px); }
  60% { transform: rotate(1deg) translateY(0px); }
  70% { transform: rotate(2deg) translateY(-3px); }
  80% { transform: rotate(0deg) translateY(0px); }
  90% { transform: rotate(-1deg) translateY(-2px); }
}

/* Secondary: ears wiggle ±5deg */
@keyframes char-ears {
  0%, 100% { transform: rotate(0deg); }
  16% { transform: rotate(-5deg); }
  33% { transform: rotate(5deg); }
  50% { transform: rotate(-4deg); }
  66% { transform: rotate(5deg); }
  83% { transform: rotate(-3deg); }
}

/* Secondary: accessory gentle bounce ±3px */
@keyframes char-accessory {
  0%, 100% { transform: translateY(0px); }
  25% { transform: translateY(-3px); }
  50% { transform: translateY(1px); }
  75% { transform: translateY(-3px); }
}

/* DANCE selectors — gentle timing (~2s) per limb for organic motion */
.char-dance .char-left-arm {
  animation: char-arm-wave-l 1.8s ease-in-out infinite;
}
.char-dance .char-right-arm {
  animation: char-arm-wave-r 2.2s ease-in-out infinite;
  animation-delay: 0.1s;
}
.char-dance .char-left-leg {
  animation: char-leg-stomp-l 1.7s ease-in-out infinite;
  animation-delay: 0.06s;
}
.char-dance .char-right-leg {
  animation: char-leg-stomp-r 1.9s ease-in-out infinite;
  animation-delay: 0.15s;
}
.char-dance .char-torso {
  animation: char-body-bounce 2.0s ease-in-out infinite;
}
.char-dance .char-head {
  animation: char-head-bop 2.0s ease-in-out infinite;
  animation-delay: 0.08s;
}
.char-dance .char-ears {
  animation: char-ears 1.3s ease-in-out infinite;
  animation-delay: 0.1s;
}
.char-dance .char-accessory {
  animation: char-accessory 1.3s ease-in-out infinite;
  animation-delay: 0.05s;
}

/* GPU acceleration for smooth 60fps */
.char-dance .char-left-arm,
.char-dance .char-right-arm,
.char-dance .char-left-leg,
.char-dance .char-right-leg,
.char-dance .char-torso,
.char-dance .char-head,
.char-dance .char-ears,
.char-dance .char-accessory {
  will-change: transform;
}

/* ══════════════════════════════════════════
   SPIN — Squash-and-stretch effect
   ══════════════════════════════════════════ */
@keyframes char-spin {
  0%   { transform: rotate(0deg) scaleX(1) scaleY(1); }
  20%  { transform: rotate(80deg) scaleX(1.02) scaleY(0.98); }
  50%  { transform: rotate(180deg) scaleX(1.04) scaleY(0.97); }
  75%  { transform: rotate(300deg) scaleX(0.98) scaleY(1.02); }
  90%  { transform: rotate(350deg) scaleX(0.97) scaleY(1.03); }
  95%  { transform: rotate(358deg) scaleX(1.01) scaleY(0.99); }
  100% { transform: rotate(360deg) scaleX(1) scaleY(1); }
}
.char-spin {
  animation: char-spin 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
/* Keep limbs + secondary motion during spin (gentle timing) */
.char-spin .char-left-arm {
  animation: char-arm-wave-l 1.8s ease-in-out infinite;
  will-change: transform;
}
.char-spin .char-right-arm {
  animation: char-arm-wave-r 2.2s ease-in-out infinite;
  will-change: transform;
}
.char-spin .char-left-leg {
  animation: char-leg-stomp-l 1.7s ease-in-out infinite;
  will-change: transform;
}
.char-spin .char-right-leg {
  animation: char-leg-stomp-r 1.9s ease-in-out infinite;
  will-change: transform;
}
.char-spin .char-torso {
  animation: char-body-bounce 2.0s ease-in-out infinite;
  will-change: transform;
}
.char-spin .char-head {
  animation: char-head-bop 2.0s ease-in-out infinite;
  will-change: transform;
}
.char-spin .char-ears {
  animation: char-ears 1.3s ease-in-out infinite;
  will-change: transform;
}
.char-spin .char-accessory {
  animation: char-accessory 1.3s ease-in-out infinite;
  will-change: transform;
}

/* ══════════════════════════════════════════
   IDLE — Gentle side-to-side sway + blink
   ══════════════════════════════════════════ */
@keyframes char-idle-sway {
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  25% { transform: translateX(3px) rotate(1deg); }
  50% { transform: translateX(0px) rotate(0deg); }
  75% { transform: translateX(-3px) rotate(-1deg); }
}
@keyframes char-idle-head {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  30% { transform: rotate(1.5deg) translateY(-1px); }
  60% { transform: rotate(-1.5deg) translateY(-2px); }
}
@keyframes char-idle-arms-l {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg); }
}
@keyframes char-idle-arms-r {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-3deg); }
}
@keyframes char-idle-ears {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(1.03); }
}
@keyframes char-idle-blink {
  0%, 88%, 100% { opacity: 1; }
  89% { opacity: 0; }
  91% { opacity: 1; }
}

.char-idle {
  animation: char-idle-sway 4s ease-in-out infinite;
  will-change: transform;
}
.char-idle .char-head {
  animation: char-idle-head 4s ease-in-out infinite;
  will-change: transform;
}
.char-idle .char-left-arm {
  animation: char-idle-arms-l 3.5s ease-in-out infinite;
  will-change: transform;
}
.char-idle .char-right-arm {
  animation: char-idle-arms-r 3.5s ease-in-out infinite;
  animation-delay: 0.3s;
  will-change: transform;
}
.char-idle .char-ears {
  animation: char-idle-ears 5s ease-in-out infinite;
  will-change: transform;
}
.char-idle .char-accessory {
  animation: char-idle-ears 6s ease-in-out infinite;
  animation-delay: 1s;
  will-change: transform;
}
.char-idle .char-eyes {
  animation: char-idle-blink 4.5s ease-in-out infinite;
  will-change: opacity;
}
`;

// Inject animation styles once into the document head
let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-char-animations', '');
  style.textContent = animationCSS;
  document.head.appendChild(style);
}

export default function CharacterDisplay({
  character,
  mood,
  className,
  isSpeaking,
  animation = 'idle',
}: CharacterDisplayProps) {
  const Character = characterMap[character];
  const isShaking = mood === 'encouraging' || mood === 'headShake';

  // Ensure animation CSS is in the document
  ensureStyles();

  const animClass =
    animation === 'dance' ? 'char-dance' :
    animation === 'spin' ? 'char-spin' :
    animation === 'idle' ? 'char-idle' :
    '';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={character}
        initial={{ opacity: 0.6, scale: 0.95, rotate: 0 }}
        animate={
          isShaking
            ? { opacity: 1, scale: 1, rotate: shakeKeyframes }
            : { opacity: 1, scale: 1, rotate: 0 }
        }
        exit={{ opacity: 0.6, scale: 0.95 }}
        transition={
          isShaking
            ? {
                duration: 0.6,
                ease: [0.36, 0.07, 0.19, 0.97],
                times: shakeTimes,
              }
            : { duration: 0.3, ease: 'easeOut' }
        }
        className={`${animClass}${className ? ` ${className}` : ''}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformOrigin: 'center 60%', // pivot near neck for natural head-shake
        }}
      >
        <Character mood={mood === 'headShake' ? 'encouraging' : mood} isSpeaking={isSpeaking} />
      </motion.div>
    </AnimatePresence>
  );
}
