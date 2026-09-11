import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';
import { normalizePhoneNumber } from '@/lib/validation';

type Context = { params: Promise<{ classId: string }> };

export async function POST(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    const body = await readJsonObject(request); const phoneNumber = normalizePhoneNumber(body?.phoneNumber);
    if (!phoneNumber) return jsonError('Use an eight-digit Mongolian or international phone number.', 400);
    const student = await database.$transaction(async (transaction) => {
      const existing = await transaction.student.findUnique({ where: { phoneNumber }, include: { user: true } });
      if (existing) return existing;
      return transaction.student.create({ data: { phoneNumber, user: { create: { name: phoneNumber, role: 'STUDENT' } } }, include: { user: true } });
    });
    const duplicate = await database.classStudent.findUnique({ where: { classId_studentId: { classId, studentId: student.id } } });
    if (duplicate) return jsonError('This student is already in the class.', 409);
    const membership = await database.classStudent.create({ data: { classId, studentId: student.id } });
    return jsonSuccess({ student: { id: student.id, name: student.user.name, phoneNumber: student.phoneNumber, readingLevel: student.readingLevel, joinedAt: membership.joinedAt, newlyCreated: student.user.name === phoneNumber } }, 201);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') return jsonError('This student is already in the class.', 409);
    return authorizationErrorResponse(error);
  }
}
