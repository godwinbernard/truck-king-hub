import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, desc, gte, and } from 'drizzle-orm';
import Link from 'next/link';
import { CategoryBadge } from '@/components/content/CategoryBadge';
import { RiskBadge } from '@/components/content/RiskBadge';

async function getPublishedItems(category?: string, limit = 5) {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return await db
      .select({
        id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
        category: contentItems.category, riskLevel: contentItems.riskLevel,
        publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
        whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
      })
      .from(contentItems)
      .innerJoin(sources, eq(contentItems.sourceId, sources.id))
      .where(and(
        inArray(contentItems.reviewStatus, ['auto_published', 'approved']),
        category ? eq(contentItems.category, category) : undefined,
        gte(contentItems.publishedAt, sevenDaysAgo),
      ))
      .orderBy(desc(contentItems.publishedAt))
      .limit(limit);
  } catch {
    return [];
  }
}

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function EmptyFeedState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-8 h-8 mb-3 rounded-full bg-slate-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <p className="text-sm text-slate-400 max-w-[180px] leading-relaxed">{message}</p>
    </div>
  );
}

type FeedItem = {
  id: string; title: string; slug: string; category: string;
  riskLevel: string; publishedAt: Date | null; aiSummary: string | null;
  whyItMatters: string | null; sourceName: string;
};

function FeedItem({ item, compact = false }: { item: FeedItem; compact?: boolean }) {
  const date = formatDate(item.publishedAt);
  return (
    <Link
      href={`/item/${item.slug}`}
      className="group block rounded-lg border border-slate-200 bg-white p-4 hover:border-navy/40 hover:shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
      aria-label={item.title}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={item.category} />
          <RiskBadge level={item.riskLevel} />
        </div>
        {date && <span className="text-xs text-slate-400 tabular-nums flex-shrink-0">{date}</span>}
      </div>
      <p className="text-sm font-semibold text-slate-800 group-hover:text-navy leading-snug line-clamp-2 transition-colors">
        {item.title}
      </p>
      {!compact && item.aiSummary && (
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{item.aiSummary}</p>
      )}
      <p className="text-xs text-slate-400 mt-2">{item.sourceName}</p>
    </Link>
  );
}

const QUICK_LINKS = [
  { href: '/compliance', label: 'FMCSA Watch', desc: 'Regulatory updates', icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z' },
  { href: '/insurance', label: 'Insurance & Risk', desc: 'Cost & coverage intel', icon: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z' },
  { href: '/resources', label: 'Resource Directory', desc: 'Tools & services', icon: 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776' },
  { href: '/brief', label: 'Daily Brief', desc: 'All updates, filtered', icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z' },
  { href: '/search', label: 'Search', desc: 'Find any topic fast', icon: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' },
];

export default async function HomePage() {
  const [brief, compliance, freight, insurance] = await Promise.all([
    getPublishedItems(undefined, 6),
    getPublishedItems('compliance', 4),
    getPublishedItems('freight', 4),
    getPublishedItems('insurance', 4),
  ]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const totalItems = brief.length + compliance.length + freight.length + insurance.length;

  return (
    <div className="space-y-8">

      {/* Page header */}
      <header>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">{today}</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">
              Trucking Intelligence Hub
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Compliance, insurance, freight, and regulatory updates — for operators and owner-operators.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${totalItems > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${totalItems > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`} aria-hidden="true" />
              {totalItems > 0 ? `${totalItems} updates this week` : 'Pipeline initializing'}
            </span>
          </div>
        </div>
      </header>

      {/* Quick navigation tiles */}
      <nav aria-label="Quick navigation" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 hover:border-navy/40 hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            <div className="w-9 h-9 rounded-lg bg-navy/8 flex items-center justify-center group-hover:bg-navy/15 transition-colors">
              <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy leading-tight">{link.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
            </div>
          </Link>
        ))}
      </nav>

      {/* Main bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Brief — spans 2 columns on large screens */}
        <section className="lg:col-span-2" aria-labelledby="brief-heading">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-navy">
              <div>
                <h2 id="brief-heading" className="text-sm font-bold uppercase tracking-widest text-gold">Today&apos;s Brief</h2>
                <p className="text-xs text-blue-200 mt-0.5">Latest across all categories</p>
              </div>
              <Link href="/brief" className="text-xs text-blue-200 hover:text-white font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
                View all →
              </Link>
            </div>
            <div className="p-4 flex-1">
              {brief.length === 0 ? (
                <EmptyFeedState message="Pipeline initializes every 2 hours. Check back shortly." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {brief.map((item) => <FeedItem key={item.id} item={item} />)}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Compliance Alerts — right column */}
        <section aria-labelledby="compliance-heading">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
                <h2 id="compliance-heading" className="text-sm font-bold text-slate-800">FMCSA &amp; Compliance</h2>
              </div>
              <Link href="/compliance" className="text-xs text-navy hover:text-navy-light font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
                Watch →
              </Link>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-3">
              {compliance.length === 0 ? (
                <EmptyFeedState message="No compliance alerts this week." />
              ) : (
                compliance.map((item) => <FeedItem key={item.id} item={item} compact />)
              )}
            </div>
          </div>
        </section>

        {/* Insurance & Risk */}
        <section aria-labelledby="insurance-heading">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
                <h2 id="insurance-heading" className="text-sm font-bold text-slate-800">Insurance &amp; Risk</h2>
              </div>
              <Link href="/insurance" className="text-xs text-navy hover:text-navy-light font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
                Center →
              </Link>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-3">
              {insurance.length === 0 ? (
                <EmptyFeedState message="No insurance updates this week." />
              ) : (
                insurance.map((item) => <FeedItem key={item.id} item={item} compact />)
              )}
            </div>
          </div>
        </section>

        {/* Freight Market */}
        <section aria-labelledby="freight-heading">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
                <h2 id="freight-heading" className="text-sm font-bold text-slate-800">Freight Market Pulse</h2>
              </div>
              <Link href="/brief?category=freight" className="text-xs text-navy hover:text-navy-light font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
                All freight →
              </Link>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-3">
              {freight.length === 0 ? (
                <EmptyFeedState message="No freight market updates this week." />
              ) : (
                freight.map((item) => <FeedItem key={item.id} item={item} compact />)
              )}
            </div>
          </div>
        </section>

        {/* About this platform */}
        <section aria-labelledby="about-heading" className="lg:col-span-1">
          <div className="bg-navy rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
            <div className="px-5 py-4 border-b border-white/10">
              <h2 id="about-heading" className="text-sm font-bold text-gold uppercase tracking-widest">How This Works</h2>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-4">
              {[
                { icon: 'M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25', title: 'Sourced', desc: 'FMCSA, Federal Register, and approved industry publications — no scraped or restricted data.' },
                { icon: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5', title: 'Summarized', desc: 'AI-generated plain-English summaries with "why it matters" context for operators.' },
                { icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', title: 'Reviewed', desc: 'High-risk regulatory and insurance items go through admin review before publishing.' },
              ].map((step) => (
                <div key={step.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs text-blue-300">Updated every 2 hours · Sources always linked · No paid placements</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
