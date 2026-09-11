import { jsonError, jsonSuccess } from '@/lib/http';

type Context = { params: Promise<{ classId: string; studentId: string }> };

export async function DELETE(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId, studentId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    const removed = await database.classStudent.deleteMany({ where: { classId, studentId } });
    if (!removed.count) return jsonError('Student is not a member of this class.', 404);
    return jsonSuccess({ removed: true });
  } catch (error) { return authorizationErrorResponse(error); }
}
