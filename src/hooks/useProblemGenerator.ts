import { useCallback, useRef } from 'react';
import type { MathProblem, Operator, ObjectType, CharacterName, SubConcept } from '../types';
import { gradients } from '../styles/theme';

const objectTypes: ObjectType[] = ['apple', 'star', 'heart', 'balloon', 'fish'];
const ALL_CHARACTERS: CharacterName[] = ['bloo', 'sunny', 'rosie', 'milo', 'pip', 'rex'];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWrongAnswers(correct: number, min: number, max: number, count = 2): number[] {
  const pool: number[] = [];
  for (let i = min; i <= max; i++) {
    if (i !== correct) pool.push(i);
  }
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

let idCounter = 0;

export default function useProblemGenerator(availableCharacters?: CharacterName[]) {
  const lastProblemRef = useRef<string>('');
  // Default to all characters if no unlock list is provided (legacy fallback)
  const characters = availableCharacters && availableCharacters.length > 0
    ? availableCharacters
    : ALL_CHARACTERS;

  const generate = useCallback((concept: SubConcept): MathProblem => {
    let num1: number;
    let num2: number;
    let operator: Operator;
    let answer: number;
    let wrongAnswers: number[];
    let explanation: string;
    let key: string;

    const objectType = pickRandom(objectTypes);
    const objectName = objectType === 'fish' ? 'fish' : objectType + 's';

    let attempts = 0;
    do {
      attempts++;

      switch (concept) {
        case 'rote-counting-5': {
          num1 = randInt(1, 4);
          num2 = 0;
          operator = 'plus';
          answer = num1 + 1;
          wrongAnswers = generateWrongAnswers(answer, 1, 6);
          explanation = `Let's count! ${Array.from({ length: num1 }, (_, i) => i + 1).join(', ')}, ${answer}! The next number after ${num1} is ${answer}!`;
          break;
        }
        case 'rote-counting-10': {
          num1 = randInt(1, 9);
          num2 = 0;
          operator = 'plus';
          answer = num1 + 1;
          wrongAnswers = generateWrongAnswers(answer, 1, 11);
          explanation = `Let's count! ${Array.from({ length: num1 }, (_, i) => i + 1).join(', ')}, ${answer}! The next number after ${num1} is ${answer}!`;
          break;
        }
        case 'subitizing-5': {
          // Subitizing = instant quantity recognition from a dot pattern.
          // Visual is a dice/domino arrangement (NOT countable in a row), so
          // the kid has to recognize the quantity at a glance — the answer
          // is never shown numerically.
          num1 = randInt(1, 5);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          wrongAnswers = generateWrongAnswers(answer, 1, 6);
          explanation = `That's ${num1} dots! Quick eyes!`;
          break;
        }
        case 'subitizing-10': {
          num1 = randInt(1, 10);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          wrongAnswers = generateWrongAnswers(answer, 1, 11);
          explanation = `That's ${num1} dots! Quick eyes!`;
          break;
        }
        case 'one-to-one-5': {
          num1 = randInt(1, 5);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          wrongAnswers = generateWrongAnswers(answer, 1, 6);
          const seq5 = Array.from({ length: num1 }, (_, i) => i + 1).join(', ');
          explanation = `Let's count together! ${seq5}! There are ${num1} ${objectName}!`;
          break;
        }
        case 'one-to-one-10': {
          num1 = randInt(1, 10);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          wrongAnswers = generateWrongAnswers(answer, 1, 11);
          const seq10 = Array.from({ length: num1 }, (_, i) => i + 1).join(', ');
          explanation = `Let's count together! ${seq10}! There are ${num1} ${objectName}!`;
          break;
        }
        case 'cardinality-5': {
          num1 = randInt(1, 5);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          wrongAnswers = generateWrongAnswers(answer, 1, 6);
          explanation = `There are ${num1} ${objectName} altogether! The last number we count is how many there are!`;
          break;
        }
        case 'cardinality-10': {
          num1 = randInt(1, 10);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          wrongAnswers = generateWrongAnswers(answer, 1, 11);
          explanation = `There are ${num1} ${objectName} altogether! The last number we count is how many there are!`;
          break;
        }
        case 'comparing-easy': {
          const small = randInt(1, 2);
          const big = randInt(small + 3, 5);
          if (Math.random() < 0.5) { num1 = small; num2 = big; } else { num1 = big; num2 = small; }
          operator = 'plus';
          answer = Math.max(num1, num2);
          wrongAnswers = generateWrongAnswers(answer, 1, 5);
          explanation = `One group has ${num1} and the other has ${num2}. ${answer} is more because it's a bigger number!`;
          break;
        }
        case 'comparing-close': {
          num1 = randInt(1, 9);
          const diff = randInt(1, 2);
          num2 = Math.random() < 0.5 ? Math.min(10, num1 + diff) : Math.max(1, num1 - diff);
          if (num1 === num2) num2 = Math.min(10, num1 + 1);
          operator = 'plus';
          answer = Math.max(num1, num2);
          wrongAnswers = generateWrongAnswers(answer, 1, 10);
          explanation = `One group has ${num1} and the other has ${num2}. ${answer} is more!`;
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
          wrongAnswers = generateWrongAnswers(answer, 1, 6);
          const dir5 = operator === 'plus' ? 'after' : 'before';
          explanation = `The number ${dir5} ${num1} is ${answer}!`;
          break;
        }
        case 'number-order-10': {
          if (Math.random() < 0.5) {
            num1 = randInt(1, 9);
            operator = 'plus';
            answer = num1 + 1;
          } else {
            num1 = randInt(2, 10);
            operator = 'minus';
            answer = num1 - 1;
          }
          num2 = 0;
          wrongAnswers = generateWrongAnswers(answer, 1, 11);
          const dir10 = operator === 'plus' ? 'after' : 'before';
          explanation = `The number ${dir10} ${num1} is ${answer}!`;
          break;
        }
        case 'counting-on': {
          num1 = randInt(1, 5);
          num2 = randInt(1, 3);
          operator = 'plus';
          answer = num1 + num2;
          wrongAnswers = generateWrongAnswers(answer, 1, 10);
          const countSeq = Array.from({ length: num2 }, (_, i) => num1 + i + 1).join(', ');
          explanation = `Start at ${num1}, count ${num2} more: ${countSeq}! We land on ${answer}!`;
          break;
        }
        case 'addition-small': {
          num1 = randInt(1, 4);
          num2 = randInt(1, 5 - num1);
          operator = 'plus';
          answer = num1 + num2;
          wrongAnswers = generateWrongAnswers(answer, 0, 6);
          explanation = `${num1} plus ${num2}! Count them all together: ${answer}!`;
          break;
        }
        case 'addition-10': {
          num1 = randInt(1, 9);
          num2 = randInt(1, Math.min(9, 10 - num1));
          operator = 'plus';
          answer = num1 + num2;
          wrongAnswers = generateWrongAnswers(answer, 0, 11);
          explanation = `${num1} plus ${num2} equals ${answer}! Let's count them all!`;
          break;
        }
        case 'subtraction-small': {
          num1 = randInt(2, 5);
          num2 = randInt(1, num1 - 1);
          operator = 'minus';
          answer = num1 - num2;
          wrongAnswers = generateWrongAnswers(answer, 0, 5);
          explanation = `Start with ${num1}, take away ${num2}. That leaves ${answer}!`;
          break;
        }
        case 'subtraction-10': {
          num1 = randInt(2, 10);
          num2 = randInt(1, num1 - 1);
          operator = 'minus';
          answer = num1 - num2;
          wrongAnswers = generateWrongAnswers(answer, 0, 10);
          explanation = `${num1} minus ${num2} equals ${answer}! We started with ${num1} and took away ${num2}.`;
          break;
        }
        default: {
          num1 = randInt(1, 5);
          num2 = 0;
          operator = 'plus';
          answer = num1;
          wrongAnswers = generateWrongAnswers(answer, 1, 6);
          explanation = `There are ${num1} ${objectName}!`;
        }
      }

      key = `${num1}-${operator}-${num2}-${concept}`;
    } while (key === lastProblemRef.current && attempts < 50);

    lastProblemRef.current = key;
    idCounter += 1;

    return {
      id: `problem-${idCounter}`,
      num1,
      num2,
      operator,
      answer,
      wrongAnswers,
      objectType,
      character: pickRandom(characters),  // unlocked characters only
      backgroundColor: pickRandom(gradients),
      explanation,
      concept,
    };
  }, [characters]);

  return generate;
}
