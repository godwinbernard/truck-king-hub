const QUICK_LINKS = [
  { href: '/brief',                     label: 'News & Updates' },
  { href: '/brief?category=compliance', label: 'Compliance & FMCSA' },
  { href: '/brief?category=freight',    label: 'Freight & Logistics' },
  { href: '/brief?category=equipment',  label: 'Trucks & Equipment' },
  { href: '/insurance',                 label: 'Insurance & Risk' },
  { href: '/resources',                 label: 'Resource Directory' },
  { href: '/about',                     label: 'About Us' },
  { href: '/media-kit',                 label: 'Media Kit' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy',  label: 'Privacy Policy' },
  { href: '/terms',           label: 'Terms of Use' },
  { href: '/sitemap-page',    label: 'Sitemap' },
  { href: '/contact/takedown',label: 'DMCA / Takedown' },
];

const SOCIAL = [
  {
    label: 'LinkedIn',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
  {
    label: 'Facebook',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'Twitter/X',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" style={{ background: '#ffffff', color: '#0d0d0d' }}>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Brand column */}
          <div>
            <p className="text-2xl font-black uppercase tracking-tight text-black mb-3">
              TRUCK KING <span style={{ color: '#F5C518' }}>HUB</span>
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#444' }}>
              Daily operating intelligence for America&apos;s owner-operators and small fleet owners.
            </p>
            <div className="flex items-center gap-3 mb-6">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
                  style={{ background: '#F5C518' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0d0d0d"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
              <span>⚡</span> Quick Links
            </p>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href} className="flex items-center gap-2">
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ color: '#F5C518' }} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <a href={link.href} className="text-sm hover:underline" style={{ color: '#333' }}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
              <span>⚡</span> Contact Us
            </p>
            <address className="not-italic space-y-1 text-sm mb-5" style={{ color: '#333' }}>
              <p className="font-bold text-black">Truck King Hub</p>
              <p>United States</p>
            </address>
            <div className="flex items-center gap-2 text-sm mb-6">
              <span className="w-5 h-5 flex items-center justify-center rounded-full shrink-0" style={{ background: '#F5C518' }}>
                <svg className="w-3 h-3" fill="#0d0d0d" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
              </span>
              <a href="mailto:info@truckkinghub.com" className="hover:underline" style={{ color: '#333' }}>info@truckkinghub.com</a>
            </div>
            <a
              href="/contact/takedown"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-90"
              style={{ background: '#F5C518', color: '#0d0d0d' }}
            >
              Contact Us
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

        </div>

        {/* Legal links row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#F5C518' }}>Legal</p>
          {LEGAL_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-xs hover:underline transition-colors" style={{ color: '#666' }}>{l.label}</a>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #e5e7eb' }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: '#888' }}>
            <span>© {year} Truck King Hub. All Rights Reserved.</span>
            <span>www.truckkinghub.com</span>
          </div>
          <a href="#" className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: '#0d0d0d' }}>
            Back to the Top
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </a>
        </div>
      </div>

    </footer>
  );
}
