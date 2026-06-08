import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export type SearchResult = {
  id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: Date | null;
  aiSummary: string | null;
  sourceName: string;
};

export async function searchContent(query: string, limit = 20): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const rows = await db.execute(sql`
    SELECT
      ci.id, ci.title, ci.slug, ci.category,
      ci.published_at, ci.ai_summary,
      s.name AS source_name
    FROM content_items ci
    JOIN sources s ON ci.source_id = s.id
    WHERE ci.review_status IN ('auto_published', 'approved')
      AND ci.search_vector @@ plainto_tsquery('english', ${query})
    ORDER BY ts_rank(ci.search_vector, plainto_tsquery('english', ${query})) DESC
    LIMIT ${limit}
  `);

  return (rows.rows as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    category: String(row.category),
    publishedAt: row.published_at ? new Date(String(row.published_at)) : null,
    aiSummary: row.ai_summary ? String(row.ai_summary) : null,
    sourceName: String(row.source_name),
  }));
}
