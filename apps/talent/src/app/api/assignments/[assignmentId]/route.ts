import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';

type Context = { params: Promise<{ assignmentId: string }> };
export async function GET(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { requireOwnedAssignment } = await import('@/lib/assignments');
  const { database } = await import('@/lib/database');
  try {
    const { assignmentId } = await context.params;
    if (!(await requireOwnedAssignment(assignmentId))) return jsonError('Assignment not found.', 404);
    const assignment = await database.assignment.findUnique({ where: { id: assignmentId }, include: { material: { select: { title: true } }, vocabulary: { include: { vocabWord: true } }, class: { include: { students: { include: { student: { include: { user: true, responses: { where: { assignmentId }, orderBy: { submittedAt: 'asc' } } } } } } } } } });
    return jsonSuccess({ assignment });
  } catch (error) { return authorizationErrorResponse(error); }
}
export async function PATCH(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { requireOwnedAssignment } = await import('@/lib/assignments');
  const { database } = await import('@/lib/database');
  try {
    const { assignmentId } = await context.params;
    if (!(await requireOwnedAssignment(assignmentId))) return jsonError('Assignment not found.', 404);
    const status = (await readJsonObject(request))?.status;
    if (status !== 'DRAFT' && status !== 'ACTIVE' && status !== 'CLOSED') return jsonError('Invalid assignment status.', 400);
    const assignment = await database.assignment.update({ where: { id: assignmentId }, data: { status } });
    return jsonSuccess({ assignment });
  } catch (error) { return authorizationErrorResponse(error); }
}
