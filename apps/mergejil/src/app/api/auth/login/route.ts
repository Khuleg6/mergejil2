import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, toPublicUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Имэйл, нууц үгээ оруулна уу.' },
      { status: 400 },
    );
  }

  const user = await getDb().user.findUnique({ where: { email } });
  // A user created via Google will have no passwordHash yet — treat that
  // the same as a wrong password rather than leaking which case it is.
  const valid = user?.passwordHash
    ? await verifyPassword(password, user.passwordHash)
    : false;

  if (!user || !valid) {
    return NextResponse.json(
      { error: 'Имэйл эсвэл нууц үг буруу байна.' },
      { status: 401 },
    );
  }

  const token = await createSession(user.id);
  return NextResponse.json({ token, user: toPublicUser(user) });
}
