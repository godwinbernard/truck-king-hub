import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, desc, gte, and } from 'drizzle-orm';
import Link from 'next/link';

// ─── Data helpers ───────────────────────────────────────────────────────────

async function getItems(category?: string, limit = 10) {
  try {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    return await db
      .select({
        id: contentItems.id,
        title: contentItems.title,
        slug: contentItems.slug,
        category: contentItems.category,
        riskLevel: contentItems.riskLevel,
        publishedAt: contentItems.publishedAt,
        rawExcerpt: contentItems.rawExcerpt,
        aiSummary: contentItems.aiSummary,
        sourceName: sources.name,
      })
      .from(contentItems)
      .innerJoin(sources, eq(contentItems.sourceId, sources.id))
      .where(and(
        inArray(contentItems.reviewStatus, ['auto_published', 'approved']),
        category ? eq(contentItems.category, category) : undefined,
        gte(contentItems.publishedAt, cutoff),
      ))
      .orderBy(desc(contentItems.publishedAt))
      .limit(limit);
  } catch { return []; }
}

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readTime(text: string | null) {
  if (!text) return '2 min read';
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

type Item = Awaited<ReturnType<typeof getItems>>[number];

// ─── Category colour mapping ─────────────────────────────────────────────────
const CAT_COLORS: Record<string, string> = {
  compliance: 'bg-red-600',
  freight:    'bg-blue-700',
  insurance:  'bg-amber-600',
  equipment:  'bg-zinc-700',
  general:    'bg-emerald-700',
};
function catColor(cat: string) { return CAT_COLORS[cat] ?? 'bg-zinc-600'; }

// ─── Placeholder trucking images (Unsplash — free, no auth needed) ───────────
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=80&auto=format&fit=crop',
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function CategoryTag({ category }: { category: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white ${catColor(category)}`}>
      {category}
    </span>
  );
}

function BreakingTicker({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  const repeated = [...items, ...items];
  return (
    <div className="bg-crimson overflow-hidden" aria-label="Breaking news ticker">
      <div className="flex items-stretch">
        <div className="shrink-0 bg-ink px-4 flex items-center z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">
            Breaking
          </span>
        </div>
        <div className="overflow-hidden flex-1 py-2.5 relative">
          <div className="ticker-track">
            {repeated.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={`/item/${item.slug}`}
                className="inline-flex items-center gap-3 mr-12 text-sm text-white font-medium hover:underline"
              >
                <span className="text-white/60">◆</span>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStory({ item, imgUrl }: { item: Item; imgUrl: string }) {
  const excerpt = item.aiSummary || item.rawExcerpt || '';
  return (
    <Link
      href={`/item/${item.slug}`}
      className="group relative block w-full overflow-hidden editorial-card"
      style={{ aspectRatio: '16/9', minHeight: 480, maxHeight: 620 }}
      aria-label={item.title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
        loading="eager"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-4">
          <CategoryTag category={item.category} />
          <span className="text-xs text-white/70 font-medium">{fmtDate(item.publishedAt)}</span>
          <span className="text-xs text-white/70">·</span>
          <span className="text-xs text-white/70">{readTime(excerpt)}</span>
        </div>
        <h2
          className="text-white font-bold leading-tight mb-3 group-hover:text-crimson transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
        >
          {item.title}
        </h2>
        {excerpt && (
          <p className="text-white/80 text-sm sm:text-base line-clamp-2 max-w-2xl leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-white/60 font-medium uppercase tracking-widest">{item.sourceName}</span>
          <span className="text-white/40">→</span>
        </div>
      </div>
    </Link>
  );
}

function EditorialCard({ item, imgUrl, size = 'md' }: { item: Item; imgUrl: string; size?: 'sm' | 'md' | 'lg' }) {
  const excerpt = item.aiSummary || item.rawExcerpt || '';
  const imgH = size === 'lg' ? 'h-56' : size === 'md' ? 'h-44' : 'h-36';
  const titleSize = size === 'lg'
    ? 'text-xl sm:text-2xl'
    : size === 'md' ? 'text-lg' : 'text-base';

  return (
    <Link
      href={`/item/${item.slug}`}
      className="group flex flex-col bg-white editorial-card overflow-hidden border border-silver-light hover:border-crimson/30 transition-colors"
      aria-label={item.title}
    >
      <div className={`relative overflow-hidden ${imgH} bg-silver-pale shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <CategoryTag category={item.category} />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3
          className={`font-bold text-ink group-hover:text-crimson transition-colors leading-snug mb-2 ${titleSize}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {item.title}
        </h3>
        {excerpt && size !== 'sm' && (
          <p className="text-sm text-charcoal/70 line-clamp-2 leading-relaxed flex-1">{excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-silver-light">
          <span className="text-xs text-silver font-medium">{item.sourceName}</span>
          <span className="text-xs text-silver">{fmtDate(item.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

function ListItem({ item }: { item: Item }) {
  return (
    <Link
      href={`/item/${item.slug}`}
      className="group flex items-start gap-4 py-4 border-b border-silver-light last:border-0 hover:bg-silver-pale/40 -mx-4 px-4 transition-colors"
      aria-label={item.title}
    >
      <div className="shrink-0 mt-1">
        <CategoryTag category={item.category} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold text-ink group-hover:text-crimson transition-colors leading-snug line-clamp-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {item.title}
        </p>
        <p className="text-xs text-silver mt-1">{item.sourceName} · {fmtDate(item.publishedAt)}</p>
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
        <h2
          className="text-xl font-black uppercase tracking-wide text-ink"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {label}
        </h2>
      </div>
      <Link href={href} className="text-xs font-bold uppercase tracking-widest text-crimson hover:text-crimson-dark transition-colors">
        See All →
      </Link>
    </div>
  );
}

// ─── Ad slot component ───────────────────────────────────────────────────────
function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  return (
    <div className="border border-dashed border-silver-light bg-silver-pale flex flex-col items-center justify-center py-8 px-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-silver mb-2">{label}</p>
      <p className="text-sm text-silver/60">Your brand reaches 50,000+ trucking professionals</p>
      <Link href="/contact/takedown" className="mt-3 text-xs font-bold uppercase tracking-widest text-crimson hover:underline">
        Advertise Here →
      </Link>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-silver-light bg-silver-pale/40">
      <svg className="w-8 h-8 text-silver mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <p className="text-sm text-silver max-w-xs leading-relaxed">{message}</p>
      <Link href="/admin/login" className="mt-4 text-xs font-bold uppercase tracking-widest text-crimson hover:underline">
        Run Ingestion →
      </Link>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const [latest, compliance, freight, equipment, insurance] = await Promise.all([
    getItems(undefined, 12),
    getItems('compliance', 5),
    getItems('freight', 4),
    getItems('equipment', 4),
    getItems('insurance', 5),
  ]);

  const hero        = latest[0];
  const secondary   = latest.slice(1, 4);
  const tertiary    = latest.slice(4, 8);
  const sidebarList = latest.slice(8, 12);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="bg-white">

      {/* Date bar */}
      <div className="border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <p className="text-xs text-silver font-medium">{today}</p>
          <p className="text-xs text-silver font-medium hidden sm:block">
            The Premium Source for Trucking Intelligence
          </p>
        </div>
      </div>

      {/* Breaking news ticker */}
      <BreakingTicker items={latest.slice(0, 6)} />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section aria-label="Featured story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">
        {hero ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">

            {/* Main hero — 2/3 width */}
            <div className="lg:col-span-2">
              <HeroStory item={hero} imgUrl={HERO_IMAGES[0]} />
            </div>

            {/* Right secondary stack */}
            <div className="flex flex-col gap-0 lg:gap-4 mt-6 lg:mt-0">
              {secondary.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/item/${item.slug}`}
                  className="group flex gap-4 p-4 border-b border-silver-light last:border-0 hover:bg-silver-pale/40 transition-colors editorial-card"
                  aria-label={item.title}
                >
                  <div className="relative w-20 h-20 shrink-0 overflow-hidden bg-silver-pale">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CARD_IMAGES[i]} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CategoryTag category={item.category} />
                    <p
                      className="mt-1.5 text-sm font-bold text-ink group-hover:text-crimson transition-colors leading-snug line-clamp-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-silver mt-1">{fmtDate(item.publishedAt)}</p>
                  </div>
                </Link>
              ))}
              {secondary.length === 0 && (
                <EmptyState message="Run ingestion from admin to populate stories." />
              )}
            </div>

          </div>
        ) : (
          <EmptyState message="No stories yet. Log into admin and click 'Run Ingestion Now' to fetch content from all RSS sources." />
        )}
      </section>

      {/* ── Ad Banner ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdSlot label="Sponsored — Premium Partner" />
      </div>

      {/* ── Editorial Grid + Sidebar ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-silver-light">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Main editorial grid — 3 cols */}
          <div className="lg:col-span-3">
            <SectionHeader label="Latest Stories" href="/brief" />
            {tertiary.length === 0 ? (
              <EmptyState message="Stories will appear here after ingestion." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {tertiary.map((item, i) => (
                  <EditorialCard key={item.id} item={item} imgUrl={CARD_IMAGES[(i + 3) % CARD_IMAGES.length]} size="md" />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">

              {/* Trending list */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1 h-6 bg-ink inline-block" aria-hidden="true" />
                  <h2 className="text-lg font-black uppercase tracking-wide text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Trending
                  </h2>
                </div>
                <div className="divide-y divide-silver-light">
                  {sidebarList.length === 0
                    ? <p className="text-sm text-silver py-4">No items yet.</p>
                    : sidebarList.map((item) => <ListItem key={item.id} item={item} />)
                  }
                </div>
              </div>

              {/* Ad slot */}
              <AdSlot label="Advertisement" />

              {/* Compliance alert box */}
              <div className="bg-ink text-white p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-3">FMCSA Watch</p>
                <div className="space-y-3">
                  {compliance.slice(0, 3).map((item) => (
                    <Link key={item.id} href={`/item/${item.slug}`} className="group block">
                      <p className="text-xs font-semibold text-white group-hover:text-crimson transition-colors leading-snug line-clamp-2"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-silver/60 mt-1">{fmtDate(item.publishedAt)}</p>
                    </Link>
                  ))}
                  {compliance.length === 0 && <p className="text-xs text-silver/60">No compliance updates.</p>}
                </div>
                <Link href="/compliance" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-crimson hover:underline">
                  Full Compliance Watch →
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </section>

      {/* ── Freight & Logistics ────────────────────────────────────── */}
      <section className="border-t border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader label="Freight & Logistics" href="/brief?category=freight" />
          {freight.length === 0 ? (
            <EmptyState message="Freight stories will appear after ingestion." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freight.map((item, i) => (
                <EditorialCard key={item.id} item={item} imgUrl={CARD_IMAGES[i % CARD_IMAGES.length]} size="sm" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Opinion / Insurance callout strip ─────────────────────── */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-4">Insurance & Risk Intelligence</p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                What Your Safety Score Is Costing You Right Now
              </h2>
              <p className="text-silver text-sm leading-relaxed mb-6">
                CSA scores, claims history, and compliance violations directly impact your insurance
                premiums. Our Insurance & Risk Center breaks down exactly how — and what you can do about it.
              </p>
              <Link
                href="/insurance"
                className="inline-flex items-center gap-2 px-6 py-3 bg-crimson hover:bg-crimson-dark text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Explore Insurance Center
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="space-y-4">
              {insurance.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/item/${item.slug}`} className="group flex items-start gap-4 p-4 border border-white/10 hover:border-crimson/50 transition-colors">
                  <span className="shrink-0 w-8 h-8 bg-crimson/20 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-crimson" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-crimson transition-colors leading-snug line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {item.title}
                    </p>
                    <p className="text-xs text-silver/60 mt-1">{item.sourceName} · {fmtDate(item.publishedAt)}</p>
                  </div>
                </Link>
              ))}
              {insurance.length === 0 && <p className="text-sm text-silver/60">Insurance updates will appear after ingestion.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ── Equipment & Trucks ─────────────────────────────────────── */}
      <section className="border-t border-silver-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader label="Trucks & Equipment" href="/brief?category=equipment" />
          {equipment.length === 0 ? (
            <EmptyState message="Equipment stories will appear after ingestion." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipment.map((item, i) => (
                <EditorialCard key={item.id} item={item} imgUrl={CARD_IMAGES[(i + 2) % CARD_IMAGES.length]} size="sm" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Full-width ad ─────────────────────────────────────────── */}
      <div className="border-t border-b border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdSlot label="Featured Partner — Reach 50K+ Trucking Pros" />
        </div>
      </div>

      {/* ── Compliance deep dive ───────────────────────────────────── */}
      <section className="border-t border-silver-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader label="Compliance & Regulatory" href="/compliance" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {compliance.length === 0 ? (
                <EmptyState message="Compliance updates will appear after ingestion." />
              ) : (
                <div className="divide-y divide-silver-light">
                  {compliance.map((item) => <ListItem key={item.id} item={item} />)}
                </div>
              )}
            </div>
            <div>
              <div className="bg-cream border border-silver-light p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-4">Know Your Rights</p>
                <h3 className="text-lg font-bold text-ink mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  FMCSA & DOT Compliance Made Simple
                </h3>
                <p className="text-sm text-charcoal/70 leading-relaxed mb-4">
                  Hours of service, ELD mandates, drug testing, CSA scores — we track every update so you don&apos;t miss a thing.
                </p>
                <Link href="/compliance" className="inline-block text-xs font-bold uppercase tracking-widest text-crimson hover:underline">
                  Open Compliance Watch →
                </Link>
              </div>
              <div className="mt-6">
                <AdSlot label="Advertisement" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Resources promo ────────────────────────────────────────── */}
      <section className="border-t border-silver-light bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-2">Owner-Operator Tools</p>
              <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                The Resource Directory
              </h2>
              <p className="text-sm text-charcoal/70 mt-1">Load boards, insurance brokers, compliance tools, and more.</p>
            </div>
            <Link
              href="/resources"
              className="shrink-0 px-6 py-3 border border-ink text-ink text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-white transition-colors"
            >
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
