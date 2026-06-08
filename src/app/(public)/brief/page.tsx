import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { inArray, desc, eq } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';

export default async function BriefPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const category = params.category;
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(inArray(contentItems.reviewStatus, ['auto_published', 'approved']))
    .orderBy(desc(contentItems.publishedAt))
    .limit(50);

  const CATEGORIES = ['compliance', 'insurance', 'freight', 'safety', 'fuel', 'equipment', 'general'];
  const filtered = category ? rows.filter((r) => r.category === category) : rows;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">Daily Trucking Brief</h1>
      <p className="text-slate-500 text-sm mb-6">All updates, newest first. Filter by topic to find what matters to your operation.</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/brief" className={`text-xs font-semibold px-3 py-1.5 rounded border ${!category ? 'bg-navy text-white border-navy' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>All</a>
        {CATEGORIES.map((cat) => (
          <a key={cat} href={`/brief?category=${cat}`} className={`text-xs font-semibold px-3 py-1.5 rounded border capitalize ${category === cat ? 'bg-navy text-white border-navy' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>{cat}</a>
        ))}
      </div>
      <div className="space-y-6">
        {filtered.length === 0 && <p className="text-slate-400 text-sm">No items yet — our ingestion pipeline runs every 2 hours. Check back shortly.</p>}
        {filtered.map((item) => (
          <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
        ))}
      </div>
    </div>
  );
}
