import { useCallback, useRef } from 'react';
import type { MathProblem, Operator, ObjectType, CharacterName, SubConcept } from '../types';
import { gradients } from '../styles/theme';

/**
 * Problem generator with:
 *   1. Smart, misconception-based distractors (not random)
 *   2. Within-concept difficulty ramping (easy first, harder as attempts grow)
 *   3. Per-concept problem variety + repeat prevention over the last 3 problems
 *
 * `difficulty` is a 0..1 float — caller derives it from how many attempts the
 * child has put into this sub-concept (a fresh concept starts at 0, a kid
 * nearing mastery is ≥ 0.8). Use `ramp()` to pick a number range from it.
 */

const objectTypes: ObjectType[] = ['apple', 'star', 'heart', 'balloon', 'fish'];
const ALL_CHARACTERS: CharacterName[] = ['bloo', 'sunny', 'rosie', 'milo', 'pip', 'rex'];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  if (max < min) max = min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Difficulty ramp — pick a max bound that grows with difficulty. */
function ramp(difficulty: number, easyMax: number, midMax: number, hardMax: number): number {
  if (difficulty < 0.35) return easyMax;
  if (difficulty < 0.75) return midMax;
  return hardMax;
}

/**
 * Smart distractors. Every preschool math mistake has a pattern — "off by one",
 * "used the wrong operator", "just said the first number", "confused direction".
 * We build a pool of misconception-based candidates and pick 2 unique ones.
 * Falls back to adjacent numbers if no targeted candidates remain.
 */
function smartDistractors(
  concept: SubConcept,
  correct: number,
  num1: number,
  num2: number,
  hardCap: number,
): number[] {
  const candidates: number[] = [];
  const plusMinus = [correct + 1, correct - 1, correct + 2, correct - 2];

  if (concept.startsWith('rote-counting') || concept.startsWith('number-order')) {
    // Confusing direction (pick the given number) and adjacent numbers
    candidates.push(num1, num1 - 1, num1 + 2, ...plusMinus);
  } else if (concept.startsWith('subitizing') || concept.startsWith('cardinality') || concept.startsWith('one-to-one')) {
    // Quantity mistakes are almost always ±1 or ±2
    candidates.push(...plusMinus);
  } else if (concept.startsWith('comparing')) {
    // Kid often picks the smaller set, or the sum, or an adjacent number
    candidates.push(Math.min(num1, num2), num1 + num2, correct - 1, correct + 1);
  } else if (concept === 'counting-on' || concept.startsWith('addition') || concept === 'doubles') {
    // Forgetting to add either addend, subtracting instead, off-by-one, doubled wrong
    candidates.push(num1, num2, Math.max(0, num1 - num2), correct + 1, correct - 1, correct + 2);
  } else if (concept === 'make-10') {
    // "Ten minus wrong", off-by-one, returning one of the given numbers
    candidates.push(correct + 1, correct - 1, num1, 10 - num1 - 1, correct + 2);
  } else if (concept === 'decomposition') {
    // Kid picks the total, the other part, or adjacent
    candidates.push(num1, num2, correct + 1, correct - 1, num1 - num2);
  } else if (concept.startsWith('subtraction')) {
    // Added instead, forgot the take-away, off-by-one
    candidates.push(num1 + num2, num1, num2, correct + 1, correct - 1, correct + 2);
  } else {
    candidates.push(...plusMinus);
  }

  // Filter: valid range, not the correct answer, unique
  const seen = new Set<number>();
  const pool: number[] = [];
  for (const c of candidates) {
    if (c >= 0 && c <= hardCap && c !== correct && !seen.has(c)) {
      seen.add(c);
      pool.push(c);
    }
  }

  // If we somehow ran out of targeted distractors, pad with nearby numbers
  let offset = 1;
  while (pool.length < 2 && offset <= hardCap) {
    for (const candidate of [correct + offset, correct - offset]) {
      if (candidate >= 0 && candidate <= hardCap && candidate !== correct && !seen.has(candidate)) {
        seen.add(candidate);
        pool.push(candidate);
      }
    }
    offset += 1;
  }

  // Shuffle and take 2
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 2);
}

let idCounter = 0;

export default function useProblemGenerator(availableCharacters?: CharacterName[]) {
  // Track the last few problems so we never repeat the same one back-to-back
  // (previously only the last 1 — a 2-problem cycle could recur).
  const lastKeysRef = useRef<string[]>([]);
  const characters = availableCharacters && availableCharacters.length > 0
    ? availableCharacters
    : ALL_CHARACTERS;

  const generate = useCallback((concept: SubConcept, difficulty = 0.5): MathProblem => {
    let num1 = 0;
    let num2 = 0;
    let operator: Operator = 'plus';
    let answer = 0;
    let explanation = '';
    let key = '';

    const objectType = pickRandom(objectTypes);
    const objectName = objectType === 'fish' ? 'fish' : objectType + 's';

    // Regenerate until we get a problem that isn't in the recent history
    let attempts = 0;
    do {
      attempts++;

      switch (concept) {
        case 'rote-counting-5': {
          num1 = randInt(1, ramp(difficulty, 3, 4, 4));
          num2 = 0;
          operator = 'plus';
          answer = num1 + 1;
          explanation = `Let's count! ${Array.from({ length: num1 }, (_, i) => i + 1).join(', ')}, ${answer}!`;
          break;
        }
        case 'rote-counting-10': {
          num1 = randInt(ramp(difficulty, 1, 1, 1), ramp(difficulty, 6, 8, 9));
          num2 = 0;
          operator = 'plus';
          answer = num1 + 1;
          explanation = `Let's count! ${Array.from({ length: num1 }, (_, i) => i + 1).join(', ')}, ${answer}!`;
          break;
        }
        case 'subitizing-5': {
          num1 = randInt(ramp(difficulty, 1, 1, 1), ramp(difficulty, 3, 4, 5));
          num2 = 0;
          operator = 'plus';
          answer = num1;
          explanation = `That's ${num1} dots! Quick eyes!`;
          break;
        }
        case 'subitizing-10': {
          num1 = randInt(ramp(difficulty, 2, 3, 4), ramp(difficulty, 6, 8, 10));
          num2 = 0;
          operator = 'plus';
          answer = num1;
          explanation = `That's ${num1} dots! Quick eyes!`;
          break;
        }
        case 'one-to-one-5': {
          num1 = randInt(1, ramp(difficulty, 3, 4, 5));
          num2 = 0;
          operator = 'plus';
          answer = num1;
          explanation = `Let's count together! There are ${num1} ${objectName}!`;
          break;
        }
        case 'one-to-one-10': {
          num1 = randInt(ramp(difficulty, 3, 4, 5), ramp(difficulty, 7, 9, 10));
          num2 = 0;
          operator = 'plus';
          answer = num1;
          explanation = `Let's count together! There are ${num1} ${objectName}!`;
          break;
        }
        case 'cardinality-5': {
          num1 = randInt(1, ramp(difficulty, 3, 4, 5));
          num2 = 0;
          operator = 'plus';
          answer = num1;
          explanation = `The last number we count is how many! ${num1} ${objectName}!`;
          break;
        }
        case 'cardinality-10': {
          num1 = randInt(ramp(difficulty, 3, 4, 5), ramp(difficulty, 7, 9, 10));
          num2 = 0;
          operator = 'plus';
          answer = num1;
          explanation = `The last number we count is how many! ${num1} ${objectName}!`;
          break;
        }
        case 'comparing-easy': {
          const small = randInt(1, 2);
          const big = randInt(small + 3, 5);
          if (Math.random() < 0.5) { num1 = small; num2 = big; } else { num1 = big; num2 = small; }
          operator = 'plus';
          answer = Math.max(num1, num2);
          explanation = `${answer} is more than ${Math.min(num1, num2)}!`;
          break;
        }
        case 'comparing-close': {
          // Gap narrows with difficulty — easier early, closer together later
          const maxGap = ramp(difficulty, 3, 2, 1);
          num1 = randInt(1, 9);
          const diff = randInt(1, maxGap);
          num2 = Math.random() < 0.5 ? Math.min(10, num1 + diff) : Math.max(1, num1 - diff);
          if (num1 === num2) num2 = Math.min(10, num1 + 1);
          operator = 'plus';
          answer = Math.max(num1, num2);
          explanation = `${answer} is more than ${Math.min(num1, num2)}!`;
          break;
        }
        case 'number-order-5': {
          if (Math.random() < 0.5) {
            num1 = randInt(1, 4);
            operator = 'plus';
            answer = num1 + 1;
          } else {
            num1 = randInt(2, 5);
            operator = 'minus';
            answer = num1 - 1;
          }
          num2 = 0;
          const dir5 = operator === 'plus' ? 'after' : 'before';
          explanation = `${answer} comes ${dir5} ${num1}!`;
          break;
        }
        case 'number-order-10': {
          if (Math.random() < 0.5) {
            num1 = randInt(ramp(difficulty, 1, 3, 5), 9);
            operator = 'plus';
            answer = num1 + 1;
          } else {
            num1 = randInt(ramp(difficulty, 2, 4, 6), 10);
            operator = 'minus';
            answer = num1 - 1;
          }
          num2 = 0;
          const dir10 = operator === 'plus' ? 'after' : 'before';
          explanation = `${answer} comes ${dir10} ${num1}!`;
          break;
        }
        case 'counting-on': {
          num1 = randInt(2, ramp(difficulty, 4, 5, 6));
          num2 = randInt(1, ramp(difficulty, 2, 2, 3));
          operator = 'plus';
          answer = num1 + num2;
          explanation = `Start at ${num1}, count ${num2} more — ${answer}!`;
          break;
        }
        case 'addition-small': {
          // Range grows slowly so kids first practice 1+1..2+2 then up to 5
          const max = ramp(difficulty, 3, 4, 5);
          num1 = randInt(1, max - 1);
          num2 = randInt(1, max - num1);
          operator = 'plus';
          answer = num1 + num2;
          explanation = `${num1} plus ${num2} is ${answer}!`;
          break;
        }
        case 'doubles': {
          // Doubles facts: 1+1..5+5 early, up to 10+10 at the hardest
          const max = ramp(difficulty, 3, 5, 10);
          num1 = randInt(1, max);
          num2 = num1;
          operator = 'plus';
          answer = num1 + num2;
          explanation = `Double ${num1} is ${answer}! ${num1} + ${num1} = ${answer}.`;
          break;
        }
        case 'decomposition': {
          // "Total = part + ?" — kid finds the missing addend.
          // Total grows with difficulty.
          const total = randInt(ramp(difficulty, 3, 4, 5), ramp(difficulty, 5, 7, 10));
          num1 = randInt(1, total - 1);  // the given part
          num2 = total;                   // encoded as num2 so LessonCard knows the target
          operator = 'plus';
          answer = total - num1;          // the missing part
          explanation = `${total} is ${num1} and ${answer} together!`;
          break;
        }
        case 'addition-10': {
          // Gradually grow the sum range
          const maxSum = ramp(difficulty, 6, 8, 10);
          num1 = randInt(1, maxSum - 1);
          num2 = randInt(1, maxSum - num1);
          operator = 'plus';
          answer = num1 + num2;
          explanation = `${num1} plus ${num2} is ${answer}!`;
          break;
        }
        case 'make-10': {
          // "N + ? = 10" — bridge strategy.
          num1 = randInt(ramp(difficulty, 5, 3, 1), ramp(difficulty, 8, 9, 9));
          num2 = 10;                      // target total
          operator = 'plus';
          answer = 10 - num1;
          explanation = `${num1} plus ${answer} makes 10!`;
          break;
        }
        case 'subtraction-small': {
          const max = ramp(difficulty, 4, 5, 5);
          num1 = randInt(2, max);
          num2 = randInt(1, num1 - 1);
          operator = 'minus';
          answer = num1 - num2;
          explanation = `${num1} minus ${num2} leaves ${answer}!`;
          break;
        }
        case 'subtraction-10': {
          const max = ramp(difficulty, 6, 8, 10);
          num1 = randInt(ramp(difficulty, 3, 4, 5), max);
          num2 = randInt(1, num1 - 1);
          operator = 'minus';
          answer = num1 - num2;
          explanation = `${num1} minus ${num2} leaves ${answer}!`;
          break;
        }
        default: {
          num1 = randInt(1, 5);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          explanation = `There are ${num1} ${objectName}!`;
        }
      }

      key = `${concept}-${num1}-${operator}-${num2}-${answer}`;
    } while (lastKeysRef.current.includes(key) && attempts < 25);

    // Keep history of last 3 to avoid the same problem coming back immediately
    lastKeysRef.current = [...lastKeysRef.current, key].slice(-3);
    idCounter += 1;

    // Compute the upper bound for distractors based on concept range
    const hardCap = concept.includes('-5') || concept === 'addition-small' || concept === 'subtraction-small'
      ? 6
      : concept === 'doubles' ? 20
      : concept === 'make-10' || concept === 'decomposition' ? 10
      : 11;

    const wrongAnswers = smartDistractors(concept, answer, num1, num2, hardCap);

    return {
      id: `problem-${idCounter}`,
      num1,
      num2,
      operator,
      answer,
      wrongAnswers,
      objectType,
      character: pickRandom(characters),
      backgroundColor: pickRandom(gradients),
      explanation,
      concept,
    };
  }, [characters]);

  return generate;
}
