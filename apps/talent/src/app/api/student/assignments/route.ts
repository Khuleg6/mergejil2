import { jsonSuccess } from '@/lib/http';

export async function GET() {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { database } = await import('@/lib/database');
  const { requireStudent } = await import('@/lib/session');
  try {
    const user = await requireStudent(); if (!user.student) throw new Error('Student profile is missing');
    const assignments = await database.assignment.findMany({ where: { status: 'ACTIVE', class: { students: { some: { studentId: user.student.id } } } }, include: { material: { select: { title: true, bodyText: true } }, vocabulary: { include: { vocabWord: true } }, responses: { where: { studentId: user.student.id }, orderBy: { submittedAt: 'asc' } } }, orderBy: { dueAt: 'asc' } });
    return jsonSuccess({ assignments });
  } catch (error) { return authorizationErrorResponse(error); }
}
