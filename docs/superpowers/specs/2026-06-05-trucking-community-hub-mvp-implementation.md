# Truck King Hub — MVP Implementation Design

**Date:** 2026-06-05
**Status:** Approved

---

## Overview

Build **Truck King Hub** — a public-only, all-in-one trucking operating intelligence hub for U.S. truck drivers, owner-operators, and small fleet owners. The site aggregates public updates from official and RSS-safe sources, summarizes them in plain English using Claude Haiku, and presents them in a structured Navy & Gold dashboard.

No user accounts in MVP. No affiliate links. No paid external services beyond Claude Haiku API.

---

## Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Brand direction | All-in-one operating hub | Broadest audience, all three personas |
| User accounts | None — public-only MVP | Fastest to build, no auth complexity |
| AI summarization | Claude Haiku | Strong structured output, low cost |
| Resource directory | Editorial only, no affiliates | Trust-first approach |
| Architecture | Next.js monolith | Right size for MVP, fastest to ship |
| Visual style (public) | Navy & Gold (Layout C) | Strong brand identity, featured top story |
| Visual style (admin) | Clean Professional (Layout B) | Readable, credible, standard admin feel |

---

## Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon free tier or self-hosted) |
| ORM | Drizzle ORM |
| Search | PostgreSQL full-text search (`tsvector`) |
| Scheduling | node-cron (runs inside Next.js process) |
| AI summarization | Anthropic Claude Haiku API |
| Hosting | Vercel (free tier) or Railway |

No Redis, no BullMQ, no Meilisearch, no separate worker process.

### Repo Structure

```
src/
  app/                        # Next.js App Router
    (public)/                 # Public-facing pages
      page.tsx                # Homepage dashboard
      brief/page.tsx          # Full daily brief feed
      compliance/page.tsx     # FMCSA/Compliance Watch
      insurance/page.tsx      # Insurance & Risk Center
      resources/page.tsx      # Resource directory
      search/page.tsx         # Full-text search
      item/[slug]/page.tsx    # Single content item
      contact/takedown/       # Source takedown form
    (admin)/                  # Admin route group
      admin/login/page.tsx
      admin/page.tsx          # Admin dashboard
      admin/queue/page.tsx    # Review queue
      admin/sources/page.tsx  # Source management
      admin/directory/page.tsx
      admin/takedowns/page.tsx
  components/
    ui/                       # Shared primitive components
    dashboard/                # Homepage module components
    content/                  # Content item cards, lists
    admin/                    # Admin-specific components
  lib/
    db/
      schema.ts               # Drizzle schema definitions
      client.ts               # PostgreSQL client
    ingestion/
      fetcher.ts              # RSS + Federal Register API fetchers
      normalizer.ts           # Maps raw entries to ContentItem shape
      deduplicator.ts         # URL match + fuzzy title/date grouping
      categorizer.ts          # Category + audience assignment
    risk/
      classifier.ts           # Rule-based risk level assignment
    summarizer/
      claude.ts               # Claude Haiku API integration
    search/
      index.ts                # PostgreSQL tsvector search queries
    admin/
      auth.ts                 # Session cookie auth
  workers/
    scheduler.ts              # node-cron job definitions
    jobs/
      ingest.ts               # Main ingestion job
      reindex.ts              # Search vector refresh
      linkcheck.ts            # Broken link checker
```

### Runtime

Single process: `next start` runs the web server and registers node-cron jobs on startup. No separate worker process needed for MVP.

---

## Data Model

### `sources`

```sql
id               uuid primary key
name             text not null
website_url      text not null
source_type      text not null   -- 'rss' | 'api' | 'manual'
update_method    text not null   -- 'rss' | 'federal_register_api' | 'manual'
permission_level text not null   -- 'open' | 'restricted'
default_category text not null
active           boolean default true
fetch_frequency_minutes integer default 120
last_fetched_at  timestamptz
notes            text
created_at       timestamptz default now()
```

### `content_items`

```sql
id               uuid primary key
source_id        uuid references sources(id)
title            text not null
slug             text unique not null
original_url     text unique not null
published_at     timestamptz
fetched_at       timestamptz default now()
author           text
raw_excerpt      text
ai_summary       text
why_it_matters   text
category         text not null   -- see Category enum
tags             text[]
audience         text[]          -- 'driver' | 'owner_operator' | 'small_fleet'
risk_level       text not null   -- 'low' | 'medium' | 'high'
review_status    text not null   -- 'pending_review' | 'auto_published' | 'approved' | 'rejected'
duplicate_group_id uuid
search_vector    tsvector
created_at       timestamptz default now()
```

### `directory_listings`

```sql
id               uuid primary key
name             text not null
category         text not null
website_url      text not null
description      text
best_for         text
notes            text
last_reviewed_at timestamptz
broken_link      boolean default false
created_at       timestamptz default now()
```

### `topics`

```sql
id                  uuid primary key
title               text not null
category            text not null
summary             text
trend_score         integer default 0
related_content_ids uuid[]
first_seen_at       timestamptz default now()
last_seen_at        timestamptz default now()
```

### `admin_users`

```sql
id            uuid primary key
email         text unique not null
password_hash text not null
created_at    timestamptz default now()
```

### `takedown_requests`

```sql
id              uuid primary key
source_name     text not null
url             text not null
reason          text
requester_email text
resolved        boolean default false
created_at      timestamptz default now()
```

### Enums (enforced in application layer)

- **category:** `compliance` | `insurance` | `freight` | `community` | `equipment` | `fuel` | `safety` | `general`
- **risk_level:** `low` | `medium` | `high`
- **review_status:** `pending_review` | `auto_published` | `approved` | `rejected`
- **audience:** `driver` | `owner_operator` | `small_fleet`

### Full-text search

`search_vector` on `content_items` is a `tsvector` covering `title || ai_summary || array_to_string(tags, ' ')`. Updated via a PostgreSQL trigger on insert/update. Search queries use `to_tsquery` with `plainto_tsquery` for user input.

---

## Ingestion Pipeline

### Scheduled jobs (node-cron)

| Job | Schedule | Description |
|---|---|---|
| `ingestSources` | Every 2 hours | Runs all active sources through the full pipeline |
| `reindexSearch` | Every 6 hours | Refreshes `search_vector` on rows where it is stale |
| `checkBrokenLinks` | Weekly (Sunday 2am) | Pings all directory listing URLs, sets `broken_link = true` on 404s |

### Pipeline steps

1. **Fetch** — RSS parser (`rss-parser` package) for RSS sources; native `fetch()` for Federal Register API (filter by `agency = FMCSA`); no-op for manual sources.
2. **Normalize** — map raw feed entry fields to `content_items` shape: title, original_url, published_at, raw_excerpt, source_id.
3. **Deduplicate** — skip insert if `original_url` already exists; fuzzy match on title + published_at within 24h window to assign `duplicate_group_id`.
4. **Categorize** — assign `category` from source `default_category`; override with keyword rules (e.g. "FMCSA", "ELD", "Clearinghouse" → `compliance`); assign `audience[]` from category mapping.
5. **Classify risk** — rule-based:
   - `high`: source type `regulatory`, or keywords: FMCSA rule, enforcement, penalty, Federal Register, Clearinghouse, violation, fine
   - `medium`: insurance, CSA score, safety rating, market analysis
   - `low`: everything else
6. **Summarize** — call Claude Haiku with a structured prompt. Returns `ai_summary` (2–3 sentences, plain English) and `why_it_matters` (1 sentence). Skip if `raw_excerpt` is empty.
7. **Publish** — `low` and `medium` items → `review_status = auto_published`; `high` items → `review_status = pending_review`.
8. **Index** — insert triggers update `search_vector` automatically.

### MVP approved source list

| Source | Type | Method |
|---|---|---|
| FMCSA Newsroom | Regulatory | RSS |
| Federal Register (FMCSA filter) | Regulatory | API |
| Overdrive | News | RSS |
| Truckers News | News | RSS |
| TheTrucker.com | News | RSS |
| Resource directory entries | Directory | Manual |

---

## Public Pages

### Visual Design

**Theme:** Navy (`#1e3a5f`) and Gold (`#fbbf24`) brand colors. White content area. Strong typography. Featured top story in navy hero band. Module cards with navy top border. Risk badges in red/amber. Source attribution on every item.

### Homepage (`/`)

Modules in order:
1. **Today's Trucking Brief** — top 5 items of the day, color-coded by category, risk badges on high items
2. **FMCSA & Compliance Alerts** — compliance category items only, last 7 days
3. **Freight Market Pulse** — freight/general category items
4. **Insurance & Risk Spotlight** — insurance category items
5. **Trending Owner-Operator Topics** — topics table entries by trend_score
6. **Quick Links** — static links to FMCSA, SAFER, DAT, Truckstop, OOIDA, Federal Register, Pilot Flying J, Love's

### Daily Brief (`/brief`)

Full feed of all `auto_published` and `approved` items. Filterable by category. Each item shows title, source, date, category badge, risk badge (if high), ai_summary, why_it_matters, and link to original source.

### Compliance Watch (`/compliance`)

Filtered to `category = compliance`. Each item distinguishes: official source text (raw_excerpt), plain-English summary (ai_summary), practical impact (why_it_matters), and original source link.

### Insurance & Risk Center (`/insurance`)

Filtered to `category = insurance`. Includes both ingested items and manually curated educational content managed via admin.

### Resource Directory (`/resources`)

All `directory_listings` grouped by category. Each card shows: name, description, best_for, website link, notes, last_reviewed_at. Broken links flagged with a warning badge. No affiliate links.

### Search (`/search`)

Full-text search using PostgreSQL `tsvector`. Query input → `plainto_tsquery` → ranked results from `content_items`. Shows title, source, date, category, short excerpt with highlighted match terms.

### Content Item (`/item/[slug]`)

Full item page: title, source name + link, published date, category, risk badge, ai_summary, why_it_matters, link to original source. Sitewide disclaimer below content.

### Takedown Form (`/contact/takedown`)

Public form: source name, URL, reason, requester contact. Submits to `admin_takedowns` table. Shown in admin panel.

---

## Page Copy

All written content for each public page. Implement exactly as written below.

### Site-wide

**Brand name:** Truck King Hub

**Tagline:** Your daily intelligence hub for owner-operators and small fleets.

**NavBar links:** Brief · Compliance · Insurance · Resources · Search

**Footer disclaimer:**
> Summaries are for informational purposes only and do not constitute legal, insurance, financial, or compliance advice. Always consult a qualified professional before making business, regulatory, or insurance decisions.

**Footer secondary link:** Content takedown request

---

### Homepage (`/`)

**Hero band (navy, above the fold):**
- Section label (gold, uppercase): `TODAY'S TRUCKING BRIEF`
- Heading: `What Changed Today for Operators & Drivers`
- Subheading: `Plain-English summaries of the most important trucking news, compliance updates, and market moves — sourced from FMCSA, Federal Register, and leading industry publications.`

**FMCSA & Compliance Alerts module:**
- Section label: `FMCSA & Compliance Alerts`
- Empty state: `No compliance updates in the last 7 days. Check back soon.`

**Insurance & Risk Spotlight module:**
- Section label: `Insurance & Risk Spotlight`
- Empty state: `No insurance updates this week.`

**Freight Market Pulse module:**
- Section label: `Freight Market Pulse`
- Empty state: `No freight market updates this week.`

**Quick Links module:**
- Section label: `Quick Links`
- Links: FMCSA · SAFER · Federal Register · DAT Load Board · Truckstop · OOIDA · Pilot Flying J · Love's Travel Stops

---

### Daily Brief (`/brief`)

**Page heading:** `Daily Trucking Brief`
**Subheading:** `All updates, newest first. Filter by topic to find what matters to your operation.`
**Filter bar label:** (no label — just the buttons: All · Compliance · Insurance · Freight · Safety · Fuel · Equipment · General)
**Empty state:** `No items yet — our ingestion pipeline runs every 2 hours. Check back shortly.`

---

### Compliance Watch (`/compliance`)

**Page heading:** `FMCSA & Compliance Watch`
**Subheading:** `Regulatory updates in plain English. We show what changed, what it means, and what to do next. Always review the original source before acting.`

**Item structure labels:**
- `Plain English Summary`
- `Why It Matters`
- `View original source →`

**Empty state:** `No compliance updates yet. FMCSA and Federal Register sources are checked every 2 hours.`

**Page-level disclaimer (below content):**
> Compliance summaries are informational only. Always verify current requirements directly with FMCSA or a qualified compliance professional.

---

### Insurance & Risk Center (`/insurance`)

**Page heading:** `Insurance & Risk Center`
**Subheading:** `How insurance, safety scores, and compliance decisions affect your operating costs — explained for owner-operators and small fleet owners.`

**Intro paragraph:**
> Trucking insurance is one of the biggest controllable costs in your operation. Your CSA scores, accident history, authority age, and cargo type all affect what you pay at renewal. This center tracks the latest insurance-relevant news and explains what it means for your premium.

**Empty state:** `No insurance updates yet. Check back shortly.`

**Page-level disclaimer:**
> Insurance information on this page is for educational purposes only and does not constitute insurance advice. Contact a licensed trucking insurance broker for coverage decisions.

---

### Resource Directory (`/resources`)

**Page heading:** `Owner-Operator Resource Directory`
**Subheading:** `Curated tools and services for trucking businesses. Editorial only — no sponsored listings, no affiliate links.`

**Intro paragraph:**
> Finding the right load board, fuel card, ELD, or factoring company takes time. We've done the research so you don't have to. Every listing is manually reviewed and updated by our team.

**Category headings:**
- Load Boards
- Truck Stops
- Associations
- Compliance Tools
- ELDs
- Fuel Cards
- Factoring
- Maintenance
- Insurance
- Equipment Marketplaces
- Training & CDL

**Card fields shown:** Name · Description · Best for · Website link · Notes · Last reviewed
**Broken link badge text:** `Link Issue`
**Empty state:** `Directory listings coming soon. We're reviewing and adding resources now.`

---

### Search (`/search`)

**Page heading:** `Search Truck King Hub`
**Input placeholder:** `Search compliance updates, insurance news, freight market, resources...`
**Button label:** `Search`
**Results count format:** `{n} result(s) for "{query}"`
**No results:** `No results found for "{query}". Try a different keyword — for example: "ELD", "CSA score", "spot rates", or "FMCSA".`
**Empty state (no query):** `Enter a keyword above to search all trucking news, compliance updates, and resources.`

---

### Content Item (`/item/[slug]`)

**Breadcrumb:** `← Back to Brief`
**Labels:**
- `Summary` (above ai_summary block)
- `Why It Matters` (above whyItMatters block)
- `Read original source →` (CTA button)

**Disclaimer (below content):**
> This summary is for informational purposes only and does not constitute legal, insurance, financial, or compliance advice. Always review the original source and consult qualified professionals before making decisions.

---

### Takedown Form (`/contact/takedown`)

**Page heading:** `Content Takedown Request`
**Intro paragraph:**
> If you believe Truck King Hub has published content that violates your rights, infringes on your copyright, or violates our content policy, please use this form. We review all requests within 5 business days.

**Form field labels:**
- `Source name *`
- `URL of the content *`
- `Reason for takedown`
- `Your email address`

**Submit button:** `Submit Request`
**Success message heading:** `Request Submitted`
**Success message body:** `Thank you. We will review your request and respond within 5 business days.`

---

## Admin Panel

### Visual Design

**Theme:** Clean Professional (Layout B) — white background, strong typography, subtle borders, color-coded category strips. Same Tailwind setup as public site, different layout shell.

### Auth

Email + password login at `/admin/login`. Password hashed with `bcrypt`. Session stored in a signed HTTP-only cookie (`iron-session` or `next-iron-session`). Single admin user for MVP — no multi-user management.

All `/admin/*` routes check for valid session server-side. Redirect to `/admin/login` if unauthenticated.

### Admin Dashboard (`/admin`)

- Pending review count (high-risk items awaiting approval)
- Source health table: last fetch time, items fetched, error count per source
- Recent ingestion errors log

### Review Queue (`/admin/queue`)

Lists all `review_status = pending_review` items, newest first. Each row shows:
- Title, source, published date, category, risk badge
- Raw excerpt (collapsible) + ai_summary + why_it_matters
- Actions: **Approve**, **Reject**, **Edit & Approve** (inline edit of ai_summary and why_it_matters)

### Source Management (`/admin/sources`)

Table of all sources. Actions: add new source, edit fields, toggle active/inactive, view last fetch status and error message.

### Directory Management (`/admin/directory`)

Table of all listings. Actions: add, edit, delete, update `last_reviewed_at`. Broken link flag visible inline.

### Takedowns (`/admin/takedowns`)

Lists takedown form submissions. Actions: mark resolved, reject item from content_items, flag source as restricted.

---

## Legal & Attribution

- Every content item displays source name, publication date, and original URL.
- AI summaries are clearly labeled as summaries, not original reporting.
- Sitewide footer disclaimer: "Summaries are for informational purposes only and do not constitute legal, insurance, financial, or compliance advice."
- Source takedown workflow available at `/contact/takedown`.
- No full articles republished. Raw excerpts stored privately, only summaries displayed.
- No scraping of restricted, paid, or proprietary sources.

---

## Deployment

- **Vercel** for Next.js hosting (free tier sufficient for MVP)
- **Neon** for PostgreSQL (free tier: 0.5 GB storage, sufficient for MVP)
- **Environment variables:** `DATABASE_URL`, `ANTHROPIC_API_KEY`, `ADMIN_SESSION_SECRET`
- node-cron jobs start automatically with `next start` — no separate process or queue needed

---

## Deferred (Post-MVP)

- User accounts and personalization
- Email newsletter digest
- Affiliate links in directory
- Live load-board data
- Redis + BullMQ (if ingestion volume outgrows node-cron)
- Meilisearch (if PostgreSQL full-text search becomes a bottleneck)
- Community posting
- Mobile app
- Real-time alerts
- Sponsored listings
- Partner API integrations

---

## Success Metrics

- Daily returning users
- Click-throughs to original sources
- Directory link clicks
- Compliance alert engagement
- Search usage
- Auto-publish rate (% of items that pass without admin review)
- Source fetch success rate
