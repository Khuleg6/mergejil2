import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';

type Context = { params: Promise<{ assignmentId: string }> };
export async function PATCH(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { isPhase, requireOwnedAssignment } = await import('@/lib/assignments');
  const { database } = await import('@/lib/database');
  try {
    const { assignmentId } = await context.params;
    if (!(await requireOwnedAssignment(assignmentId))) return jsonError('Assignment not found.', 404);
    const body = await readJsonObject(request); const phase = body?.phase; const unlocked = body?.unlocked;
    if (!isPhase(phase) || typeof unlocked !== 'boolean') return jsonError('A valid phase and unlocked state are required.', 400);
    const field = phase === 'PREDICT' ? 'phase1Unlocked' : phase === 'CONFIRM' ? 'phase2Unlocked' : 'phase3Unlocked';
    const assignment = await database.assignment.update({ where: { id: assignmentId }, data: { [field]: unlocked } });
    return jsonSuccess({ assignment });
  } catch (error) { return authorizationErrorResponse(error); }
}
