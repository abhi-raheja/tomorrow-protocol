import crypto from 'crypto';
import { Redis } from '@upstash/redis';

type StoredEntry = {
  code: string;
  xHandle: string;
  attempts: number;
  sendCount: number;
  sendWindowStart: number;
  expiresAt: number;
};

const CODE_EXPIRY_S = 10 * 60; // 10 minutes
const MAX_ATTEMPTS = 5;
const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_MS = 10 * 60 * 1000;

// Module-level singleton — reused across warm invocations
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// In-memory fallback for local dev (no Redis configured)
const memoryStore = new Map<string, StoredEntry>();

function pendingKey(email: string) {
  return `waitlist:pending:${email}`;
}

function generateCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function memoryGet(key: string): StoredEntry | null {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return entry;
}

export async function createPendingCode(
  email: string,
  xHandle: string,
): Promise<{ code: string } | { error: string }> {
  const key = pendingKey(email.toLowerCase());
  const now = Date.now();

  const existing = redis ? await redis.get<StoredEntry>(key) : memoryGet(key);

  if (existing && existing.sendWindowStart + SEND_WINDOW_MS > now) {
    if (existing.sendCount >= MAX_SENDS_PER_WINDOW) {
      return { error: 'Too many code requests. Please wait before trying again.' };
    }
  }

  const sendCount =
    existing && existing.sendWindowStart + SEND_WINDOW_MS > now
      ? existing.sendCount + 1
      : 1;
  const sendWindowStart =
    existing && existing.sendWindowStart + SEND_WINDOW_MS > now
      ? existing.sendWindowStart
      : now;

  const code = generateCode();
  const entry: StoredEntry = {
    code,
    xHandle,
    attempts: 0,
    sendCount,
    sendWindowStart,
    expiresAt: now + CODE_EXPIRY_S * 1000,
  };

  if (redis) {
    await redis.set(key, entry, { ex: CODE_EXPIRY_S });
  } else {
    memoryStore.set(key, entry);
  }

  return { code };
}

export async function verifyCode(
  email: string,
  code: string,
): Promise<{ ok: true; xHandle: string } | { error: string; status: number }> {
  const key = pendingKey(email.toLowerCase());

  const entry = redis ? await redis.get<StoredEntry>(key) : memoryGet(key);

  if (!entry) {
    return { error: 'No pending verification. Please request a new code.', status: 400 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    redis ? await redis.del(key) : memoryStore.delete(key);
    return { error: 'Too many attempts. Please request a new code.', status: 429 };
  }

  if (entry.code !== code) {
    entry.attempts += 1;
    const remaining = MAX_ATTEMPTS - entry.attempts;

    if (remaining <= 0) {
      redis ? await redis.del(key) : memoryStore.delete(key);
      return { error: 'Too many attempts. Please request a new code.', status: 429 };
    }

    if (redis) {
      const remainingTtlS = Math.max(Math.ceil((entry.expiresAt - Date.now()) / 1000), 1);
      await redis.set(key, entry, { ex: remainingTtlS });
    } else {
      memoryStore.set(key, entry);
    }

    return {
      error: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      status: 400,
    };
  }

  redis ? await redis.del(key) : memoryStore.delete(key);
  return { ok: true, xHandle: entry.xHandle };
}
