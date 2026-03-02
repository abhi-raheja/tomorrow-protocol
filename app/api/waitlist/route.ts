import { NextRequest, NextResponse } from 'next/server';

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
const NOTION_VERSION = '2022-06-28';

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

  // Best-effort cleanup for this in-memory limiter.
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
  // Intentionally simple: catches obvious invalid input without overfitting.
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

async function createNotionWaitlistEntry(email: string, xHandle: string) {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_WAITLIST_DB_ID;

  if (!notionApiKey || !notionDatabaseId) {
    return { ok: false as const, reason: 'not_configured' as const };
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: notionDatabaseId },
      properties: {
        Email: { title: [{ text: { content: email } }] },
        'X Handle': { rich_text: [{ text: { content: xHandle } }] },
        'Signed Up': { date: { start: new Date().toISOString() } },
      },
    }),
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Waitlist Notion request failed', {
      status: response.status,
      statusText: response.statusText,
      error: errorBody.slice(0, 500),
    });
    return { ok: false as const, reason: 'upstream_failed' as const };
  }

  return { ok: true as const };
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
    // Honeypot: return success to avoid helping bots adapt.
    return json({ success: true });
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

  try {
    const notionResult = await createNotionWaitlistEntry(email, xHandle);

    if (!notionResult.ok && notionResult.reason === 'not_configured') {
      console.error('Waitlist submission rejected: Notion integration is not configured');
      return json({ error: 'Waitlist is not configured yet. Please try again later.' }, 503);
    }

    if (!notionResult.ok) {
      return json({ error: 'Unable to process your signup right now. Please try again later.' }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error('Waitlist submission failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return json({ error: 'Unable to process your signup right now. Please try again later.' }, 500);
  }
}
