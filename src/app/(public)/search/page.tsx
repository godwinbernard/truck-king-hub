import { searchContent } from '@/lib/search/index';
import Link from 'next/link';
import { CategoryBadge } from '@/components/content/CategoryBadge';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? '';
  const results = query ? await searchContent(query) : [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-4">Search Truck King Hub</h1>
      <form method="GET" action="/search" className="mb-6">
        <div className="flex gap-2">
          <input name="q" defaultValue={query} placeholder="Search compliance updates, insurance news, freight market, resources..."
            className="flex-1 border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
          <button type="submit" className="bg-navy text-white px-5 py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors">
            Search
          </button>
        </div>
      </form>
      {query && <p className="text-sm text-slate-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>}
      <div className="space-y-5">
        {results.map((item) => {
          const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          return (
            <div key={item.id} className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <CategoryBadge category={item.category} />
                <span className="text-xs text-slate-400">{item.sourceName}{date ? ` · ${date}` : ''}</span>
              </div>
              <Link href={`/item/${item.slug}`} className="font-semibold text-navy hover:text-navy-light text-sm">{item.title}</Link>
              {item.aiSummary && <p className="text-sm text-slate-600 mt-1">{item.aiSummary}</p>}
            </div>
          );
        })}
        {!query && <p className="text-slate-400 text-sm">Enter a keyword above to search all trucking news, compliance updates, and resources.</p>}
        {query && results.length === 0 && <p className="text-slate-400 text-sm">No results found for &ldquo;{query}&rdquo;. Try a different keyword — for example: &ldquo;ELD&rdquo;, &ldquo;CSA score&rdquo;, &ldquo;spot rates&rdquo;, or &ldquo;FMCSA&rdquo;.</p>}
      </div>
    </div>
  );
}
