import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedStats } from '@/components/ui/AnimatedStats';
import { DieselTracker } from '@/components/ui/DieselTracker';

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

async function getDieselSnapshot(): Promise<{ price: number; change: number; weekOf: string; source: string }> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://truck-king-hub.vercel.app';
    const res = await fetch(`${base}/api/diesel`, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error('diesel fetch failed');
    const data = await res.json();
    const national = data.regions?.find((r: { code: string }) => r.code === 'NUS');
    if (!national) throw new Error('no national data');
    return { price: national.price, change: national.change, weekOf: data.weekOf, source: data.source };
  } catch {
    return { price: 3.623, change: -0.039, weekOf: 'Jun 9, 2025', source: 'fallback' };
  }
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
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=75&auto=format&fit=crop',
];

const AUDIENCE_TILES = [
  { label: 'Truckload Carriers', img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=70&auto=format&fit=crop', href: '/brief?category=freight' },
  { label: 'Compliance & FMCSA', img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=70&auto=format&fit=crop', href: '/compliance' },
  { label: 'Insurance & Risk', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70&auto=format&fit=crop', href: '/insurance' },
  { label: 'Owner-Operators', img: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=70&auto=format&fit=crop', href: '/resources' },
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
    img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=75&auto=format&fit=crop',
    tag: 'Industry Fact',
  },
  {
    stat: '3.5M',
    title: 'Truck drivers keep America moving',
    body: 'There are approximately 3.5 million professional truck drivers in the US. Owner-operators — independent truckers who own their rigs — make up roughly 350,000 of that total.',
    img: 'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?w=800&q=75&auto=format&fit=crop',
    tag: 'Workforce',
  },
  {
    stat: 'CSA',
    title: 'Your safety score affects everything',
    body: 'FMCSA\'s Compliance, Safety, Accountability (CSA) program scores carriers across 7 categories. A high CSA score can trigger roadside inspections, raise insurance premiums by 20–40%, and even result in out-of-service orders.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=75&auto=format&fit=crop',
    tag: 'Compliance',
  },
];

const LATEST_NEWS = [
  {
    title: 'FMCSA Eyes Expanded Short-Haul Exemption — 200-Mile Radius Proposed',
    excerpt: 'The agency is considering increasing the short-haul radius from 150 to 200 air miles. Tens of thousands of local operators could be freed from full ELD logging requirements if the rule passes.',
    category: 'compliance',
    date: 'Jun 10, 2025',
    img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=75&auto=format&fit=crop',
    href: '/compliance',
  },
  {
    title: 'Diesel Levels Off at $3.60 — Spot Rate Increase Expected This Quarter',
    excerpt: 'After months of price swings, national diesel has stabilized. Analysts say steady fuel costs may push spot rates upward as carriers revisit their fuel surcharge formulas heading into summer.',
    category: 'freight',
    date: 'Jun 9, 2025',
    img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=75&auto=format&fit=crop',
    href: '/brief?category=freight',
  },
  {
    title: 'Nuclear Verdicts Push Commercial Truck Insurance Up 8% Year Over Year',
    excerpt: 'Litigation costs and multi-million dollar jury awards are driving premiums higher across the board. Carriers with clean CSA scores and dashcams are seeing smaller increases at renewal.',
    category: 'insurance',
    date: 'Jun 7, 2025',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=75&auto=format&fit=crop',
    href: '/insurance',
  },
  {
    title: 'Owner-Operator Count Falls 3% as Low Rates and High Costs Squeeze Independents',
    excerpt: 'FMCSA data shows active single-truck carriers declined for a third straight quarter. Industry insiders point to suppressed spot rates, rising insurance, and higher fuel costs as the leading culprits.',
    category: 'news',
    date: 'Jun 5, 2025',
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=75&auto=format&fit=crop',
    href: '/brief',
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

const CALCULATOR_FEATURES = [
  {
    title: 'Fuel Cost',
    desc: 'Estimate trip fuel spend before you book the load.',
    href: '/calculators',
  },
  {
    title: 'Cost Per Mile',
    desc: 'See your true operating cost on every lane.',
    href: '/calculators',
  },
  {
    title: 'Profit Per Load',
    desc: 'Measure net profit after fuel, tolls, and pay.',
    href: '/calculators',
  },
  {
    title: 'Break-Even Rate',
    desc: 'Know the minimum rate needed to stay profitable.',
    href: '/calculators',
  },
  {
    title: 'Trip Time',
    desc: 'Plan dispatch windows with more realistic timing.',
    href: '/calculators',
  },
];

// ── Homepage Ad Banners ──────────────────────────────────────────────────────
type AdSlotName = 'leaderboard' | 'mid_page' | 'sidebar_a' | 'footer_banner';

function RealAdBanner({ slot }: { slot: AdSlotName }) {
  // ── Slot 1: Prestige Trucking Insurance (leaderboard) ──
  if (slot === 'leaderboard') {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: '#0a0f1e',
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 12px)',
          borderLeft: '4px solid #F5C518',
          borderBottom: '1px solid #F5C518',
        }}
        role="complementary"
        aria-label="Advertisement: Prestige Trucking Insurance"
      >
        {/* SPONSORED label */}
        <p
          className="absolute top-2 right-3 text-[9px] font-bold uppercase tracking-widest"
          style={{ color: '#4b5563' }}
        >
          SPONSORED
        </p>

        <a
          href="https://www.prestigetrucking.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-between gap-6 px-7 py-5 w-full transition-opacity hover:opacity-90"
          style={{ textDecoration: 'none' }}
        >
          {/* Left: icon + copy */}
          <div className="flex items-center gap-5">
            {/* Shield badge icon in yellow circle */}
            <div
              className="shrink-0 flex items-center justify-center rounded-full"
              style={{ width: 52, height: 52, background: '#F5C518' }}
              aria-hidden="true"
            >
              <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L2 5.5V13.5C2 19.7 6.9 25.5 13 27C19.1 25.5 24 19.7 24 13.5V5.5L13 1Z" fill="#0a0f1e" stroke="#0a0f1e" strokeWidth="0.5"/>
                <path d="M10.5 14.5L12.5 16.5L16 12" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div>
              <p
                className="font-black uppercase text-white leading-tight"
                style={{
                  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                  fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                  letterSpacing: '0.03em',
                }}
              >
                PRESTIGE TRUCKING INSURANCE
              </p>
              <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
                Trusted Coverage for Owner-Operators &amp; Fleets
              </p>
            </div>
          </div>

          {/* Right: CTA button */}
          <span
            className="shrink-0 px-6 py-3 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all hover:brightness-110"
            style={{ background: '#F5C518', color: '#0a0f1e', letterSpacing: '0.06em' }}
          >
            GET A FREE QUOTE &rarr;
          </span>
        </a>
      </div>
    );
  }

  // ── Slot 2: GEICO Commercial Insurance (mid_page) ──
  if (slot === 'mid_page') {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: '#0a1a0a',
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 12px)',
          borderLeft: '4px solid #00a651',
        }}
        role="complementary"
        aria-label="Advertisement: GEICO Commercial Auto Insurance"
      >
        {/* SPONSORED label */}
        <p
          className="absolute top-2 right-3 text-[9px] font-bold uppercase tracking-widest"
          style={{ color: '#4b5563' }}
        >
          SPONSORED
        </p>

        <a
          href="https://www.geico.com/commercial-auto/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-between gap-6 px-7 py-5 w-full transition-opacity hover:opacity-90"
          style={{ textDecoration: 'none' }}
        >
          {/* Left: icon + copy */}
          <div className="flex items-center gap-5">
            {/* Gecko silhouette in green circle */}
            <div
              className="shrink-0 flex items-center justify-center rounded-full"
              style={{ width: 52, height: 52, background: '#00a651' }}
              aria-hidden="true"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simple lizard/gecko silhouette */}
                <ellipse cx="14" cy="13" rx="4" ry="6" fill="#0a1a0a"/>
                <ellipse cx="14" cy="9" rx="2.5" ry="2" fill="#0a1a0a"/>
                <path d="M10 10 Q6 8 4 11" stroke="#0a1a0a" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18 10 Q22 8 24 11" stroke="#0a1a0a" strokeWidth="2" strokeLinecap="round"/>
                <path d="M11 17 Q8 21 6 20" stroke="#0a1a0a" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 17 Q20 21 22 20" stroke="#0a1a0a" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 19 Q13 23 14 26" stroke="#0a1a0a" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            <div>
              <p
                className="font-black uppercase text-white leading-tight"
                style={{
                  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                  fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                  letterSpacing: '0.03em',
                }}
              >
                GEICO COMMERCIAL AUTO
              </p>
              <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
                Save on Commercial Truck Insurance &mdash; Compare in Minutes
              </p>
            </div>
          </div>

          {/* Right: CTA button */}
          <span
            className="shrink-0 px-6 py-3 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all hover:brightness-110"
            style={{ background: '#00a651', color: '#ffffff', letterSpacing: '0.06em' }}
          >
            COMPARE RATES &rarr;
          </span>
        </a>
      </div>
    );
  }

  // ── Slot 3: sidebar_a — professional "Advertise Here" placeholder ──
  if (slot === 'sidebar_a') {
    return (
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-6 px-7 py-6 w-full"
        style={{
          background: '#0d0d0d',
          border: '2px dashed #F5C518',
        }}
        role="complementary"
        aria-label="Advertisement placeholder"
      >
        <div className="flex items-center gap-5">
          {/* Truck icon SVG */}
          <div
            className="shrink-0 flex items-center justify-center"
            style={{ width: 52, height: 52 }}
            aria-hidden="true"
          >
            <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="8" width="28" height="20" rx="2" fill="none" stroke="#F5C518" strokeWidth="2"/>
              <path d="M29 14h10l6 8v6H29V14Z" fill="none" stroke="#F5C518" strokeWidth="2"/>
              <circle cx="9" cy="30" r="4" fill="none" stroke="#F5C518" strokeWidth="2"/>
              <circle cx="37" cy="30" r="4" fill="none" stroke="#F5C518" strokeWidth="2"/>
              <line x1="13" y1="30" x2="33" y2="30" stroke="#F5C518" strokeWidth="2"/>
            </svg>
          </div>

          <div>
            <p
              className="font-black uppercase text-white leading-tight mb-1"
              style={{
                fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                letterSpacing: '0.04em',
              }}
            >
              ADVERTISE HERE
            </p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              Reach 10,000+ trucking professionals monthly
            </p>
          </div>
        </div>

        <a
          href="mailto:info@truckkinghub.com"
          className="shrink-0 px-6 py-3 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-opacity hover:opacity-80"
          style={{ background: '#F5C518', color: '#0d0d0d', letterSpacing: '0.06em' }}
        >
          CONTACT US &rarr;
        </a>
      </div>
    );
  }

  // ── Slot 4: footer_banner — full-width "Advertise Here" placeholder ──
  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-6 px-7 py-6 w-full"
      style={{
        background: '#0d0d0d',
        border: '2px dashed #F5C518',
      }}
      role="complementary"
      aria-label="Advertisement placeholder"
    >
      <div className="flex items-center gap-5">
        {/* Truck icon SVG */}
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 52, height: 36 }}
          aria-hidden="true"
        >
          <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="8" width="28" height="20" rx="2" fill="none" stroke="#F5C518" strokeWidth="2"/>
            <path d="M29 14h10l6 8v6H29V14Z" fill="none" stroke="#F5C518" strokeWidth="2"/>
            <circle cx="9" cy="30" r="4" fill="none" stroke="#F5C518" strokeWidth="2"/>
            <circle cx="37" cy="30" r="4" fill="none" stroke="#F5C518" strokeWidth="2"/>
            <line x1="13" y1="30" x2="33" y2="30" stroke="#F5C518" strokeWidth="2"/>
          </svg>
        </div>

        <div>
          <p
            className="font-black uppercase text-white leading-tight mb-1"
            style={{
              fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              letterSpacing: '0.04em',
            }}
          >
            ADVERTISE HERE
          </p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Reach 10,000+ trucking professionals monthly
          </p>
        </div>
      </div>

      <a
        href="mailto:info@truckkinghub.com"
        className="shrink-0 px-6 py-3 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-opacity hover:opacity-80"
        style={{ background: '#F5C518', color: '#0d0d0d', letterSpacing: '0.06em' }}
      >
        CONTACT US &rarr;
      </a>
    </div>
  );
}

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
  const [latest, compliance, insurance, diesel] = await Promise.all([
    getArticles(undefined, 12),
    getArticles('compliance', 4),
    getArticles('insurance', 3),
    getDieselSnapshot(),
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

      {/* ── AD SLOT 1: Leaderboard (below hero) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{ background: '#0d0d0d' }}>
        <RealAdBanner slot="leaderboard" />
      </div>

      {/* ── TODAY'S TRUCKING SNAPSHOT ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a' }} className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="pulse-dot" />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#F5C518' }}>
              Today&apos;s Trucking Snapshot — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Diesel Price — live from EIA */}
            <Link href="/freight" className="group flex flex-col gap-1 p-4 transition-opacity hover:opacity-80" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>⛽ National Diesel Avg</p>
              <p className="text-2xl font-black" style={{ color: '#F5C518', fontFamily: 'Impact, sans-serif' }}>${diesel.price.toFixed(3)}</p>
              <p className="text-xs" style={{ color: diesel.change <= 0 ? '#22c55e' : '#ef4444' }}>
                {diesel.change <= 0 ? '↓' : '↑'} ${Math.abs(diesel.change).toFixed(3)} vs last week
              </p>
              <p className="text-[10px] mt-1" style={{ color: '#555' }}>
                {diesel.source === 'fallback' ? 'Est. — EIA unavailable' : `EIA · ${diesel.weekOf}`}
              </p>
            </Link>
            {/* Compliance Alert */}
            <Link href="/compliance" className="group flex flex-col gap-1 p-4 transition-opacity hover:opacity-80" style={{ background: '#1a0000', border: '1px solid #7f1d1d' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#f87171' }}>🚨 Compliance Alert</p>
              <p className="text-sm font-bold text-white leading-snug">FMCSA short-haul ELD exemption update proposed</p>
              <p className="text-[10px] mt-1" style={{ color: '#f87171' }}>Jun 10, 2025 — Review now</p>
            </Link>
            {/* Freight Pulse */}
            <Link href="/freight" className="group flex flex-col gap-1 p-4 transition-opacity hover:opacity-80" style={{ background: '#0a1a00', border: '1px solid #166534' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#86efac' }}>📦 Freight Market</p>
              <p className="text-sm font-bold text-white leading-snug">Dry van spot rates holding $2.20–2.40/mi</p>
              <p className="text-[10px] mt-1" style={{ color: '#86efac' }}>L/T ratio: 2.8 — Moderate</p>
            </Link>
            {/* Featured Calculator */}
            <Link href="/calculators" className="group flex flex-col gap-1 p-4 transition-opacity hover:opacity-80" style={{ background: '#1a1a00', border: '1px solid #3f3f00' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fde047' }}>🧮 Quick Tool</p>
              <p className="text-sm font-bold text-white leading-snug">Is this load profitable? Run the numbers →</p>
              <p className="text-[10px] mt-1" style={{ color: '#fde047' }}>Profit Per Load Calculator</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIESEL PRICE TRACKER ── */}
      <DieselTracker />

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

      {/* ── CALCULATOR LANDING PAGE ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionEyebrow label="Trucking Calculators" />
            <h2 className="heading-bar text-3xl font-black uppercase text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Plan Costs Before You Roll
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed mb-8" style={{ color: '#9ca3af' }}>
              Quick trucking math for owner-operators and fleet managers. Estimate fuel, profit, break-even rates, and trip duration from one simple dashboard.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {CALCULATOR_FEATURES.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="card-shimmer group flex flex-col justify-between p-5 transition-all hover:-translate-y-1 hover:opacity-90 duration-300"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', minHeight: 170 }}
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#F5C518' }}>
                    Calculator
                  </p>
                  <h3 className="text-lg font-black uppercase text-white leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                    {item.desc}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color: '#F5C518' }}>
                  Open Calculator
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCE CENTER (tabbed) ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
          <SectionEyebrow label="Truck King Resources" />
          <h2 className="heading-bar text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
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

      {/* ── AD SLOT 2: Mid-page (after Resource Center) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6" style={{ background: '#0d0d0d' }}>
        <RealAdBanner slot="mid_page" />
      </div>

      {/* ── PRESS / ABOUT SPLIT ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="p-8" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <SectionEyebrow label="Latest Update" />
              {latest[0] ? (
                <>
                  <h3 className="text-2xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif', lineHeight: 1.25 }}>
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
              <h3 className="text-2xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
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
              <h2 className="text-3xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
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
              <h2 className="text-3xl font-black uppercase mb-8 leading-tight" style={{ color: '#0d0d0d', fontFamily: 'Georgia, serif' }}>
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
                src="https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=900&q=80&auto=format&fit=crop"
                alt="Semi truck on highway"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── RESOURCE GUIDE BANNER ── */}
      <div style={{ background: '#111111', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/resources"
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 transition-opacity hover:opacity-80"
          >
            <div className="flex items-center gap-4">
              <span className="shrink-0 text-2xl">⚡</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#F5C518' }}>Resource Guide</p>
                <p className="font-black text-white text-base leading-snug" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  What Each Resource Category Helps With
                </p>
                <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                  Load boards · Fuel cards · Compliance tools · Insurance · Equipment marketplaces · Trucking associations
                </p>
              </div>
            </div>
            <span
              className="shrink-0 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all group-hover:opacity-80 whitespace-nowrap"
              style={{ background: '#F5C518', color: '#0d0d0d' }}
            >
              Explore Resources →
            </span>
          </Link>
        </div>
      </div>

      {/* ── LATEST NEWS (hardcoded with images) ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionEyebrow label="Latest News" />
          <h2 className="text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
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

      {/* ── AD SLOT 3: After Latest News ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6" style={{ background: '#0d0d0d' }}>
        <RealAdBanner slot="sidebar_a" />
      </div>

      {/* ── INDUSTRY FACTS ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionEyebrow label="Industry Intelligence" />
            <h2 className="heading-bar text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
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
                    <h3 className="font-black uppercase text-white text-base mb-2 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>{fact.title}</h3>
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
            <h2 className="heading-bar text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
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

      {/* ── TRUCKING RANKINGS ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionEyebrow icon="🏆" label="Trucking Rankings" />
            <h2 className="text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Top Picks For Owner-Operators
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Top Truck Brands */}
            <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-1.5" style={{ color: '#F5C518' }}>🚛 Top Truck Brands</p>
              <ol className="space-y-2.5">
                {['Kenworth', 'Peterbilt', 'Freightliner', 'Volvo', 'International'].map((b, i) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: i === 0 ? '#F5C518' : '#2a2a2a', color: i === 0 ? '#0d0d0d' : '#9ca3af' }}>{i + 1}</span>
                    <span style={{ color: '#e5e7eb' }}>{b}</span>
                  </li>
                ))}
              </ol>
              <Link href="/brief?category=equipment" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>View Equipment →</Link>
            </div>

            {/* Top Insurance Companies */}
            <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-1.5" style={{ color: '#F5C518' }}>🛡️ Top Insurance Carriers</p>
              <ol className="space-y-2.5">
                {['Progressive Commercial', 'Old Republic', 'Sentry Insurance', 'OOIDA Trust', 'GEICO Commercial'].map((b, i) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: i === 0 ? '#F5C518' : '#2a2a2a', color: i === 0 ? '#0d0d0d' : '#9ca3af' }}>{i + 1}</span>
                    <span style={{ color: '#e5e7eb' }}>{b}</span>
                  </li>
                ))}
              </ol>
              <Link href="/insurance" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>Insurance Center →</Link>
            </div>

            {/* Top Load Boards */}
            <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-1.5" style={{ color: '#F5C518' }}>📦 Top Load Boards</p>
              <ol className="space-y-2.5">
                {['DAT Solutions', 'Truckstop.com', 'Convoy', 'Uber Freight', 'Loadsmart'].map((b, i) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: i === 0 ? '#F5C518' : '#2a2a2a', color: i === 0 ? '#0d0d0d' : '#9ca3af' }}>{i + 1}</span>
                    <span style={{ color: '#e5e7eb' }}>{b}</span>
                  </li>
                ))}
              </ol>
              <Link href="/resources" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>All Resources →</Link>
            </div>

            {/* Top Fuel Cards */}
            <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-1.5" style={{ color: '#F5C518' }}>⛽ Top Fuel Cards</p>
              <ol className="space-y-2.5">
                {['EFS (Fleetcor)', 'Comdata', 'Relay Payments', 'TCS Fuel Card', 'Coast (Trucking)'].map((b, i) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: i === 0 ? '#F5C518' : '#2a2a2a', color: i === 0 ? '#0d0d0d' : '#9ca3af' }}>{i + 1}</span>
                    <span style={{ color: '#e5e7eb' }}>{b}</span>
                  </li>
                ))}
              </ol>
              <Link href="/resources" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>All Resources →</Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMMUNITY BLOCK ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionEyebrow icon="🚛" label="Community" />
            <h2 className="text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Built By & For Truckers
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Driver Spotlight */}
            <div className="p-6 flex flex-col" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#F5C518' }}>🌟 Driver Spotlight</p>
              <p className="text-base font-bold text-white mb-3 leading-snug">&ldquo;Ran my first 500,000 miles as an owner-op last year. The compliance resources on this site helped me stay out of trouble and keep my CSA score clean.&rdquo;</p>
              <p className="text-xs mb-5" style={{ color: '#9ca3af' }}>— Marcus T., Independent Owner-Operator, Texas</p>
              <a href="mailto:info@truckkinghub.com?subject=Driver Story" className="mt-auto inline-block px-4 py-2 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-80" style={{ background: '#F5C518', color: '#0d0d0d' }}>
                Share Your Story
              </a>
            </div>

            {/* Submit a Tip */}
            <div className="p-6 flex flex-col" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#F5C518' }}>📨 Submit a Tip</p>
              <p className="text-sm text-white mb-3 font-bold">Know something the trucking community needs to hear?</p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#9ca3af' }}>
                Spot a new FMCSA rule? Found a great load board feature? Dealing with a broker issue? Drop us a tip and we&apos;ll look into it for a future story.
              </p>
              <a href="mailto:info@truckkinghub.com?subject=Tip - Truck King Hub" className="mt-auto inline-block px-4 py-2 text-xs font-black uppercase tracking-widest border transition-opacity hover:opacity-80" style={{ borderColor: '#F5C518', color: '#F5C518' }}>
                Send a Tip →
              </a>
            </div>

            {/* Quick Poll */}
            <div className="p-6 flex flex-col" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#F5C518' }}>📊 Quick Poll</p>
              <p className="text-base font-bold text-white mb-4 leading-snug">What&apos;s your biggest business challenge right now?</p>
              <div className="space-y-2 mb-5">
                {['Rising insurance premiums', 'Low spot freight rates', 'Fuel costs eating margins', 'FMCSA compliance burden', 'Finding reliable brokers'].map((opt) => (
                  <a
                    key={opt}
                    href={`mailto:info@truckkinghub.com?subject=Poll: ${encodeURIComponent(opt)}`}
                    className="block w-full text-left px-3 py-2 text-xs font-semibold border transition-colors hover:border-yellow-400 hover:text-white"
                    style={{ borderColor: '#2a2a2a', color: '#9ca3af' }}
                  >
                    {opt}
                  </a>
                ))}
              </div>
              <p className="text-[10px]" style={{ color: '#555' }}>Click to vote via email. Results in next week&apos;s digest.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── AD SLOT 4: Footer banner (before Insurance CTA) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6" style={{ background: '#0d0d0d' }}>
        <RealAdBanner slot="footer_banner" />
      </div>

      {/* ── INSURANCE CTA ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionEyebrow label="Insurance & Risk Intelligence" />
              <h2 className="text-3xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
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
