import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';

async function getArticles(category?: string, limit = 10) {
  try {
    const conditions = category
      ? and(eq(articles.status, 'published'), eq(articles.category, category))
      : eq(articles.status, 'published');
    return await db.select().from(articles).where(conditions).orderBy(desc(articles.publishedAt)).limit(limit);
  } catch { return []; }
}

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

type Article = Awaited<ReturnType<typeof getArticles>>[number];

const CAT_COLORS: Record<string, string> = {
  compliance: 'bg-red-600', freight: 'bg-blue-700', insurance: 'bg-amber-600',
  equipment: 'bg-zinc-700', general: 'bg-emerald-700', news: 'bg-slate-800', lifestyle: 'bg-teal-700',
};
function catColor(cat: string) { return CAT_COLORS[cat] ?? 'bg-zinc-600'; }

const HERO_IMAGES = [
  '/hero.jpg',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80&auto=format&fit=crop',
];
const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504222490345-c075b7b1b5fa?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75&auto=format&fit=crop',
];

function CategoryTag({ category }: { category: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white ${catColor(category)}`}>
      {category}
    </span>
  );
}

function BreakingTicker({ items }: { items: Article[] }) {
  if (items.length === 0) return null;
  const repeated = [...items, ...items];
  return (
    <div className="bg-crimson overflow-hidden" aria-label="Breaking news ticker">
      <div className="flex items-stretch">
        <div className="shrink-0 bg-ink px-4 flex items-center z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">Breaking</span>
        </div>
        <div className="overflow-hidden flex-1 py-2.5">
          <div className="ticker-track">
            {repeated.map((item, i) => (
              <Link key={`${item.id}-${i}`} href={`/article/${item.slug}`}
                className="inline-flex items-center gap-3 mr-12 text-sm text-white font-medium hover:underline">
                <span className="text-white/60">◆</span>{item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStory({ item, imgUrl }: { item: Article; imgUrl: string }) {
  return (
    <Link href={`/article/${item.slug}`} className="group relative block w-full overflow-hidden editorial-card"
      style={{ aspectRatio: '16/9', minHeight: 480, maxHeight: 620 }} aria-label={item.title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.coverImage || imgUrl} alt="" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" loading="eager" />
      <div className="hero-overlay absolute inset-0" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-4">
          <CategoryTag category={item.category} />
          <span className="text-xs text-white/70 font-medium">{fmtDate(item.publishedAt)}</span>
          <span className="text-xs text-white/70">·</span>
          <span className="text-xs text-white/70">{readTime(item.body)}</span>
        </div>
        <h2 className="text-white font-bold leading-tight mb-3 group-hover:text-crimson transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}>
          {item.title}
        </h2>
        <p className="text-white/80 text-sm sm:text-base line-clamp-2 max-w-2xl leading-relaxed">{item.excerpt}</p>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-white/60 font-medium uppercase tracking-widest">{item.author}</span>
          <span className="text-white/40">→</span>
        </div>
      </div>
    </Link>
  );
}

function EditorialCard({ item, imgUrl, size = 'md' }: { item: Article; imgUrl: string; size?: 'sm' | 'md' }) {
  const imgH = size === 'md' ? 'h-44' : 'h-36';
  const titleSize = size === 'md' ? 'text-lg' : 'text-base';
  return (
    <Link href={`/article/${item.slug}`}
      className="group flex flex-col bg-white editorial-card overflow-hidden border border-silver-light hover:border-crimson/30 transition-colors"
      aria-label={item.title}>
      <div className={`relative overflow-hidden ${imgH} bg-silver-pale shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.coverImage || imgUrl} alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3"><CategoryTag category={item.category} /></div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className={`font-bold text-ink group-hover:text-crimson transition-colors leading-snug mb-2 ${titleSize}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h3>
        <p className="text-sm text-charcoal/70 line-clamp-2 leading-relaxed flex-1">{item.excerpt}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-silver-light">
          <span className="text-xs text-silver font-medium">{item.author}</span>
          <span className="text-xs text-silver">{fmtDate(item.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

function ListItem({ item }: { item: Article }) {
  return (
    <Link href={`/article/${item.slug}`}
      className="group flex items-start gap-4 py-4 border-b border-silver-light last:border-0 hover:bg-silver-pale/40 -mx-4 px-4 transition-colors"
      aria-label={item.title}>
      <div className="shrink-0 mt-1"><CategoryTag category={item.category} /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-ink group-hover:text-crimson transition-colors leading-snug line-clamp-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</p>
        <p className="text-xs text-silver mt-1">{item.author} · {fmtDate(item.publishedAt)}</p>
      </div>
      <svg className="shrink-0 w-4 h-4 text-silver-light group-hover:text-crimson transition-colors mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </Link>
  );
}

function SectionHeader({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="w-1 h-6 bg-crimson inline-block" aria-hidden="true" />
        <h2 className="text-xl font-black uppercase tracking-wide text-ink"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{label}</h2>
      </div>
      <Link href={href} className="text-xs font-bold uppercase tracking-widest text-crimson hover:text-crimson-dark transition-colors">See All →</Link>
    </div>
  );
}

function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  return (
    <div className="border border-dashed border-silver-light bg-silver-pale flex flex-col items-center justify-center py-8 px-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-silver mb-2">{label}</p>
      <p className="text-sm text-silver/60">Your brand reaches 50,000+ trucking professionals</p>
      <Link href="/contact/takedown" className="mt-3 text-xs font-bold uppercase tracking-widest text-crimson hover:underline">Advertise Here →</Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-silver-light bg-silver-pale/40">
      <svg className="w-8 h-8 text-silver mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
      </svg>
      <p className="text-sm text-silver max-w-xs leading-relaxed">No articles published yet.</p>
      <Link href="/admin/articles/new" className="mt-4 text-xs font-bold uppercase tracking-widest text-crimson hover:underline">Write First Article →</Link>
    </div>
  );
}

export default async function HomePage() {
  const [latest, compliance, freight, equipment, insurance] = await Promise.all([
    getArticles(undefined, 12),
    getArticles('compliance', 5),
    getArticles('freight', 4),
    getArticles('equipment', 4),
    getArticles('insurance', 5),
  ]);

  const hero = latest.find((a) => a.featured) || latest[0];
  const secondary = latest.filter((a) => a.id !== hero?.id).slice(0, 3);
  const tertiary = latest.filter((a) => a.id !== hero?.id).slice(3, 7);
  const sidebarList = latest.filter((a) => a.id !== hero?.id).slice(7, 11);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white">

      {/* Date bar */}
      <div className="border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <p className="text-xs text-silver font-medium">{today}</p>
          <p className="text-xs text-silver font-medium hidden sm:block">The Premium Source for Trucking Intelligence</p>
        </div>
      </div>

      <BreakingTicker items={latest.slice(0, 6)} />

      {/* Hero */}
      <section aria-label="Featured story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {hero ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HeroStory item={hero} imgUrl={HERO_IMAGES[0]} />
            </div>
            <div className="flex flex-col gap-0 lg:gap-0 divide-y divide-silver-light border border-silver-light">
              {secondary.length === 0
                ? <div className="p-8 text-center text-sm text-silver">More articles coming soon.</div>
                : secondary.map((item, i) => (
                  <Link key={item.id} href={`/article/${item.slug}`}
                    className="group flex gap-4 p-4 hover:bg-silver-pale/40 transition-colors" aria-label={item.title}>
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden bg-silver-pale">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.coverImage || CARD_IMAGES[i]} alt="" aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CategoryTag category={item.category} />
                      <p className="mt-1.5 text-sm font-bold text-ink group-hover:text-crimson transition-colors leading-snug line-clamp-3"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</p>
                      <p className="text-xs text-silver mt-1">{fmtDate(item.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ) : <EmptyState />}
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdSlot label="Sponsored — Premium Partner" />
      </div>

      {/* Editorial Grid + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-silver-light">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            <SectionHeader label="Latest Stories" href="/brief" />
            {tertiary.length === 0
              ? <EmptyState />
              : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tertiary.map((item, i) => <EditorialCard key={item.id} item={item} imgUrl={CARD_IMAGES[(i + 3) % CARD_IMAGES.length]} size="md" />)}
                </div>}
          </div>
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1 h-6 bg-ink inline-block" aria-hidden="true" />
                  <h2 className="text-lg font-black uppercase tracking-wide text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Trending</h2>
                </div>
                <div className="divide-y divide-silver-light">
                  {sidebarList.length === 0
                    ? <p className="text-sm text-silver py-4">No items yet.</p>
                    : sidebarList.map((item) => <ListItem key={item.id} item={item} />)}
                </div>
              </div>
              <AdSlot />
              <div className="bg-ink text-white p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-3">FMCSA Watch</p>
                <div className="space-y-3">
                  {compliance.slice(0, 3).map((item) => (
                    <Link key={item.id} href={`/article/${item.slug}`} className="group block">
                      <p className="text-xs font-semibold text-white group-hover:text-crimson transition-colors leading-snug line-clamp-2"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</p>
                      <p className="text-[10px] text-silver/60 mt-1">{fmtDate(item.publishedAt)}</p>
                    </Link>
                  ))}
                  {compliance.length === 0 && <p className="text-xs text-silver/60">No compliance articles yet.</p>}
                </div>
                <Link href="/compliance" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-crimson hover:underline">Full Compliance Watch →</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Freight */}
      <section className="border-t border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader label="Freight & Logistics" href="/brief?category=freight" />
          {freight.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freight.map((item, i) => <EditorialCard key={item.id} item={item} imgUrl={CARD_IMAGES[i % CARD_IMAGES.length]} size="sm" />)}
            </div>
          )}
        </div>
      </section>

      {/* Insurance callout */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-4">Insurance & Risk Intelligence</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                What Your Safety Score Is Costing You Right Now
              </h2>
              <p className="text-silver text-sm leading-relaxed mb-6">
                CSA scores, claims history, and compliance violations directly impact your insurance premiums. Our Insurance & Risk Center breaks down exactly how — and what you can do about it.
              </p>
              <Link href="/insurance" className="inline-flex items-center gap-2 px-6 py-3 bg-crimson hover:bg-crimson-dark text-white text-xs font-bold uppercase tracking-widest transition-colors">
                Explore Insurance Center
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="space-y-4">
              {insurance.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/article/${item.slug}`}
                  className="group flex items-start gap-4 p-4 border border-white/10 hover:border-crimson/50 transition-colors">
                  <span className="shrink-0 w-8 h-8 bg-crimson/20 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-crimson" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-crimson transition-colors leading-snug line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</p>
                    <p className="text-xs text-silver/60 mt-1">{item.author} · {fmtDate(item.publishedAt)}</p>
                  </div>
                </Link>
              ))}
              {insurance.length === 0 && <p className="text-sm text-silver/60">Insurance articles coming soon.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="border-t border-silver-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader label="Trucks & Equipment" href="/brief?category=equipment" />
          {equipment.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipment.map((item, i) => <EditorialCard key={item.id} item={item} imgUrl={CARD_IMAGES[(i + 2) % CARD_IMAGES.length]} size="sm" />)}
            </div>
          )}
        </div>
      </section>

      {/* Ad */}
      <div className="border-t border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdSlot label="Featured Partner — Reach 50K+ Trucking Pros" />
        </div>
      </div>

      {/* Resources promo */}
      <section className="border-t border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-2">Owner-Operator Tools</p>
              <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>The Resource Directory</h2>
              <p className="text-sm text-charcoal/70 mt-1">Load boards, insurance brokers, compliance tools, and more.</p>
            </div>
            <Link href="/resources" className="shrink-0 px-6 py-3 border border-ink text-ink text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-white transition-colors">
              Browse Directory →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🛣️', label: 'Load Boards', desc: 'Compare top freight platforms' },
              { icon: '🛡️', label: 'Insurance', desc: 'Coverage options & brokers' },
              { icon: '📋', label: 'Compliance', desc: 'DOT, ELD & CSA tools' },
              { icon: '⛽', label: 'Fuel & Routes', desc: 'Fuel cards & trip planners' },
            ].map((item) => (
              <Link key={item.label} href="/resources" className="group flex flex-col gap-3 p-5 bg-white border border-silver-light hover:border-crimson/40 hover:shadow-sm transition-all editorial-card">
                <span className="text-2xl" role="img" aria-label={item.label}>{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-ink group-hover:text-crimson transition-colors">{item.label}</p>
                  <p className="text-xs text-silver mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
