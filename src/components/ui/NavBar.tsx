'use client';

import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = [
  { href: '/brief',      label: 'News' },
  { href: '/brief?category=freight', label: 'Logistics' },
  { href: '/brief?category=compliance', label: 'Compliance' },
  { href: '/brief?category=equipment', label: 'Trucks' },
  { href: '/insurance',  label: 'Insurance' },
  { href: '/resources',  label: 'Resources' },
  { href: '/brief?category=general', label: 'Lifestyle' },
];

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-silver-light" role="banner">

      {/* Top bar — brand + search */}
      <div className="border-b border-silver-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 text-charcoal hover:text-crimson transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                }
              </svg>
            </button>

            {/* Wordmark */}
            <Link
              href="/"
              className="flex-1 lg:flex-none text-center lg:text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded"
            >
              <span
                className="font-display-hed text-3xl sm:text-4xl text-ink tracking-wide leading-none select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, letterSpacing: '-0.01em' }}
              >
                TRUCK KING <span className="text-crimson">HUB</span>
              </span>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-charcoal hover:text-crimson transition-colors"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                Search
              </Link>
              <div className="hidden sm:block w-px h-4 bg-silver-light" />
              <Link
                href="/brief"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-ink text-white text-xs font-semibold uppercase tracking-widest hover:bg-crimson transition-colors"
              >
                Subscribe
              </Link>
              {/* Mobile search */}
              <Link href="/search" className="sm:hidden p-2 text-charcoal hover:text-crimson transition-colors" aria-label="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="hidden lg:block bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-0" aria-label="Category navigation">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-silver hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <div className="ml-auto">
              <Link
                href="/contact/takedown"
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-silver hover:text-white transition-colors"
              >
                Advertise
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-silver-light shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-semibold uppercase tracking-widest text-charcoal hover:text-crimson hover:bg-silver-pale transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <div className="border-t border-silver-light mt-2 pt-2">
              <Link
                href="/contact/takedown"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-semibold uppercase tracking-widest text-charcoal hover:text-crimson transition-colors block"
              >
                Advertise
              </Link>
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}
