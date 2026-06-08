import { db } from '@/lib/db/client';
import { sources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });

  const { id } = await params;
  const { active } = await req.json();
  await db.update(sources).set({ active }).where(eq(sources.id, id));
  return new Response(JSON.stringify({ ok: true }));
}
