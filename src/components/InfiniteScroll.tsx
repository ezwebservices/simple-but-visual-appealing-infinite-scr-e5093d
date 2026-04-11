import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MathProblem, SubConcept, CharacterName } from '../types';
import LessonCard from './LessonCard';
import useProblemGenerator from '../hooks/useProblemGenerator';

interface InfiniteScrollProps {
  onCorrect: (problem: MathProblem) => void;
  onWrong: (problem: MathProblem) => void;
  onSpeak: (text: string) => void;
  isSpeaking?: boolean;
  concept: SubConcept;
  /** Pool of unlocked characters for problem generation */
  availableCharacters?: CharacterName[];
  /** Highest dance move unlocked (1–5) */
  unlockedDanceMoves?: number;
}

/**
 * Single-question pager. Shows exactly one problem at a time — no scroll, no
 * back button, no forward skip. When the child answers correctly, LessonCard
 * calls `onAdvance` (after its celebration) which swaps to the next problem
 * with a slide transition. This is the learning loop for every mastery concept.
 *
 * Previous versions used IntersectionObserver + scroll-snap but the list could
 * desync and "freeze," and users could scroll past questions without answering.
 */
export default function InfiniteScroll({
  onCorrect,
  onWrong,
  onSpeak,
  isSpeaking,
  concept,
  availableCharacters,
  unlockedDanceMoves = 1,
}: InfiniteScrollProps) {
  const generate = useProblemGenerator(availableCharacters);
  const [problem, setProblem] = useState<MathProblem>(() => generate(concept));

  const handleAdvance = useCallback(() => {
    setProblem(generate(concept));
  }, [generate, concept]);

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
