import { db } from '@/lib/db/client';
import { contentItems } from '@/lib/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export async function isDuplicate(originalUrl: string): Promise<boolean> {
  const existing = await db
    .select({ id: contentItems.id })
    .from(contentItems)
    .where(eq(contentItems.originalUrl, originalUrl))
    .limit(1);
  return existing.length > 0;
}

export async function findDuplicateGroupId(
  title: string,
  publishedAt: Date | null
): Promise<string | null> {
  if (!publishedAt) return null;

  const windowStart = new Date(publishedAt.getTime() - 24 * 60 * 60 * 1000);
  const windowEnd = new Date(publishedAt.getTime() + 24 * 60 * 60 * 1000);

  const titlePrefix = title.slice(0, 40).toLowerCase();

  const existing = await db
    .select({ id: contentItems.id, duplicateGroupId: contentItems.duplicateGroupId })
    .from(contentItems)
    .where(
      and(
        gte(contentItems.publishedAt, windowStart),
        lte(contentItems.publishedAt, windowEnd),
        sql`lower(${contentItems.title}) LIKE ${titlePrefix + '%'}`
      )
    )
    .limit(1);

  if (existing.length === 0) return null;
  return existing[0].duplicateGroupId ?? existing[0].id;
}
