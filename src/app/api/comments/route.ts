import { db } from '@/lib/db/client';
import { articles, cmsComments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const articleId = typeof body.articleId === 'string' ? body.articleId.trim() : '';
  const authorName = typeof body.authorName === 'string' ? body.authorName.trim() : '';
  const commentBody = typeof body.body === 'string' ? body.body.trim() : '';

  if (!articleId || !authorName || !commentBody) {
    return Response.json({ error: 'articleId, authorName, and body are required' }, { status: 400 });
  }

  const [article] = await db.select({ id: articles.id, status: articles.status }).from(articles).where(eq(articles.id, articleId)).limit(1);
  if (!article || article.status !== 'published') {
    return Response.json({ error: 'Article not found' }, { status: 404 });
  }

  const [comment] = await db.insert(cmsComments).values({
    articleId,
    authorName,
    body: commentBody,
    status: 'pending',
  }).returning();

  return Response.json({
    comment,
    message: 'Thanks. Your comment is pending editorial review.',
  }, { status: 201 });
}
