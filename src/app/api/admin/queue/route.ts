import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';

export async function GET() {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });

  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, rawExcerpt: contentItems.rawExcerpt,
      aiSummary: contentItems.aiSummary, whyItMatters: contentItems.whyItMatters,
      sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(eq(contentItems.reviewStatus, 'pending_review'))
    .orderBy(desc(contentItems.publishedAt))
    .limit(50);

  return new Response(JSON.stringify(rows));
}
