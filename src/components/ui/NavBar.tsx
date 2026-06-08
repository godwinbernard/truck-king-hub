import Link from 'next/link';

const NAV_LINKS = [
  { href: '/brief', label: 'Daily Brief' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/insurance', label: 'Insurance' },
  { href: '/resources', label: 'Resources' },
];

export function NavBar() {
  return (
    <nav className="bg-navy text-white border-b border-white/10 sticky top-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
            <div className="w-7 h-7 rounded-md bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <span className="font-extrabold text-base tracking-tight">
              Truck King<span className="text-gold"> Hub</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-md border border-white/15 hover:border-white/25 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Search"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span>Search</span>
            </Link>
          </div>

          {/* Mobile search icon */}
          <Link
            href="/search"
            className="sm:hidden p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>

        </div>
      </div>
    </nav>
  );
}
