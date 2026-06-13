import { db } from '@/lib/db/client';
import { cmsComments } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(cmsComments).orderBy(desc(cmsComments.createdAt));
  return Response.json({ comments: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { authorName, body, articleId } = await req.json();
  if (!authorName || !body) return Response.json({ error: 'authorName and body are required' }, { status: 400 });

  const [row] = await db.insert(cmsComments).values({ authorName, body, articleId: articleId ?? null, status: 'pending' }).returning();
  return Response.json({ comment: row }, { status: 201 });
}
