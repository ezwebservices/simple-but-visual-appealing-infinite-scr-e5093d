# Early Childhood Number Mastery Curriculum & Adaptive Algorithm Spec

## Overview

This spec replaces the current 3-concept system (counting, addition, subtraction) with a fine-grained learning progression designed for Pre-K children (age 4) who are **just beginning** to learn numbers. The algorithm is fully automatic — no manual progression, no visible progress indicators. The child simply plays, and the system adapts.

---

## Part 1: Learning Progression (Sub-Concepts)

Children must master these sub-concepts **in order**. Each builds on the previous one. The progression is grounded in how 4-year-olds actually develop number sense.

### Level 1: `rote-counting`
**What it is:** Saying numbers in order (verbal sequence). The child learns the number *words* in sequence — this is memorization, not understanding.

**What mastery looks like:** Child can reliably identify "what comes next" in the counting sequence 1-5, then 1-10.

**Problem types:**
- "What number comes after 3?" → show 3 choices (4, 2, 6)
- "What number comes next? 1, 2, 3, ___" → show 3 choices
- Start with range 1-5. After mastery of 1-5, extend to 1-10.

**Visual support:** Number shown large on screen, with dots/objects matching the count sequence so far (e.g., "1, 2, 3, ..." with objects appearing one by one). Character counts aloud.

**Sub-stages:**
- `rote-counting-5` (numbers 1-5)
- `rote-counting-10` (numbers 1-10)

---

### Level 2: `number-recognition`
**What it is:** Seeing the numeral "5" and knowing it is called "five." Connecting the written symbol to the spoken word.

**What mastery looks like:** Child can match a spoken/written number name to the correct numeral, and vice versa.

**Problem types:**
- Show a large numeral (e.g., "7") and ask "Which number is this?" → 3 choices (7, 4, 9)
- Show the word "five" spoken by character and ask child to tap the correct numeral from 3 choices
- Range 1-5 first, then 1-10

**Visual support:** Large, clear numerals. Character says the number name aloud. Bright, friendly styling.

**Sub-stages:**
- `number-recognition-5` (numerals 1-5)
- `number-recognition-10` (numerals 1-10)

---

### Level 3: `one-to-one-correspondence`
**What it is:** Touching/counting each object exactly once. Understanding that each object gets one count — no skipping, no double-counting.

**What mastery looks like:** Child can correctly count a set of objects and select the right total.

**Problem types:**
- Show a group of 1-5 objects (e.g., 3 stars). Objects appear one at a time with a count label. Ask "How many stars?" → 3 choices
- Objects animate in one by one with counting narration ("one... two... three...")
- Range 1-5, then 1-7, then 1-10

**Visual support:** Objects appear sequentially with a brief highlight/bounce as each is "counted." Character counts along with each object.

**Sub-stages:**
- `one-to-one-5` (groups of 1-5)
- `one-to-one-10` (groups of 1-10)

---

### Level 4: `cardinality`
**What it is:** Understanding that the **last number you say** when counting tells you how many there are in total. This is the conceptual leap from "I can count" to "I know how many."

**What mastery looks like:** Child sees a group of objects, the character counts them, then the child answers "how many altogether?"

**Problem types:**
- Show 4 objects all at once (not sequentially). Character asks "How many are there?" → 3 choices
- Show objects, character counts them aloud, then objects are briefly covered/hidden — "How many were there?" (tests if child understood the *last* number = total)
- Range 1-5, then 1-10

**Visual support:** All objects shown at once (unlike one-to-one where they appear sequentially). After a moment, a gentle prompt asks "how many?"

**Sub-stages:**
- `cardinality-5` (groups of 1-5)
- `cardinality-10` (groups of 1-10)

---

### Level 5: `quantity-comparison`
**What it is:** Looking at two groups and knowing which has more, fewer, or if they're the same.

**What mastery looks like:** Child can compare two groups of objects and identify which is more/fewer.

**Problem types:**
- Show two groups side by side (e.g., 3 apples vs. 5 apples). "Which group has MORE?" → tap left or right
- "Which group has FEWER?" → tap left or right
- "Are these the SAME?" → yes/no
- Start with obvious differences (1 vs. 5), then closer comparisons (3 vs. 4)
- Range 1-5, then 1-10

**Visual support:** Two clearly separated groups with different colors or positions (left/right). Character emphasizes "more" and "fewer" language.

**Sub-stages:**
- `comparing-easy` (differences of 3+ between groups, range 1-5)
- `comparing-close` (differences of 1-2 between groups, range 1-10)

---

### Level 6: `number-order`
**What it is:** Understanding that numbers have a fixed order and that each number is "one more" than the previous.

**What mastery looks like:** Child can put numbers in order, identify missing numbers in a sequence, and understand before/after relationships.

**Problem types:**
- "What number comes BEFORE 5?" → 3 choices (4, 6, 2)
- "What number comes AFTER 7?" → 3 choices (8, 6, 10)
- "Put these in order: 3, 1, 2" → select the first, then second, then third (simplified: "Which comes first?")
- Range 1-5, then 1-10

**Visual support:** Number line visual with missing slot. Character narrates the sequence.

**Sub-stages:**
- `number-order-5` (range 1-5)
- `number-order-10` (range 1-10)

---

### Level 7: `counting-on` (Bridge to Addition)
**What it is:** Starting from a given number and counting forward. E.g., "Start at 3, count two more: 4, 5." This is the mental foundation for addition.

**What mastery looks like:** Child can start at a given number and count forward by 1, 2, or 3.

**Problem types:**
- "Start at 3. Count 2 more. Where do you land?" → 3 choices (5, 4, 6)
- Show 3 objects, then 2 more appear: "How many altogether?" → this bridges to addition
- Range: start numbers 1-5, counting on by 1-3

**Visual support:** Objects in first group are dimmed/already counted. New objects appear with counting narration continuing from the starting number.

**Sub-stages:**
- `counting-on` (single stage)

---

### Level 8: `addition`
**What it is:** Combining two groups. True addition with + symbol.

**What mastery looks like:** Child can solve a + b = ? for numbers with sums up to 10.

**Problem types:**
- "2 + 3 = ?" → 3 choices
- Visual: two groups of objects merge together
- Start with +1, +2, then expand to any combination summing to ≤10

**Visual support:** Two object groups with + symbol between them, objects animate together.

**Sub-stages:**
- `addition-small` (addends 1-5, sums ≤ 5)
- `addition-10` (any addends, sums ≤ 10)

---

### Level 9: `subtraction`
**What it is:** Taking away from a group. True subtraction with - symbol.

**What mastery looks like:** Child can solve a - b = ? for numbers within 1-10.

**Problem types:**
- "5 - 2 = ?" → 3 choices
- Visual: group of objects, some fly away / disappear
- Start with -1, -2 from small numbers, then expand

**Visual support:** Objects in a group, some cross out or float away with narration.

**Sub-stages:**
- `subtraction-small` (numbers ≤ 5)
- `subtraction-10` (numbers ≤ 10)

---

## Part 2: Complete Progression Order

Here is the flat ordered list of all sub-concepts. A child moves through these in sequence:

```
 1. rote-counting-5
 2. rote-counting-10
 3. number-recognition-5
 4. number-recognition-10
 5. one-to-one-5
 6. one-to-one-10
 7. cardinality-5
 8. cardinality-10
 9. comparing-easy
10. comparing-close
11. number-order-5
12. number-order-10
13. counting-on
14. addition-small
15. addition-10
16. subtraction-small
17. subtraction-10
```

This replaces the current `ConceptArea = 'counting' | 'addition' | 'subtraction'` with a much more granular type.

---

## Part 3: Adaptive Algorithm

### Core Principles
1. **No visible progress bars or stage indicators.** The child just plays. The system decides what to show.
2. **All progression is automatic** — driven entirely by right/wrong answer patterns.
3. **Each child profile tracks independently.** Switching profiles switches the algorithm state.
4. **New profiles always start at `rote-counting-5`.**

### Per-Sub-Concept Tracking

For each sub-concept, track:
```typescript
interface SubConceptProgress {
  subConcept: string;           // e.g. 'rote-counting-5'
  status: 'locked' | 'active' | 'mastered';
  totalCorrect: number;
  totalAttempted: number;
  recentAttempts: boolean[];    // rolling window of last 10 attempts
  streak: number;               // current consecutive correct answers
  masteredAt?: string;          // ISO timestamp
}
```

### Advancement Rules (Mastery Detection)

A child **masters** a sub-concept and advances to the next when:

| Condition | Threshold |
|-----------|-----------|
| Minimum attempts | **8** (enough data to be meaningful, not so many it's tedious) |
| Recent accuracy | **≥ 80%** in the last 10 attempts |
| OR streak shortcut | **5 correct in a row** (even if < 8 total attempts — a child who gets 5 straight clearly gets it) |

When mastered:
- Mark current sub-concept as `mastered`
- Set next sub-concept to `active`
- Immediately start generating problems for the new sub-concept
- The transition should feel seamless — no fanfare screen, just naturally new types of problems

### Struggle Detection & Drop-Back Rules

A child is **struggling** when:

| Condition | Threshold |
|-----------|-----------|
| Recent accuracy | **< 50%** in the last 6 attempts (3 or fewer correct out of 6) |
| AND minimum attempts | At least **6 attempts** on the current sub-concept |

When struggling is detected:
1. **Drop back to the previous sub-concept** (set it back to `active`, current stays `locked`)
2. The child must **re-master** the previous sub-concept before advancing again
3. If already on the very first sub-concept (`rote-counting-5`), do NOT drop back — instead, simplify within the concept:
   - Reduce the number range (e.g., only 1-3 instead of 1-5)
   - Use more visual scaffolding
   - Slow down animations / add more counting narration

### Warm-Up / Review Logic

When a child returns after a session break (detected by >1 hour since last activity or new session):
- Start with **2-3 review problems** from the most recently mastered sub-concept
- If they get 2/3 correct, continue with the current active sub-concept
- If they get 0-1/3 correct, drop back to that previously mastered concept for re-review

### Problem Selection Within Active Sub-Concept

When generating a problem for the active sub-concept:
1. Choose the problem type randomly from the types available for that sub-concept
2. **Avoid repeating the exact same problem** (same numbers) back-to-back
3. For sub-concepts with number ranges (e.g., 1-5), start with smaller numbers and gradually include larger ones as the child gets more correct
4. **Wrong answer generation:** Wrong answers should be plausible (close to the correct answer, within the concept's number range). Never show negative numbers. Never show numbers far outside the range.

### Algorithm State Machine (Per Sub-Concept)

```
LOCKED ─── (previous concept mastered) ──→ ACTIVE
                                              │
                                    ┌─────────┴─────────┐
                                    │                     │
                              (≥80% in last 10       (<50% in last 6
                               OR 5 in a row)         attempts)
                                    │                     │
                                    ▼                     ▼
                                MASTERED            DROP BACK
                                    │            (prev concept → ACTIVE,
                                    │             this concept → LOCKED)
                                    ▼
                              Next concept
                              → ACTIVE
```

### No Timers, No Pressure

- There is **no time limit** on answers
- There is **no penalty** for slow responses
- The algorithm only cares about **correct vs. incorrect**
- Encouragement is shown on wrong answers (character teaches), celebration on correct

---

## Part 4: Data Model Changes

### New ConceptArea Type

Replace:
```typescript
export type ConceptArea = 'counting' | 'addition' | 'subtraction';
```

With:
```typescript
export type SubConcept =
  | 'rote-counting-5'
  | 'rote-counting-10'
  | 'number-recognition-5'
  | 'number-recognition-10'
  | 'one-to-one-5'
  | 'one-to-one-10'
  | 'cardinality-5'
  | 'cardinality-10'
  | 'comparing-easy'
  | 'comparing-close'
  | 'number-order-5'
  | 'number-order-10'
  | 'counting-on'
  | 'addition-small'
  | 'addition-10'
  | 'subtraction-small'
  | 'subtraction-10';
```

### Progression Order Constant

```typescript
export const SUB_CONCEPT_ORDER: SubConcept[] = [
  'rote-counting-5',
  'rote-counting-10',
  'number-recognition-5',
  'number-recognition-10',
  'one-to-one-5',
  'one-to-one-10',
  'cardinality-5',
  'cardinality-10',
  'comparing-easy',
  'comparing-close',
  'number-order-5',
  'number-order-10',
  'counting-on',
  'addition-small',
  'addition-10',
  'subtraction-small',
  'subtraction-10',
];
```

### Algorithm Constants

```typescript
export const MASTERY_CONFIG = {
  MIN_ATTEMPTS_FOR_MASTERY: 8,
  MASTERY_WINDOW: 10,             // look at last N attempts
  MASTERY_ACCURACY: 0.80,         // 80% in window
  STREAK_SHORTCUT: 5,             // 5 in a row = instant mastery
  STRUGGLE_WINDOW: 6,             // look at last N attempts for struggle
  STRUGGLE_ACCURACY: 0.50,        // below 50% = struggling
  MIN_ATTEMPTS_FOR_STRUGGLE: 6,
  REVIEW_PROBLEMS_ON_RETURN: 3,   // warm-up problems after break
  REVIEW_PASS_THRESHOLD: 2,       // must get 2/3 review correct
  SESSION_BREAK_MS: 3600000,      // 1 hour = new session
};
```

### Updated ChildProfile

The `conceptProgress` map should be keyed by `SubConcept` instead of `ConceptArea`. Each child starts with `rote-counting-5` as `active` and all others as `locked`.

### Migration

Existing profiles with the old 3-concept model should be migrated:
- If `counting` was `mastered` → mark `rote-counting-5` through `cardinality-10` as `mastered`, set `comparing-easy` as `active`
- If `counting` was `active` or `practicing` → set `rote-counting-5` as `active`, all else `locked`
- If `addition` was `mastered` → mark all counting + `counting-on` + `addition-small` + `addition-10` as `mastered`
- If `subtraction` was active → set `subtraction-small` as `active`
- Preserve attempt counts proportionally where possible

---

## Part 5: Problem Generation Per Sub-Concept

### `rote-counting-5` / `rote-counting-10`
```
Type: "What comes next?"
Display: "1, 2, 3, ___"
Choices: [4, 6, 2]  (correct + 2 plausible wrong)
Visual: Objects appear one by one as the sequence plays
```

### `number-recognition-5` / `number-recognition-10`
```
Type: "Which number is this?"
Display: Large numeral "5" + character says "five"
Choices: [5, 3, 8]  (correct numeral + 2 wrong)
Visual: Big bold numeral centered on screen
```

### `one-to-one-5` / `one-to-one-10`
```
Type: "How many?"
Display: Objects appear one at a time with count narration
Choices: [3, 5, 1]
Visual: Objects bounce in one by one, count label appears with each
```

### `cardinality-5` / `cardinality-10`
```
Type: "How many altogether?"
Display: All objects shown at once (no sequential counting)
Choices: [4, 2, 6]
Visual: Group of objects displayed together, character asks "how many?"
```

### `comparing-easy` / `comparing-close`
```
Type: "Which has MORE?" / "Which has FEWER?"
Display: Two groups side by side
Choices: [Left group, Right group]  (2-choice, not 3)
Visual: Two separated groups with clear labels, tap the group
```

### `number-order-5` / `number-order-10`
```
Type: "What comes BEFORE 5?" / "What comes AFTER 7?"
Display: Number line with a gap
Choices: [4, 6, 2]
Visual: Simple number line with a highlighted missing spot
```

### `counting-on`
```
Type: "Start at 3, count 2 more"
Display: 3 dimmed objects + 2 new bright objects
Choices: [5, 4, 6]
Visual: First group dimmed, second group animates in with counting from 4
```

### `addition-small` / `addition-10`
```
Type: "2 + 3 = ?"
Display: Standard addition with + sign and = ?
Choices: [5, 4, 7]
Visual: Two object groups with + between, merge together
```

### `subtraction-small` / `subtraction-10`
```
Type: "5 - 2 = ?"
Display: Standard subtraction with - sign and = ?
Choices: [3, 5, 2]
Visual: Group of objects, some float away
```

---

## Part 6: UI Changes Required

1. **Remove the concept stage indicator** from the top-left corner (ConceptStageIndicator component)
2. **Remove visible progress bars** from the game view — the child should not see their progress
3. **Parent Dashboard** should still show detailed progress (all 17 sub-concepts, mastery status, accuracy per sub-concept) — this is for parents only
4. **Profile switching must reload the algorithm state** — when switching to a different child, the active sub-concept and all tracking comes from that child's profile
5. **No concept selector** — the child cannot choose what to work on. The algorithm decides.

---

## Part 7: Pedagogical Notes for the Engineer

- **Why this order matters:** A 4-year-old must know the counting *words* (rote counting) before they can recognize written numerals. They must be able to count objects one-by-one before they understand that the last number = the total (cardinality). Comparing quantities requires cardinality. Addition requires counting-on. This sequence mirrors decades of early childhood math research (Gelman & Gallistel's counting principles).

- **Why 3 answer choices, not 2 or 4:** Three choices is the sweet spot for 4-year-olds. Two feels too easy (50% chance of guessing right masks lack of understanding). Four is overwhelming and the small motor skill of tapping the right button becomes the challenge, not the math.

- **Why the streak shortcut (5 in a row):** Young children who clearly "get it" should not be bored by repeating the same level. Five consecutive correct answers is extremely unlikely by chance with 3-choice questions (probability: ~1/243 = 0.4% by random guessing). If they get 5 in a row, they know it.

- **Why drop-back instead of hints:** When a 4-year-old is struggling, they don't need a hint — they need to go back and solidify the foundation. If they can't count objects reliably (one-to-one), no amount of hints will help them understand cardinality. The drop-back is pedagogically sound and avoids frustration.

- **Keep it playful:** Every problem should feel like a game, not a test. The character should react with genuine excitement to correct answers and gentle encouragement on wrong ones. The algorithm should be invisible to the child.
