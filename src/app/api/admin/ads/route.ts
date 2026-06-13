import { db } from '@/lib/db/client';
import { cmsAds } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { can } from '@/lib/admin/permissions';
import { desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(cmsAds).orderBy(desc(cmsAds.createdAt));
  return Response.json({ ads: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!can(session.role, 'manage_ads')) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { name, placement, sponsor, status, dailyBudget } = await req.json();
  if (!name || !placement || !sponsor) return Response.json({ error: 'name, placement, and sponsor are required' }, { status: 400 });

  const [row] = await db.insert(cmsAds).values({
    name,
    placement,
    sponsor,
    status: status ?? 'active',
    dailyBudget: dailyBudget ?? 0,
  }).returning();
  return Response.json({ ad: row }, { status: 201 });
}
