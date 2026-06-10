import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
  if (!article) return {};
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
  };
}

function renderBody(body: string) {
  const paragraphs = body.split(/\n\n+/);
  return paragraphs.map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-black uppercase mt-10 mb-4 text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h3 key={i} className="text-xl font-black uppercase mt-8 mb-3 text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
          {trimmed.slice(2)}
        </h3>
      );
    }
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
      return (
        <ul key={i} className="list-disc list-outside ml-5 space-y-2 my-4 leading-relaxed" style={{ color: '#d1d5db' }}>
          {items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}
        </ul>
      );
    }

    const rendered = trimmed
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    return (
      <p key={i} className="text-base leading-relaxed my-4" style={{ color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: rendered }} />
    );
  });
}

const CAT_COLORS: Record<string, string> = {
  compliance: '#dc2626', freight: '#1d4ed8', insurance: '#d97706',
  equipment: '#52525b', general: '#059669', news: '#1e293b', lifestyle: '#0d9488',
};

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function readTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format&fit=crop',
];

function fallbackIndex(value: string) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0) % FALLBACK_IMAGES.length;
}

const CAT_IMAGES: Record<string, string> = {
  insurance: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=75&auto=format&fit=crop',
  compliance: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=900&q=75&auto=format&fit=crop',
  freight: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=75&auto=format&fit=crop',
  equipment: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=75&auto=format&fit=crop',
  general: 'https://images.unsplash.com/photo-1504222490345-c075b7b1b5fa?w=900&q=75&auto=format&fit=crop',
  news: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=75&auto=format&fit=crop',
  lifestyle: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=75&auto=format&fit=crop',
};

function AdBanner({ slot }: { slot: 'top' | 'mid' | 'bottom' }) {
  const messages: Record<string, { headline: string; sub: string; cta: string }> = {
    top: { headline: 'Advertise With Truck King Hub', sub: 'Reach 10,000+ owner-operators and fleet managers every month.', cta: 'Get Media Kit →' },
    mid: { headline: 'Your Ad Here', sub: 'Target truckers, fleet owners, and logistics decision-makers directly.', cta: 'Contact Us →' },
    bottom: { headline: 'Sponsor This Content', sub: 'Put your brand in front of active trucking professionals.', cta: 'Learn More →' },
  };
  const m = messages[slot];
  return (
    <div className="my-10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ background: 'rgba(245,197,24,0.06)', border: '1px dashed rgba(245,197,24,0.35)' }}>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>Advertisement</p>
        <p className="font-black uppercase text-white text-sm" style={{ fontFamily: 'Impact, sans-serif' }}>{m.headline}</p>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{m.sub}</p>
      </div>
      <a href="/contact/takedown"
        className="shrink-0 px-4 py-2 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-80"
        style={{ background: '#F5C518', color: '#0d0d0d' }}>
        {m.cta}
      </a>
    </div>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
  if (!article || article.status !== 'published') notFound();

  const imgSrc = article.coverImage || FALLBACK_IMAGES[fallbackIndex(article.slug)];
  const midImg = CAT_IMAGES[article.category] ?? FALLBACK_IMAGES[1];
  const catBg = CAT_COLORS[article.category] ?? '#52525b';

  return (
    <article style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>

      {/* Top ad banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <AdBanner slot="top" />
      </div>

      {/* Hero image */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(300px, 45vw, 520px)', background: '#111111' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={article.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ background: catBg }}>
              {article.category}
            </span>
          </div>
          <h1
            className="font-black uppercase leading-tight text-white"
            style={{ fontFamily: 'Impact, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}
          >
            {article.title}
          </h1>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 text-sm" style={{ borderBottom: '1px solid #2a2a2a', color: '#9ca3af' }}>
          <span className="font-semibold" style={{ color: '#d1d5db' }}>{article.author}</span>
          <span>·</span>
          <span>{fmtDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{readTime(article.body)}</span>
          <div className="ml-auto">
            <Link href="/" className="text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#F5C518' }}>
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Excerpt */}
        <p
          className="text-xl leading-relaxed mb-8 font-medium pl-5"
          style={{ color: '#d1d5db', borderLeft: '4px solid #F5C518' }}
        >
          {article.excerpt}
        </p>

        {/* Body — first half */}
        <div className="prose-content max-w-none">
          {renderBody(article.body)}
        </div>

        {/* Mid-article image */}
        <div className="my-10 relative overflow-hidden" style={{ height: 280, background: '#1a1a1a' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={midImg} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-60" loading="lazy" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 60%)' }} />
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5" style={{ background: 'rgba(245,197,24,0.2)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.4)' }}>
              ⚡ {article.category}
            </span>
          </div>
        </div>

        {/* Mid-article ad */}
        <AdBanner slot="mid" />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid #2a2a2a' }}>
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-black uppercase tracking-widest"
                style={{ background: '#1a1a1a', color: '#9ca3af', border: '1px solid #2a2a2a' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom ad */}
        <AdBanner slot="bottom" />

        {/* Back link */}
        <div className="mt-4 pt-8" style={{ borderTop: '1px solid #2a2a2a' }}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#F5C518' }}>
            ← More from Truck King Hub
          </Link>
        </div>

      </div>
    </article>
  );
}
