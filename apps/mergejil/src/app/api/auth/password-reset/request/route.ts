import { NextResponse } from 'next/server';
import { requestPasswordResetOtp } from '@/lib/auth/passwordReset';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email) {
    return NextResponse.json(
      { error: 'И-мэйл хаягаа оруулна уу.' },
      { status: 400 },
    );
  }

  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to enumerate registered emails. Unexpected
  // failures (e.g. SMTP misconfigured) are logged, not surfaced to the caller.
  await requestPasswordResetOtp(email).catch((err) => {
    console.error('requestPasswordResetOtp failed:', err);
  });

  return NextResponse.json({
    ok: true,
    message: 'Хэрэв энэ и-мэйл хаягаар бүртгэл байгаа бол сэргээх код илгээгдлээ.',
  });
}
