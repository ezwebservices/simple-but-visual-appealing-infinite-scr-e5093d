import { useEffect, useRef } from 'react';
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

/* ══════════════════════════════════════════════════════════════
   POLISHED ANIMATION CSS
   - Joint-anchored rotations using transform-origin in viewBox space
   - 5 dance moves with full choreography (Power Pump, Cha-Cha, Disco,
     Shake, Superstar) — each ~3-4s with anticipation + follow-through
   - 8 random idle variants (breathe, look, yawn, scratch, wave,
     curious, wiggle, stretch) cycled by JS via data-idle-state
   - Seamless transitions: 0.5s ease fallback + JS swap timing aligned
     to integer animation cycles + 550ms transition gap
   ══════════════════════════════════════════════════════════════ */
const animationCSS = `
.char-rig g {
  transform-box: view-box;
  will-change: transform;
}
.face-state { opacity: 0; }
.face-state.default { opacity: 1; }

/* ══════ DANCE MOVE 1 — POWER PUMP ══════ */
@keyframes char-m1-arm-l {
  0%   { transform: rotate(0deg); }
  8%   { transform: rotate(15deg); }
  35%  { transform: rotate(-150deg); }
  42%  { transform: rotate(-160deg); }
  48%  { transform: rotate(-148deg); }
  54%  { transform: rotate(-160deg); }
  60%  { transform: rotate(-150deg); }
  88%  { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
}
@keyframes char-m1-arm-r {
  0%   { transform: rotate(0deg); }
  8%   { transform: rotate(-15deg); }
  35%  { transform: rotate(150deg); }
  42%  { transform: rotate(160deg); }
  48%  { transform: rotate(148deg); }
  54%  { transform: rotate(160deg); }
  60%  { transform: rotate(150deg); }
  88%  { transform: rotate(-8deg); }
  100% { transform: rotate(0deg); }
}
@keyframes char-m1-body {
  0%   { transform: translateY(0) scale(1, 1); }
  8%   { transform: translateY(4px) scale(1.04, 0.96); }
  35%  { transform: translateY(-8px) scale(0.97, 1.03); }
  42%  { transform: translateY(-12px) scale(0.97, 1.03); }
  60%  { transform: translateY(-8px) scale(0.97, 1.03); }
  75%  { transform: translateY(2px) scale(1.02, 0.98); }
  100% { transform: translateY(0) scale(1, 1); }
}
@keyframes char-m1-head {
  0%   { transform: translateY(0) rotate(0deg); }
  8%   { transform: translateY(2px) rotate(0deg); }
  35%  { transform: translateY(-10px) rotate(-1deg); }
  42%  { transform: translateY(-14px) rotate(1deg); }
  60%  { transform: translateY(-10px) rotate(-1deg); }
  75%  { transform: translateY(2px) rotate(0deg); }
  100% { transform: translateY(0); }
}
@keyframes char-m1-tail {
  0%   { transform: rotate(0deg); }
  35%  { transform: rotate(-30deg); }
  50%  { transform: rotate(-15deg); }
  65%  { transform: rotate(-30deg); }
  100% { transform: rotate(0deg); }
}
@keyframes char-m1-mouth-default { 0%, 25%, 75%, 100% { opacity: 1; } 35%, 65% { opacity: 0; } }
@keyframes char-m1-mouth-open    { 0%, 25%, 75%, 100% { opacity: 0; } 35%, 65% { opacity: 1; } }

/* ══════ MOVE 2 — CHA-CHA SLIDE ══════ */
@keyframes char-m2-arm-l {
  0%   { transform: rotate(0deg); }
  20%  { transform: rotate(-80deg); }
  30%  { transform: rotate(-90deg); }
  50%  { transform: rotate(-80deg); }
  70%  { transform: rotate(-85deg); }
  100% { transform: rotate(0deg); }
}
@keyframes char-m2-arm-r {
  0%   { transform: rotate(0deg); }
  20%  { transform: rotate(80deg); }
  30%  { transform: rotate(90deg); }
  50%  { transform: rotate(80deg); }
  70%  { transform: rotate(85deg); }
  100% { transform: rotate(0deg); }
}
@keyframes char-m2-body {
  0%   { transform: translateX(0) rotate(0deg); }
  25%  { transform: translateX(-6px) rotate(-3deg); }
  50%  { transform: translateX(-2px) rotate(-1deg); }
  75%  { transform: translateX(8px) rotate(3deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
@keyframes char-m2-head {
  0%   { transform: translateX(0) rotate(0deg); }
  25%  { transform: translateX(4px) rotate(4deg); }
  50%  { transform: translateX(2px) rotate(1deg); }
  75%  { transform: translateX(-4px) rotate(-4deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
@keyframes char-m2-leg-l {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-18deg); }
  50%  { transform: rotate(0deg); }
  75%  { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
}
@keyframes char-m2-leg-r {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(8deg); }
  50%  { transform: rotate(0deg); }
  75%  { transform: rotate(18deg); }
  100% { transform: rotate(0deg); }
}
@keyframes char-m2-tail {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-15deg); }
  50%  { transform: rotate(0deg); }
  75%  { transform: rotate(15deg); }
  100% { transform: rotate(0deg); }
}

/* ══════ MOVE 3 — DISCO FEVER ══════ */
@keyframes char-m3-arm-l {
  0%   { transform: rotate(30deg); }
  30%  { transform: rotate(-150deg); }
  50%  { transform: rotate(-150deg); }
  70%  { transform: rotate(30deg); }
  100% { transform: rotate(30deg); }
}
@keyframes char-m3-arm-r {
  0%   { transform: rotate(-150deg); }
  30%  { transform: rotate(30deg); }
  50%  { transform: rotate(30deg); }
  70%  { transform: rotate(-150deg); }
  100% { transform: rotate(-150deg); }
}
@keyframes char-m3-body {
  0%, 100% { transform: rotate(3deg) translateY(-2px); }
  50%      { transform: rotate(-3deg) translateY(-2px); }
}
@keyframes char-m3-head {
  0%, 100% { transform: rotate(-4deg); }
  50%      { transform: rotate(4deg); }
}
@keyframes char-m3-tail {
  0%, 100% { transform: rotate(15deg); }
  50%      { transform: rotate(-15deg); }
}

/* ══════ MOVE 4 — EARTHQUAKE SHAKE ══════ */
@keyframes char-m4-arm-l {
  0%, 100% { transform: rotate(-12deg); }
  25%      { transform: rotate(12deg); }
  50%      { transform: rotate(-12deg); }
  75%      { transform: rotate(12deg); }
}
@keyframes char-m4-arm-r {
  0%, 100% { transform: rotate(12deg); }
  25%      { transform: rotate(-12deg); }
  50%      { transform: rotate(12deg); }
  75%      { transform: rotate(-12deg); }
}
@keyframes char-m4-body {
  0%, 100% { transform: translateX(-3px) rotate(-1deg); }
  25%      { transform: translateX(3px) rotate(1deg); }
  50%      { transform: translateX(-3px) rotate(-1deg); }
  75%      { transform: translateX(3px) rotate(1deg); }
}
@keyframes char-m4-head {
  0%, 100% { transform: translateX(2px); }
  25%      { transform: translateX(-2px); }
  50%      { transform: translateX(2px); }
  75%      { transform: translateX(-2px); }
}
@keyframes char-m4-tail {
  0%, 100% { transform: rotate(-15deg); }
  25%      { transform: rotate(15deg); }
  50%      { transform: rotate(-15deg); }
  75%      { transform: rotate(15deg); }
}
@keyframes char-m4-mouth-default { 0%, 100% { opacity: 0; } }
@keyframes char-m4-mouth-laugh   { 0%, 100% { opacity: 1; } }

/* ══════ MOVE 5 — SUPERSTAR SPIN & POSE ══════ */
@keyframes char-m5-all {
  0%   { transform: translateY(0) scale(1); }
  8%   { transform: translateY(2px) scale(0.96); }
  15%  { transform: translateY(-6px) scale(1.04); }
  60%  { transform: translateY(-6px) scale(1.04); }
  68%  { transform: translateY(-12px) scale(1.06); }
  80%  { transform: translateY(0) scale(1); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes char-m5-arm-l {
  0%, 15%  { transform: rotate(20deg); }
  20%, 60% { transform: rotate(-90deg); }
  65%      { transform: rotate(-160deg); }
  100%     { transform: rotate(-160deg); }
}
@keyframes char-m5-arm-r {
  0%, 15%  { transform: rotate(-20deg); }
  20%, 60% { transform: rotate(90deg); }
  65%      { transform: rotate(60deg); }
  100%     { transform: rotate(60deg); }
}
@keyframes char-m5-mouth-default { 0%, 60%, 100% { opacity: 1; } 65%, 95% { opacity: 0; } }
@keyframes char-m5-mouth-laugh   { 0%, 60%, 100% { opacity: 0; } 65%, 95% { opacity: 1; } }

/* ══════ DANCE MODES ══════ */
.char-dance .char-left-arm  { animation: char-m1-arm-l 3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
.char-dance .char-right-arm { animation: char-m1-arm-r 3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
.char-dance .char-torso     { animation: char-m1-body  3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
.char-dance .char-head      { animation: char-m1-head  3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
.char-dance .char-tail      { animation: char-m1-tail  3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
.char-dance .mouth-default  { animation: char-m1-mouth-default 3.2s steps(1) infinite; }
.char-dance .mouth-open     { animation: char-m1-mouth-open 3.2s steps(1) infinite; }

/* SPIN — superstar pose */
.char-spin .char-all       { animation: char-m5-all 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.char-spin .char-left-arm  { animation: char-m5-arm-l 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.char-spin .char-right-arm { animation: char-m5-arm-r 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.char-spin .mouth-default  { animation: char-m5-mouth-default 4.5s steps(1) infinite; }
.char-spin .mouth-laugh    { animation: char-m5-mouth-laugh 4.5s steps(1) infinite; }

/* ══════ IDLE — random variants cycled by JS ══════ */

/* Smooth fallback when an animation is removed */
.char-idle .char-head,
.char-idle .char-torso,
.char-idle .char-tail,
.char-idle .char-left-arm,
.char-idle .char-right-arm,
.char-idle .char-left-leg,
.char-idle .char-right-leg,
.char-idle .pupil-l,
.char-idle .pupil-r {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Always-on blink during idle */
@keyframes char-idle-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  94%, 98%      { transform: scaleY(0.1); }
}
.char-idle .eye-default {
  animation: char-idle-blink 5s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

/* IDLE 1 — Breathe */
@keyframes char-idle-breathe-body { 0%,100%{transform:translateY(0) scale(1,1)} 50%{transform:translateY(-2px) scale(1.01,0.99)} }
@keyframes char-idle-breathe-head { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes char-idle-breathe-tail { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
.char-idle[data-idle-state="breathe"] .char-torso { animation: char-idle-breathe-body 4s ease-in-out infinite; }
.char-idle[data-idle-state="breathe"] .char-head  { animation: char-idle-breathe-head 4s ease-in-out infinite; }
.char-idle[data-idle-state="breathe"] .char-tail  { animation: char-idle-breathe-tail 3s ease-in-out infinite; }

/* IDLE 2 — Look around */
@keyframes char-idle-look-head {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  20%, 35% { transform: translateY(-2px) rotate(-8deg); }
  55%      { transform: translateY(-2px) rotate(0deg); }
  70%, 85% { transform: translateY(-2px) rotate(8deg); }
}
@keyframes char-idle-look-pupils {
  0%, 100% { transform: translateX(0); }
  20%, 35% { transform: translateX(-5px); }
  55%      { transform: translateX(0); }
  70%, 85% { transform: translateX(5px); }
}
.char-idle[data-idle-state="look"] .char-head  { animation: char-idle-look-head 6s ease-in-out infinite; }
.char-idle[data-idle-state="look"] .char-torso { animation: char-idle-breathe-body 4s ease-in-out infinite; }
.char-idle[data-idle-state="look"] .pupil-l    { animation: char-idle-look-pupils 6s ease-in-out infinite; }
.char-idle[data-idle-state="look"] .pupil-r    { animation: char-idle-look-pupils 6s ease-in-out infinite; }

/* IDLE 3 — Yawn */
@keyframes char-idle-yawn-head {
  0%, 25%, 75%, 100% { transform: translateY(0) rotate(0deg); }
  40%, 60%           { transform: translateY(-6px) rotate(-3deg); }
}
@keyframes char-idle-yawn-mouth-default {
  0%, 30%, 70%, 100% { opacity: 1; }
  35%, 65%           { opacity: 0; }
}
@keyframes char-idle-yawn-mouth-open {
  0%, 30%, 70%, 100% { opacity: 0; }
  35%, 65%           { opacity: 1; }
}
@keyframes char-idle-yawn-eyes {
  0%, 28%, 72%, 100% { transform: scaleY(1); }
  35%, 65%           { transform: scaleY(0.15); }
}
.char-idle[data-idle-state="yawn"] .char-head     { animation: char-idle-yawn-head 5s ease-in-out infinite; }
.char-idle[data-idle-state="yawn"] .char-torso    { animation: char-idle-breathe-body 4s ease-in-out infinite; }
.char-idle[data-idle-state="yawn"] .mouth-default { animation: char-idle-yawn-mouth-default 5s steps(1) infinite; }
.char-idle[data-idle-state="yawn"] .mouth-open    { animation: char-idle-yawn-mouth-open 5s steps(1) infinite; }
.char-idle[data-idle-state="yawn"] .pupil-l       { animation: char-idle-yawn-eyes 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.char-idle[data-idle-state="yawn"] .pupil-r       { animation: char-idle-yawn-eyes 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }

/* IDLE 4 — Scratch head */
@keyframes char-idle-scratch-arm {
  0%, 15%, 80%, 100% { transform: rotate(0deg); }
  25%                { transform: rotate(-130deg); }
  35%                { transform: rotate(-115deg); }
  45%                { transform: rotate(-130deg); }
  55%                { transform: rotate(-115deg); }
  70%                { transform: rotate(-130deg); }
}
.char-idle[data-idle-state="scratch"] .char-left-arm { animation: char-idle-scratch-arm 5s ease-in-out infinite; }
.char-idle[data-idle-state="scratch"] .char-torso    { animation: char-idle-breathe-body 4s ease-in-out infinite; }

/* IDLE 5 — Wave hello */
@keyframes char-idle-wave-arm {
  0%, 15%, 85%, 100% { transform: rotate(0deg); }
  25%                { transform: rotate(120deg); }
  35%                { transform: rotate(140deg); }
  45%                { transform: rotate(110deg); }
  55%                { transform: rotate(140deg); }
  65%                { transform: rotate(110deg); }
  75%                { transform: rotate(120deg); }
}
.char-idle[data-idle-state="wave"] .char-right-arm { animation: char-idle-wave-arm 5s ease-in-out infinite; }
.char-idle[data-idle-state="wave"] .char-torso     { animation: char-idle-breathe-body 4s ease-in-out infinite; }

/* IDLE 6 — Curious tilt */
@keyframes char-idle-curious-head {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  35%, 65% { transform: translateY(-3px) rotate(-15deg); }
}
@keyframes char-idle-curious-pupils {
  0%, 100% { transform: translate(0, 0); }
  35%, 65% { transform: translate(-3px, -2px); }
}
.char-idle[data-idle-state="curious"] .char-head  { animation: char-idle-curious-head 4s ease-in-out infinite; }
.char-idle[data-idle-state="curious"] .char-torso { animation: char-idle-breathe-body 4s ease-in-out infinite; }
.char-idle[data-idle-state="curious"] .pupil-l    { animation: char-idle-curious-pupils 4s ease-in-out infinite; }
.char-idle[data-idle-state="curious"] .pupil-r    { animation: char-idle-curious-pupils 4s ease-in-out infinite; }

/* IDLE 7 — Wiggle */
@keyframes char-idle-wiggle-body { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px) rotate(-2deg)} 75%{transform:translateX(4px) rotate(2deg)} }
@keyframes char-idle-wiggle-tail { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(20deg)} 75%{transform:rotate(-20deg)} }
@keyframes char-idle-wiggle-head { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(2deg)} 75%{transform:rotate(-2deg)} }
.char-idle[data-idle-state="wiggle"] .char-torso { animation: char-idle-wiggle-body 1.6s ease-in-out infinite; }
.char-idle[data-idle-state="wiggle"] .char-tail  { animation: char-idle-wiggle-tail 1.6s ease-in-out infinite; }
.char-idle[data-idle-state="wiggle"] .char-head  { animation: char-idle-wiggle-head 1.6s ease-in-out infinite; }

/* IDLE 8 — Stretch */
@keyframes char-idle-stretch-arm-l {
  0%, 15%, 80%, 100% { transform: rotate(0deg); }
  30%, 65%           { transform: rotate(-160deg); }
}
@keyframes char-idle-stretch-arm-r {
  0%, 15%, 80%, 100% { transform: rotate(0deg); }
  30%, 65%           { transform: rotate(160deg); }
}
@keyframes char-idle-stretch-body {
  0%, 100% { transform: translateY(0) scale(1); }
  30%, 65% { transform: translateY(-4px) scale(1, 1.04); }
}
.char-idle[data-idle-state="stretch"] .char-left-arm  { animation: char-idle-stretch-arm-l 5s ease-in-out infinite; }
.char-idle[data-idle-state="stretch"] .char-right-arm { animation: char-idle-stretch-arm-r 5s ease-in-out infinite; }
.char-idle[data-idle-state="stretch"] .char-torso     { animation: char-idle-stretch-body 5s ease-in-out infinite; }
.char-idle[data-idle-state="stretch"] .char-head      { animation: char-idle-breathe-head 5s ease-in-out infinite; }
`;

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-char-animations', '');
  style.textContent = animationCSS;
  document.head.appendChild(style);
}

/** Random idle cycler — picks a different variant every full cycle, with a
 *  brief transition gap so animations seamlessly ease back to neutral. */
const IDLE_VARIANTS: Array<{ id: string; duration: number }> = [
  { id: 'breathe', duration: 8000 },
  { id: 'look',    duration: 6000 },
  { id: 'yawn',    duration: 5000 },
  { id: 'scratch', duration: 5000 },
  { id: 'wave',    duration: 5000 },
  { id: 'curious', duration: 4000 },
  { id: 'wiggle',  duration: 6400 },
  { id: 'stretch', duration: 5000 },
];
const SWAP_GAP_MS = 550;

function useIdleCycle(active: boolean, ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    let lastId: string | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      // Pick a different variant than the previous one
      const pool = IDLE_VARIANTS.filter(v => v.id !== lastId);
      const next = pool[Math.floor(Math.random() * pool.length)];
      lastId = next.id;
      el.dataset.idleState = next.id;

      timer = setTimeout(() => {
        // Phase 1: clear so the CSS transition eases everything to neutral
        delete el.dataset.idleState;
        // Phase 2: pick the next variant after the transition completes
        timer = setTimeout(tick, SWAP_GAP_MS);
      }, next.duration);
    };
    tick();

    return () => {
      if (timer) clearTimeout(timer);
      delete el.dataset.idleState;
    };
  }, [active, ref]);
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

  // Ensure animation CSS is injected once
  ensureStyles();

  const animClass =
    animation === 'dance' ? 'char-dance' :
    animation === 'spin' ? 'char-spin' :
    animation === 'idle' ? 'char-idle' :
    '';

  const wrapperRef = useRef<HTMLDivElement>(null);
  useIdleCycle(animation === 'idle', wrapperRef);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={character}
        ref={wrapperRef}
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
          transformOrigin: 'center 60%',
        }}
      >
        <Character mood={mood === 'headShake' ? 'encouraging' : mood} isSpeaking={isSpeaking} />
      </motion.div>
    </AnimatePresence>
  );
}
