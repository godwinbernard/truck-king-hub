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
          <h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
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
            <h2 className="text-lg font-black uppercase text-white mb-6" style={{ fontFamily: 'Impact, sans-serif' }}>More from Truck King Hub</h2>
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
