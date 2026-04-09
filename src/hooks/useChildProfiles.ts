import { useState, useCallback } from 'react';
import type { ChildProfile, SubConcept, SubConceptProgress, CharacterName } from '../types';
import { SUB_CONCEPT_ORDER } from '../types';

const STORAGE_KEY = 'numpals-children';
const SCHEMA_VERSION = 2;

interface StoredChildren {
  version: number;
  activeChildId: string | null;
  children: ChildProfile[];
}

function defaultSubConceptProgress(subConcept: SubConcept, status: 'active' | 'locked'): SubConceptProgress {
  return {
    subConcept,
    totalCorrect: 0,
    totalAttempted: 0,
    status,
    recentAttempts: [],
    streak: 0,
  };
}

function createDefaultProgress(): Record<SubConcept, SubConceptProgress> {
  const progress = {} as Record<SubConcept, SubConceptProgress>;
  for (let i = 0; i < SUB_CONCEPT_ORDER.length; i++) {
    progress[SUB_CONCEPT_ORDER[i]] = defaultSubConceptProgress(
      SUB_CONCEPT_ORDER[i],
      i === 0 ? 'active' : 'locked',
    );
  }
  return progress;
}

function createChild(name: string, avatar: CharacterName): ChildProfile {
  return {
    id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    avatar,
    createdAt: new Date().toISOString(),
    conceptProgress: createDefaultProgress(),
    accuracyHistory: [],
    recentActivity: [],
  };
}

/** Migrate v1 (3-concept) profiles to v2 (17 sub-concept) */
function migrateV1Profile(oldChild: Record<string, unknown>): ChildProfile {
  const progress = createDefaultProgress();
  const old = (oldChild.conceptProgress ?? {}) as Record<string, { status?: string; masteredAt?: string }>;

  const countingSubConcepts: SubConcept[] = [
    'rote-counting-5', 'rote-counting-10',
    'number-recognition-5', 'number-recognition-10',
    'one-to-one-5', 'one-to-one-10',
    'cardinality-5', 'cardinality-10',
  ];

  if (old.counting?.status === 'mastered') {
    const ts = old.counting.masteredAt ?? new Date().toISOString();
    for (const sc of countingSubConcepts) {
      progress[sc] = { ...progress[sc], status: 'mastered', masteredAt: ts };
    }
    progress['comparing-easy'] = { ...progress['comparing-easy'], status: 'active' };
  } else if (old.counting?.status === 'active' || old.counting?.status === 'practicing') {
    progress['rote-counting-5'] = { ...progress['rote-counting-5'], status: 'active' };
  }

  if (old.addition?.status === 'mastered') {
    const ts = old.addition.masteredAt ?? new Date().toISOString();
    for (const sc of SUB_CONCEPT_ORDER) {
      if (sc === 'subtraction-small') break;
      progress[sc] = { ...progress[sc], status: 'mastered', masteredAt: ts };
    }
    progress['subtraction-small'] = { ...progress['subtraction-small'], status: 'active' };
  } else if (old.addition?.status === 'active' || old.addition?.status === 'practicing') {
    const priorConcepts: SubConcept[] = [
      ...countingSubConcepts,
      'comparing-easy', 'comparing-close',
      'number-order-5', 'number-order-10',
      'counting-on',
    ];
    for (const sc of priorConcepts) {
      progress[sc] = { ...progress[sc], status: 'mastered' };
    }
    progress['addition-small'] = { ...progress['addition-small'], status: 'active' };
  }

  if (old.subtraction?.status === 'mastered') {
    const ts = old.subtraction.masteredAt ?? new Date().toISOString();
    for (const sc of SUB_CONCEPT_ORDER) {
      progress[sc] = { ...progress[sc], status: 'mastered', masteredAt: ts };
    }
  } else if (old.subtraction?.status === 'active' || old.subtraction?.status === 'practicing') {
    for (const sc of SUB_CONCEPT_ORDER) {
      if (sc === 'subtraction-small') break;
      progress[sc] = { ...progress[sc], status: 'mastered' };
    }
    progress['subtraction-small'] = { ...progress['subtraction-small'], status: 'active' };
  }

  return {
    id: oldChild.id as string,
    name: oldChild.name as string,
    avatar: oldChild.avatar as CharacterName,
    createdAt: oldChild.createdAt as string,
    conceptProgress: progress,
    accuracyHistory: [],
    recentActivity: [],
  };
}

function loadStored(): StoredChildren {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: SCHEMA_VERSION, activeChildId: null, children: [] };
    const parsed = JSON.parse(raw);

    // Migrate from v1
    if (parsed.version === 1 || !parsed.version) {
      const migrated: StoredChildren = {
        version: SCHEMA_VERSION,
        activeChildId: parsed.activeChildId,
        children: (parsed.children || []).map(migrateV1Profile),
      };
      saveStored(migrated);
      return migrated;
    }

    if (parsed.version !== SCHEMA_VERSION) return { version: SCHEMA_VERSION, activeChildId: null, children: [] };
    return parsed;
  } catch {
    return { version: SCHEMA_VERSION, activeChildId: null, children: [] };
  }
}

function saveStored(data: StoredChildren): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export default function useChildProfiles() {
  const [stored, setStored] = useState<StoredChildren>(loadStored);

  const addChild = useCallback((name: string, avatar: CharacterName) => {
    setStored(prev => {
      const child = createChild(name, avatar);
      const next: StoredChildren = {
        ...prev,
        children: [...prev.children, child],
        activeChildId: prev.activeChildId ?? child.id,
      };
      saveStored(next);
      return next;
    });
  }, []);

  const switchChild = useCallback((childId: string) => {
    setStored(prev => {
      const next = { ...prev, activeChildId: childId };
      saveStored(next);
      return next;
    });
  }, []);

  const updateChild = useCallback((childId: string, updater: (child: ChildProfile) => ChildProfile) => {
    setStored(prev => {
      const next: StoredChildren = {
        ...prev,
        children: prev.children.map(c => c.id === childId ? updater(c) : c),
      };
      saveStored(next);
      return next;
    });
  }, []);

  const removeChild = useCallback((childId: string) => {
    setStored(prev => {
      const remaining = prev.children.filter(c => c.id !== childId);
      const next: StoredChildren = {
        ...prev,
        children: remaining,
        activeChildId: prev.activeChildId === childId
          ? (remaining[0]?.id ?? null)
          : prev.activeChildId,
      };
      saveStored(next);
      return next;
    });
  }, []);

  const resetChild = useCallback((childId: string) => {
    setStored(prev => {
      const next: StoredChildren = {
        ...prev,
        children: prev.children.map(c =>
          c.id === childId
            ? { ...c, conceptProgress: createDefaultProgress(), accuracyHistory: [], recentActivity: [] }
            : c,
        ),
      };
      saveStored(next);
      return next;
    });
  }, []);

  const activeChild = stored.children.find(c => c.id === stored.activeChildId) ?? null;

  return {
    children: stored.children,
    activeChild,
    activeChildId: stored.activeChildId,
    addChild,
    switchChild,
    updateChild,
    removeChild,
    resetChild,
  };
}
