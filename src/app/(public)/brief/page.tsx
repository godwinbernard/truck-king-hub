import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';

const CATEGORIES = ['news', 'compliance', 'freight', 'equipment', 'insurance', 'lifestyle', 'general'];

const CATEGORY_DESC: Record<string, string> = {
  news:       'Latest trucking news & industry updates',
  compliance: 'FMCSA & DOT regulatory updates',
  insurance:  'Coverage, premiums & risk intelligence',
  freight:    'Rates, logistics & freight market',
  equipment:  'Trucks, trailers & technology',
  lifestyle:  'Driver life, health & community',
  general:    'Business insights & owner-operator advice',
};

const CAT_COLORS: Record<string, string> = {
  compliance: 'bg-red-600', freight: 'bg-blue-700', insurance: 'bg-amber-600',
  equipment: 'bg-zinc-700', general: 'bg-emerald-700', news: 'bg-slate-800', lifestyle: 'bg-teal-700',
};

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default async function BriefPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const category = params.category && CATEGORIES.includes(params.category) ? params.category : undefined;

  const conditions = category
    ? and(eq(articles.status, 'published'), eq(articles.category, category))
    : eq(articles.status, 'published');

  const rows = await db.select().from(articles).where(conditions).orderBy(desc(articles.publishedAt)).limit(50);

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <div className="border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-3">Truck King Hub</p>
          <h1 className="text-4xl font-bold text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {category ? CATEGORY_DESC[category] : 'All Articles'}
          </h1>
          <p className="text-sm text-silver mt-2">{rows.length} {rows.length === 1 ? 'article' : 'articles'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/brief"
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${!category ? 'bg-ink text-white' : 'border border-silver-light text-charcoal hover:border-ink hover:text-ink'}`}>
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/brief?category=${cat}`}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${category === cat ? 'bg-ink text-white' : 'border border-silver-light text-charcoal hover:border-ink hover:text-ink'}`}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Articles */}
        {rows.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-silver-light">
            <p className="text-silver mb-4">No articles in this category yet.</p>
            <Link href="/brief" className="text-xs font-bold uppercase tracking-widest text-crimson hover:underline">View all articles →</Link>
          </div>
        ) : (
          <div className="divide-y divide-silver-light">
            {rows.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`}
                className="group flex flex-col sm:flex-row gap-5 py-7 hover:bg-silver-pale/30 -mx-4 px-4 transition-colors">
                <div className="sm:w-48 lg:w-56 shrink-0">
                  <div className="relative h-36 overflow-hidden bg-silver-pale">
                    {article.coverImage
                      ? <img src={article.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      : <div className="absolute inset-0 bg-linear-to-br from-silver-pale to-silver-light" />
                    }
                    <div className="absolute top-2 left-2">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white ${CAT_COLORS[article.category] ?? 'bg-zinc-600'}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h2 className="text-xl font-bold text-ink group-hover:text-crimson transition-colors leading-snug mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {article.title}
                  </h2>
                  <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-silver">
                    <span className="font-semibold text-charcoal">{article.author}</span>
                    <span>·</span>
                    <span>{fmtDate(article.publishedAt)}</span>
                    <span>·</span>
                    <span>{readTime(article.body)}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center shrink-0">
                  <svg className="w-5 h-5 text-silver-light group-hover:text-crimson transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
