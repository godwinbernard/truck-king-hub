import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function CompliancePage() {
  const all = await db.select().from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(40);

  const compliance = all.filter((a) => a.category === 'compliance');
  const others = all.filter((a) => a.category !== 'compliance').slice(0, 6);

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-3">Truck King Hub</p>
          <h1 className="text-4xl font-bold text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            FMCSA &amp; Compliance Watch
          </h1>
          <p className="text-sm text-silver mt-2">DOT regulations, hours of service, inspections, and compliance updates.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-3 bg-amber-50 border border-amber-200 px-4 py-3 mb-8" role="note">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            Always review the original source before taking action. Summaries are for informational purposes only and do not constitute legal or compliance advice.
          </p>
        </div>

        {compliance.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-silver-light">
            <p className="text-silver mb-4">No compliance articles published yet.</p>
            <Link href="/brief" className="text-xs font-bold uppercase tracking-widest text-crimson hover:underline">Browse all articles →</Link>
          </div>
        ) : (
          <div className="divide-y divide-silver-light">
            {compliance.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`}
                className="group flex flex-col sm:flex-row gap-5 py-7 hover:bg-amber-50/40 -mx-4 px-4 transition-colors">
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 mb-2">Compliance</span>
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
      </div>
    </div>
  );
}
