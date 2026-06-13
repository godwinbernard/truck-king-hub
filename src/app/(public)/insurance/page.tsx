import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const TOPICS = [
  { label: 'Premium Factors', desc: 'CSA scores, authority age, cargo type, accident history' },
  { label: 'Coverage Types', desc: 'Primary liability, cargo, physical damage, bobtail' },
  { label: 'CSA & Safety Scores', desc: 'How your safety record drives your premium' },
  { label: 'Claims Management', desc: 'Reporting, documentation, and protecting your record' },
];

const ARTICLE_SECTIONS = [
  {
    title: 'How trucking insurance premiums are calculated',
    body:
      'Trucking insurance is priced around business risk, not just the vehicle itself. Insurers look at the type of freight you haul, the areas you drive in, the value of your equipment, your safety history, and the way your company handles claims and compliance. A carrier with a strong operating record generally looks easier to insure than a carrier with frequent accidents or poor documentation.',
  },
  {
    title: 'Driving record and safety history',
    body:
      'Your CSA profile, accident history, and overall safety culture are some of the biggest influences on premium. A clean record usually helps keep insurance more affordable, while repeated violations or at-fault claims can quickly raise costs. For many trucking businesses, improving safety systems is the most reliable way to improve insurance outcomes over time.',
  },
  {
    title: 'Freight type changes the price',
    body:
      'Dry van, flatbed, reefer, hazardous materials, and specialized freight all create different risk profiles. Cargo value, spoilage exposure, loading conditions, and route complexity can all influence the quote. Two trucking businesses with the same truck can still receive very different rates if they haul different freight.',
  },
  {
    title: 'New authority often pays more',
    body:
      'New carriers usually pay higher premiums because insurers have less operating history to evaluate. Even experienced drivers can be priced as high risk when they first launch a motor carrier. As the business builds a track record of safe operations, the insurance picture often improves.',
  },
  {
    title: 'Equipment, routes, and coverage limits matter',
    body:
      'Newer trucks, expensive equipment, long-haul routes, urban freight patterns, and higher coverage limits can all raise the premium. Lower deductibles often cost more, while higher deductibles can lower the policy price. The right policy balances cost with real protection so one incident does not create a much bigger financial problem later.',
  },
  {
    title: 'Claims management affects future renewals',
    body:
      'Fast reporting, clear documentation, and organized incident handling can reduce long-term damage after a claim. Insurers pay attention to how often losses happen and how well they are managed. A trucking company that handles claims professionally usually looks more stable at renewal time.',
  },
  {
    title: 'How to lower your premium without cutting coverage',
    body:
      'The best ways to improve your insurance profile include keeping drivers trained, maintaining equipment, documenting safety procedures, using telematics where appropriate, and reviewing policies before renewal. The goal is not to buy the cheapest policy possible. The goal is to become a lower-risk business that deserves better pricing.',
  },
  {
    title: 'Why the cheapest policy is not always the best',
    body:
      'A low quote can hide weak coverage, restrictive exclusions, or poor claims support. In trucking, an underpowered policy can cost more than it saves when something goes wrong. The right insurance partner should understand your freight, your routes, and your growth plan, then build coverage around the real business instead of a generic checklist.',
  },
];

export default async function InsurancePage() {
  const all = await db.select().from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(40);

  const insurance = all.filter((a) => a.category === 'insurance');
  const others = all.filter((a) => a.category !== 'insurance').slice(0, 6);

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Truck King Hub</p>
          <h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Insurance &amp; Risk Center
          </h1>
          <p className="text-sm mt-2 max-w-2xl" style={{ color: '#9ca3af' }}>
            How insurance, safety scores, and compliance decisions affect your operating costs — for owner-operators and small fleet owners.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 mb-10" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#9ca3af' }}>
            Trucking insurance is one of the biggest controllable costs in your operation. Your CSA scores, accident history, authority age, and cargo type all affect what you pay at renewal. This center tracks the latest insurance-relevant news and explains what it means for your premium.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOPICS.map((t) => (
              <div key={t.label} className="p-3" style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.2)' }}>
                <p className="text-xs font-bold text-white mb-1">{t.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <article className="mb-12 p-6 sm:p-8" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Featured Article</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            How Trucking Insurance Premiums Are Calculated in the USA
          </h2>
          <p className="mt-3 text-sm max-w-3xl leading-relaxed" style={{ color: '#9ca3af' }}>
            Learn what affects trucking insurance pricing, which factors raise or lower your premium, and how owner-operators and fleet owners can reduce risk without cutting the protection they need.
          </p>

          <div className="mt-8 grid gap-6">
            {ARTICLE_SECTIONS.map((section) => (
              <section key={section.title} className="p-5 sm:p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <h3 className="text-lg sm:text-xl font-black uppercase text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  {section.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-8 p-5 sm:p-6" style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.25)' }}>
            <h3 className="text-lg font-black uppercase text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Bottom line</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
              Insurance pricing is really a reflection of operating discipline. The safer, cleaner, and more organized your trucking business is, the better your chances of getting stronger renewal terms over time. The cheapest policy is not always the best policy. The best policy is the one that protects the truck, the cargo, the driver, and the business.
            </p>
          </div>
        </article>

        {insurance.length === 0 ? (
          <div className="text-center py-20 border border-dashed" style={{ borderColor: '#2a2a2a' }}>
            <p className="mb-4" style={{ color: '#9ca3af' }}>No insurance articles published yet.</p>
            <Link href="/brief" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>Browse all articles →</Link>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #2a2a2a' }}>
            {insurance.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`}
                className="article-row group flex flex-col sm:flex-row gap-5 py-7 -mx-4 px-4 transition-colors"
                style={{ borderBottom: '1px solid #2a2a2a' }}>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white bg-amber-600 mb-2">Insurance</span>
                  <h2 className="text-xl font-bold text-white leading-snug mb-2 group-hover:opacity-80 transition-opacity">{a.title}</h2>
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: '#9ca3af' }}>{a.excerpt}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{a.author} · {fmtDate(a.publishedAt)}</p>
                </div>
                <svg className="hidden sm:block shrink-0 w-5 h-5 self-center" style={{ color: '#3a3a3a' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid #2a2a2a' }}>
            <h2 className="text-lg font-black uppercase text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>More from Truck King Hub</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((a) => (
                <Link key={a.id} href={`/article/${a.slug}`}
                  className="group p-4 transition-colors hover:opacity-80"
                  style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>{a.category}</p>
                  <p className="text-sm font-bold text-white leading-snug line-clamp-2">{a.title}</p>
                  <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>{fmtDate(a.publishedAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs pt-6 mt-10 leading-relaxed" style={{ borderTop: '1px solid #2a2a2a', color: '#9ca3af' }}>
          Insurance information on this page is for educational purposes only and does not constitute insurance advice.
          Contact a licensed trucking insurance broker for coverage decisions.
        </p>
      </div>
    </div>
  );
}
