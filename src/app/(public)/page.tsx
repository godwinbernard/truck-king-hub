import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

type Article = Awaited<ReturnType<typeof getArticles>>[number];

const CAT_COLORS: Record<string, string> = {
  compliance: '#dc2626',
  freight: '#1d4ed8',
  insurance: '#d97706',
  equipment: '#52525b',
  general: '#059669',
  news: '#1e293b',
  lifestyle: '#0d9488',
};

function YellowCat({ category }: { category: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white"
      style={{ background: CAT_COLORS[category] ?? '#52525b' }}
    >
      {category}
    </span>
  );
}

function SectionEyebrow({ icon = '⚡', label }: { icon?: string; label: string }) {
  return (
    <p className="text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
      <span>{icon}</span>{label}
    </p>
  );
}

function BreakingTicker({ items }: { items: Article[] }) {
  if (items.length === 0) return null;
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden" style={{ background: '#F5C518' }} aria-label="Breaking news ticker">
      <div className="flex items-stretch">
        <div className="shrink-0 px-4 flex items-center" style={{ background: '#0d0d0d' }}>
          <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">Breaking</span>
        </div>
        <div className="overflow-hidden flex-1 py-2.5">
          <div className="ticker-track">
            {repeated.map((item, i) => (
              <Link key={`${item.id}-${i}`} href={`/article/${item.slug}`}
                className="inline-flex items-center gap-3 mr-12 text-sm font-black text-black hover:underline uppercase tracking-wide">
                <span className="text-black/40">◆</span>{item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const HERO_IMG = 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600&q=80&auto=format&fit=crop';
const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504222490345-c075b7b1b5fa?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=75&auto=format&fit=crop',
];

const AUDIENCE_TILES = [
  { label: 'Truckload Carriers', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=70&auto=format&fit=crop', href: '/brief?category=freight' },
  { label: 'Compliance & FMCSA', img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=70&auto=format&fit=crop', href: '/compliance' },
  { label: 'Insurance & Risk', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70&auto=format&fit=crop', href: '/insurance' },
  { label: 'Owner-Operators', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=70&auto=format&fit=crop', href: '/resources' },
];

const STATS = [
  { value: '25%', label: 'Curated Sources' },
  { value: '4', label: 'Approved Feeds' },
  { value: '100%', label: 'Free Access' },
  { value: 'Daily', label: 'Updates' },
];

const RESOURCE_TABS = [
  { label: 'News', href: '/brief', desc: 'Latest trucking industry updates' },
  { label: 'Compliance', href: '/compliance', desc: 'FMCSA & DOT regulatory changes' },
  { label: 'Insurance', href: '/insurance', desc: 'Coverage, CSA scores & premiums' },
  { label: 'Equipment', href: '/brief?category=equipment', desc: 'Trucks, trailers & tech' },
  { label: 'Resources', href: '/resources', desc: 'Load boards, fuel cards & tools' },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed" style={{ borderColor: '#2a2a2a' }}>
      <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>No articles published yet.</p>
      <Link href="/admin/articles/new" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>
        Write First Article →
      </Link>
    </div>
  );
}

function DarkCard({ item, imgUrl }: { item: Article; imgUrl: string }) {
  return (
    <Link
      href={`/article/${item.slug}`}
      className="group flex flex-col overflow-hidden transition-opacity hover:opacity-90"
      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
    >
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.coverImage || imgUrl} alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3"><YellowCat category={item.category} /></div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-white leading-snug mb-2 text-base line-clamp-2">{item.title}</h3>
        <p className="text-sm line-clamp-2 leading-relaxed flex-1" style={{ color: '#9ca3af' }}>{item.excerpt}</p>
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #2a2a2a' }}>
          <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>{item.author}</span>
          <span className="text-xs" style={{ color: '#9ca3af' }}>{fmtDate(item.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  noStore();
  const [latest, compliance, insurance] = await Promise.all([
    getArticles(undefined, 12),
    getArticles('compliance', 4),
    getArticles('insurance', 3),
  ]);

  const hero = latest.find((a) => a.featured) || latest[0];
  const grid = latest.filter((a) => a.id !== hero?.id).slice(3, 7);

  return (
    <div style={{ background: '#0d0d0d', color: '#fff' }}>

      <BreakingTicker items={latest.slice(0, 6)} />

      {/* ── HERO ── */}
      <section aria-label="Featured story" className="relative overflow-hidden" style={{ minHeight: 560 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero?.coverImage || HERO_IMG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center right' }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center" style={{ minHeight: 560 }}>
          {hero ? (
            <>
              <SectionEyebrow label="The Most Complete Trucking Intelligence" />
              <h1
                className="font-black uppercase text-white mb-6 leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', maxWidth: 700 }}
              >
                {hero.title}
              </h1>
              <p className="text-white/80 text-base mb-8 max-w-xl leading-relaxed">{hero.excerpt}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={`/article/${hero.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90"
                  style={{ background: '#F5C518', color: '#0d0d0d' }}
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link href="/brief" className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                  View All News →
                </Link>
              </div>
            </>
          ) : (
            <>
              <SectionEyebrow label="The Most Complete Trucking Intelligence" />
              <h1
                className="font-black uppercase text-white mb-6 leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', maxWidth: 700 }}
              >
                Daily Intelligence For Owner-Operators
              </h1>
              <p className="text-white/80 text-base mb-8 max-w-xl">FMCSA updates, compliance alerts, insurance intel, and freight news — every day.</p>
              <Link
                href="/brief"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
              >
                Browse All News →
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── AUDIENCE TILES ── */}
      <div style={{ borderTop: '4px solid #F5C518', background: '#0d0d0d' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {AUDIENCE_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative overflow-hidden flex items-end"
              style={{ height: 220 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tile.img} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: 'rgba(13,13,13,0.55)' }} />
              <div className="relative p-4 w-full" style={{ borderTop: '2px solid #F5C518' }}>
                <p className="font-black uppercase text-white text-sm tracking-widest leading-tight">{tile.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── STATS RING BAR ── */}
      <section className="map-bg py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-3">
                <div className="stat-ring">
                  <span className="font-black text-white text-2xl leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>{s.value}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: '#9ca3af' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCE CENTER (tabbed) ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionEyebrow label="Truck King Resources" />
          <h2 className="text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
            Resource Center
          </h2>
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
            {RESOURCE_TABS.map((tab, i) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="shrink-0 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors"
                style={i === 0
                  ? { background: 'transparent', color: '#ffffff', borderBottom: '2px solid #F5C518' }
                  : { background: 'transparent', color: '#9ca3af', borderBottom: '2px solid transparent' }
                }
              >
                {tab.label}
              </Link>
            ))}
          </div>
          {grid.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grid.map((item, i) => (
                <DarkCard key={item.id} item={item} imgUrl={CARD_IMAGES[i % CARD_IMAGES.length]} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PRESS / ABOUT SPLIT ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="p-8" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <SectionEyebrow label="Latest Update" />
              {latest[0] ? (
                <>
                  <h3 className="text-2xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                    {latest[0].title}
                  </h3>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9ca3af' }}>{latest[0].excerpt}</p>
                  <Link
                    href={`/article/${latest[0].slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest"
                    style={{ background: '#F5C518', color: '#0d0d0d' }}
                  >
                    View Article →
                  </Link>
                </>
              ) : (
                <p style={{ color: '#9ca3af' }}>No articles yet.</p>
              )}
            </div>

            <div className="p-8" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <SectionEyebrow label="About Us" />
              <h3 className="text-2xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                Built For The Road Ahead
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9ca3af' }}>
                Truck King Hub is a daily intelligence platform for independent truckers and small fleet owners.
                We aggregate FMCSA updates, compliance news, insurance intel, and freight trends — all in one place, every day, for free.
              </p>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
              >
                About Us →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMPLIANCE WATCH ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionEyebrow label="FMCSA & Compliance Watch" />
              <h2 className="text-3xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                Stay Ahead Of Every Regulation
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#9ca3af' }}>
                CSA scores, ELD mandates, HOS rules, inspection alerts, and FMCSA rulemaking — tracked daily and explained in plain English for working operators.
              </p>
              <Link
                href="/compliance"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
              >
                Compliance Center →
              </Link>
            </div>
            <div className="space-y-3">
              {compliance.length === 0
                ? <p style={{ color: '#9ca3af' }} className="text-sm">No compliance articles yet.</p>
                : compliance.map((item) => (
                  <Link key={item.id} href={`/article/${item.slug}`}
                    className="group flex items-start gap-4 p-4 transition-colors hover:opacity-80"
                    style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}>
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center mt-0.5" style={{ background: 'rgba(245,197,24,0.15)' }}>
                      <svg className="w-4 h-4" style={{ color: '#F5C518' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{item.author} · {fmtDate(item.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: '#f5f0e8' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionEyebrow label="Testimonials" />
              <h2 className="text-3xl font-black uppercase mb-8 leading-tight" style={{ color: '#0d0d0d', fontFamily: 'Impact, sans-serif' }}>
                What Operators Say
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { quote: "I check Truck King Hub every morning before dispatch. The compliance alerts alone have saved me hours.", name: 'Mike Thorn', company: 'Thorn Trucking LLC' },
                  { quote: "Finally a site that talks like a trucker, not a lawyer. The insurance center is genuinely useful.", name: 'Sandra Reeves', company: 'SR Freight, Owner-Op' },
                ].map((t) => (
                  <div key={t.name} className="p-5" style={{ background: '#fff', border: '1px solid #e5e0d5' }}>
                    <div className="w-10 h-10 flex items-center justify-center mb-3" style={{ background: '#F5C518' }}>
                      <span className="font-black text-xl leading-none" style={{ color: '#0d0d0d' }}>&quot;</span>
                    </div>
                    <p className="text-sm italic leading-relaxed mb-4" style={{ color: '#444' }}>&ldquo;{t.quote}&rdquo;</p>
                    <p className="font-black text-sm uppercase tracking-wide" style={{ color: '#0d0d0d' }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#888' }}>{t.company}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative overflow-hidden" style={{ height: 420 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=900&q=80&auto=format&fit=crop"
                alt="Semi truck on highway"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── INSURANCE CTA ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionEyebrow label="Insurance & Risk Intelligence" />
              <h2 className="text-3xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                What Your Safety Score Is Costing You Right Now
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#9ca3af' }}>
                CSA scores, claims history, and compliance violations directly impact your insurance premiums. Our Insurance & Risk Center breaks down exactly how — and what you can do about it.
              </p>
              <Link href="/insurance" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest" style={{ background: '#F5C518', color: '#0d0d0d' }}>
                Explore Insurance Center →
              </Link>
            </div>
            <div className="space-y-3">
              {insurance.length === 0
                ? <p style={{ color: '#9ca3af' }} className="text-sm">No insurance articles yet.</p>
                : insurance.map((item) => (
                  <Link key={item.id} href={`/article/${item.slug}`}
                    className="group flex items-start gap-4 p-4 hover:opacity-80 transition-opacity"
                    style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{item.author} · {fmtDate(item.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
