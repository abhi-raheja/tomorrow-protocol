import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, xHandle } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // TODO: Wire up Notion API
  // You'll need:
  // 1. A Notion integration token (NOTION_API_KEY)
  // 2. A database ID (NOTION_WAITLIST_DB_ID)
  //
  // Notion database should have columns:
  //   - Email (title)
  //   - X Handle (rich_text)
  //   - Signed Up (date, auto-filled)
  //
  // Example Notion API call:
  //
  // const res = await fetch('https://api.notion.com/v1/pages', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
  //     'Content-Type': 'application/json',
  //     'Notion-Version': '2022-06-28',
  //   },
  //   body: JSON.stringify({
  //     parent: { database_id: process.env.NOTION_WAITLIST_DB_ID },
  //     properties: {
  //       Email: { title: [{ text: { content: email } }] },
  //       'X Handle': { rich_text: [{ text: { content: xHandle || '' } }] },
  //       'Signed Up': { date: { start: new Date().toISOString() } },
  //     },
  //   }),
  // });

  console.log('Waitlist signup:', { email, xHandle, timestamp: new Date().toISOString() });

  return NextResponse.json({ success: true });
}
