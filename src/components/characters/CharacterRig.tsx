import type { CharacterMood } from '../../types';

/**
 * Polished plush character rig — joint-anchored, multi-layer gradient,
 * fur stroke pattern, refined eyes/mouth/tail, single-path arms and legs.
 *
 * Each character (BlooBear, SunnyBug, etc.) is a thin wrapper that calls
 * <CharacterRig palette={...} accentId="bloo" /> with its color palette
 * and a unique accent ID that controls a small set of distinguishing
 * features (heart vs spots vs stripes vs antenna).
 *
 * Joint coordinates (viewBox 0 0 320 380) — IMPORTANT: animations target
 * these via transform-origin in CharacterDisplay.tsx, so they must match.
 *   shoulder L: (108, 218)   shoulder R: (212, 218)
 *   hip L:      (138, 295)   hip R:      (182, 295)
 *   body center:(160, 240)   head center:(160, 130)
 *   character pivot: (160, 200)   tail pivot: (218, 248)
 */

export interface CharacterPalette {
  /** 5-stop gradient: lightest highlight → mid → deep rim. Pastel range. */
  body: [string, string, string, string, string];
  /** Cream/belly gradient: light → mid → deep. */
  belly: [string, string, string, string];
  /** Cheek pink (RGBA — alpha applied per-stop). */
  cheek: string;
  /** Iris colors: inner → mid → outer rim. */
  iris: [string, string, string, string];
  /** Stitch + fur stroke color (slightly darker than body mid). */
  stroke: string;
  /** Pawpad + accent color for foot pads. */
  padAccent: string;
}

interface RigProps {
  palette: CharacterPalette;
  /** Used to generate unique gradient IDs and pick accent features. */
  characterId: string;
  mood?: CharacterMood;
  className?: string;
  isSpeaking?: boolean;
}

export default function CharacterRig({
  palette,
  characterId,
  mood = 'happy',
  className,
  isSpeaking,
}: RigProps) {
  // Unique gradient/filter IDs per character so multiple instances on the page
  // don't collide with each other's <defs>.
  const id = (suffix: string) => `${characterId}-${suffix}`;

  return (
    <svg
      viewBox="0 0 320 380"
      xmlns="http://www.w3.org/2000/svg"
      className={`char-rig ${className ?? ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Body gradient — soft 5-stop pastel */}
        <radialGradient id={id('body')} cx="42%" cy="32%" r="80%">
          <stop offset="0%" stopColor={palette.body[0]} />
          <stop offset="30%" stopColor={palette.body[1]} />
          <stop offset="65%" stopColor={palette.body[2]} />
          <stop offset="90%" stopColor={palette.body[3]} />
          <stop offset="100%" stopColor={palette.body[4]} />
        </radialGradient>
        {/* Soft white sheen overlay */}
        <radialGradient id={id('sheen')} cx="35%" cy="22%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="55%" stopColor="white" stopOpacity="0.08" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        {/* Belly cream gradient */}
        <radialGradient id={id('belly')} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={palette.belly[0]} />
          <stop offset="50%" stopColor={palette.belly[1]} />
          <stop offset="90%" stopColor={palette.belly[2]} />
          <stop offset="100%" stopColor={palette.belly[3]} />
        </radialGradient>
        {/* Pink cheek fade */}
        <radialGradient id={id('cheek')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.cheek} stopOpacity="0.85" />
          <stop offset="60%" stopColor={palette.cheek} stopOpacity="0.35" />
          <stop offset="100%" stopColor={palette.cheek} stopOpacity="0" />
        </radialGradient>
        {/* Iris gradient — inner pupil dark to outer rim */}
        <radialGradient id={id('iris')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.iris[0]} />
          <stop offset="55%" stopColor={palette.iris[1]} />
          <stop offset="90%" stopColor={palette.iris[2]} />
          <stop offset="100%" stopColor={palette.iris[3]} />
        </radialGradient>
        {/* White sclera with subtle vertical gradient */}
        <linearGradient id={id('sclera')} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="80%" stopColor="#F4F7FB" />
          <stop offset="100%" stopColor="#E5ECF3" />
        </linearGradient>
        {/* Mouth interior */}
        <radialGradient id={id('mouth')} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#6A1010" />
          <stop offset="100%" stopColor="#3A0606" />
        </radialGradient>

        {/* Soft drop shadow */}
        <filter id={id('drop')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.28" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Fur strokes pattern — small directional marks for plush texture */}
        <pattern id={id('fur')} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="1" y1="0" x2="2.5" y2="4" stroke={palette.stroke} strokeWidth="0.7" opacity="0.6" strokeLinecap="round" />
          <line x1="4" y1="1" x2="5.5" y2="5" stroke={palette.stroke} strokeWidth="0.7" opacity="0.6" strokeLinecap="round" />
          <line x1="2" y1="3" x2="3.5" y2="6" stroke={palette.stroke} strokeWidth="0.5" opacity="0.5" strokeLinecap="round" />
        </pattern>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="160" cy="358" rx="80" ry="9" fill="black" opacity="0.18" />

      {/* ═══════ CHARACTER (front view only — animation system handles rotations via transform) ═══════ */}
      <g className="char-all" style={{ transformOrigin: '160px 200px' }} filter={`url(#${id('drop')})`}>

        {/* TAIL — character-specific shape, pivots from base */}
        <g className="char-tail" style={{ transformOrigin: '218px 248px' }}>
          {characterId === 'sunny' && (
            // FOX — long bushy tail with white tip
            <>
              <path
                d="M225,250 Q260,235 268,210 Q272,195 260,188 Q248,196 240,212 Q232,228 225,250 Z"
                fill={`url(#${id('body')})`}
              />
              <path
                d="M225,250 Q260,235 268,210 Q272,195 260,188 Q248,196 240,212 Q232,228 225,250 Z"
                fill={`url(#${id('fur')})`}
                opacity="0.6"
              />
              <ellipse cx="262" cy="194" rx="10" ry="8" fill="#FFFFFF" />
              <ellipse cx="262" cy="192" rx="6" ry="4" fill="#F8F4EA" />
            </>
          )}
          {characterId === 'rosie' && (
            // BUNNY — round cotton-ball tail
            <>
              <circle cx="232" cy="240" r="13" fill="#FFFFFF" />
              <circle cx="232" cy="240" r="13" fill={`url(#${id('fur')})`} opacity="0.4" />
              <circle cx="228" cy="236" r="7" fill="#FFFFFF" opacity="0.85" />
              <circle cx="237" cy="244" r="5" fill="#F0F0F0" opacity="0.7" />
            </>
          )}
          {characterId === 'pip' && (
            // PANDA — small black-tipped tail
            <>
              <ellipse cx="232" cy="240" rx="13" ry="11" fill="#FFFFFF" />
              <ellipse cx="237" cy="240" rx="7" ry="9" fill="#1A1A22" />
            </>
          )}
          {characterId === 'rex' && (
            // ROBOT — segmented metal tail
            <>
              <rect x="220" y="234" width="16" height="14" rx="3" fill={`url(#${id('body')})`} />
              <rect x="236" y="236" width="10" height="10" rx="2" fill={`url(#${id('body')})`} />
              <circle cx="244" cy="241" r="2.5" fill={palette.padAccent} />
            </>
          )}
          {characterId === 'milo' && (
            // FROG — no tail, but a small back-bump
            <ellipse cx="225" cy="245" rx="6" ry="4" fill={`url(#${id('body')})`} opacity="0.7" />
          )}
          {characterId === 'bloo' && (
            // BEAR — short stubby tail (default)
            <>
              <ellipse cx="232" cy="240" rx="14" ry="12" fill={`url(#${id('body')})`} />
              <ellipse cx="232" cy="240" rx="14" ry="12" fill={`url(#${id('fur')})`} opacity="0.55" />
              <ellipse cx="232" cy="237" rx="11" ry="9" fill={`url(#${id('sheen')})`} />
            </>
          )}
        </g>

        {/* LEFT LEG — single continuous path from hip into foot */}
        <g className="char-left-leg" style={{ transformOrigin: '138px 280px' }}>
          <path
            d="M118,270 Q114,290 116,310 Q118,328 124,338 Q116,348 124,355 Q138,360 152,355 Q160,348 152,338 Q158,328 160,310 Q162,290 158,270 Q138,262 118,270 Z"
            fill={`url(#${id('body')})`}
          />
          <path
            d="M118,270 Q114,290 116,310 Q118,328 124,338 Q116,348 124,355 Q138,360 152,355 Q160,348 152,338 Q158,328 160,310 Q162,290 158,270 Q138,262 118,270 Z"
            fill={`url(#${id('fur')})`}
            opacity="0.55"
          />
          <ellipse cx="128" cy="295" rx="11" ry="22" fill={`url(#${id('sheen')})`} />
          <path
            d="M124,348 Q138,358 152,348 Q150,355 138,357 Q126,355 124,348 Z"
            fill={`url(#${id('belly')})`}
          />
          <circle cx="130" cy="352" r="1.8" fill={palette.padAccent} opacity="0.85" />
          <circle cx="138" cy="354" r="1.8" fill={palette.padAccent} opacity="0.85" />
          <circle cx="146" cy="352" r="1.8" fill={palette.padAccent} opacity="0.85" />
        </g>

        {/* RIGHT LEG */}
        <g className="char-right-leg" style={{ transformOrigin: '182px 280px' }}>
          <path
            d="M162,270 Q158,290 160,310 Q162,328 168,338 Q160,348 168,355 Q182,360 196,355 Q204,348 196,338 Q202,328 204,310 Q206,290 202,270 Q182,262 162,270 Z"
            fill={`url(#${id('body')})`}
          />
          <path
            d="M162,270 Q158,290 160,310 Q162,328 168,338 Q160,348 168,355 Q182,360 196,355 Q204,348 196,338 Q202,328 204,310 Q206,290 202,270 Q182,262 162,270 Z"
            fill={`url(#${id('fur')})`}
            opacity="0.55"
          />
          <ellipse cx="172" cy="295" rx="11" ry="22" fill={`url(#${id('sheen')})`} />
          <path
            d="M168,348 Q182,358 196,348 Q194,355 182,357 Q170,355 168,348 Z"
            fill={`url(#${id('belly')})`}
          />
          <circle cx="174" cy="352" r="1.8" fill={palette.padAccent} opacity="0.85" />
          <circle cx="182" cy="354" r="1.8" fill={palette.padAccent} opacity="0.85" />
          <circle cx="190" cy="352" r="1.8" fill={palette.padAccent} opacity="0.85" />
        </g>

        {/* BODY */}
        <g className="char-torso" style={{ transformOrigin: '160px 240px' }}>
          <ellipse cx="160" cy="240" rx="68" ry="58" fill={`url(#${id('body')})`} />
          <ellipse cx="160" cy="240" rx="68" ry="58" fill={`url(#${id('fur')})`} opacity="0.6" />
          <ellipse cx="142" cy="222" rx="42" ry="32" fill={`url(#${id('sheen')})`} />
          <ellipse cx="160" cy="248" rx="44" ry="42" fill={`url(#${id('belly')})`} />
          <ellipse cx="155" cy="240" rx="22" ry="18" fill="white" opacity="0.18" />
          {/* Belly stitching */}
          <ellipse
            cx="160" cy="248" rx="44" ry="42" fill="none"
            stroke={palette.stroke} strokeWidth="0.8"
            strokeDasharray="2.5,3" opacity="0.5"
          />
          {/* Center seam */}
          <path d="M160,184 Q162,240 160,294" fill="none"
                stroke={palette.stroke} strokeWidth="0.8" strokeDasharray="2,4" opacity="0.5" />
          {/* Belly accent — distinct mark per character */}
          {characterId === 'bloo' && (
            // BEAR — little heart
            <path d="M160,228 l-3,-3 a2,2 0 1,1 3,-2 a2,2 0 1,1 3,2 Z" fill="#FF8FA3" opacity="0.7" />
          )}
          {characterId === 'sunny' && (
            // FOX — white belly patch + chest fluff
            <>
              <ellipse cx="160" cy="252" rx="32" ry="28" fill="#FFFAEC" opacity="0.7" />
              <path d="M148,228 Q160,222 172,228 Q170,236 160,238 Q150,236 148,228 Z" fill="#FFFFFF" opacity="0.85" />
            </>
          )}
          {characterId === 'rosie' && (
            // BUNNY — small flower on belly
            <>
              <circle cx="160" cy="240" r="3.5" fill="#FFD93D" />
              <circle cx="155" cy="236" r="3" fill="#FFFFFF" />
              <circle cx="165" cy="236" r="3" fill="#FFFFFF" />
              <circle cx="155" cy="244" r="3" fill="#FFFFFF" />
              <circle cx="165" cy="244" r="3" fill="#FFFFFF" />
            </>
          )}
          {characterId === 'milo' && (
            // FROG — darker spots on belly
            <>
              <circle cx="142" cy="245" r="4" fill={palette.body[4]} opacity="0.6" />
              <circle cx="178" cy="245" r="4" fill={palette.body[4]} opacity="0.6" />
              <circle cx="160" cy="262" r="3.5" fill={palette.body[4]} opacity="0.6" />
            </>
          )}
          {characterId === 'pip' && (
            // PANDA — black tummy patch (the iconic panda body marking)
            <>
              <ellipse cx="160" cy="248" rx="42" ry="38" fill="#1A1A22" opacity="0.92" />
              <ellipse cx="155" cy="240" rx="22" ry="14" fill="#3D3D4A" opacity="0.4" />
            </>
          )}
          {characterId === 'rex' && (
            <>
              {/* Robot chest panel */}
              <rect x="142" y="225" width="36" height="22" rx="4" fill={palette.iris[1]} opacity="0.6" />
              <circle cx="152" cy="236" r="2" fill="#FFD93D" />
              <circle cx="160" cy="236" r="2" fill="#FF6B6B" />
              <circle cx="168" cy="236" r="2" fill="#4ECDC4" />
            </>
          )}
        </g>

        {/* HEAD (no fur filter — keeps face crisp) */}
        <g className="char-head" style={{ transformOrigin: '160px 200px' }}>

          {/* Ears — distinct per animal */}
          <g className="char-ears" style={{ transformOrigin: '160px 70px' }}>
            {characterId === 'bloo' && (
              // BEAR — round teardrop ears
              <>
                <path d="M92,38 C72,38 65,55 70,72 C74,84 88,90 92,90 C96,90 110,84 114,72 C119,55 112,38 92,38 Z"
                      fill={`url(#${id('body')})`} />
                <path d="M92,55 C82,55 78,65 81,75 C84,82 90,86 92,86 C94,86 100,82 103,75 C106,65 102,55 92,55 Z"
                      fill={`url(#${id('belly')})`} />
                <ellipse cx="92" cy="74" rx="6" ry="8" fill="#A87530" opacity="0.45" />

                <path d="M228,38 C208,38 201,55 206,72 C210,84 224,90 228,90 C232,90 246,84 250,72 C255,55 248,38 228,38 Z"
                      fill={`url(#${id('body')})`} />
                <path d="M228,55 C218,55 214,65 217,75 C220,82 226,86 228,86 C230,86 236,82 239,75 C242,65 238,55 228,55 Z"
                      fill={`url(#${id('belly')})`} />
                <ellipse cx="228" cy="74" rx="6" ry="8" fill="#A87530" opacity="0.45" />
              </>
            )}
            {characterId === 'sunny' && (
              // FOX — narrow pointed ears positioned over the top-sides of
              // the head with their base fully embedded INSIDE the head
              // silhouette. Because char-ears renders before the head
              // ellipse, the base is hidden by the head — only the upper
              // point (above y=44) is visible, so each ear reads as a fox
              // ear peeking out from behind the head rather than a triangle
              // floating in space.
              <>
                {/* LEFT ear — base anchored inside the head at x≈118..148, y=60;
                    pointed tip at (116, 4). */}
                <path
                  d="M118,60 Q102,30 116,4 Q138,24 148,60 Z"
                  fill={`url(#${id('body')})`}
                />
                <path
                  d="M122,56 Q112,32 118,12 Q134,28 142,56 Z"
                  fill={`url(#${id('belly')})`}
                />
                {/* Dark fox ear-tip */}
                <path d="M114,18 Q116,4 122,10 Q120,20 116,24 Z" fill="#3D1810" opacity="0.9" />

                {/* RIGHT ear — mirrored across x=160 */}
                <path
                  d="M202,60 Q218,30 204,4 Q182,24 172,60 Z"
                  fill={`url(#${id('body')})`}
                />
                <path
                  d="M198,56 Q208,32 202,12 Q186,28 178,56 Z"
                  fill={`url(#${id('belly')})`}
                />
                <path d="M206,18 Q204,4 198,10 Q200,20 204,24 Z" fill="#3D1810" opacity="0.9" />
              </>
            )}
            {characterId === 'rosie' && (
              // BUNNY — long upright oval ears with pink inner
              <>
                <ellipse cx="100" cy="40" rx="16" ry="50" fill={`url(#${id('body')})`} transform="rotate(-8, 100, 40)" />
                <ellipse cx="100" cy="42" rx="9" ry="40" fill="#FFD2DE" transform="rotate(-8, 100, 42)" />
                <ellipse cx="100" cy="32" rx="5" ry="28" fill="#FFB8CC" transform="rotate(-8, 100, 32)" opacity="0.7" />

                <ellipse cx="220" cy="40" rx="16" ry="50" fill={`url(#${id('body')})`} transform="rotate(8, 220, 40)" />
                <ellipse cx="220" cy="42" rx="9" ry="40" fill="#FFD2DE" transform="rotate(8, 220, 42)" />
                <ellipse cx="220" cy="32" rx="5" ry="28" fill="#FFB8CC" transform="rotate(8, 220, 32)" opacity="0.7" />
              </>
            )}
            {characterId === 'milo' && (
              // FROG — small green dome bumps on top (the 'eye bumps' that frogs have);
              // the face still has the main eyes so the rig animations work normally.
              <>
                <ellipse cx="120" cy="48" rx="14" ry="10" fill={`url(#${id('body')})`} />
                <ellipse cx="120" cy="48" rx="14" ry="10" fill={`url(#${id('fur')})`} opacity="0.5" />
                <ellipse cx="116" cy="44" rx="6" ry="4" fill={`url(#${id('sheen')})`} />

                <ellipse cx="200" cy="48" rx="14" ry="10" fill={`url(#${id('body')})`} />
                <ellipse cx="200" cy="48" rx="14" ry="10" fill={`url(#${id('fur')})`} opacity="0.5" />
                <ellipse cx="196" cy="44" rx="6" ry="4" fill={`url(#${id('sheen')})`} />

                {/* Small green crest spots */}
                <circle cx="160" cy="42" r="4" fill={palette.body[3]} opacity="0.8" />
                <circle cx="148" cy="46" r="3" fill={palette.body[3]} opacity="0.6" />
                <circle cx="172" cy="46" r="3" fill={palette.body[3]} opacity="0.6" />
              </>
            )}
            {characterId === 'pip' && (
              // PANDA — round black ears planted firmly on top of the head
              // corners. Sized so they clearly overlap the head silhouette
              // instead of floating above it.
              <>
                <circle cx="90" cy="62" r="26" fill="#1A1A22" />
                <circle cx="90" cy="62" r="17" fill="#2A2A38" opacity="0.6" />
                <circle cx="85" cy="54" r="7" fill="#3D3D4A" opacity="0.85" />

                <circle cx="230" cy="62" r="26" fill="#1A1A22" />
                <circle cx="230" cy="62" r="17" fill="#2A2A38" opacity="0.6" />
                <circle cx="225" cy="54" r="7" fill="#3D3D4A" opacity="0.85" />
              </>
            )}
            {characterId === 'rex' && (
              // ROBOT — square satellite-dish "ears" on the sides
              <>
                <rect x="56" y="100" width="20" height="36" rx="3" fill={`url(#${id('body')})`} />
                <rect x="60" y="106" width="12" height="6" rx="1" fill={palette.iris[1]} opacity="0.7" />
                <circle cx="66" cy="124" r="3" fill={palette.padAccent} />

                <rect x="244" y="100" width="20" height="36" rx="3" fill={`url(#${id('body')})`} />
                <rect x="248" y="106" width="12" height="6" rx="1" fill={palette.iris[1]} opacity="0.7" />
                <circle cx="254" cy="124" r="3" fill={palette.padAccent} />
              </>
            )}
          </g>

          {/* Big round head */}
          <ellipse cx="160" cy="130" rx="92" ry="86" fill={`url(#${id('body')})`} />
          <ellipse cx="160" cy="130" rx="92" ry="86" fill={`url(#${id('fur')})`} opacity="0.55" />
          <ellipse cx="135" cy="95" rx="58" ry="40" fill={`url(#${id('sheen')})`} />
          <ellipse cx="125" cy="75" rx="28" ry="11" fill="white" opacity="0.32" />

          {/* Panda eye patches — dark ovals behind the eyes */}
          {characterId === 'pip' && (
            <>
              <ellipse cx="120" cy="135" rx="32" ry="34" fill="#1A1A22" transform="rotate(-12, 120, 135)" />
              <ellipse cx="200" cy="135" rx="32" ry="34" fill="#1A1A22" transform="rotate(12, 200, 135)" />
            </>
          )}

          {/* Fox face mask — white snout area */}
          {characterId === 'sunny' && (
            <path d="M120,150 Q160,200 200,150 Q200,180 160,200 Q120,180 120,150 Z"
                  fill="#FFFAEC" opacity="0.85" />
          )}

          {/* Cheeks */}
          <circle cx="80" cy="155" r="22" fill={`url(#${id('cheek')})`} />
          <circle cx="240" cy="155" r="22" fill={`url(#${id('cheek')})`} />

          {/* Muzzle */}
          <ellipse cx="160" cy="160" rx="42" ry="30" fill={`url(#${id('belly')})`} />
          <ellipse cx="155" cy="152" rx="22" ry="14" fill="white" opacity="0.3" />

          {/* Character-specific head accent */}
          {characterId === 'rex' && (
            <>
              {/* Robot antenna */}
              <line x1="160" y1="44" x2="160" y2="20" stroke={palette.stroke} strokeWidth="2.5" />
              <circle cx="160" cy="16" r="6" fill={palette.iris[1]}>
                <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {/* ── EYES — refined with gradient iris + dual sparkle ── */}

          {/* LEFT EYE: default */}
          <g className="face-state default eye-default eye-default-l">
            <ellipse cx="120" cy="130" rx="23" ry="27" fill="#3D2818" opacity="0.4" />
            <ellipse cx="120" cy="130" rx="22" ry="26" fill={`url(#${id('sclera')})`} />
            <g className="pupil-l">
              <circle cx="120" cy="135" r="18" fill={`url(#${id('iris')})`} />
              <circle cx="120" cy="136" r="6" fill="#0A0500" />
              <ellipse cx="125" cy="127" rx="8" ry="6" fill="white" />
              <circle cx="114" cy="143" r="3" fill="white" opacity="0.9" />
              <circle cx="129" cy="125" r="1.5" fill="white" />
            </g>
          </g>

          {/* LEFT EYE: wink */}
          <g className="face-state eye-wink-l">
            <ellipse cx="120" cy="130" rx="22" ry="26" fill="#FFFFFF" />
            <path d="M100,130 Q120,142 140,130" fill="none"
                  stroke="#3D2818" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* LEFT EYE: wide */}
          <g className="face-state eye-wide">
            <ellipse cx="120" cy="128" rx="24" ry="29" fill="#FFFFFF" />
            <circle cx="120" cy="135" r="20" fill="#3D2818" />
            <circle cx="125" cy="127" r="9" fill="white" />
            <circle cx="113" cy="143" r="5" fill="white" opacity="0.9" />
          </g>

          {/* LEFT EYE: stars */}
          <g className="face-state eye-stars">
            <path d="M120,114 L123,126 L135,126 L125.5,134 L129,146 L120,138 L111,146 L114.5,134 L105,126 L117,126 Z"
                  fill="#FFD93D" stroke="#3D2818" strokeWidth="1.2" strokeLinejoin="round" />
          </g>

          {/* RIGHT EYE: default */}
          <g className="face-state default eye-default eye-default-r">
            <ellipse cx="200" cy="130" rx="23" ry="27" fill="#3D2818" opacity="0.4" />
            <ellipse cx="200" cy="130" rx="22" ry="26" fill={`url(#${id('sclera')})`} />
            <g className="pupil-r">
              <circle cx="200" cy="135" r="18" fill={`url(#${id('iris')})`} />
              <circle cx="200" cy="136" r="6" fill="#0A0500" />
              <ellipse cx="205" cy="127" rx="8" ry="6" fill="white" />
              <circle cx="194" cy="143" r="3" fill="white" opacity="0.9" />
              <circle cx="209" cy="125" r="1.5" fill="white" />
            </g>
          </g>

          {/* RIGHT EYE: wink */}
          <g className="face-state eye-wink-r">
            <ellipse cx="200" cy="130" rx="22" ry="26" fill="#FFFFFF" />
            <path d="M180,130 Q200,142 220,130" fill="none"
                  stroke="#3D2818" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* RIGHT EYE: wide */}
          <g className="face-state eye-wide">
            <ellipse cx="200" cy="128" rx="24" ry="29" fill="#FFFFFF" />
            <circle cx="200" cy="135" r="20" fill="#3D2818" />
            <circle cx="205" cy="127" r="9" fill="white" />
            <circle cx="193" cy="143" r="5" fill="white" opacity="0.9" />
          </g>

          {/* RIGHT EYE: stars */}
          <g className="face-state eye-stars">
            <path d="M200,114 L203,126 L215,126 L205.5,134 L209,146 L200,138 L191,146 L194.5,134 L185,126 L197,126 Z"
                  fill="#FFD93D" stroke="#3D2818" strokeWidth="1.2" strokeLinejoin="round" />
          </g>

          {/* Nose */}
          <ellipse cx="160" cy="168" rx="7" ry="5" fill="#1A0F08" />
          <ellipse cx="160" cy="167" rx="6" ry="4" fill="#3D2818" />
          <ellipse cx="158" cy="165" rx="2.5" ry="1.5" fill="white" opacity="0.7" />

          {/* ── MOUTH — multiple state variants ── */}

          <g className="face-state default mouth-default">
            <path d="M148,180 Q160,193 172,180" fill="none"
                  stroke="#1A0F08" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          <g className="face-state mouth-open">
            <ellipse cx="160" cy="187" rx="10" ry="12" fill={`url(#${id('mouth')})`} />
            <ellipse cx="160" cy="192" rx="6" ry="5" fill="#FF6B6B" />
            <ellipse cx="160" cy="190" rx="4" ry="2" fill="#FF8FA3" opacity="0.8" />
          </g>

          <g className="face-state mouth-o">
            <circle cx="160" cy="186" r="7" fill={`url(#${id('mouth')})`} />
            <circle cx="160" cy="187" r="4" fill="#FF6B6B" />
            <circle cx="158" cy="185" r="1.2" fill="white" opacity="0.6" />
          </g>

          <g className="face-state mouth-smirk">
            <path d="M146,184 Q160,176 176,190" fill="none"
                  stroke="#1A0F08" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          <g className="face-state mouth-laugh">
            <path d="M142,180 Q160,202 178,180 Q174,196 160,198 Q146,196 142,180 Z"
                  fill={`url(#${id('mouth')})`} />
            <rect x="148" y="180" width="24" height="3" rx="1" fill="#FFFFFF" opacity="0.85" />
            <path d="M148,189 Q160,200 172,189 Q166,196 160,196 Q154,196 148,189 Z" fill="#FF6B6B" />
            <ellipse cx="160" cy="192" rx="6" ry="1.5" fill="#FF8FA3" opacity="0.85" />
          </g>

          {/* Mood-dependent expression overlay (for backward compat with mood prop) */}
          {mood === 'thinking' && (
            <ellipse cx="160" cy="188" rx="2.5" ry="2" fill="#1A0F08" opacity="0.7" />
          )}

          {/* Per-character face accents — drawn over the default mouth */}
          {characterId === 'rosie' && (
            // BUNNY — two front teeth under the smile
            <>
              <rect x="156" y="183" width="3.5" height="6" rx="0.8" fill="#FFFFFF" stroke="#3D2818" strokeWidth="0.5" />
              <rect x="160.5" y="183" width="3.5" height="6" rx="0.8" fill="#FFFFFF" stroke="#3D2818" strokeWidth="0.5" />
            </>
          )}
          {characterId === 'sunny' && (
            // FOX — slim pointed snout outline
            <path d="M150,168 Q160,178 170,168" fill="none"
                  stroke="#3D1810" strokeWidth="1.2" opacity="0.7" />
          )}
          {characterId === 'milo' && (
            // FROG — extra wide mouth replacing the small smile
            <>
              <path d="M120,176 Q160,200 200,176" fill="none"
                    stroke="#1A0F08" strokeWidth="4" strokeLinecap="round" />
              <circle cx="135" cy="180" r="2" fill="#1A0F08" opacity="0.7" />
              <circle cx="185" cy="180" r="2" fill="#1A0F08" opacity="0.7" />
            </>
          )}
          {characterId === 'rex' && (
            // ROBOT — small mouth grille
            <>
              <rect x="148" y="180" width="24" height="6" rx="1" fill="#1F3D4A" opacity="0.8" />
              <line x1="152" y1="180" x2="152" y2="186" stroke={palette.body[0]} strokeWidth="0.8" />
              <line x1="156" y1="180" x2="156" y2="186" stroke={palette.body[0]} strokeWidth="0.8" />
              <line x1="160" y1="180" x2="160" y2="186" stroke={palette.body[0]} strokeWidth="0.8" />
              <line x1="164" y1="180" x2="164" y2="186" stroke={palette.body[0]} strokeWidth="0.8" />
              <line x1="168" y1="180" x2="168" y2="186" stroke={palette.body[0]} strokeWidth="0.8" />
            </>
          )}
        </g>

        {/* ARMS — single continuous path so no gradient seam */}
        <g className="char-left-arm" style={{ transformOrigin: '108px 218px' }}>
          <path
            d="M108,196 Q132,196 134,222 Q138,250 132,276 Q140,298 122,308 Q108,314 94,308 Q76,298 84,276 Q78,250 82,222 Q84,196 108,196 Z"
            fill={`url(#${id('body')})`}
          />
          <path
            d="M108,196 Q132,196 134,222 Q138,250 132,276 Q140,298 122,308 Q108,314 94,308 Q76,298 84,276 Q78,250 82,222 Q84,196 108,196 Z"
            fill={`url(#${id('fur')})`}
            opacity="0.55"
          />
          <ellipse cx="98" cy="238" rx="11" ry="34" fill={`url(#${id('sheen')})`} />
          <path
            d="M94,295 Q108,306 122,295 Q122,304 108,308 Q94,304 94,295 Z"
            fill={`url(#${id('belly')})`}
          />
          <circle cx="100" cy="298" r="2" fill={palette.padAccent} opacity="0.8" />
          <circle cx="108" cy="301" r="2" fill={palette.padAccent} opacity="0.8" />
          <circle cx="116" cy="298" r="2" fill={palette.padAccent} opacity="0.8" />
        </g>

        <g className="char-right-arm" style={{ transformOrigin: '212px 218px' }}>
          <path
            d="M212,196 Q236,196 238,222 Q242,250 236,276 Q244,298 226,308 Q212,314 198,308 Q180,298 188,276 Q182,250 186,222 Q188,196 212,196 Z"
            fill={`url(#${id('body')})`}
          />
          <path
            d="M212,196 Q236,196 238,222 Q242,250 236,276 Q244,298 226,308 Q212,314 198,308 Q180,298 188,276 Q182,250 186,222 Q188,196 212,196 Z"
            fill={`url(#${id('fur')})`}
            opacity="0.55"
          />
          <ellipse cx="202" cy="238" rx="11" ry="34" fill={`url(#${id('sheen')})`} />
          <path
            d="M198,295 Q212,306 226,295 Q226,304 212,308 Q198,304 198,295 Z"
            fill={`url(#${id('belly')})`}
          />
          <circle cx="204" cy="298" r="2" fill={palette.padAccent} opacity="0.8" />
          <circle cx="212" cy="301" r="2" fill={palette.padAccent} opacity="0.8" />
          <circle cx="220" cy="298" r="2" fill={palette.padAccent} opacity="0.8" />
        </g>

      </g>

      {/* Suppress unused-prop warning */}
      {isSpeaking && null}
    </svg>
  );
}

/** Predefined palettes for the 6 NumPals characters */
export const PALETTES: Record<string, CharacterPalette> = {
  bloo: {
    body: ['#E8F2FF', '#C8E0F5', '#A5C8E5', '#86B0D2', '#7AA5C7'],
    belly: ['#FFFAEC', '#FCEFD0', '#F5E0B0', '#EBCF95'],
    cheek: '#FFB3C1',
    iris: ['#2A1A0A', '#4A3220', '#6A4830', '#8A5F40'],
    stroke: '#5C8DAE',
    padAccent: '#C68A30',
  },
  sunny: {
    body: ['#FFEDE0', '#FFD0BC', '#F4A48E', '#E2806A', '#C95F4A'],
    belly: ['#FFF8E5', '#FCEDC4', '#F5DA9A', '#E8C57A'],
    cheek: '#FFB3C1',
    iris: ['#1A0F08', '#3D2818', '#5C3A1F', '#7A4F2C'],
    stroke: '#A04030',
    padAccent: '#7A2A1A',
  },
  rosie: {
    // BUNNY — soft pink with cream belly
    body: ['#FFF0F4', '#FFD8E2', '#FFB8CC', '#F594B0', '#E07898'],
    belly: ['#FFFAFC', '#FFEEF2', '#FFDCE5', '#F5B8C8'],
    cheek: '#FF9FB8',
    iris: ['#1A0820', '#3D1F2A', '#6A3A4A', '#9D5870'],
    stroke: '#C26088',
    padAccent: '#FF8FA8',
  },
  milo: {
    body: ['#E8FBE8', '#C8F0CC', '#A2DCA8', '#7BC587', '#5BA868'],
    belly: ['#F8FFE8', '#EFFAC8', '#E0F098', '#C8DD78'],
    cheek: '#FFB3C1',
    iris: ['#0A1A05', '#1F4A1A', '#3D6830', '#5A8C45'],
    stroke: '#3D8050',
    padAccent: '#1F5A28',
  },
  pip: {
    body: ['#FAFCFF', '#EFF1F5', '#DFE3EA', '#C5CCD6', '#A8B0BC'],
    belly: ['#FFFFFF', '#F5F7FA', '#E5E9F0', '#C5CCD6'],
    cheek: '#FFB3C1',
    iris: ['#0A0A12', '#1F1F2A', '#383848', '#525266'],
    stroke: '#7A8590',
    padAccent: '#3A3A48',
  },
  rex: {
    body: ['#E0F8FE', '#BDEEFB', '#94DEF0', '#6DC8DD', '#54B3C8'],
    belly: ['#F0FCFF', '#D8F4FA', '#B8E8F2', '#90D2E0'],
    cheek: '#FFB3C1',
    iris: ['#0A1F2A', '#1F3D4A', '#385868', '#52788C'],
    stroke: '#2C7388',
    padAccent: '#1F5A6E',
  },
};
