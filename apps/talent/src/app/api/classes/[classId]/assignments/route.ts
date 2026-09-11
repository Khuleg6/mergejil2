import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';

type Context = { params: Promise<{ classId: string }> };

export async function GET(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    const assignments = await database.assignment.findMany({ where: { classId }, orderBy: { id: 'desc' }, include: { material: { select: { title: true } }, _count: { select: { vocabulary: true, responses: true } } } });
    return jsonSuccess({ assignments: assignments.map(({ _count, material, ...item }) => ({ ...item, materialTitle: material.title, wordCount: _count.vocabulary, responseCount: _count.responses })) });
  } catch (error) { return authorizationErrorResponse(error); }
}

export async function POST(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    const body = await readJsonObject(request); const materialId = typeof body?.materialId === 'string' ? body.materialId : '';
    const wordIds = Array.isArray(body?.wordIds) && body.wordIds.every((id) => typeof id === 'string') ? [...new Set(body.wordIds as string[])] : [];
    const dueAt = body?.dueAt === null || body?.dueAt === '' || body?.dueAt === undefined ? null : typeof body.dueAt === 'string' && !Number.isNaN(Date.parse(body.dueAt)) ? new Date(body.dueAt) : undefined;
    if (!materialId || !wordIds.length || dueAt === undefined) return jsonError('Material, at least one vocabulary word, and a valid due date are required.', 400);
    const material = await database.readingMaterial.findFirst({ where: { id: materialId, classId }, include: { vocabWords: { where: { id: { in: wordIds } }, select: { id: true } } } });
    if (!material || material.vocabWords.length !== wordIds.length) return jsonError('Material or vocabulary selection is invalid.', 400);
    const assignment = await database.assignment.create({ data: { classId, materialId, dueAt, status: 'DRAFT', phase1Unlocked: false, phase2Unlocked: false, phase3Unlocked: false, vocabulary: { create: wordIds.map((vocabWordId) => ({ vocabWordId })) } }, include: { material: { select: { title: true } }, vocabulary: { include: { vocabWord: true } } } });
    return jsonSuccess({ assignment }, 201);
  } catch (error) { return authorizationErrorResponse(error); }
}
