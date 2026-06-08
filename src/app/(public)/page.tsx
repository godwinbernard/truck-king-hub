import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, desc, gte, and } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';
import { QuickLinks } from '@/components/dashboard/QuickLinks';

async function getPublishedItems(category?: string, limit = 5) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(
      and(
        inArray(contentItems.reviewStatus, ['auto_published', 'approved']),
        category ? eq(contentItems.category, category) : undefined,
        gte(contentItems.publishedAt, sevenDaysAgo),
      )
    )
    .orderBy(desc(contentItems.publishedAt))
    .limit(limit);
  return rows;
}

export default async function HomePage() {
  const [brief, compliance, freight, insurance] = await Promise.all([
    getPublishedItems(undefined, 5),
    getPublishedItems('compliance', 3),
    getPublishedItems('freight', 3),
    getPublishedItems('insurance', 3),
  ]);

  return (
    <div className="space-y-10">
      {/* Hero: Today's Trucking Brief */}
      <section>
        <div className="bg-navy text-white px-6 py-5 rounded-t-lg border-b-4 border-gold">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Today&apos;s Trucking Brief</p>
          <h1 className="text-2xl font-extrabold leading-snug">What Changed Today for Operators &amp; Drivers</h1>
          <p className="text-blue-200 text-sm mt-1.5 max-w-2xl">
            Plain-English summaries of the most important trucking news, compliance updates, and market moves — sourced from FMCSA, Federal Register, and leading industry publications.
          </p>
        </div>
        <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg p-4 space-y-4">
          {brief.length === 0 && <p className="text-sm text-slate-400">No items yet — our ingestion pipeline runs every 2 hours. Check back shortly.</p>}
          {brief.map((item) => (
            <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Compliance Alerts */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-navy pl-3 mb-4">
            FMCSA &amp; Compliance Alerts
          </h2>
          <div className="space-y-4">
            {compliance.length === 0 && <p className="text-sm text-slate-400">No compliance updates in the last 7 days. Check back soon.</p>}
            {compliance.map((item) => (
              <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
            ))}
          </div>
        </section>

        {/* Insurance Spotlight */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-gold pl-3 mb-4">
            Insurance &amp; Risk Spotlight
          </h2>
          <div className="space-y-4">
            {insurance.length === 0 && <p className="text-sm text-slate-400">No insurance updates this week.</p>}
            {insurance.map((item) => (
              <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
            ))}
          </div>
        </section>

        {/* Freight Market Pulse */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-slate-300 pl-3 mb-4">
            Freight Market Pulse
          </h2>
          <div className="space-y-4">
            {freight.length === 0 && <p className="text-sm text-slate-400">No freight market updates this week.</p>}
            {freight.map((item) => (
              <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <QuickLinks />
        </section>
      </div>
    </div>
  );
}
