import { database } from './database';
import { requireTeacherProfile } from './classes';

export const findOwnedMaterial = async (materialId: string, teacherId: string) =>
  database.readingMaterial.findFirst({
    where: { id: materialId, class: { teacherId } },
    include: { vocabWords: { orderBy: { position: 'asc' } }, _count: { select: { assignments: true } } },
  });

export const requireOwnedMaterial = async (materialId: string) => {
  const teacher = await requireTeacherProfile();
  return findOwnedMaterial(materialId, teacher.id);
};

export const readMaterialInput = (body: Record<string, unknown> | null) => {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const bodyText = typeof body?.bodyText === 'string' ? body.bodyText.trim() : '';
  return {
    title: title.length >= 1 && title.length <= 160 ? title : '',
    bodyText: bodyText.length >= 1 && bodyText.length <= 100_000 ? bodyText : '',
  };
};
