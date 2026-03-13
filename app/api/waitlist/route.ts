import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { createPendingCode } from './_pending';

export const runtime = 'nodejs';

type WaitlistRequestBody = {
  email?: unknown;
  xHandle?: unknown;
  website?: unknown; // honeypot
  turnstileToken?: unknown;
};

const JSON_HEADERS = {
  'Cache-Control': 'no-store',
};

const MAX_BODY_BYTES = 4_096;
const MAX_EMAIL_LENGTH = 254;
const MAX_X_HANDLE_LENGTH = 15;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return (forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown').slice(0, 128);
}

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(10, '60 s'),
        prefix: 'waitlist:rl',
      })
    : null;

async function isRateLimited(key: string): Promise<boolean> {
  if (!ratelimit) return false;
  const { success } = await ratelimit.limit(key);
  return !success;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured, skip (local dev)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email) return null;
  if (email.length > MAX_EMAIL_LENGTH) return null;
  return email;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeXHandle(value: unknown) {
  if (value == null) return '';
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return '';

  const normalized = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  if (!normalized) return '';
  if (normalized.length > MAX_X_HANDLE_LENGTH) return null;
  if (!/^[A-Za-z0-9_]+$/.test(normalized)) return null;

  return normalized;
}

async function isAlreadyOnWaitlist(email: string): Promise<boolean> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_WAITLIST_DB_ID;
  if (!notionApiKey || !notionDatabaseId) return false;

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: { property: 'Email', title: { equals: email } },
        page_size: 1,
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { results: unknown[] };
    return data.results.length > 0;
  } catch {
    return false;
  }
}

async function sendVerificationEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false as const, reason: 'not_configured' as const };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: 'Tomorrow <noreply@tomorrow.loans>',
      to: email,
      subject: 'Your Tomorrow verification code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #000; margin: 0 0 8px;">Verify your email</h2>
          <p style="font-size: 16px; color: #666; margin: 0 0 24px; line-height: 1.5;">Enter this code to join the Tomorrow waitlist:</p>
          <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #000;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999; margin: 0; line-height: 1.5;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error', { message: error.message });
      return { ok: false as const, reason: 'send_failed' as const };
    }

    return { ok: true as const };
  } catch (err) {
    console.error('Resend request failed', { error: err instanceof Error ? err.message : 'Unknown' });
    return { ok: false as const, reason: 'send_failed' as const };
  }
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: 'Request body is too large' }, 413);
  }

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ error: 'Content-Type must be application/json' }, 415);
  }

  const clientIp = getClientKey(req);

  if (await isRateLimited(clientIp)) {
    return json({ error: 'Too many requests. Please try again shortly.' }, 429);
  }

  let body: WaitlistRequestBody;
  try {
    body = (await req.json()) as WaitlistRequestBody;
  } catch {
    return json({ error: 'Invalid JSON payload' }, 400);
  }

  if (typeof body.website === 'string' && body.website.trim().length > 0) {
    return json({ success: true, pendingVerification: true });
  }

  // Turnstile verification (required when configured)
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!token) {
      return json({ error: 'Bot verification required.' }, 400);
    }
    const valid = await verifyTurnstile(token, clientIp);
    if (!valid) {
      return json({ error: 'Bot verification failed. Please try again.' }, 400);
    }
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return json({ error: 'Email is required' }, 400);
  }
  if (!isValidEmail(email)) {
    return json({ error: 'Please enter a valid email address' }, 400);
  }

  const xHandle = normalizeXHandle(body.xHandle);
  if (xHandle === null) {
    return json({ error: 'X handle must be 1-15 characters (letters, numbers, underscore)' }, 400);
  }

  if (await isAlreadyOnWaitlist(email)) {
    return json({ success: true, pendingVerification: false });
  }

  let result: { code: string } | { error: string };
  try {
    result = await createPendingCode(email, xHandle);
  } catch (err) {
    console.error('createPendingCode failed', { error: err instanceof Error ? err.message : 'Unknown' });
    return json({ error: 'Unable to process your request. Please try again later.' }, 503);
  }

  if ('error' in result) {
    return json({ error: result.error }, 429);
  }

  const sendResult = await sendVerificationEmail(email, result.code);
  if (!sendResult.ok && sendResult.reason === 'not_configured') {
    console.error('Waitlist verification rejected: Resend is not configured');
    return json({ error: 'Email verification is not configured yet. Please try again later.' }, 503);
  }
  if (!sendResult.ok) {
    return json({ error: 'Unable to send verification email. Please try again later.' }, 502);
  }

  return json({ success: true, pendingVerification: true });
}
