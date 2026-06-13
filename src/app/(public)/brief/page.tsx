import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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
  compliance: '#dc2626', freight: '#1d4ed8', insurance: '#d97706',
  equipment: '#52525b', general: '#059669', news: '#1e293b', lifestyle: '#0d9488',
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
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Truck King Hub</p>
          <h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {category ? CATEGORY_DESC[category] : 'All Articles'}
          </h1>
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>{rows.length} {rows.length === 1 ? 'article' : 'articles'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/brief"
            className="px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors"
            style={{ background: !category ? '#F5C518' : '#1a1a1a', color: !category ? '#0d0d0d' : '#9ca3af', border: '1px solid #2a2a2a' }}>
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/brief?category=${cat}`}
              className="px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors"
              style={{ background: category === cat ? '#F5C518' : '#1a1a1a', color: category === cat ? '#0d0d0d' : '#9ca3af', border: '1px solid #2a2a2a' }}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Articles */}
        {rows.length === 0 ? (
          <div className="text-center py-20 border border-dashed" style={{ borderColor: '#2a2a2a' }}>
            <p className="mb-4" style={{ color: '#9ca3af' }}>No articles in this category yet.</p>
            <Link href="/brief" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>View all articles →</Link>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #2a2a2a' }}>
            {rows.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`}
                className="article-row group flex flex-col sm:flex-row gap-5 py-7 -mx-4 px-4 transition-colors"
                style={{ borderBottom: '1px solid #2a2a2a' }}>
                <div className="sm:w-48 lg:w-56 shrink-0">
                  <div className="relative h-36 overflow-hidden" style={{ background: '#1a1a1a' }}>
                    {article.coverImage
                      ? <img src={article.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      : <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)' }} />
                    }
                    <div className="absolute top-2 left-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                        style={{ background: CAT_COLORS[article.category] ?? '#52525b' }}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h2 className="text-xl font-bold text-white leading-snug mb-2 group-hover:opacity-80 transition-opacity">
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: '#9ca3af' }}>{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#9ca3af' }}>
                    <span className="font-semibold" style={{ color: '#d1d5db' }}>{article.author}</span>
                    <span>·</span>
                    <span>{fmtDate(article.publishedAt)}</span>
                    <span>·</span>
                    <span>{readTime(article.body)}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center shrink-0">
                  <svg className="w-5 h-5 transition-colors" style={{ color: '#3a3a3a' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
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
