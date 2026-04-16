import { useState, useCallback, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import type { ChildProfile, ChildStats, SubConcept, SubConceptProgress, CharacterName, ActivityEntry } from '../types';
import { SUB_CONCEPT_ORDER } from '../types';

const STORAGE_KEY = 'numpals-children';
const SCHEMA_VERSION = 2;

// Lazy-init the data client so it doesn't crash if Amplify isn't configured yet
let _client: ReturnType<typeof generateClient<Schema>> | null = null;
function getClient() {
  if (!_client) {
    try {
      _client = generateClient<Schema>();
    } catch {
      return null;
    }
  }
  return _client;
}

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

/**
 * Map any legacy sub-concept keys (e.g. `number-recognition-5`) onto the
 * current schema. Old saved profiles must continue to load — we copy the old
 * row's progress into the new key so the kid doesn't lose mastery state.
 */
const LEGACY_KEY_MAP: Record<string, SubConcept> = {
  'number-recognition-5': 'subitizing-5',
  'number-recognition-10': 'subitizing-10',
};

function reconcileProgress(raw: unknown): Record<SubConcept, SubConceptProgress> {
  const fresh = createDefaultProgress();
  if (!raw || typeof raw !== 'object') return fresh;
  const src = raw as Record<string, SubConceptProgress>;
  for (const [key, value] of Object.entries(src)) {
    const target = (LEGACY_KEY_MAP[key] ?? key) as SubConcept;
    if (target in fresh && value && typeof value === 'object') {
      fresh[target] = { ...value, subConcept: target };
    }
  }

  // Auto-activate the next concept after any mastered chain. Needed when new
  // sub-concepts are inserted mid-order — existing kids who had mastered
  // everything past the insertion point would otherwise find the new
  // concepts stuck as 'locked'.
  let foundActive = false;
  for (let i = 0; i < SUB_CONCEPT_ORDER.length; i++) {
    const key = SUB_CONCEPT_ORDER[i];
    const cur = fresh[key];
    if (cur.status === 'active' || cur.status === 'practicing') {
      foundActive = true;
      break;
    }
    if (cur.status === 'locked') {
      // The previous concept (if any) determines whether to auto-activate.
      const prev = i > 0 ? fresh[SUB_CONCEPT_ORDER[i - 1]] : null;
      if (!prev || prev.status === 'mastered') {
        fresh[key] = { ...cur, status: 'active' };
        foundActive = true;
      }
      break;
    }
  }
  // If everything is mastered and nothing is active, leave it — the app
  // treats all-mastered as "keep practicing the last one".
  void foundActive;

  return fresh;
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
    'subitizing-5', 'subitizing-10',
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
    // Reconcile legacy sub-concept keys (e.g. number-recognition → subitizing)
    parsed.children = (parsed.children ?? []).map((c: ChildProfile) => ({
      ...c,
      conceptProgress: reconcileProgress(c.conceptProgress),
    }));
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

// ─────────────────────────────────────────────────────────────────
// Cloud sync helpers — read/write profiles to the GraphQL ChildProfile model.
// localStorage stays as a write-through cache so the app works offline and
// loads instantly while the cloud fetch resolves in the background.
// ─────────────────────────────────────────────────────────────────

interface CloudChildRow {
  id: string;
  childId: string;
  name: string;
  avatar: string;
  createdAt: string;
  conceptProgress: unknown;
  accuracyHistory: unknown;
  recentActivity: unknown;
  stats?: unknown;
  // The schema's auto-generated `updatedAt` is server-set; our client-set
  // mutation timestamp lives on the same column name (we overwrite it in
  // `upsertCloudProfile`). Either way it round-trips as an ISO string.
  updatedAt?: string | null;
}

export function defaultStats(): ChildStats {
  return {
    totalCorrect: 0,
    totalAttempted: 0,
    currentStreak: 0,
    bestStreak: 0,
    longestStreak: 0,
    sessionCount: 0,
    lastPlayed: new Date().toISOString(),
  };
}

function reconcileStats(raw: unknown): ChildStats {
  if (!raw || typeof raw !== 'object') return defaultStats();
  const r = raw as Partial<ChildStats>;
  return {
    totalCorrect: r.totalCorrect ?? 0,
    totalAttempted: r.totalAttempted ?? 0,
    currentStreak: r.currentStreak ?? 0,
    bestStreak: r.bestStreak ?? 0,
    longestStreak: r.longestStreak ?? r.bestStreak ?? 0,
    sessionCount: r.sessionCount ?? 0,
    lastPlayed: r.lastPlayed ?? new Date().toISOString(),
  };
}

function cloudRowToProfile(row: CloudChildRow): ChildProfile {
  return {
    id: row.childId,
    name: row.name,
    avatar: row.avatar as CharacterName,
    createdAt: row.createdAt,
    conceptProgress: reconcileProgress(row.conceptProgress),
    accuracyHistory: (row.accuracyHistory as ChildProfile['accuracyHistory']) ?? [],
    recentActivity: (row.recentActivity as ChildProfile['recentActivity']) ?? [],
    stats: reconcileStats(row.stats),
    updatedAt: row.updatedAt ?? row.createdAt,
  };
}

// ─────────────────────────────────────────────────────────────────
// Per-field merge for cloud↔local conflict resolution.
// See .orchestrator/_sync_contract.md §4.
// ─────────────────────────────────────────────────────────────────

function mergeConceptProgress(
  local: Record<SubConcept, SubConceptProgress>,
  cloud: Record<SubConcept, SubConceptProgress>,
): Record<SubConcept, SubConceptProgress> {
  const out = {} as Record<SubConcept, SubConceptProgress>;
  const keys = new Set<SubConcept>([
    ...(Object.keys(local) as SubConcept[]),
    ...(Object.keys(cloud) as SubConcept[]),
  ]);
  for (const k of keys) {
    const l = local[k];
    const c = cloud[k];
    if (!l) { out[k] = c; continue; }
    if (!c) { out[k] = l; continue; }
    // Monotonic: keep whichever has more attempts. Tie → later masteredAt.
    if (c.totalAttempted > l.totalAttempted) out[k] = c;
    else if (l.totalAttempted > c.totalAttempted) out[k] = l;
    else if ((c.masteredAt ?? '') > (l.masteredAt ?? '')) out[k] = c;
    else out[k] = l;
  }
  return out;
}

function mergeStats(local: ChildStats | undefined, cloud: ChildStats | undefined): ChildStats {
  if (!local) return cloud ?? defaultStats();
  if (!cloud) return local;
  const winner = cloud.totalAttempted > local.totalAttempted ? cloud : local;
  return {
    ...winner,
    bestStreak: Math.max(local.bestStreak, cloud.bestStreak),
    longestStreak: Math.max(local.longestStreak, cloud.longestStreak),
    sessionCount: Math.max(local.sessionCount, cloud.sessionCount),
  };
}

function mergeActivity(local: ActivityEntry[], cloud: ActivityEntry[]): ActivityEntry[] {
  const seen = new Set<string>();
  const out: ActivityEntry[] = [];
  for (const e of [...cloud, ...local]) {
    const key = `${e.timestamp}|${e.concept}|${e.num1}|${e.num2}|${e.operator}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  // Preserve newest-first; the existing cap is 50 entries.
  out.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return out.slice(0, 50);
}

function mergeAccuracyHistory(
  local: ChildProfile['accuracyHistory'],
  cloud: ChildProfile['accuracyHistory'],
): ChildProfile['accuracyHistory'] {
  const seen = new Set<string>();
  const out: ChildProfile['accuracyHistory'] = [];
  for (const e of [...cloud, ...local]) {
    const key = `${e.date}|${e.concept}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  // Keep stable date order (oldest → newest); cap at the same 90-day-ish window
  // the dashboard renders. We don't know the exact cap here, so keep all unique
  // entries and let the consumer truncate.
  out.sort((a, b) => (a.date < b.date ? -1 : 1));
  return out;
}

function mergeProfiles(local: ChildProfile, cloud: ChildProfile): ChildProfile {
  const localTs = local.updatedAt ?? local.createdAt;
  const cloudTs = cloud.updatedAt ?? cloud.createdAt;
  const profileWinner = cloudTs > localTs ? cloud : local;
  return {
    ...profileWinner,
    conceptProgress: mergeConceptProgress(local.conceptProgress, cloud.conceptProgress),
    accuracyHistory: mergeAccuracyHistory(local.accuracyHistory, cloud.accuracyHistory),
    recentActivity: mergeActivity(local.recentActivity, cloud.recentActivity),
    stats: mergeStats(local.stats, cloud.stats),
    updatedAt: cloudTs > localTs ? cloudTs : localTs,
  };
}

async function fetchCloudProfiles(): Promise<ChildProfile[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const result = await client.models.ChildProfile.list();
    if (result.errors && result.errors.length > 0) {
      console.warn('[useChildProfiles] cloud fetch errors:', result.errors);
      return null;
    }
    return (result.data ?? []).map((r) => cloudRowToProfile(r as unknown as CloudChildRow));
  } catch (e) {
    console.warn('[useChildProfiles] cloud fetch failed:', e);
    return null;
  }
}

async function upsertCloudProfile(profile: ChildProfile): Promise<void> {
  const client = getClient();
  if (!client) return;
  try {
    // Check if a row with this childId already exists
    const existing = await client.models.ChildProfile.list({
      filter: { childId: { eq: profile.id } },
    });
    const row = {
      childId: profile.id,
      name: profile.name,
      avatar: profile.avatar,
      createdAt: profile.createdAt,
      conceptProgress: profile.conceptProgress as unknown as object,
      accuracyHistory: profile.accuracyHistory as unknown as object,
      recentActivity: profile.recentActivity as unknown as object,
      stats: (profile.stats ?? defaultStats()) as unknown as object,
      updatedAt: profile.updatedAt ?? new Date().toISOString(),
    };
    if (existing.data && existing.data.length > 0) {
      const existingRow = existing.data[0] as unknown as { id: string };
      await client.models.ChildProfile.update({ id: existingRow.id, ...row });
    } else {
      await client.models.ChildProfile.create(row);
    }
  } catch (e) {
    console.warn('[useChildProfiles] cloud upsert failed:', e);
  }
}

// ─────────────────────────────────────────────────────────────────
// Debounced cloud write-through for high-frequency mutations
// (every correct/wrong answer fires `updateChild`).
//   • Per-child trailing-edge debounce, 1.5 s.
//   • `pagehide` / `visibilitychange:hidden` flushes pending writes so
//     closing the tab mid-debounce doesn't lose the last answer.
//   • Module-scope so the timers survive component re-renders.
// ─────────────────────────────────────────────────────────────────
const DEBOUNCE_MS = 1500;
const pendingWrites = new Map<string, { timeout: ReturnType<typeof setTimeout>; profile: ChildProfile }>();

function flushPendingWrites(): void {
  for (const [, entry] of pendingWrites) {
    clearTimeout(entry.timeout);
    upsertCloudProfile(entry.profile);
  }
  pendingWrites.clear();
}

function debouncedUpsert(profile: ChildProfile): void {
  const prev = pendingWrites.get(profile.id);
  if (prev) clearTimeout(prev.timeout);
  const timeout = setTimeout(() => {
    pendingWrites.delete(profile.id);
    upsertCloudProfile(profile);
  }, DEBOUNCE_MS);
  // Store the latest snapshot; the next call replaces it.
  pendingWrites.set(profile.id, { timeout, profile });
}

if (typeof window !== 'undefined') {
  // Both events because Safari iOS only fires pagehide reliably; desktop
  // browsers fire visibilitychange when the tab is backgrounded.
  window.addEventListener('pagehide', flushPendingWrites);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPendingWrites();
  });
}

async function deleteCloudProfile(childId: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  try {
    const existing = await client.models.ChildProfile.list({
      filter: { childId: { eq: childId } },
    });
    if (existing.data && existing.data.length > 0) {
      const row = existing.data[0] as unknown as { id: string };
      await client.models.ChildProfile.delete({ id: row.id });
    }
  } catch (e) {
    console.warn('[useChildProfiles] cloud delete failed:', e);
  }
}

export default function useChildProfiles() {
  const [stored, setStored] = useState<StoredChildren>(loadStored);
  // `cloudLoading` is TRUE until the initial cloud fetch completes. While
  // true, the app should show a loading screen and NOT create default
  // profiles — that was the race condition: "Player 1" was created before
  // the cloud data arrived, permanently hiding the user's real profiles.
  const [cloudLoading, setCloudLoading] = useState(true);
  const cloudSyncStarted = useRef(false);

  // ── Initial cloud hydration ──
  // On mount, fetch profiles from the cloud BEFORE the app can create
  // defaults. The `cloudLoading` flag blocks GameView's "auto-create
  // Player 1" logic until this resolves.
  useEffect(() => {
    if (cloudSyncStarted.current) return;
    cloudSyncStarted.current = true;

    (async () => {
      try {
        const cloudProfiles = await fetchCloudProfiles();
        if (cloudProfiles === null) {
          // Cloud unavailable — fall through to localStorage (already loaded)
          return;
        }

        if (cloudProfiles.length > 0) {
          // Cloud has data → per-field merge against local (see _sync_contract.md §4):
          //   - Profile-level fields use updatedAt LWW.
          //   - conceptProgress merges by monotonic totalAttempted so a stale
          //     write from one device cannot roll back mastery on another.
          //   - stats / accuracyHistory / recentActivity merge per §4.
          // Local-only profiles (created offline before login) are preserved
          // and pushed up. Profiles that merge to a different shape than the
          // cloud row are written back so the cloud catches up.
          setStored((prev) => {
            const localMap = new Map(prev.children.map(c => [c.id, c]));
            const merged: ChildProfile[] = [];
            const seen = new Set<string>();

            for (const cloud of cloudProfiles) {
              const local = localMap.get(cloud.id);
              if (local) {
                const result = mergeProfiles(local, cloud);
                merged.push(result);
                // If the merge produced a stricter superset than the cloud row
                // (more attempts on some sub-concept, more recent activity),
                // push the merged row back up so other devices see it.
                debouncedUpsert(result);
              } else {
                merged.push(cloud);
              }
              seen.add(cloud.id);
            }
            const localOnly = prev.children.filter(c => !seen.has(c.id));
            for (const profile of localOnly) {
              merged.push(profile);
              upsertCloudProfile(profile);
            }

            const next: StoredChildren = {
              version: SCHEMA_VERSION,
              activeChildId: merged.find(c => c.id === prev.activeChildId)?.id
                ?? merged[0]?.id
                ?? null,
              children: merged,
            };
            saveStored(next);
            return next;
          });
        } else if (stored.children.length > 0) {
          // Cloud is empty but local has data → push local up to the cloud
          for (const profile of stored.children) {
            await upsertCloudProfile(profile);
          }
        }
      } catch (e) {
        console.warn('[useChildProfiles] cloud hydration failed:', e);
      } finally {
        setCloudLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addChild = useCallback((name: string, avatar: CharacterName) => {
    setStored(prev => {
      const child: ChildProfile = {
        ...createChild(name, avatar),
        stats: defaultStats(),
        updatedAt: new Date().toISOString(),
      };
      const next: StoredChildren = {
        ...prev,
        children: [...prev.children, child],
        activeChildId: prev.activeChildId ?? child.id,
      };
      saveStored(next);
      // Immediate (not debounced) — addChild is rare and user-intent-driven;
      // it must not be lost if the user closes the tab right away.
      upsertCloudProfile(child);
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
      let updated: ChildProfile | null = null;
      const next: StoredChildren = {
        ...prev,
        children: prev.children.map(c => {
          if (c.id === childId) {
            // Stamp updatedAt on every mutation so the per-field merge has a
            // tiebreaker for profile-level fields (name, avatar, etc.).
            updated = { ...updater(c), updatedAt: new Date().toISOString() };
            return updated;
          }
          return c;
        }),
      };
      saveStored(next);
      // Debounced — every correct/wrong answer flows through here, so a kid
      // answering ~1/sec used to issue 1 DDB write/sec. Trailing-edge 1.5 s
      // collapses bursts; pagehide flush guarantees the last answer lands.
      if (updated) debouncedUpsert(updated);
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
      deleteCloudProfile(childId);
      return next;
    });
  }, []);

  const resetChild = useCallback((childId: string) => {
    setStored(prev => {
      let updated: ChildProfile | null = null;
      const next: StoredChildren = {
        ...prev,
        children: prev.children.map(c => {
          if (c.id === childId) {
            updated = {
              ...c,
              conceptProgress: createDefaultProgress(),
              accuracyHistory: [],
              recentActivity: [],
              stats: defaultStats(),
              updatedAt: new Date().toISOString(),
            };
            return updated;
          }
          return c;
        }),
      };
      saveStored(next);
      // Cancel any pending debounced write so the reset isn't immediately
      // overwritten by stale stats from before the reset.
      if (updated) {
        const pending = pendingWrites.get(childId);
        if (pending) {
          clearTimeout(pending.timeout);
          pendingWrites.delete(childId);
        }
        upsertCloudProfile(updated);
      }
      return next;
    });
  }, []);

  const activeChild = stored.children.find(c => c.id === stored.activeChildId) ?? null;

  return {
    children: stored.children,
    activeChild,
    activeChildId: stored.activeChildId,
    /** True while the initial cloud fetch is in progress. The UI should show
     *  a loading screen and NOT create default profiles until this is false. */
    cloudLoading,
    addChild,
    switchChild,
    updateChild,
    removeChild,
    resetChild,
  };
}
