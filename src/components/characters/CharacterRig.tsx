import type { CharacterMood } from '../../types';

/**
 * NumPals v2 — "Number Realm" cast.
 *
 * Six hero characters, each with its own Nintendo-grade silhouette —
 * not a shared plush body anymore. BlooBear is a hooded kid, SunnyBug is
 * a rhino-beetle, RosieOwl is a cloaked scholar-kid, MiloFrog is an
 * amphibian track-kid, PipZebra is a racer in a striped jacket, RexRobot
 * is a kid-shaped mech. See `.orchestrator/numpals_brand_bible.md`.
 *
 * Engineer contract — these are the ONLY things the app depends on:
 *   • viewBox = "0 0 320 380"
 *   • Group classes + transform-origins (keyed off CharacterDisplay.tsx):
 *       .char-all         160, 200
 *       .char-tail        218, 248
 *       .char-left-leg    138, 280
 *       .char-right-leg   182, 280
 *       .char-torso       160, 240
 *       .char-head        160, 130
 *       .char-ears        160, 70
 *       .char-left-arm    108, 218
 *       .char-right-arm   212, 218
 *   • Face-state groups (opacity swapped by CSS — all rendered, default shown):
 *       .face-state.default
 *       .eye-default + .eye-default-l / .eye-default-r (idle blink target)
 *       .pupil-l / .pupil-r (idle look/yawn/curious translate targets)
 *       .eye-wink-l / .eye-wink-r / .eye-wide / .eye-stars
 *       .mouth-default / .mouth-open / .mouth-o / .mouth-smirk / .mouth-laugh
 *   • Gradient/filter IDs are prefixed with characterId so multiple rigs
 *     can live on the same page (bloo-body, sunny-iris, rex-drop, etc.).
 *
 * Everything inside those groups is free to change per character.
 */

export interface CharacterPalette {
  /** 5-stop body gradient (kept for back-compat; we use stops 0,2,4 as the cel-shade ramp). */
  body: [string, string, string, string, string];
  /** 4-stop belly/secondary gradient (trim, under-feathers, jersey belly, white panels). */
  belly: [string, string, string, string];
  /** Cheek pink applied via radial gradient — softer for humanoids, crisper for creatures. */
  cheek: string;
  /** Iris: pupil-core → inner → mid → rim. */
  iris: [string, string, string, string];
  /** Primary outline ink + stitching color. */
  stroke: string;
  /** Accent color — the character's "hero prop" tint (gauntlet, laces, visor stripe, etc.). */
  padAccent: string;
}

interface RigProps {
  palette: CharacterPalette;
  characterId: string;
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

/* ────────────────────────── shared face-state helper ──────────────────────────
 * Eye centers at (120,130)/(200,130) and mouth at (160,180) stay locked across
 * every character so CSS-driven blinks, pupil translates, and mouth-swap
 * animations keep working without per-character CSS overrides. Character heads
 * are all drawn around this fixed face grid.
 */
function FaceStates({ id }: { id: (s: string) => string }) {
  return (
    <>
      {/* LEFT EYE */}
      <g className="face-state default eye-default eye-default-l">
        <ellipse cx="120" cy="130" rx="22" ry="26" fill={`url(#${id('sclera')})`} stroke="#111" strokeWidth="1.6" />
        <g className="pupil-l">
          <circle cx="120" cy="134" r="16" fill={`url(#${id('iris')})`} />
          <circle cx="120" cy="136" r="6" fill="#0A0500" />
          <ellipse cx="125" cy="126" rx="7" ry="5" fill="white" />
          <circle cx="114" cy="142" r="2.4" fill="white" opacity="0.9" />
        </g>
      </g>
      <g className="face-state eye-wink-l">
        <path d="M100,130 Q120,144 140,130" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="face-state eye-wide">
        <ellipse cx="120" cy="128" rx="24" ry="29" fill="#FFFFFF" stroke="#111" strokeWidth="1.6" />
        <circle cx="120" cy="134" r="18" fill={`url(#${id('iris')})`} />
        <circle cx="120" cy="136" r="7" fill="#0A0500" />
        <circle cx="125" cy="126" r="8" fill="white" />
      </g>
      <g className="face-state eye-stars">
        <path
          d="M120,113 L124,126 L137,126 L126.5,134 L130,147 L120,139 L110,147 L113.5,134 L103,126 L116,126 Z"
          fill="#FFD93D" stroke="#111" strokeWidth="1.4" strokeLinejoin="round"
        />
      </g>

      {/* RIGHT EYE */}
      <g className="face-state default eye-default eye-default-r">
        <ellipse cx="200" cy="130" rx="22" ry="26" fill={`url(#${id('sclera')})`} stroke="#111" strokeWidth="1.6" />
        <g className="pupil-r">
          <circle cx="200" cy="134" r="16" fill={`url(#${id('iris')})`} />
          <circle cx="200" cy="136" r="6" fill="#0A0500" />
          <ellipse cx="205" cy="126" rx="7" ry="5" fill="white" />
          <circle cx="194" cy="142" r="2.4" fill="white" opacity="0.9" />
        </g>
      </g>
      <g className="face-state eye-wink-r">
        <path d="M180,130 Q200,144 220,130" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="face-state eye-wide">
        <ellipse cx="200" cy="128" rx="24" ry="29" fill="#FFFFFF" stroke="#111" strokeWidth="1.6" />
        <circle cx="200" cy="134" r="18" fill={`url(#${id('iris')})`} />
        <circle cx="200" cy="136" r="7" fill="#0A0500" />
        <circle cx="205" cy="126" r="8" fill="white" />
      </g>
      <g className="face-state eye-stars">
        <path
          d="M200,113 L204,126 L217,126 L206.5,134 L210,147 L200,139 L190,147 L193.5,134 L183,126 L196,126 Z"
          fill="#FFD93D" stroke="#111" strokeWidth="1.4" strokeLinejoin="round"
        />
      </g>

      {/* MOUTH STATES */}
      <g className="face-state default mouth-default">
        <path d="M144,178 Q160,194 176,178" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <g className="face-state mouth-open">
        <ellipse cx="160" cy="186" rx="12" ry="13" fill={`url(#${id('mouth')})`} stroke="#111" strokeWidth="1.6" />
        <ellipse cx="160" cy="192" rx="7" ry="5" fill="#FF6B6B" />
      </g>
      <g className="face-state mouth-o">
        <circle cx="160" cy="186" r="8" fill={`url(#${id('mouth')})`} stroke="#111" strokeWidth="1.6" />
        <circle cx="160" cy="187" r="4" fill="#FF6B6B" />
      </g>
      <g className="face-state mouth-smirk">
        <path d="M146,184 Q160,174 176,190" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <g className="face-state mouth-laugh">
        <path d="M140,178 Q160,206 180,178 Q176,200 160,202 Q144,200 140,178 Z"
              fill={`url(#${id('mouth')})`} stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="148" y="178" width="24" height="3" rx="1" fill="#FFFFFF" />
        <ellipse cx="160" cy="194" rx="7" ry="2" fill="#FF8FA3" />
      </g>
    </>
  );
}

/* ────────────────────────── shared defs ────────────────────────── */
function Defs({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  return (
    <defs>
      <linearGradient id={id('body')} x1="30%" y1="10%" x2="70%" y2="95%">
        <stop offset="0%"  stopColor={palette.body[1]} />
        <stop offset="55%" stopColor={palette.body[2]} />
        <stop offset="100%" stopColor={palette.body[4]} />
      </linearGradient>
      <linearGradient id={id('bodyAccent')} x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%"  stopColor={palette.body[0]} />
        <stop offset="100%" stopColor={palette.body[3]} />
      </linearGradient>
      <linearGradient id={id('belly')} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%"  stopColor={palette.belly[0]} />
        <stop offset="70%" stopColor={palette.belly[1]} />
        <stop offset="100%" stopColor={palette.belly[2]} />
      </linearGradient>
      <radialGradient id={id('cheek')} cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor={palette.cheek} stopOpacity="0.85" />
        <stop offset="70%" stopColor={palette.cheek} stopOpacity="0.35" />
        <stop offset="100%" stopColor={palette.cheek} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={id('iris')} cx="50%" cy="50%" r="55%">
        <stop offset="0%"  stopColor={palette.iris[0]} />
        <stop offset="55%" stopColor={palette.iris[1]} />
        <stop offset="90%" stopColor={palette.iris[2]} />
        <stop offset="100%" stopColor={palette.iris[3]} />
      </radialGradient>
      <linearGradient id={id('sclera')} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%"  stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E9EEF5" />
      </linearGradient>
      <radialGradient id={id('mouth')} cx="50%" cy="45%" r="65%">
        <stop offset="0%"  stopColor="#6A1010" />
        <stop offset="100%" stopColor="#2D0404" />
      </radialGradient>
      <linearGradient id={id('skin')} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%"  stopColor="#FFE3CF" />
        <stop offset="100%" stopColor="#F2C7A6" />
      </linearGradient>
      <filter id={id('drop')} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" />
        <feOffset dx="0" dy="3" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.32" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor={palette.padAccent} stopOpacity="1" />
        <stop offset="70%" stopColor={palette.padAccent} stopOpacity="0.6" />
        <stop offset="100%" stopColor={palette.padAccent} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  BLOOBEAR — Humanoid hero-kid in a bear-hooded ice-blue jacket.
 *  Hood carries the bear — ears up top, muzzle forming the brim.
 *  Tally Gauntlet on right hand carries the Realm Mark "1".
 * ══════════════════════════════════════════════════════════════════ */
function BlooArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  return (
    <>
      {/* TAIL — short tuft of the bear hood at the back of the hoodie */}
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        <path d="M218,238 Q238,240 236,260 Q228,262 220,254 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      </g>

      {/* LEGS — dark cargo pants + chunky sneaker */}
      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M122,268 L118,340 L156,340 L152,268 Z"
              fill="#243B55" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="112" y="338" width="46" height="18" rx="6" fill="#F4F0E4" stroke={ink} strokeWidth="2" />
        <rect x="112" y="344" width="46" height="6" fill={palette.padAccent} opacity="0.85" />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M168,268 L164,340 L202,340 L198,268 Z"
              fill="#243B55" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="158" y="338" width="46" height="18" rx="6" fill="#F4F0E4" stroke={ink} strokeWidth="2" />
        <rect x="158" y="344" width="46" height="6" fill={palette.padAccent} opacity="0.85" />
      </g>

      {/* TORSO — zipped hoodie with pocket, drawstrings, and Realm number on chest */}
      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        <path d="M96,208 Q100,200 118,198 L202,198 Q220,200 224,208 L228,286 Q214,296 160,296 Q106,296 92,286 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        {/* shoulder highlight (upper-left light source) */}
        <path d="M102,210 Q114,202 140,202 L140,224 Q118,226 104,234 Z"
              fill="#FFFFFF" opacity="0.16" />
        {/* zipper line */}
        <line x1="160" y1="202" x2="160" y2="290" stroke={ink} strokeWidth="1.6" strokeDasharray="3 2" />
        {/* zipper pull */}
        <rect x="157" y="200" width="6" height="10" rx="1.5" fill={palette.padAccent} stroke={ink} strokeWidth="1" />
        {/* kangaroo pocket */}
        <path d="M120,250 Q160,266 200,250 L196,278 Q160,286 124,278 Z"
              fill={palette.body[3]} stroke={ink} strokeWidth="2" opacity="0.9" />
        {/* drawstrings */}
        <path d="M126,202 Q122,220 118,236" stroke={palette.belly[0]} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M194,202 Q198,220 202,236" stroke={palette.belly[0]} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="118" cy="238" r="3" fill={palette.belly[1]} stroke={ink} strokeWidth="1" />
        <circle cx="202" cy="238" r="3" fill={palette.belly[1]} stroke={ink} strokeWidth="1" />
      </g>

      {/* HEAD — bear-hood (ears) + muzzle-brim + kid face inside */}
      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Bear ears on top of the hood */}
          <circle cx="92"  cy="58" r="22" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" />
          <circle cx="92"  cy="58" r="11" fill={palette.belly[0]} stroke={ink} strokeWidth="1.6" />
          <circle cx="228" cy="58" r="22" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" />
          <circle cx="228" cy="58" r="11" fill={palette.belly[0]} stroke={ink} strokeWidth="1.6" />
        </g>
        {/* Hood shell — bear-shaped silhouette wrapping the face */}
        <path d="M60,130 Q56,72 108,56 Q160,44 212,56 Q264,72 260,130 Q260,184 220,206 L100,206 Q60,184 60,130 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        {/* Kid's face (skin-tone oval) peeking through the hood */}
        <ellipse cx="160" cy="138" rx="70" ry="66" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2.4" />
        {/* Bear-muzzle "brim" at the top of the hood, above the forehead */}
        <path d="M110,90 Q160,72 210,90 Q212,110 160,110 Q108,110 110,90 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.2" />
        <circle cx="160" cy="92" r="5" fill="#111" />
        {/* Cheeks */}
        <circle cx="100" cy="158" r="13" fill={`url(#${id('cheek')})`} />
        <circle cx="220" cy="158" r="13" fill={`url(#${id('cheek')})`} />
        {/* Hair tuft peeking out of hood */}
        <path d="M144,78 Q160,68 176,78 Q168,82 160,82 Q152,82 144,78 Z" fill="#2B1A10" />
        {/* Realm Mark "1" on shoulder — a small glowing numeral tag at the hood neck */}
        <g transform="translate(142 198)">
          <circle r="11" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
                fontSize="14" fill={palette.padAccent}>1</text>
        </g>
        <FaceStates id={id} />
        {/* Nose — small kid nose, not a bear snout (bear reads from the hood) */}
        <ellipse cx="160" cy="160" rx="3" ry="2" fill="#8E5A3E" opacity="0.8" />
      </g>

      {/* ARMS — hoodie sleeves + hands (left: kid hand, right: Tally Gauntlet) */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M86,208 Q80,260 94,300 Q108,304 122,300 Q130,260 128,212 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="108" cy="302" r="12" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M192,212 Q190,260 198,300 Q212,304 226,300 Q240,260 234,208 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        {/* Tally Gauntlet — gold fingerless glove */}
        <circle cx="212" cy="302" r="13" fill={palette.padAccent} stroke={ink} strokeWidth="2" />
        <rect x="203" y="296" width="18" height="3" fill="#FFFFFF" opacity="0.9" />
        <circle cx="212" cy="302" r="6" fill="#FFF8D6" />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  SUNNYBUG — Rhino-beetle creature. Horn stub on head, elytra shell
 *  split down the back, thin articulated insect legs. Realm Mark is
 *  the number-shaped spot cluster on the elytra.
 * ══════════════════════════════════════════════════════════════════ */
function SunnyArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const spot = '#20110A';
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Elytra tail-points (right-back shell edge) */}
        <path d="M212,256 L232,260 L226,276 L214,270 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
      </g>

      {/* LEGS — back insect legs, hooked feet */}
      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M128,268 L112,306 L104,340 L126,340 L138,306 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M104,340 Q98,344 102,350 L130,350 Z" fill={spot} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M192,268 L208,306 L216,340 L194,340 L182,306 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M216,340 Q222,344 218,350 L190,350 Z" fill={spot} stroke={ink} strokeWidth="2" />
      </g>

      {/* TORSO — beetle shell (elytra split) */}
      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        <ellipse cx="160" cy="244" rx="80" ry="56"
                 fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" />
        {/* Elytra seam */}
        <line x1="160" y1="196" x2="160" y2="298" stroke={ink} strokeWidth="2.6" />
        {/* Highlight crescent */}
        <path d="M96,220 Q120,200 156,202 L156,238 Q124,240 100,256 Z" fill="#FFFFFF" opacity="0.2" />
        {/* Spot cluster — a "3" silhouette = Realm Mark for Patterns guardian */}
        <circle cx="126" cy="228" r="7" fill={spot} />
        <circle cx="194" cy="228" r="7" fill={spot} />
        <circle cx="134" cy="260" r="6" fill={spot} />
        <circle cx="186" cy="260" r="6" fill={spot} />
        <circle cx="160" cy="276" r="5" fill={spot} />
        {/* Cream underbelly band */}
        <path d="M112,270 Q160,292 208,270 L202,294 Q160,304 118,294 Z"
              fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="1.8" opacity="0.8" />
      </g>

      {/* HEAD — small beetle head with horn-stub and compound eyes */}
      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Horn-stub (the hero asymmetry — tilted slightly right) */}
          <path d="M150,60 Q162,28 176,34 Q180,52 168,70 Z"
                fill={palette.body[4]} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M160,48 Q168,42 174,46" stroke="#FFFFFF" strokeWidth="1.6" fill="none" opacity="0.7" />
        </g>
        {/* Head carapace — broader than tall */}
        <ellipse cx="160" cy="132" rx="86" ry="72"
                 fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" />
        {/* Shine band */}
        <ellipse cx="140" cy="94" rx="52" ry="16" fill="#FFFFFF" opacity="0.32" />
        {/* Mandible hint under mouth */}
        <path d="M140,196 Q146,206 152,196" stroke={ink} strokeWidth="2" fill="none" />
        <path d="M168,196 Q174,206 180,196" stroke={ink} strokeWidth="2" fill="none" />
        {/* Cheeks (muted — bugs don't blush) */}
        <circle cx="92" cy="156" r="10" fill={`url(#${id('cheek')})`} opacity="0.6" />
        <circle cx="228" cy="156" r="10" fill={`url(#${id('cheek')})`} opacity="0.6" />
        <FaceStates id={id} />
      </g>

      {/* ARMS — thin articulated insect forelegs */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M100,208 Q84,240 78,286 Q90,300 104,294 Q110,260 118,216 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="90" cy="292" r="8" fill={spot} stroke={ink} strokeWidth="1.8" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M220,208 Q236,240 242,286 Q230,300 216,294 Q210,260 202,216 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="230" cy="292" r="8" fill={spot} stroke={ink} strokeWidth="1.8" />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  ROSIEOWL — Kid scholar-knight in an owl-feather cloak. Hooded with
 *  two tall feather-tufts, brass-clasped cloak, Ledger Lantern in the
 *  right hand. Realm Mark glows on the lantern.
 * ══════════════════════════════════════════════════════════════════ */
function RosieArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const plum = palette.body[4];
  const brass = '#D4A647';
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Cloak hem curl — the hero asymmetry */}
        <path d="M210,250 Q246,258 244,288 Q234,294 222,282 Q214,272 210,260 Z"
              fill={`url(#${id('bodyAccent')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M216,258 Q234,266 232,282" stroke={palette.belly[0]} strokeWidth="1.4" fill="none" opacity="0.7" />
      </g>

      {/* LEGS — boots peeking out from cloak */}
      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <rect x="124" y="288" width="28" height="52" rx="8" fill="#4A2A38" stroke={ink} strokeWidth="2.2" />
        <rect x="118" y="332" width="40" height="14" rx="4" fill="#2A1420" stroke={ink} strokeWidth="2" />
        <rect x="124" y="296" width="6" height="10" fill={brass} />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <rect x="168" y="288" width="28" height="52" rx="8" fill="#4A2A38" stroke={ink} strokeWidth="2.2" />
        <rect x="162" y="332" width="40" height="14" rx="4" fill="#2A1420" stroke={ink} strokeWidth="2" />
        <rect x="190" y="296" width="6" height="10" fill={brass} />
      </g>

      {/* TORSO — feathered cloak wrap */}
      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        <path d="M88,208 Q96,198 124,196 L196,196 Q224,198 232,208 L238,300 Q200,310 160,310 Q120,310 82,300 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        {/* Feather layers — three overlapping scallops */}
        <path d="M88,236 Q110,248 132,236 Q154,252 176,236 Q198,250 220,236 L232,260 Q160,276 88,260 Z"
              fill={plum} stroke={ink} strokeWidth="2" strokeLinejoin="round" opacity="0.95" />
        <path d="M88,266 Q110,278 132,266 Q154,282 176,266 Q198,280 220,266 L232,292 Q160,306 88,292 Z"
              fill={palette.body[3]} stroke={ink} strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
        {/* Brass clasp at throat */}
        <circle cx="160" cy="208" r="9" fill={brass} stroke={ink} strokeWidth="2" />
        <circle cx="160" cy="208" r="4" fill="#F8E2A8" />
        <path d="M151,214 L169,214 L166,226 L154,226 Z" fill={brass} stroke={ink} strokeWidth="1.6" />
        {/* Under-feather cream band */}
        <path d="M116,228 Q160,238 204,228 L204,242 Q160,252 116,242 Z"
              fill={`url(#${id('belly')})`} opacity="0.85" />
      </g>

      {/* HEAD — hooded cloak with owl-tufts, kid face */}
      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Tall owl-feather tufts (pointed, angled outward) */}
          <path d="M98,78 Q84,34 112,16 Q120,48 124,80 Z"
                fill={plum} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M222,78 Q236,34 208,16 Q200,48 196,80 Z"
                fill={plum} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        </g>
        {/* Hood shell */}
        <path d="M60,138 Q56,82 110,62 Q160,52 210,62 Q264,82 260,138 Q258,184 220,200 L100,200 Q62,184 60,138 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" strokeLinejoin="round" />
        {/* Feather fringe inside hood */}
        <path d="M86,124 Q100,112 114,124 Q128,112 142,124 Q156,112 170,124 Q184,112 198,124 Q212,112 226,124 Q240,112 234,140 L86,140 Z"
              fill={palette.belly[2]} stroke={ink} strokeWidth="1.6" opacity="0.6" />
        {/* Kid face */}
        <ellipse cx="160" cy="144" rx="66" ry="60" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2.4" />
        {/* Cheeks */}
        <circle cx="104" cy="162" r="12" fill={`url(#${id('cheek')})`} />
        <circle cx="216" cy="162" r="12" fill={`url(#${id('cheek')})`} />
        {/* Side-swept bangs */}
        <path d="M104,108 Q140,92 170,96 Q160,114 132,116 Q112,118 104,108 Z"
              fill="#3A1C26" stroke={ink} strokeWidth="1.6" />
        <FaceStates id={id} />
        <ellipse cx="160" cy="162" rx="3" ry="2" fill="#8E5A3E" opacity="0.8" />
      </g>

      {/* ARMS — cloak sleeves; right hand holds the Ledger Lantern */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M84,208 Q76,260 86,300 Q102,306 120,300 Q128,260 124,212 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="102" cy="302" r="11" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M196,212 Q194,260 200,300 Q216,306 234,300 Q242,260 236,208 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="218" cy="300" r="10" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
        {/* Ledger Lantern — brass cage with a softly glowing numeral */}
        <line x1="226" y1="292" x2="244" y2="244" stroke={brass} strokeWidth="2.4" />
        <rect x="234" y="248" width="26" height="30" rx="3" fill="#F8E2A8" stroke={ink} strokeWidth="2" />
        <rect x="230" y="242" width="34" height="8" rx="2" fill={brass} stroke={ink} strokeWidth="2" />
        <rect x="232" y="278" width="30" height="6" rx="2" fill={brass} stroke={ink} strokeWidth="2" />
        <circle cx="247" cy="263" r="12" fill={`url(#${id('glow')})`} />
        <text x="247" y="267" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
              fontSize="12" fill="#6A2438">3</text>
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  MILOFROG — Hybrid amphibian track-kid. Frog head + sweatband, tank
 *  jersey, taped-finger arms, frog legs into hot-pink-laced sneakers.
 *  Realm Mark is the number on his jersey chest.
 * ══════════════════════════════════════════════════════════════════ */
function MiloArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const band = '#FFFFFF';
  const lace = '#FF3D9A';
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* No tail — small back-bump of belly color (frogs don't have tails) */}
        <ellipse cx="220" cy="256" rx="10" ry="6" fill={palette.belly[1]} stroke={ink} strokeWidth="1.8" />
      </g>

      {/* LEGS — frog legs into chunky sneakers */}
      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M120,268 Q108,294 114,320 L150,320 Q156,294 152,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        {/* Sneaker */}
        <path d="M104,318 Q108,316 152,316 L162,340 Q138,348 102,344 Z"
              fill="#FFFFFF" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M104,330 L162,330" stroke={lace} strokeWidth="2.4" />
        <path d="M118,322 L130,332 M132,322 L144,332" stroke={lace} strokeWidth="2" />
        <rect x="142" y="318" width="14" height="4" fill={palette.padAccent} />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M168,268 Q164,294 170,320 L206,320 Q212,294 200,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M158,318 Q162,316 206,316 L216,340 Q192,348 156,344 Z"
              fill="#FFFFFF" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M158,330 L216,330" stroke={lace} strokeWidth="2.4" />
        <path d="M172,322 L184,332 M186,322 L198,332" stroke={lace} strokeWidth="2" />
        <rect x="164" y="318" width="14" height="4" fill={palette.padAccent} />
      </g>

      {/* TORSO — sleeveless athletic tank with chest number */}
      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        {/* Frog torso under shirt (darker green sides) */}
        <ellipse cx="160" cy="246" rx="68" ry="52"
                 fill={palette.body[4]} stroke={ink} strokeWidth="2.4" />
        {/* Cream belly patch */}
        <ellipse cx="160" cy="258" rx="50" ry="40" fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="1.8" />
        {/* Tank top overlay */}
        <path d="M104,212 Q112,204 132,204 L188,204 Q208,204 216,212 L218,270 Q160,278 102,270 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Armholes */}
        <path d="M104,212 Q100,228 108,240 Q118,232 118,216 Z" fill={palette.body[4]} stroke={ink} strokeWidth="1.8" />
        <path d="M216,212 Q220,228 212,240 Q202,232 202,216 Z" fill={palette.body[4]} stroke={ink} strokeWidth="1.8" />
        {/* Chest number (Realm Mark) */}
        <text x="160" y="250" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
              fontSize="32" fill={band} stroke={ink} strokeWidth="1.6">4</text>
      </g>

      {/* HEAD — frog face with sweatband */}
      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Frog eye-bumps (the part of the head above the eyeline) */}
          <ellipse cx="108" cy="72" rx="26" ry="22" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" />
          <ellipse cx="212" cy="72" rx="26" ry="22" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" />
          {/* Bump shine */}
          <ellipse cx="102" cy="64" rx="8" ry="5" fill="#FFFFFF" opacity="0.55" />
          <ellipse cx="206" cy="64" rx="8" ry="5" fill="#FFFFFF" opacity="0.55" />
          {/* Sweatband wrapping the forehead */}
          <path d="M60,90 Q160,80 260,90 L260,104 Q160,96 60,104 Z"
                fill={band} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="60" y="94" width="200" height="4" fill={lace} />
          {/* Band tails flying right (hero asymmetry) */}
          <path d="M254,100 Q284,96 280,118 Q264,118 252,108 Z"
                fill={band} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <rect x="258" y="104" width="20" height="3" fill={lace} />
        </g>
        {/* Head base (the lower face) */}
        <ellipse cx="160" cy="142" rx="88" ry="62" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.6" />
        {/* Cream mouth-jaw band */}
        <path d="M80,170 Q160,210 240,170 Q232,198 160,204 Q88,198 80,170 Z"
              fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="1.8" />
        <circle cx="86" cy="156" r="11" fill={`url(#${id('cheek')})`} />
        <circle cx="234" cy="156" r="11" fill={`url(#${id('cheek')})`} />
        <FaceStates id={id} />
        {/* Frog nostril dots */}
        <circle cx="152" cy="160" r="1.8" fill={ink} opacity="0.8" />
        <circle cx="168" cy="160" r="1.8" fill={ink} opacity="0.8" />
      </g>

      {/* ARMS — frog arms with taped fingers */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M102,208 Q86,238 84,288 Q94,304 110,302 Q122,262 124,214 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        {/* Taped fingers */}
        <circle cx="96" cy="302" r="10" fill={palette.body[2]} stroke={ink} strokeWidth="2" />
        <path d="M86,298 Q92,302 96,306 M100,296 Q104,302 106,308" stroke={band} strokeWidth="2" fill="none" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M218,208 Q234,238 236,288 Q226,304 210,302 Q198,262 196,214 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <circle cx="224" cy="302" r="10" fill={palette.body[2]} stroke={ink} strokeWidth="2" />
        <path d="M214,298 Q220,302 224,306 M228,296 Q232,302 234,308" stroke={band} strokeWidth="2" fill="none" />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PIPZEBRA — Humanoid racer kid. Zebra-stripe racing jacket, visored
 *  helmet, ponytail flying out the back. Magenta visor stripe + glove
 *  accents. Realm Mark is the numeral on the chest.
 * ══════════════════════════════════════════════════════════════════ */
function PipArt({ palette: _palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = '#0A0A12';
  const stripe = '#0A0A12';
  const magenta = '#FF3D9A';
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Ponytail flying out the back-right */}
        <path d="M212,230 Q260,226 264,260 Q256,278 232,270 Q218,258 212,246 Z"
              fill={stripe} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M224,234 Q252,238 254,258" stroke="#FFFFFF" strokeWidth="1.6" fill="none" opacity="0.35" />
        <circle cx="218" cy="230" r="5" fill={magenta} stroke={ink} strokeWidth="1.6" />
      </g>

      {/* LEGS — racing pants + track boots */}
      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M120,268 L114,332 L154,332 L154,268 Z"
              fill="#FFFFFF" stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M128,268 L124,332 M138,268 L136,332 M148,268 L148,332"
              stroke={stripe} strokeWidth="4" />
        <rect x="110" y="330" width="48" height="20" rx="5" fill={stripe} stroke={ink} strokeWidth="2" />
        <rect x="110" y="344" width="48" height="4" fill={magenta} />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M166,268 L166,332 L206,332 L200,268 Z"
              fill="#FFFFFF" stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M172,268 L172,332 M182,268 L184,332 M192,268 L196,332"
              stroke={stripe} strokeWidth="4" />
        <rect x="162" y="330" width="48" height="20" rx="5" fill={stripe} stroke={ink} strokeWidth="2" />
        <rect x="162" y="344" width="48" height="4" fill={magenta} />
      </g>

      {/* TORSO — zebra-stripe racing jacket */}
      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        <path d="M94,210 Q100,198 122,196 L198,196 Q220,198 226,210 L230,290 Q214,300 160,300 Q106,300 90,290 Z"
              fill="#FFFFFF" stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        {/* Wavy zebra stripes */}
        <path d="M100,218 Q120,226 104,246 Q120,260 100,276" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M134,204 Q124,224 140,244 Q126,264 136,290" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M186,204 Q196,224 180,244 Q196,264 184,290" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M220,218 Q200,226 216,246 Q200,260 220,276" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* High collar */}
        <path d="M126,196 Q160,208 194,196 L198,212 Q160,224 122,212 Z"
              fill={stripe} stroke={ink} strokeWidth="2" />
        {/* Zipper */}
        <line x1="160" y1="208" x2="160" y2="294" stroke={ink} strokeWidth="1.8" strokeDasharray="3 2" />
        {/* Chest badge — Realm Mark */}
        <rect x="148" y="232" width="24" height="24" rx="4" fill={magenta} stroke={ink} strokeWidth="2" />
        <text x="160" y="252" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
              fontSize="18" fill="#FFFFFF">7</text>
      </g>

      {/* HEAD — racing helmet with visor, kid face below */}
      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Helmet dome */}
          <path d="M70,116 Q62,56 120,42 Q160,34 200,42 Q258,56 250,116 Z"
                fill="#FFFFFF" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          {/* Helmet stripes (zebra motif on the dome) */}
          <path d="M102,44 Q108,76 96,114" stroke={stripe} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M160,38 Q164,76 160,112" stroke={stripe} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M218,44 Q212,76 224,114" stroke={stripe} strokeWidth="7" fill="none" strokeLinecap="round" />
        </g>
        {/* Visor window area — kid face behind */}
        <rect x="74" y="108" width="172" height="58" rx="14" fill="#1A1A22" stroke={ink} strokeWidth="2.6" />
        {/* Visor magenta stripe */}
        <rect x="74" y="98" width="172" height="10" fill={magenta} stroke={ink} strokeWidth="2" />
        {/* Visible face through visor — pull the skin down so eye-states sit on skin */}
        <ellipse cx="160" cy="148" rx="76" ry="52" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2.4" />
        {/* Chin strap */}
        <path d="M80,162 Q160,196 240,162" stroke={stripe} strokeWidth="5" fill="none" />
        {/* Cheeks */}
        <circle cx="96" cy="164" r="10" fill={`url(#${id('cheek')})`} />
        <circle cx="224" cy="164" r="10" fill={`url(#${id('cheek')})`} />
        {/* Glassy visor tint across the upper face — subtle so eyes stay readable */}
        <rect x="74" y="108" width="172" height="36" rx="14" fill={magenta} opacity="0.1" />
        <FaceStates id={id} />
      </g>

      {/* ARMS — jacket sleeves with magenta glove cuffs */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M84,210 Q78,260 92,300 Q108,304 122,300 Q128,260 124,214 Z"
              fill="#FFFFFF" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M94,220 Q102,252 98,286" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="108" cy="302" r="12" fill={stripe} stroke={ink} strokeWidth="2" />
        <rect x="96" y="294" width="24" height="5" fill={magenta} />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M196,214 Q192,260 198,300 Q212,304 228,300 Q242,260 236,210 Z"
              fill="#FFFFFF" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M222,220 Q216,252 222,286" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="212" cy="302" r="12" fill={stripe} stroke={ink} strokeWidth="2" />
        <rect x="200" y="294" width="24" height="5" fill={magenta} />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  REXROBOT — Kid-shaped mech. Boxy helmet, one bent antenna, LED
 *  faceplate, chest HUD (hexagon), segmented mech limbs with exposed
 *  elbow/knee joints. Realm Mark is the numeral inside the chest hex.
 * ══════════════════════════════════════════════════════════════════ */
function RexArt({ palette: _palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = '#0F2A36';
  const dark = '#1A2A38';
  const amber = '#FFC23D';
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Exhaust/jet unit on back */}
        <rect x="212" y="240" width="28" height="16" rx="4" fill={dark} stroke={ink} strokeWidth="2.2" />
        <circle cx="238" cy="248" r="5" fill={amber} stroke={ink} strokeWidth="1.6" />
      </g>

      {/* LEGS — mech legs with exposed knee-wires */}
      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <rect x="120" y="268" width="34" height="30" rx="5" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        {/* Exposed wiring at knee */}
        <circle cx="138" cy="302" r="5" fill={dark} stroke={ink} strokeWidth="1.6" />
        <rect x="122" y="306" width="30" height="24" rx="4" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        {/* Boot */}
        <path d="M116,330 L158,330 L162,350 Q138,356 114,350 Z"
              fill={dark} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="122" y="276" width="30" height="4" fill={dark} opacity="0.6" />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <rect x="166" y="268" width="34" height="30" rx="5" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        <circle cx="182" cy="302" r="5" fill={dark} stroke={ink} strokeWidth="1.6" />
        <rect x="168" y="306" width="30" height="24" rx="4" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        <path d="M162,330 L204,330 L206,350 Q182,356 158,350 Z"
              fill={dark} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="168" y="276" width="30" height="4" fill={dark} opacity="0.6" />
      </g>

      {/* TORSO — mech chassis with chest HUD hex */}
      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        <path d="M100,208 Q104,198 124,196 L196,196 Q216,198 220,208 L224,286 Q196,296 160,296 Q124,296 96,286 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        {/* Panel lines */}
        <line x1="120" y1="218" x2="120" y2="284" stroke={ink} strokeWidth="1.6" opacity="0.5" />
        <line x1="200" y1="218" x2="200" y2="284" stroke={ink} strokeWidth="1.6" opacity="0.5" />
        {/* White chest panel */}
        <rect x="124" y="218" width="72" height="60" rx="5" fill="#F4FCFF" stroke={ink} strokeWidth="2" />
        {/* Chest HUD hex (Realm Mark — the Shapes guardian glyph) */}
        <path d="M160,232 L180,244 L180,260 L160,272 L140,260 L140,244 Z"
              fill={amber} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        <text x="160" y="260" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
              fontSize="16" fill={ink}>5</text>
        {/* Neck wiring */}
        <rect x="152" y="196" width="16" height="10" fill={dark} stroke={ink} strokeWidth="1.6" />
      </g>

      {/* HEAD — boxy rounded helmet, LED faceplate, bent antenna */}
      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Bent antenna — hero asymmetry */}
          <path d="M144,70 L132,30 L148,22" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="148" cy="22" r="6" fill={amber} stroke={ink} strokeWidth="2" />
          <circle cx="148" cy="22" r="2.5" fill="#FFF2B8" />
          {/* Secondary side-nubs (the "ears" of the mech helmet) */}
          <rect x="60"  y="108" width="18" height="32" rx="3" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.2" />
          <rect x="64"  y="116" width="10" height="6" fill={dark} />
          <rect x="242" y="108" width="18" height="32" rx="3" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.2" />
          <rect x="246" y="116" width="10" height="6" fill={dark} />
        </g>
        {/* Helmet */}
        <path d="M78,72 Q80,56 100,52 L220,52 Q240,56 242,72 L246,188 Q230,204 160,204 Q90,204 74,188 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        {/* Faceplate — white LED surface */}
        <rect x="92" y="96" width="136" height="96" rx="14" fill="#F4FCFF" stroke={ink} strokeWidth="2.6" />
        {/* Small LED dots above the face */}
        <circle cx="112" cy="82" r="3" fill={amber} />
        <circle cx="160" cy="78" r="3" fill="#FF6B6B" />
        <circle cx="208" cy="82" r="3" fill="#4ECDC4" />
        {/* Cheek LEDs */}
        <circle cx="104" cy="158" r="9" fill={`url(#${id('cheek')})`} opacity="0.8" />
        <circle cx="216" cy="158" r="9" fill={`url(#${id('cheek')})`} opacity="0.8" />
        <FaceStates id={id} />
      </g>

      {/* ARMS — segmented mech arms with exposed elbow wiring */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <rect x="92" y="208" width="32" height="36" rx="5"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        {/* Elbow */}
        <circle cx="108" cy="248" r="6" fill={dark} stroke={ink} strokeWidth="1.6" />
        <rect x="94" y="252" width="28" height="42" rx="5"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        {/* Claw hand */}
        <rect x="94" y="292" width="30" height="16" rx="4" fill={dark} stroke={ink} strokeWidth="2" />
        <rect x="100" y="306" width="6" height="10" fill={dark} stroke={ink} strokeWidth="1.6" />
        <rect x="112" y="306" width="6" height="10" fill={dark} stroke={ink} strokeWidth="1.6" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <rect x="196" y="208" width="32" height="36" rx="5"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        <circle cx="212" cy="248" r="6" fill={dark} stroke={ink} strokeWidth="1.6" />
        <rect x="198" y="252" width="28" height="42" rx="5"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        <rect x="198" y="292" width="30" height="16" rx="4" fill={dark} stroke={ink} strokeWidth="2" />
        <rect x="204" y="306" width="6" height="10" fill={dark} stroke={ink} strokeWidth="1.6" />
        <rect x="216" y="306" width="6" height="10" fill={dark} stroke={ink} strokeWidth="1.6" />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  CLEMENTINE CUB — Guardian of Addition. Honey-bee-striped cub hoodie,
 *  single curled honey-drip forelock, copper Honeycomb Abacus prop.
 * ══════════════════════════════════════════════════════════════════ */
function ClementineArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const stripe = '#4A2810';
  const copper = palette.padAccent;
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Small round cub-tail puff */}
        <circle cx="224" cy="252" r="10" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.2" />
        <path d="M218,248 Q224,244 230,248" stroke={stripe} strokeWidth="2.4" fill="none" />
      </g>

      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M122,268 L116,338 L156,338 L152,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <rect x="118" y="288" width="36" height="6" fill={stripe} />
        <rect x="118" y="310" width="36" height="6" fill={stripe} />
        <path d="M110,336 L158,336 L162,354 Q136,360 108,354 Z"
              fill={palette.belly[0]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="110" y="344" width="52" height="5" fill={copper} />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M168,268 L164,338 L204,338 L198,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <rect x="166" y="288" width="36" height="6" fill={stripe} />
        <rect x="166" y="310" width="36" height="6" fill={stripe} />
        <path d="M158,336 L206,336 L210,354 Q184,360 156,354 Z"
              fill={palette.belly[0]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="158" y="344" width="52" height="5" fill={copper} />
      </g>

      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        <path d="M96,208 Q102,198 122,196 L198,196 Q218,198 224,208 L228,288 Q196,298 160,298 Q124,298 92,288 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Bee stripes — two bold bands */}
        <path d="M94,232 Q160,246 226,232 L228,252 Q160,266 92,252 Z" fill={stripe} opacity="0.95" />
        <path d="M94,272 Q160,284 226,272 L228,290 Q160,300 92,290 Z" fill={stripe} opacity="0.9" />
        {/* Cream belly pouch */}
        <ellipse cx="160" cy="258" rx="36" ry="14" fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="1.6" opacity="0.9" />
        {/* Copper collar clasp */}
        <circle cx="160" cy="204" r="7" fill={copper} stroke={ink} strokeWidth="1.8" />
        <circle cx="160" cy="204" r="3" fill="#FFF4C2" />
      </g>

      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Small round cub ears */}
          <circle cx="102" cy="66" r="18" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" />
          <circle cx="102" cy="66" r="9"  fill={palette.belly[1]} stroke={ink} strokeWidth="1.5" />
          <circle cx="218" cy="66" r="18" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" />
          <circle cx="218" cy="66" r="9"  fill={palette.belly[1]} stroke={ink} strokeWidth="1.5" />
        </g>
        {/* Hood shell — round cub */}
        <path d="M66,132 Q64,78 110,62 Q160,54 210,62 Q256,78 254,132 Q254,184 218,202 L102,202 Q66,184 66,132 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" strokeLinejoin="round" />
        {/* Kid face */}
        <ellipse cx="160" cy="140" rx="68" ry="62" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2.3" />
        {/* Signature honey-drip forelock — single curled strand */}
        <path d="M146,82 Q152,60 168,64 Q176,76 172,94 Q162,100 152,96 Q146,92 146,82 Z"
              fill={copper} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        <path d="M160,72 Q166,72 168,78" stroke="#FFF4C2" strokeWidth="1.4" fill="none" />
        {/* Cheeks */}
        <circle cx="102" cy="160" r="13" fill={`url(#${id('cheek')})`} />
        <circle cx="218" cy="160" r="13" fill={`url(#${id('cheek')})`} />
        <FaceStates id={id} />
        <ellipse cx="160" cy="162" rx="3" ry="2" fill="#8E5A3E" opacity="0.8" />
      </g>

      {/* ARMS — hoodie sleeves with stripe; right arm holds Honeycomb Abacus */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M88,208 Q82,260 94,300 Q108,304 122,300 Q128,260 126,212 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <rect x="86" y="244" width="42" height="6" fill={stripe} opacity="0.9" />
        <circle cx="108" cy="302" r="11" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M194,212 Q192,260 200,300 Q214,304 228,300 Q240,260 234,208 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <rect x="192" y="244" width="42" height="6" fill={stripe} opacity="0.9" />
        <circle cx="214" cy="302" r="11" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
        {/* Honeycomb Abacus — copper hex frame with three honey tiles */}
        <path d="M244,282 L260,274 L276,282 L276,300 L260,308 L244,300 Z"
              fill={copper} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M250,286 L256,282 L262,286 L262,294 L256,298 L250,294 Z" fill="#FFE27A" stroke={ink} strokeWidth="1" />
        <path d="M258,290 L264,286 L270,290 L270,298 L264,302 L258,298 Z" fill={palette.body[2]} stroke={ink} strokeWidth="1" />
        <path d="M234,292 L244,290" stroke={copper} strokeWidth="2.4" />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  JAX FOX — Guardian of Subtraction. Angular fox-hood with sharp
 *  triangular ears, low tail-swoop, brass Split-Blade Counter ruler.
 * ══════════════════════════════════════════════════════════════════ */
function JaxArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const brass = palette.padAccent;
  const dark = palette.body[4];
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Low fox tail with white tip */}
        <path d="M212,246 Q248,254 258,282 Q252,296 236,292 Q222,280 212,262 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M248,278 Q258,282 256,292 Q248,292 242,286 Z" fill={palette.belly[0]} stroke={ink} strokeWidth="1.8" />
      </g>

      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M124,268 L118,340 L154,340 L152,268 Z"
              fill={dark} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M112,336 L158,336 L162,354 Q134,360 108,354 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="112" y="344" width="52" height="5" fill={brass} />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M168,268 L166,340 L202,340 L196,268 Z"
              fill={dark} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M158,336 L204,336 L208,354 Q180,360 154,354 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="158" y="344" width="52" height="5" fill={brass} />
      </g>

      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        {/* Sharp-cut angular jacket */}
        <path d="M92,210 L124,196 L196,196 L228,210 L232,290 L200,300 L120,300 L88,290 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        {/* Angular chest V — white underbelly */}
        <path d="M128,208 L160,246 L192,208 L192,268 L160,282 L128,268 Z"
              fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        {/* Brass shoulder studs */}
        <circle cx="112" cy="214" r="4" fill={brass} stroke={ink} strokeWidth="1.4" />
        <circle cx="208" cy="214" r="4" fill={brass} stroke={ink} strokeWidth="1.4" />
        {/* Realm Mark '2' */}
        <text x="160" y="260" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
              fontSize="20" fill={brass} stroke={ink} strokeWidth="1.2">2</text>
      </g>

      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Sharp triangular fox ears */}
          <path d="M78,96 L96,26 L128,92 Z"
                fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M96,44 L100,74 L118,86 Z" fill={palette.belly[0]} stroke={ink} strokeWidth="1.6" />
          <path d="M242,96 L224,26 L192,92 Z"
                fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M224,44 L220,74 L202,86 Z" fill={palette.belly[0]} stroke={ink} strokeWidth="1.6" />
        </g>
        {/* Angular fox-hood — diamond-ish face shape */}
        <path d="M70,120 Q76,78 120,62 L160,52 L200,62 Q244,78 250,120 Q248,172 210,196 L160,212 L110,196 Q72,172 70,120 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" strokeLinejoin="round" />
        {/* Muzzle wedge (belly cream) */}
        <path d="M108,162 L160,148 L212,162 L200,200 L160,210 L120,200 Z"
              fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        {/* Pointy black nose */}
        <path d="M152,164 L168,164 L160,176 Z" fill="#0F0A06" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
        {/* Signature fang peeking from smirk */}
        <path d="M164,190 L168,196 L162,196 Z" fill="#FFFFFF" stroke={ink} strokeWidth="1" />
        {/* Cheeks — subtle */}
        <circle cx="102" cy="158" r="10" fill={`url(#${id('cheek')})`} opacity="0.7" />
        <circle cx="218" cy="158" r="10" fill={`url(#${id('cheek')})`} opacity="0.7" />
        <FaceStates id={id} />
      </g>

      {/* ARMS — angular sleeves; right arm holds Split-Blade Counter */}
      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M86,210 L82,264 L94,300 L122,300 L124,260 L126,214 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="108" cy="302" r="11" fill={dark} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M194,214 L196,260 L198,300 L226,300 L238,264 L234,208 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="212" cy="302" r="11" fill={dark} stroke={ink} strokeWidth="2" />
        {/* Split-Blade Counter — brass folding ruler */}
        <rect x="228" y="254" width="8" height="46" rx="2" fill={brass} stroke={ink} strokeWidth="1.8" transform="rotate(18 232 278)" />
        <rect x="238" y="248" width="8" height="40" rx="2" fill="#F0D07A" stroke={ink} strokeWidth="1.8" transform="rotate(-14 242 268)" />
        <circle cx="232" cy="254" r="3" fill={ink} />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  VEX BAT — Guardian of Greater/Less Than. Folded bat-wing hood with
 *  two peaks, cloak drape, silver Scale Pendulum.
 * ══════════════════════════════════════════════════════════════════ */
function VexArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const silver = palette.padAccent;
  const dark = palette.body[4];
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Cloak hem point */}
        <path d="M208,250 L244,270 L232,296 L218,288 L210,272 Z"
              fill={dark} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
      </g>

      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <rect x="124" y="286" width="28" height="52" rx="6" fill="#221830" stroke={ink} strokeWidth="2.2" />
        <rect x="118" y="332" width="40" height="14" rx="4" fill="#120A1C" stroke={ink} strokeWidth="2" />
        <rect x="124" y="298" width="6" height="8" fill={silver} />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <rect x="168" y="286" width="28" height="52" rx="6" fill="#221830" stroke={ink} strokeWidth="2.2" />
        <rect x="162" y="332" width="40" height="14" rx="4" fill="#120A1C" stroke={ink} strokeWidth="2" />
        <rect x="190" y="298" width="6" height="8" fill={silver} />
      </g>

      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        {/* Cloak drape */}
        <path d="M86,208 Q94,198 124,196 L196,196 Q226,198 234,208 L240,296 Q200,306 160,306 Q120,306 80,296 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        {/* Shoulder wing-folds */}
        <path d="M92,212 L110,246 L88,256 Z" fill={dark} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        <path d="M228,212 L210,246 L232,256 Z" fill={dark} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        {/* V-cut undercloak (belly) */}
        <path d="M132,210 L160,260 L188,210 L180,280 L160,292 L140,280 Z"
              fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
        {/* Silver throat clasp — small diamond */}
        <path d="M160,200 L166,208 L160,216 L154,208 Z" fill={silver} stroke={ink} strokeWidth="1.6" />
      </g>

      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Dual wing-peak hood tips */}
          <path d="M82,102 L60,40 L112,72 Z"
                fill={dark} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M238,102 L260,40 L208,72 Z"
                fill={dark} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          {/* Wing membrane ribs */}
          <path d="M74,72 L96,88 M90,56 L104,82" stroke={ink} strokeWidth="1.6" opacity="0.5" />
          <path d="M246,72 L224,88 M230,56 L216,82" stroke={ink} strokeWidth="1.6" opacity="0.5" />
        </g>
        {/* Hood shell */}
        <path d="M70,130 Q66,86 112,70 Q160,60 208,70 Q254,86 250,130 Q248,180 212,198 L108,198 Q72,180 70,130 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" strokeLinejoin="round" />
        {/* Kid face */}
        <ellipse cx="160" cy="142" rx="66" ry="60" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2.3" />
        {/* Cool side-swept bangs */}
        <path d="M98,112 Q132,92 180,96 Q172,114 138,118 Q112,120 98,112 Z"
              fill="#1A0F28" stroke={ink} strokeWidth="1.6" />
        {/* Tiny fang */}
        <path d="M154,188 L158,196 L150,194 Z" fill="#FFFFFF" stroke={ink} strokeWidth="0.8" />
        <circle cx="102" cy="162" r="11" fill={`url(#${id('cheek')})`} opacity="0.7" />
        <circle cx="218" cy="162" r="11" fill={`url(#${id('cheek')})`} opacity="0.7" />
        <FaceStates id={id} />
        <ellipse cx="160" cy="164" rx="3" ry="2" fill="#8E5A3E" opacity="0.8" />
      </g>

      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M84,210 Q78,262 88,302 Q104,306 120,300 Q128,260 124,214 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="104" cy="304" r="10" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M196,214 Q194,262 200,302 Q216,306 232,300 Q240,260 236,210 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="216" cy="304" r="10" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
        {/* Scale Pendulum — silver chain + two weighted orbs */}
        <line x1="224" y1="296" x2="224" y2="244" stroke={silver} strokeWidth="2" />
        <line x1="206" y1="252" x2="242" y2="252" stroke={silver} strokeWidth="2" />
        <line x1="206" y1="252" x2="206" y2="272" stroke={silver} strokeWidth="1.6" />
        <line x1="242" y1="252" x2="242" y2="272" stroke={silver} strokeWidth="1.6" />
        <circle cx="206" cy="278" r="7" fill={silver} stroke={ink} strokeWidth="1.6" />
        <circle cx="242" cy="278" r="7" fill={silver} stroke={ink} strokeWidth="1.6" />
        <circle cx="224" cy="244" r="3" fill={silver} stroke={ink} strokeWidth="1.2" />
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  MOSS TURTLE — Guardian of Place Value. Shell hump above head line,
 *  leaf sprig, three copper-banded Stacking Stones.
 * ══════════════════════════════════════════════════════════════════ */
function MossArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const copper = palette.padAccent;
  const shell = '#8B6A3A';
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Short turtle tail */}
        <path d="M216,248 Q230,252 232,266 Q224,270 216,262 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      </g>

      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M120,268 Q114,300 118,336 L154,336 Q158,300 152,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M112,334 L158,334 L162,352 Q136,358 108,352 Z"
              fill={palette.belly[1]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M122,348 L128,354 M134,346 L140,354 M146,346 L152,354" stroke={ink} strokeWidth="1.6" />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M168,268 Q162,300 166,336 L202,336 Q206,300 200,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M158,334 L204,334 L208,352 Q182,358 154,352 Z"
              fill={palette.belly[1]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M168,348 L174,354 M180,346 L186,354 M192,346 L198,354" stroke={ink} strokeWidth="1.6" />
      </g>

      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        {/* Cream plastron front */}
        <ellipse cx="160" cy="248" rx="72" ry="56" fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="2.5" />
        {/* Plastron segments */}
        <line x1="160" y1="196" x2="160" y2="300" stroke={ink} strokeWidth="1.6" opacity="0.5" />
        <path d="M94,236 Q160,250 226,236" stroke={ink} strokeWidth="1.6" fill="none" opacity="0.5" />
        <path d="M94,270 Q160,284 226,270" stroke={ink} strokeWidth="1.6" fill="none" opacity="0.5" />
        {/* Shoulder ring from shell edge */}
        <path d="M88,208 Q96,196 124,194 L196,194 Q224,196 232,208 L234,224 Q160,234 86,224 Z"
              fill={palette.body[4]} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
      </g>

      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* The shell hump rises ABOVE head line — signature silhouette */}
          <path d="M86,84 Q100,22 160,14 Q220,22 234,84 Q234,96 200,98 L120,98 Q86,96 86,84 Z"
                fill={shell} stroke={ink} strokeWidth="2.8" strokeLinejoin="round" />
          {/* Shell hex plates */}
          <path d="M130,44 L160,32 L190,44 L190,72 L160,84 L130,72 Z"
                fill="#A6824C" stroke={ink} strokeWidth="1.8" />
          <path d="M104,62 L126,50 L128,78 L108,86 Z" fill="#A6824C" stroke={ink} strokeWidth="1.6" />
          <path d="M216,62 L194,50 L192,78 L212,86 Z" fill="#A6824C" stroke={ink} strokeWidth="1.6" />
          {/* Leaf sprig on top of shell */}
          <path d="M160,14 Q152,0 146,8 Q148,18 158,20 Z" fill="#7BC268" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M160,14 Q170,-2 176,8 Q172,18 162,18 Z" fill="#9AD08A" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
          <line x1="160" y1="14" x2="160" y2="24" stroke={ink} strokeWidth="1.6" />
        </g>
        {/* Round head poking out below shell */}
        <ellipse cx="160" cy="138" rx="72" ry="60" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" />
        {/* Cream beak */}
        <path d="M148,168 Q160,180 172,168 Q166,184 160,186 Q154,184 148,168 Z"
              fill={palette.belly[0]} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="100" cy="160" r="12" fill={`url(#${id('cheek')})`} />
        <circle cx="220" cy="160" r="12" fill={`url(#${id('cheek')})`} />
        <FaceStates id={id} />
      </g>

      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M88,212 Q82,260 92,298 Q106,304 120,298 Q126,260 122,216 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <circle cx="104" cy="300" r="11" fill={palette.belly[1]} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M198,216 Q196,260 200,298 Q214,304 228,298 Q238,260 232,212 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <circle cx="216" cy="300" r="11" fill={palette.belly[1]} stroke={ink} strokeWidth="2" />
        {/* Stacking Stones — three copper-banded */}
        <ellipse cx="244" cy="298" rx="22" ry="8" fill="#B8A47A" stroke={ink} strokeWidth="2" />
        <rect x="222" y="276" width="44" height="18" rx="6" fill="#D4C092" stroke={ink} strokeWidth="2" />
        <rect x="222" y="284" width="44" height="4" fill={copper} />
        <rect x="228" y="260" width="32" height="14" rx="5" fill="#E2D0A4" stroke={ink} strokeWidth="2" />
        <rect x="228" y="266" width="32" height="3" fill={copper} />
        <text x="244" y="271" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
              fontSize="9" fill={ink}>1</text>
        <text x="244" y="289" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
              fontSize="10" fill={ink}>10</text>
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  GLITCH SPRITE — Guardian of Equations. Pixel-floating companion at
 *  ~75% scale, three pixel tufts on head, Equation Prism cube floats.
 * ══════════════════════════════════════════════════════════════════ */
function GlitchArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const rainbow1 = '#FF6B6B';
  const rainbow2 = '#4ECDC4';
  const rainbow3 = '#FFD93D';
  const rainbow4 = '#A78BFA';
  return (
    <>
      {/* Scale-down container is simulated by drawing smaller; groups stay at rig anchors */}
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Pixel fleck trail */}
        <rect x="218" y="244" width="6" height="6" fill={rainbow1} />
        <rect x="228" y="252" width="5" height="5" fill={rainbow2} />
        <rect x="236" y="244" width="4" height="4" fill={rainbow3} />
      </g>

      {/* LEGS — floating, so we draw small glow-orbs where feet would be */}
      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <ellipse cx="138" cy="320" rx="22" ry="6" fill={`url(#${id('glow')})`} opacity="0.7" />
        <circle cx="138" cy="316" r="6" fill="#FFFFFF" stroke={ink} strokeWidth="1.8" />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <ellipse cx="182" cy="320" rx="22" ry="6" fill={`url(#${id('glow')})`} opacity="0.7" />
        <circle cx="182" cy="316" r="6" fill="#FFFFFF" stroke={ink} strokeWidth="1.8" />
      </g>

      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        {/* Compact pixel body (smaller to imply ~75% scale) */}
        <rect x="128" y="216" width="64" height="72" rx="10" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.6" />
        {/* Pixel grid overlay */}
        <rect x="136" y="224" width="6" height="6" fill={rainbow1} opacity="0.8" />
        <rect x="176" y="232" width="6" height="6" fill={rainbow2} opacity="0.8" />
        <rect x="146" y="260" width="6" height="6" fill={rainbow3} opacity="0.8" />
        <rect x="168" y="272" width="6" height="6" fill={rainbow4} opacity="0.8" />
        {/* Belly core */}
        <rect x="144" y="240" width="32" height="28" rx="4" fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="1.8" />
        {/* Realm Mark '=' */}
        <rect x="150" y="248" width="20" height="3" fill={ink} />
        <rect x="150" y="258" width="20" height="3" fill={ink} />
      </g>

      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Three pixelated tuft squares — signature crest */}
          <rect x="130" y="40" width="14" height="14" fill={rainbow1} stroke={ink} strokeWidth="1.8" />
          <rect x="152" y="28" width="16" height="16" fill={rainbow3} stroke={ink} strokeWidth="1.8" />
          <rect x="176" y="40" width="14" height="14" fill={rainbow2} stroke={ink} strokeWidth="1.8" />
        </g>
        {/* Pixel-block head (rounded square) */}
        <rect x="88" y="76" width="144" height="128" rx="18" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" />
        {/* Scanline shimmer */}
        <rect x="92" y="102" width="136" height="3" fill={rainbow4} opacity="0.4" />
        <rect x="92" y="152" width="136" height="3" fill={rainbow2} opacity="0.4" />
        {/* Cheeks as pixel blocks */}
        <rect x="92"  y="152" width="14" height="14" fill={palette.cheek} opacity="0.8" />
        <rect x="214" y="152" width="14" height="14" fill={palette.cheek} opacity="0.8" />
        <FaceStates id={id} />
      </g>

      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <rect x="100" y="228" width="24" height="56" rx="8" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        <circle cx="112" cy="288" r="9" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <rect x="196" y="228" width="24" height="56" rx="8" fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" />
        <circle cx="208" cy="288" r="9" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
        {/* Equation Prism — floating holographic cube */}
        <g transform="translate(238 262)">
          <path d="M0,-12 L14,-6 L14,10 L0,16 L-14,10 L-14,-6 Z"
                fill={`url(#${id('glow')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
          <path d="M-14,-6 L0,0 L14,-6 M0,0 L0,16"
                stroke={ink} strokeWidth="1.6" fill="none" />
          <text x="0" y="4" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900"
                fontSize="12" fill={ink}>=</text>
        </g>
      </g>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  CORALIE AXOLOTL — Guardian of Fractions. Three frilled gill-fronds
 *  per side (6 total fan), rose-gold Slice Shell clam prop.
 * ══════════════════════════════════════════════════════════════════ */
function CoralieArt({ palette, id }: { palette: CharacterPalette; id: (s: string) => string }) {
  const ink = palette.stroke;
  const rose = palette.padAccent;
  const frill = '#F5B8D2';
  return (
    <>
      <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
        {/* Axolotl tail-fin */}
        <path d="M210,248 Q244,246 252,272 Q242,290 222,284 Q214,270 210,258 Z"
              fill={`url(#${id('bodyAccent')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M220,258 Q240,264 244,278" stroke={frill} strokeWidth="1.6" fill="none" opacity="0.8" />
      </g>

      <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
        <path d="M122,268 Q116,300 122,336 L154,336 Q158,300 152,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M112,332 L160,332 L162,352 Q136,358 108,352 Z"
              fill={palette.belly[0]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="112" y="342" width="52" height="4" fill={rose} />
      </g>
      <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
        <path d="M168,268 Q162,300 168,336 L200,336 Q206,300 198,268 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M158,332 L206,332 L208,352 Q182,358 154,352 Z"
              fill={palette.belly[0]} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="158" y="342" width="52" height="4" fill={rose} />
      </g>

      <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
        <path d="M92,208 Q98,198 122,196 L198,196 Q222,198 228,208 L232,290 Q198,300 160,300 Q122,300 88,290 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Belly scallop bands */}
        <path d="M100,240 Q120,250 140,240 Q160,250 180,240 Q200,250 220,240 L224,264 Q160,274 96,264 Z"
              fill={`url(#${id('belly')})`} stroke={ink} strokeWidth="1.6" opacity="0.85" />
        {/* Rose-gold pearl clasp */}
        <circle cx="160" cy="210" r="6" fill={rose} stroke={ink} strokeWidth="1.6" />
        <circle cx="160" cy="210" r="2.5" fill="#FFEFDC" />
      </g>

      <g className="char-head" style={{ transformOrigin: '160px 130px' }}>
        <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
          {/* Six frilled gill-fronds — 3 per side */}
          <path d="M90,98 Q58,88 50,58 Q76,60 92,80 Z" fill={frill} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M86,86 Q58,70 64,40 Q82,50 94,72 Z" fill="#FFD4E4" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M98,74 Q82,50 96,22 Q108,44 110,66 Z" fill={frill} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M230,98 Q262,88 270,58 Q244,60 228,80 Z" fill={frill} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M234,86 Q262,70 256,40 Q238,50 226,72 Z" fill="#FFD4E4" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M222,74 Q238,50 224,22 Q212,44 210,66 Z" fill={frill} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        </g>
        {/* Hood/head — round axolotl kid */}
        <path d="M72,134 Q68,80 116,64 Q160,56 204,64 Q252,80 248,134 Q246,184 212,202 L108,202 Q74,184 72,134 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.8" strokeLinejoin="round" />
        {/* Kid face */}
        <ellipse cx="160" cy="142" rx="68" ry="60" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2.3" />
        {/* Soft bangs */}
        <path d="M110,108 Q150,92 196,100 Q180,120 146,122 Q122,122 110,108 Z"
              fill="#8A5A6E" stroke={ink} strokeWidth="1.6" opacity="0.9" />
        {/* Cheeks — extra blushy */}
        <circle cx="102" cy="164" r="14" fill={`url(#${id('cheek')})`} />
        <circle cx="218" cy="164" r="14" fill={`url(#${id('cheek')})`} />
        <FaceStates id={id} />
        <ellipse cx="160" cy="164" rx="3" ry="2" fill="#8E5A3E" opacity="0.8" />
      </g>

      <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
        <path d="M88,210 Q80,262 92,302 Q108,306 122,302 Q128,260 124,214 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="106" cy="304" r="11" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
      </g>
      <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
        <path d="M196,214 Q194,262 200,302 Q216,306 230,302 Q240,260 234,210 Z"
              fill={`url(#${id('body')})`} stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="214" cy="304" r="11" fill={`url(#${id('skin')})`} stroke={ink} strokeWidth="2" />
        {/* Slice Shell — rose-gold clamshell opened into fraction wedges */}
        <path d="M232,296 Q250,264 274,296 Q252,302 232,296 Z"
              fill={rose} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="253" y1="270" x2="253" y2="296" stroke={ink} strokeWidth="1.6" />
        <line x1="244" y1="286" x2="262" y2="286" stroke={ink} strokeWidth="1.4" opacity="0.6" />
        <path d="M232,296 Q250,310 274,296" fill="#F5D4B8" stroke={ink} strokeWidth="1.8" />
        <circle cx="253" cy="296" r="2.4" fill="#FFEFDC" />
      </g>
    </>
  );
}

/* ────────────────────────── router ────────────────────────── */
function Art({ characterId, palette, id }: { characterId: string; palette: CharacterPalette; id: (s: string) => string }) {
  switch (characterId) {
    case 'bloo':       return <BlooArt       palette={palette} id={id} />;
    case 'sunny':      return <SunnyArt      palette={palette} id={id} />;
    case 'rosie':      return <RosieArt      palette={palette} id={id} />;
    case 'milo':       return <MiloArt       palette={palette} id={id} />;
    case 'pip':        return <PipArt        palette={palette} id={id} />;
    case 'clementine': return <ClementineArt palette={palette} id={id} />;
    case 'jax':        return <JaxArt        palette={palette} id={id} />;
    case 'vex':        return <VexArt        palette={palette} id={id} />;
    case 'moss':       return <MossArt       palette={palette} id={id} />;
    case 'glitch':     return <GlitchArt     palette={palette} id={id} />;
    case 'coralie':    return <CoralieArt    palette={palette} id={id} />;
    case 'rex':
    default:           return <RexArt        palette={palette} id={id} />;
  }
}

export default function CharacterRig({
  palette,
  characterId,
  mood = 'happy',
  className,
  isSpeaking,
}: RigProps) {
  const id = (suffix: string) => `${characterId}-${suffix}`;

  return (
    <svg
      viewBox="0 0 320 380"
      xmlns="http://www.w3.org/2000/svg"
      className={`char-rig ${className ?? ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Defs palette={palette} id={id} />

      {/* Ground shadow */}
      <ellipse cx="160" cy="360" rx="86" ry="9" fill="black" opacity="0.22" />

      <g className="char-all" style={{ transformOrigin: '160px 200px' }} filter={`url(#${id('drop')})`}>
        <Art characterId={characterId} palette={palette} id={id} />
      </g>

      {/* Mood is consumed by FaceStates overlays via CSS opacity swap; the prop is
          preserved for back-compat but not read here. */}
      {mood === 'thinking' && null}
      {isSpeaking && null}
    </svg>
  );
}

/** Predefined palettes for the six NumPals — tuned to Nintendo-grade saturation
 *  per the brand bible. Each palette exposes one signature hue + accent.        */
export const PALETTES: Record<string, CharacterPalette> = {
  bloo: {
    // BlooBear — ice-blue hoodie hero. Hero hue #7AA5C7.
    body:  ['#CFE5F5', '#A8CFE8', '#7AA5C7', '#5A87AE', '#3F6A8F'],
    belly: ['#FFF6E0', '#F4DFB0', '#E0C285', '#C8A35C'],
    cheek: '#FF8FA8',
    iris:  ['#120B05', '#2E1C10', '#4A2F1B', '#663F25'],
    stroke:'#1A2A3A',
    padAccent: '#F0B43A',   // Tally Gauntlet gold
  },
  sunny: {
    // SunnyBug — coral rhino-beetle. Hero hue #E2806A.
    body:  ['#FFD7C2', '#F4A68A', '#E2806A', '#C05E48', '#8F3A2A'],
    belly: ['#FFF3DC', '#F8DDB6', '#E5BB82', '#C89A5A'],
    cheek: '#FFA098',
    iris:  ['#0C0705', '#2A150C', '#4A281A', '#6A3D2A'],
    stroke:'#2A0F08',
    padAccent: '#20110A',   // deep elytra black (used for spots + legs)
  },
  rosie: {
    // RosieOwl — dusty rose cloak + plum shadow. Hero hues #E07898 / #9D5870.
    body:  ['#F8D4E0', '#E8A2BC', '#E07898', '#B85A7E', '#9D5870'],
    belly: ['#FFF4F8', '#FADBE4', '#EBC0CE', '#D49EB2'],
    cheek: '#FF8CAA',
    iris:  ['#14070E', '#2E1420', '#4A2034', '#66304A'],
    stroke:'#3A1426',
    padAccent: '#D4A647',   // brass lantern
  },
  milo: {
    // MiloFrog — kelly green athletic. Hero hue #5BA868 + chartreuse belly.
    body:  ['#C2EAC8', '#8ED19A', '#5BA868', '#3D854A', '#255A2E'],
    belly: ['#F0FAD0', '#DDF2A0', '#B8DC70', '#97BC4E'],
    cheek: '#FF9FB0',
    iris:  ['#05140A', '#163A1A', '#2A5A2E', '#3E7A40'],
    stroke:'#15361A',
    padAccent: '#FF3D9A',   // hot-pink sneaker laces
  },
  pip: {
    // PipZebra — crisp white + ink black. Hero pop magenta.
    body:  ['#FFFFFF', '#F4F6FA', '#E2E6EE', '#A8B0BC', '#0A0A12'],
    belly: ['#FFFFFF', '#F5F7FA', '#E5E9F0', '#C5CCD6'],
    cheek: '#FF8FA8',
    iris:  ['#050508', '#101018', '#24242E', '#3A3A48'],
    stroke:'#0A0A12',
    padAccent: '#FF3D9A',   // magenta visor stripe
  },
  rex: {
    // RexRobot — cyan plating + amber LEDs. Hero hue #6DC8DD.
    body:  ['#D4F2FA', '#A8E2F2', '#6DC8DD', '#4AA6BC', '#2C7388'],
    belly: ['#F4FCFF', '#D8F4FA', '#B8E8F2', '#90D2E0'],
    cheek: '#FFB3C1',
    iris:  ['#240F04', '#4A2208', '#7A3F12', '#B0701C'],  // amber LED core
    stroke:'#0F2A36',
    padAccent: '#FFC23D',   // amber LED glow
  },
  clementine: {
    // Clementine Cub — buttercream bee-striped cub. Hero hue #F5C842.
    body:  ['#FFF0B8', '#FCDE82', '#F5C842', '#D9A72A', '#A07A16'],
    belly: ['#FFF9DC', '#F8E5A8', '#E8C878', '#C8A04A'],
    cheek: '#FF9FB8',
    iris:  ['#1A0F02', '#3A220A', '#5C3A14', '#7E5420'],
    stroke:'#4A2810',
    padAccent: '#C2763A',   // Honeycomb Abacus copper
  },
  jax: {
    // Jax Fox — ember orange wedge silhouette. Hero hue #D94F2A.
    body:  ['#FFC2AA', '#F08560', '#D94F2A', '#A83416', '#6E1F0A'],
    belly: ['#FFF2E4', '#F8D8B8', '#E4B080', '#C4854C'],
    cheek: '#FF8A78',
    iris:  ['#0A0503', '#24100A', '#3E2010', '#5C331A'],
    stroke:'#2A0C04',
    padAccent: '#B8862E',   // Split-Blade brass
  },
  vex: {
    // Vex Bat — deep violet cloak. Hero hue #6B4FA8.
    body:  ['#C9B6E8', '#9D82C8', '#6B4FA8', '#4B357A', '#2E1E52'],
    belly: ['#ECE2F5', '#CDBDE2', '#A58FC5', '#7A60A0'],
    cheek: '#D494C0',
    iris:  ['#08040F', '#1C0E28', '#341C48', '#4E2E68'],
    stroke:'#1A0E30',
    padAccent: '#BFC4CC',   // Scale Pendulum silver
  },
  moss: {
    // Moss Turtle — sage moss green. Hero hue #7B9B5E.
    body:  ['#D8E6B8', '#AEC488', '#7B9B5E', '#557240', '#344826'],
    belly: ['#FBF3D6', '#ECDCA4', '#D4BE7A', '#A6904A'],
    cheek: '#F5A89C',
    iris:  ['#0A0F04', '#1E2A10', '#35451E', '#4E6030'],
    stroke:'#243418',
    padAccent: '#9B6B3A',   // Stacking Stones copper
  },
  glitch: {
    // Glitch Sprite — pearl white + rainbow flecks. Hero hue #E8ECF2.
    body:  ['#FFFFFF', '#F4F6FA', '#E8ECF2', '#BFC6D2', '#7E8496'],
    belly: ['#FFFFFF', '#F0F4FA', '#D8E0EC', '#B8C2D2'],
    cheek: '#FFB3D6',
    iris:  ['#080820', '#1A1A3C', '#2E2E5C', '#4A4A7E'],
    stroke:'#1A1A2E',
    padAccent: '#A78BFA',   // holographic prism
  },
  coralie: {
    // Coralie Axolotl — sea teal flowing. Hero hue #3FA8A0.
    body:  ['#C2ECE8', '#7ED0C8', '#3FA8A0', '#2A7E78', '#155450'],
    belly: ['#FFF4F0', '#FADDD0', '#EEC0AC', '#D99B7A'],
    cheek: '#FF9FB8',
    iris:  ['#04120F', '#0E2A24', '#18423A', '#265A50'],
    stroke:'#0E2E2A',
    padAccent: '#D99B7A',   // rose-gold Slice Shell
  },
};
