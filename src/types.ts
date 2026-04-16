export type Operator = 'plus' | 'minus';

export type ObjectType = 'apple' | 'star' | 'heart' | 'balloon' | 'fish';

export type CharacterName = 'bloo' | 'sunny' | 'rosie' | 'milo' | 'pip' | 'rex' | 'robo';

export type CharacterMood = 'happy' | 'excited' | 'thinking' | 'encouraging' | 'headShake';

export type CharacterAnimation = 'idle' | 'dance' | 'dance-1' | 'dance-2' | 'dance-3' | 'dance-4' | 'dance-5' | 'spin' | 'none';

/** Fine-grained sub-concepts in learning progression order */
export type SubConcept =
  | 'rote-counting-5'
  | 'rote-counting-10'
  | 'subitizing-5'
  | 'subitizing-10'
  | 'one-to-one-5'
  | 'one-to-one-10'
  | 'cardinality-5'
  | 'cardinality-10'
  | 'comparing-easy'
  | 'comparing-close'
  | 'number-order-5'
  | 'number-order-10'
  | 'counting-on'
  | 'addition-small'
  | 'doubles'
  | 'decomposition'
  | 'addition-10'
  | 'make-10'
  | 'subtraction-small'
  | 'subtraction-10';

/** Ordered progression of sub-concepts (20 total — K–1 math curriculum) */
export const SUB_CONCEPT_ORDER: SubConcept[] = [
  'rote-counting-5',
  'rote-counting-10',
  'subitizing-5',
  'subitizing-10',
  'one-to-one-5',
  'one-to-one-10',
  'cardinality-5',
  'cardinality-10',
  'comparing-easy',
  'comparing-close',
  'number-order-5',
  'number-order-10',
  'counting-on',
  'addition-small',
  'doubles',         // new — doubles fact fluency (1+1..5+5)
  'decomposition',   // new — part-whole thinking ("5 = 2 + ?")
  'addition-10',
  'make-10',         // new — bridge-to-ten strategy ("7 + ? = 10")
  'subtraction-small',
  'subtraction-10',
];

/** @deprecated Legacy 3-concept type — kept for unused components to compile */
export type ConceptArea = 'counting' | 'addition' | 'subtraction';

export type MasteryStatus = 'locked' | 'active' | 'practicing' | 'mastered';

export interface MathProblem {
  id: string;
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
  wrongAnswers: number[];
  objectType: ObjectType;
  character: CharacterName;
  backgroundColor: string;
  explanation: string;
  concept: SubConcept;
}

export interface LessonCardState {
  problem: MathProblem;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  hasPlayed: boolean;
}

/** Per-sub-concept tracking */
export interface SubConceptProgress {
  subConcept: SubConcept;
  totalCorrect: number;
  totalAttempted: number;
  status: MasteryStatus;
  /** Rolling window of last 10 attempts: true = correct */
  recentAttempts: boolean[];
  /** Current consecutive correct answers */
  streak: number;
  masteredAt?: string;
}

/** @deprecated Legacy interface — kept for unused components to compile */
export interface ConceptProgress {
  concept: ConceptArea;
  totalCorrect: number;
  totalAttempted: number;
  status: MasteryStatus;
  recentAttempts: boolean[];
  unlockedAt?: string;
  masteredAt?: string;
}

/** A single activity entry for the activity feed */
export interface ActivityEntry {
  timestamp: string;
  concept: SubConcept;
  correct: boolean;
  num1: number;
  num2: number;
  operator: Operator;
}

/** Aggregate per-child stats — synced via ChildProfile.stats JSON column */
export interface ChildStats {
  totalCorrect: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  /** Monotonic record — never decreases (cross-device max-merged) */
  longestStreak: number;
  /** +1 per new calendar-day open */
  sessionCount: number;
  /** ISO of the last answered question */
  lastPlayed: string;
}

/** Child profile for multi-child accounts */
export interface ChildProfile {
  id: string;
  name: string;
  avatar: CharacterName;
  createdAt: string;
  conceptProgress: Record<SubConcept, SubConceptProgress>;
  /** Daily accuracy snapshots for trend chart */
  accuracyHistory: { date: string; accuracy: number; concept: SubConcept; _total?: number }[];
  /** Recent activity (last 50 entries) */
  recentActivity: ActivityEntry[];
  /** Characters the child has unlocked. Always starts with ['bloo']. */
  unlockedCharacters?: CharacterName[];
  /** Highest dance move number unlocked (1–5). Starts at 1. */
  unlockedDanceMoves?: number;
  /** Aggregate stats — optional so old cloud rows still hydrate */
  stats?: ChildStats;
  /** ISO of the last client-side mutation — used for profile-level LWW */
  updatedAt?: string;
}

/** Unlock thresholds — how many sub-concepts must be mastered to unlock each reward */
export const CHARACTER_UNLOCK_ORDER: CharacterName[] = ['bloo', 'sunny', 'rosie', 'milo', 'pip', 'rex'];

/** masteredCount → which characters are unlocked. Index = masteredCount needed. */
export const CHARACTER_UNLOCK_THRESHOLDS: Record<CharacterName, number> = {
  bloo: 0,    // starter
  sunny: 1,   // unlocks after first mastery
  rosie: 3,
  milo: 6,
  pip: 10,
  rex: 14,
  robo: 999,  // legacy alias, never auto-unlocked
};

/** masteredCount → highest dance move unlocked (1–5) */
export const DANCE_MOVE_THRESHOLDS: number[] = [
  0,   // dance 1: from start
  3,   // dance 2
  7,   // dance 3
  12,  // dance 4
  17,  // dance 5 (the finale — unlocks near the end of the full curriculum)
];

export interface ProgressData {
  totalCorrect: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayed: string;
}

export interface ScrollState {
  currentIndex: number;
  cards: LessonCardState[];
}
