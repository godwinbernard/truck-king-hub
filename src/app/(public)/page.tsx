import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedStats } from '@/components/ui/AnimatedStats';

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

function SectionEyebrow({ icon = '⚡', label, animate = false }: { icon?: string; label: string; animate?: boolean }) {
  return (
    <p className={`text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5${animate ? ' animate-fade-in' : ''}`} style={{ color: '#F5C518' }}>
      <span className={animate ? 'float-badge' : ''}>{icon}</span>
      {label}
      {animate && <span className="pulse-dot ml-2" />}
    </p>
  );
}

function BreakingTicker({ items }: { items: Article[] }) {
  if (items.length === 0) return null;
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden" style={{ background: '#F5C518' }} aria-label="Breaking news ticker">
      <div className="flex items-stretch">
        <div className="shrink-0 px-4 flex items-center gap-2" style={{ background: '#0d0d0d' }}>
          <span className="pulse-dot" />
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

const HERO_IMG = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1600&q=85&auto=format&fit=crop';
const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=75&auto=format&fit=crop',
];

const AUDIENCE_TILES = [
  { label: 'Truckload Carriers', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=70&auto=format&fit=crop', href: '/brief?category=freight' },
  { label: 'Compliance & FMCSA', img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=70&auto=format&fit=crop', href: '/compliance' },
  { label: 'Insurance & Risk', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70&auto=format&fit=crop', href: '/insurance' },
  { label: 'Owner-Operators', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=70&auto=format&fit=crop', href: '/resources' },
];

const STATS = [
  { value: '3.5M+', label: 'Truck Drivers in the US' },
  { value: '$800B', label: 'Annual Trucking Revenue' },
  { value: '70%', label: 'Of All US Freight Moved by Truck' },
  { value: 'Daily', label: 'Intelligence Updates' },
];

const INDUSTRY_FACTS = [
  {
    stat: '$800B+',
    title: 'Trucking drives the US economy',
    body: 'The trucking industry generates over $800 billion annually and moves roughly 70% of all freight tonnage in the United States. Without trucks, store shelves would be empty within days.',
    img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=75&auto=format&fit=crop',
    tag: 'Industry Fact',
  },
  {
    stat: '3.5M',
    title: 'Truck drivers keep America moving',
    body: 'There are approximately 3.5 million professional truck drivers in the US. Owner-operators — independent truckers who own their rigs — make up roughly 350,000 of that total.',
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=75&auto=format&fit=crop',
    tag: 'Workforce',
  },
  {
    stat: 'CSA',
    title: 'Your safety score affects everything',
    body: 'FMCSA\'s Compliance, Safety, Accountability (CSA) program scores carriers across 7 categories. A high CSA score can trigger roadside inspections, raise insurance premiums by 20–40%, and even result in out-of-service orders.',
    img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=75&auto=format&fit=crop',
    tag: 'Compliance',
  },
];

const LATEST_NEWS = [
  {
    title: 'FMCSA Proposes New HOS Flexibility Rules for Short-Haul Operators',
    excerpt: 'The Federal Motor Carrier Safety Administration is reviewing Hours of Service regulations that could expand the short-haul exemption radius from 150 to 200 air miles, giving local drivers more flexibility.',
    category: 'compliance',
    date: 'Jun 2025',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=75&auto=format&fit=crop',
    href: '/compliance',
  },
  {
    title: 'Diesel Prices Hold Steady — What It Means for Spot Rates',
    excerpt: 'National average diesel prices have stabilized near $3.60/gallon after months of volatility. Analysts say flat fuel costs could put upward pressure on spot rates as carriers reassess fuel surcharge calculations.',
    category: 'freight',
    date: 'Jun 2025',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=75&auto=format&fit=crop',
    href: '/brief?category=freight',
  },
  {
    title: 'Commercial Truck Insurance Premiums Up 8% YoY — Here\'s Why',
    excerpt: 'Rising litigation costs, nuclear verdicts, and increased accident frequency are pushing commercial trucking insurance premiums higher. Owner-operators with clean CSA scores are faring better at renewal.',
    category: 'insurance',
    date: 'May 2025',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75&auto=format&fit=crop',
    href: '/insurance',
  },
  {
    title: 'ELD Mandate: What\'s Still Confusing Drivers in 2025',
    excerpt: 'Despite years on the books, the ELD mandate still trips up owner-operators on personal conveyance, adverse driving conditions exceptions, and what counts as on-duty time. We break it down.',
    category: 'compliance',
    date: 'May 2025',
    img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=75&auto=format&fit=crop',
    href: '/compliance',
  },
];

const QUICK_REFERENCES = [
  { label: 'FMCSA Hours of Service', desc: 'Max 11 hrs driving / 14 hrs on-duty window / 10 hrs off', icon: '🕐', href: '/compliance' },
  { label: 'CDL Medical Certificate', desc: 'Required every 2 years; DOT physical from certified examiner', icon: '🏥', href: '/compliance' },
  { label: 'Cargo Insurance Minimums', desc: '$750K–$5M liability depending on cargo type and authority', icon: '🛡️', href: '/insurance' },
  { label: 'IFTA Fuel Tax Reporting', desc: 'Quarterly filings required for trucks operating in 2+ states', icon: '⛽', href: '/resources' },
  { label: 'CSA Score Thresholds', desc: 'Scores above 65–80% trigger FMCSA intervention by BASIC category', icon: '📊', href: '/compliance' },
  { label: 'Bobtail Insurance', desc: 'Covers your tractor when operating without a trailer attached', icon: '🚛', href: '/insurance' },
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
      className="card-shimmer group flex flex-col overflow-hidden transition-all hover:opacity-90 hover:-translate-y-1 duration-300"
      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
    >
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.coverImage || imgUrl} alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(245,197,24,0.15) 0%, transparent 60%)' }} />
        <div className="absolute top-3 left-3"><YellowCat category={item.category} /></div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-white leading-snug mb-2 text-base line-clamp-2 group-hover:opacity-80 transition-opacity">{item.title}</h3>
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
              <SectionEyebrow label="The Most Complete Trucking Intelligence" animate />
              <h1
                className="font-black uppercase text-white mb-6 leading-none animate-fade-up"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', maxWidth: 700 }}
              >
                {hero.title}
              </h1>
              <p className="text-white/80 text-base mb-8 max-w-xl leading-relaxed animate-fade-up animate-fade-up-delay-1">{hero.excerpt}</p>
              <div className="flex items-center gap-4 animate-fade-up animate-fade-up-delay-2">
                <Link
                  href={`/article/${hero.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest transition-all hover:opacity-90 hover:scale-105 duration-200"
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
              <SectionEyebrow label="The Most Complete Trucking Intelligence" animate />
              <h1
                className="font-black uppercase text-white mb-6 leading-none animate-fade-up"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', maxWidth: 700 }}
              >
                Daily Intelligence For Owner-Operators
              </h1>
              <p className="text-white/80 text-base mb-8 max-w-xl animate-fade-up animate-fade-up-delay-1">FMCSA updates, compliance alerts, insurance intel, and freight news — every day.</p>
              <Link
                href="/brief"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest animate-fade-up animate-fade-up-delay-2 hover:scale-105 transition-transform"
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
      <AnimatedStats />

      {/* ── RESOURCE CENTER (tabbed) ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
          <SectionEyebrow label="Truck King Resources" />
          <h2 className="heading-bar text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
            Resource Center
          </h2>
          </ScrollReveal>
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
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80&auto=format&fit=crop"
                alt="Semi truck on highway"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS (hardcoded with images) ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionEyebrow label="Latest News" />
          <h2 className="text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
            What&apos;s Happening In Trucking
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LATEST_NEWS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <Link
                  href={item.href}
                  className="card-shimmer group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:opacity-90 duration-300 h-full"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  <div className="relative overflow-hidden" style={{ height: 160 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt="" aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(245,197,24,0.12) 0%, transparent 60%)' }} />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white"
                        style={{ background: CAT_COLORS[item.category] ?? '#52525b' }}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-bold text-white leading-snug mb-2 text-sm line-clamp-2 group-hover:opacity-80 transition-opacity">{item.title}</h3>
                    <p className="text-xs line-clamp-3 leading-relaxed flex-1" style={{ color: '#9ca3af' }}>{item.excerpt}</p>
                    <p className="text-xs mt-3 pt-3 font-medium" style={{ borderTop: '1px solid #2a2a2a', color: '#6b7280' }}>{item.date}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link href="/brief" className="text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: '#F5C518' }}>
              View All Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY FACTS ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionEyebrow label="Industry Intelligence" />
            <h2 className="heading-bar text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
              Facts Every Operator Should Know
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {INDUSTRY_FACTS.map((fact, i) => (
              <ScrollReveal key={fact.title} delay={i * 100}>
                <div className="card-shimmer group flex flex-col overflow-hidden transition-all hover:-translate-y-1 duration-300 h-full" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <div className="relative overflow-hidden" style={{ height: 220 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fact.img} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.95) 30%, transparent 100%)' }} />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-4xl font-black leading-none gradient-text" style={{ fontFamily: 'Impact, sans-serif' }}>{fact.stat}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(245,197,24,0.2)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.4)' }}>
                        {fact.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black uppercase text-white text-base mb-2 leading-snug" style={{ fontFamily: 'Impact, sans-serif' }}>{fact.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{fact.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK REFERENCE ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionEyebrow label="Quick Reference" />
            <h2 className="heading-bar text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
              Essential Rules &amp; Requirements
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_REFERENCES.map((ref, i) => (
              <ScrollReveal key={ref.label} delay={i * 60}>
                <Link
                  href={ref.href}
                  className="card-shimmer group flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:opacity-90 duration-200 h-full"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  <span className="text-2xl shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-200">{ref.icon}</span>
                  <div>
                    <p className="font-black uppercase text-white text-sm mb-1 leading-snug" style={{ fontFamily: 'Impact, sans-serif' }}>{ref.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{ref.desc}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
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
