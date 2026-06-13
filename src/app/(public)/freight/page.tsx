import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Freight & Logistics | Truck King Hub',
  description: 'Freight rates, load boards, spot market trends, broker intelligence, and logistics news for owner-operators and small fleets.',
};

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const FREIGHT_TOPICS = [
  {
    icon: '📦',
    title: 'Spot vs. Contract Rates',
    body: 'Spot rates fluctuate daily based on load-to-truck ratios (L/T ratio). When the L/T ratio rises above 3.0, spot rates tend to strengthen — giving owner-operators leverage to command higher per-mile pay. Contract rates provide stability but typically run 10–15% below spot peaks. Most successful small fleets blend both: 60–70% contract for cash-flow certainty and 30–40% spot for upside.',
  },
  {
    icon: '🗺️',
    title: 'Load Boards Explained',
    body: 'Load boards are digital freight marketplaces where brokers post available loads. DAT Solutions and Truckstop.com are the two largest. DAT posts 500M+ loads annually and offers rate analytics. Truckstop.com is strong in the flatbed and specialty markets. Free options like uShip or Facebook Freight Groups work for newer carriers but offer less rate transparency.',
  },
  {
    icon: '🤝',
    title: 'Working with Freight Brokers',
    body: 'Brokers act as intermediaries between shippers and carriers. They earn a margin (typically 12–20%) on each load. Quick-pay options often cost 1.5–3% of the invoice — useful for cash flow but expensive long-term. Always verify broker authority and bond status on FMCSA\'s Licensing & Insurance site before hauling a load. A $75,000 broker bond is the minimum required by law.',
  },
  {
    icon: '⛽',
    title: 'Fuel Surcharges (FSC)',
    body: 'Fuel surcharges are adjustments applied per mile (or as a percentage of linehaul) that move with diesel prices. The most common FSC index is based on the US DOE weekly retail on-highway diesel price. When diesel rises above the base peg, the surcharge kicks in. Owner-operators should negotiate FSC terms explicitly in contracts — never assume it\'s included.',
  },
  {
    icon: '📊',
    title: 'Understanding Freight Lanes',
    body: 'Freight lanes are routes between origin and destination markets. Outbound lanes from manufacturing hubs (Southeast, Midwest) tend to pay well; inbound lanes from port cities can be harder to fill. Triangulating your routes — planning loads that minimize deadhead miles — is essential to profitability. Tools like DAT\'s lane rate tool show average rates by corridor.',
  },
  {
    icon: '🏗️',
    title: 'Flatbed & Specialized Freight',
    body: 'Flatbed freight (steel, lumber, construction equipment, oversized loads) typically pays a premium over dry van due to tarping, securement requirements, and fewer available drivers. Oversized/overweight loads require state permits, route surveys, and sometimes escort vehicles. Specialized carriers often earn $2.50–$4.00/mile compared to $1.80–$2.50 for standard dry van lanes.',
  },
];

const LOAD_BOARDS = [
  { name: 'DAT Solutions', type: 'Dry Van, Flatbed, Reefer', fee: '$45–$150/mo', href: 'https://www.dat.com', notes: 'Largest network, best rate analytics' },
  { name: 'Truckstop.com', type: 'All modes', fee: '$39–$249/mo', href: 'https://truckstop.com', notes: 'Strong flatbed & LTL coverage' },
  { name: 'Convoy', type: 'Dry Van', fee: 'Free (marketplace cut)', href: 'https://convoy.com', notes: 'Digital broker, instant booking' },
  { name: 'Uber Freight', type: 'Dry Van, Flatbed', fee: 'Free (marketplace cut)', href: 'https://uberfreight.com', notes: 'App-based, instant pay options' },
  { name: 'Coyote Logistics', type: 'All modes', fee: 'Negotiated', href: 'https://coyote.com', notes: 'Large broker, contract freight' },
  { name: 'Loadsmart', type: 'Dry Van, Flatbed', fee: 'Free (marketplace cut)', href: 'https://loadsmart.com', notes: 'AI-powered pricing, shipper-direct' },
];

const RATE_BENCHMARKS = [
  { lane: 'Dry Van (National Avg)', rpm: '$2.10–$2.40', trend: '↑', note: 'Seasonal peak Q4' },
  { lane: 'Flatbed (National Avg)', rpm: '$2.60–$3.10', trend: '→', note: 'Stable construction demand' },
  { lane: 'Reefer (National Avg)', rpm: '$2.40–$2.90', trend: '↑', note: 'Strong produce season' },
  { lane: 'Tanker (Hazmat)', rpm: '$3.00–$4.50', trend: '→', note: 'Steady, fewer drivers available' },
  { lane: 'Intermodal Drayage', rpm: '$120–$280/move', trend: '↓', note: 'Port congestion easing' },
  { lane: 'LTL (partial)', rpm: 'Varies by cwt', trend: '→', note: 'Consolidation market' },
];

const QUICK_REFS = [
  { label: 'FMCSA Broker License Lookup', href: 'https://li.fmcsa.dot.gov/liview/pkg_html.prc_main', external: true },
  { label: 'DOE Weekly Diesel Prices', href: 'https://www.eia.gov/petroleum/gasdiesel/', external: true },
  { label: 'DAT Rate View (Spot)', href: 'https://www.dat.com/industry-trends/trucking-rates', external: true },
  { label: 'Truckstop Rate Trends', href: 'https://truckstop.com/blog/freight-market/', external: true },
  { label: 'FreightWaves SONAR Insights', href: 'https://www.freightwaves.com', external: true },
  { label: 'ATRI Operational Costs Report', href: 'https://truckingresearch.org', external: true },
  { label: 'ATA Freight Forecast', href: 'https://trucking.org', external: true },
];

export default async function FreightPage() {
  const all = await db.select().from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(40);

  const freightArticles = all.filter((a) => a.category === 'freight');
  const others = all.filter((a) => a.category !== 'freight').slice(0, 6);

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>

      {/* ── HERO ── */}
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
            <span>⚡</span> Truck King Hub
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-3" style={{ fontFamily: 'Impact, sans-serif' }}>
            FREIGHT &amp; LOGISTICS
          </h1>
          <p className="text-base max-w-2xl" style={{ color: '#9ca3af' }}>
            Spot rates, load boards, broker intelligence, lane benchmarks, and freight market analysis built for owner-operators and small fleets who need to move freight profitably every day.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link href="/brief?category=freight" className="px-4 py-2 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-80" style={{ background: '#F5C518', color: '#0d0d0d' }}>
              All Freight Articles →
            </Link>
            <Link href="/calculators" className="px-4 py-2 text-xs font-black uppercase tracking-widest border transition-opacity hover:opacity-80" style={{ borderColor: '#2a2a2a', color: '#9ca3af' }}>
              Rate Calculators
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2 space-y-14">

            {/* Rate Benchmarks */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>📊</span> Market Snapshot
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                Current Rate Benchmarks
              </h2>
              <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>
                Indicative national average spot rates per mile (RPM). Actual rates vary by lane, equipment, and market conditions. Always verify against DAT or Truckstop for your specific corridor.
              </p>
              <div style={{ border: '1px solid #2a2a2a', overflow: 'hidden' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-white">Mode</th>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ color: '#F5C518' }}>Rate Range</th>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-white">Trend</th>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RATE_BENCHMARKS.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1f1f1f', background: i % 2 === 0 ? '#0d0d0d' : '#111111' }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#e5e7eb' }}>{row.lane}</td>
                        <td className="px-4 py-3 font-black" style={{ color: '#F5C518' }}>{row.rpm}</td>
                        <td className="px-4 py-3 font-bold text-base" style={{ color: row.trend === '↑' ? '#22c55e' : row.trend === '↓' ? '#ef4444' : '#9ca3af' }}>{row.trend}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#9ca3af' }}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-2" style={{ color: '#555' }}>Benchmarks updated periodically. Source: DAT Solutions, Truckstop.com market data. Not financial advice.</p>
            </section>

            {/* Freight Education */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>📘</span> Freight Fundamentals
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-6" style={{ fontFamily: 'Impact, sans-serif' }}>
                What Every Owner-Operator Must Know
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {FREIGHT_TOPICS.map((topic) => (
                  <div key={topic.title} className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <div className="text-2xl mb-3">{topic.icon}</div>
                    <h3 className="text-base font-black text-white uppercase mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>{topic.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{topic.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Load Boards Comparison */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>🔍</span> Finding Freight
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                Load Board Comparison
              </h2>
              <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>
                Choose a load board that fits your equipment type, preferred lanes, and budget. Most carriers use 2–3 boards simultaneously for maximum coverage.
              </p>
              <div style={{ border: '1px solid #2a2a2a', overflow: 'hidden' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-white">Platform</th>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Best For</th>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ color: '#F5C518' }}>Fee</th>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LOAD_BOARDS.map((board, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1f1f1f', background: i % 2 === 0 ? '#0d0d0d' : '#111111' }}>
                        <td className="px-4 py-3">
                          <a href={board.href} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#F5C518' }}>
                            {board.name} ↗
                          </a>
                        </td>
                        <td className="px-4 py-3" style={{ color: '#e5e7eb' }}>{board.type}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#d1d5db' }}>{board.fee}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#9ca3af' }}>{board.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Profitability Checklist */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>💰</span> Stay Profitable
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-5" style={{ fontFamily: 'Impact, sans-serif' }}>
                Freight Profitability Checklist
              </h2>
              <div className="space-y-3">
                {[
                  'Know your cost-per-mile (CPM) before accepting any load — fuel, maintenance, insurance, and fixed costs',
                  'Never haul below your all-in CPM + target profit margin (typically $0.25–$0.60/mile margin)',
                  'Factor in empty miles (deadhead) — a 400-mile loaded run with 150 miles deadhead changes your effective RPM significantly',
                  'Use fuel surcharge calculators to ensure FSC covers actual diesel cost increases',
                  'Verify broker bond and authority on FMCSA before hauling — $75K bond minimum required by law',
                  'Quick-pay fees of 2–3% add up: on $180,000 annual revenue, that\'s $3,600–$5,400/year in fees',
                  'Negotiate net-30 terms with anchor shippers; reserve quick-pay for cash emergencies only',
                  'Track your top-performing lanes — build relationships with shippers in profitable corridors',
                  'Join a fuel card program (EFS, Comdata, Relay) — savings of $0.05–$0.15/gallon compound fast',
                  'Review your insurance annually — rates change, and switching carriers can save $1,000–$5,000/year',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center font-black text-xs" style={{ background: '#F5C518', color: '#0d0d0d' }}>{i + 1}</div>
                    <p className="text-sm" style={{ color: '#e5e7eb' }}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Freight Articles */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>📰</span> Latest
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-5" style={{ fontFamily: 'Impact, sans-serif' }}>
                Freight Articles
              </h2>
              {freightArticles.length === 0 ? (
                <div className="text-center py-12 border border-dashed" style={{ borderColor: '#2a2a2a' }}>
                  <p className="mb-4 text-sm" style={{ color: '#9ca3af' }}>No freight articles published yet.</p>
                  <Link href="/brief" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>Browse all articles →</Link>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid #2a2a2a' }}>
                  {freightArticles.map((a) => (
                    <Link key={a.id} href={`/article/${a.slug}`}
                      className="article-row group flex flex-col sm:flex-row gap-5 py-7 -mx-4 px-4 transition-colors"
                      style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white mb-2" style={{ background: '#1d4ed8' }}>Freight</span>
                        <h3 className="text-xl font-bold text-white leading-snug mb-2 group-hover:opacity-80 transition-opacity">{a.title}</h3>
                        <p className="text-sm line-clamp-2 mb-3" style={{ color: '#9ca3af' }}>{a.excerpt}</p>
                        <p className="text-xs" style={{ color: '#9ca3af' }}>{a.author} · {fmtDate(a.publishedAt)}</p>
                      </div>
                      <svg className="hidden sm:block shrink-0 w-5 h-5 self-center" style={{ color: '#3a3a3a' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">

            {/* Quick Reference Links */}
            <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>🔗</span> Freight Resources
              </p>
              <ul className="space-y-2.5">
                {QUICK_REFS.map((ref) => (
                  <li key={ref.href}>
                    <a
                      href={ref.href}
                      target={ref.external ? '_blank' : undefined}
                      rel={ref.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-2 text-sm hover:underline"
                      style={{ color: '#e5e7eb' }}
                    >
                      <span style={{ color: '#F5C518' }}>→</span>
                      {ref.label}
                      <span className="text-xs" style={{ color: '#555' }}>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Freight Market Signals */}
            <div className="p-5" style={{ background: '#0d1a00', border: '1px solid #1a3a00' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#86efac' }}>📈 Market Signals to Watch</p>
              <ul className="space-y-3 text-sm" style={{ color: '#e5e7eb' }}>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>Load-to-truck ratio above 3.0 = strong spot market</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>DOE diesel above base peg triggers fuel surcharge</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>Q4 peak season (Oct–Dec): strongest dry van rates</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>Produce season (May–Jul): strongest reefer rates</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>Port congestion data impacts drayage availability</li>
              </ul>
            </div>

            {/* Cost-Per-Mile Quick Guide */}
            <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#F5C518' }}>🧮 Typical Owner-Op CPM</p>
              <ul className="space-y-2">
                {[
                  { item: 'Fuel', cpm: '~$0.55–$0.75' },
                  { item: 'Truck payment', cpm: '~$0.20–$0.35' },
                  { item: 'Insurance (trucking)', cpm: '~$0.15–$0.25' },
                  { item: 'Maintenance/repairs', cpm: '~$0.10–$0.18' },
                  { item: 'Tires', cpm: '~$0.05–$0.08' },
                  { item: 'Permits / licenses', cpm: '~$0.02–$0.04' },
                  { item: 'Total estimated CPM', cpm: '$1.10–$1.70' },
                ].map((r, i) => (
                  <li key={i} className="flex justify-between text-xs" style={{ borderBottom: i < 6 ? '1px solid #2a2a2a' : 'none', paddingBottom: i < 6 ? '6px' : 0 }}>
                    <span style={{ color: '#9ca3af' }}>{r.item}</span>
                    <span className="font-bold" style={{ color: i === 6 ? '#F5C518' : '#e5e7eb' }}>{r.cpm}</span>
                  </li>
                ))}
              </ul>
              <Link href="/calculators" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>
                Use Rate Calculator →
              </Link>
            </div>

            {/* Other Articles */}
            {others.length > 0 && (
              <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#F5C518' }}>📰 More From Hub</p>
                <ul className="space-y-3">
                  {others.map((a) => (
                    <li key={a.id}>
                      <Link href={`/article/${a.slug}`} className="text-sm leading-snug hover:underline block" style={{ color: '#e5e7eb' }}>
                        {a.title}
                      </Link>
                      <span className="text-xs" style={{ color: '#555' }}>{fmtDate(a.publishedAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
