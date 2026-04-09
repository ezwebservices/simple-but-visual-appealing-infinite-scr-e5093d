# NumPals — Architecture Document

> TikTok-style infinite scroll math app for 4-year-olds.
> Addition & subtraction within 10. Inline SVG characters. Audio narration. Zero external assets.

---

## 1. Existing Template Baseline

The project starts from **amplify-vite-react-template** with:

| File | Purpose |
|------|---------|
| `package.json` | Vite 7.3 + React 18.3 + TypeScript 5.9 + Amplify |
| `vite.config.ts` | Vite with `@vitejs/plugin-react` |
| `tsconfig.json` | Strict mode, `react-jsx`, bundler resolution. **Updated:** added `"types": ["react", "react-dom"]` to prevent Amplify's transitive `@types/*` from breaking `tsc`. |
| `tsconfig.node.json` | Vite config TS project reference |
| `src/main.tsx` | React root mount + Amplify config |
| `src/App.tsx` | Placeholder Todo app (will be replaced) |
| `amplify/` | Auth + Data backend definitions (do NOT modify) |
| `index.html` | SPA entry point |

**Build command:** `npm run build` → `tsc && vite build`

---

## 2. Dependencies to Add

Install these exact packages:

```bash
npm install tailwindcss@^4.1.0 @tailwindcss/vite@^4.1.0 framer-motion@^12.6.0
```

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | `^4.1.0` | Utility-first CSS (v4 — CSS-native, no config file needed) |
| `@tailwindcss/vite` | `^4.1.0` | Vite plugin for Tailwind v4 |
| `framer-motion` | `^12.6.0` | Animations: card transitions, confetti, celebrations |

**No other dependencies.** No icon libraries, no font CDNs, no image assets. Everything is inline SVG and system fonts.

### Vite Config Update

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### CSS Entry Point

```css
/* src/index.css — replace entire contents */
@import 'tailwindcss';
```

Tailwind v4 uses CSS-native configuration. No `tailwind.config.js` or `postcss.config.js` needed.

---

## 3. Data Models

All types live in a single file.

```typescript
// src/types.ts

export type Operator = 'plus' | 'minus';

export type ObjectType = 'apple' | 'star' | 'heart' | 'balloon' | 'fish';

export type CharacterName = 'benny' | 'lulu' | 'ollie' | 'fifi' | 'ziggy';

export type CharacterMood = 'happy' | 'excited' | 'thinking' | 'encouraging';

export interface MathProblem {
  id: string;                    // crypto.randomUUID()
  num1: number;                  // 1-9
  num2: number;                  // 1-9 (result always 0-10)
  operator: Operator;
  answer: number;                // correct answer
  wrongAnswers: [number, number]; // exactly 2 distractors
  objectType: ObjectType;        // which SVG object to render
  character: CharacterName;      // which animal character appears
  backgroundColor: string;       // pastel gradient key from palette
}

export interface LessonCardState {
  problem: MathProblem;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  hasPlayed: boolean;            // audio played flag
}

export interface ProgressData {
  totalCorrect: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayed: string;            // ISO date string
}

export interface ScrollState {
  currentIndex: number;
  cards: LessonCardState[];
}
```

---

## 4. Component Architecture

### 4.1 Component Tree

```
App
├── AppProvider                       ← React context wrapper
│   ├── InfiniteScroll                ← CSS snap-scroll container (100vw × 100vh viewport)
│   │   └── LessonCard[]             ← one per problem, each 100vh
│   │       ├── CardBackground        ← pastel gradient <div>
│   │       ├── CharacterDisplay      ← renders one of 5 SVG animals by name
│   │       │   └── BennyBear | LuluLadybug | OllieOwl | FifiFrog | ZiggyZebra
│   │       ├── ProblemDisplay        ← visual math equation with countable objects
│   │       │   ├── ObjectGroup       ← num1 objects (left side)
│   │       │   ├── OperatorBadge     ← "+" or "−" in a colored circle
│   │       │   └── ObjectGroup       ← num2 objects (right side)
│   │       ├── QuestionText          ← "How many altogether?" / "How many left?"
│   │       └── AnswerRow             ← 3 large tap targets
│   │           └── AnswerButton × 3  ← shuffled: 1 correct + 2 wrong
│   ├── SwipeHint                     ← bouncing "swipe up" arrow (first card only)
│   ├── StreakCounter                 ← floating fire emoji + count (top-right)
│   ├── CelebrationOverlay           ← confetti burst (on correct answer)
│   └── EncouragementOverlay         ← floating hearts (on wrong answer)
```

### 4.2 InfiniteScroll — The Core Mechanic

This is the TikTok-like scroll container. It is the heart of the UX.

**Container CSS (Tailwind classes):**
```
h-screen w-screen overflow-y-scroll overflow-x-hidden snap-y snap-mandatory
```

Each child `LessonCard` gets:
```
h-screen w-screen snap-start
```

**Scroll behavior:**
1. Start with 5 pre-generated `LessonCardState` objects in the cards array.
2. Attach an `IntersectionObserver` to each card (`threshold: 0.7`).
3. When a card enters the viewport at 70% visibility, update `currentIndex` in context.
4. When the user reaches card `N-2` (2 from the end), call `generateMoreCards(3)` to append 3 new cards.
5. Cards are never removed — scroll position stays stable.

**Implementation: `src/components/InfiniteScroll.tsx`**
- Renders a `<div>` with snap-scroll classes.
- Maps over `cards` from context, rendering one `<LessonCard>` per entry.
- Uses `useRef` + `IntersectionObserver` to detect which card is in view.
- Calls `generateMoreCards` when nearing the end.

### 4.3 LessonCard — Single Full-Screen Card

Each card is one self-contained math lesson. Layout (top to bottom):

| Zone | Vertical % | Content |
|------|-----------|---------|
| Top | 5-30% | Animal character SVG (centered, ~40vw wide) |
| Middle | 30-60% | ProblemDisplay: ObjectGroup + OperatorBadge + ObjectGroup |
| Question | 60-68% | QuestionText: "How many altogether?" or "How many left?" |
| Bottom | 70-95% | AnswerRow: 3 large buttons side by side |

**Implementation: `src/components/LessonCard.tsx`**
- Receives `cardState: LessonCardState` and `index: number` as props.
- Wraps content in `CardBackground` (a gradient div).
- Triggers audio via `useAudio` when the card scrolls into view.
- On answer tap: calls `submitAnswer(index, selectedNumber)` from context.
- After answer, shows celebration or encouragement overlay inline.

### 4.4 Animal Characters — 5 Inline SVG Components

All characters are inline SVG React components. Each accepts a `mood: CharacterMood` prop that changes facial expression (eyes, mouth shape). Each is a `~200×200` viewBox.

| Component | File | Description |
|-----------|------|-------------|
| BennyBear | `src/components/characters/BennyBear.tsx` | Warm brown `#8B6914`, cream belly, round ears, rosy cheeks `#FFB6C1`, red party hat |
| LuluLadybug | `src/components/characters/LuluLadybug.tsx` | Bright red `#E74C3C`, 4 black spots, tiny wings, curly antennae |
| OllieOwl | `src/components/characters/OllieOwl.tsx` | Soft purple `#9B59B6`, big round blue glasses, fluffy chest feathers, ear tufts |
| FifiFrog | `src/components/characters/FifiFrog.tsx` | Bright green `#2ECC71`, wide mouth, sitting pose, orange cheek spots, webbed feet |
| ZiggyZebra | `src/components/characters/ZiggyZebra.tsx` | White body, rainbow pastel stripes (pink, blue, green), colorful mane |

**Mood expressions (all characters):**
- `happy` — default smile, open eyes
- `excited` — wide open mouth, sparkle eyes, slight bounce
- `thinking` — one eyebrow raised, slight head tilt
- `encouraging` — gentle smile, soft eyes, slight nod

**CharacterDisplay (`src/components/characters/CharacterDisplay.tsx`):**
- Takes `character: CharacterName` and `mood: CharacterMood`.
- Switch-maps to the correct SVG component.
- Wraps in Framer Motion for mood-change crossfade (300ms).

**Index barrel: `src/components/characters/index.ts`**

### 4.5 Countable Objects — Visual Math

Five SVG object types, each a small (~40×40) inline SVG component.

| Object | File | Visual |
|--------|------|--------|
| Apple | `src/components/objects/Apple.tsx` | Red circle, green leaf, brown stem |
| Star | `src/components/objects/Star.tsx` | 5-pointed, sunny yellow `#FFE66D`, orange outline |
| Heart | `src/components/objects/Heart.tsx` | Classic shape, coral pink `#FF6B6B` |
| Balloon | `src/components/objects/Balloon.tsx` | Oval with string, color from palette |
| Fish | `src/components/objects/Fish.tsx` | Tropical fish, sky blue `#87CEEB`, yellow fin |

**ObjectGroup (`src/components/objects/ObjectGroup.tsx`):**
- Takes `count: number` and `objectType: ObjectType`.
- Renders `count` instances of the object SVG in a flex row with spacing.
- Each object has a subtle idle bob animation (Framer Motion): `y: [-2, 2]` infinite, staggered by `index × 100ms`.

**Index barrel: `src/components/objects/index.ts`**

### 4.6 Answer Buttons

**AnswerButton (`src/components/ui/AnswerButton.tsx`):**
- Large rounded pill: min height 90px, ~28% viewport width.
- Shows a single number in `2.5rem` extra-bold white text.
- Background: neutral purple/blue from palette by default.
- States:
  - **Default**: tappable, slight scale on press (`0.95 → 1.05 → 1` over 200ms).
  - **Correct**: background transitions to mint `#4ECDC4`, scale pops `1.0 → 1.2 → 1.0`.
  - **Wrong (selected)**: background fades to soft coral `#FF6B6B`, shake `x: [-5, 5, -5, 0]` over 300ms.
  - **Wrong (not selected)**: fades to 50% opacity. If this button was the correct answer, it pulses green.
  - **Disabled**: all buttons disabled after any selection.

**AnswerRow (`src/components/ui/AnswerRow.tsx`):**
- Takes the correct answer + 2 wrong answers.
- Shuffles all 3 into random order on mount (Fisher-Yates).
- Renders 3 `AnswerButton` components in a horizontal flex row.

### 4.7 Overlays

**CelebrationOverlay (`src/components/animations/CelebrationOverlay.tsx`):**
- Triggered when `isCorrect === true`.
- 30 confetti particles: random colors from palette, `y: 0 → 100vh`, `rotate: 0 → 720°`, staggered 50ms, total duration 2s.
- Uses `AnimatePresence` for clean mount/unmount.
- Positioned `fixed inset-0 pointer-events-none z-50`.

**EncouragementOverlay (`src/components/animations/EncouragementOverlay.tsx`):**
- Triggered when `isCorrect === false`.
- 5 heart shapes float up from center: `y: 0 → -100, opacity: 1 → 0`, staggered 100ms, duration 1.5s.
- Same positioning as celebration.

**SwipeHint (`src/components/ui/SwipeHint.tsx`):**
- Only visible on the first card, appears after 3-second delay.
- Bouncing chevron arrow: `y: [0, -10, 0]` infinite, 1.5s duration.
- Disappears once user scrolls to card 2.

**StreakCounter (`src/components/ui/StreakCounter.tsx`):**
- Fixed position top-right corner, 16px from edges. `z-40`.
- Shows fire emoji + streak number: e.g., "🔥 × 5".
- Scale-pop animation `[1, 1.3, 1]` over 300ms on each increment.
- Milestone bursts at streaks 3, 5, 10 (extra scale + color flash).
- Fades to 50% opacity after 3 seconds of no interaction.

---

## 5. Problem Generator

**Implementation: `src/hooks/useProblemGenerator.ts`**

Returns a function `generateProblem(previousProblem?: MathProblem): MathProblem`.

### Generation Rules

1. **Operator selection**: 60% addition, 40% subtraction (random).
2. **Number ranges**:
   - Addition: `num1` 1-9, `num2` 1-9, constrained so `num1 + num2 ≤ 10`.
   - Subtraction: `num1` 1-9, `num2` 1-9, constrained so `num1 ≥ num2` (result ≥ 0).
3. **Answer**: `num1 + num2` or `num1 - num2`.
4. **Wrong answers**: 2 distractors within ±3 of correct answer, clamped to 0-10, distinct from correct and each other.
5. **No consecutive repeats**: if `previousProblem` has the same `(num1, operator, num2)`, regenerate.
6. **Object type**: randomly selected from the 5 types.
7. **Character**: randomly selected from the 5 characters.
8. **Background**: cycles through gradient palette keys, never repeating the previous card's gradient.

### Algorithm (pseudocode)

```
function generateProblem(prev?):
  loop:
    operator = random() < 0.6 ? 'plus' : 'minus'
    if operator == 'plus':
      num1 = randInt(1, 9)
      num2 = randInt(1, 10 - num1)
    else:
      num1 = randInt(1, 9)   // at least 1 so subtraction is meaningful
      num2 = randInt(1, num1) // result >= 0
    if prev and (num1, operator, num2) == (prev.num1, prev.operator, prev.num2):
      continue
    break

  answer = operator == 'plus' ? num1 + num2 : num1 - num2
  wrongAnswers = generateDistractors(answer)
  return { id: crypto.randomUUID(), num1, num2, operator, answer, wrongAnswers, ... }

function generateDistractors(correct):
  candidates = [correct-3, correct-2, correct-1, correct+1, correct+2, correct+3]
    .filter(n => n >= 0 && n <= 10 && n !== correct)
  shuffle(candidates)
  return [candidates[0], candidates[1]]
```

---

## 6. Audio System

**Implementation: `src/hooks/useAudio.ts`**

Uses the **Web Speech API** (`window.speechSynthesis` + `SpeechSynthesisUtterance`).

### Hook Interface

```typescript
function useAudio(): {
  speakProblem: (problem: MathProblem) => void;
  isSupported: boolean;
}
```

### Behavior

1. On mount, check `typeof window.speechSynthesis !== 'undefined'`. If unsupported, `isSupported = false` and `speakProblem` is a no-op. **No error shown to the child.**
2. Speech text:
   - Addition: `"How many is {num1} plus {num2}?"`
   - Subtraction: `"How many is {num1} take away {num2}?"`
3. Utterance settings: `rate = 0.8` (slow), `pitch = 1.1` (friendly/higher).
4. Cancel any in-progress speech before starting new utterance.

### Trigger

Each `LessonCard` uses the `useAudio` hook. When the card's `IntersectionObserver` fires at ≥70% visibility:
- Wait 500ms delay.
- Check `hasPlayed` flag on the card state. If false, call `speakProblem(problem)` and set `hasPlayed = true`.
- Audio plays once per card, never repeats on re-scroll.

---

## 7. State Management

### AppContext (`src/context/AppContext.tsx`)

Single React context providing all shared state. No external state library.

```typescript
interface AppContextValue {
  // Card state
  cards: LessonCardState[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;

  // Actions
  submitAnswer: (cardIndex: number, answer: number) => void;
  generateMoreCards: (count: number) => void;
  markAudioPlayed: (cardIndex: number) => void;

  // Progress
  progress: ProgressData;
}
```

### State Flow

```
User swipes up
  → IntersectionObserver fires
  → setCurrentIndex(newIndex)
  → useAudio triggers speakProblem after 500ms
  → markAudioPlayed(cardIndex)

User taps answer button
  → submitAnswer(cardIndex, selectedNumber)
  → Compare with problem.answer
  → Update card: selectedAnswer, isCorrect
  → If correct: progress.currentStreak++, progress.totalCorrect++
  → If wrong: progress.currentStreak = 0
  → progress.totalAttempted++
  → Persist progress to localStorage

Near end of cards (currentIndex >= cards.length - 2)
  → generateMoreCards(3)
  → Append 3 new LessonCardState to cards array
```

### localStorage Persistence

**Key:** `numpals-progress`
**Value:** JSON-serialized `ProgressData`

Read on app mount with try-catch (corrupted data → reset to defaults). Write after every answer submission.

Default `ProgressData`:
```typescript
{
  totalCorrect: 0,
  totalAttempted: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayed: new Date().toISOString()
}
```

**Implementation: `src/hooks/useProgress.ts`**

---

## 8. Visual Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FFF8F0` | App background, card base |
| `coral` | `#FF6B6B` | Wrong answer, accents |
| `mint` | `#4ECDC4` | Correct answer |
| `lavender` | `#B8A9C9` | Card backgrounds |
| `sunny` | `#FFE66D` | Stars, streaks, celebrations |
| `sky` | `#87CEEB` | Card backgrounds |
| `peach` | `#FFBE76` | Card backgrounds |
| `sage` | `#A8E6CF` | Card backgrounds |
| `charcoal` | `#2D3436` | Text color |

**Theme file: `src/styles/theme.ts`** — exports palette as a const object.

### Card Background Gradients

Each card randomly selects one gradient (no consecutive repeats):

```typescript
const GRADIENTS = [
  'linear-gradient(180deg, #FFF8F0, #FFBE76)',  // cream → peach
  'linear-gradient(180deg, #FFF8F0, #B8A9C9)',  // cream → lavender
  'linear-gradient(180deg, #FFF8F0, #87CEEB)',  // cream → sky
  'linear-gradient(180deg, #FFF8F0, #A8E6CF)',  // cream → sage
  'linear-gradient(180deg, rgba(255,230,109,0.1), #FFF8F0)', // sunny hint → cream
] as const;
```

### Typography

System font stack only — no external fonts:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

| Element | Size | Weight |
|---------|------|--------|
| Question text | `2rem` | Bold (700) |
| Answer buttons | `2.5rem` | Extra-bold (800) |
| Streak counter | `1.5rem` | Bold (700) |

### Layout Principles

- **Mobile-first**: every card is `100vw × 100vh`.
- **Tap targets**: minimum 90px height on answer buttons. 28% viewport width each. 8px gap.
- **Corners**: 16px radius on cards, 24px on buttons, full-round on operator badge.
- **No horizontal scroll**: `overflow-x: hidden` on scroll container.

---

## 9. File Structure

```
├── ARCHITECTURE.md                          ← this file
├── index.html                               ← update <title> to "NumPals"
├── package.json                             ← add tailwindcss, @tailwindcss/vite, framer-motion
├── vite.config.ts                           ← add tailwindcss plugin
├── tsconfig.json                            ← no changes needed
├── tsconfig.node.json                       ← no changes needed
├── amplify/                                 ← DO NOT MODIFY
│   ├── auth/resource.ts
│   ├── backend.ts
│   ├── data/resource.ts
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── main.tsx                             ← keep Amplify config, wrap App in AppProvider
│   ├── App.tsx                              ← replace: renders InfiniteScroll + overlays
│   ├── index.css                            ← replace: @import 'tailwindcss'
│   ├── vite-env.d.ts                        ← no changes
│   ├── types.ts                             ← all TypeScript interfaces/types
│   ├── styles/
│   │   └── theme.ts                         ← color palette, gradients, shared constants
│   ├── context/
│   │   └── AppContext.tsx                    ← React context: cards, progress, actions
│   ├── hooks/
│   │   ├── useProblemGenerator.ts           ← math problem generation logic
│   │   ├── useAudio.ts                      ← Web Speech API wrapper
│   │   └── useProgress.ts                   ← localStorage streak/progress tracking
│   ├── components/
│   │   ├── InfiniteScroll.tsx               ← snap-scroll container + IntersectionObserver
│   │   ├── LessonCard.tsx                   ← full-screen card layout
│   │   ├── CardBackground.tsx               ← pastel gradient wrapper
│   │   ├── ProblemDisplay.tsx               ← object groups + operator
│   │   ├── QuestionText.tsx                 ← "How many altogether?"
│   │   ├── characters/
│   │   │   ├── index.ts                     ← barrel export
│   │   │   ├── CharacterDisplay.tsx         ← switch on CharacterName → SVG component
│   │   │   ├── BennyBear.tsx                ← inline SVG, mood prop
│   │   │   ├── LuluLadybug.tsx              ← inline SVG, mood prop
│   │   │   ├── OllieOwl.tsx                 ← inline SVG, mood prop
│   │   │   ├── FifiFrog.tsx                 ← inline SVG, mood prop
│   │   │   └── ZiggyZebra.tsx               ← inline SVG, mood prop
│   │   ├── objects/
│   │   │   ├── index.ts                     ← barrel export
│   │   │   ├── ObjectGroup.tsx              ← renders N objects in a row with bob animation
│   │   │   ├── Apple.tsx                    ← inline SVG
│   │   │   ├── Star.tsx                     ← inline SVG
│   │   │   ├── Heart.tsx                    ← inline SVG
│   │   │   ├── Balloon.tsx                  ← inline SVG
│   │   │   └── Fish.tsx                     ← inline SVG
│   │   ├── ui/
│   │   │   ├── AnswerButton.tsx             ← large pill button with animation states
│   │   │   ├── AnswerRow.tsx                ← shuffles + renders 3 AnswerButtons
│   │   │   ├── StreakCounter.tsx            ← floating fire emoji counter
│   │   │   └── SwipeHint.tsx               ← bouncing "swipe up" arrow
│   │   └── animations/
│   │       ├── CelebrationOverlay.tsx       ← confetti burst
│   │       └── EncouragementOverlay.tsx     ← floating hearts
```

**Total new files: 28** (excluding modified existing files)

---

## 10. Amplify Integration Notes

The Amplify backend (`amplify/`) is **not used** by NumPals's core functionality. The app is entirely client-side with localStorage persistence.

However, `src/main.tsx` must still import and configure Amplify (the template expects `amplify_outputs.json`). To avoid build errors when `amplify_outputs.json` doesn't exist locally:

A minimal `amplify_outputs.json` stub has been created at the project root:

```json
{}
```

This allows `src/main.tsx` to import it without build errors. When a real Amplify backend is deployed, this file gets replaced automatically.

The `amplify/` directory must not be modified.

---

## 11. Animation Summary (Framer Motion)

| Animation | Trigger | Motion Values | Duration |
|-----------|---------|---------------|----------|
| Card enter | Scroll into view | `opacity: 0→1, y: 50→0` | 400ms ease-out |
| Answer tap | Button press | `scale: 0.95→1.05→1` | 200ms |
| Correct answer | `isCorrect=true` | Button bg → mint, `scale: 1→1.2→1` | 300ms |
| Wrong answer | `isCorrect=false` | Button `x: [-5,5,-5,0]` | 300ms |
| Character mood | Answer submitted | Crossfade SVG expressions | 300ms |
| Confetti | Correct answer | 30 particles, `y:0→100vh`, `rotate:0→720°`, stagger 50ms | 2s |
| Hearts float | Wrong answer | 5 hearts, `y:0→-100`, `opacity:1→0`, stagger 100ms | 1.5s |
| Streak pop | Streak increments | `scale: [1, 1.3, 1]` | 300ms |
| Swipe hint | First card, 3s delay | `y: [0, -10, 0]` infinite | 1.5s loop |
| Object idle | Always | `y: [-2, 2]` infinite, stagger `index×100ms` | continuous |

---

## 12. Build Pipeline

```bash
# Install dependencies
npm install

# Development
npm run dev        # Vite dev server with HMR

# Production build
npm run build      # tsc && vite build — must exit 0

# Preview production build
npm run preview
```

### Build Verification Checklist

- [ ] `npm run build` exits with code 0
- [ ] No TypeScript errors (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- [ ] All imports resolve to real files
- [ ] No `any` types
- [ ] SVG components render valid JSX (no broken paths/elements)
- [ ] Framer Motion `AnimatePresence` wraps all conditional animations
- [ ] localStorage access wrapped in try-catch
- [ ] Web Speech API has graceful fallback when unsupported
