import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';
import Link from 'next/link';

const SUGGESTED = ['FMCSA', 'ELD mandate', 'CSA score', 'cargo insurance', 'spot rates', 'HOS violation', 'fuel surcharge'];

const CAT_COLORS: Record<string, string> = {
  compliance: 'bg-red-600', freight: 'bg-blue-700', insurance: 'bg-amber-600',
  equipment: 'bg-zinc-700', general: 'bg-emerald-700', news: 'bg-slate-800', lifestyle: 'bg-teal-700',
};

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';

  let results = query
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
    <div className="bg-white min-h-screen">
      <div className="border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-3">Truck King Hub</p>
          <h1 className="text-4xl font-bold text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Search
          </h1>
          <p className="text-sm text-silver mt-2">Find articles on compliance, insurance, freight, equipment, and more.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              className="flex-1 min-h-[44px] border border-silver-light px-4 py-2.5 text-sm text-ink placeholder:text-silver focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <button
              type="submit"
              className="min-h-[44px] px-5 bg-ink text-white text-sm font-bold hover:bg-charcoal transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {!query && (
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-silver mb-3">Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <a key={s} href={`/search?q=${encodeURIComponent(s)}`}
                  className="px-3 py-1.5 text-xs font-medium border border-silver-light text-charcoal hover:border-ink hover:text-ink transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
        )}

        {query && (
          <p className="text-sm text-silver mb-6 tabular-nums">
            <span className="font-bold text-ink">{results.length}</span> result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}

        {results.length > 0 && (
          <div className="divide-y divide-silver-light">
            {results.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`}
                className="group flex flex-col py-6 hover:bg-silver-pale/30 -mx-4 px-4 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white ${CAT_COLORS[a.category] ?? 'bg-zinc-600'}`}>
                    {a.category}
                  </span>
                  <span className="text-xs text-silver">{fmtDate(a.publishedAt)}</span>
                </div>
                <h2 className="text-lg font-bold text-ink group-hover:text-crimson transition-colors leading-snug mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{a.title}</h2>
                <p className="text-sm text-charcoal/70 line-clamp-2">{a.excerpt}</p>
                <p className="text-xs text-silver mt-2">{a.author}</p>
              </Link>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center py-20 border border-dashed border-silver-light">
            <p className="font-bold text-ink mb-2">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-silver mb-6">Try a different keyword — for example: &ldquo;ELD&rdquo;, &ldquo;CSA score&rdquo;, or &ldquo;FMCSA&rdquo;.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED.slice(0, 4).map((s) => (
                <a key={s} href={`/search?q=${encodeURIComponent(s)}`}
                  className="px-3 py-1.5 text-xs font-medium border border-silver-light text-charcoal hover:border-ink hover:text-ink transition-colors">
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
