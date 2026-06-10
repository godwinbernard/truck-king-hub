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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
  if (!article || article.status !== 'published') notFound();

  const imgSrc = article.coverImage || FALLBACK_IMAGES[fallbackIndex(article.slug)];
  const catBg = CAT_COLORS[article.category] ?? '#52525b';

  return (
    <article style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>

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

        {/* Body */}
        <div className="prose-content max-w-none">
          {renderBody(article.body)}
        </div>

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

        {/* Back link */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #2a2a2a' }}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#F5C518' }}>
            ← More from Truck King Hub
          </Link>
        </div>

      </div>
    </article>
  );
}
