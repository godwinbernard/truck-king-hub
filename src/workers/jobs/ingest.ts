import { db } from '@/lib/db/client';
import { sources, contentItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { fetchRss, fetchFederalRegister } from '@/lib/ingestion/fetcher';
import { normalize } from '@/lib/ingestion/normalizer';
import { isDuplicate, findDuplicateGroupId } from '@/lib/ingestion/deduplicator';
import { categorize, Category } from '@/lib/ingestion/categorizer';
import { classifyRisk } from '@/lib/risk/classifier';
import { summarize } from '@/lib/summarizer/claude';

export async function runIngestion() {
  const activeSources = await db
    .select()
    .from(sources)
    .where(eq(sources.active, true));

  for (const source of activeSources) {
    try {
      const entries =
        source.updateMethod === 'rss'
          ? await fetchRss(source.websiteUrl)
          : source.updateMethod === 'federal_register_api'
          ? await fetchFederalRegister()
          : [];

      for (const entry of entries) {
        if (!entry.link || !entry.title) continue;

        if (await isDuplicate(entry.link)) continue;

        const normalized = normalize(entry, source.id);
        const { category, audience } = categorize(
          normalized.title,
          normalized.rawExcerpt,
          source.defaultCategory as Category
        );
        const riskLevel = classifyRisk(normalized.title, normalized.rawExcerpt, source.sourceType);
        const duplicateGroupId = await findDuplicateGroupId(
          normalized.title,
          normalized.publishedAt
        );

        let aiSummary: string | null = null;
        let whyItMatters: string | null = null;

        if (normalized.rawExcerpt) {
          try {
            const summary = await summarize(normalized.title, normalized.rawExcerpt);
            aiSummary = summary.aiSummary;
            whyItMatters = summary.whyItMatters;
          } catch (err) {
            console.error(`Summarizer error for "${normalized.title}":`, err);
          }
        }

        const reviewStatus =
          riskLevel === 'high' ? 'pending_review' : 'auto_published';

        await db.insert(contentItems).values({
          ...normalized,
          category,
          audience,
          riskLevel,
          reviewStatus,
          duplicateGroupId: duplicateGroupId ?? undefined,
          aiSummary,
          whyItMatters,
          tags: [],
        });
      }

      await db
        .update(sources)
        .set({ lastFetchedAt: new Date() })
        .where(eq(sources.id, source.id));
    } catch (err) {
      console.error(`Ingestion error for source "${source.name}":`, err);
    }
  }
}
