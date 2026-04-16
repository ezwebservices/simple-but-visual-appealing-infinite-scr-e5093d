import { useCallback, useEffect, useRef } from 'react';
import type { ChildProfile, ChildStats, ProgressData } from '../types';
import { defaultStats } from './useChildProfiles';

// Legacy localStorage key — global, not per-child. We migrate it once into
// the active child's `stats` so the kid doesn't lose their streak history.
const LEGACY_KEY = 'numpals-progress';

interface LegacyStored {
  version: number;
  data: ProgressData;
}

function readLegacyProgress(): ProgressData | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed: LegacyStored = JSON.parse(raw);
    if (parsed.version !== 1 || !parsed.data) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function statsToProgress(stats: ChildStats): ProgressData {
  return {
    totalCorrect: stats.totalCorrect,
    totalAttempted: stats.totalAttempted,
    currentStreak: stats.currentStreak,
    bestStreak: stats.bestStreak,
    lastPlayed: stats.lastPlayed,
  };
}

/**
 * Aggregate progress hook. Stats are stored per-child on `ChildProfile.stats`
 * and synced to the cloud via the same debounced write-through pipeline as the
 * rest of the profile (see useChildProfiles.ts). The hook surface
 * (`{ progress, recordCorrect, recordWrong }`) is unchanged from the
 * pre-cloud version so App.tsx call-sites stay untouched in shape.
 */
export default function useProgress(
  activeChild: ChildProfile | null,
  updateChild: (childId: string, updater: (child: ChildProfile) => ChildProfile) => void,
) {
  // One-time migration: if the global `numpals-progress` key exists and the
  // active child has no `stats` yet, copy it across then delete the legacy
  // key. Skip silently when there's no active child — we'll retry on the
  // next render once one exists.
  const migratedRef = useRef(false);
  useEffect(() => {
    if (migratedRef.current) return;
    if (!activeChild) return;
    const legacy = readLegacyProgress();
    if (!legacy) {
      migratedRef.current = true;
      return;
    }
    if (!activeChild.stats || activeChild.stats.totalAttempted === 0) {
      updateChild(activeChild.id, (c) => ({
        ...c,
        stats: {
          ...defaultStats(),
          totalCorrect: legacy.totalCorrect,
          totalAttempted: legacy.totalAttempted,
          currentStreak: legacy.currentStreak,
          bestStreak: legacy.bestStreak,
          longestStreak: legacy.bestStreak,
          lastPlayed: legacy.lastPlayed,
        },
      }));
    }
    try { localStorage.removeItem(LEGACY_KEY); } catch { /* ignore */ }
    migratedRef.current = true;
  }, [activeChild, updateChild]);

  const stats = activeChild?.stats ?? defaultStats();
  const progress: ProgressData = statsToProgress(stats);

  const recordCorrect = useCallback(() => {
    if (!activeChild) return;
    updateChild(activeChild.id, (c) => {
      const cur = c.stats ?? defaultStats();
      const nextStreak = cur.currentStreak + 1;
      const nextStats: ChildStats = {
        ...cur,
        totalCorrect: cur.totalCorrect + 1,
        totalAttempted: cur.totalAttempted + 1,
        currentStreak: nextStreak,
        bestStreak: Math.max(cur.bestStreak, nextStreak),
        longestStreak: Math.max(cur.longestStreak, nextStreak),
        lastPlayed: new Date().toISOString(),
      };
      return { ...c, stats: nextStats };
    });
  }, [activeChild, updateChild]);

  const recordWrong = useCallback(() => {
    if (!activeChild) return;
    updateChild(activeChild.id, (c) => {
      const cur = c.stats ?? defaultStats();
      const nextStats: ChildStats = {
        ...cur,
        totalAttempted: cur.totalAttempted + 1,
        currentStreak: 0,
        lastPlayed: new Date().toISOString(),
      };
      return { ...c, stats: nextStats };
    });
  }, [activeChild, updateChild]);

  return { progress, recordCorrect, recordWrong };
}
