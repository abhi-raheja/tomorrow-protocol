import crypto from 'crypto';

export type PendingEntry = {
  code: string;
  email: string;
  xHandle: string;
  expiresAt: number;
  attempts: number;
  sendCount: number;
  sendWindowStart: number;
};

const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export const pendingCodes = new Map<string, PendingEntry>();

function cleanupExpired() {
  const now = Date.now();
  for (const [key, entry] of pendingCodes) {
    if (entry.expiresAt <= now) {
      pendingCodes.delete(key);
    }
  }
}

function generateCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

export function createPendingCode(email: string, xHandle: string): { code: string } | { error: string } {
  cleanupExpired();

  const key = email.toLowerCase();
  const now = Date.now();
  const existing = pendingCodes.get(key);

  // Per-email send rate limit
  if (existing && existing.sendWindowStart + SEND_WINDOW_MS > now) {
    if (existing.sendCount >= MAX_SENDS_PER_WINDOW) {
      return { error: 'Too many code requests. Please wait before trying again.' };
    }
  }

  const code = generateCode();
  const sendCount = existing && existing.sendWindowStart + SEND_WINDOW_MS > now
    ? existing.sendCount + 1
    : 1;
  const sendWindowStart = existing && existing.sendWindowStart + SEND_WINDOW_MS > now
    ? existing.sendWindowStart
    : now;

  pendingCodes.set(key, {
    code,
    email,
    xHandle,
    expiresAt: now + CODE_EXPIRY_MS,
    attempts: 0,
    sendCount,
    sendWindowStart,
  });

  return { code };
}

export function verifyCode(email: string, code: string): { ok: true; xHandle: string } | { error: string; status: number } {
  cleanupExpired();

  const key = email.toLowerCase();
  const entry = pendingCodes.get(key);

  if (!entry) {
    return { error: 'No pending verification. Please request a new code.', status: 400 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    pendingCodes.delete(key);
    return { error: 'Too many attempts. Please request a new code.', status: 429 };
  }

  if (entry.code !== code) {
    entry.attempts += 1;
    const remaining = MAX_ATTEMPTS - entry.attempts;
    if (remaining <= 0) {
      pendingCodes.delete(key);
      return { error: 'Too many attempts. Please request a new code.', status: 429 };
    }
    return { error: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`, status: 400 };
  }

  // Valid code — remove from pending
  pendingCodes.delete(key);
  return { ok: true, xHandle: entry.xHandle };
}
