import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { confirmPasswordResetOtp } from '@/lib/auth/passwordReset';
import { createSession, toPublicUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  const newPassword =
    typeof body?.newPassword === 'string' ? body.newPassword : '';

  if (!email || !code || !newPassword) {
    return NextResponse.json(
      { error: 'Бүх талбарыг бөглөнө үү.' },
      { status: 400 },
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: 'Нууц үг дор хаяж 8 тэмдэгт байх ёстой.' },
      { status: 400 },
    );
  }

  const ok = await confirmPasswordResetOtp(email, code, newPassword);
  if (!ok) {
    return NextResponse.json(
      { error: 'Код буруу эсвэл хугацаа нь дууссан байна.' },
      { status: 400 },
    );
  }

  // Reset succeeded — sign the user in right away rather than sending them
  // back to the login form.
  const user = await getDb().user.findUniqueOrThrow({ where: { email } });
  const token = await createSession(user.id);
  return NextResponse.json({ token, user: toPublicUser(user) });
}
