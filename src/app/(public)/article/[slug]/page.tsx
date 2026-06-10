import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
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

// Icon map for >>> icon: lines
const ICONS: Record<string, string> = {
  truck:      '🚛', money:     '💰', shield:   '🛡️', clock:    '🕐',
  check:      '✅', warning:   '⚠️', fuel:     '⛽', chart:    '📊',
  wrench:     '🔧', doc:       '📋', star:     '⭐', phone:    '📞',
  map:        '🗺️', key:       '🔑', fire:     '🔥', bolt:     '⚡',
  info:       'ℹ️', tip:       '💡', people:   '👥', package:  '📦',
};

function renderBody(body: string) {
  const paragraphs = body.split(/\n\n+/);
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const trimmed = paragraphs[i].trim();
    if (!trimmed) continue;

    // ## H2
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-black uppercase mt-12 mb-3 text-white flex items-center gap-3" style={{ fontFamily: 'Impact, sans-serif' }}>
          <span className="w-1 h-7 shrink-0 rounded-sm" style={{ background: '#F5C518' }} />
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }

    // # H3
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h3 key={i} className="text-lg font-black uppercase mt-8 mb-2 text-white" style={{ fontFamily: 'Impact, sans-serif', color: '#e5e7eb' }}>
          {trimmed.slice(2)}
        </h3>
      );
      continue;
    }

    // ### H4
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="text-base font-bold mt-6 mb-2" style={{ color: '#F5C518' }}>
          {trimmed.slice(4)}
        </h4>
      );
      continue;
    }

    // > Callout / blockquote
    if (trimmed.startsWith('> ')) {
      const text = trimmed.slice(2);
      elements.push(
        <div key={i} className="my-6 p-5 flex gap-4 items-start" style={{ background: 'rgba(245,197,24,0.08)', borderLeft: '4px solid #F5C518' }}>
          <span className="text-xl shrink-0">💡</span>
          <p className="text-sm leading-relaxed font-medium italic" style={{ color: '#e5e7eb' }}>{text}</p>
        </div>
      );
      continue;
    }

    // !! Warning box
    if (trimmed.startsWith('!! ')) {
      const text = trimmed.slice(3);
      elements.push(
        <div key={i} className="my-6 p-5 flex gap-4 items-start" style={{ background: 'rgba(220,38,38,0.08)', borderLeft: '4px solid #dc2626' }}>
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#fca5a5' }}>{text}</p>
        </div>
      );
      continue;
    }

    // :: Key Takeaway box
    if (trimmed.startsWith(':: ')) {
      const text = trimmed.slice(3);
      elements.push(
        <div key={i} className="my-6 p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#F5C518' }}>⚡ Key Takeaway</p>
          <p className="text-base font-bold text-white leading-snug">{text}</p>
        </div>
      );
      continue;
    }

    // Stat card: $$VALUE|Label
    if (trimmed.startsWith('$$')) {
      const parts = trimmed.slice(2).split('|');
      const val = parts[0]?.trim();
      const label = parts[1]?.trim();
      elements.push(
        <div key={i} className="my-4 inline-flex items-center gap-4 px-6 py-4" style={{ background: '#1a1a1a', border: '1px solid rgba(245,197,24,0.3)' }}>
          <span className="font-black text-3xl leading-none" style={{ color: '#F5C518', fontFamily: 'Impact, sans-serif' }}>{val}</span>
          {label && <span className="text-sm font-bold text-white uppercase tracking-wide">{label}</span>}
        </div>
      );
      continue;
    }

    // Numbered list: 1. item
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l));
      elements.push(
        <ol key={i} className="my-4 space-y-3 counter-reset-list">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 flex items-center justify-center text-xs font-black" style={{ background: '#F5C518', color: '#0d0d0d' }}>{j + 1}</span>
              <span className="text-sm leading-relaxed pt-0.5" style={{ color: '#d1d5db' }}>{item.replace(/^\d+\.\s/, '')}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list: - item
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
      elements.push(
        <ul key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#F5C518' }} />
              <span>{item.slice(2)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Icon bullet: >>> icon: text
    if (trimmed.startsWith('>>> ')) {
      const rest = trimmed.slice(4);
      const colonIdx = rest.indexOf(':');
      const iconKey = colonIdx > -1 ? rest.slice(0, colonIdx).trim() : 'bolt';
      const text = colonIdx > -1 ? rest.slice(colonIdx + 1).trim() : rest;
      const emoji = ICONS[iconKey] ?? '⚡';
      elements.push(
        <div key={i} className="flex items-start gap-3 my-3 p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <span className="text-xl shrink-0">{emoji}</span>
          <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>{text}</p>
        </div>
      );
      continue;
    }

    // Divider: ---
    if (trimmed === '---') {
      elements.push(<hr key={i} className="my-10" style={{ borderColor: '#2a2a2a' }} />);
      continue;
    }

    // Regular paragraph
    const rendered = trimmed
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e5e7eb">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    elements.push(
      <p key={i} className="text-base leading-relaxed my-4" style={{ color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: rendered }} />
    );
  }

  return elements;
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
  insurance:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=75&auto=format&fit=crop',
  compliance: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=900&q=75&auto=format&fit=crop',
  freight:    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=75&auto=format&fit=crop',
  equipment:  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=75&auto=format&fit=crop',
  general:    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=75&auto=format&fit=crop',
  news:       'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=75&auto=format&fit=crop',
  lifestyle:  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=75&auto=format&fit=crop',
};

function AdBanner({ slot }: { slot: 'top' | 'mid' | 'bottom' }) {
  const messages: Record<string, { headline: string; sub: string; cta: string }> = {
    top:    { headline: 'Advertise With Truck King Hub', sub: 'Reach 10,000+ owner-operators and fleet managers every month.', cta: 'Get Media Kit →' },
    mid:    { headline: 'Your Ad Here', sub: 'Target truckers, fleet owners, and logistics decision-makers directly.', cta: 'Contact Us →' },
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

  // Related articles (same category, different slug)
  const related = await db.select().from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(20)
    .then(rows => rows.filter(r => r.category === article.category && r.slug !== article.slug).slice(0, 3));

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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.3) 100%)' }} />
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

      {/* Two-column layout: content + sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Byline */}
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 text-sm" style={{ borderBottom: '1px solid #2a2a2a', color: '#9ca3af' }}>
              <span className="font-semibold" style={{ color: '#d1d5db' }}>{article.author}</span>
              <span>·</span>
              <span>{fmtDate(article.publishedAt)}</span>
              <span>·</span>
              <span>{readTime(article.body)}</span>
              <div className="ml-auto">
                <Link href="/brief" className="text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#F5C518' }}>
                  ← All Articles
                </Link>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl leading-relaxed mb-8 font-medium pl-5" style={{ color: '#d1d5db', borderLeft: '4px solid #F5C518' }}>
              {article.excerpt}
            </p>

            {/* Body */}
            <div className="prose-content max-w-none">
              {renderBody(article.body)}
            </div>

            {/* Mid-article image */}
            <div className="my-10 relative overflow-hidden rounded-sm" style={{ height: 300, background: '#1a1a1a' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={midImg} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-60" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.75) 0%, transparent 60%)' }} />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5" style={{ background: 'rgba(245,197,24,0.2)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.4)' }}>
                  ⚡ {article.category}
                </span>
              </div>
            </div>

            {/* Mid ad */}
            <AdBanner slot="mid" />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid #2a2a2a' }}>
                <span className="text-[10px] font-black uppercase tracking-widest self-center mr-1" style={{ color: '#6b7280' }}>Tags:</span>
                {article.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-70"
                    style={{ background: '#1a1a1a', color: '#9ca3af', border: '1px solid #2a2a2a' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom ad */}
            <AdBanner slot="bottom" />

            {/* Back link */}
            <div className="mt-4 pt-8 flex items-center gap-6" style={{ borderTop: '1px solid #2a2a2a' }}>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#F5C518' }}>
                ← Home
              </Link>
              <Link href="/brief" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#F5C518' }}>
                All Articles →
              </Link>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="lg:w-72 shrink-0 space-y-6">

            {/* About this site */}
            <div className="p-5" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#F5C518' }}>⚡ About Truck King Hub</p>
              <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                Daily intelligence for owner-operators and small fleet owners. FMCSA updates, compliance alerts, insurance intel, and freight news — all in one place.
              </p>
              <Link href="/" className="inline-block mt-4 px-4 py-2 text-xs font-black uppercase tracking-widest" style={{ background: '#F5C518', color: '#0d0d0d' }}>
                Explore Hub →
              </Link>
            </div>

            {/* Quick links */}
            <div className="p-5" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#F5C518' }}>⚡ Quick Links</p>
              <div className="space-y-2">
                {[
                  { label: '📋 Compliance Center', href: '/compliance' },
                  { label: '🛡️ Insurance Center', href: '/insurance' },
                  { label: '📦 Resources Directory', href: '/resources' },
                  { label: '🔍 Search Articles', href: '/search' },
                  { label: '📰 All News', href: '/brief' },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    className="block text-xs font-semibold py-2 px-3 transition-colors hover:opacity-80"
                    style={{ background: '#1a1a1a', color: '#d1d5db', border: '1px solid #2a2a2a' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar ad */}
            <div className="p-5" style={{ background: 'rgba(245,197,24,0.06)', border: '1px dashed rgba(245,197,24,0.35)' }}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: '#6b7280' }}>Advertisement</p>
              <p className="font-black uppercase text-white text-sm mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>Your Ad Here</p>
              <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>Advertise to 10,000+ trucking professionals.</p>
              <a href="/contact/takedown" className="block text-center px-3 py-2 text-xs font-black uppercase tracking-widest" style={{ background: '#F5C518', color: '#0d0d0d' }}>
                Advertise →
              </a>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="p-5" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#F5C518' }}>⚡ Related Articles</p>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.id} href={`/article/${r.slug}`} className="group block hover:opacity-80 transition-opacity">
                      <p className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:opacity-80">{r.title}</p>
                      <p className="text-[10px] mt-1" style={{ color: '#6b7280' }}>{r.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </article>
  );
}
