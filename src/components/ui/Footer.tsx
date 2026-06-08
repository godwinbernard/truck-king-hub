const FOOTER_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/brief', label: 'Daily Brief' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/insurance', label: 'Insurance' },
  { href: '/resources', label: 'Resources' },
  { href: '/search', label: 'Search' },
];

export function Footer() {
  return (
    <footer className="bg-navy-dark text-blue-200 mt-16 border-t border-white/10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <p className="font-extrabold text-white text-base mb-1">
              Truck King <span className="text-gold">Hub</span>
            </p>
            <p className="text-xs text-blue-300 leading-relaxed max-w-[240px]">
              Daily intelligence for independent operators, owner-operators, and small fleets.
            </p>
          </div>

          {/* Pages */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Pages</p>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-blue-200 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Legal</p>
            <p className="text-xs text-blue-300 leading-relaxed mb-3">
              Content summaries are for informational purposes only and do not constitute legal,
              insurance, financial, or compliance advice. Always consult a qualified professional.
            </p>
            <a
              href="/contact/takedown"
              className="text-xs text-blue-300 underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              Content takedown request →
            </a>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-blue-400">
            Updated every 2 hours · Sources always linked · No paid placements
          </p>
          <p className="text-xs text-blue-400">
            © {new Date().getFullYear()} Truck King Hub
          </p>
        </div>
      </div>
    </footer>
  );
}
