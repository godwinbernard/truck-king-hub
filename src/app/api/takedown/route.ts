import { db } from '@/lib/db/client';
import { takedownRequests } from '@/lib/db/schema';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sourceName, url, reason, requesterEmail } = body;

  if (!sourceName || !url) {
    return new Response(JSON.stringify({ error: 'sourceName and url are required' }), { status: 400 });
  }

  await db.insert(takedownRequests).values({ sourceName, url, reason, requesterEmail });
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}
