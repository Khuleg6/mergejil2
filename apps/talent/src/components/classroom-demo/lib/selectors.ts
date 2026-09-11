import type {
  Database,
  Student,
  ReadingMaterial,
  VocabWord,
  Assignment,
  WordResponse,
  AssignmentPhase,
  Avatar,
  PhaseStatus,
  ISODateString,
} from './types';

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function todayStr(now: Date = new Date()): ISODateString {
  return now.toISOString().slice(0, 10);
}

export function isoDaysAgo(n: number, now: Date = new Date()): ISODateString {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Whole-day difference between two ISO date strings. Positive when `b` is after `a`. */
export function daysBetween(a: ISODateString, b: ISODateString): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000,
  );
}

export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function formatPhone(raw: string): string {
  const digits = normalizePhone(raw);
  if (digits.length !== 10) return raw;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export function rosterFor(db: Database, classId: string): Student[] {
  return db.students.filter((s) => s.classId === classId);
}

export function materialFor(
  db: Database,
  classId: string,
): ReadingMaterial | undefined {
  return db.materials.find((m) => m.classId === classId);
}

export function vocabForMaterial(
  db: Database,
  materialId: string,
): VocabWord[] {
  return db.vocabWords.filter((w) => w.materialId === materialId);
}

/** First active assignment for a class. A real implementation might return several;
 *  the prototype (and this port) assume one live assignment per class at a time. */
export function assignmentFor(
  db: Database,
  classId: string,
): Assignment | undefined {
  return db.assignments.find(
    (a) => a.classId === classId && a.status === 'ACTIVE',
  );
}

export function wordById(db: Database, wordId: string): VocabWord | undefined {
  return db.vocabWords.find((w) => w.id === wordId);
}

export function findStudentByPhone(
  db: Database,
  phone: string,
): Student | undefined {
  const normalized = normalizePhone(phone);
  return db.students.find((s) => s.phone === normalized);
}

export function getResponse(
  db: Database,
  studentId: string,
  wordId: string,
  phase: AssignmentPhase,
): WordResponse | undefined {
  return db.responses.find(
    (r) =>
      r.studentId === studentId && r.wordId === wordId && r.phase === phase,
  );
}

export function phaseCompleteCount(
  db: Database,
  assignment: Assignment,
  studentId: string,
  phase: AssignmentPhase,
): number {
  return assignment.wordIds.filter(
    (wordId) => getResponse(db, studentId, wordId, phase) !== undefined,
  ).length;
}

export function phaseStatus(
  db: Database,
  assignment: Assignment,
  studentId: string,
  phase: AssignmentPhase,
  unlocked: boolean,
): PhaseStatus {
  if (!unlocked) return { kind: 'locked' };
  const done = phaseCompleteCount(db, assignment, studentId, phase);
  const total = assignment.wordIds.length;
  if (done === total && total > 0) return { kind: 'submitted' };
  if (done > 0) return { kind: 'in_progress', done, total };
  return { kind: 'not_started' };
}

export function avatarUnlocked(student: Student, avatar: Avatar): boolean {
  return student.streakCount >= avatar.req;
}

/** Confirm-phase grades across the whole roster for one word — the input to the
 *  "words students needed more support with" report. Returns null when nothing
 *  has been graded yet, so the caller can render "Not graded yet" instead of 0%. */
export function wordSupportNeededPct(
  db: Database,
  assignment: Assignment,
  roster: Student[],
  wordId: string,
): number | null {
  const grades = roster
    .map((s) => getResponse(db, s.id, wordId, 'CONFIRM'))
    .filter((r): r is WordResponse => r !== undefined)
    .map((r) => r.grade)
    .filter((g): g is 0 | 1 | 2 => g !== null);
  if (grades.length === 0) return null;
  const needsSupport = grades.filter((g) => g <= 1).length;
  return Math.round((needsSupport / grades.length) * 100);
}
