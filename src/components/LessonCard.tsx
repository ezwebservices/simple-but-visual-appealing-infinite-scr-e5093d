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
  if (concept.startsWith('number-recognition')) return 'Which number is this?';
  if (concept.startsWith('one-to-one') || concept.startsWith('cardinality')) return 'How many?';
  if (concept.startsWith('comparing')) return 'Which group has more?';
  if (concept.startsWith('number-order')) {
    const dir = problem.operator === 'plus' ? 'after' : 'before';
    return `What comes ${dir} ${num1}?`;
  }
  if (concept === 'counting-on') return `Start at ${num1}, count ${num2} more!`;
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
  if (concept.startsWith('number-recognition')) return 'Which number?';
  if (concept.startsWith('one-to-one') || concept.startsWith('cardinality')) return 'How many?';
  if (concept.startsWith('comparing')) return 'Which has MORE?';
  if (concept.startsWith('number-order')) {
    const dir = operator === 'plus' ? 'after' : 'before';
    return `What comes ${dir} ${num1}?`;
  }
  if (concept === 'counting-on') return `${num1} + ${num2} more = ?`;
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
  const isNumberRecognition = concept.startsWith('number-recognition');
  const isComparing = concept.startsWith('comparing');
  const isCountingOn = concept === 'counting-on';
  const isAddition = concept.startsWith('addition');
  const isOneToOne = concept.startsWith('one-to-one');
  const isRoteCounting = concept.startsWith('rote-counting');
  const showStagger = isOneToOne || isRoteCounting;
  const showTwoGroups = isComparing || isCountingOn || isAddition;

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
        {isNumberRecognition ? (
          /* Large numeral display */
          <div style={{
            fontSize: '10rem',
            fontWeight: 900,
            color: colors.charcoal,
            lineHeight: 1,
            fontFamily: fontStack,
          }}>
            {problem.num1}
          </div>
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
