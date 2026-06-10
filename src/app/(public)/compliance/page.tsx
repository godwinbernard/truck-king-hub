import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Truck King Hub</p>
          <h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
            FMCSA &amp; Compliance Watch
          </h1>
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>DOT regulations, hours of service, inspections, and compliance updates.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-3 px-4 py-3 mb-8" style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)' }} role="note">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: '#F5C518' }} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: '#d4a017' }}>
            Always review the original source before taking action. Summaries are for informational purposes only and do not constitute legal or compliance advice.
          </p>
        </div>

        {compliance.length === 0 ? (
          <div className="text-center py-20 border border-dashed" style={{ borderColor: '#2a2a2a' }}>
            <p className="mb-4" style={{ color: '#9ca3af' }}>No compliance articles published yet.</p>
            <Link href="/brief" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>Browse all articles →</Link>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #2a2a2a' }}>
            {compliance.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`}
                className="group flex flex-col sm:flex-row gap-5 py-7 -mx-4 px-4 transition-colors"
                style={{ borderBottom: '1px solid #2a2a2a' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#111111'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 mb-2">Compliance</span>
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
      </div>
    </div>
  );
}
