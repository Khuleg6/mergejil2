import { jsonSuccess } from '@/lib/http';

export async function GET() {
  const { authorizationErrorResponse } = await import('@/lib/api-authorization');
  const { requireTeacher } = await import('@/lib/session');
  try { const user = await requireTeacher(); return jsonSuccess({ user: { id: user.id, name: user.name, role: user.role } }); }
  catch (error) { return authorizationErrorResponse(error); }
}
