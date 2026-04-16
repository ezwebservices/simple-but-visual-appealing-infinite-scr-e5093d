# Cross-Device Sync Contract — Child Profiles & Progress

**Status:** Architect spec. Engineer: implement per the file list at the bottom.
**Goal:** One parent account sees the same child profiles and progress on every signed-in device. No regressions for the 1 existing paying user.

---

## 1. Decision: fold aggregate stats into `ChildProfile` (do NOT add a `Progress` model)

`src/hooks/useProgress.ts` today stores `{ totalCorrect, totalAttempted, currentStreak, bestStreak, lastPlayed }` in localStorage under one global key — it is **not** scoped per child (a known latent bug: Kid A's streak leaks to Kid B on the same device).

**Recommendation — fold into `ChildProfile` as one optional JSON field:**

```ts
ChildProfile: a.model({
  childId: a.string().required(),
  name: a.string().required(),
  avatar: a.string().required(),
  conceptProgress: a.json().required(),
  accuracyHistory: a.json(),
  recentActivity: a.json(),
  // NEW — all optional so existing rows keep loading untouched:
  stats: a.json(),          // ChildStats (see §2)
  updatedAt: a.datetime(),  // client-set; used for LWW merge (see §4)
})
```

**Why fold, not a separate `Progress` model:**
- The existing paying user already has a `ChildProfile` row in DynamoDB; adding optional JSON fields is a zero-migration change. A new `Progress` model would require a join on every read plus a backfill.
- `useProgress`'s aggregate stats conceptually belong to a *kid*, not a *parent account* — keeping them in one row removes a class of sync-ordering bugs.
- One row per child → one write per mutation → cheaper and simpler conflict resolution.

---

## 2. Data model diff

### New TS type (`src/types.ts`)

```ts
export interface ChildStats {
  totalCorrect: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  longestStreak: number;   // monotonic record (never decreases)
  sessionCount: number;    // +1 per new calendar-day open
  lastPlayed: string;      // ISO
}

export interface ChildProfile {
  // …existing fields…
  stats?: ChildStats;      // optional — old cloud rows won't have it
  updatedAt?: string;      // ISO — last client-side mutation time
}
```

### Schema (`amplify/data/resource.ts`)
Add two optional fields to `ChildProfile`: `stats: a.json()` and `updatedAt: a.datetime()`. **No existing field changes. No other model changes.** Owner auth stays as-is.

---

## 3. Write-through triggers — every mutation must sync

Audit of `src/hooks/useChildProfiles.ts` (commit a54bd40):

| Function | Sync today | Action |
|---|---|---|
| `addChild` (L368) | `upsertCloudProfile` fire-and-forget | ✅ keep |
| `switchChild` (L383) | **localStorage only** | Add cloud sync of `activeChildId` — see §3a |
| `updateChild` (L391) | `upsertCloudProfile` fire-and-forget | ✅ keep, but **add debounce** — see §3b |
| `removeChild` (L411) | `deleteCloudProfile` fire-and-forget | ✅ keep |
| `resetChild` (L427) | `upsertCloudProfile` fire-and-forget | ✅ keep |

`updateChild` is called from **every** correct/wrong answer via `App.tsx:70` and `App.tsx:93`. A kid answering ~1 question/second currently issues 1 DDB write/second. This is the real write-amplification gap.

### 3a. `activeChildId` sync
`activeChildId` is a per-device preference, NOT shared state. **Keep it local.** (The spec explicitly does not sync it — it is valid for Parent Device to be on Kid A while Tablet Device is on Kid B.)

### 3b. Debounce policy for `updateChild`
- **Local write:** synchronous on every call (unchanged — UI must stay snappy).
- **Cloud write:** debounced per-child, 1.5 s trailing edge, with a `flushOnUnmount` on page hide / beforeunload.
- Implementation: one `Map<childId, timeoutId>` in module scope; each `updateChild` clears the prior timer for that child and re-arms with the latest profile snapshot. On `visibilitychange === 'hidden'` or `pagehide`, flush all pending timers immediately.
- `addChild`, `removeChild`, `resetChild` stay **immediate** (no debounce) — they are rare, user-intent-driven, and must not be lost if the user closes the tab.

### 3c. `stats` write path
`useProgress.recordCorrect` / `recordWrong` currently mutate a global key. They must be refactored to operate on `activeChild.stats` and flow through `updateChild` (which triggers the debounced sync above). `useProgress` keeps its hook surface but takes `activeChild` + `updateChild` from the caller.

---

## 4. Conflict resolution — last-write-wins per profile, per-field merge for `conceptProgress`

When two devices edit the same `ChildProfile` row, AppSync's default is server-side LWW by modification time. That is fine for `name`, `avatar`, `stats.lastPlayed`, etc., but it is **wrong** for `conceptProgress`: if Device A masters `addition-small` and Device B (with a stale read) later writes a session that only updated `counting-on`, the stale write would roll back the mastery.

### Rule
On any cloud hydrate OR remote subscription event, merge against local using these rules:

1. **Profile-level (`name`, `avatar`)** — keep the record with the greater `updatedAt`.
2. **`conceptProgress[subConcept]`** — merge per sub-concept. For each sub-concept, keep the row with the greater `totalAttempted` (monotonic); if tied, keep the one with the later `masteredAt`; if still tied, keep local.
3. **`stats`** — keep the record with the greater `totalAttempted`. `longestStreak` and `bestStreak` are reduced as `Math.max(local, remote)` regardless. `currentStreak` follows `totalAttempted` winner (a stale `currentStreak` is low-stakes).
4. **`accuracyHistory`, `recentActivity`** — union by `(date, concept)` tuple / timestamp, dedupe, truncate to existing caps.

### `updatedAt` semantics
Client-set on every mutation (`new Date().toISOString()`). **Not** authoritative for merge of `conceptProgress` — that uses monotonic counters — but used for the simple profile-level fields.

### Subscription-driven live merge (optional, phase 2)
`client.models.ChildProfile.observeQuery()` is the right primitive if we later want live updates between two simultaneously-open devices. Phase 1 only needs merge on hydrate; an observeQuery pass can be added without schema change.

---

## 5. Migration-safety checklist

- [ ] `stats` and `updatedAt` added as **optional** (no `.required()`). Existing rows with these fields absent must round-trip through `cloudRowToProfile` without throwing.
- [ ] `cloudRowToProfile` supplies defaults: `row.stats ?? defaultStats()`, `row.updatedAt ?? row.createdAt`.
- [ ] `upsertCloudProfile` writes `stats` and `updatedAt` on every call; never sends `undefined` (send `null` or omit the key — match current `accuracyHistory` handling).
- [ ] localStorage `SCHEMA_VERSION` stays at **2**. Do not bump — we are additive. Loader gracefully treats missing `stats` as `defaultStats()`.
- [ ] Legacy `numpals-progress` localStorage key is migrated once on first load: if present and `activeChild.stats` is absent, copy into `activeChild.stats` then delete the old key. Skip silently if there's no active child yet.
- [ ] Amplify sandbox deploy on a throwaway branch before touching `main` — schema changes regenerate the GraphQL client and the paying user's existing row must still `list()` without errors.
- [ ] Manual verification on two browsers signed into the same account: edit on A → refresh B → see the edit.

---

## 6. Files the Engineer will touch

1. **`amplify/data/resource.ts`** — add `stats: a.json()` and `updatedAt: a.datetime()` to `ChildProfile` (optional).
2. **`src/types.ts`** — add `ChildStats` interface; extend `ChildProfile` with `stats?`, `updatedAt?`.
3. **`src/hooks/useChildProfiles.ts`** —
   - `cloudRowToProfile`: read new fields with defaults.
   - `upsertCloudProfile`: write new fields; stamp `updatedAt = new Date().toISOString()` on the outgoing row.
   - Add module-scope debounce map for `updateChild`'s cloud write; add `pagehide` / `visibilitychange` flush.
   - Hydration merge: replace the "cloud wins on id conflict" block with the per-field merge from §4.
4. **`src/hooks/useProgress.ts`** — refactor to operate on `activeChild.stats` via `updateChild`; keep the hook's return shape (`{ progress, recordCorrect, recordWrong }`) so `App.tsx` is unchanged. Add one-time localStorage `numpals-progress` → `stats` migration.
5. **`src/App.tsx`** — thread `activeChild` + `updateChild` into `useProgress(activeChild, updateChild)`. No logic changes beyond the hook signature.

**Out of scope (do not touch):** `UserSettings`, `UserSubscription`, auth flow, webhook Lambdas, curriculum content.

---

## 7. Acceptance criteria

- New device login for the paying user loads their existing child profile(s) with all prior `conceptProgress` intact.
- Answer a question on Device A → within ≤2 s a pull on Device B reflects the new `totalCorrect` and `conceptProgress`.
- Closing the tab mid-debounce does not lose the most recent answer (pagehide flush).
- Simultaneous edits on two devices to different sub-concepts both survive (per-field merge proves out).
- Nothing in the current UI regresses — `useProgress`'s public hook shape is unchanged.
