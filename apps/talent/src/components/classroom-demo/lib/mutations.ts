/**
 * Each function here mirrors one `Mutation` from the GraphQL schema in docs/tdd.md,
 * and is named to match it. They're pure and immutable — given a Database, they
 * return a *new* Database plus whatever record was created/changed — because there's
 * no real database yet to write through.
 *
 * When a real GraphQL server + Prisma exist, a resolver body stops looking like:
 *   const { db, student } = addStudentToClass(db, classId, phone, name);
 *   saveDb(db);
 *   return student;
 * and starts looking like:
 *   return prisma.student.create({ data: { classId, phone, name, ... } });
 * The validation/shape rules in here (e.g. "no active assignment ⇒ can't unlock a
 * phase") should carry over either way — only the persistence mechanics change.
 */

import type {
  Database,
  Class,
  Student,
  ReadingMaterial,
  VocabWord,
  Assignment,
  WordResponse,
  AssignmentPhase,
} from './types';
import { uid, normalizePhone, todayStr, daysBetween } from './selectors';

export function createClass(
  db: Database,
  name: string,
  teacherId: string,
): { db: Database; class: Class } {
  const newClass: Class = { id: uid('c'), name, teacherId };
  return { db: { ...db, classes: [...db.classes, newClass] }, class: newClass };
}

export function addStudentToClass(
  db: Database,
  classId: string,
  name: string,
  phone: string,
): { db: Database; student: Student } {
  const student: Student = {
    id: uid('s'),
    role: 'STUDENT',
    classId,
    name,
    phone: normalizePhone(phone),
    level: 1,
    streakCount: 0,
    avatarId: null,
    lastPracticeDate: null,
  };
  return { db: { ...db, students: [...db.students, student] }, student };
}

export function uploadReadingMaterial(
  db: Database,
  classId: string,
  title: string,
  bodyText: string,
): { db: Database; material: ReadingMaterial } {
  const material: ReadingMaterial = { id: uid('m'), classId, title, bodyText };
  return { db: { ...db, materials: [...db.materials, material] }, material };
}

/** Replaces the full vocab word list for a material — matches the TDD's
 *  `selectVocabWords(materialId, words)` contract, which is a wholesale set,
 *  not a per-word toggle. See `toggleVocabWord` below for the toggle convenience. */
export function selectVocabWords(
  db: Database,
  materialId: string,
  words: string[],
): Database {
  const kept = db.vocabWords.filter((w) => w.materialId !== materialId);
  const next: VocabWord[] = words.map((word, position) => ({
    id: uid('w'),
    materialId,
    word,
    position,
  }));
  return { ...db, vocabWords: [...kept, ...next] };
}

/** UI-layer convenience: click one word to add/remove it from the material's set. */
export function toggleVocabWord(
  db: Database,
  materialId: string,
  word: string,
): Database {
  const current = db.vocabWords
    .filter((w) => w.materialId === materialId)
    .map((w) => w.word);
  const next = current.includes(word)
    ? current.filter((w) => w !== word)
    : [...current, word];
  return selectVocabWords(db, materialId, next);
}

export function createAssignment(
  db: Database,
  classId: string,
  materialId: string,
  wordIds: string[],
): { db: Database; assignment: Assignment } {
  const existing = db.assignments.find((a) => a.materialId === materialId);
  if (existing) {
    const updated: Assignment = { ...existing, wordIds, status: 'ACTIVE' };
    return {
      db: {
        ...db,
        assignments: db.assignments.map((a) =>
          a.id === existing.id ? updated : a,
        ),
      },
      assignment: updated,
    };
  }
  const assignment: Assignment = {
    id: uid('as'),
    classId,
    materialId,
    wordIds,
    phase1Unlocked: true,
    phase2Unlocked: false,
    phase3Unlocked: false,
    status: 'ACTIVE',
    dueAt: null,
  };
  return {
    db: { ...db, assignments: [...db.assignments, assignment] },
    assignment,
  };
}

export function unlockPhase(
  db: Database,
  assignmentId: string,
  phase: AssignmentPhase,
): { db: Database; assignment: Assignment } {
  const key =
    phase === 'PREDICT'
      ? 'phase1Unlocked'
      : phase === 'CONFIRM'
        ? 'phase2Unlocked'
        : 'phase3Unlocked';
  let updated: Assignment | undefined;
  const assignments = db.assignments.map((a) => {
    if (a.id !== assignmentId) return a;
    updated = { ...a, [key]: !a[key] };
    return updated;
  });
  if (!updated) {
    throw new Error(`unlockPhase: no assignment with id ${assignmentId}`);
  }
  return { db: { ...db, assignments }, assignment: updated };
}

export function submitWordResponse(
  db: Database,
  assignmentId: string,
  studentId: string,
  wordId: string,
  phase: AssignmentPhase,
  text: string,
): { db: Database; response: WordResponse } {
  const response: WordResponse = {
    id: uid('r'),
    assignmentId,
    studentId,
    wordId,
    phase,
    text,
    grade: null,
    feedback: '',
    submittedAt: new Date().toISOString(),
  };
  return { db: { ...db, responses: [...db.responses, response] }, response };
}

export function gradeWordResponse(
  db: Database,
  responseId: string,
  grade: 0 | 1 | 2,
  feedback?: string,
): { db: Database; response: WordResponse } {
  let updated: WordResponse | undefined;
  const responses = db.responses.map((r) => {
    if (r.id !== responseId) return r;
    updated = { ...r, grade, feedback: feedback ?? r.feedback };
    return updated;
  });
  if (!updated) {
    throw new Error(`gradeWordResponse: no response with id ${responseId}`);
  }
  return { db: { ...db, responses }, response: updated };
}

export function chooseAvatar(
  db: Database,
  studentId: string,
  avatarId: string,
): { db: Database; student: Student } {
  let updated: Student | undefined;
  const students = db.students.map((s) => {
    if (s.id !== studentId) return s;
    updated = { ...s, avatarId };
    return updated;
  });
  if (!updated) {
    throw new Error(`chooseAvatar: no student with id ${studentId}`);
  }
  return { db: { ...db, students }, student: updated };
}

/** Pure streak update: continues on a consecutive day, resets after a gap,
 *  no-ops if practice already happened today. This is the one piece of logic
 *  worth unit-testing in isolation — see tests/logic.test.ts. */
export function recordPracticeToday(
  student: Student,
  today: string = todayStr(),
): Student {
  if (student.lastPracticeDate === today) return student;
  const continuing =
    student.lastPracticeDate !== null &&
    daysBetween(student.lastPracticeDate, today) === 1;
  return {
    ...student,
    streakCount: continuing ? student.streakCount + 1 : 1,
    lastPracticeDate: today,
  };
}

export function submitExtraPracticeAttempt(
  db: Database,
  studentId: string,
  correct: boolean,
): { db: Database; student: Student } {
  let updated: Student | undefined;
  const students = db.students.map((s) => {
    if (s.id !== studentId) return s;
    updated = correct ? recordPracticeToday(s) : s;
    return updated;
  });
  if (!updated) {
    throw new Error(
      `submitExtraPracticeAttempt: no student with id ${studentId}`,
    );
  }
  return { db: { ...db, students }, student: updated };
}
