import { useCallback } from 'react';
import type { ChildProfile, SubConcept, ActivityEntry, Operator } from '../types';
import { SUB_CONCEPT_ORDER } from '../types';

/**
 * Adaptive mastery algorithm based on the early-ed curriculum spec.
 *
 * Mastery: >= 80% in last 10 attempts (with min 8 total) OR 5-correct streak.
 * Struggle: < 50% in last 6 attempts → drop back to previous sub-concept.
 * Progression: linear through SUB_CONCEPT_ORDER.
 */

const MIN_ATTEMPTS = 8;
const MASTERY_WINDOW = 10;
const MASTERY_ACCURACY = 0.80;
const STREAK_SHORTCUT = 5;
const STRUGGLE_WINDOW = 6;
const STRUGGLE_ACCURACY = 0.50;

function getRecentAccuracy(attempts: boolean[], window: number): number {
  const recent = attempts.slice(-window);
  if (recent.length === 0) return 0;
  return recent.filter(Boolean).length / recent.length;
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
    const cp = { ...child.conceptProgress[concept] };
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

    // --- Mastery detection ---
    if (cp.status === 'active') {
      const streakMastered = cp.streak >= STREAK_SHORTCUT;
      const accuracyMastered =
        cp.totalAttempted >= MIN_ATTEMPTS &&
        cp.recentAttempts.length >= MASTERY_WINDOW &&
        getRecentAccuracy(cp.recentAttempts, MASTERY_WINDOW) >= MASTERY_ACCURACY;

      if (streakMastered || accuracyMastered) {
        cp.status = 'mastered';
        cp.masteredAt = new Date().toISOString();

        // Unlock next sub-concept
        const idx = SUB_CONCEPT_ORDER.indexOf(concept);
        if (idx < SUB_CONCEPT_ORDER.length - 1) {
          const next = SUB_CONCEPT_ORDER[idx + 1];
          if (updatedProgress[next].status === 'locked') {
            updatedProgress[next] = { ...updatedProgress[next], status: 'active' };
            conceptUnlocked = next;
          }
        }
      }
    }

    // --- Struggle detection & drop-back ---
    if (
      cp.status === 'active' &&
      cp.totalAttempted >= STRUGGLE_WINDOW &&
      cp.recentAttempts.length >= STRUGGLE_WINDOW
    ) {
      const recentAcc = getRecentAccuracy(cp.recentAttempts, STRUGGLE_WINDOW);
      if (recentAcc < STRUGGLE_ACCURACY) {
        const idx = SUB_CONCEPT_ORDER.indexOf(concept);
        if (idx > 0) {
          // Drop back: current → locked, previous → active (re-master required)
          cp.status = 'locked';
          cp.recentAttempts = [];
          cp.streak = 0;
          cp.totalAttempted = 0;
          cp.totalCorrect = 0;
          const prev = SUB_CONCEPT_ORDER[idx - 1];
          updatedProgress[prev] = {
            ...updatedProgress[prev],
            status: 'active',
            recentAttempts: [],
            streak: 0,
            totalAttempted: 0,
            totalCorrect: 0,
            masteredAt: undefined,
          };
        }
        // If already at first sub-concept, continue (don't drop back)
      }
    }

    updatedProgress[concept] = cp;

    // Activity entry
    const activity: ActivityEntry = {
      timestamp: new Date().toISOString(),
      concept,
      correct,
      num1,
      num2,
      operator,
    };

    // Daily accuracy snapshot
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

  /** Get the current active sub-concept for a child */
  const getActiveConcept = useCallback((child: ChildProfile): SubConcept => {
    for (const concept of SUB_CONCEPT_ORDER) {
      const cp = child.conceptProgress[concept];
      if (cp.status === 'active') {
        return concept;
      }
    }
    // All mastered — keep practicing the last one
    return SUB_CONCEPT_ORDER[SUB_CONCEPT_ORDER.length - 1];
  }, []);

  return { recordAnswer, getActiveConcept };
}
