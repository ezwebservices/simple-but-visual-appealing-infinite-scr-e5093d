export type Operator = 'plus' | 'minus';

export type ObjectType = 'apple' | 'star' | 'heart' | 'balloon' | 'fish';

export type CharacterName = 'benny' | 'lulu' | 'ollie' | 'fifi' | 'ziggy' | 'rex' | 'robo';

export type CharacterMood = 'happy' | 'excited' | 'thinking' | 'encouraging' | 'headShake';

/** Fine-grained sub-concepts in learning progression order */
export type SubConcept =
  | 'rote-counting-5'
  | 'rote-counting-10'
  | 'number-recognition-5'
  | 'number-recognition-10'
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
  | 'addition-10'
  | 'subtraction-small'
  | 'subtraction-10';

/** Ordered progression of sub-concepts */
export const SUB_CONCEPT_ORDER: SubConcept[] = [
  'rote-counting-5',
  'rote-counting-10',
  'number-recognition-5',
  'number-recognition-10',
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
  'addition-10',
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
}

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
