import { useState, useCallback, useRef, useEffect } from 'react';
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

const BUFFER_AHEAD = 3;

export default function InfiniteScroll({ onCorrect, onWrong, onSpeak, isSpeaking, concept, availableCharacters, unlockedDanceMoves = 1 }: InfiniteScrollProps) {
  const generate = useProblemGenerator(availableCharacters);
  const [cards, setCards] = useState<MathProblem[]>(() =>
    Array.from({ length: BUFFER_AHEAD + 1 }, () => generate(concept)),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  // Grow the list when user scrolls near the end
  const maybeGrow = useCallback(
    (visibleIndex: number) => {
      setActiveIndex(visibleIndex);
      setCards((prev) => {
        const remaining = prev.length - visibleIndex - 1;
        if (remaining < BUFFER_AHEAD) {
          const needed = BUFFER_AHEAD - remaining;
          return [...prev, ...Array.from({ length: needed }, () => generate(concept))];
        }
        return prev;
      });
    },
    [generate, concept],
  );

  // Intersection Observer to detect which card is in view
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(idx)) maybeGrow(idx);
          }
        }
      },
      { threshold: 0.6 },
    );

    return () => observerRef.current?.disconnect();
  }, [maybeGrow]);

  // Attach observer to each card ref
  const setCardRef = useCallback(
    (id: string, index: number) => (node: HTMLDivElement | null) => {
      if (node) {
        node.setAttribute('data-index', String(index));
        cardRefsMap.current.set(id, node);
        observerRef.current?.observe(node);
      }
    },
    [],
  );

  const scrollToCard = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const nextCard = Array.from(container.children)[index] as HTMLElement | undefined;
      if (!nextCard) return;
      container.scrollTo({ top: nextCard.offsetTop, behavior: 'smooth' });
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {cards.map((problem, i) => (
        <div key={problem.id} ref={setCardRef(problem.id, i)}>
          <LessonCard
            problem={problem}
            isActive={i === activeIndex}
            onCorrect={() => onCorrect(problem)}
            onWrong={() => onWrong(problem)}
            onAdvance={() => scrollToCard(i + 1)}
            onSpeak={onSpeak}
            isSpeaking={i === activeIndex ? isSpeaking : false}
            unlockedDanceMoves={unlockedDanceMoves}
          />
        </div>
      ))}
    </div>
  );
}
