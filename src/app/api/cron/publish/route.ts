import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { writeAuditLog } from '@/lib/admin/audit';
import { and, eq, lte } from 'drizzle-orm';
import { NextRequest } from 'next/server';

// Called by Vercel Cron daily at 6am UTC.
// Publishes any articles whose status = 'scheduled' and scheduled_at <= NOW.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();

  const due = await db
    .select({ id: articles.id, title: articles.title, scheduledAt: articles.scheduledAt })
    .from(articles)
    .where(and(eq(articles.status, 'scheduled'), lte(articles.scheduledAt, now)));

  if (due.length === 0) {
    return Response.json({ ok: true, published: 0 });
  }

  const ids = due.map((a) => a.id);

  // Publish each one individually so publishedAt is set accurately
  for (const article of due) {
    await db
      .update(articles)
      .set({ status: 'published', publishedAt: now, updatedAt: now })
      .where(eq(articles.id, article.id));

    await writeAuditLog('cron', 'auto_published', 'article', article.title, {
      id: article.id,
      scheduledAt: article.scheduledAt,
    });
  }

  return Response.json({ ok: true, published: ids.length, titles: due.map((a) => a.title) });
}
