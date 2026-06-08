import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function runLinkCheck() {
  const listings = await db.select().from(directoryListings);

  for (const listing of listings) {
    try {
      const res = await fetch(listing.websiteUrl, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
      const broken = res.status === 404 || res.status >= 500;
      if (broken !== listing.brokenLink) {
        await db
          .update(directoryListings)
          .set({ brokenLink: broken })
          .where(eq(directoryListings.id, listing.id));
      }
    } catch {
      await db
        .update(directoryListings)
        .set({ brokenLink: true })
        .where(eq(directoryListings.id, listing.id));
    }
  }
  console.log('Link check complete.');
}
