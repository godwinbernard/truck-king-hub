import { db } from '@/lib/db/client';
import { cmsUsers } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(cmsUsers).orderBy(desc(cmsUsers.createdAt));
  return Response.json({ users: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId || session.role !== 'Admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, email, role } = await req.json();
  if (!name || !email || !role) return Response.json({ error: 'name, email, and role are required' }, { status: 400 });

  try {
    const [row] = await db.insert(cmsUsers).values({ name, email, role, status: 'invited' }).returning();
    return Response.json({ user: row }, { status: 201 });
  } catch {
    return Response.json({ error: 'Email already exists' }, { status: 409 });
  }
}
