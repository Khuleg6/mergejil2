import { randomInt } from 'node:crypto';
import { getDb } from '@/lib/db';
import { sendPasswordResetOtpEmail } from '@/lib/email';
import { hashPassword, verifyPassword } from './password';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

/**
 * Issues a fresh reset code for `email` and emails it, if an account with
 * that email exists. Always resolves without throwing on "not found" so the
 * caller can respond identically either way (no email enumeration).
 */
export async function requestPasswordResetOtp(email: string): Promise<void> {
  const db = getDb();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return;

  // Invalidate any codes still outstanding for this user before issuing a new one.
  await db.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const code = generateOtp();
  const tokenHash = await hashPassword(code);
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token: tokenHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  await sendPasswordResetOtpEmail(email, code);
}

/**
 * Verifies `code` for `email` and, if valid, sets the new password. Returns
 * false on any mismatch/expiry (caller treats every failure identically).
 */
export async function confirmPasswordResetOtp(
  email: string,
  code: string,
  newPassword: string,
): Promise<boolean> {
  const db = getDb();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return false;

  const candidates = await db.passwordResetToken.findMany({
    where: { userId: user.id, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  for (const candidate of candidates) {
    if (await verifyPassword(code, candidate.token)) {
      const passwordHash = await hashPassword(newPassword);
      await db.$transaction([
        db.user.update({ where: { id: user.id }, data: { passwordHash } }),
        db.passwordResetToken.update({
          where: { id: candidate.id },
          data: { used: true },
        }),
      ]);
      return true;
    }
  }

  return false;
}
