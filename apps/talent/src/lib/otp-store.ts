import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

type OtpRecord = { codeHash: string; expiresAt: number; attempts: number; requestedAt: number };
export type OtpVerification = 'valid' | 'invalid' | 'expired' | 'missing';

export interface OtpStore {
  issue(phoneNumber: string): Promise<{ code: string; retryAfterSeconds?: number }>;
  verify(phoneNumber: string, code: string): Promise<OtpVerification>;
}

const records = new Map<string, OtpRecord>();
const OTP_TTL_MS = 5 * 60 * 1000;
const REQUEST_WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const hash = (phone: string, code: string) =>
  createHash('sha256').update(`${phone}:${code}:${process.env.OTP_PEPPER || 'development-only'}`).digest('hex');

class DevelopmentOtpStore implements OtpStore {
  async issue(phoneNumber: string) {
    const existing = records.get(phoneNumber);
    if (existing && Date.now() - existing.requestedAt < REQUEST_WINDOW_MS) {
      return { code: '', retryAfterSeconds: Math.ceil((REQUEST_WINDOW_MS - Date.now() + existing.requestedAt) / 1000) };
    }
    const code = randomInt(100000, 1000000).toString();
    records.set(phoneNumber, { codeHash: hash(phoneNumber, code), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0, requestedAt: Date.now() });
    return { code };
  }

  async verify(phoneNumber: string, code: string): Promise<OtpVerification> {
    const record = records.get(phoneNumber);
    if (!record) return 'missing';
    if (Date.now() >= record.expiresAt) { records.delete(phoneNumber); return 'expired'; }
    record.attempts += 1;
    if (record.attempts > MAX_ATTEMPTS) { records.delete(phoneNumber); return 'invalid'; }
    const supplied = Buffer.from(hash(phoneNumber, code), 'hex');
    const expected = Buffer.from(record.codeHash, 'hex');
    if (!timingSafeEqual(supplied, expected)) return 'invalid';
    records.delete(phoneNumber);
    return 'valid';
  }
}

export const otpStore: OtpStore = new DevelopmentOtpStore();
