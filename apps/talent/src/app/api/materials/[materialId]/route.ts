import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';

type Context = { params: Promise<{ materialId: string }> };

export async function GET(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { requireOwnedMaterial } = await import('@/lib/materials');
  try {
    const material = await requireOwnedMaterial((await context.params).materialId);
    if (!material) return jsonError('Reading material not found.', 404);
    return jsonSuccess({ material: { id: material.id, classId: material.classId, title: material.title, bodyText: material.bodyText, vocabWords: material.vocabWords.map(({ id, word, position, pictureUrl }) => ({ id, word, position, pictureUrl })) } });
  } catch (error) { return authorizationErrorResponse(error); }
}

export async function PATCH(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { database } = await import('@/lib/database');
  const { readMaterialInput, requireOwnedMaterial } = await import('@/lib/materials');
  try {
    const { materialId } = await context.params; const existing = await requireOwnedMaterial(materialId);
    if (!existing) return jsonError('Reading material not found.', 404);
    const input = readMaterialInput(await readJsonObject(request));
    if (!input.title || !input.bodyText) return jsonError('Title and reading text are required.', 400);
    const bodyChanged = input.bodyText !== existing.bodyText;
    if (bodyChanged && existing._count.assignments > 0) return jsonError('Reading text cannot change after this material is used by an assignment.', 409);
    const material = await database.$transaction(async (transaction) => {
      if (bodyChanged) await transaction.vocabWord.deleteMany({ where: { materialId } });
      return transaction.readingMaterial.update({ where: { id: materialId }, data: input, select: { id: true, classId: true, title: true, bodyText: true } });
    });
    return jsonSuccess({ material, vocabularyCleared: bodyChanged && existing.vocabWords.length > 0 });
  } catch (error) { return authorizationErrorResponse(error); }
}

export async function DELETE(_request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { database } = await import('@/lib/database');
  const { requireOwnedMaterial } = await import('@/lib/materials');
  try {
    const { materialId } = await context.params; const existing = await requireOwnedMaterial(materialId);
    if (!existing) return jsonError('Reading material not found.', 404);
    if (existing._count.assignments > 0) return jsonError('Remove this material from its assignments before deleting it.', 409);
    await database.readingMaterial.delete({ where: { id: materialId } });
    return jsonSuccess({ deleted: true });
  } catch (error) { return authorizationErrorResponse(error); }
}
