import { db } from '@/lib/db/client';
import { cmsNotifications } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { desc, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(cmsNotifications).orderBy(desc(cmsNotifications.createdAt)).limit(20);
  return Response.json({ notifications: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId || session.role !== 'Admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { title, body, type } = await req.json();
  if (!title || !body) return Response.json({ error: 'title and body are required' }, { status: 400 });

  const [row] = await db.insert(cmsNotifications).values({ title, body, type: type ?? 'info' }).returning();
  return Response.json({ notification: row }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  await db.update(cmsNotifications).set({ read: true }).where(eq(cmsNotifications.id, id));
  return Response.json({ ok: true });
}
