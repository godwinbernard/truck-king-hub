import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, and, desc } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';

const INSURANCE_TOPICS = [
  { icon: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z', label: 'Premium Factors', desc: 'CSA scores, authority age, cargo type, accident history' },
  { icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', label: 'Coverage Types', desc: 'Primary liability, cargo, physical damage, bobtail' },
  { icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z', label: 'CSA & Safety Scores', desc: 'How your safety record drives your premium' },
  { icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z', label: 'Claims Management', desc: 'Reporting, documentation, and protecting your record' },
];

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
    .limit(30)
    .catch(() => []);

  return (
    <div className="space-y-10">

      {/* Page header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Risk Intelligence</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">Insurance &amp; Risk Center</h1>
        <p className="text-slate-500 text-sm mt-1 max-w-2xl">
          How insurance, safety scores, and compliance decisions affect your operating costs — explained for owner-operators and small fleet owners.
        </p>
      </header>

      {/* Context card */}
      <div className="bg-navy rounded-xl p-6">
        <p className="text-sm text-blue-100 leading-relaxed mb-5">
          Trucking insurance is one of the biggest controllable costs in your operation. Your CSA scores, accident history, authority age, and cargo type all affect what you pay at renewal. This center tracks the latest insurance-relevant news and explains what it means for your premium.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {INSURANCE_TOPICS.map((topic) => (
            <div key={topic.label} className="bg-white/10 rounded-lg p-3">
              <svg className="w-5 h-5 text-gold mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={topic.icon} />
              </svg>
              <p className="text-xs font-semibold text-white leading-tight">{topic.label}</p>
              <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* News feed */}
      <section aria-labelledby="insurance-feed-heading">
        <h2 id="insurance-feed-heading" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Latest Insurance News
        </h2>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-500 font-semibold text-sm">No insurance updates yet</p>
            <p className="text-slate-400 text-xs mt-1">Sources are checked every 2 hours. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((item) => <ContentCard key={item.id} {...item} sourceName={item.sourceName} />)}
          </div>
        )}
      </section>

      {/* Legal disclaimer */}
      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4 leading-relaxed">
        Insurance information on this page is for educational purposes only and does not constitute insurance advice.
        Contact a licensed trucking insurance broker for coverage decisions.
      </p>
    </div>
  );
}
