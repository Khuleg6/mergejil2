import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { database } from './database';
import type { Role } from '@/generated/prisma/client';

const SESSION_AGE_SECONDS = 60 * 60 * 24 * 7;
const cookieName = () => process.env.SESSION_COOKIE_NAME || 'talent_session';
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const createSession = async (userId: string) => {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_AGE_SECONDS * 1000);
  await database.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } });
  const store = await cookies();
  store.set(cookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_AGE_SECONDS,
    expires: expiresAt,
  });
};

export const clearSession = async () => {
  const store = await cookies();
  const token = store.get(cookieName())?.value;
  if (token) await database.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  store.delete(cookieName());
};

export const getCurrentUser = async () => {
  const token = (await cookies()).get(cookieName())?.value;
  if (!token) return null;
  const session = await database.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { teacher: true, student: true } } },
  });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await database.session.delete({ where: { id: session.id } });
    return null;
  }
  return session.user;
};

export class AuthorizationError extends Error {
  constructor(public readonly status: 401 | 403) {
    super(status === 401 ? 'Authentication required' : 'Insufficient permissions');
  }
}

export const requireUser = async () => {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError(401);
  return user;
};

const requireRole = async (role: Role) => {
  const user = await requireUser();
  if (user.role !== role) throw new AuthorizationError(403);
  return user;
};

export const requireTeacher = () => requireRole('TEACHER');
export const requireStudent = () => requireRole('STUDENT');
