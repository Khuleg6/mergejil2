import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';
import { readClassName } from '@/lib/validation';

export async function GET() {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { classSummarySelect, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile();
    const classes = await database.class.findMany({ where: { teacherId: teacher.id }, orderBy: { createdAt: 'desc' }, select: classSummarySelect });
    return jsonSuccess({ classes: classes.map(({ _count, ...item }) => ({ ...item, studentCount: _count.students })) });
  } catch (error) { return authorizationErrorResponse(error); }
}

export async function POST(request: Request) {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { classSummarySelect, requireTeacherProfile } = await import('@/lib/classes');
  const { database } = await import('@/lib/database');
  try {
    const teacher = await requireTeacherProfile();
    const body = await readJsonObject(request);
    const name = readClassName(body?.name);
    if (!name) return jsonError('Class name must be between 1 and 80 characters.', 400);
    const created = await database.class.create({ data: { name, teacherId: teacher.id }, select: classSummarySelect });
    const { _count, ...item } = created;
    return jsonSuccess({ class: { ...item, studentCount: _count.students } }, 201);
  } catch (error) { return authorizationErrorResponse(error); }
}
