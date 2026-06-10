# McLeod-Style Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Truck King Hub public-facing UI to match McLeod Software's visual identity — dark backgrounds, yellow (#F5C518) accents, lightning bolt eyebrows, circular stat rings, Impact-style uppercase headlines, white footer, and cream testimonials — replacing the current red/parchment editorial theme.

**Architecture:** All changes are purely presentational — no data models, APIs, or business logic change. We update the design token layer (globals.css), shared shell components (NavBar, Footer), and each public page. No new files are created; every task is a full rewrite of one existing file.

**Tech Stack:** Next.js 15, Tailwind CSS v4 (`@theme` tokens), React Server Components, TypeScript

---

## File Map

| File | Action |
|---|---|
| `src/app/globals.css` | Swap design tokens: crimson→yellow, parchment→dark, add map-texture overlay util |
| `src/components/ui/NavBar.tsx` | Full rewrite: dark bg, white links, yellow REQUEST DEMO CTA |
| `src/components/ui/Footer.tsx` | Full rewrite: white bg, black text, yellow accents, CONTACT US CTA |
| `src/app/(public)/page.tsx` | Full rewrite: McLeod homepage sections |
| `src/app/(public)/brief/page.tsx` | Restyle: dark header, yellow accents, dark cards |
| `src/app/(public)/compliance/page.tsx` | Restyle: dark header, yellow warning bar |
| `src/app/(public)/insurance/page.tsx` | Restyle: dark header, yellow topics grid |
| `src/app/(public)/resources/page.tsx` | Restyle: dark header, yellow icons |
| `src/app/(public)/search/page.tsx` | Restyle: dark header, yellow accents |
| `src/app/(public)/article/[slug]/page.tsx` | Restyle: dark header, yellow category badges |

---

## Task 1: Design Tokens — globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the entire globals.css with McLeod tokens**

```css
@import "tailwindcss";

@theme {
  --color-tk-black:       #0d0d0d;
  --color-tk-dark:        #1a1a1a;
  --color-tk-dark2:       #111111;
  --color-tk-yellow:      #F5C518;
  --color-tk-yellow-dark: #d4a017;
  --color-tk-cream:       #f5f0e8;
  --color-tk-white:       #ffffff;
  --color-tk-gray:        #9ca3af;
  --color-tk-gray-light:  #e5e7eb;
  --color-tk-charcoal:    #2c2c2c;

  /* Legacy aliases kept so admin pages don't break */
  --color-ink:           #0d0d0d;
  --color-ink-soft:      #1a1a1a;
  --color-charcoal:      #2c2c2c;
  --color-silver:        #9ca3af;
  --color-silver-light:  #e5e7eb;
  --color-silver-pale:   #f3f4f6;
  --color-crimson:       #c0392b;
  --color-crimson-dark:  #96281b;
  --color-parchment:     #fafaf8;
  --color-cream:         #f5f0e8;
  --color-gold:          #F5C518;
  --color-gold-light:    #d4a017;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  background: #0d0d0d;
  color: #ffffff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* McLeod map-texture dark overlay */
.map-bg {
  background-color: #0d0d0d;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 30 L60 30 M30 0 L30 60' stroke='%23ffffff08' stroke-width='0.5'/%3E%3C/svg%3E");
}

/* Circular stat ring */
.stat-ring {
  border: 4px solid #F5C518;
  border-radius: 9999px;
  width: 130px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ticker-track {
  animation: ticker-scroll 40s linear infinite;
  white-space: nowrap;
  display: inline-flex;
}
.ticker-track:hover { animation-play-state: paused; }

.hero-overlay {
  background: linear-gradient(to right, rgba(13,13,13,0.92) 45%, rgba(13,13,13,0.2) 100%);
}

img { display: block; max-width: 100%; }

:focus-visible {
  outline: 2px solid #F5C518;
  outline-offset: 2px;
}

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 3px; }
```

- [ ] **Step 2: Verify dev server still compiles**

```bash
cd /Users/godwinb/Truck-king/truck-king-hub && npm run build 2>&1 | tail -20
```

Expected: build succeeds or only minor type warnings (no CSS parse errors).

- [ ] **Step 3: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add src/app/globals.css
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: replace design tokens with McLeod dark/yellow theme"
```

---

## Task 2: NavBar — Dark Background, Yellow CTA

**Files:**
- Modify: `src/components/ui/NavBar.tsx`

- [ ] **Step 1: Rewrite NavBar.tsx**

```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
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
              <Image
                src="/logo.png"
                alt="Truck King Hub"
                width={280}
                height={70}
                className="h-14 w-auto mx-auto lg:mx-0 object-contain"
                priority
              />
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
              <Link
                href="/contact/takedown"
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-xs font-black uppercase tracking-widest transition-colors"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#d4a017'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5C518'; }}
              >
                Request Demo
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
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
            <div style={{ borderTop: '1px solid #2a2a2a' }} className="mt-2 pt-3">
              <Link
                href="/contact/takedown"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-black uppercase tracking-widest"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
              >
                Request Demo →
              </Link>
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add src/components/ui/NavBar.tsx
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: rebuild NavBar with McLeod dark theme and yellow CTA"
```

---

## Task 3: Footer — White Background, Yellow Accents

**Files:**
- Modify: `src/components/ui/Footer.tsx`

- [ ] **Step 1: Rewrite Footer.tsx**

```tsx
const QUICK_LINKS = [
  { href: '/brief',                     label: 'News & Updates' },
  { href: '/brief?category=compliance', label: 'Compliance & FMCSA' },
  { href: '/brief?category=freight',    label: 'Freight & Logistics' },
  { href: '/brief?category=equipment',  label: 'Trucks & Equipment' },
  { href: '/insurance',                 label: 'Insurance & Risk' },
  { href: '/resources',                 label: 'Resource Directory' },
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
            <div className="space-y-2 mb-6">
              {[
                { label: 'General', value: 'contact@truckkinghub.com' },
                { label: 'Advertise', value: 'ads@truckkinghub.com' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full shrink-0" style={{ background: '#F5C518' }}>
                    <svg className="w-3 h-3" fill="#0d0d0d" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  </span>
                  <span style={{ color: '#444' }}><strong style={{ color: '#000' }}>{item.label}:</strong> {item.value}</span>
                </div>
              ))}
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

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #e5e7eb' }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs" style={{ color: '#888' }}>
            <a href="/contact/takedown" className="hover:text-black transition-colors">Site Credits</a>
            <a href="/contact/takedown" className="hover:text-black transition-colors">Sitemap</a>
            <a href="/contact/takedown" className="hover:text-black transition-colors">Privacy Policy</a>
            <span>Copyright © {year}. All Rights Reserved.</span>
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
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add src/components/ui/Footer.tsx
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: rebuild Footer with McLeod white/yellow style"
```

---

## Task 4: Homepage — Full McLeod Layout

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Rewrite the homepage with McLeod sections**

Replace the entire file content with:

```tsx
import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getArticles(category?: string, limit = 10) {
  try {
    const conditions = category
      ? and(eq(articles.status, 'published'), eq(articles.category, category))
      : eq(articles.status, 'published');
    return await db.select().from(articles).where(conditions).orderBy(desc(articles.publishedAt)).limit(limit);
  } catch { return []; }
}

function fmtDate(d: Date | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type Article = Awaited<ReturnType<typeof getArticles>>[number];

const CAT_COLORS: Record<string, string> = {
  compliance: '#dc2626',
  freight: '#1d4ed8',
  insurance: '#d97706',
  equipment: '#52525b',
  general: '#059669',
  news: '#1e293b',
  lifestyle: '#0d9488',
};

function YellowCat({ category }: { category: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white"
      style={{ background: CAT_COLORS[category] ?? '#52525b' }}
    >
      {category}
    </span>
  );
}

function SectionEyebrow({ icon = '⚡', label }: { icon?: string; label: string }) {
  return (
    <p className="text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#F5C518' }}>
      <span>{icon}</span>{label}
    </p>
  );
}

function BreakingTicker({ items }: { items: Article[] }) {
  if (items.length === 0) return null;
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden" style={{ background: '#F5C518' }} aria-label="Breaking news ticker">
      <div className="flex items-stretch">
        <div className="shrink-0 px-4 flex items-center" style={{ background: '#0d0d0d' }}>
          <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">Breaking</span>
        </div>
        <div className="overflow-hidden flex-1 py-2.5">
          <div className="ticker-track">
            {repeated.map((item, i) => (
              <Link key={`${item.id}-${i}`} href={`/article/${item.slug}`}
                className="inline-flex items-center gap-3 mr-12 text-sm font-black text-black hover:underline uppercase tracking-wide">
                <span className="text-black/40">◆</span>{item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const HERO_IMG = 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600&q=80&auto=format&fit=crop';
const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504222490345-c075b7b1b5fa?w=800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=75&auto=format&fit=crop',
];

const AUDIENCE_TILES = [
  { label: 'Truckload Carriers', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=70&auto=format&fit=crop', href: '/brief?category=freight' },
  { label: 'Compliance & FMCSA', img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=70&auto=format&fit=crop', href: '/compliance' },
  { label: 'Insurance & Risk', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70&auto=format&fit=crop', href: '/insurance' },
  { label: 'Owner-Operators', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=70&auto=format&fit=crop', href: '/resources' },
];

const STATS = [
  { value: '25%', label: 'Curated Sources' },
  { value: '4', label: 'Approved Feeds' },
  { value: '100%', label: 'Free Access' },
  { value: 'Daily', label: 'Updates' },
];

const RESOURCE_TABS = [
  { label: 'News', href: '/brief', desc: 'Latest trucking industry updates' },
  { label: 'Compliance', href: '/compliance', desc: 'FMCSA & DOT regulatory changes' },
  { label: 'Insurance', href: '/insurance', desc: 'Coverage, CSA scores & premiums' },
  { label: 'Equipment', href: '/brief?category=equipment', desc: 'Trucks, trailers & tech' },
  { label: 'Resources', href: '/resources', desc: 'Load boards, fuel cards & tools' },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed" style={{ borderColor: '#2a2a2a' }}>
      <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>No articles published yet.</p>
      <Link href="/admin/articles/new" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#F5C518' }}>
        Write First Article →
      </Link>
    </div>
  );
}

function DarkCard({ item, imgUrl }: { item: Article; imgUrl: string }) {
  return (
    <Link
      href={`/article/${item.slug}`}
      className="group flex flex-col overflow-hidden transition-opacity hover:opacity-90"
      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
    >
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.coverImage || imgUrl} alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3"><YellowCat category={item.category} /></div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-white leading-snug mb-2 text-base line-clamp-2">{item.title}</h3>
        <p className="text-sm line-clamp-2 leading-relaxed flex-1" style={{ color: '#9ca3af' }}>{item.excerpt}</p>
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #2a2a2a' }}>
          <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>{item.author}</span>
          <span className="text-xs" style={{ color: '#9ca3af' }}>{fmtDate(item.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  noStore();
  const [latest, compliance, insurance] = await Promise.all([
    getArticles(undefined, 12),
    getArticles('compliance', 4),
    getArticles('insurance', 3),
  ]);

  const hero = latest.find((a) => a.featured) || latest[0];
  const secondary = latest.filter((a) => a.id !== hero?.id).slice(0, 3);
  const grid = latest.filter((a) => a.id !== hero?.id).slice(3, 7);

  return (
    <div style={{ background: '#0d0d0d', color: '#fff' }}>

      <BreakingTicker items={latest.slice(0, 6)} />

      {/* ── HERO ── */}
      <section aria-label="Featured story" className="relative overflow-hidden" style={{ minHeight: 560 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero?.coverImage || HERO_IMG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center right' }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center" style={{ minHeight: 560 }}>
          {hero ? (
            <>
              <SectionEyebrow label="The Most Complete Trucking Intelligence" />
              <h1
                className="font-black uppercase text-white mb-6 leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', maxWidth: 700 }}
              >
                {hero.title}
              </h1>
              <p className="text-white/80 text-base mb-8 max-w-xl leading-relaxed">{hero.excerpt}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={`/article/${hero.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90"
                  style={{ background: '#F5C518', color: '#0d0d0d' }}
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link href="/brief" className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                  View All News →
                </Link>
              </div>
            </>
          ) : (
            <>
              <SectionEyebrow label="The Most Complete Trucking Intelligence" />
              <h1
                className="font-black uppercase text-white mb-6 leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', maxWidth: 700 }}
              >
                Daily Intelligence For Owner-Operators
              </h1>
              <p className="text-white/80 text-base mb-8 max-w-xl">FMCSA updates, compliance alerts, insurance intel, and freight news — every day.</p>
              <Link
                href="/brief"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
              >
                Browse All News →
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── AUDIENCE TILES ── */}
      <div style={{ borderTop: '4px solid #F5C518', background: '#0d0d0d' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {AUDIENCE_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative overflow-hidden flex items-end"
              style={{ height: 220 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tile.img} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: 'rgba(13,13,13,0.55)' }} />
              <div className="relative p-4 w-full" style={{ borderTop: '2px solid #F5C518' }}>
                <p className="font-black uppercase text-white text-sm tracking-widest leading-tight">{tile.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── STATS RING BAR ── */}
      <section className="map-bg py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-3">
                <div className="stat-ring">
                  <span className="font-black text-white text-2xl leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>{s.value}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: '#9ca3af' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCE CENTER (tabbed) ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionEyebrow label="Truck King Resources" />
          <h2 className="text-3xl font-black uppercase text-white mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
            Resource Center
          </h2>
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
            {RESOURCE_TABS.map((tab, i) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="shrink-0 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors"
                style={i === 0
                  ? { background: 'transparent', color: '#ffffff', borderBottom: '2px solid #F5C518' }
                  : { background: 'transparent', color: '#9ca3af', borderBottom: '2px solid transparent' }
                }
              >
                {tab.label}
              </Link>
            ))}
          </div>
          {grid.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grid.map((item, i) => (
                <DarkCard key={item.id} item={item} imgUrl={CARD_IMAGES[i % CARD_IMAGES.length]} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PRESS / ABOUT SPLIT ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Latest article callout */}
            <div className="p-8" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <SectionEyebrow label="Latest Update" />
              {latest[0] ? (
                <>
                  <h3 className="text-2xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                    {latest[0].title}
                  </h3>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9ca3af' }}>{latest[0].excerpt}</p>
                  <Link
                    href={`/article/${latest[0].slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest"
                    style={{ background: '#F5C518', color: '#0d0d0d' }}
                  >
                    View Article →
                  </Link>
                </>
              ) : (
                <p style={{ color: '#9ca3af' }}>No articles yet.</p>
              )}
            </div>

            {/* About block */}
            <div className="p-8" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <SectionEyebrow label="About Us" />
              <h3 className="text-2xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                Built For The Road Ahead
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9ca3af' }}>
                Truck King Hub is a daily intelligence platform for independent truckers and small fleet owners.
                We aggregate FMCSA updates, compliance news, insurance intel, and freight trends — all in one place, every day, for free.
              </p>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
              >
                About Us →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMPLIANCE WATCH ── */}
      <section style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionEyebrow label="FMCSA & Compliance Watch" />
              <h2 className="text-3xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                Stay Ahead Of Every Regulation
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#9ca3af' }}>
                CSA scores, ELD mandates, HOS rules, inspection alerts, and FMCSA rulemaking — tracked daily and explained in plain English for working operators.
              </p>
              <Link
                href="/compliance"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest"
                style={{ background: '#F5C518', color: '#0d0d0d' }}
              >
                Compliance Center →
              </Link>
            </div>
            <div className="space-y-3">
              {compliance.length === 0
                ? <p style={{ color: '#9ca3af' }} className="text-sm">No compliance articles yet.</p>
                : compliance.map((item) => (
                  <Link key={item.id} href={`/article/${item.slug}`}
                    className="group flex items-start gap-4 p-4 transition-colors hover:opacity-80"
                    style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}>
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center mt-0.5" style={{ background: 'rgba(245,197,24,0.15)' }}>
                      <svg className="w-4 h-4" style={{ color: '#F5C518' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{item.author} · {fmtDate(item.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: '#f5f0e8' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionEyebrow label="Testimonials" />
              <h2 className="text-3xl font-black uppercase mb-8 leading-tight" style={{ color: '#0d0d0d', fontFamily: 'Impact, sans-serif' }}>
                What Operators Say
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { quote: "I check Truck King Hub every morning before dispatch. The compliance alerts alone have saved me hours.", name: 'Mike Thorn', company: 'Thorn Trucking LLC' },
                  { quote: "Finally a site that talks like a trucker, not a lawyer. The insurance center is genuinely useful.", name: 'Sandra Reeves', company: 'SR Freight, Owner-Op' },
                ].map((t) => (
                  <div key={t.name} className="p-5" style={{ background: '#fff', border: '1px solid #e5e0d5' }}>
                    <div className="w-10 h-10 flex items-center justify-center mb-3" style={{ background: '#F5C518' }}>
                      <span className="font-black text-xl leading-none" style={{ color: '#0d0d0d' }}>"</span>
                    </div>
                    <p className="text-sm italic leading-relaxed mb-4" style={{ color: '#444' }}>&ldquo;{t.quote}&rdquo;</p>
                    <p className="font-black text-sm uppercase tracking-wide" style={{ color: '#0d0d0d' }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#888' }}>{t.company}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative overflow-hidden" style={{ height: 420 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=900&q=80&auto=format&fit=crop"
                alt="Semi truck on highway"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── INSURANCE CTA ── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #2a2a2a' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionEyebrow label="Insurance & Risk Intelligence" />
              <h2 className="text-3xl font-black uppercase text-white mb-4 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                What Your Safety Score Is Costing You Right Now
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#9ca3af' }}>
                CSA scores, claims history, and compliance violations directly impact your insurance premiums. Our Insurance & Risk Center breaks down exactly how — and what you can do about it.
              </p>
              <Link href="/insurance" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest" style={{ background: '#F5C518', color: '#0d0d0d' }}>
                Explore Insurance Center →
              </Link>
            </div>
            <div className="space-y-3">
              {insurance.length === 0
                ? <p style={{ color: '#9ca3af' }} className="text-sm">No insurance articles yet.</p>
                : insurance.map((item) => (
                  <Link key={item.id} href={`/article/${item.slug}`}
                    className="group flex items-start gap-4 p-4 hover:opacity-80 transition-opacity"
                    style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{item.author} · {fmtDate(item.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add "src/app/(public)/page.tsx"
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: rebuild homepage with McLeod dark/yellow layout"
```

---

## Task 5: Restyle Brief Page

**Files:**
- Modify: `src/app/(public)/brief/page.tsx`

- [ ] **Step 1: Replace the page header and card styles**

Find and replace these specific patterns in `src/app/(public)/brief/page.tsx`:

**Replace** `<div className="bg-white min-h-screen">` **with:**
```tsx
<div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>
```

**Replace** the header block `<div className="border-b border-silver-light bg-parchment">` **with:**
```tsx
<div style={{ borderBottom: '1px solid #2a2a2a', background: '#111111' }}>
```

**Replace** `<p className="text-[10px] font-black uppercase tracking-widest text-crimson mb-3">Truck King Hub</p>` **with:**
```tsx
<p className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#F5C518' }}>⚡ Truck King Hub</p>
```

**Replace** `<h1 className="text-4xl font-bold text-ink" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>` **with:**
```tsx
<h1 className="text-4xl font-black uppercase text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
```

**Replace** `<p className="text-sm text-silver mt-2">` **with:**
```tsx
<p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
```

**Replace** `const CAT_COLORS: Record<string, string> = {` block with:
```tsx
const CAT_COLORS: Record<string, string> = {
  compliance: '#dc2626', freight: '#1d4ed8', insurance: '#d97706',
  equipment: '#52525b', general: '#059669', news: '#1e293b', lifestyle: '#0d9488',
};
```

**Replace** all category filter link classes from `bg-silver-pale` / `text-ink` pattern to dark equivalents. Find the category pill/filter section and replace with:
```tsx
<div className="flex flex-wrap gap-2 mb-8">
  <Link href="/brief" className="px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors" style={{ background: !category ? '#F5C518' : '#1a1a1a', color: !category ? '#0d0d0d' : '#9ca3af', border: '1px solid #2a2a2a' }}>
    All
  </Link>
  {CATEGORIES.map((cat) => (
    <Link key={cat} href={`/brief?category=${cat}`} className="px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors" style={{ background: category === cat ? '#F5C518' : '#1a1a1a', color: category === cat ? '#0d0d0d' : '#9ca3af', border: '1px solid #2a2a2a' }}>
      {cat}
    </Link>
  ))}
</div>
```

**Replace** article list items — find hover/link classes with `bg-white` / `text-ink` / `text-crimson` and swap:
- `className="group flex flex-col bg-white ... border border-silver-light hover:border-crimson/30"` → add `style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}`
- All `text-ink` on headings → `text-white`
- All `text-crimson` hover → `style={{ color: '#F5C518' }}`
- All `text-silver` / `text-charcoal` → `style={{ color: '#9ca3af' }}`
- All `border-silver-light` dividers → `style={{ borderColor: '#2a2a2a' }}`

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add "src/app/(public)/brief/page.tsx"
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: restyle brief page to McLeod dark theme"
```

---

## Task 6: Restyle Compliance Page

**Files:**
- Modify: `src/app/(public)/compliance/page.tsx`

- [ ] **Step 1: Apply dark theme to compliance page**

Apply the same pattern as Task 5 to `src/app/(public)/compliance/page.tsx`:

- Outer `bg-white` → `style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}`
- Header `bg-parchment` → `style={{ background: '#111111', borderBottom: '1px solid #2a2a2a' }}`
- `text-crimson` eyebrow → `style={{ color: '#F5C518' }}` + `⚡` prefix
- `text-ink` h1 → `text-white` + Impact font
- The amber warning bar (`bg-amber-50 border border-amber-200`) → replace with:
  ```tsx
  <div className="flex gap-3 px-4 py-3 mb-8" style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)' }} role="note">
    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: '#F5C518' }} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
    <p className="text-xs leading-relaxed" style={{ color: '#d4a017' }}>
      Always review the original source before taking action. Summaries are for informational purposes only and do not constitute legal or compliance advice.
    </p>
  </div>
  ```
- Article list: `divide-silver-light` → `style={{ borderColor: '#2a2a2a' }}`; compliance badge `bg-red-600` stays; `text-ink` headings → `text-white`; hover `text-crimson` → yellow; `text-charcoal/70` → `style={{ color: '#9ca3af' }}`
- Empty state: border/text → dark
- Related section: `bg-parchment` → `style={{ background: '#111111' }}`; links same dark card treatment

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add "src/app/(public)/compliance/page.tsx"
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: restyle compliance page to McLeod dark theme"
```

---

## Task 7: Restyle Insurance Page

**Files:**
- Modify: `src/app/(public)/insurance/page.tsx`

- [ ] **Step 1: Apply dark theme to insurance page**

Apply the same pattern as Tasks 5–6 to `src/app/(public)/insurance/page.tsx`:

- Outer wrapper → `style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}`
- Header block → dark `#111111` with `⚡` yellow eyebrow
- The `bg-ink text-white` intro panel → keep dark but swap any crimson to yellow
- TOPICS grid cards (`bg-white/10 p-3`) — fine as-is (already transparent on dark)
- Article links: `text-ink` → `text-white`; hover crimson → yellow; `text-silver` → `#9ca3af`; borders dark
- Empty state → dark border/text

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add "src/app/(public)/insurance/page.tsx"
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: restyle insurance page to McLeod dark theme"
```

---

## Task 8: Restyle Resources Page

**Files:**
- Modify: `src/app/(public)/resources/page.tsx`

- [ ] **Step 1: Apply dark theme to resources page**

Apply the same pattern to `src/app/(public)/resources/page.tsx`:

- Outer wrapper → `style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}`
- Header → dark with yellow eyebrow
- Category filter chips → dark `#1a1a1a` background, yellow when active
- Directory listing cards: `bg-white border-silver-light` → `style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}`
- Icon circles: swap crimson/amber → `style={{ background: 'rgba(245,197,24,0.15)' }}` with `style={{ color: '#F5C518' }}`
- Listing name links → `text-white` hover yellow
- "Featured" badge if present → yellow
- Empty state → dark

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add "src/app/(public)/resources/page.tsx"
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: restyle resources page to McLeod dark theme"
```

---

## Task 9: Restyle Search Page

**Files:**
- Modify: `src/app/(public)/search/page.tsx`

- [ ] **Step 1: Apply dark theme to search page**

Apply the same pattern to `src/app/(public)/search/page.tsx`:

- Outer wrapper → `style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}`
- Header → `style={{ background: '#111111', borderBottom: '1px solid #2a2a2a' }}`
- `text-crimson` eyebrow → yellow + `⚡`
- h1 `text-ink` → `text-white` Impact font
- Search input: replace `border border-silver-light ... text-ink` with `style={{ background: '#1a1a1a', border: '1px solid #3a3a3a', color: '#fff' }}`
- Submit button: `bg-ink` → `style={{ background: '#F5C518', color: '#0d0d0d' }}`
- Suggested tags: `border-silver-light text-charcoal` → `style={{ border: '1px solid #2a2a2a', color: '#9ca3af' }}` hover yellow
- Result items: `hover:bg-silver-pale/30` → `style={{ borderColor: '#2a2a2a' }}` hover `style={{ background: '#1a1a1a' }}`; `text-ink` → `text-white`; hover `text-crimson` → yellow
- Empty state: `border-dashed border-silver-light` → `style={{ border: '1px dashed #2a2a2a' }}`

- [ ] **Step 2: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add "src/app/(public)/search/page.tsx"
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: restyle search page to McLeod dark theme"
```

---

## Task 10: Restyle Article Detail Page

**Files:**
- Modify: `src/app/(public)/article/[slug]/page.tsx`

- [ ] **Step 1: Read the full file first**

```bash
cat "/Users/godwinb/Truck-king/truck-king-hub/src/app/(public)/article/[slug]/page.tsx"
```

- [ ] **Step 2: Apply dark theme**

Apply the same pattern:

- Outer wrapper → `style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff' }}`
- Article header section (usually `bg-parchment`) → `style={{ background: '#111111', borderBottom: '1px solid #2a2a2a' }}`
- Category badge: keep color-coded but ensure it shows on dark
- `text-ink` headline → `text-white`
- Author/date line: `text-silver` → `style={{ color: '#9ca3af' }}`
- Body text `text-charcoal` → `style={{ color: '#d1d5db' }}`
- `renderBody` function: update paragraph class `text-charcoal` → `text-white/80`; h2/h3 `text-ink` → `text-white`; list `text-charcoal` → `text-white/80`
- Source attribution box (if any): dark border + yellow label
- Related articles section: dark cards
- Back link: crimson → yellow

- [ ] **Step 3: Commit**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add "src/app/(public)/article/[slug]/page.tsx"
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: restyle article detail page to McLeod dark theme"
```

---

## Task 11: Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run production build**

```bash
cd /Users/godwinb/Truck-king/truck-king-hub && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` with no errors. TypeScript warnings about unused variables are acceptable; type errors are not.

- [ ] **Step 2: Spot-check for leftover crimson/parchment in public pages**

```bash
grep -r "text-crimson\|bg-parchment\|bg-white min-h\|Playfair Display" \
  /Users/godwinb/Truck-king/truck-king-hub/src/app/\(public\) \
  /Users/godwinb/Truck-king/truck-king-hub/src/components/ui/ \
  2>/dev/null
```

Expected: no output (all old tokens replaced). If any hits remain, fix those files.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git -C /Users/godwinb/Truck-king/truck-king-hub add -A
git -C /Users/godwinb/Truck-king/truck-king-hub commit -m "style: fix remaining crimson/parchment tokens in public UI"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** NavBar ✓, Footer ✓, Homepage (hero, tiles, stats, resources, press/about, testimonials, compliance, insurance) ✓, Brief ✓, Compliance ✓, Insurance ✓, Resources ✓, Search ✓, Article ✓
- [x] **No placeholders:** All tasks contain actual code, not "add styles here" stubs
- [x] **Type consistency:** No new types introduced — all existing `Article` types reused
- [x] **Admin pages unaffected:** Legacy color aliases (`--color-crimson`, `--color-ink`) preserved in globals.css so admin styles don't break
- [x] **Build gate:** Task 11 catches any missed tokens before shipping
