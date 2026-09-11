import { randomBytes } from 'node:crypto';
import type { User as UserRow } from '@prisma/client';
import { getDb } from '@/lib/db';
import type { User } from '@/lib/types';
import type { GoogleProfile } from './google';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function toPublicUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    avatarUrl: row.avatarUrl,
    isDemo: row.isDemo,
    emailVerified: row.emailVerified,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Creates a DB-backed session for `userId` and returns its opaque token. */
export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  await getDb().session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });
  return token;
}

/**
 * Resolves a Google profile to an EXISTING local user only — Google sign-in
 * does not create accounts. Links this Google account to a matching-email
 * user the first time they use it, otherwise returns null (no account yet).
 */
export async function findUserForGoogleLogin(
  profile: GoogleProfile,
): Promise<UserRow | null> {
  const db = getDb();

  const existingAccount = await db.oAuthAccount.findUnique({
    where: {
      provider_providerUserId: {
        provider: 'google',
        providerUserId: profile.sub,
      },
    },
    include: { user: true },
  });
  if (existingAccount) return existingAccount.user;

  const user = await db.user.findUnique({ where: { email: profile.email } });
  if (!user) return null;

  await db.oAuthAccount.create({
    data: { userId: user.id, provider: 'google', providerUserId: profile.sub },
  });

  return user;
}

/** Deletes the session matching `token`, if any (used for logout). */
export async function deleteSession(token: string): Promise<void> {
  await getDb().session.deleteMany({ where: { token } });
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}

/** Full DB row for the caller of `request`, or null if unauthenticated/expired. */
export async function getAuthenticatedUser(
  request: Request,
): Promise<UserRow | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const session = await getDb().session.findFirst({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await deleteSession(token);
    return null;
  }

  return session.user;
}

/** Public-shape user (no passwordHash) for the caller of `request`. */
export async function getUserFromRequest(request: Request): Promise<User | null> {
  const row = await getAuthenticatedUser(request);
  return row ? toPublicUser(row) : null;
}

export { getBearerToken };
