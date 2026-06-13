import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

type Listing = InferSelectModel<typeof directoryListings>;

const CATEGORY_LABELS: Record<string, string> = {
  load_board:       'Load Boards',
  truck_stop:       'Truck Stops',
  association:      'Associations',
  compliance_tool:  'Compliance Tools',
  eld:              'ELDs',
  fuel_card:        'Fuel Cards',
  factoring:        'Factoring',
  maintenance:      'Maintenance',
  insurance:        'Insurance',
  equipment:        'Equipment Marketplaces',
  training:         'Training & CDL',
};

const CATEGORY_DESC: Record<string, string> = {
  load_board:       'Find freight and compare boards',
  truck_stop:       'Parking, fuel, and facilities',
  association:      'Industry groups and advocacy',
  compliance_tool:  'Stay DOT & FMCSA compliant',
  eld:              'Electronic logging devices',
  fuel_card:        'Discounts and expense tracking',
  factoring:        'Cash flow and invoice financing',
  maintenance:      'Repairs and preventive service',
  insurance:        'Coverage and risk management',
  equipment:        'Buy, sell, and lease trucks',
  training:         'CDL schools and certifications',
};

const CATEGORY_ICONS: Record<string, string> = {
  load_board:       'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  truck_stop:       'M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z',
  compliance_tool:  'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  fuel_card:        'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z',
  insurance:        'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  equipment:        'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z',
  training:         'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5',
};

const FEATURED_RESOURCES = [
  {
    title: 'FMCSA SAFER',
    category: 'compliance_tool',
    description: 'Verify carrier authority, safety fitness, and operating status.',
    url: 'https://safer.fmcsa.dot.gov/',
    bestFor: 'Carrier lookup and compliance checks',
  },
  {
    title: 'FMCSA Home',
    category: 'compliance_tool',
    description: 'Official federal trucking safety and regulations portal.',
    url: 'https://www.fmcsa.dot.gov/',
    bestFor: 'Rules, guidance, and federal updates',
  },
  {
    title: 'OOIDA',
    category: 'association',
    description: 'Owner-operator advocacy, news, and member resources.',
    url: 'https://www.ooida.com/',
    bestFor: 'Independent drivers and small fleets',
  },
  {
    title: 'DAT Freight & Analytics',
    category: 'load_board',
    description: 'Freight marketplace, load boards, and rate tools.',
    url: 'https://www.dat.com/',
    bestFor: 'Load matching and market intelligence',
  },
  {
    title: 'Truckstop',
    category: 'load_board',
    description: 'Load board and freight-matching platform for carriers.',
    url: 'https://truckstop.com/',
    bestFor: 'Spot market freight and brokerage access',
  },
  {
    title: 'WEX Fleet Cards',
    category: 'fuel_card',
    description: 'Fleet payment tools for fuel, tracking, and controls.',
    url: 'https://www.wexinc.com/',
    bestFor: 'Fuel expense management',
  },
  {
    title: 'Comdata',
    category: 'fuel_card',
    description: 'Fuel cards, payment controls, and trucking finance tools.',
    url: 'https://www.comdata.com/',
    bestFor: 'Fleet fuel and payments',
  },
  {
    title: "Love's Truck Care",
    category: 'maintenance',
    description: 'Truck stop service, roadside support, and maintenance.',
    url: 'https://www.loves.com/',
    bestFor: 'Road service and preventive maintenance',
  },
  {
    title: 'Pilot Flying J',
    category: 'truck_stop',
    description: 'Fuel stops, parking, showers, and driver amenities.',
    url: 'https://pilotflyingj.com/',
    bestFor: 'Fuel, parking, and over-the-road convenience',
  },
  {
    title: 'TravelCenters of America',
    category: 'truck_stop',
    description: 'Full-service travel centers for professional drivers.',
    url: 'https://www.ta-petro.com/',
    bestFor: 'Road stops and truck maintenance access',
  },
  {
    title: 'Motive',
    category: 'eld',
    description: 'Fleet platform for ELDs, safety, and operations visibility.',
    url: 'https://gomotive.com/',
    bestFor: 'Hours of service and fleet telematics',
  },
  {
    title: 'J. J. Keller',
    category: 'compliance_tool',
    description: 'Compliance manuals, training, and DOT safety solutions.',
    url: 'https://www.jjkeller.com/',
    bestFor: 'Regulatory compliance and driver training',
  },
  {
    title: 'Bestpass',
    category: 'compliance_tool',
    description: 'Toll management and expense consolidation for fleets.',
    url: 'https://www.bestpass.com/',
    bestFor: 'Toll tracking and cost control',
  },
  {
    title: 'Trucker Path',
    category: 'load_board',
    description: 'Truck navigation, parking, fuel prices, and load tools.',
    url: 'https://truckerpath.com/',
    bestFor: 'Parking, routing, and trip planning',
  },
  {
    title: 'Uber Freight',
    category: 'load_board',
    description: 'Digital freight matching and shipper-carrier workflows.',
    url: 'https://www.uberfreight.com/',
    bestFor: 'Finding freight and managing loads',
  },
  {
    title: 'Progressive Commercial',
    category: 'insurance',
    description: 'Commercial truck insurance options and quote tools.',
    url: 'https://www.progressivecommercial.com/',
    bestFor: 'Commercial auto and trucking coverage',
  },
  {
    title: 'Sentry',
    category: 'insurance',
    description: 'Specialized trucking insurance for fleets and owner-operators.',
    url: 'https://www.sentry.com/',
    bestFor: 'Fleet and owner-operator insurance',
  },
  {
    title: 'Truckstop Factoring',
    category: 'factoring',
    description: 'Invoice factoring and cash flow tools for carriers.',
    url: 'https://truckstop.com/factoring/',
    bestFor: 'Fast access to freight cash flow',
  },
  {
    title: 'Amazon Relay',
    category: 'load_board',
    description: 'Carrier program and freight opportunities for trucking companies.',
    url: 'https://relay.amazon.com/',
    bestFor: 'Direct carrier freight access',
  },
];

export default async function ResourcesPage() {
  const listings: Listing[] = await db
    .select()
    .from(directoryListings)
    .orderBy(asc(directoryListings.category), asc(directoryListings.name))
    .catch(() => [] as Listing[]);

  const grouped = listings.reduce<Record<string, Listing[]>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryCount = Object.keys(grouped).length;

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Truck King Hub</p>
          <h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Owner-Operator Resource Directory
          </h1>
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
            Manually reviewed tools and services for trucking businesses. No sponsored listings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        <section>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Editorial Picks</p>
              <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>Essential Resources for Truckers</h2>
            </div>
            <p className="hidden md:block text-xs text-right max-w-md" style={{ color: '#9ca3af' }}>
              Official lookup tools, freight marketplaces, and trucking organizations that help owner-operators and fleets stay compliant and profitable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_RESOURCES.map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-5 transition-opacity hover:opacity-85"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white" style={{ background: '#52525b' }}>
                    {CATEGORY_LABELS[resource.category] ?? resource.category}
                  </span>
                  <svg className="w-4 h-4 shrink-0" style={{ color: '#F5C518' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug mb-2">{resource.title}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#9ca3af' }}>{resource.description}</p>
                <p className="text-[11px] font-semibold mt-auto" style={{ color: '#d1d5db' }}>
                  Best for: <span style={{ color: '#9ca3af' }}>{resource.bestFor}</span>
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="p-6" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Resource Guide</p>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            What Each Resource Category Helps With
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Object.entries(CATEGORY_DESC).map(([key, desc]) => (
              <div key={key} className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#F5C518' }}>
                  {CATEGORY_LABELS[key] ?? key}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Editorial only', desc: 'Every listing manually reviewed', icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
            { label: 'No paid placements', desc: 'Listings are never bought or sponsored', icon: 'M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636' },
            { label: 'Link checked', desc: 'Broken links flagged automatically', icon: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: 'rgba(245,197,24,0.15)' }}>
                <svg className="w-5 h-5" style={{ color: '#F5C518' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Directory content */}
        <section>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Directory</p>
              <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>Reviewed Listings</h2>
            </div>
            <p className="text-xs text-right" style={{ color: '#9ca3af' }}>
              {categoryCount} categories · {listings.length} listings
            </p>
          </div>

          {categoryCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed" style={{ borderColor: '#2a2a2a' }}>
              <p className="font-bold text-white text-sm">Directory listings coming soon</p>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>We&apos;re reviewing and adding resources now.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: 'rgba(245,197,24,0.15)' }}>
                    <svg className="w-4 h-4" style={{ color: '#F5C518' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={CATEGORY_ICONS[category] ?? CATEGORY_ICONS.compliance_tool} />
                    </svg>
                  </div>
                  <div>
                    <h2 id={`cat-${category}`} className="text-base font-black uppercase text-white" style={{ fontFamily: 'Georgia, serif' }}>
                      {CATEGORY_LABELS[category] ?? category}
                    </h2>
                    {CATEGORY_DESC[category] && (
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{CATEGORY_DESC[category]}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <ResourceCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function ResourceCard({ item }: { item: Listing }) {
  return (
    <div className="group flex flex-col p-4 transition-opacity hover:opacity-80" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-white text-sm leading-snug">{item.name}</h3>
        {item.brokenLink && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 font-bold shrink-0" style={{ background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)' }}>
            Link Issue
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-xs leading-relaxed mb-2" style={{ color: '#9ca3af' }}>{item.description}</p>
      )}
      {item.bestFor && (
        <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>
          <span className="font-bold" style={{ color: '#d1d5db' }}>Best for: </span>{item.bestFor}
        </p>
      )}
      {item.notes && (
        <p className="text-xs italic mb-2" style={{ color: '#6b7280' }}>{item.notes}</p>
      )}
      <div className="mt-auto pt-3" style={{ borderTop: '1px solid #2a2a2a' }}>
        <a
          href={item.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ color: '#F5C518' }}
        >
          Visit website
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    </div>
  );
}
