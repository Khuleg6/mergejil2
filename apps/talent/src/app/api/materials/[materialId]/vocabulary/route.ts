import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';

type Context = { params: Promise<{ materialId: string }> };
type Selection = { word: string; position: number };

const parseSelections = (value: unknown): Selection[] | null => {
  if (!Array.isArray(value) || value.length > 200) return null;
  const selections: Selection[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || !('word' in item) || !('position' in item) || typeof item.word !== 'string' || !Number.isInteger(item.position)) return null;
    selections.push({ word: item.word, position: item.position as number });
  }
  return selections;
};

export async function PUT(request: Request, context: Context) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { database } = await import('@/lib/database');
  const { requireOwnedMaterial } = await import('@/lib/materials');
  try {
    const { materialId } = await context.params; const material = await requireOwnedMaterial(materialId);
    if (!material) return jsonError('Reading material not found.', 404);
    const selections = parseSelections((await readJsonObject(request))?.words);
    if (!selections) return jsonError('Words must be a valid selection array.', 400);
    const positions = new Set<number>();
    for (const selection of selections) {
      if (!selection.word || selection.position < 0 || positions.has(selection.position) || material.bodyText.slice(selection.position, selection.position + selection.word.length) !== selection.word) return jsonError('A vocabulary word or position is invalid or duplicated.', 400);
      positions.add(selection.position);
    }
    const words = await database.$transaction(async (transaction) => {
      await transaction.vocabWord.deleteMany({ where: { materialId } });
      if (selections.length) await transaction.vocabWord.createMany({ data: selections.map((selection) => ({ materialId, ...selection })) });
      return transaction.vocabWord.findMany({ where: { materialId }, orderBy: { position: 'asc' }, select: { id: true, word: true, position: true, pictureUrl: true } });
    });
    return jsonSuccess({ words });
  } catch (error) { return authorizationErrorResponse(error); }
}
