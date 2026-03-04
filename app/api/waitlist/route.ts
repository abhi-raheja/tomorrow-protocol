import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createPendingCode } from './_pending';

export const runtime = 'nodejs';

type WaitlistRequestBody = {
  email?: unknown;
  xHandle?: unknown;
  website?: unknown; // honeypot
};

const JSON_HEADERS = {
  'Cache-Control': 'no-store',
};

const MAX_BODY_BYTES = 4_096;
const MAX_EMAIL_LENGTH = 254;
const MAX_X_HANDLE_LENGTH = 15;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return (forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown').slice(0, 128);
}

function isRateLimited(key: string) {
  const now = Date.now();

  for (const [entryKey, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(entryKey);
    }
  }

  const existing = rateLimitStore.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  return false;
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

  if (isRateLimited(getClientKey(req))) {
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

  const result = createPendingCode(email, xHandle);
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
