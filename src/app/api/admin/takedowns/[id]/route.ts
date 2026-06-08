import { db } from '@/lib/db/client';
import { takedownRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  await db.update(takedownRequests).set({ resolved: true }).where(eq(takedownRequests.id, id));
  return new Response(JSON.stringify({ ok: true }));
}
