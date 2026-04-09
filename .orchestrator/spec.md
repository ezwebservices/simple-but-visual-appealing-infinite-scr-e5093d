# MathScroll — TikTok-Style Math for 4-Year-Olds

## Overview
An infinite vertical scroll app where each full-screen card is a math lesson featuring an adorable animal character. Children swipe up (like TikTok) to get a new problem. Addition and subtraction within 10. Audio narration reads problems aloud. Everything is designed for tiny fingers and short attention spans.

---

## Data Models

```typescript
// src/types.ts

type Operator = 'plus' | 'minus';

type ObjectType = 'apple' | 'star' | 'heart' | 'balloon' | 'fish';

type CharacterName = 'benny' | 'lulu' | 'ollie' | 'fifi' | 'ziggy';

type CharacterMood = 'happy' | 'excited' | 'thinking' | 'encouraging';

interface MathProblem {
  id: string;                    // unique id (uuid or incrementing)
  num1: number;                  // 1-9
  num2: number;                  // 1-9 (result always 0-10)
  operator: Operator;
  answer: number;                // correct answer
  wrongAnswers: [number, number]; // exactly 2 wrong answers
  objectType: ObjectType;        // which SVG object to show
  character: CharacterName;      // which animal appears
  backgroundColor: string;       // random pastel from palette
}

interface LessonCardState {
  problem: MathProblem;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  hasPlayed: boolean;            // whether audio has played
}

interface ProgressData {
  totalCorrect: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayed: string;            // ISO date
}

interface ScrollState {
  currentIndex: number;          // which card is in view
  cards: LessonCardState[];      // all generated cards
}
```

---

## Component Tree

```
App
├── InfiniteScroll                    // CSS snap-scroll container, full viewport
│   ├── LessonCard[]                  // one per problem, height: 100vh
│   │   ├── CardBackground            // pastel gradient fill
│   │   ├── CharacterDisplay          // selected animal character SVG
│   │   │   └── BennyBear | LuluLadybug | OllieOwl | FifiFrog | ZiggyZebra
│   │   ├── ProblemDisplay            // visual representation of the problem
│   │   │   ├── ObjectGroup (left)    // num1 countable objects
│   │   │   ├── OperatorBadge         // "+" or "−" in a circle
│   │   │   └── ObjectGroup (right)   // num2 countable objects
│   │   ├── QuestionText              // "How many altogether?" or "How many left?"
│   │   └── AnswerRow                 // 3 large buttons
│   │       └── AnswerButton × 3      // shuffled: 1 correct + 2 wrong
│   └── SwipeHint                     // subtle "swipe up" arrow on first card only
├── StreakCounter                      // floating top-right overlay
├── CelebrationOverlay                // confetti + character dance (on correct)
└── EncouragementOverlay              // gentle wobble + hearts (on wrong)
```

---

## Routes

Single-page app — no routing needed.

| Path | Component | Description |
|------|-----------|-------------|
| `/`  | `App`     | The entire infinite scroll experience |

No navigation, no menus, no settings screens. Pure scroll-and-play.

---

## State Management

### React Context: `AppContext`

```typescript
// src/context/AppContext.tsx

interface AppContextValue {
  // Scroll state
  cards: LessonCardState[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  
  // Problem actions
  submitAnswer: (cardIndex: number, answer: number) => void;
  generateMoreCards: (count: number) => void;
  
  // Progress
  progress: ProgressData;
  
  // Audio
  speakProblem: (problem: MathProblem) => void;
}
```

### Where state lives:
- **Cards array**: AppContext (in-memory, generated on demand)
- **Current scroll position**: InfiniteScroll component (local state + IntersectionObserver)
- **Selected answer per card**: LessonCard component (local state, bubbles up via submitAnswer)
- **Progress/streak**: AppContext, persisted to localStorage
- **Audio playback**: useAudio hook (local to each LessonCard, triggered by IntersectionObserver)
- **Animation state**: Local to Celebration/Encouragement components (triggered by answer submission)

---

## Behavior Rules

### Problem Generation
1. `num1` and `num2` are always 1-9
2. For addition: answer = num1 + num2, max 10. So num1 + num2 ≤ 10.
3. For subtraction: answer = num1 - num2, min 0. Always num1 ≥ num2.
4. Wrong answers must be within ±3 of correct answer, clamped to 0-10, and distinct from correct answer and each other.
5. Never generate the same (num1, operator, num2) as the previous card.
6. 60% addition, 40% subtraction (addition is easier for 4-year-olds).
7. Object type and character are randomly selected per card.
8. Background color cycles through palette to avoid repeating consecutively.

### Answer Interaction
1. Child taps one of 3 answer buttons.
2. Once tapped, all 3 buttons become disabled (no re-answering).
3. If correct:
   - Button turns green with a bounce animation
   - Character mood changes to 'excited'
   - Celebration overlay plays (confetti for 2 seconds)
   - Streak counter increments
   - After 2s delay, a subtle "swipe up" pulse appears
4. If wrong:
   - Selected button turns soft red (not harsh), correct button pulses green
   - Character mood changes to 'encouraging'
   - Encouragement overlay plays (floating hearts for 1.5 seconds)
   - The correct answer's objects gently highlight/pulse so child sees the right count
   - Streak resets to 0

### Audio
1. When a card scrolls into view (IntersectionObserver, threshold 0.7), auto-play audio after 500ms delay.
2. Speech text for addition: "How many is [num1] plus [num2]?"
3. Speech text for subtraction: "How many is [num1] take away [num2]?"
4. Rate: 0.8 (slower than normal). Pitch: 1.1 (slightly higher, friendly).
5. If Web Speech API unavailable, silently skip (no error shown to child).
6. Each card's audio plays only once (tracked by `hasPlayed` flag).

### Infinite Scroll
1. Start with 5 pre-generated cards.
2. When user scrolls to card N-2 (2 from the end), generate 3 more cards.
3. Use CSS `scroll-snap-type: y mandatory` on the container, `scroll-snap-align: start` on each card.
4. Each card is exactly 100vh tall, 100vw wide.
5. No horizontal scroll. Overflow-x hidden.
6. On first card only, show a bouncing "swipe up" arrow hint after 3 seconds.

### Streak Counter
1. Floating in top-right corner, always visible.
2. Shows: 🔥 × [streak number]
3. When streak hits 3, 5, 10: extra celebration burst.
4. Animates with a scale-pop when incrementing.
5. Fades to 50% opacity after 3 seconds of no interaction.

---

## Visual Design

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Cream | `#FFF8F0` | App background, fallback |
| Coral | `#FF6B6B` | Wrong answer highlight, accents |
| Mint | `#4ECDC4` | Correct answer highlight |
| Lavender | `#B8A9C9` | Card backgrounds, UI elements |
| Sunny | `#FFE66D` | Stars, streaks, celebrations |
| Sky | `#87CEEB` | Card backgrounds, UI elements |
| Peach | `#FFBE76` | Card backgrounds, warmth |
| Sage | `#A8E6CF` | Card backgrounds, nature |

### Card Background Gradients
Each card gets a random soft gradient from pairs:
- Cream → Peach
- Cream → Lavender  
- Cream → Sky
- Cream → Sage
- Sunny (10% opacity) → Cream

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Question text: `2rem`, bold, dark charcoal `#2D3436`
- Answer buttons: `2.5rem`, extra-bold, white on colored background
- Streak counter: `1.5rem`, bold

### Layout (Mobile-First)
- Full viewport: `100vw × 100vh` per card
- Character: centered top 30% of card, 40% of viewport width
- Countable objects: middle band, 30-60% of card height, arranged in a horizontal row with spacing
- Operator badge: between object groups, 48px circle
- Answer buttons: bottom 25% of card, horizontal row of 3, each min 90px tall, 28% width, 8px gap
- Streak counter: fixed top-right, 16px from edges
- All corners rounded (16px cards, 24px buttons, full-round for operator badge)

### Animation Specs (Framer Motion)
- Card enter: `opacity: 0 → 1, y: 50 → 0` over 400ms ease-out
- Answer button tap: `scale: 0.95 → 1.05 → 1` over 200ms
- Correct answer: button `backgroundColor` transitions to mint, `scale` pops to 1.2 then 1.0
- Wrong answer: button `x` shakes `[-5, 5, -5, 0]` over 300ms
- Character mood change: crossfade expressions over 300ms
- Confetti: 30 particles, random colors from palette, `y: 0 → 100vh`, `rotate: 0 → 720`, staggered 50ms, duration 2s
- Encouragement hearts: 5 hearts float up from character, `y: 0 → -100, opacity: 1 → 0`, staggered 100ms
- Streak counter: `scale: [1, 1.3, 1]` over 300ms on increment
- Swipe hint arrow: `y: [0, -10, 0]` infinite loop, 1.5s duration
- Countable objects: each object has a subtle idle bob `y: [-2, 2]` infinite, staggered by index × 100ms

### Characters (SVG Design Direction)
All characters are round, friendly, with big expressive eyes (30% of head size). Thick outlines (3-4px). Soft shadows. Each ~200×200 viewBox.

1. **Benny Bear** — warm brown (#8B6914), cream belly, tiny round ears, rosy cheeks (#FFB6C1), wears a small red party hat
2. **Lulu Ladybug** — bright red (#E74C3C) body with 4 black spots, tiny transparent wings, curly antennae, always smiling
3. **Ollie Owl** — soft purple (#9B59B6), big round blue glasses, fluffy chest feathers (lighter purple), small ear tufts
4. **Fifi Frog** — bright green (#2ECC71), wide cheerful mouth, sitting pose, two orange spots on cheeks, webbed feet visible
5. **Ziggy Zebra** — white body with rainbow-tinted stripes (pastel pink, blue, green instead of black), small colorful mane

### Countable Objects (SVG)
Simple, bold, recognizable at small sizes (~40×40px each):
- **Apple**: red circle with green leaf, tiny brown stem
- **Star**: 5-pointed, sunny yellow with orange outline
- **Heart**: classic heart shape, coral pink
- **Balloon**: oval with string, cycles through palette colors
- **Fish**: simple tropical fish shape, sky blue with yellow fin
