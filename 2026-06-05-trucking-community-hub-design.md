# Trucking Community Hub Product Spec

## Purpose

Create a practical U.S. trucking community website for truck drivers, owner-operators, and small fleet owners. The site should help users stay current on freight trends, regulations, insurance, safety, equipment, business operations, and community issues without needing to visit many separate websites every day.

The website should aggregate public updates from leading trucking websites and official sources, summarize them in plain English, organize them by user need, and link back to the original source.

## Primary Audience

The primary audience is:

- Independent truck drivers and owner-operators
- Small fleet owners, generally 1-25 power units
- New trucking entrepreneurs researching authority, insurance, compliance, and operating costs

The site should also be useful to dispatchers, trucking insurance professionals, and trucking service providers, but those are secondary audiences.

## Product Positioning

The site should be positioned as:

> A daily operating intelligence hub for owner-operators and small fleets.

The voice should be practical, direct, and business-focused. It should avoid sounding like a corporate freight publication. Users should feel that the site understands real trucking problems: rates, brokers, downtime, repairs, insurance premiums, inspections, parking, compliance, fuel, and cash flow.

## Core User Jobs

The website should help users:

- Understand what changed today in trucking
- Track FMCSA, DOT, and Federal Register updates that affect carriers and drivers
- Find useful trucking resources quickly
- Compare load boards, truck stops, equipment marketplaces, associations, and compliance tools
- Learn how insurance, safety scores, claims, and compliance affect business costs
- Monitor market and community topics without reading every forum and news site manually
- Make better operating decisions as an owner-operator or small fleet

## Source Strategy

The site should use a source registry that classifies each source by type, permission level, update method, and risk.

### News And Industry Sources

Candidate sources:

- FreightWaves
- Transport Topics
- Overdrive
- FleetOwner
- Heavy Duty Trucking
- Commercial Carrier Journal
- TheTrucker.com
- CDLLife
- Truckers News

Preferred update method:

- RSS feeds where available
- Public APIs where available
- Link-only source pages where RSS/API access is not available
- Manual editorial entries for important sources that cannot be automated safely

### Regulatory Sources

Candidate sources:

- FMCSA newsroom and RSS
- FMCSA rules and notices
- Federal Register API for FMCSA-related documents
- SAFER Company Snapshot
- FMCSA Clearinghouse
- Regulations.gov, where relevant

Preferred update method:

- Official RSS feeds
- Official APIs
- Scheduled polling of official public pages

### Community Sources

Candidate sources:

- TruckersReport
- Reddit r/Truckers
- CDLLife community content
- TruckingTruth forum

Preferred update method:

- Public APIs or permitted feeds
- Topic-level trend summaries
- Link back to original conversations

The site should not copy private forum content or large forum excerpts. Community content should be summarized as trends, not republished as full posts.

### Load Board And Freight Tool Sources

Candidate sources:

- DAT
- Truckstop
- 123Loadboard
- Uber Freight
- Trucker Path

Preferred update method:

- Official APIs, partner feeds, affiliate relationships, or manually maintained directory data

The site should not scrape live load-board listings, rates, broker data, or proprietary marketplace data without permission.

### Resource Directory Sources

Candidate sources:

- American Trucking Associations
- OOIDA
- NASTC
- Love's
- Pilot Flying J
- TA Petro
- TruckPaper
- Commercial Truck Trader
- ELD providers
- Factoring companies
- Fuel card providers
- Maintenance networks

Preferred update method:

- Manually curated listings
- Periodic automated checks for broken links and public changes
- Sponsored or verified listing workflows in Phase 4 only, after the unpaid directory is useful and trusted

## Legal And Content Rules

The website must be built around attribution and transformation, not copying.

Rules:

- Do not republish full articles from third-party websites.
- Do not scrape restricted or paid data sources without permission.
- Do not present third-party content as original reporting.
- Always show the source name and original link.
- Use short summaries and excerpts only when allowed.
- Keep AI summaries concise and transformative.
- Preserve publication dates and source URLs.
- Add a sitewide disclaimer that summaries are informational and not legal, insurance, financial, or compliance advice.
- Add a source takedown/contact workflow.

## Information Architecture

### Home Dashboard

The homepage should be the daily operating dashboard.

Core modules:

- Today's Trucking Brief
- FMCSA and compliance alerts
- Freight market pulse
- Insurance and risk spotlight
- Trending owner-operator topics
- Small fleet checklist
- Quick links to FMCSA, SAFER, load boards, associations, truck stops, and equipment marketplaces

### Daily Trucking Brief

A feed of the most important updates for the day.

Each item should include:

- Title
- Source
- Published date
- Category
- Short plain-English summary
- Why it matters
- Link to original source

### Owner-Operator Hub

Content and tools for independent operators.

Topics:

- Load board comparisons
- Broker vetting
- Dispatching
- Factoring
- Fuel cards
- ELDs
- Maintenance
- Equipment buying
- Authority setup
- Operating cost basics
- Profit calculators

### Small Fleet Command Center

Content and tools for small fleet owners.

Topics:

- Driver hiring and retention
- Safety score monitoring
- Insurance renewal preparation
- Compliance calendar
- Vehicle maintenance planning
- Driver qualification files
- Claims prevention
- Fleet operating costs

### Insurance And Risk Center

This should be a major differentiator for the site.

Topics:

- Trucking insurance basics
- New venture trucking insurance
- Owner-operator vs fleet coverage
- How DOT scores affect premiums
- Claims prevention
- Renewal checklist
- Cargo, liability, physical damage, trailer interchange, non-trucking liability
- What underwriters look for
- How to prepare for renewal

### Compliance Watch

Plain-English regulatory updates.

Topics:

- FMCSA updates
- DOT authority
- Clearinghouse
- Federal Register rules and notices
- SAFER links
- Inspection and violation themes
- Compliance deadlines

Each regulatory article should distinguish between:

- Official source text
- Plain-English summary
- Practical impact
- Recommended next step

### Community Pulse

Summaries of active discussion themes across public trucking communities.

Examples:

- Drivers discussing rate pressure
- Parking shortages
- Broker payment complaints
- ELD frustration
- Repair costs
- Insurance premiums
- Safety blitzes

Each topic page should link back to source discussions where permitted.

### Resource Directory

A categorized trucking business directory.

Categories:

- Load boards
- Truck stops
- Equipment marketplaces
- Associations
- Compliance tools
- ELDs
- Fuel cards
- Factoring
- Maintenance
- Insurance
- Training and CDL resources

Directory cards should include:

- Name
- Category
- Description
- Best for
- Website link
- Notes
- Last reviewed date

## Data Model

### Source

Fields:

- id
- name
- website_url
- source_type
- update_method
- permission_level
- default_category
- active_status
- fetch_frequency
- last_checked_at
- notes

### Content Item

Fields:

- id
- source_id
- title
- original_url
- canonical_url
- published_at
- fetched_at
- author
- raw_excerpt
- ai_summary
- why_it_matters
- category
- tags
- audience
- risk_level
- review_status
- duplicate_group_id

### Directory Listing

Fields:

- id
- name
- category
- website_url
- description
- best_for
- pricing_note
- affiliate_status
- verified_status
- last_reviewed_at

### Topic

Fields:

- id
- title
- category
- summary
- trend_score
- related_content_ids
- first_seen_at
- last_seen_at

## Automatic Update Pipeline

The site should use a scheduled ingestion pipeline.

Flow:

1. Fetch updates from approved sources.
2. Normalize each update into the common content format.
3. Check for duplicates and related stories.
4. Categorize by topic and audience.
5. Generate a short summary and "why it matters" note.
6. Assign risk level.
7. Publish low-risk items automatically.
8. Send high-risk items to admin review.

Risk levels:

- Low: general news, directory updates, public event announcements
- Medium: market analysis, insurance education, community trend summaries
- High: legal, regulatory, compliance, safety enforcement, or insurance interpretation

High-risk items should require human review before publication.

## Admin Workflow

The admin panel should allow editors to:

- View source health
- Review fetched content
- Edit summaries
- Approve or reject content
- Manage categories and tags
- Manage directory listings
- Mark source restrictions
- Handle takedown requests
- View broken links
- See ingestion errors

## MVP Scope

The first version should focus on usefulness and legal safety.

MVP features:

- Home dashboard
- Daily Trucking Brief
- News and updates feed
- FMCSA/Compliance Watch
- Owner-Operator Resource Directory
- Insurance and Risk Center
- Basic search
- Admin review queue
- Scheduled ingestion from a small approved source list

MVP source list:

- FMCSA RSS
- Federal Register API for FMCSA-related documents
- 3-5 trucking news sources with RSS or permitted public feeds
- Manually curated directory entries for load boards, associations, truck stops, equipment marketplaces, and insurance resources

Deferred features:

- Live load-board data
- User accounts
- Paid memberships
- Community posting
- Mobile app
- Real-time alerts
- Sponsored listings
- Partner API integrations

## Future Phases

### Phase 2: Intelligence

- AI topic clustering
- Trending topic pages
- Weekly email digest
- Advanced search and filters
- Source credibility scoring
- Saved topics

### Phase 3: Tools

- Insurance renewal checklist
- Operating cost calculator
- Trucking authority checklist
- Compliance calendar
- Safety score preparation guide
- Broker vetting checklist

### Phase 4: Monetization

- Newsletter sponsorships
- Verified directory listings
- Affiliate links only where source terms, disclosure rules, and user trust make them acceptable
- Premium compliance alerts
- Insurance lead generation
- Small fleet resource membership

## Suggested Tech Stack

Recommended stack:

- Frontend: Next.js
- Styling: Tailwind CSS
- Database: PostgreSQL
- Search: Meilisearch or Typesense
- Background jobs: Redis and BullMQ, or a managed scheduler
- AI summarization: OpenAI API
- Admin: custom lightweight admin interface
- Hosting: Vercel, Cloudflare, or Sites

## Design Direction

The visual design should feel practical, credible, and operational.

Recommended style:

- Dashboard-first layout
- Dense but readable information
- Strong search and filters
- Clear source attribution
- Alert badges for compliance items
- Mobile-friendly for drivers
- No marketing-heavy landing page as the first screen

The first screen should immediately show useful trucking information, not a generic hero section.

## Success Metrics

MVP success should be measured by:

- Number of daily returning users
- Newsletter signups
- Click-throughs to original sources
- Directory link clicks
- Compliance alert engagement
- Search usage
- Time spent on owner-operator and insurance resources
- Number of approved content items published automatically
- Source fetch success rate

## Open Product Decisions

The following decisions should be made before the first implementation sprint:

- Whether the first build should include user accounts or stay public-only
- Whether summaries should publish automatically or require review for the first 30 days
- Which 3-5 news sources are approved for MVP ingestion
- Whether the site should include affiliate links from day one
- Whether insurance lead capture should be included in MVP
- Whether the brand should feel more like a driver community, small fleet business tool, or trucking insurance intelligence hub

## Recommended First Build

Build a public-only MVP with:

- Dashboard homepage
- Daily trucking brief
- Compliance watch
- Insurance and risk center
- Resource directory
- Searchable update feed
- Admin review workflow
- Automated ingestion from official and RSS/API-safe sources

This keeps the project valuable, focused, and legally safer while leaving room for partner data, monetization, and community features in later product phases.
