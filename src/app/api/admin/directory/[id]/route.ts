import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const body = await req.json();
  await db.update(directoryListings).set(body).where(eq(directoryListings.id, id));
  return new Response(JSON.stringify({ ok: true }));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  await db.delete(directoryListings).where(eq(directoryListings.id, id));
  return new Response(JSON.stringify({ ok: true }));
}
