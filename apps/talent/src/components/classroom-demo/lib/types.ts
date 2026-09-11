import type { PeepsSelection } from '../peeps/options';
/**
 * Core domain types for [App name].
 *
 * These mirror the entities and GraphQL schema defined in docs/tdd.md 1:1.
 * They are intentionally framework- and storage-agnostic: no React, no
 * GraphQL server, no Prisma. That means they can be:
 *   - imported directly into real GraphQL resolvers once a server exists
 *   - fed into `graphql-code-generator` later as the hand-written source of
 *     truth to check the generated types against
 *   - used as-is (with the in-memory Database shape) to stand up a working
 *     mock GraphQL server for frontend development before Postgres exists
 */

export type Role = 'TEACHER' | 'STUDENT';

export type AssignmentPhase = 'PREDICT' | 'CONFIRM' | 'APPLY';

export type AssignmentStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

/** ISO date string, e.g. "2026-09-09". Kept as a branded-ish alias for clarity at call sites. */
export type ISODateString = string;

/** ISO datetime string, e.g. "2026-09-09T14:03:00.000Z". */
export type ISODateTimeString = string;

export interface Teacher {
  id: string;
  role: 'TEACHER';
  name: string;
  email: string;
}

export interface Student {
  id: string;
  role: 'STUDENT';
  classId: string;
  name: string;
  phone: string;
  /** Teacher-set reading/writing level. Never student-chosen — see TDD "streak farming" note. */
  level: number;
  streakCount: number;
  avatarId: string | null;
  peeps?: PeepsSelection;
  lastPracticeDate: ISODateString | null;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
}

export interface ReadingMaterial {
  id: string;
  classId: string;
  title: string;
  bodyText: string;
}

export interface VocabWord {
  id: string;
  materialId: string;
  word: string;
  position: number;
}

export interface Assignment {
  id: string;
  classId: string;
  materialId: string;
  wordIds: string[];
  phase1Unlocked: boolean;
  phase2Unlocked: boolean;
  phase3Unlocked: boolean;
  status: AssignmentStatus;
  dueAt: ISODateTimeString | null;
}

export interface WordResponse {
  id: string;
  assignmentId: string;
  studentId: string;
  wordId: string;
  phase: AssignmentPhase;
  text: string;
  /** 0, 1, or 2. Null until a teacher grades it. Only CONFIRM/APPLY responses are graded. */
  grade: 0 | 1 | 2 | null;
  feedback: string;
  submittedAt: ISODateTimeString;
}

export interface Avatar {
  id: string;
  name: string;
  /** Streak-days required to unlock. 0 means it's a starter, available immediately. */
  req: number;
  color: string;
}

export interface ExtraPracticeItem {
  id: string;
  level: number;
  word: string;
  correct: string;
  distractors: string[];
}

/** The whole in-memory "database" shape. In production this is Postgres via Prisma;
 *  every function in selectors.ts / mutations.ts only ever reads/returns this shape,
 *  so swapping the storage layer later doesn't change any calling code's contract. */
export interface Database {
  classes: Class[];
  students: Student[];
  materials: ReadingMaterial[];
  vocabWords: VocabWord[];
  assignments: Assignment[];
  responses: WordResponse[];
}

export type PhaseStatus =
  | { kind: 'locked' }
  | { kind: 'not_started' }
  | { kind: 'in_progress'; done: number; total: number }
  | { kind: 'submitted' };
