# NumPals Rename Audit — "Math Scroll" & Character Name Mismatches

## App Name: "MathScroll" → "NumPals"

| File | Line(s) | Current | Change To |
|------|---------|---------|-----------|
| `index.html` | 7 | `<title>MathScroll</title>` | `<title>NumPals</title>` |
| `package.json` | 2 | `"name": "amplify-vite-react-template"` | `"name": "numpals"` |
| `src/hooks/useProgress.ts` | 4 | `'mathscroll-progress'` | `'numpals-progress'` |
| `src/hooks/useChildProfiles.ts` | 5 | `'mathscroll-children'` | `'numpals-children'` |
| `src/components/ParentDashboard.tsx` | 8 | `'mathscroll-parent-pin'` | `'numpals-parent-pin'` |
| `ARCHITECTURE.md` | 1, 405, 484, 547 | "MathScroll" references | "NumPals" |
| `.orchestrator/spec.md` | 1 | "MathScroll" in title | "NumPals" |

### localStorage Migration Note
Renaming storage keys will reset existing users' data. The Engineer should add a one-time migration that reads old `mathscroll-*` keys and copies them to `numpals-*` keys, then deletes the old ones.

---

## Character Names: Code vs. Brand Guide

The **brand guide** (`brand/brand-guide.md`, `brand/colors.json`) defines 5 characters:

| Brand Name | Animal  | Code Equivalent | In Code? |
|------------|---------|-----------------|----------|
| **Bloo**   | Bear    | `benny` (BennyBear) | Mismatched |
| **Sunny**  | Lion    | No equivalent | Missing |
| **Rosie**  | Bunny   | No equivalent | Missing |
| **Milo**   | Monkey  | No equivalent | Missing |
| **Pip**    | Penguin | No equivalent | Missing |

The **code** (`src/types.ts`, character components) defines 7 characters:

| Code Name | Animal   | Brand Equivalent | Status |
|-----------|----------|------------------|--------|
| `benny`   | Bear     | **Bloo** (Bear)  | Rename to `bloo` |
| `lulu`    | Ladybug  | None             | Remove or redesign |
| `ollie`   | Owl      | None             | Remove or redesign |
| `fifi`    | Frog     | None             | Remove or redesign |
| `ziggy`   | Zebra    | None             | Remove or redesign |
| `rex`     | Robot    | None             | Remove or redesign |
| `robo`    | Rocket   | None             | Remove or redesign |

### Files Requiring Character Rename/Replacement

| File | What to Change |
|------|---------------|
| `src/types.ts:5` | `CharacterName` type — replace 7 old names with `'bloo' \| 'sunny' \| 'rosie' \| 'milo' \| 'pip'` |
| `src/components/characters/BennyBear.tsx` | Rename to `BlooBear.tsx`, update component |
| `src/components/characters/LuluLadybug.tsx` | Replace with `SunnyLion.tsx` |
| `src/components/characters/OllieOwl.tsx` | Replace with `RosieBunny.tsx` |
| `src/components/characters/FifiFrog.tsx` | Replace with `MiloMonkey.tsx` |
| `src/components/characters/ZiggyZebra.tsx` | Replace with `PipPenguin.tsx` |
| `src/components/characters/RexRobot.tsx` | Remove (only 5 brand characters) |
| `src/components/characters/index.ts` | Update all exports |
| `src/components/characters/CharacterDisplay.tsx` | Update character map |
| `src/components/ParentDashboard.tsx:58-67` | Update `AVATAR_OPTIONS` array |
| `src/components/ProfileSwitcher.tsx` | Update any character references |
| `src/styles/theme.ts` | Update character-related color mappings if any |
| `brand/og-image.svg` | Already has "BLOO THE BEAR" and "SUNNY THE LION" — correct |
| `landing/index.html` | Already branded as NumPals — verify character names match |

### Recommendation

**Decision needed from product owner:** The brand guide has 5 characters but the code has 7. Two options:

1. **Adopt brand guide (recommended):** Replace all 7 code characters with the 5 brand characters (Bloo, Sunny, Rosie, Milo, Pip). This means new SVG artwork for Lion, Bunny, Monkey, Penguin.

2. **Expand brand guide:** Keep some existing characters alongside brand ones (e.g., keep the Bear as Bloo, add 4 new brand characters, keep 1-2 existing). This would require updating the brand guide.

Given the robot-themed art style in code vs. the animal-character style in the brand guide, option 1 is a clean break. The character SVGs would need to be redrawn either way.
