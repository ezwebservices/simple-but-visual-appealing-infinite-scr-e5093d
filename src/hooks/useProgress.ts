import { useState, useCallback } from 'react';
import type { ProgressData } from '../types';

const STORAGE_KEY = 'mathscroll-progress';
const SCHEMA_VERSION = 1;

interface StoredProgress {
  version: number;
  data: ProgressData;
}

function defaultProgress(): ProgressData {
  return {
    totalCorrect: 0,
    totalAttempted: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastPlayed: new Date().toISOString(),
  };
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed: StoredProgress = JSON.parse(raw);
    if (parsed.version !== SCHEMA_VERSION) return defaultProgress();
    return parsed.data;
  } catch {
    return defaultProgress();
  }
}

function saveProgress(data: ProgressData): void {
  try {
    const stored: StoredProgress = { version: SCHEMA_VERSION, data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage full or unavailable
  }
}

export default function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  const recordCorrect = useCallback(() => {
    setProgress((prev) => {
      const next: ProgressData = {
        totalCorrect: prev.totalCorrect + 1,
        totalAttempted: prev.totalAttempted + 1,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
        lastPlayed: new Date().toISOString(),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const recordWrong = useCallback(() => {
    setProgress((prev) => {
      const next: ProgressData = {
        ...prev,
        totalAttempted: prev.totalAttempted + 1,
        currentStreak: 0,
        lastPlayed: new Date().toISOString(),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  return { progress, recordCorrect, recordWrong };
}
