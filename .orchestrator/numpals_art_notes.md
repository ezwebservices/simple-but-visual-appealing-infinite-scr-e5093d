# NumPals v2 — Art Swap Notes

**Scope:** Full redraw of the six NumPal characters per `numpals_brand_bible.md`. The shared-plush body has been replaced with six distinct Nintendo-style silhouettes. Names are unchanged.

**Where it changed:** `src/components/characters/CharacterRig.tsx` was fully rewritten. The six wrapper files (`BlooBear.tsx`, `SunnyBug.tsx`, `RosieOwl.tsx`, `MiloFrog.tsx`, `PipZebra.tsx`, `RexRobot.tsx`) now carry updated docstrings but their public API (`mood`, `className`, `isSpeaking`) is unchanged — no engineer-side swap required beyond pulling this diff.

---

## Engineer contract — hooks that still work

Every hook CharacterDisplay.tsx's CSS targets is preserved at the same transform-origin across all six characters. Re-verify that CSS selectors still match after the swap — they should.

| Hook | Transform origin | What uses it |
|---|---|---|
| `.char-rig` (root) | — | CSS injection target for all animation rules |
| `.char-all` | `160 200` | dance-5 / spin `char-m5-all` scale+translate |
| `.char-tail` | `218 248` | dance idles, wiggle |
| `.char-left-leg` | `138 280` | cha-cha `char-m2-leg-l` |
| `.char-right-leg` | `182 280` | cha-cha `char-m2-leg-r` |
| `.char-torso` | `160 240` | breathe/body keyframes in every dance |
| `.char-head` | `160 130` | look/yawn/curious head keyframes |
| `.char-ears` | `160 70` | reserved — no animation targets it today but the group is kept for future use |
| `.char-left-arm` | `108 218` | dances 1–5, scratch, stretch |
| `.char-right-arm` | `212 218` | dances 1–5, wave, stretch |
| `.face-state` + `.face-state.default` | — | CSS opacity-swap drives every expression |
| `.eye-default` (+ `-l` / `-r`) | fill-box center | idle blink, yawn eyes |
| `.pupil-l` / `.pupil-r` | — | look / curious / yawn pupil translates |
| `.eye-wink-l` / `.eye-wink-r` / `.eye-wide` / `.eye-stars` | — | future mood hooks, rendered invisible by default |
| `.mouth-default` / `.mouth-open` / `.mouth-o` / `.mouth-smirk` / `.mouth-laugh` | — | dance mouth-swap, yawn, laugh |

Gradient/filter ID scheme is unchanged — each character prefixes `${characterId}-` on `body`, `bodyAccent`, `belly`, `cheek`, `iris`, `sclera`, `mouth`, `skin`, `glow`, `drop`. One new id: `skin` (humanoid face-tone) and `glow` (hero-prop glow). No caller references these outside this file.

**Eyes are anchored at (120,130) and (200,130); mouth at (160,180±)** on every character — identical to the v1 rig. This is what makes the cross-character CSS just keep working.

**What the Engineer should re-verify**
1. Run the app, trigger each idle variant (`breathe`, `look`, `yawn`, `scratch`, `wave`, `curious`, `wiggle`, `stretch`) on at least two characters — confirm the blink, head tilt, and pupil translate all still land on the eye region.
2. Trigger each dance (`dance-1` through `dance-5` + `spin`) on RexRobot and PipZebra — those two have the most divergent body geometry (mech segments, helmet+visor). Confirm nothing clips off the viewBox.
3. ProfileSwitcher, LessonCard, QuickLessonCard, UnlockProgress — all consume via `CharacterDisplay` and should light up automatically. Scan each screen once to confirm no hardcoded character colors elsewhere.

---

## Per-character changes

### BlooBear — Captain, Guardian of Counting *(Humanoid)*
**From:** plush blue bear. **To:** hooded hero-kid in an ice-blue bear-hoodie jacket.
- Hood carries the bear (two round ears up top + muzzle-brim peak); kid's face peeks through.
- Jacket has center zipper, kangaroo pocket, drawstrings with bead tips.
- **Tally Gauntlet** on the right hand — gold fingerless glove with a glowing "1" tag at the shoulder neck (Realm Mark).
- Cargo legs + chunky cream sneakers with gold toe-stripe.
- Palette tightened to Nintendo-saturation: hero #7AA5C7, accent gold #F0B43A, ink #1A2A3A.

### SunnyBug — Scout, Guardian of Patterns *(Creature)*
**From:** fox-in-plush-bug-clothing. **To:** proper rhino-beetle creature.
- Horn-stub on the head (hero asymmetry, tilted right) replaces the old fox ears.
- Beetle shell elytra with a visible seam down the middle; spot cluster forms a loose "3" silhouette = Realm Mark.
- Six-point insect leg set — thin forelegs as arms, planted hook-footed back legs.
- Cream underbelly band retained; cheeks muted (bugs don't blush).
- Palette: hero coral #E2806A, elytra spots #20110A, cream #FFF3DC.

### RosieOwl — Strategist, Guardian of Logic *(Humanoid)*
**From:** plush pink bunny. **To:** scholar-kid in an owl-feather cloak.
- Pointed hood with two tall owl-feather tufts (replaces bunny ears) — silhouette hook #1.
- Three-scallop feather cloak with brass clasp at throat.
- Right hand holds the **Ledger Lantern** — brass cage with a softly glowing "3" numeral (Realm Mark).
- Cloak-hem curl on the right back (tail group, hero asymmetry #2).
- Dark boots with brass buckle peek from under the cloak.
- Palette: hero dusty rose #E07898, plum shadow #9D5870, brass #D4A647.

### MiloFrog — Athlete, Guardian of Measurement *(Hybrid)*
**From:** plush green frog. **To:** amphibian track-kid, bipedal with athletic kit.
- Frog eye-bumps kept (now read as the "helmet" under a **white sweatband**); band tails fly right (hero asymmetry).
- Sleeveless jersey-tank with a bold "4" chest number = Realm Mark.
- Taped-finger fists (white wrap stripes across the green hands).
- **Leap-Meter Sneakers** with hot-pink #FF3D9A laces and matching magenta sweatband accent.
- No tail — the tail-group is a small back-bump so animations that target `.char-tail` still have something to move.
- Palette: hero kelly green #5BA868, chartreuse belly, pink accent.

### PipZebra — Speedster, Guardian of Sequencing *(Humanoid)*
**From:** plush grey panda. **To:** racer kid in a zebra-stripe jacket with visored helmet.
- Racing helmet with three vertical zebra stripes and a magenta visor band across the upper face (subtle tint over the eyes so expressions stay readable).
- Chin strap crossing the lower jaw.
- **Ponytail flying out the back** occupies the tail slot (hero asymmetry).
- Wavy four-stripe racing jacket with high collar and magenta chest badge containing the Realm Mark "7".
- Magenta glove cuffs + magenta boot-sole stripe.
- Palette: white + ink #0A0A12, magenta pop #FF3D9A.

### RexRobot — Inventor, Guardian of Shapes & Geometry *(Humanoid-mech)*
**From:** plush cyan robot. **To:** compact kid-shaped mech.
- **Bent antenna** tilted left off-center (hero asymmetry) with an amber LED tip.
- Boxy rounded helmet + white LED faceplate; three status LEDs above the face (amber/red/teal).
- Rectangular side-nubs as the "ears" of the helmet.
- Chest panel carries an amber **hexagon HUD** with "5" (Shapes-guardian Realm Mark).
- Segmented mech arms + legs with exposed elbow/knee wire rings and chunky boot feet.
- Small exhaust module in the tail slot (keeps `.char-tail` animatable).
- Iris gradient tuned toward amber so the face-state eyes read as LEDs without needing a separate expression path.
- Palette: hero cyan #6DC8DD, amber #FFC23D, dark slate #1A2A38.

---

## What was intentionally dropped

- **Fur pattern overlay** — removed everywhere. Gave the cast the plushy look the v2 bible explicitly moved away from. Still uses gradients for the cel-shade ramp, but the 5-stop soft-airbrush look is replaced with tighter 2–3 stop linears + explicit `palette.stroke` outlines (2.2–3px) per bible §4.
- **Belly-accent branch inside torso** (heart / flower / belly-spots / panda-patch). Those were v1 cuteness anchors; each character's new torso carries its own brand-bible accent (glove / elytra spots / brass clasp / jersey number / chest badge / HUD hex).
- **Bunny-tooth overlay on Rosie's mouth** — dropped with the bunny framing.
- **Fox snout curve on Sunny** — dropped with the fox framing.
- **Robot mouth-grille overlay** — dropped; Rex's face-state mouths now read on the LED faceplate directly.

The docstrings on the six wrapper files were updated to describe the v2 identities (not the v1 plush versions). No other product code referenced those strings.

---

## Known caveat to flag in review

`src/test/RobotCharacter.test.tsx` was already stale before this change — it asserts against a legacy `viewBox="0 0 200 240"` rig with gradient IDs (`rr-metal`, `bb-metal`, etc.) that haven't existed in the codebase for a while. This redraw doesn't fix those tests, but it doesn't make them any more broken either. `npm run build` (which is `tsc && vite build`, no vitest) passes cleanly.
