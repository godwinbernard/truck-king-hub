# CLAUDE.md

## Project

This repository is for the Trucking Community Hub: a U.S. trucking intelligence website for truck drivers, owner-operators, and small fleet owners.

Primary spec:

- `docs/superpowers/specs/2026-06-05-trucking-community-hub-design.md`

Read the product spec before making architectural, product, or implementation decisions.

## Product Direction

Build a practical daily operating intelligence hub, not a generic marketing site.

Primary users:

- Independent truck drivers and owner-operators
- Small fleet owners, generally 1-25 power units
- New trucking entrepreneurs researching authority, insurance, compliance, and operating costs

The product should help users:

- Understand what changed today in trucking
- Track FMCSA, DOT, and Federal Register updates
- Find useful trucking business resources quickly
- Compare load boards, truck stops, equipment marketplaces, associations, and compliance tools
- Learn how insurance, safety scores, claims, and compliance affect business costs
- Monitor trucking community topics without reading every source manually

## Content And Legal Rules

The site must be built around attribution and transformation, not copying.

Do:

- Use public RSS feeds and official APIs where available.
- Use official source links, publication dates, and source names.
- Summarize briefly in plain English.
- Link back to original sources.
- Keep FMCSA, Federal Register, compliance, insurance, and legal-risk content clearly sourced.
- Send high-risk regulatory, insurance, safety, or legal interpretation to an admin review workflow.

Do not:

- Republish full articles from third-party websites.
- Scrape restricted, paid, or proprietary data sources without permission.
- Scrape live load-board listings, rates, broker data, or marketplace data from DAT, Truckstop, Uber Freight, Trucker Path, or similar platforms without an official API or partnership.
- Present third-party reporting as original work.
- Copy private forum content or large forum excerpts.

Community content should be summarized as topic-level trends and linked back to original public conversations where permitted.

## MVP Scope

Prioritize these first:

- Dashboard homepage
- Daily Trucking Brief
- News and updates feed
- FMCSA/Compliance Watch
- Owner-Operator Resource Directory
- Insurance and Risk Center
- Basic search
- Admin review queue
- Scheduled ingestion from a small approved source list

Defer these until later phases:

- Live load-board data
- User accounts
- Paid memberships
- Community posting
- Mobile app
- Real-time alerts
- Sponsored listings
- Partner API integrations

## Suggested Architecture

Recommended stack unless the user chooses otherwise:

- Frontend: Next.js
- Styling: Tailwind CSS
- Database: PostgreSQL
- Search: Meilisearch or Typesense
- Background jobs: Redis and BullMQ, or a managed scheduler
- AI summarization: OpenAI API
- Admin: lightweight custom admin interface

Core data concepts:

- Source
- Content Item
- Directory Listing
- Topic

The ingestion pipeline should:

1. Fetch approved sources.
2. Normalize updates into a common content format.
3. Deduplicate related stories.
4. Categorize by topic and audience.
5. Generate a short summary and "why it matters" note.
6. Assign risk level.
7. Publish low-risk items automatically.
8. Send high-risk items to admin review.

## UX Guidance

Design for working trucking operators.

Use:

- Dashboard-first layouts
- Dense but readable information
- Strong search and filtering
- Clear source attribution
- Compliance alert badges
- Mobile-friendly screens for drivers
- Practical language and clear next steps

Avoid:

- Generic hero-first marketing pages
- Decorative UI that hides useful information
- Corporate freight-publication tone
- One-note visual themes
- Unsupported claims about regulations, insurance, or market data

The first screen should immediately show useful trucking information.

## Development Workflow

- Keep implementation aligned with the product spec.
- Favor small, focused files with clear boundaries.
- Preserve legal/source rules in tests and data models.
- Add tests for ingestion, normalization, deduplication, risk classification, and publishing rules.
- Before claiming work is complete, run the relevant verification commands and report what passed.
- Do not commit unrelated changes.

## Brand Voice

The site should sound practical, direct, and business-focused. It should understand real owner-operator and small fleet problems: rates, brokers, downtime, repairs, insurance premiums, inspections, parking, compliance, fuel, and cash flow.
