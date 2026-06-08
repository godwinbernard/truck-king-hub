import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CategoryBadge } from '@/components/content/CategoryBadge';
import { RiskBadge } from '@/components/content/RiskBadge';

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await db
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

  if (!rows.length) notFound();
  const item = rows[0];
  const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="max-w-2xl">
      <a href="/brief" className="text-xs text-slate-400 hover:text-navy mb-4 inline-block">← Back to Brief</a>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <CategoryBadge category={item.category} />
        <RiskBadge level={item.riskLevel} />
      </div>
      <h1 className="text-2xl font-extrabold text-navy leading-snug mb-2">{item.title}</h1>
      <p className="text-sm text-slate-400 mb-6">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">{item.sourceName}</a>
        {date ? ` · ${date}` : ''}
      </p>
      {item.aiSummary && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Summary</p>
          <p className="text-sm text-slate-700 leading-relaxed">{item.aiSummary}</p>
        </div>
      )}
      {item.whyItMatters && (
        <div className="bg-gold/10 border-l-4 border-gold px-4 py-3 rounded mb-6">
          <p className="text-xs font-semibold text-gold-dark mb-0.5 uppercase tracking-wide">Why It Matters</p>
          <p className="text-sm text-slate-700">{item.whyItMatters}</p>
        </div>
      )}
      <a href={item.originalUrl} target="_blank" rel="noopener noreferrer"
        className="inline-block bg-navy text-white px-5 py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors">
        Read original source →
      </a>
      <p className="text-xs text-slate-400 mt-8 border-t border-slate-100 pt-4">
        This summary is for informational purposes only and does not constitute legal, insurance, financial, or compliance advice. Always review the original source and consult qualified professionals before making decisions.
      </p>
    </div>
  );
}
