import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import { RiskBadge } from '@/components/content/RiskBadge';

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
    .limit(30);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">FMCSA &amp; Compliance Watch</h1>
      <p className="text-slate-500 text-sm mb-6">Regulatory updates in plain English. We show what changed, what it means, and what to do next. Always review the original source before acting.</p>
      <div className="space-y-8">
        {rows.length === 0 && <p className="text-slate-400 text-sm">No compliance updates yet. FMCSA and Federal Register sources are checked every 2 hours.</p>}
        {rows.map((item) => {
          const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-5 border-t-4 border-t-navy">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <RiskBadge level={item.riskLevel} />
                <span className="text-xs text-slate-400">{item.sourceName}{date ? ` · ${date}` : ''}</span>
              </div>
              <Link href={`/item/${item.slug}`} className="font-bold text-navy hover:text-navy-light text-base">{item.title}</Link>
              {item.aiSummary && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Plain English Summary</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.aiSummary}</p>
                </div>
              )}
              {item.whyItMatters && (
                <div className="mt-2 bg-gold/10 border-l-2 border-gold px-3 py-2 rounded">
                  <p className="text-xs font-semibold text-gold-dark mb-0.5">Why It Matters</p>
                  <p className="text-sm text-slate-700">{item.whyItMatters}</p>
                </div>
              )}
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-blue-600 underline hover:text-blue-800">View original source →</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
