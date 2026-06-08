import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  await db.insert(directoryListings).values(body);
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}
