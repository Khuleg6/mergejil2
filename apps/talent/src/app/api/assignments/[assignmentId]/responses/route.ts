import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';

type Context = { params: Promise<{ assignmentId: string }> };
export async function POST(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { isPhase, phaseUnlocked, requireEnrolledAssignment } = await import('@/lib/assignments');
  const { database } = await import('@/lib/database');
  try {
    const { assignmentId } = await context.params; const { assignment, student } = await requireEnrolledAssignment(assignmentId);
    if (!assignment) return jsonError('Assignment not found.', 404);
    if (assignment.status !== 'ACTIVE') return jsonError('Assignment is not active.', 409);
    const body = await readJsonObject(request); const wordId = typeof body?.wordId === 'string' ? body.wordId : ''; const phase = body?.phase; const text = typeof body?.text === 'string' ? body.text.trim() : '';
    if (!wordId || !isPhase(phase) || !text || text.length > 5000) return jsonError('Word, phase, and a response of up to 5000 characters are required.', 400);
    if (!phaseUnlocked(assignment, phase)) return jsonError('This phase is locked.', 403);
    if (!assignment.vocabulary.some((item) => item.vocabWordId === wordId)) return jsonError('Word is not part of this assignment.', 400);
    const existing = await database.wordResponse.findUnique({ where: { assignmentId_studentId_vocabWordId_phase: { assignmentId, studentId: student.id, vocabWordId: wordId, phase } } });
    if (existing) return jsonError('This response has already been submitted and cannot be changed.', 409);
    if (phase !== 'PREDICT') {
      const requiredPhase = phase === 'CONFIRM' ? 'PREDICT' : 'CONFIRM';
      const prerequisite = await database.wordResponse.findUnique({ where: { assignmentId_studentId_vocabWordId_phase: { assignmentId, studentId: student.id, vocabWordId: wordId, phase: requiredPhase } } });
      if (!prerequisite) return jsonError(`${requiredPhase} must be submitted first.`, 409);
    }
    const response = await database.wordResponse.create({ data: { assignmentId, studentId: student.id, vocabWordId: wordId, phase, text } });
    return jsonSuccess({ response }, 201);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') return jsonError('This response has already been submitted.', 409);
    return authorizationErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { requireOwnedAssignment } = await import('@/lib/assignments');
  const { database } = await import('@/lib/database');
  try {
    const { assignmentId } = await context.params;
    if (!(await requireOwnedAssignment(assignmentId))) return jsonError('Assignment not found.', 404);
    const body = await readJsonObject(request);
    const responseId = typeof body?.responseId === 'string' ? body.responseId : '';
    const grade = typeof body?.grade === 'number' ? body.grade : Number.NaN;
    const feedback = typeof body?.feedback === 'string' ? body.feedback.trim() : '';
    const response = responseId ? await database.wordResponse.findFirst({ where: { id: responseId, assignmentId } }) : null;
    if (!response) return jsonError('Response not found.', 404);
    if (response.phase === 'PREDICT') return jsonError('Predict responses are not graded.', 400);
    const maximumGrade = response.phase === 'CONFIRM' ? 4 : 5;
    if (!Number.isInteger(grade) || grade < 0 || grade > maximumGrade) return jsonError(`Grade must be a whole number from 0 to ${maximumGrade}.`, 400);
    if (!feedback || feedback.length > 2000) return jsonError('Feedback of up to 2000 characters is required.', 400);
    const updatedResponse = await database.wordResponse.update({ where: { id: response.id }, data: { grade, feedback } });
    return jsonSuccess({ response: updatedResponse });
  } catch (error) { return authorizationErrorResponse(error); }
}
