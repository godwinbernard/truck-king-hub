import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import { RiskBadge } from '@/components/content/RiskBadge';

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function CompliancePage() {
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      riskLevel: contentItems.riskLevel, publishedAt: contentItems.publishedAt,
      rawExcerpt: contentItems.rawExcerpt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
      sourceUrl: sources.websiteUrl,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(and(
      eq(contentItems.category, 'compliance'),
      inArray(contentItems.reviewStatus, ['auto_published', 'approved'])
    ))
    .orderBy(desc(contentItems.publishedAt))
    .limit(30)
    .catch(() => []);

  const highRisk = rows.filter((r) => r.riskLevel === 'high');
  const rest = rows.filter((r) => r.riskLevel !== 'high');

  return (
    <div className="space-y-10">

      {/* Page header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Regulatory Intelligence</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">FMCSA &amp; Compliance Watch</h1>
        <p className="text-slate-500 text-sm mt-1">
          Regulatory updates in plain English — what changed, what it means, and what to do next.
        </p>
      </header>

      {/* Disclaimer banner */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3" role="note">
        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          Always review the original source before taking action. Summaries are for informational purposes only and do not constitute legal or compliance advice.
        </p>
      </div>

      {/* High priority items */}
      {highRisk.length > 0 && (
        <section aria-labelledby="high-priority-heading">
          <h2 id="high-priority-heading" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-600 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
            High Priority — Action May Be Required
          </h2>
          <div className="space-y-4">
            {highRisk.map((item) => (
              <ComplianceCard key={item.id} item={item} highlighted />
            ))}
          </div>
        </section>
      )}

      {/* All other updates */}
      {rest.length > 0 && (
        <section aria-labelledby="updates-heading">
          <h2 id="updates-heading" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
            <span className="w-2 h-2 rounded-full bg-slate-400" aria-hidden="true" />
            Recent Updates
          </h2>
          <div className="space-y-4">
            {rest.map((item) => (
              <ComplianceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <p className="text-slate-500 font-semibold text-sm">No compliance alerts yet</p>
          <p className="text-slate-400 text-xs mt-1">FMCSA and Federal Register sources are checked every 2 hours.</p>
        </div>
      )}
    </div>
  );
}

type ComplianceItem = {
  id: string; title: string; slug: string; riskLevel: string;
  publishedAt: Date | null; aiSummary: string | null;
  whyItMatters: string | null; sourceName: string; sourceUrl: string;
};

function ComplianceCard({ item, highlighted = false }: { item: ComplianceItem; highlighted?: boolean }) {
  const date = formatDate(item.publishedAt);
  return (
    <article className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${highlighted ? 'border-red-200 border-l-4 border-l-red-500' : 'border-slate-200 border-l-4 border-l-navy'}`}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <RiskBadge level={item.riskLevel} />
        <span className="text-xs text-slate-400 tabular-nums">{item.sourceName}{date ? ` · ${date}` : ''}</span>
      </div>
      <Link
        href={`/item/${item.slug}`}
        className="font-bold text-navy hover:text-navy-light text-base leading-snug hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded"
      >
        {item.title}
      </Link>
      {item.aiSummary && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Plain English Summary</p>
          <p className="text-sm text-slate-700 leading-relaxed">{item.aiSummary}</p>
        </div>
      )}
      {item.whyItMatters && (
        <div className="mt-3 bg-gold/10 border-l-2 border-gold px-3 py-2 rounded-r">
          <p className="text-xs font-semibold text-amber-700 mb-0.5">Why It Matters</p>
          <p className="text-sm text-slate-700">{item.whyItMatters}</p>
        </div>
      )}
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
      >
        View original source
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </article>
  );
}
