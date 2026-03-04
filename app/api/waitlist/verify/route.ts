import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '../_pending';

export const runtime = 'nodejs';

type VerifyRequestBody = {
  email?: unknown;
  code?: unknown;
};

const JSON_HEADERS = {
  'Cache-Control': 'no-store',
};

const MAX_BODY_BYTES = 1_024;
const NOTION_VERSION = '2022-06-28';

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
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

  let body: VerifyRequestBody;
  try {
    body = (await req.json()) as VerifyRequestBody;
  } catch {
    return json({ error: 'Invalid JSON payload' }, 400);
  }

  if (typeof body.email !== 'string' || !body.email.trim()) {
    return json({ error: 'Email is required' }, 400);
  }
  if (typeof body.code !== 'string' || !body.code.trim()) {
    return json({ error: 'Verification code is required' }, 400);
  }

  const email = body.email.trim().toLowerCase();
  const code = body.code.trim();

  if (!/^\d{6}$/.test(code)) {
    return json({ error: 'Code must be 6 digits' }, 400);
  }

  const result = verifyCode(email, code);
  if ('error' in result) {
    return json({ error: result.error }, result.status);
  }

  // Code verified — write to Notion
  try {
    const notionResult = await createNotionWaitlistEntry(email, result.xHandle);

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
