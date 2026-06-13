import { db } from '@/lib/db/client';
import { cmsUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId || session.role !== 'Admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const allowed = ['name', 'role', 'status'] as const;
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  if (Object.keys(update).length === 0) return Response.json({ error: 'No valid fields' }, { status: 400 });

  await db.update(cmsUsers).set(update).where(eq(cmsUsers.id, id));
  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId || session.role !== 'Admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(cmsUsers).where(eq(cmsUsers.id, id));
  return Response.json({ ok: true });
}
