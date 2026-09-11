import { hash } from 'bcryptjs';
import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';
import { isEmail, normalizeEmail, readName, readPassword } from '@/lib/validation';

export async function POST(request: Request) {
  const { database } = await import('@/lib/database');
  const { createSession } = await import('@/lib/session');
  const body = await readJsonObject(request);
  const name = readName(body?.name);
  const email = normalizeEmail(body?.email);
  const password = readPassword(body?.password);
  if (!name || !isEmail(email) || !password) return jsonError('Valid name, email, and password (8–128 characters) are required.', 400);
  if (await database.teacher.findUnique({ where: { email }, select: { id: true } })) return jsonError('An account with this email already exists.', 409);
  const passwordHash = await hash(password, 12);
  try {
    const teacher = await database.teacher.create({
      data: { email, passwordHash, user: { create: { name, role: 'TEACHER' } } },
      include: { user: true },
    });
    await createSession(teacher.userId);
    return jsonSuccess({ user: { id: teacher.user.id, name: teacher.user.name, role: teacher.user.role, email: teacher.email } }, 201);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') return jsonError('An account with this email already exists.', 409);
    throw error;
  }
}
