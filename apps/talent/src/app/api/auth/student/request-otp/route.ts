import { jsonError, jsonSuccess, readJsonObject } from '@/lib/http';
import { otpStore } from '@/lib/otp-store';
import { normalizePhoneNumber } from '@/lib/validation';

export async function POST(request: Request) {
  const { database } = await import('@/lib/database');
  const body = await readJsonObject(request);
  const phoneNumber = normalizePhoneNumber(body?.phoneNumber);
  if (!phoneNumber) return jsonError('Use an international phone number such as +97699112233.', 400);
  const student = await database.student.findUnique({ where: { phoneNumber }, select: { id: true } });
  if (!student) return jsonError('No student account is registered for this phone number.', 404);
  const result = await otpStore.issue(phoneNumber);
  if (result.retryAfterSeconds) return jsonError(`Please wait ${result.retryAfterSeconds} seconds before requesting another code.`, 429);
  // A production provider must send result.code by SMS and must never include it here.
  return jsonSuccess({ expiresInSeconds: 300, ...(process.env.NODE_ENV === 'development' ? { developmentOtp: result.code } : {}) });
}
