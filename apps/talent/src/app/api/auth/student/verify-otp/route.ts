import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';
import { otpStore } from '@/lib/otp-store';
import { normalizePhoneNumber } from '@/lib/validation';

export async function POST(request: Request) {
  const { database } = await import('@/lib/database');
  const { createSession } = await import('@/lib/session');
  const body = await readJsonObject(request);
  const phoneNumber = normalizePhoneNumber(body?.phoneNumber);
  const code = typeof body?.code === 'string' && /^\d{6}$/.test(body.code) ? body.code : '';
  if (!phoneNumber || !code) return jsonError('A valid phone number and six-digit code are required.', 400);
  const verification = await otpStore.verify(phoneNumber, code);
  if (verification !== 'valid') return jsonError(verification === 'expired' ? 'The code has expired.' : 'The code is invalid.', 401);
  const student = await database.student.findUnique({ where: { phoneNumber }, include: { user: true } });
  if (!student) return jsonError('Student account not found.', 404);
  await createSession(student.userId);
  return jsonSuccess({ user: { id: student.user.id, name: student.user.name, role: student.user.role, phoneNumber } });
}
