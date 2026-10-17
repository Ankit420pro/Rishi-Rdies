import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const DEVELOPMENT_OTP = '1234';

export function createOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function hashOtp(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

export function otpMatches(code: string, expectedHash: string): boolean {
  const candidate = Buffer.from(hashOtp(code), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function isOtpUsable(challenge: {
  expiresAt: Date;
  consumedAt: Date | null;
  attempts: number;
}, now = new Date()): boolean {
  return challenge.consumedAt === null && challenge.expiresAt > now && challenge.attempts < OTP_MAX_ATTEMPTS;
}