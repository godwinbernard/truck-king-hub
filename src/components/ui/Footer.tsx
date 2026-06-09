import { NewsletterForm } from './NewsletterForm';

const CATEGORIES = [
  { href: '/brief',                       label: 'News & Updates' },
  { href: '/brief?category=compliance',   label: 'Compliance & FMCSA' },
  { href: '/brief?category=freight',      label: 'Freight & Logistics' },
  { href: '/brief?category=equipment',    label: 'Trucks & Equipment' },
  { href: '/insurance',                   label: 'Insurance & Risk' },
  { href: '/resources',                   label: 'Resource Directory' },
  { href: '/brief?category=general',      label: 'Driver Lifestyle' },
];

const COMPANY = [
  { href: '/search',          label: 'Search' },
  { href: '/contact/takedown', label: 'Advertise' },
  { href: '/contact/takedown', label: 'Content Takedown' },
];

const RSS_SOURCES = [
  { name: 'FMCSA Newsroom',            url: 'https://www.fmcsa.dot.gov/newsroom' },
  { name: 'Federal Register (FMCSA)',  url: 'https://www.federalregister.gov' },
  { name: 'Overdrive Magazine',        url: 'https://www.overdriveonline.com' },
  { name: 'Truckers News',             url: 'https://www.truckersnews.com' },
  { name: 'TheTrucker.com',            url: 'https://www.thetrucker.com' },
  { name: 'FleetOwner',                url: 'https://www.fleetowner.com' },
  { name: 'Transport Topics',          url: 'https://www.ttnews.com' },
  { name: 'Commercial Carrier Journal',url: 'https://www.ccjdigital.com' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-silver-light mt-0" role="contentinfo">

      {/* Newsletter band */}
      <div className="border-b border-white/10 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-editorial text-2xl text-white font-bold leading-snug">
                Stay Ahead of the Road.
              </p>
              <p className="text-sm text-silver mt-1">
                Daily intelligence for owner-operators, fleet managers, and trucking professionals.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <p
              className="text-2xl text-white font-bold mb-3 leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              TRUCK KING <span className="text-crimson">HUB</span>
            </p>
            <p className="text-sm text-silver leading-relaxed mb-5">
              The premium media platform for America&apos;s trucking community — news, analysis,
              compliance, and business intelligence for the road ahead.
            </p>
            <div className="flex items-center gap-3">
              {/* Social icons */}
              {[
                { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-crimson hover:text-crimson text-silver transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-silver mb-5 border-b border-white/10 pb-3">
              Coverage
            </p>
            <ul className="space-y-2.5">
              {CATEGORIES.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-silver hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-silver mb-5 border-b border-white/10 pb-3">
              Company
            </p>
            <ul className="space-y-2.5 mb-8">
              {COMPANY.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-silver hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs font-bold uppercase tracking-widest text-silver mb-3 mt-6 border-b border-white/10 pb-3">
              Legal
            </p>
            <p className="text-xs text-silver/70 leading-relaxed">
              Content is for informational purposes only. Not legal, insurance, or compliance advice.
              Consult a qualified professional for specific guidance.
            </p>
          </div>

          {/* RSS Sources */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-silver mb-5 border-b border-white/10 pb-3">
              News Sources
            </p>
            <ul className="space-y-2.5">
              {RSS_SOURCES.map((source) => (
                <li key={source.name} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-crimson shrink-0" />
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-silver hover:text-white transition-colors"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-silver/60 mt-4 leading-relaxed">
              All content is sourced, attributed, and linked. We do not republish full articles.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-silver/60">
            © {year} Truck King Hub. All rights reserved. Updated daily from approved industry sources.
          </p>
          <div className="flex items-center gap-5">
            <a href="/contact/takedown" className="text-xs text-silver/60 hover:text-white transition-colors">Privacy</a>
            <a href="/contact/takedown" className="text-xs text-silver/60 hover:text-white transition-colors">Terms</a>
            <a href="/contact/takedown" className="text-xs text-silver/60 hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
