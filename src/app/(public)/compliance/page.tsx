import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const COMPLIANCE_TOPICS = [
  {
    icon: '📋',
    title: 'Hours of Service (HOS)',
    body: 'Federal HOS rules limit how long a commercial driver can operate a vehicle before taking a required rest break. Property-carrying drivers are limited to 11 hours of driving within a 14-hour window after 10 consecutive off-duty hours. Violating HOS rules is one of the most common enforcement actions and can result in out-of-service orders and fines.',
    link: null,
  },
  {
    icon: '🛑',
    title: 'Electronic Logging Devices (ELD)',
    body: 'ELDs became mandatory for most commercial motor vehicle drivers in December 2019 under FMCSA regulations. An ELD automatically records driving time and hours of service data by synchronizing with the vehicle engine. Carriers must use FMCSA-registered ELDs from the approved device list. Drivers must carry ELD instruction sheets and malfunction reporting requirements.',
    link: null,
  },
  {
    icon: '🏷️',
    title: 'CSA Safety Scores & SMS',
    body: 'The Compliance, Safety, Accountability (CSA) program uses the Safety Measurement System (SMS) to identify high-risk carriers. Scores are calculated across 7 BASIC categories: Unsafe Driving, Hours-of-Service Compliance, Driver Fitness, Controlled Substances/Alcohol, Vehicle Maintenance, Hazardous Materials, and Crash Indicator. High scores can trigger FMCSA interventions and affect shipper relationships.',
    link: null,
  },
  {
    icon: '📝',
    title: 'Operating Authority (MC Number)',
    body: 'For-hire carriers must have operating authority from FMCSA before hauling regulated freight. You apply for a Motor Carrier (MC) number through the Unified Registration System (URS). New entrants must also complete a safety audit within the first 12 months of operations. Operating without proper authority is a federal violation.',
    link: null,
  },
  {
    icon: '⚖️',
    title: 'Drug & Alcohol Testing',
    body: 'FMCSA-regulated carriers must participate in a DOT-compliant drug and alcohol testing program. This includes pre-employment, random, post-accident, reasonable suspicion, and return-to-duty testing. Owner-operators must join a consortium. The FMCSA Drug and Alcohol Clearinghouse is a database that tracks drug and alcohol violations.',
    link: null,
  },
  {
    icon: '🔍',
    title: 'DOT Roadside Inspections',
    body: 'Commercial vehicles are subject to inspection at weigh stations, ports of entry, and roadside checkpoints. Inspections range from Level I (full driver and vehicle inspection) to Level VI (enhanced NAS inspection for radioactive cargo). Out-of-service violations require the vehicle or driver to stop operating immediately until the violation is corrected.',
    link: null,
  },
];

const QUICK_REFS = [
  { label: 'FMCSA Safety Programs', href: 'https://www.fmcsa.dot.gov/safety/safety-programs', external: true },
  { label: 'HOS Rules Overview', href: 'https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations', external: true },
  { label: 'Drug & Alcohol Clearinghouse', href: 'https://clearinghouse.fmcsa.dot.gov/', external: true },
  { label: 'National Registry of Certified Medical Examiners', href: 'https://nationalregistry.fmcsa.dot.gov/', external: true },
  { label: 'ELD Registered Devices List', href: 'https://eld.fmcsa.dot.gov/List', external: true },
  { label: 'CSA/SMS Tool', href: 'https://ai.fmcsa.dot.gov/SMS/', external: true },
  { label: 'FMCSA Registration (USDOT/MC)', href: 'https://www.fmcsa.dot.gov/registration', external: true },
  { label: 'CVSA Inspections & Roadcheck', href: 'https://www.cvsa.org/', external: true },
  { label: 'PHMSA Hazmat Safety', href: 'https://www.phmsa.dot.gov/', external: true },
  { label: 'Unified Carrier Registration', href: 'https://www.ucr.gov/', external: true },
  { label: 'IFTA, Inc.', href: 'https://www.iftach.org/', external: true },
  { label: 'Federal Register – FMCSA', href: 'https://www.federalregister.gov/agencies/federal-motor-carrier-safety-administration', external: true },
];

const COMPLIANCE_ORGANIZATIONS = [
  {
    name: 'FMCSA',
    subtitle: 'Federal Motor Carrier Safety Administration',
    href: 'https://www.fmcsa.dot.gov/',
    badge: 'Federal regulator',
    description:
      'The main federal agency for trucking safety, registration, ELDs, hours of service, drug and alcohol compliance, and carrier enforcement.',
  },
  {
    name: 'CVSA',
    subtitle: 'Commercial Vehicle Safety Alliance',
    href: 'https://www.cvsa.org/',
    badge: 'Inspection standards',
    description:
      'Publishes North American inspection programs, Roadcheck guidance, brake safety weeks, and enforcement best practices used by roadside inspectors.',
  },
  {
    name: 'PHMSA',
    subtitle: 'Pipeline and Hazardous Materials Safety Administration',
    href: 'https://www.phmsa.dot.gov/',
    badge: 'Hazmat rules',
    description:
      'Covers hazardous materials transport requirements, packaging, placarding, shipping papers, and hazmat training expectations for truck carriers.',
  },
  {
    name: 'Clearinghouse',
    subtitle: 'FMCSA Drug & Alcohol Clearinghouse',
    href: 'https://clearinghouse.fmcsa.dot.gov/',
    badge: 'Driver eligibility',
    description:
      'Tracks DOT drug and alcohol violations, return-to-duty status, and required employer queries for regulated drivers.',
  },
  {
    name: 'National Registry',
    subtitle: 'Certified Medical Examiners',
    href: 'https://nationalregistry.fmcsa.dot.gov/',
    badge: 'Medical fitness',
    description:
      'Lists certified medical examiners who can perform DOT physicals and issue medical certificates for commercial drivers.',
  },
  {
    name: 'UCR',
    subtitle: 'Unified Carrier Registration',
    href: 'https://www.ucr.gov/',
    badge: 'Operating authority fee',
    description:
      'Handles annual UCR registration fees for interstate motor carriers, brokers, freight forwarders, and leasing companies.',
  },
  {
    name: 'IFTA, Inc.',
    subtitle: 'International Fuel Tax Association',
    href: 'https://www.iftach.org/',
    badge: 'Fuel tax compliance',
    description:
      'Coordinates IFTA education, training, and jurisdiction information for fuel tax reporting across state and provincial lines.',
  },
  {
    name: 'DOT',
    subtitle: 'U.S. Department of Transportation',
    href: 'https://www.transportation.gov/',
    badge: 'Policy umbrella',
    description:
      'The parent department behind FMCSA and PHMSA, useful when you want the broader federal rulemaking and policy context.',
  },
];

const FINES = [
  { violation: 'Operating without authority', fine: 'Up to $16,000/day' },
  { violation: 'HOS violation (driver)', fine: 'Up to $16,000' },
  { violation: 'ELD malfunction / non-compliance', fine: 'Up to $16,000' },
  { violation: 'False log entry', fine: 'Up to $16,000' },
  { violation: 'Drug & alcohol test refusal', fine: 'Disqualification + fines' },
  { violation: 'Operating OOS vehicle', fine: 'Up to $16,000' },
  { violation: 'Hazmat violation', fine: 'Up to $85,000' },
];

export default async function CompliancePage() {
  const all = await db.select().from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(40);

  const compliance = all.filter((a) => a.category === 'compliance');
  const others = all.filter((a) => a.category !== 'compliance').slice(0, 6);

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>

      {/* ── HERO ── */}
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
            <span>⚡</span> Truck King Hub
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            FMCSA &amp; COMPLIANCE WATCH
          </h1>
          <p className="text-base max-w-2xl" style={{ color: '#9ca3af' }}>
            Your daily reference for DOT regulations, hours of service rules, CSA scores, ELD compliance, drug testing requirements, and roadside inspection standards. Built for owner-operators and small fleet owners who need to stay legal and keep moving.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Disclaimer banner */}
        <div className="flex gap-3 px-4 py-3 mb-10" style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.3)' }} role="note">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: '#F5C518' }} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: '#d4a017' }}>
            Information on this page is for general awareness only and does not constitute legal or compliance advice. Regulations change — always verify with FMCSA.gov or a licensed compliance specialist before making business decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2 space-y-12">

            {/* Compliance Organizations */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>🏛️</span> Official Organizations
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Compliance Organizations to Bookmark
              </h2>
              <p className="text-sm max-w-3xl mb-6" style={{ color: '#9ca3af' }}>
                When you need the source of truth, start with the regulator or industry body that owns the rule, the inspection standard, or the filing process. These are the references trucking carriers use most often.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMPLIANCE_ORGANIZATIONS.map((org) => (
                  <a
                    key={org.name}
                    href={org.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 transition-colors hover:border-[#F5C518]/60"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#F5C518' }}>
                          {org.badge}
                        </p>
                        <h3 className="text-base font-black text-white uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                          {org.name}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                          {org.subtitle}
                        </p>
                      </div>
                      <span className="text-sm shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: '#F5C518' }}>
                        ↗
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                      {org.description}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            {/* Compliance Topics Grid */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>📘</span> Key Compliance Areas
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                What Every Carrier Must Know
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {COMPLIANCE_TOPICS.map((topic) => (
                  <div key={topic.title} className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <div className="text-2xl mb-3">{topic.icon}</div>
                    <h3 className="text-base font-black text-white uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>{topic.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{topic.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Civil Penalties Table */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>⚠️</span> Know the Stakes
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-5" style={{ fontFamily: 'Georgia, serif' }}>
                Common Violations &amp; Maximum Fines
              </h2>
              <div style={{ border: '1px solid #2a2a2a', overflow: 'hidden' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-white">Violation</th>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ color: '#F5C518' }}>Max Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINES.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1f1f1f', background: i % 2 === 0 ? '#0d0d0d' : '#111111' }}>
                        <td className="px-4 py-3" style={{ color: '#e5e7eb' }}>{row.violation}</td>
                        <td className="px-4 py-3 font-black" style={{ color: '#F5C518' }}>{row.fine}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-2" style={{ color: '#555' }}>Fines are subject to annual inflation adjustments by FMCSA. Civil penalties shown are maximum per violation.</p>
            </section>

            {/* New Entrant Checklist */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>🚛</span> Starting Out
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-5" style={{ fontFamily: 'Georgia, serif' }}>
                New Carrier Compliance Checklist
              </h2>
              <div className="space-y-3">
                {[
                  'Obtain USDOT Number through FMCSA URS',
                  'Apply for Operating Authority (MC Number) if for-hire',
                  'File BOC-3 process agent designation',
                  'Purchase required minimum liability insurance ($750K–$5M based on cargo)',
                  'Register vehicles in your base state (apportioned plates / IRP if multi-state)',
                  'Get IFTA fuel tax license if operating in 2+ states',
                  'Enroll in a DOT drug and alcohol testing consortium',
                  'Implement a driver qualification file for each driver',
                  'Install an FMCSA-registered ELD',
                  'Complete new entrant safety audit (within 12 months of operations)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center font-black text-xs" style={{ background: '#F5C518', color: '#0d0d0d' }}>{i + 1}</div>
                    <p className="text-sm" style={{ color: '#e5e7eb' }}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Compliance Articles */}
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
                <span>📰</span> Latest
              </p>
              <h2 className="text-2xl font-black uppercase text-white mb-5" style={{ fontFamily: 'Georgia, serif' }}>
                Compliance Articles
              </h2>
              {compliance.length === 0 ? (
                <div className="text-center py-12 border border-dashed" style={{ borderColor: '#2a2a2a' }}>
                  <p className="mb-4 text-sm" style={{ color: '#9ca3af' }}>No compliance articles published yet.</p>
                  <Link href="/brief" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>Browse all articles →</Link>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid #2a2a2a' }}>
                  {compliance.map((a) => (
                    <Link key={a.id} href={`/article/${a.slug}`}
                      className="article-row group flex flex-col sm:flex-row gap-5 py-7 -mx-4 px-4 transition-colors"
                      style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 mb-2">Compliance</span>
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
                <span>🔗</span> Official Resources
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
                      {ref.external && <span className="text-xs" style={{ color: '#555' }}>↗</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* FMCSA Alert Box */}
            <div className="p-5" style={{ background: '#1a0000', border: '1px solid #7f1d1d' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#f87171' }}>🚨 Key Dates & Deadlines</p>
              <ul className="space-y-3 text-sm" style={{ color: '#e5e7eb' }}>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>Annual vehicle inspections required by June 30 in most states</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>Random drug testing minimum rate: 50% annually for drivers</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>IFTA quarterly fuel tax returns: Jan 31, Apr 30, Jul 31, Oct 31</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>UCR fees due January 31 each year</li>
                <li className="flex gap-2"><span style={{ color: '#F5C518' }}>▸</span>Medical certificate renewal: every 24 months max</li>
              </ul>
            </div>

            {/* 7 BASICs Summary */}
            <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#F5C518' }}>📊 The 7 CSA BASICs</p>
              <ul className="space-y-2">
                {[
                  'Unsafe Driving',
                  'Hours-of-Service Compliance',
                  'Driver Fitness',
                  'Controlled Substances / Alcohol',
                  'Vehicle Maintenance',
                  'Hazardous Materials',
                  'Crash Indicator',
                ].map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: '#F5C518', color: '#0d0d0d' }}>{i + 1}</span>
                    {b}
                  </li>
                ))}
              </ul>
              <a href="https://ai.fmcsa.dot.gov/SMS/" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>
                Check Your SMS Score →
              </a>
            </div>

            {/* More Articles */}
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
