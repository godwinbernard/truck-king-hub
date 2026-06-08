import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CategoryBadge } from '@/components/content/CategoryBadge';
import { RiskBadge } from '@/components/content/RiskBadge';

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let rows: Array<{
    id: string; title: string; category: string; riskLevel: string;
    publishedAt: Date | null; aiSummary: string | null; whyItMatters: string | null;
    originalUrl: string; sourceName: string; sourceUrl: string | null;
  }> = [];
  let dbError = false;

  try {
    rows = await db
      .select({
        id: contentItems.id, title: contentItems.title,
        category: contentItems.category, riskLevel: contentItems.riskLevel,
        publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
        whyItMatters: contentItems.whyItMatters, originalUrl: contentItems.originalUrl,
        sourceName: sources.name, sourceUrl: sources.websiteUrl,
      })
      .from(contentItems)
      .innerJoin(sources, eq(contentItems.sourceId, sources.id))
      .where(eq(contentItems.slug, slug))
      .limit(1);
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <a href="/brief" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Brief
        </a>
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-500 font-semibold text-sm">Content temporarily unavailable</p>
          <p className="text-slate-400 text-xs mt-1">Please try again shortly.</p>
        </div>
      </div>
    );
  }

  if (!rows.length) notFound();

  const item = rows[0];
  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Back navigation */}
      <a
        href="/brief"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Brief
      </a>

      {/* Article header */}
      <header>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CategoryBadge category={item.category} />
          <RiskBadge level={item.riskLevel} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-snug">{item.title}</h1>
        <p className="text-sm text-slate-400 mt-2 tabular-nums">
          {item.sourceUrl ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded"
            >
              {item.sourceName}
            </a>
          ) : item.sourceName}
          {date ? ` · ${date}` : ''}
        </p>
      </header>

      {/* AI Summary */}
      {item.aiSummary && (
        <section aria-labelledby="summary-heading" className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h2 id="summary-heading" className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Plain English Summary</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{item.aiSummary}</p>
        </section>
      )}

      {/* Why it matters */}
      {item.whyItMatters && (
        <section aria-labelledby="why-heading" className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-4">
          <h2 id="why-heading" className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Why It Matters for Your Operation</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{item.whyItMatters}</p>
        </section>
      )}

      {/* CTA to source */}
      <div className="flex items-center gap-4 pt-2">
        <a
          href={item.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-light active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          Read original source
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
        <a
          href="/brief"
          className="text-sm text-slate-400 hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded"
        >
          ← More updates
        </a>
      </div>

      {/* Legal disclaimer */}
      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4 leading-relaxed">
        This summary is for informational purposes only and does not constitute legal, insurance, financial, or compliance advice.
        Always review the original source and consult qualified professionals before making decisions.
      </p>

    </div>
  );
}
