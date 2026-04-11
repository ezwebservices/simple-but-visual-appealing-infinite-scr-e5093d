export const colors = {
  cream: '#FFF8F0',
  coral: '#FF6B6B',
  mint: '#4ECDC4',
  lavender: '#B8A9C9',
  sunny: '#FFE66D',
  sky: '#87CEEB',
  peach: '#FFBE76',
  sage: '#A8E6CF',
  charcoal: '#2D3436',
} as const;

export const gradients = [
  'linear-gradient(180deg, #FFF8F0, #FFBE76)',
  'linear-gradient(180deg, #FFF8F0, #B8A9C9)',
  'linear-gradient(180deg, #FFF8F0, #87CEEB)',
  'linear-gradient(180deg, #FFF8F0, #A8E6CF)',
  'linear-gradient(180deg, rgba(255,230,109,0.3), #FFF8F0)',
] as const;

export const fontStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const fontSize = {
  question: '2rem',
  answer: '2.5rem',
  streak: '1.5rem',
} as const;

export const spacing = {
  cardRadius: '16px',
  buttonRadius: '24px',
  buttonMinHeight: '90px',
  buttonWidth: '28vw',
  gap: '8px',
} as const;

export const confettiColors = [
  colors.coral,
  colors.mint,
  colors.sunny,
  colors.sky,
  colors.peach,
  colors.lavender,
] as const;

/** Dashboard-specific design tokens */
export const dashboard = {
  cardBg: 'rgba(255, 255, 255, 0.85)',
  cardShadow: '0 4px 20px rgba(0,0,0,0.06)',
  cardRadius: '20px',
  sectionGap: '16px',
  /** Sub-concept category colors */
  conceptColors: {
    'rote-counting-5': '#87CEEB',
    'rote-counting-10': '#87CEEB',
    'subitizing-5': '#A8D8EA',
    'subitizing-10': '#A8D8EA',
    'one-to-one-5': '#88C9A1',
    'one-to-one-10': '#88C9A1',
    'cardinality-5': '#B5D99C',
    'cardinality-10': '#B5D99C',
    'comparing-easy': '#FFBE76',
    'comparing-close': '#FFBE76',
    'number-order-5': '#F8A978',
    'number-order-10': '#F8A978',
    'counting-on': '#C9A8D8',
    'addition-small': '#4ECDC4',
    'doubles': '#6FCF97',
    'decomposition': '#6FCF97',
    'addition-10': '#4ECDC4',
    'make-10': '#56CCF2',
    'subtraction-small': '#FF6B6B',
    'subtraction-10': '#FF6B6B',
  } as Record<string, string>,
  /** Mastery status colors */
  statusColors: {
    locked: '#D1D5DB',
    active: '#FFBE76',
    practicing: '#87CEEB',
    mastered: '#4ECDC4',
  },
  /** Trend chart colors */
  trendLine: '#7C6DAF',
  trendFill: 'rgba(124, 109, 175, 0.15)',
  trendDot: '#7C6DAF',
} as const;
