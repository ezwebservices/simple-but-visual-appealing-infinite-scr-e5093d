import { useCallback } from 'react';
import type { ChildProfile, SubConcept, SubConceptProgress, ActivityEntry, Operator } from '../types';
import { SUB_CONCEPT_ORDER } from '../types';

/**
 * Adaptive mastery algorithm (v3).
 *
 * Changes vs. the original "5-in-a-row or 80%-in-10" rule:
 *
 * 1. Stricter mastery (no trivial shortcuts):
 *    - Requires ≥ 15 total attempts AND ≥ 12 attempts in the rolling window
 *      AND ≥ 85% accuracy in that window. No more fast-tracking with a lucky
 *      5-in-a-row — the streak shortcut is now 10, which is genuinely
 *      exceptional.
 *
 * 2. Spaced review interleaving:
 *    - Every REVIEW_INTERVAL problems, `getNextProblemConcept` returns a
 *      random mastered sub-concept for a quick review instead of the linear
 *      active concept. Retention across the 20 sub-concepts was previously
 *      zero — once mastered, a concept was never seen again.
 *    - If review performance on a mastered concept falls below 60% over its
 *      last 8 attempts, it gets demoted back to 'active' for re-mastery.
 *
 * 3. Softer struggle drop-back:
 *    - Window widened from 6 to 10 attempts; threshold relaxed from 50% to
 *      40%. This protects kids from being demoted after a short bad streak.
 *    - On drop-back, the current concept becomes 'active' again (not
 *      'locked') and keeps its historical totals — only the rolling window
 *      and streak reset. The previous concept is re-opened as 'active' for
 *      review, not wiped back to zero.
 */

export const MIN_ATTEMPTS = 15;
export const MASTERY_WINDOW = 12;
export const MASTERY_ACCURACY = 0.85;
export const STREAK_SHORTCUT = 10;
export const STRUGGLE_WINDOW = 10;
export const STRUGGLE_ACCURACY = 0.40;
export const REVIEW_INTERVAL = 5;          // every 5th problem is a review
export const REVIEW_DEGRADATION_WINDOW = 8;
export const REVIEW_DEGRADATION_THRESHOLD = 0.60;

function getRecentAccuracy(attempts: boolean[], window: number): number {
  const recent = attempts.slice(-window);
  if (recent.length === 0) return 0;
  return recent.filter(Boolean).length / recent.length;
}

/** Count mastered sub-concepts in a profile (used by unlock code elsewhere). */
export function getMasteredCount(child: ChildProfile): number {
  let count = 0;
  for (const concept of SUB_CONCEPT_ORDER) {
    if (child.conceptProgress[concept]?.status === 'mastered') count += 1;
  }
  return count;
}

/**
 * The first 'active' concept in linear order, or the last sub-concept if
 * everything is already mastered.
 */
function getActiveConceptInner(child: ChildProfile): SubConcept {
  for (const concept of SUB_CONCEPT_ORDER) {
    if (child.conceptProgress[concept]?.status === 'active') {
      return concept;
    }
  }
  return SUB_CONCEPT_ORDER[SUB_CONCEPT_ORDER.length - 1];
}

export default function useMastery() {
  const recordAnswer = useCallback((
    child: ChildProfile,
    concept: SubConcept,
    correct: boolean,
    num1: number,
    num2: number,
    operator: Operator,
  ): { updatedChild: ChildProfile; conceptUnlocked: SubConcept | null } => {
    const cp: SubConceptProgress = { ...child.conceptProgress[concept] };
    cp.totalAttempted += 1;
    if (correct) {
      cp.totalCorrect += 1;
      cp.streak += 1;
    } else {
      cp.streak = 0;
    }
    cp.recentAttempts = [...cp.recentAttempts, correct].slice(-MASTERY_WINDOW);

    let conceptUnlocked: SubConcept | null = null;
    const updatedProgress = { ...child.conceptProgress, [concept]: cp };

    // ── Mastery detection (only when currently 'active' or 'practicing') ──
    if (cp.status === 'active' || cp.status === 'practicing') {
      const streakMastered = cp.streak >= STREAK_SHORTCUT;
      const accuracyMastered =
        cp.totalAttempted >= MIN_ATTEMPTS &&
        cp.recentAttempts.length >= MASTERY_WINDOW &&
        getRecentAccuracy(cp.recentAttempts, MASTERY_WINDOW) >= MASTERY_ACCURACY;

      if (streakMastered || accuracyMastered) {
        cp.status = 'mastered';
        cp.masteredAt = new Date().toISOString();

        // Unlock the next concept in line if it's still locked
        const idx = SUB_CONCEPT_ORDER.indexOf(concept);
        if (idx >= 0 && idx < SUB_CONCEPT_ORDER.length - 1) {
          const next = SUB_CONCEPT_ORDER[idx + 1];
          if (updatedProgress[next]?.status === 'locked') {
            updatedProgress[next] = { ...updatedProgress[next], status: 'active' };
            conceptUnlocked = next;
          }
        }
      }
    }

    // ── Review degradation: demote a mastered concept if it's slipping ──
    if (cp.status === 'mastered') {
      const recent = cp.recentAttempts.slice(-REVIEW_DEGRADATION_WINDOW);
      if (
        recent.length >= REVIEW_DEGRADATION_WINDOW &&
        getRecentAccuracy(recent, REVIEW_DEGRADATION_WINDOW) < REVIEW_DEGRADATION_THRESHOLD
      ) {
        cp.status = 'active';
        cp.masteredAt = undefined;
        cp.streak = 0;
      }
    }

    // ── Soft struggle drop-back ──
    // Only triggers for the currently-progressing (active) concept, not for
    // reviews of already-mastered ones. Wider window + lower threshold +
    // preserves historical totals so the kid doesn't lose progress.
    if (
      cp.status === 'active' &&
      cp.recentAttempts.length >= STRUGGLE_WINDOW &&
      getRecentAccuracy(cp.recentAttempts, STRUGGLE_WINDOW) < STRUGGLE_ACCURACY
    ) {
      const idx = SUB_CONCEPT_ORDER.indexOf(concept);
      if (idx > 0) {
        // Reset the rolling window + streak but keep lifetime totals.
        cp.recentAttempts = [];
        cp.streak = 0;
        // Keep cp.status as 'active' (DON'T lock) so the kid can retry this
        // concept any time. Also re-open the previous concept as 'active' for
        // a quick refresher.
        const prev = SUB_CONCEPT_ORDER[idx - 1];
        const prevCp = updatedProgress[prev];
        if (prevCp && prevCp.status === 'mastered') {
          updatedProgress[prev] = {
            ...prevCp,
            status: 'active',
            masteredAt: undefined,
            recentAttempts: [],
            streak: 0,
          };
        }
      }
    }

    updatedProgress[concept] = cp;

    // ── Activity feed + daily accuracy history (unchanged) ──
    const activity: ActivityEntry = {
      timestamp: new Date().toISOString(),
      concept,
      correct,
      num1,
      num2,
      operator,
    };

    const today = new Date().toISOString().slice(0, 10);
    const existingHistoryIndex = child.accuracyHistory.findIndex(
      h => h.date === today && h.concept === concept,
    );
    const newHistory = [...child.accuracyHistory];

    if (existingHistoryIndex >= 0) {
      const prev = newHistory[existingHistoryIndex];
      const prevTotal = prev._total ?? 1;
      const prevCorrectCount = Math.round((prev.accuracy / 100) * prevTotal);
      const newTotal = prevTotal + 1;
      const newCorrectCount = prevCorrectCount + (correct ? 1 : 0);
      newHistory[existingHistoryIndex] = {
        date: today,
        accuracy: Math.round((newCorrectCount / newTotal) * 100),
        concept,
        _total: newTotal,
      };
    } else {
      newHistory.push({
        date: today,
        accuracy: correct ? 100 : 0,
        concept,
        _total: 1,
      });
    }

    const updatedChild: ChildProfile = {
      ...child,
      conceptProgress: updatedProgress,
      recentActivity: [...child.recentActivity, activity].slice(-50),
      accuracyHistory: newHistory.slice(-90),
    };

    return { updatedChild, conceptUnlocked };
  }, []);

  /** Get the current linear-progression active sub-concept. */
  const getActiveConcept = useCallback(getActiveConceptInner, []);

  /**
   * Pick the concept for the NEXT problem. Every REVIEW_INTERVAL problems we
   * interleave a mastered concept for spaced-repetition review; otherwise we
   * return the linear active concept. This keeps retention up and makes the
   * lesson feel varied instead of grindy.
   */
  const getNextProblemConcept = useCallback((
    child: ChildProfile,
    problemIndex: number,
  ): SubConcept => {
    const active = getActiveConceptInner(child);

    // Every REVIEW_INTERVAL-th problem (skipping the first), pull a random
    // mastered concept for review.
    if (problemIndex > 0 && problemIndex % REVIEW_INTERVAL === 0) {
      const mastered = SUB_CONCEPT_ORDER.filter(
        c => child.conceptProgress[c]?.status === 'mastered',
      );
      // Prefer the concept with the oldest masteredAt (longest since review)
      if (mastered.length > 0) {
        const sorted = [...mastered].sort((a, b) => {
          const ta = child.conceptProgress[a]?.masteredAt ?? '';
          const tb = child.conceptProgress[b]?.masteredAt ?? '';
          return ta.localeCompare(tb);
        });
        // Pick from the oldest 3 so there's still some variety
        const pool = sorted.slice(0, Math.min(3, sorted.length));
        return pool[Math.floor(Math.random() * pool.length)];
      }
    }

    return active;
  }, []);

  /**
   * Difficulty factor for within-concept problem ramping (0..1). Based on
   * the kid's attempt count in the rolling window: fresh concept = easier
   * problems, nearing mastery = full range.
   */
  const getConceptDifficulty = useCallback((
    child: ChildProfile,
    concept: SubConcept,
  ): number => {
    const cp = child.conceptProgress[concept];
    if (!cp) return 0.2;
    const attempts = cp.recentAttempts.length;
    return Math.min(1, attempts / MASTERY_WINDOW);
  }, []);

  return { recordAnswer, getActiveConcept, getNextProblemConcept, getConceptDifficulty };
}
