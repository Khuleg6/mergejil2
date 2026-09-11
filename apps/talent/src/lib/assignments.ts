import type { AssignmentPhase } from '@/generated/prisma/client';
import { database } from './database';
import { requireStudent, requireTeacher } from './session';

export const phases = ['PREDICT', 'CONFIRM', 'APPLY'] as const satisfies readonly AssignmentPhase[];
export const isPhase = (value: unknown): value is AssignmentPhase => typeof value === 'string' && phases.includes(value as AssignmentPhase);

export const requireOwnedAssignment = async (assignmentId: string) => {
  const user = await requireTeacher();
  if (!user.teacher) throw new Error('Teacher profile is missing');
  return database.assignment.findFirst({ where: { id: assignmentId, class: { teacherId: user.teacher.id } } });
};

export const requireEnrolledAssignment = async (assignmentId: string) => {
  const user = await requireStudent();
  if (!user.student) throw new Error('Student profile is missing');
  const assignment = await database.assignment.findFirst({
    where: { id: assignmentId, class: { students: { some: { studentId: user.student.id } } } },
    include: { vocabulary: { select: { vocabWordId: true } } },
  });
  return { assignment, student: user.student };
};

export const phaseUnlocked = (assignment: { phase1Unlocked: boolean; phase2Unlocked: boolean; phase3Unlocked: boolean }, phase: AssignmentPhase) =>
  phase === 'PREDICT' ? assignment.phase1Unlocked : phase === 'CONFIRM' ? assignment.phase2Unlocked : assignment.phase3Unlocked;
