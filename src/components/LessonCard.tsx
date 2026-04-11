import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { MathProblem, CharacterMood, CharacterAnimation } from '../types';
import { fontStack, colors } from '../styles/theme';
import CharacterDisplay from './characters/CharacterDisplay';
import ObjectGroup from './objects/ObjectGroup';
import AnswerButton from './ui/AnswerButton';
import CelebrationOverlay from './animations/CelebrationOverlay';
import QuickLessonCard from './animations/QuickLessonCard';

type ButtonState = 'default' | 'correct' | 'wrong-selected' | 'wrong-unselected' | 'correct-reveal';

/**
 * Canonical dice/domino dot positions for 1–10 on a 100×100 viewBox.
 * Patterns 1–6 follow standard dice; 7–10 extend by adding rows so the kid
 * still recognizes a stable shape rather than counting in a line.
 */
const DOT_PATTERNS: Record<number, [number, number][]> = {
  1:  [[50,50]],
  2:  [[28,28],[72,72]],
  3:  [[28,28],[50,50],[72,72]],
  4:  [[28,28],[72,28],[28,72],[72,72]],
  5:  [[28,28],[72,28],[50,50],[28,72],[72,72]],
  6:  [[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],
  7:  [[28,22],[72,22],[28,50],[50,50],[72,50],[28,78],[72,78]],
  8:  [[28,22],[72,22],[28,42],[72,42],[28,62],[72,62],[28,82],[72,82]],
  9:  [[25,22],[50,22],[75,22],[25,50],[50,50],[75,50],[25,78],[50,78],[75,78]],
  10: [[22,28],[40,28],[58,28],[76,28],[94,28],[22,72],[40,72],[58,72],[76,72],[94,72]],
};

/** SubitizingPattern — renders 1..10 dots in a canonical pattern. */
function SubitizingPattern({ count, animateIn }: { count: number; animateIn: boolean }) {
  const dots = DOT_PATTERNS[count] ?? DOT_PATTERNS[1];
  return (
    <div style={{ width: 220, height: 220 }}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect x="4" y="4" width="92" height="92" rx="14" fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        {dots.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={count >= 9 ? 5.5 : 7.5}
            fill="#3D2818"
            initial={animateIn ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={animateIn ? { delay: 0.05 + i * 0.04, type: 'spring', stiffness: 320, damping: 18 } : { duration: 0 }}
          />
        ))}
      </svg>
    </div>
  );
}

interface LessonCardProps {
  problem: MathProblem;
  isActive: boolean;
  onCorrect: () => void;
  onWrong: () => void;
  onAdvance?: () => void;
  onSpeak: (text: string) => void;
  isSpeaking?: boolean;
  /** Highest dance move unlocked (1–5). When the child gets a problem right,
   *  a random move from 1..unlockedDanceMoves is picked for the celebration. */
  unlockedDanceMoves?: number;
}

function getSpokenText(problem: MathProblem): string {
  const { concept, num1, num2 } = problem;
  if (concept.startsWith('rote-counting')) {
    const seq = Array.from({ length: num1 }, (_, i) => i + 1).join(', ');
    return `What comes next? ${seq}...`;
  }
  if (concept.startsWith('subitizing')) return 'Quick! How many dots?';
  if (concept.startsWith('one-to-one') || concept.startsWith('cardinality')) return 'How many?';
  if (concept.startsWith('comparing')) return 'Which group has more?';
  if (concept.startsWith('number-order')) {
    const dir = problem.operator === 'plus' ? 'after' : 'before';
    return `What comes ${dir} ${num1}?`;
  }
  if (concept === 'counting-on') return `Start at ${num1}, count ${num2} more!`;
  if (concept === 'doubles') return `Double ${num1}! ${num1} plus ${num1}?`;
  if (concept === 'make-10') return `${num1} plus what makes 10?`;
  if (concept === 'decomposition') return `${num2} equals ${num1} plus what?`;
  if (concept.startsWith('addition')) return `How many is ${num1} plus ${num2}?`;
  if (concept.startsWith('subtraction')) return `How many is ${num1} minus ${num2}?`;
  return 'How many?';
}

function getQuestionText(problem: MathProblem): string {
  const { concept, num1, num2, operator } = problem;
  if (concept.startsWith('rote-counting')) {
    const seq = Array.from({ length: num1 }, (_, i) => i + 1).join(', ');
    return `${seq}, ___?`;
  }
  if (concept.startsWith('subitizing')) return 'How many?';
  if (concept.startsWith('one-to-one') || concept.startsWith('cardinality')) return 'How many?';
  if (concept.startsWith('comparing')) return 'Which has MORE?';
  if (concept.startsWith('number-order')) {
    const dir = operator === 'plus' ? 'after' : 'before';
    return `What comes ${dir} ${num1}?`;
  }
  if (concept === 'counting-on') return `${num1} + ${num2} more = ?`;
  if (concept === 'doubles') return `${num1} + ${num1} = ?`;
  if (concept === 'make-10') return `${num1} + ? = 10`;
  if (concept === 'decomposition') return `${num2} = ${num1} + ?`;
  const sym = operator === 'plus' ? '+' : '\u2212';
  return `${num1} ${sym} ${num2} = ?`;
}

export default function LessonCard({ problem, isActive, onCorrect, onWrong, onAdvance, onSpeak, isSpeaking, unlockedDanceMoves = 1 }: LessonCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const hasSpoken = useRef(false);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  // Auto-read problem when card becomes active
  useEffect(() => {
    if (isActive && !hasSpoken.current) {
      hasSpoken.current = true;
      const timer = setTimeout(() => {
        onSpeak(getSpokenText(problem));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isActive, problem, onSpeak]);

  const shuffledAnswers = useRef(
    [problem.answer, ...problem.wrongAnswers].sort(() => Math.random() - 0.5),
  );

  const handleSelect = useCallback(
    (value: number) => {
      if (selected !== null) return;
      setSelected(value);

      if (value === problem.answer) {
        setIsCorrect(true);
        setShowCelebration(true);
        onCorrect();
        celebrationTimer.current = setTimeout(() => {
          setShowCelebration(false);
          // Only auto-scroll if card is still active (user hasn't manually scrolled away)
          if (isActiveRef.current) {
            onAdvance?.();
          }
        }, 3000);
      } else {
        setIsCorrect(false);
        onWrong();
        // Show quick lesson after head-shake animation completes (~0.8s)
        retryTimer.current = setTimeout(() => {
          setShowEncouragement(true);
        }, 800);
      }
    },
    [selected, problem.answer, onCorrect, onWrong, onAdvance],
  );

  const handleDismissLesson = useCallback(() => {
    setShowEncouragement(false);
    setSelected(null);
    setIsCorrect(null);
  }, []);

  const getButtonState = (value: number): ButtonState => {
    if (selected === null) return 'default';
    if (isCorrect) {
      if (value === problem.answer) return 'correct';
      return 'wrong-unselected';
    }
    // Wrong answer selected
    if (value === selected) return 'wrong-selected';
    if (value === problem.answer) return 'correct-reveal';
    return 'wrong-unselected';
  };

  const mood: CharacterMood = isCorrect === true
    ? 'excited'
    : isCorrect === false
      ? 'headShake'
      : isActive
        ? 'thinking'
        : 'happy';

  // Pick a random unlocked dance move once when correct, then keep using it
  // until the next problem (so it doesn't keep re-randomizing on every render).
  const correctDanceRef = useRef<number>(1);
  if (isCorrect === true && correctDanceRef.current === 1) {
    correctDanceRef.current = Math.floor(Math.random() * unlockedDanceMoves) + 1;
  }
  if (isCorrect === null) {
    correctDanceRef.current = 1; // reset for next problem
  }

  // Animation: random unlocked dance on correct, idle (random variants) when waiting,
  // dance (move 1) only briefly while actively engaged with the problem
  const charAnimation: CharacterAnimation = isCorrect === true
    ? (`dance-${correctDanceRef.current}` as CharacterAnimation)
    : 'idle';

  const questionText = getQuestionText(problem);
  const concept = problem.concept;
  const isSubitizing = concept.startsWith('subitizing');
  const isComparing = concept.startsWith('comparing');
  const isCountingOn = concept === 'counting-on';
  const isAddition = concept.startsWith('addition');
  const isDoubles = concept === 'doubles';
  const isMakeTen = concept === 'make-10';
  const isDecomposition = concept === 'decomposition';
  const isMissingAddend = isMakeTen || isDecomposition;
  const isOneToOne = concept.startsWith('one-to-one');
  const isRoteCounting = concept.startsWith('rote-counting');
  const showStagger = isOneToOne || isRoteCounting;
  const showTwoGroups = isComparing || isCountingOn || isAddition || isDoubles || isMissingAddend;

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        scrollSnapAlign: 'start',
        background: problem.backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'pan-y',
      }}
    >
      {/* Character zone */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ flex: '0 0 auto', width: 160, height: 160 }}
      >
        <CharacterDisplay character={problem.character} mood={mood} isSpeaking={isSpeaking} animation={charAnimation} />
      </motion.div>

      {/* Question text */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontFamily: fontStack,
          fontSize: '2.5rem',
          fontWeight: 800,
          color: colors.charcoal,
          textAlign: 'center',
          flex: '0 0 auto',
        }}
        role="heading"
        aria-level={2}
        aria-label={getSpokenText(problem)}
      >
        {questionText}
      </motion.div>

      {/* Visual area — concept-aware rendering */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: showTwoGroups ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          maxHeight: '30vh',
          width: '100%',
        }}
      >
        {isSubitizing ? (
          /* Subitizing — quick dot-pattern recognition. Dots are arranged in
             classic dice/domino patterns so the kid recognizes the quantity
             at a glance instead of counting one by one. The numeral is NEVER
             shown — that would defeat the whole exercise. */
          <SubitizingPattern count={problem.num1} animateIn={isActive} />
        ) : isComparing ? (
          /* Two groups side by side */
          <>
            <ObjectGroup count={problem.num1} objectType={problem.objectType} />
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>
              vs
            </span>
            <ObjectGroup count={problem.num2} objectType={problem.objectType} />
          </>
        ) : isCountingOn ? (
          /* Dimmed first group + bright new group */
          <>
            <div style={{ opacity: 0.4 }}>
              <ObjectGroup count={problem.num1} objectType={problem.objectType} />
            </div>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>+</span>
            <ObjectGroup count={problem.num2} objectType={problem.objectType} staggerEntrance={isActive} />
          </>
        ) : isAddition ? (
          <>
            <ObjectGroup count={problem.num1} objectType={problem.objectType} />
            <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>+</span>
            <ObjectGroup count={problem.num2} objectType={problem.objectType} />
          </>
        ) : isDoubles ? (
          /* Doubles — both groups are the same number, visually emphasising
             the "same amount" idea. */
          <>
            <ObjectGroup count={problem.num1} objectType={problem.objectType} />
            <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>+</span>
            <ObjectGroup count={problem.num1} objectType={problem.objectType} />
          </>
        ) : isMakeTen ? (
          /* Make 10 — given part, missing part drawn as a dashed ? box,
             target total shown as a numeral for context. */
          <>
            <ObjectGroup count={problem.num1} objectType={problem.objectType} />
            <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>+</span>
            <div style={{
              width: 80, height: 80, borderRadius: 16,
              border: `4px dashed ${colors.charcoal}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', fontWeight: 900, color: colors.charcoal,
              fontFamily: fontStack,
              opacity: 0.6,
            }}>?</div>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>= 10</span>
          </>
        ) : isDecomposition ? (
          /* Decomposition — total on the left, one part given, missing part as ?.
             The kid learns numbers can be broken into parts. */
          <>
            <div style={{
              fontSize: '4rem', fontWeight: 900, color: colors.charcoal,
              fontFamily: fontStack, lineHeight: 1,
            }}>{problem.num2}</div>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>=</span>
            <ObjectGroup count={problem.num1} objectType={problem.objectType} />
            <span style={{ fontSize: '2rem', fontWeight: 700, color: colors.charcoal, fontFamily: fontStack }}>+</span>
            <div style={{
              width: 72, height: 72, borderRadius: 14,
              border: `4px dashed ${colors.charcoal}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 900, color: colors.charcoal,
              fontFamily: fontStack,
              opacity: 0.6,
            }}>?</div>
          </>
        ) : concept.startsWith('subtraction') ? (
          <ObjectGroup count={problem.num1} objectType={problem.objectType} />
        ) : concept.startsWith('number-order') ? (
          /* Number with ? before or after */
          <div style={{
            fontSize: '8rem',
            fontWeight: 900,
            color: colors.charcoal,
            lineHeight: 1,
            fontFamily: fontStack,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {problem.operator === 'minus' && <span style={{ fontSize: '3rem', color: colors.coral }}>?</span>}
            <span>{problem.num1}</span>
            {problem.operator === 'plus' && <span style={{ fontSize: '3rem', color: colors.mint }}>?</span>}
          </div>
        ) : isRoteCounting ? (
          /* Rote counting: number tiles (NOT objects) to reinforce the counting SEQUENCE.
             Showing objects here would confuse "how many" with "what comes next." */
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {Array.from({ length: problem.num1 }, (_, i) => (
              <motion.div
                key={i}
                initial={isActive ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={isActive ? { delay: i * 0.25, type: 'spring', stiffness: 300, damping: 18 } : { duration: 0 }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.85)',
                  border: '3px solid rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fontStack,
                  fontWeight: 900,
                  fontSize: '1.6rem',
                  color: colors.charcoal,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {i + 1}
              </motion.div>
            ))}
            {/* Question mark tile for the next number */}
            <motion.div
              initial={isActive ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={isActive ? { delay: problem.num1 * 0.25 + 0.15, type: 'spring', stiffness: 300, damping: 18 } : { duration: 0 }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.4)',
                border: `3px solid ${colors.mint}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fontStack,
                fontWeight: 900,
                fontSize: '1.6rem',
                color: colors.mint,
              }}
            >
              ?
            </motion.div>
          </div>
        ) : showStagger ? (
          /* One-to-one: objects appear one by one */
          <ObjectGroup count={problem.num1} objectType={problem.objectType} staggerEntrance={isActive} />
        ) : (
          /* Cardinality and default: all objects at once */
          <ObjectGroup count={problem.num1} objectType={problem.objectType} />
        )}
      </motion.div>

      {/* Replay audio & Lesson buttons */}
      <div style={{ display: 'flex', gap: 12, flex: '0 0 auto', alignItems: 'center' }}>
        <motion.button
          type="button"
          onClick={() => onSpeak(getSpokenText(problem))}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Replay question audio"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.7)',
            fontSize: '1.8rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          🔊
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setShowLesson(true)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Watch lesson demo"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.7)',
            fontSize: '1.6rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            WebkitTapHighlightColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Lightbulb SVG icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21h6m-4-1v-2.5a6 6 0 1 0-2 0V20m-1-6.5a3.5 3.5 0 0 1 2-3.163 2 2 0 1 1 2 0A3.5 3.5 0 0 1 11 13.5" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4.5" fill="#F5A623" opacity="0.2"/>
            <path d="M12 2v1m7.07 1.93-.7.7M22 12h-1M4.93 4.93l-.7-.7M3 12H2" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.button>
      </div>

      {/* Answer buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flex: '0 0 auto',
          paddingBottom: 16,
        }}
        role="group"
        aria-label="Answer choices"
      >
        {shuffledAnswers.current.map((val) => (
          <AnswerButton
            key={val}
            value={val}
            state={getButtonState(val)}
            disabled={isCorrect === true}
            onSelect={handleSelect}
          />
        ))}
      </motion.div>

      {/* Overlays */}
      <CelebrationOverlay show={showCelebration} />
      <QuickLessonCard
        show={showEncouragement}
        num1={problem.num1}
        num2={problem.num2}
        operator={problem.operator}
        correctAnswer={problem.answer}
        explanation={problem.explanation}
        objectType={problem.objectType}
        character={problem.character}
        concept={problem.concept}
        onDismiss={handleDismissLesson}
      />
      <QuickLessonCard
        show={showLesson}
        num1={problem.num1}
        num2={problem.num2}
        operator={problem.operator}
        correctAnswer={problem.answer}
        explanation={problem.explanation}
        objectType={problem.objectType}
        character={problem.character}
        concept={problem.concept}
        onDismiss={() => setShowLesson(false)}
      />
    </div>
  );
}
