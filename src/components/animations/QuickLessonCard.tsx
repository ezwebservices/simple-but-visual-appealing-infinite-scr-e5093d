import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, fontStack, confettiColors } from '../../styles/theme';
import type { ObjectType, CharacterName, SubConcept } from '../../types';
import CharacterDisplay from '../characters/CharacterDisplay';
import useAudio from '../../hooks/useAudio';
import Apple from '../objects/Apple';
import Star from '../objects/Star';
import Heart from '../objects/Heart';
import Balloon from '../objects/Balloon';
import Fish from '../objects/Fish';

interface QuickLessonCardProps {
  show: boolean;
  num1: number;
  num2: number;
  operator: 'plus' | 'minus';
  correctAnswer: number;
  explanation: string;
  objectType: ObjectType;
  character?: CharacterName;
  concept?: SubConcept;
  onDismiss: () => void;
}

const objectMap = {
  apple: Apple,
  star: Star,
  heart: Heart,
  balloon: Balloon,
  fish: Fish,
} as const;

/* ─── 7-step animated lesson sequence ─── */
type LessonStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Extra lead-in time so the intro sentence finishes before counting begins. */
const COUNT_LEAD_IN = 2000;

const STEP_DURATIONS: Record<LessonStep, number> = {
  1: 2800,  // Character intro
  2: 0,     // First group one-by-one (dynamic)
  3: 1600,  // Operator appears
  4: 0,     // Second group one-by-one / cross-out (dynamic)
  5: 3200,  // Equation builds progressively (allow sentence to finish)
  6: 3200,  // Answer reveals with celebration (allow sentence to finish)
  7: 0,     // Got it! button — waits for user tap
};

function getStepDuration(step: LessonStep, num1: number, num2: number): number {
  if (step === 2) return COUNT_LEAD_IN + num1 * 1100 + 800;
  if (step === 4) return COUNT_LEAD_IN + num2 * 1100 + 800;
  return STEP_DURATIONS[step];
}

const plural = (n: number, word: string) => `${word}${n !== 1 ? 's' : ''}`;

/**
 * Full-viewport interactive lesson modal.
 * Blocks all interaction until the 7-step animated sequence completes.
 * Walks the child through how the math problem is solved with
 * one-by-one object animations, narration, and progressive equation building.
 */
export default function QuickLessonCard({
  show,
  num1,
  num2,
  operator,
  correctAnswer,
  explanation,
  objectType,
  character = 'benny',
  concept,
  onDismiss,
}: QuickLessonCardProps) {
  const isRoteCounting = concept?.startsWith('rote-counting') ?? false;
  const isNumberOrder = concept?.startsWith('number-order') ?? false;
  const isSequenceConcept = isRoteCounting || isNumberOrder;
  const isCountingOnly = !isSequenceConcept && num2 === 0 && operator === 'plus';
  const symbol = operator === 'plus' ? '+' : '−';
  const opColor = operator === 'plus' ? colors.mint : colors.coral;
  const { speak, speakNow, cancelSpeech, waitForSpeechEnd } = useAudio();
  const ObjectComponent = objectMap[objectType];

  const [step, setStep] = useState<LessonStep>(1);
  const [lessonComplete, setLessonComplete] = useState(false);
  // Track how many objects from group1/group2 have appeared
  const [group1Count, setGroup1Count] = useState(0);
  const [group2Count, setGroup2Count] = useState(0);
  // For subtraction: how many have been crossed out
  const [crossedOut, setCrossedOut] = useState(0);
  // Equation parts revealed
  const [eqPart, setEqPart] = useState(0); // 0-4: num1, op, num2, =, answer
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  /* ─── reset state whenever modal opens ─── */
  useEffect(() => {
    if (show) {
      setStep(1);
      setLessonComplete(false);
      setGroup1Count(0);
      setGroup2Count(0);
      setCrossedOut(0);
      setEqPart(0);
    } else {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      cancelSpeech();
    }
  }, [show, cancelSpeech]);

  /* ─── step logic & narration ─── */
  useEffect(() => {
    if (!show) return;

    const advanceStep = () => {
      setStep((s) => Math.min(s + 1, 7) as LessonStep);
    };

    switch (step) {
      /* Step 1: Character appears and speaks intro */
      case 1: {
        addTimer(() => {
          speakNow(`Hey! Let me show you how to solve this one. Ready?`);
        }, 400);
        addTimer(advanceStep, getStepDuration(1, num1, num2));
        break;
      }

      /* Step 2: First group objects appear one-by-one with counting */
      case 2: {
        if (isSequenceConcept) {
          addTimer(() => speak(`Let's count the numbers!`), 200);
          for (let i = 1; i <= num1; i++) {
            addTimer(() => {
              setGroup1Count(i);
              speak(`${i}`);
            }, COUNT_LEAD_IN + (i - 1) * 1100);
          }
        } else {
          addTimer(() => speak(`Let's count! We have ${num1} ${plural(num1, objectType)}.`), 200);
          for (let i = 1; i <= num1; i++) {
            addTimer(() => {
              setGroup1Count(i);
              speak(`${i}`);
            }, COUNT_LEAD_IN + (i - 1) * 1100);
          }
        }
        addTimer(advanceStep, getStepDuration(2, num1, num2));
        break;
      }

      /* Step 3: Operator symbol appears (skip for counting-only and sequences) */
      case 3: {
        if (isCountingOnly || isSequenceConcept) {
          addTimer(advanceStep, 100);
        } else {
          addTimer(() => {
            speak(operator === 'plus' ? 'Now we add more!' : 'Now we take some away!');
          }, 200);
          addTimer(advanceStep, getStepDuration(3, num1, num2));
        }
        break;
      }

      /* Step 4: Second group animates in (skip for counting-only and sequences) */
      case 4: {
        if (isCountingOnly || isSequenceConcept) {
          addTimer(advanceStep, 100);
        } else if (operator === 'plus') {
          addTimer(() => speak(`And ${num2} more ${plural(num2, objectType)}!`), 200);
          for (let i = 1; i <= num2; i++) {
            addTimer(() => {
              setGroup2Count(i);
              speak(`${num1 + i}`);
            }, COUNT_LEAD_IN + (i - 1) * 1100);
          }
          addTimer(advanceStep, getStepDuration(4, num1, num2));
        } else {
          addTimer(() => speak(`We take away ${num2}.`), 200);
          for (let i = 1; i <= num2; i++) {
            addTimer(() => {
              setCrossedOut(i);
              speak(`${i} gone`);
            }, COUNT_LEAD_IN + (i - 1) * 1100);
          }
          addTimer(advanceStep, getStepDuration(4, num1, num2));
        }
        break;
      }

      /* Step 5: Equation builds progressively — wait for speech before advancing */
      case 5: {
        if (isSequenceConcept) {
          addTimer(() => setEqPart(1), 200);
          addTimer(() => setEqPart(4), 700);
          const dir = isNumberOrder && operator === 'minus' ? 'before' : 'after';
          addTimer(() => {
            speak(`What comes ${dir} ${num1}?`);
            waitForSpeechEnd().then(() => addTimer(advanceStep, 400));
          }, 300);
        } else if (isCountingOnly) {
          addTimer(() => setEqPart(1), 200);
          addTimer(() => setEqPart(4), 700);
          addTimer(() => {
            speak(`How many ${plural(num1, objectType)}? Let's see...`);
            waitForSpeechEnd().then(() => addTimer(advanceStep, 400));
          }, 300);
        } else {
          addTimer(() => setEqPart(1), 200);   // num1
          addTimer(() => setEqPart(2), 700);   // operator
          addTimer(() => setEqPart(3), 1200);  // num2
          addTimer(() => setEqPart(4), 1700);  // equals sign
          addTimer(() => {
            speak(`${num1} ${operator === 'plus' ? 'plus' : 'minus'} ${num2} equals...`);
            waitForSpeechEnd().then(() => addTimer(advanceStep, 400));
          }, 300);
        }
        break;
      }

      /* Step 6: Answer reveals — wait for speech before advancing */
      case 6: {
        if (isSequenceConcept) {
          const dir = isNumberOrder && operator === 'minus' ? 'before' : 'after';
          addTimer(() => {
            speak(`${correctAnswer}! The number ${dir} ${num1} is ${correctAnswer}!`);
            waitForSpeechEnd().then(() => addTimer(advanceStep, 400));
          }, 300);
        } else if (isCountingOnly) {
          addTimer(() => {
            speak(`${correctAnswer}! There are ${correctAnswer} ${plural(correctAnswer, objectType)}!`);
            waitForSpeechEnd().then(() => addTimer(advanceStep, 400));
          }, 300);
        } else {
          addTimer(() => {
            speak(`${correctAnswer}! That's the answer!`);
            waitForSpeechEnd().then(() => addTimer(advanceStep, 400));
          }, 300);
        }
        break;
      }

      /* Step 7: Got it button */
      case 7: {
        addTimer(() => speak('Great job! You got it!'), 300);
        addTimer(() => setLessonComplete(true), 1200);
        break;
      }
    }

    return () => {
      // Don't clear all timers on re-render, only on unmount/show change
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, step]);

  /* ─── dismiss handler ─── */
  const handleDismiss = useCallback(() => {
    if (!lessonComplete) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelSpeech();
    onDismiss();
  }, [lessonComplete, onDismiss, cancelSpeech]);

  const objectSize = (num1 + num2) > 6 ? 32 : 42;

  /* ─── render individual object with optional cross-out ─── */
  const renderObject = (index: number, isCrossed: boolean, delay: number) => (
    <motion.div
      key={index}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isCrossed ? 0.7 : 1,
        opacity: isCrossed ? 0.3 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay }}
      style={{
        position: 'relative',
        width: objectSize,
        height: objectSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ObjectComponent />
      {/* Cross-out line for subtraction */}
      {isCrossed && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: -2,
            right: -2,
            height: 3,
            background: colors.coral,
            borderRadius: 2,
            transformOrigin: 'left center',
          }}
        />
      )}
    </motion.div>
  );

  /* ─── equation part component ─── */
  const eqPartStyle = (partIndex: number, isHighlight: boolean) => ({
    fontFamily: fontStack,
    fontWeight: 900 as const,
    fontSize: '2.6rem',
    color: isHighlight ? colors.sunny : '#fff',
    textShadow: isHighlight ? `0 0 20px ${colors.sunny}88` : 'none',
    transition: 'color 0.3s, text-shadow 0.3s',
    display: eqPart >= partIndex ? 'inline' : 'none',
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 100,
            background: 'linear-gradient(170deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '20px 16px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            pointerEvents: 'auto',
          }}
        >
          {/* Ambient floating particles */}
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              animate={{
                y: [0, -40, 0],
                x: [0, (i % 2 === 0 ? 15 : -15), 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.25,
              }}
              style={{
                position: 'absolute',
                width: 4 + (i % 4) * 3,
                height: 4 + (i % 4) * 3,
                borderRadius: '50%',
                background: confettiColors[i % confettiColors.length],
                top: `${8 + (i * 7) % 85}%`,
                left: `${3 + (i * 13) % 94}%`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Step indicator dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
            {([1, 2, 3, 4, 5, 6, 7] as LessonStep[]).map((s) => (
              <motion.div
                key={s}
                animate={{
                  background: s <= step ? opColor : 'rgba(255,255,255,0.25)',
                  scale: s === step ? 1.3 : 1,
                }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* ─── STEP 1: Character intro ─── */}
          <AnimatePresence>
            {step >= 1 && (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 8,
                  flex: '0 0 auto',
                }}
              >
                <div style={{ width: 100, height: 100 }}>
                  <CharacterDisplay
                    character={character}
                    mood={step >= 6 ? 'excited' : step >= 2 ? 'encouraging' : 'happy'}
                  />
                </div>
                {step === 1 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: 16,
                      padding: '10px 20px',
                      marginTop: 8,
                      maxWidth: 280,
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: fontStack,
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.9)',
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: 1.4,
                      }}
                    >
                      Let me show you how to solve this!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Main lesson stage ─── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 24,
              padding: '24px 20px',
              maxWidth: 420,
              width: '100%',
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* ─── STEP 2: First group — objects or number sequence appear one by one ─── */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center' }}
              >
                {step === 2 && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                      fontFamily: fontStack,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: 8,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isSequenceConcept ? 'What comes next?' : 'Count them!'}
                  </motion.div>
                )}
                {isSequenceConcept ? (
                  /* Sequence: show number tiles instead of objects */
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {Array.from({ length: num1 }, (_, i) => {
                      const appeared = step > 2 || i < group1Count;
                      return appeared ? (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: 'rgba(255,255,255,0.12)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: fontStack,
                            fontWeight: 900,
                            fontSize: '1.5rem',
                            color: '#fff',
                          }}
                        >
                          {i + 1}
                        </motion.div>
                      ) : null;
                    })}
                    {/* Question mark tile for the next number */}
                    {step >= 3 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: step >= 6 ? 'rgba(78,205,196,0.2)' : 'rgba(255,255,255,0.06)',
                          border: `2px solid ${step >= 6 ? '#4ECDC4' : 'rgba(255,255,255,0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: fontStack,
                          fontWeight: 900,
                          fontSize: '1.5rem',
                          color: step >= 6 ? colors.sunny : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {step >= 6 ? correctAnswer : '?'}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  /* Objects: normal counting display */
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: `${objectSize}px`,
                      }}
                    >
                      {Array.from({ length: num1 }, (_, i) => {
                        const appeared = step > 2 || i < group1Count;
                        // In subtraction step 4, cross out from the end
                        const isCrossed =
                          operator === 'minus' && step >= 4
                            ? i >= num1 - crossedOut
                            : false;
                        return appeared ? renderObject(i, isCrossed, 0) : null;
                      })}
                    </div>
                    {/* Counter badge */}
                    <motion.div
                      key={`g1-${step > 2 ? num1 : group1Count}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      style={{
                        fontFamily: fontStack,
                        fontWeight: 800,
                        fontSize: '1.6rem',
                        color: '#fff',
                        marginTop: 6,
                      }}
                    >
                      {step > 2 ? num1 : group1Count > 0 ? group1Count : ''}
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}

            {/* ─── STEP 3: Operator symbol (hidden for counting-only and sequences) ─── */}
            {step >= 3 && !isCountingOnly && !isSequenceConcept && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                style={{
                  fontFamily: fontStack,
                  fontWeight: 900,
                  fontSize: '2.8rem',
                  color: opColor,
                  lineHeight: 1,
                  textShadow: `0 0 24px ${opColor}66`,
                }}
              >
                {symbol}
              </motion.div>
            )}

            {/* ─── STEP 4: Second group (addition) / Cross-out visual (subtraction) ─── */}
            {step >= 4 && operator === 'plus' && !isCountingOnly && !isSequenceConcept && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: `${objectSize}px`,
                  }}
                >
                  {Array.from({ length: num2 }, (_, i) => {
                    const appeared = step > 4 || i < group2Count;
                    return appeared ? renderObject(i + 100, false, 0) : null;
                  })}
                </div>
                <motion.div
                  key={`g2-${step > 4 ? num2 : group2Count}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  style={{
                    fontFamily: fontStack,
                    fontWeight: 800,
                    fontSize: '1.6rem',
                    color: '#fff',
                    marginTop: 6,
                  }}
                >
                  {step > 4 ? num2 : group2Count > 0 ? group2Count : ''}
                </motion.div>
              </motion.div>
            )}

            {/* Subtraction: label for crossed-out objects */}
            {step >= 4 && operator === 'minus' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: fontStack,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: colors.coral,
                  letterSpacing: '0.03em',
                }}
              >
                {step === 4
                  ? crossedOut > 0
                    ? `Took away ${crossedOut} of ${num2}`
                    : 'Taking away...'
                  : `Took away ${num2}!`}
              </motion.div>
            )}

            {/* ─── STEP 5: Equation builds progressively ─── */}
            {step >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '12px 0',
                }}
              >
                <div
                  style={{
                    height: 2,
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 1,
                    margin: '0 0 16px',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                  {isSequenceConcept ? (
                    <>
                      {/* Sequence mode: "What comes next? = X" */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 1 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={eqPartStyle(1, eqPart === 1 && step === 5)}
                      >
                        {isNumberOrder
                          ? `${operator === 'minus' ? '?' : ''} ${num1} ${operator === 'plus' ? '?' : ''}`
                          : `${Array.from({ length: num1 }, (_, i) => i + 1).join(', ')}, ?`}
                      </motion.span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 4 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={eqPartStyle(4, eqPart === 4 && step === 5)}
                      >
                        =
                      </motion.span>
                      {step >= 6 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 250, damping: 12 }}
                          style={{
                            fontFamily: fontStack,
                            fontWeight: 900,
                            fontSize: '3.2rem',
                            color: colors.sunny,
                            textShadow: `0 0 24px ${colors.sunny}88, 0 0 48px ${colors.sunny}44`,
                          }}
                        >
                          {correctAnswer}
                        </motion.span>
                      )}
                    </>
                  ) : isCountingOnly ? (
                    <>
                      {/* Counting mode: "How many? = X" */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 1 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={eqPartStyle(1, eqPart === 1 && step === 5)}
                      >
                        How many?
                      </motion.span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 4 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={eqPartStyle(4, eqPart === 4 && step === 5)}
                      >
                        =
                      </motion.span>
                      {step >= 6 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 250, damping: 12 }}
                          style={{
                            fontFamily: fontStack,
                            fontWeight: 900,
                            fontSize: '3.2rem',
                            color: colors.sunny,
                            textShadow: `0 0 24px ${colors.sunny}88, 0 0 48px ${colors.sunny}44`,
                          }}
                        >
                          {correctAnswer}
                        </motion.span>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Part 1: num1 */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 1 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={eqPartStyle(1, eqPart === 1 && step === 5)}
                      >
                        {num1}
                      </motion.span>

                      {/* Part 2: operator */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 2 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={{
                          ...eqPartStyle(2, eqPart === 2 && step === 5),
                          color: eqPart === 2 && step === 5 ? opColor : '#fff',
                        }}
                      >
                        {symbol}
                      </motion.span>

                      {/* Part 3: num2 */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 3 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={eqPartStyle(3, eqPart === 3 && step === 5)}
                      >
                        {num2}
                      </motion.span>

                      {/* Part 4: equals sign */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: eqPart >= 4 ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={eqPartStyle(4, eqPart === 4 && step === 5)}
                      >
                        =
                      </motion.span>

                      {/* Part 5: Answer — only in step 6+ */}
                      {step >= 6 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 250, damping: 12 }}
                          style={{
                            fontFamily: fontStack,
                            fontWeight: 900,
                            fontSize: '3.2rem',
                            color: colors.sunny,
                            textShadow: `0 0 24px ${colors.sunny}88, 0 0 48px ${colors.sunny}44`,
                          }}
                        >
                          {correctAnswer}
                        </motion.span>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── STEP 6: Mini celebration ─── */}
            {step >= 6 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                style={{ position: 'relative', textAlign: 'center' }}
              >
                {/* Confetti burst */}
                <div style={{ position: 'relative', height: 40, width: 200, margin: '0 auto' }}>
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const dist = 30 + (i % 3) * 20;
                    return (
                      <motion.div
                        key={`confetti-${i}`}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1.5, 0.8],
                          x: Math.cos(angle) * dist,
                          y: Math.sin(angle) * dist,
                          opacity: [1, 1, 0.4],
                        }}
                        transition={{ duration: 1, delay: i * 0.04 }}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          width: 7,
                          height: 7,
                          borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? 2 : '30%',
                          background: confettiColors[i % confettiColors.length],
                        }}
                      />
                    );
                  })}
                </div>
                <p
                  style={{
                    fontFamily: fontStack,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.75)',
                    margin: '4px 0 0',
                    lineHeight: 1.4,
                  }}
                >
                  {explanation}
                </p>
              </motion.div>
            )}
          </div>

          {/* ─── Replay audio ─── */}
          <motion.button
            type="button"
            onClick={() => {
              if (step >= 5 && isSequenceConcept) {
                const dir = isNumberOrder && operator === 'minus' ? 'before' : 'after';
                speak(`What comes ${dir} ${num1}? ${correctAnswer}!`);
              } else if (step >= 5 && isCountingOnly) {
                speak(`How many ${plural(num1, objectType)}? There are ${correctAnswer}!`);
              } else if (step >= 5) {
                speak(`${num1} ${operator === 'plus' ? 'plus' : 'minus'} ${num2} equals ${correctAnswer}!`);
              } else if (step >= 2) {
                speak(`We have ${num1} ${plural(num1, objectType)}.`);
              } else {
                speak(`Let me show you how to solve this!`);
              }
            }}
            whileTap={{ scale: 0.85 }}
            aria-label="Replay lesson audio"
            style={{
              marginTop: 12,
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.06)',
              fontSize: '1.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flex: '0 0 auto',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            🔊
          </motion.button>

          {/* ─── Got It! button — only after ALL steps complete ─── */}
          <AnimatePresence>
            {step >= 7 && (
              <motion.button
                type="button"
                onClick={handleDismiss}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{
                  opacity: lessonComplete ? 1 : 0.3,
                  y: lessonComplete ? 0 : 20,
                  scale: lessonComplete ? [1, 1.05, 1] : 0.9,
                }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  scale: { repeat: lessonComplete ? Infinity : 0, duration: 1.8 },
                }}
                whileTap={lessonComplete ? { scale: 0.92 } : {}}
                style={{
                  marginTop: 14,
                  padding: '14px 52px',
                  border: 'none',
                  borderRadius: 22,
                  background: lessonComplete
                    ? `linear-gradient(135deg, ${colors.mint}, ${colors.sky})`
                    : 'rgba(255,255,255,0.1)',
                  color: lessonComplete ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontFamily: fontStack,
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  cursor: lessonComplete ? 'pointer' : 'default',
                  letterSpacing: '0.04em',
                  boxShadow: lessonComplete
                    ? `0 4px 24px rgba(78,205,196,0.35), 0 0 40px ${colors.mint}33`
                    : 'none',
                  flex: '0 0 auto',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {lessonComplete ? 'Got It!' : 'Watch the lesson…'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
