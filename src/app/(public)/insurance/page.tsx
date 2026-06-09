import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

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
    <div className="bg-white min-h-screen">
      <div className="border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-3">Truck King Hub</p>
          <h1 className="text-4xl font-bold text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Insurance &amp; Risk Center
          </h1>
          <p className="text-sm text-silver mt-2 max-w-2xl">
            How insurance, safety scores, and compliance decisions affect your operating costs — for owner-operators and small fleet owners.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-ink text-white p-6 mb-10">
          <p className="text-sm text-white/80 leading-relaxed mb-5">
            Trucking insurance is one of the biggest controllable costs in your operation. Your CSA scores, accident history, authority age, and cargo type all affect what you pay at renewal. This center tracks the latest insurance-relevant news and explains what it means for your premium.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOPICS.map((t) => (
              <div key={t.label} className="bg-white/10 p-3">
                <p className="text-xs font-bold text-white mb-1">{t.label}</p>
                <p className="text-xs text-white/60 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {insurance.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-silver-light">
            <p className="text-silver mb-4">No insurance articles published yet.</p>
            <Link href="/brief" className="text-xs font-bold uppercase tracking-widest text-crimson hover:underline">Browse all articles →</Link>
          </div>
        ) : (
          <div className="divide-y divide-silver-light">
            {insurance.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`}
                className="group flex flex-col sm:flex-row gap-5 py-7 hover:bg-silver-pale/30 -mx-4 px-4 transition-colors">
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white bg-amber-600 mb-2">Insurance</span>
                  <h2 className="text-xl font-bold text-ink group-hover:text-crimson transition-colors leading-snug mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{a.title}</h2>
                  <p className="text-sm text-charcoal/70 line-clamp-2 mb-3">{a.excerpt}</p>
                  <p className="text-xs text-silver">{a.author} · {fmtDate(a.publishedAt)}</p>
                </div>
                <svg className="hidden sm:block shrink-0 w-5 h-5 text-silver-light group-hover:text-crimson transition-colors self-center" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-12 pt-8 border-t border-silver-light">
            <h2 className="text-lg font-bold text-ink mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>More from Truck King Hub</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((a) => (
                <Link key={a.id} href={`/article/${a.slug}`} className="group border border-silver-light p-4 hover:border-crimson/30 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-silver mb-2">{a.category}</p>
                  <p className="text-sm font-bold text-ink group-hover:text-crimson transition-colors leading-snug line-clamp-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{a.title}</p>
                  <p className="text-xs text-silver mt-2">{fmtDate(a.publishedAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-silver border-t border-silver-light pt-6 mt-10 leading-relaxed">
          Insurance information on this page is for educational purposes only and does not constitute insurance advice.
          Contact a licensed trucking insurance broker for coverage decisions.
        </p>
      </div>
    </div>
  );
}
