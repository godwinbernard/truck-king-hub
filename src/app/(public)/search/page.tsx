import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const SUGGESTED = ['FMCSA', 'ELD mandate', 'CSA score', 'cargo insurance', 'spot rates', 'HOS violation', 'fuel surcharge'];

const CAT_COLORS: Record<string, string> = {
  compliance: '#dc2626', freight: '#1d4ed8', insurance: '#d97706',
  equipment: '#52525b', general: '#059669', news: '#1e293b', lifestyle: '#0d9488',
};

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';

  const results = query
    ? await db.select().from(articles)
        .where(or(
          ilike(articles.title, `%${query}%`),
          ilike(articles.excerpt, `%${query}%`),
          ilike(articles.body, `%${query}%`),
          eq(articles.status, 'published'),
        ))
        .orderBy(desc(articles.publishedAt))
        .limit(30)
        .then((rows) => rows.filter((r) => r.status === 'published'))
    : [];

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Truck King Hub</p>
          <h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
            Search
          </h1>
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Find articles on compliance, insurance, freight, equipment, and more.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search form */}
        <form method="GET" action="/search" role="search" className="mb-8">
          <div className="flex gap-2">
            <label htmlFor="q" className="sr-only">Search</label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="e.g. ELD mandate, CSA score, cargo insurance..."
              autoComplete="off"
              className="flex-1 min-h-[44px] px-4 py-2.5 text-sm focus:outline-none"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff' }}
            />
            <button
              type="submit"
              className="min-h-[44px] px-5 text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ background: '#F5C518', color: '#0d0d0d' }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Suggested tags */}
        {!query && (
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <a key={s} href={`/search?q=${encodeURIComponent(s)}`}
                  className="px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ border: '1px solid #2a2a2a', color: '#9ca3af', background: '#1a1a1a' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Result count */}
        {query && (
          <p className="text-sm mb-6 tabular-nums" style={{ color: '#9ca3af' }}>
            <span className="font-bold text-white">{results.length}</span> result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <div style={{ borderTop: '1px solid #2a2a2a' }}>
            {results.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`}
                className="article-row group flex flex-col py-6 -mx-4 px-4 transition-colors"
                style={{ borderBottom: '1px solid #2a2a2a' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ background: CAT_COLORS[a.category] ?? '#52525b' }}>
                    {a.category}
                  </span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{fmtDate(a.publishedAt)}</span>
                </div>
                <h2 className="text-lg font-bold text-white leading-snug mb-1 group-hover:opacity-80 transition-opacity">
                  {a.title}
                </h2>
                <p className="text-sm line-clamp-2" style={{ color: '#9ca3af' }}>{a.excerpt}</p>
                <p className="text-xs mt-2" style={{ color: '#6b7280' }}>{a.author}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="text-center py-20 border border-dashed" style={{ borderColor: '#2a2a2a' }}>
            <p className="font-bold text-white mb-2">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>Try a different keyword — for example: &ldquo;ELD&rdquo;, &ldquo;CSA score&rdquo;, or &ldquo;FMCSA&rdquo;.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED.slice(0, 4).map((s) => (
                <a key={s} href={`/search?q=${encodeURIComponent(s)}`}
                  className="px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ border: '1px solid #2a2a2a', color: '#9ca3af', background: '#1a1a1a' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
