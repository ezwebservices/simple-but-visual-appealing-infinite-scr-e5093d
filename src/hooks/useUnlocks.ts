import type { ChildProfile, CharacterName } from '../types';
import {
  CHARACTER_UNLOCK_ORDER,
  CHARACTER_UNLOCK_THRESHOLDS,
  DANCE_MOVE_THRESHOLDS,
} from '../types';

/**
 * Pure functions for the reward unlock system.
 *
 * Two reward axes, both gated on `masteredCount` (number of mastered sub-concepts):
 *   1. Characters — start with bloo only, others unlock at 1/3/5/7/10 mastered
 *   2. Dance moves — start with move 1 only, more unlock at 2/4/6/9 mastered
 *
 * Designed for 4-year-olds: no text, all visual + auditory feedback.
 */

/** Count how many sub-concepts the child has mastered */
export function countMastered(child: ChildProfile): number {
  return Object.values(child.conceptProgress)
    .filter(p => p.status === 'mastered')
    .length;
}

/** Which characters are currently unlocked for this child? */
export function getUnlockedCharacters(child: ChildProfile): CharacterName[] {
  const mastered = countMastered(child);
  return CHARACTER_UNLOCK_ORDER.filter(
    name => mastered >= CHARACTER_UNLOCK_THRESHOLDS[name]
  );
}

/** Highest dance move unlocked (1–5) */
export function getUnlockedDanceMoves(child: ChildProfile): number {
  const mastered = countMastered(child);
  let highest = 1;
  for (let i = 0; i < DANCE_MOVE_THRESHOLDS.length; i++) {
    if (mastered >= DANCE_MOVE_THRESHOLDS[i]) {
      highest = i + 1;
    }
  }
  return highest;
}

/** Pick a random dance move from the unlocked pool (1..highest) */
export function pickRandomDance(child: ChildProfile): number {
  const max = getUnlockedDanceMoves(child);
  return Math.floor(Math.random() * max) + 1;
}

/** Detect new unlocks by comparing before/after profiles. Returns null if nothing new. */
export interface UnlockEvent {
  newCharacters: CharacterName[];
  newDanceMoves: number[];
}
export function detectNewUnlocks(
  before: ChildProfile,
  after: ChildProfile,
): UnlockEvent | null {
  const beforeChars = new Set(getUnlockedCharacters(before));
  const afterChars = getUnlockedCharacters(after);
  const newCharacters = afterChars.filter(c => !beforeChars.has(c));

  const beforeMaxDance = getUnlockedDanceMoves(before);
  const afterMaxDance = getUnlockedDanceMoves(after);
  const newDanceMoves: number[] = [];
  for (let d = beforeMaxDance + 1; d <= afterMaxDance; d++) {
    newDanceMoves.push(d);
  }

  if (newCharacters.length === 0 && newDanceMoves.length === 0) return null;
  return { newCharacters, newDanceMoves };
}

/** Progress toward the NEXT character unlock (0–1). Returns null if all unlocked. */
export function progressToNextCharacter(child: ChildProfile): {
  next: CharacterName;
  progress: number;
  current: number;
  needed: number;
} | null {
  const mastered = countMastered(child);
  for (const name of CHARACTER_UNLOCK_ORDER) {
    const threshold = CHARACTER_UNLOCK_THRESHOLDS[name];
    if (mastered < threshold) {
      const prevThreshold = Math.max(
        ...CHARACTER_UNLOCK_ORDER
          .filter(n => CHARACTER_UNLOCK_THRESHOLDS[n] < threshold)
          .map(n => CHARACTER_UNLOCK_THRESHOLDS[n]),
        0,
      );
      const range = threshold - prevThreshold;
      const done = mastered - prevThreshold;
      return {
        next: name,
        progress: range > 0 ? done / range : 0,
        current: mastered,
        needed: threshold,
      };
    }
  }
  return null;
}

/** Progress toward the NEXT dance move unlock (0–1). Returns null if all 5 unlocked. */
export function progressToNextDance(child: ChildProfile): {
  nextMove: number;
  progress: number;
  current: number;
  needed: number;
} | null {
  const mastered = countMastered(child);
  for (let i = 0; i < DANCE_MOVE_THRESHOLDS.length; i++) {
    const threshold = DANCE_MOVE_THRESHOLDS[i];
    if (mastered < threshold) {
      const prev = i > 0 ? DANCE_MOVE_THRESHOLDS[i - 1] : 0;
      const range = threshold - prev;
      const done = mastered - prev;
      return {
        nextMove: i + 1,
        progress: range > 0 ? done / range : 0,
        current: mastered,
        needed: threshold,
      };
    }
  }
  return null;
}
