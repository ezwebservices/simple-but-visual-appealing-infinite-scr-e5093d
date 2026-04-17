# NumPals Character Bible

Franchise visual language for the NumPals cast. Authority document — all new art, merch, and marketing must conform. Anchored to the proven Bloo Bear and Rosie Owl designs.

---

## 1. What Makes Bloo and Rosie Work (Audit)

**Bloo Bear — Guardian of Counting**
- Humanoid kid inside an ice-blue bear-hood; rounded ears + muzzle crest form a unique silhouette that reads at 24px.
- Head-to-body ratio **1 : 1.5** (kid proportions, heroic not chibi).
- Hero hue `#7AA5C7`, 5-stop body ramp `#CFE5F5 → #3F6A8F`, cream belly, gold gauntlet `#F0B43A`.
- Narrative accessory (Tally Gauntlet + Realm Mark "1") — accessory tells you the character's **job**, not just their name.
- Standard eye rig: large oval, gradient iris, primary + secondary highlight, animated blink.

**Rosie Owl — Guardian of Logic**
- Scholar-kid in feathered cloak; two angled head-tufts give an immediately readable V-silhouette.
- Same 1 : 1.5 proportions; narrower torso for a more regal read.
- Hero hue `#E07898` (dusty rose), plum ramp, brass `#D4A647` accents.
- Ledger Lantern narrative prop: it glows with the number she's currently teaching — prop *does the pedagogy*.

**What transfers to the franchise:**
1. Kid-inside-a-creature-costume construction (not a creature, not a kid — both).
2. One signature silhouette shape on the head that survives at favicon size.
3. A narrative hero prop that reinforces their math domain.
4. Shared face grid + eye rig so the cast feels like one family.
5. Hero hue + 5-stop body ramp + complementary accent metal.

---

## 2. Nintendo-Tier Design Rules

**R1. Silhouette-first.** Black-fill the character at 32px. If you can't name them, redesign the head. Every character gets ONE signature head shape (ears, tufts, horn, visor, crest, antenna).

**R2. Shape language carries personality.**
- **Round / soft** → friendly, nurturing, starter-safe (Bloo, Rosie, new: Clementine).
- **Angular / wedge** → bold, fast, confident (new: Jax, Vex).
- **Geometric / modular** → logical, mechanical, precise (Rex, new: Glitch).
- **Organic asymmetric** → quirky, creative, wildcard (new: Moss).

One character = one dominant shape family. No mixing.

**R3. 1 : 1.5 proportions, always.** Head is one unit, body is 1.5. Eyes sit at 60% head height. Mouth at 80%. Never chibi, never teen — kid-hero.

**R4. The Three-Color Test.** At thumbnail size, each character must be readable with only **hero hue + belly cream + accent metal**. If you need more than three colors to ID them, the design is too busy.

**R5. Narrative Prop Rule.** Every Pal carries ONE hero prop that teaches their domain. No prop = no character. The prop must be gold, brass, or copper so the cast shares a "heroic metal" visual thread.

**R6. Face grid is sacred.** Eyes at viewBox `(120, 200)`, mouth at `(160, 180)`, viewBox `320×380`. Do not move. Consistency here is what makes the cast feel like *one IP*.

**R7. Readability at 24px.** Test every design at favicon scale before shipping. If the eye highlight disappears, thicken it. If the silhouette muddies, simplify the head.

---

## 3. Palette System

Every character gets a **Palette Struct**:

```
hero:     1 signature hue (saturation 55-70%, brightness 60-75%)
body:     5-stop ramp — highlight → hero → 2× shadow
belly:    4-stop cream/warm ramp (shared family: #FFF6E0 → #C8A35C)
accent:   heroic metal (gold / brass / copper / silver — ONE per char)
iris:     4-stop dark ramp tinted toward hero hue
cheek:    radial, hero hue at 40% opacity
stroke:   near-black tinted toward hero (never pure #000)
```

**Franchise palette slots (assigned):**

| Slot | Hue | Character | Shape family |
|---|---|---|---|
| Ice Blue | `#7AA5C7` | Bloo | Round |
| Dusty Rose | `#E07898` | Rosie | Round |
| Sunny Coral | `#E87B52` | Sunny (revised) | Round |
| Kelly Green | `#5BA868` | Milo | Round-athletic |
| Magenta/Mono | `#FF3D9A` | Pip (to replace) | Angular |
| Cyan Mech | `#2C7388` | Rex | Geometric |
| **Buttercream Yellow** | `#F5C842` | **Clementine** (new) | Round |
| **Ember Orange** | `#D94F2A` | **Jax** (new) | Angular |
| **Deep Violet** | `#6B4FA8` | **Vex** (new) | Angular |
| **Moss Green** | `#7B9B5E` | **Moss** (new) | Organic |
| **Pearl White** | `#E8ECF2` | **Glitch** (new) | Geometric |
| **Sea Teal** | `#3FA8A0` | **Coralie** (new) | Round |

Hues are spaced around the color wheel so no two Pals share a thumbnail read.

---

## 4. Eye & Face Construction

Locked rig (do not modify per character — only the **iris palette** changes):

- **Eye shape:** ellipse `rx=22, ry=26`, whites `#FEFEFE`.
- **Iris:** radial gradient, 4 stops, tinted toward hero hue.
- **Primary highlight:** ellipse `7×5` at upper-left of iris, pure white.
- **Secondary shine:** `r=2.4` white dot, lower-right of iris.
- **Blink:** animated scaleY 0→1 every 4-6s, desynced per character.
- **Pupil tracking:** 2px translate on emotion change.
- **Cheek:** radial blush, hero hue 40% opacity, below eye line.
- **Mouth states (5):** smile / open-O / laugh / smirk / soft-line. No new states — extend through eyebrow and head-tilt instead.

**Forbidden:** anime sparkles, slit pupils, full-black eyes, asymmetric irises, mouth above eye line.

---

## 5. Cast Roster — 6 New Characters

Designed to round out a **12-Pal ensemble** (Nintendo-cast scale — Mario has ~8 core, Kirby ~10, Pokémon starters ×3 per gen). Each new Pal fills a personality archetype the current cast lacks.

### 5.1 Clementine Cub — *Guardian of Addition*
- **Archetype:** Cheerful mentor / big-sister energy (the cast lacks warmth-authority).
- **Silhouette:** Humanoid kid in a honey-bee-striped cub hoodie; two small round ears + a single curled honey-drip forelock.
- **Shape family:** Round.
- **Hero hue:** `#F5C842` buttercream. Accent: copper `#C2763A`.
- **Narrative prop:** **Honeycomb Abacus** — copper-framed hex tiles that light up when two numbers combine.
- **Role:** First Pal after Bloo; teaches "joining" and sums ≤10.
- **Personality read:** warm, patient, slightly bossy. Think Peach-as-teacher, not princess.

### 5.2 Jax Fox — *Guardian of Subtraction*
- **Archetype:** Cocky rival / heart-of-gold trickster (cast has no rival energy).
- **Silhouette:** Angular fox-hood with two **sharp triangular ears** and a low tail-swoop visible behind the leg line. Single signature fang.
- **Shape family:** Angular wedge. Jaw is slightly pointed; shoulders squarer than Bloo.
- **Hero hue:** `#D94F2A` ember orange. Accent: brass `#B8862E`.
- **Narrative prop:** **Split-Blade Counter** — a brass folding ruler that "cuts" quantities.
- **Role:** Unlocks at mastery 8; teaches "taking away" and negatives-in-context.
- **Personality read:** smug smirk default mouth, arms crossed idle. Wario's charisma, Pikachu's proportions.

### 5.3 Vex Bat — *Guardian of Greater/Less Than*
- **Archetype:** Cool loner / goth-kid-with-a-heart (cast is currently very sunny — needs contrast).
- **Silhouette:** Pointed two-peak hood formed by folded bat wings behind the head; wing-tips visible as dual peaks above the ears. Cloak-like drape at hips.
- **Shape family:** Angular.
- **Hero hue:** `#6B4FA8` deep violet. Accent: silver `#BFC4CC`.
- **Narrative prop:** **Scale Pendulum** — silver chain with two weighted orbs that tilt to show inequality.
- **Role:** Teaches comparison, ordering, and "which is bigger."
- **Personality read:** half-lidded eyes, quiet smile. Not edgy-mean — *thoughtful cool*, like Meta Knight dialed to "friendly."

### 5.4 Moss Turtle — *Guardian of Place Value*
- **Archetype:** Slow sage / wise-fool (cast has no elder/philosopher vibe).
- **Silhouette:** Round shell on back forms a **distinct hump above the head line** — unique 2-bump silhouette. Tiny leaf sprig on shell center.
- **Shape family:** Organic / soft-round.
- **Hero hue:** `#7B9B5E` moss green. Accent: copper `#9B6B3A`.
- **Narrative prop:** **Stacking Stones** — three copper-banded river stones labeled 1 / 10 / 100.
- **Role:** Teaches tens, hundreds, and digit-position.
- **Personality read:** slow blink, soft wide smile, droopy eyelids. Yoshi-adjacent but older-soul.

### 5.5 Glitch Sprite — *Guardian of Equations*
- **Archetype:** Chaotic genius / pocket-AI sidekick (cast lacks a small/quick companion — every Nintendo cast has one: Chao, Navi, Pikachu-scale).
- **Silhouette:** **Smaller than the rest (~75% scale)** — intentional size-diversity for ensemble shots. Floating, no legs; pixelated "hair" crest of 3 square tufts.
- **Shape family:** Geometric / pixel.
- **Hero hue:** `#E8ECF2` pearl white, with cycling rainbow pixel flecks. Accent: prism holographic.
- **Narrative prop:** **Equation Prism** — floating cube that projects `=` glyphs.
- **Role:** Teaches equality, balance, and "solve for blank."
- **Personality read:** jittery idle animation, wide surprised eyes, excitable. The cast's Navi/Chao.

### 5.6 Coralie Axolotl — *Guardian of Fractions*
- **Archetype:** Gentle dreamer / artist (cast lacks a soft creative voice).
- **Silhouette:** Humanoid kid in axolotl hood with **three frilled gill-fronds** on each side of the head (six total, fan-like). Most distinctive head silhouette in the cast.
- **Shape family:** Round, flowing.
- **Hero hue:** `#3FA8A0` sea teal. Accent: rose-gold `#D99B7A`.
- **Narrative prop:** **Slice Shell** — rose-gold clamshell that opens into fraction wedges.
- **Role:** Late-game unlock; teaches halves, quarters, and part-of-whole.
- **Personality read:** closed-eye smile default, hums. Kirby's softness, Marina's curiosity.

---

## 6. Redesign / Replace List

Based on audit vs. the rules above:

| Character | Verdict | Action |
|---|---|---|
| **Bloo Bear** | ✅ Keep | Canonical. Reference design. |
| **Rosie Owl** | ✅ Keep | Canonical. Reference design. |
| **Sunny Bug** | ⚠️ **Revise** | Horn-stub reads as afterthought; spot-cluster lacks prop narrative. Give Sunny a **Pollen Pouch** hero prop (copper-clasped satchel that releases numbered pollen motes). Re-profile horn as a single bold curved horn for silhouette clarity. |
| **Milo Frog** | ⚠️ **Revise lightly** | Good silhouette, weak prop. Promote the tank-number to a **Measure Medal** (brass disc with ruler ticks) worn at chest. Keeps sporty read, adds franchise metal thread. |
| **Pip Zebra** | 🔴 **Redesign** | Visor occludes face (violates R1 — face is the character). Generic-racer read. **Replace with:** same personality (speedster / sequencing) but redesign as a **Cheetah hood** with goggles pushed *up* onto the forehead so eyes stay visible. Keep magenta hero hue. Rename optional; consider **"Pip Cheetah"** to retain brand equity. |
| **Rex Robot** | ⚠️ **Revise** | Box construction is coldest in the cast. Soften: round all corner radii by 4px, add a chest **Gear Sigil** prop (brass cog with shape glyphs), replace knee/elbow circles with visible copper rivets. Still reads mech, now reads *character*. |
| **Robo (legacy alias)** | 🗑️ **Remove** | Redundant alias to Rex. Deprecate in types; migrate any saved profiles forward. |

---

## 7. Roll-Out Priority

1. **Tier 1 (ship first):** Clementine, Jax — fill the two biggest ensemble gaps (warm mentor + rival) and pair naturally with Bloo/Rosie in marketing.
2. **Tier 2:** Pip redesign, Rex revision — fix existing weak reads before adding more cast.
3. **Tier 3:** Vex, Moss — expand tonal range (cool/quiet + elder).
4. **Tier 4:** Glitch, Coralie — ensemble specialists; introduce once core 8 are locked.
5. **Always:** every new design gets the 24px silhouette test, the three-color test, and a side-by-side sheet next to Bloo + Rosie before approval.

---

*Maintainer: Brand Strategist. Any deviation from rules R1–R7 requires a documented exception in this file.*
