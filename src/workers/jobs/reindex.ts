import { db } from '@/lib/db/client';
import { sql } from 'drizzle-orm';

export async function runReindex() {
  await db.execute(sql`
    UPDATE content_items
    SET search_vector = to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(ai_summary, '') || ' ' ||
      coalesce(array_to_string(tags, ' '), '')
    )
    WHERE search_vector IS NULL
  `);
  console.log('Search index refreshed.');
}
