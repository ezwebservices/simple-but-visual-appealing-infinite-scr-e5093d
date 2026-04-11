import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MathProblem, SubConcept, CharacterName } from '../types';
import LessonCard from './LessonCard';
import useProblemGenerator from '../hooks/useProblemGenerator';

interface InfiniteScrollProps {
  onCorrect: (problem: MathProblem) => void;
  onWrong: (problem: MathProblem) => void;
  onSpeak: (text: string) => void;
  isSpeaking?: boolean;
  /**
   * Active concept to use when no review is due. The parent closes over
   * the child profile and returns the current linear-progression concept
   * via useMastery.getActiveConcept.
   */
  concept: SubConcept;
  /**
   * Optional: returns the concept for a given problem index. Used to
   * interleave spaced-repetition review of mastered concepts every Nth
   * problem. If omitted, every problem uses `concept`.
   */
  getConceptForIndex?: (index: number) => SubConcept;
  /**
   * Optional: per-concept difficulty factor 0..1 (0 = easier, 1 = full range).
   * Passed to the problem generator's difficulty ramp.
   */
  getDifficultyForConcept?: (concept: SubConcept) => number;
  /** Pool of unlocked characters for problem generation */
  availableCharacters?: CharacterName[];
  /** Highest dance move unlocked (1–5) */
  unlockedDanceMoves?: number;
}

/**
 * Single-question pager. Shows exactly one problem at a time — no scroll,
 * no back, no forward skip. When the child answers correctly, LessonCard
 * calls `onAdvance` (after its celebration) which swaps to the next problem
 * with a slide transition. The NEXT concept is picked by `getConceptForIndex`,
 * which lets the parent interleave spaced reviews of mastered concepts.
 */
export default function InfiniteScroll({
  onCorrect,
  onWrong,
  onSpeak,
  isSpeaking,
  concept,
  getConceptForIndex,
  getDifficultyForConcept,
  availableCharacters,
  unlockedDanceMoves = 1,
}: InfiniteScrollProps) {
  const generate = useProblemGenerator(availableCharacters);

  // Problem index — every advance bumps it so the review rotation can fire.
  const indexRef = useRef(0);

  const pickConcept = useCallback((index: number): SubConcept => {
    if (getConceptForIndex) return getConceptForIndex(index);
    return concept;
  }, [getConceptForIndex, concept]);

  const [problem, setProblem] = useState<MathProblem>(() => {
    const c = pickConcept(0);
    const d = getDifficultyForConcept?.(c) ?? 0.5;
    return generate(c, d);
  });

  const handleAdvance = useCallback(() => {
    indexRef.current += 1;
    const c = pickConcept(indexRef.current);
    const d = getDifficultyForConcept?.(c) ?? 0.5;
    setProblem(generate(c, d));
  }, [generate, pickConcept, getDifficultyForConcept]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={problem.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <LessonCard
            problem={problem}
            isActive={true}
            onCorrect={() => onCorrect(problem)}
            onWrong={() => onWrong(problem)}
            onAdvance={handleAdvance}
            onSpeak={onSpeak}
            isSpeaking={isSpeaking}
            unlockedDanceMoves={unlockedDanceMoves}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
