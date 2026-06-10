import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sitemap | Truck King Hub',
    description:
      'Full sitemap for Truck King Hub — browse all pages, content categories, and resources for owner-operators and small fleet owners.',
  };
}

interface SiteSection {
  heading: string;
  links: { label: string; href: string; desc?: string }[];
}

const sections: SiteSection[] = [
  {
    heading: 'Main Pages',
    links: [
      { label: 'Home', href: '/', desc: 'Latest trucking news and daily updates' },
      { label: 'News', href: '/news', desc: 'All recent articles and industry coverage' },
      { label: 'Compliance', href: '/compliance', desc: 'FMCSA rules, HOS, ELD, and regulatory updates' },
      { label: 'Insurance', href: '/insurance', desc: 'Commercial trucking insurance news and analysis' },
      { label: 'Resources', href: '/resources', desc: 'Free guides, checklists, and reference materials' },
      { label: 'Search', href: '/search', desc: 'Search all content on Truck King Hub' },
    ],
  },
  {
    heading: 'Content Categories',
    links: [
      { label: 'Freight & Logistics', href: '/freight', desc: 'Spot rates, load boards, and freight market trends' },
      { label: 'Trucks & Equipment', href: '/trucks', desc: 'New trucks, maintenance, and equipment news' },
      { label: 'Lifestyle & Business', href: '/lifestyle', desc: 'Owner-operator business tips and driver life' },
      { label: 'General News', href: '/general', desc: 'Broader trucking industry and economy coverage' },
    ],
  },
  {
    heading: 'Compliance Hub',
    links: [
      { label: 'FMCSA Updates', href: '/compliance/fmcsa', desc: 'Federal Motor Carrier Safety Administration news' },
      { label: 'HOS & ELD', href: '/compliance/hos-eld', desc: 'Hours of Service and Electronic Logging Device rules' },
      { label: 'Drug & Alcohol Testing', href: '/compliance/drug-testing', desc: 'DOT testing requirements and clearinghouse' },
      { label: 'CDL Requirements', href: '/compliance/cdl', desc: 'Commercial Driver\'s License rules and updates' },
      { label: 'Inspection Readiness', href: '/compliance/inspections', desc: 'Roadside inspection prep and CVSA guidance' },
    ],
  },
  {
    heading: 'Insurance',
    links: [
      { label: 'Primary Liability', href: '/insurance/primary-liability', desc: 'Minimum coverage requirements and options' },
      { label: 'Cargo Insurance', href: '/insurance/cargo', desc: 'Protecting your freight in transit' },
      { label: 'Occupational Accident', href: '/insurance/occupational-accident', desc: 'Owner-operator injury coverage options' },
      { label: 'Rate Trends', href: '/insurance/rates', desc: 'Commercial trucking insurance market analysis' },
    ],
  },
  {
    heading: 'Legal & Info',
    links: [
      { label: 'About Us', href: '/about', desc: 'Who we are and our editorial standards' },
      { label: 'Media Kit', href: '/media-kit', desc: 'Advertise with Truck King Hub — rates and audience data' },
      { label: 'Privacy Policy', href: '/privacy-policy', desc: 'How we handle your data' },
      { label: 'Terms of Use', href: '/terms', desc: 'Rules for using this site' },
      { label: 'Contact / Takedown', href: '/contact/takedown', desc: 'DMCA requests and general contact' },
      { label: 'Sitemap', href: '/sitemap-page', desc: 'You are here — all pages listed' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl mb-4 uppercase"
            style={{ fontFamily: 'Impact, sans-serif', color: '#F5C518' }}
          >
            Site Map
          </h1>
          <p className="text-lg" style={{ color: '#d1d5db' }}>
            Every page on Truck King Hub, organized by category.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.heading}>
              <div className="flex items-center gap-3 mb-6">
                <span
                  style={{
                    background: '#F5C518',
                    width: 4,
                    height: 28,
                    display: 'inline-block',
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <h2
                  className="text-2xl font-bold uppercase"
                  style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
                >
                  {section.heading}
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-5 py-4 transition-colors hover:border-yellow-400"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', textDecoration: 'none' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: '#F5C518' }}
                      >
                        ▸
                      </span>
                      <span className="font-semibold text-sm" style={{ color: '#ffffff' }}>
                        {link.label}
                      </span>
                    </div>
                    {link.desc && (
                      <p className="text-xs leading-relaxed pl-4" style={{ color: '#9ca3af' }}>
                        {link.desc}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Note */}
        <div
          className="mt-16 rounded-lg p-6 text-center"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
        >
          <p className="text-sm mb-4" style={{ color: '#d1d5db' }}>
            Can&apos;t find what you&apos;re looking for? Use our search to find any article or guide.
          </p>
          <Link
            href="/search"
            className="inline-block px-8 py-3 rounded font-black uppercase text-sm tracking-widest"
            style={{ background: '#F5C518', color: '#0d0d0d' }}
          >
            Search Truck King Hub
          </Link>
        </div>

      </div>
    </div>
  );
}
