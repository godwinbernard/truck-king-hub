import { db } from '@/lib/db/client';
import { cmsAds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { can } from '@/lib/admin/permissions';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!can(session.role, 'manage_ads')) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const allowed = ['name', 'placement', 'sponsor', 'status', 'dailyBudget', 'impressions', 'clicks'] as const;
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  if (Object.keys(update).length === 0) return Response.json({ error: 'No valid fields' }, { status: 400 });

  await db.update(cmsAds).set(update).where(eq(cmsAds.id, id));
  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!can(session.role, 'manage_ads')) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await db.delete(cmsAds).where(eq(cmsAds.id, id));
  return Response.json({ ok: true });
}
