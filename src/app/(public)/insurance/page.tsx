import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, and, desc } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';

export default async function InsurancePage() {
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(and(
      eq(contentItems.category, 'insurance'),
      inArray(contentItems.reviewStatus, ['auto_published', 'approved'])
    ))
    .orderBy(desc(contentItems.publishedAt))
    .limit(30);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">Insurance &amp; Risk Center</h1>
      <p className="text-slate-500 text-sm mb-2">How insurance, safety scores, and compliance decisions affect your operating costs — explained for owner-operators and small fleet owners.</p>
      <div className="bg-navy/5 border border-navy/10 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-slate-700 leading-relaxed">
          Trucking insurance is one of the biggest controllable costs in your operation. Your CSA scores, accident history, authority age, and cargo type all affect what you pay at renewal. This center tracks the latest insurance-relevant news and explains what it means for your premium.
        </p>
      </div>
      <div className="space-y-6">
        {rows.length === 0 && <p className="text-slate-400 text-sm">No insurance updates yet. Check back shortly.</p>}
        {rows.map((item) => <ContentCard key={item.id} {...item} sourceName={item.sourceName} />)}
      </div>
      <p className="text-xs text-slate-400 mt-10 border-t border-slate-100 pt-4">
        Insurance information on this page is for educational purposes only and does not constitute insurance advice. Contact a licensed trucking insurance broker for coverage decisions.
      </p>
    </div>
  );
}
