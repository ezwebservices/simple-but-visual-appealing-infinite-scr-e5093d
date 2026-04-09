# Teaching Moment Design: Wrong-Answer QuickLessonCard

> For the Engineer implementing changes to `QuickLessonCard.tsx`.
> References: `ObjectGroup.tsx`, `useAudio.ts`, `src/types.ts`

---

## Problem

When a child picks the wrong answer, the current `QuickLessonCard` shows the correct equation (e.g. "3 + 2 = 5") and a text explanation. A 4-year-old cannot read. They need to **see** the objects and **hear** the counting to actually learn. The card should become a mini guided-counting lesson.

---

## 1. Spoken Script Templates

Use `useAudio.speak()` for each line. Insert pauses between lines (~1.5s) so the child can follow along. The voice rate should stay at `0.8` (already set) for clarity.

### Addition Script

For `num1 + num2 = correctAnswer` (e.g. 3 + 2 = 5):

| Step | Spoken Text | Timing |
|------|-------------|--------|
| 1 — Encouragement | `"That's okay! Let's figure this out together."` | 0s |
| 2 — Show first group | `"We have 3 apples."` | 2s |
| 3 — Count first group | `"1... 2... 3!"` | 3.5s |
| 4 — Show second group | `"And 2 more!"` | 6s |
| 5 — Count on from first | `"4... 5!"` | 7.5s |
| 6 — State answer | `"So, 3 plus 2 equals 5!"` | 9.5s |

**Template:**
```
"That's okay! Let's figure this out together."
"We have {num1} {objects}."
"{1}... {2}... {3}!" (count from 1 to num1)
"And {num2} more!"
"{num1+1}... {num1+2}...!" (count from num1+1 to correctAnswer)
"So, {num1} plus {num2} equals {correctAnswer}!"
```

### Subtraction Script

For `num1 - num2 = correctAnswer` (e.g. 5 - 2 = 3):

| Step | Spoken Text | Timing |
|------|-------------|--------|
| 1 — Encouragement | `"That's okay! Let's figure this out together."` | 0s |
| 2 — Show all objects | `"We start with 5 apples."` | 2s |
| 3 — Count all | `"1... 2... 3... 4... 5!"` | 3.5s |
| 4 — Remove objects | `"Now let's take away 2."` | 7s |
| 5 — Count removed | `"Bye bye 1... bye bye 2!"` | 8.5s |
| 6 — Count remaining | `"How many are left? 1... 2... 3!"` | 11s |
| 7 — State answer | `"So, 5 minus 2 equals 3!"` | 14s |

**Template:**
```
"That's okay! Let's figure this out together."
"We start with {num1} {objects}."
"{1}... {2}... {3}... {4}... {5}!" (count from 1 to num1)
"Now let's take away {num2}."
"Bye bye 1... bye bye 2...!" (count 1 to num2)
"How many are left? {1}... {2}... {3}!" (count 1 to correctAnswer)
"So, {num1} minus {num2} equals {correctAnswer}!"
```

### Implementation Note — Generating the Counting Strings

Build a helper like:
```ts
function countSequence(from: number, to: number): string {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i).join('... ') + '!';
}
```
And use `speak()` for each line, chaining them with `setTimeout` or queuing via `SpeechSynthesisUtterance.onend`.

Use the `objectType` already on the problem (from `ProblemState.objectType` in `src/types.ts`) to fill the `{objects}` placeholder (e.g. "apples", "stars", "hearts"). Pluralize simply by adding "s".

---

## 2. Visual Object Display & Animation

Reuse the existing `ObjectGroup` component and its object SVGs. The card layout should show objects inside the lesson card, replacing the current static equation display.

### Layout (inside the card)

```
 ┌──────────────────────────────────────┐
 │  💡 Let's Learn!                     │
 │                                      │
 │   🍎 🍎 🍎     +     🍎 🍎         │  <- two groups with operator between
 │   (group 1)           (group 2)      │
 │                                      │
 │          3  +  2  =  5               │  <- equation below objects
 │                                      │
 │          [ Got it! ]                 │
 └──────────────────────────────────────┘
```

For subtraction, show one group and animate objects "leaving":

```
 ┌──────────────────────────────────────┐
 │  💡 Let's Learn!                     │
 │                                      │
 │   🍎 🍎 🍎 🍎 🍎                    │  <- all objects start visible
 │                                      │
 │   (2 fade out / fly away)            │  <- then num2 objects animate away
 │                                      │
 │          5  −  2  =  3               │
 │                                      │
 │          [ Got it! ]                 │
 └──────────────────────────────────────┘
```

### Animation Sequence (Addition)

Use Framer Motion's `animate` controls. All timings sync to the spoken script above.

| Time | Visual Action | Sync With |
|------|---------------|-----------|
| 0s | Card slides in. Objects hidden. | Encouragement line |
| 2s | **Group 1** appears: objects pop in one-by-one (stagger 0.4s each) with `scale: [0, 1.15, 1]` | "We have 3 apples" |
| 3.5s | Each object in Group 1 **highlights** (brief yellow glow / scale pulse to 1.2) as counted: one per spoken number | "1... 2... 3!" |
| 6s | **Group 2** appears to the right, same stagger pop-in | "And 2 more!" |
| 7.5s | Group 2 objects highlight as counted, but count **continues** from num1+1 | "4... 5!" |
| 9.5s | Equation text fades in below objects, gentle scale-up | "So, 3 plus 2 equals 5!" |

**How to highlight as counted:** On each object's turn, animate it:
```ts
{ scale: [1, 1.3, 1], filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1)'] }
```
Duration: ~0.5s per object. This creates a "glow and bounce" that draws the eye without being jarring.

### Animation Sequence (Subtraction)

| Time | Visual Action | Sync With |
|------|---------------|-----------|
| 0s | Card slides in. Objects hidden. | Encouragement line |
| 2s | **All num1 objects** pop in one-by-one | "We start with 5 apples" |
| 3.5s | Each object highlights as counted left-to-right | "1... 2... 3... 4... 5!" |
| 7s | Pause — all objects visible | "Now let's take away 2" |
| 8.5s | Last `num2` objects **shrink and fade out** one at a time (0.5s each): `{ scale: 0, opacity: 0, y: 20 }`. Add a gentle "bye bye" wobble: `{ rotate: [0, -10, 10, 0] }` before fading. | "Bye bye 1... bye bye 2!" |
| 11s | Remaining objects highlight as re-counted | "How many are left? 1... 2... 3!" |
| 14s | Equation text fades in | "So, 5 minus 2 equals 3!" |

### Object Sizing

Inside the lesson card, objects should be slightly smaller than on the main game board (roughly `32x32px` instead of `44x44px`) to fit within the card's `maxWidth: 380`. If `num1 > 6`, shrink further to `24x24px` so they all fit on one or two rows.

### Visual Grouping

- **Addition:** Render Group 1 and Group 2 as two separate flex containers with a `+` symbol between them. Use a subtle different background tint or a thin dashed vertical divider so the child visually separates "what we had" from "what we added."
- **Subtraction:** Render all objects in one row. Objects that will be removed should get a distinct visual treatment *after* they're counted and about to leave (slight opacity reduction to 0.5 before the exit animation begins).

---

## 3. Tone & Language Guidelines

### Core Principles for Age 4

1. **No shame, ever.** Never say "wrong," "no," "incorrect," or "you missed it." The opening line is always warm: *"That's okay!"* — this is non-negotiable.

2. **We, not you.** Use "let's" and "we" language. The teacher counts *with* the child, not *at* them. "Let's figure this out together" — not "Let me show you the answer."

3. **Excitement over instruction.** Counting should sound fun, not clinical. The voice goes up with energy on the last number: "4... 5!" (the `speak()` rate of 0.8 already helps with pacing; pitch at 1.2 adds warmth).

4. **Short sentences.** No sentence longer than ~8 words in the spoken script. 4-year-olds process one idea at a time.

5. **Concrete, not abstract.** Always reference the objects: "3 apples," never "the number 3" or "the first addend." The child thinks in objects, not math terms.

6. **Celebrate understanding, not performance.** The dismiss button text should change from "Got it!" to **"I learned it!"** — this reframes the moment as growth, not failure recovery.

7. **Consistent object names.** Use the child-friendly plural of whatever `objectType` is active:
   - `apple` -> "apples"
   - `star` -> "stars"
   - `heart` -> "hearts"
   - `balloon` -> "balloons"
   - `fish` -> "fish" (irregular plural — do not say "fishs")

### Words to Use

- "Let's," "we," "together," "look," "count," "how many"
- "Great," "okay," "nice," "awesome"

### Words to NEVER Use

- "Wrong," "incorrect," "no," "mistake," "oops," "uh oh"
- "Pay attention," "try harder," "be careful," "think about it"
- Any math terminology: "addend," "sum," "difference," "equation," "minus sign"

---

## 4. Implementation Checklist for the Engineer

- [ ] Add a `speakTeachingMoment(num1, num2, operator, objectType, correctAnswer)` function to `useAudio.ts` that plays the full script with timed pauses (using `onend` callbacks to chain utterances)
- [ ] Expand `QuickLessonCard.tsx` props to accept `objectType: ObjectType`
- [ ] Add an internal animation state machine (e.g. `phase: 'encourage' | 'showGroup1' | 'countGroup1' | 'showGroup2' | 'countGroup2' | 'reveal'`) driven by `useEffect` timers that sync to the speech
- [ ] Render two `ObjectGroup`-style groups inside the card (can inline the rendering or create a `TeachingObjectRow` sub-component) with per-object highlight animations
- [ ] For subtraction, animate object removal (shrink + fade + wobble)
- [ ] Keep the equation text but only reveal it at the final step
- [ ] Change button text to "I learned it!"
- [ ] Handle the `fish` irregular plural in the speech helper
- [ ] Ensure the "Got it" / "I learned it!" button is not pressable until the full teaching sequence completes (disable or hide during animation) so the child sees the whole lesson
- [ ] Test with `num1` values from 1–10 to confirm objects fit in the card at both size tiers (32px and 24px)
