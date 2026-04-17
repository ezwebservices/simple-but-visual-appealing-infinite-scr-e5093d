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

/* ────────────────────────── router ────────────────────────── */
function Art({ characterId, palette, id }: { characterId: string; palette: CharacterPalette; id: (s: string) => string }) {
  switch (characterId) {
    case 'bloo':  return <BlooArt  palette={palette} id={id} />;
    case 'sunny': return <SunnyArt palette={palette} id={id} />;
    case 'rosie': return <RosieArt palette={palette} id={id} />;
    case 'milo':  return <MiloArt  palette={palette} id={id} />;
    case 'pip':   return <PipArt   palette={palette} id={id} />;
    case 'rex':
    default:      return <RexArt   palette={palette} id={id} />;
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
};
