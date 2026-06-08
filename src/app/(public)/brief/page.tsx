import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { inArray, desc, eq } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';

const CATEGORIES = ['compliance', 'insurance', 'freight', 'safety', 'fuel', 'equipment', 'general'];

const CATEGORY_DESC: Record<string, string> = {
  compliance: 'FMCSA & DOT regulatory updates',
  insurance:  'Coverage, premiums & risk news',
  freight:    'Rates, load boards & market data',
  safety:     'CSA scores, inspections & HOS',
  fuel:       'Fuel prices & efficiency tips',
  equipment:  'Trucks, trailers & marketplace',
  general:    'Industry news & community',
};

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
    .limit(50)
    .catch(() => []);

  const filtered = category ? rows.filter((r) => r.category === category) : rows;
  const activeDesc = category ? CATEGORY_DESC[category] : 'All categories, newest first';

  return (
    <div className="space-y-8">

      {/* Page header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Intelligence Feed</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">Daily Trucking Brief</h1>
        <p className="text-slate-500 text-sm mt-1">{activeDesc}</p>
      </header>

      {/* Category filter bar */}
      <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
        <a
          href="/brief"
          className={`inline-flex items-center h-9 px-4 rounded-full text-sm font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
            !category
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-slate-600 border-slate-200 hover:border-navy/40 hover:text-navy'
          }`}
        >
          All
        </a>
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={`/brief?category=${cat}`}
            className={`inline-flex items-center h-9 px-4 rounded-full text-sm font-semibold border capitalize transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
              category === cat
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-slate-600 border-slate-200 hover:border-navy/40 hover:text-navy'
            }`}
          >
            {cat}
          </a>
        ))}
      </nav>

      {/* Result count */}
      {filtered.length > 0 && (
        <p className="text-xs text-slate-400 tabular-nums">
          {filtered.length} update{filtered.length !== 1 ? 's' : ''}{category ? ` in ${category}` : ''}
        </p>
      )}

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-slate-500 font-semibold text-sm">No updates yet</p>
          <p className="text-slate-400 text-xs mt-1 max-w-xs">Our ingestion pipeline runs every 2 hours. Check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
          ))}
        </div>
      )}
    </div>
  );
}
