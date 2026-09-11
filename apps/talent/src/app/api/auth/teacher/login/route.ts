import { compare } from 'bcryptjs';
import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';
import { isEmail, normalizeEmail } from '@/lib/validation';

export async function POST(request: Request) {
  const { database } = await import('@/lib/database');
  const { createSession } = await import('@/lib/session');
  const body = await readJsonObject(request);
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!isEmail(email) || !password) return jsonError('Valid email and password are required.', 400);
  const teacher = await database.teacher.findUnique({ where: { email }, include: { user: true } });
  if (!teacher || !(await compare(password, teacher.passwordHash))) return jsonError('Email or password is incorrect.', 401);
  await createSession(teacher.userId);
  return jsonSuccess({ user: { id: teacher.user.id, name: teacher.user.name, role: teacher.user.role, email: teacher.email } });
}
