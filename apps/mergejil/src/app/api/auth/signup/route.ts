import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { createSession, toPublicUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: 'Бүх талбарыг бөглөнө үү.' },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Нууц үг дор хаяж 8 тэмдэгт байх ёстой.' },
      { status: 400 },
    );
  }

  const db = getDb();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: 'Энэ имэйл хаягаар бүртгэл үүссэн байна.' },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { fullName, email, passwordHash },
  });

  const token = await createSession(user.id);
  return NextResponse.json(
    { token, user: toPublicUser(user) },
    { status: 201 },
  );
}
