'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/brief',                       label: 'News' },
  { href: '/brief?category=freight',      label: 'Logistics' },
  { href: '/brief?category=compliance',   label: 'Compliance' },
  { href: '/brief?category=equipment',    label: 'Trucks' },
  { href: '/insurance',                   label: 'Insurance' },
  { href: '/resources',                   label: 'Resources' },
  { href: '/brief?category=general',      label: 'Lifestyle' },
];

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50" role="banner" style={{ background: '#0d0d0d' }}>

      {/* Main nav row */}
      <div style={{ borderBottom: '1px solid #2a2a2a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 text-white/60 hover:text-white transition-colors"
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

            {/* Logo */}
            <Link href="/" className="flex-1 lg:flex-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded">
              <span className="flex items-center gap-1 font-black uppercase tracking-tight leading-none select-none"
                style={{ fontFamily: 'Impact, sans-serif', fontSize: '1.5rem' }}>
                <span className="text-white">TRUCK KING</span>
                <span style={{ color: '#F5C518' }}>HUB</span>
                <span className="ml-1 text-xs font-black px-1 py-0.5 align-middle" style={{ background: '#F5C518', color: '#0d0d0d', fontFamily: 'system-ui', letterSpacing: 0 }}>⚡</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <span className="hidden xl:inline">Search</span>
              </Link>
              {/* Mobile search */}
              <Link href="/search" className="sm:hidden p-2 text-white/60 hover:text-white transition-colors" aria-label="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ background: '#111111', borderBottom: '1px solid #2a2a2a' }}>
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

    </header>
  );
}
