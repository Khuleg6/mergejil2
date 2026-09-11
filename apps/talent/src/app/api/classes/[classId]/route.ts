import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';
import { readClassName } from '@/lib/validation';

type Context = { params: Promise<{ classId: string }> };

export async function GET(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { classDetailsInclude, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    const found = await database.class.findFirst({ where: { id: classId, teacherId: teacher.id }, include: classDetailsInclude });
    if (!found) return jsonError('Class not found.', 404);
    return jsonSuccess({ class: { id: found.id, name: found.name, createdAt: found.createdAt, students: found.students.map(({ student, joinedAt }) => ({ id: student.id, name: student.user.name, phoneNumber: student.phoneNumber, readingLevel: student.readingLevel, joinedAt })) } });
  } catch (error) { return authorizationErrorResponse(error); }
}

export async function PATCH(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    const body = await readJsonObject(request); const name = readClassName(body?.name);
    if (!name) return jsonError('Class name must be between 1 and 80 characters.', 400);
    const updated = await database.class.update({ where: { id: classId }, data: { name }, select: { id: true, name: true, createdAt: true } });
    return jsonSuccess({ class: updated });
  } catch (error) { return authorizationErrorResponse(error); }
}

export async function DELETE(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    await database.class.delete({ where: { id: classId } });
    return jsonSuccess({ deleted: true });
  } catch (error) { return authorizationErrorResponse(error); }
}
