import { searchContent } from '@/lib/search/index';
import Link from 'next/link';
import { CategoryBadge } from '@/components/content/CategoryBadge';

const SUGGESTED_QUERIES = ['ELD mandate', 'CSA score', 'spot rates', 'FMCSA rule', 'fuel surcharge', 'cargo insurance', 'HOS violation'];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';

  let results: Awaited<ReturnType<typeof searchContent>> = [];
  if (query) {
    try {
      results = await searchContent(query);
    } catch {
      results = [];
    }
  }

  return (
    <div className="space-y-8">

      {/* Page header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Full-Text Search</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">Search Truck King Hub</h1>
        <p className="text-slate-500 text-sm mt-1">Search all compliance updates, insurance news, freight market data, and resources.</p>
      </header>

      {/* Search form */}
      <form method="GET" action="/search" role="search" aria-label="Search trucking intelligence">
        <div className="flex gap-2">
          <label htmlFor="search-input" className="sr-only">Search query</label>
          <input
            id="search-input"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="e.g. ELD mandate, CSA score, cargo insurance..."
            autoComplete="off"
            className="flex-1 min-h-[44px] border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy transition-colors"
          />
          <button
            type="submit"
            className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-light active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Suggested queries (shown when no query entered) */}
      {!query && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Try searching for</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((q) => (
              <a
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="inline-flex items-center h-8 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-navy/10 hover:text-navy border border-slate-200 hover:border-navy/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                {q}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      {query && (
        <p className="text-sm text-slate-500 tabular-nums">
          <span className="font-semibold text-slate-700">{results.length}</span> result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((item) => {
            const date = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '';
            return (
              <Link
                key={item.id}
                href={`/item/${item.slug}`}
                className="group block bg-white border border-slate-200 rounded-xl p-4 hover:border-navy/40 hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <CategoryBadge category={item.category} />
                  {date && <span className="text-xs text-slate-400 tabular-nums flex-shrink-0">{date}</span>}
                </div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-navy leading-snug transition-colors">
                  {item.title}
                </p>
                {item.aiSummary && (
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{item.aiSummary}</p>
                )}
                <p className="text-xs text-slate-400 mt-2">{item.sourceName}</p>
              </Link>
            );
          })}
        </div>
      )}

      {/* No results state */}
      {query && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-xl">
          <svg className="w-8 h-8 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="text-slate-500 font-semibold text-sm mb-1">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-slate-400 text-xs max-w-xs">Try a different keyword — for example: &ldquo;ELD&rdquo;, &ldquo;CSA score&rdquo;, &ldquo;spot rates&rdquo;, or &ldquo;FMCSA&rdquo;.</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {SUGGESTED_QUERIES.slice(0, 4).map((q) => (
              <a
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="inline-flex items-center h-8 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-navy/10 hover:text-navy border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                {q}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
