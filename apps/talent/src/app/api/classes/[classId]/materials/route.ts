import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';

type Context = { params: Promise<{ classId: string }> };

export async function GET(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    const materials = await database.readingMaterial.findMany({ where: { classId }, orderBy: { title: 'asc' }, select: { id: true, classId: true, title: true, _count: { select: { vocabWords: true } } } });
    return jsonSuccess({ materials: materials.map(({ _count, ...material }) => ({ ...material, vocabularyCount: _count.vocabWords })) });
  } catch (error) { return authorizationErrorResponse(error); }
}

export async function POST(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { findOwnedClass, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  const { readMaterialInput } = await import('@/lib/materials');
  try {
    const teacher = await requireTeacherProfile(); const { classId } = await context.params;
    if (!(await findOwnedClass(classId, teacher.id))) return jsonError('Class not found.', 404);
    const input = readMaterialInput(await readJsonObject(request));
    if (!input.title || !input.bodyText) return jsonError('Title and reading text are required.', 400);
    const material = await database.readingMaterial.create({ data: { classId, ...input }, select: { id: true, classId: true, title: true, bodyText: true } });
    return jsonSuccess({ material }, 201);
  } catch (error) { return authorizationErrorResponse(error); }
}
