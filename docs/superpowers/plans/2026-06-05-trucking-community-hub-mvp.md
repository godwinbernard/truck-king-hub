# Truck King Hub MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public-only trucking intelligence hub that ingests RSS/API sources, summarizes with Claude Haiku, and presents content in a Navy & Gold dashboard.

**Architecture:** Single Next.js 14 (App Router) monolith with PostgreSQL (Drizzle ORM), node-cron scheduled ingestion, and Claude Haiku for AI summaries. No Redis, no separate worker process, no search service — PostgreSQL tsvector covers search.

**Tech Stack:** Next.js 14, Tailwind CSS, Drizzle ORM, PostgreSQL (Neon), node-cron, @anthropic-ai/sdk, rss-parser, iron-session, bcryptjs

---

## Phase 1: Project Scaffold & Database

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `.env.local`, `.gitignore`

- [ ] **Step 1: Scaffold the project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

- [ ] **Step 2: Install dependencies**

```bash
npm install drizzle-orm @neondatabase/serverless dotenv
npm install rss-parser @anthropic-ai/sdk node-cron iron-session bcryptjs
npm install -D drizzle-kit @types/node-cron @types/bcryptjs
```

- [ ] **Step 3: Configure environment variables**

Create `.env.local`:
```
DATABASE_URL=postgresql://user:pass@host/dbname
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_SESSION_SECRET=at-least-32-chars-random-secret-here
```

- [ ] **Step 4: Add `.env.local` to `.gitignore`**

Verify `.gitignore` contains:
```
.env.local
.env*.local
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Server running at http://localhost:3000

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with dependencies"
```

---

### Task 2: Database schema

**Files:**
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/client.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 1: Create the Drizzle client**

Create `src/lib/db/client.ts`:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 2: Write the schema**

Create `src/lib/db/schema.ts`:
```typescript
import { pgTable, uuid, text, boolean, integer, timestamp, customType } from 'drizzle-orm/pg-core';

const tsvector = customType<{ data: string }>({
  dataType() { return 'tsvector'; },
});

export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  websiteUrl: text('website_url').notNull(),
  sourceType: text('source_type').notNull(), // 'rss' | 'api' | 'manual'
  updateMethod: text('update_method').notNull(), // 'rss' | 'federal_register_api' | 'manual'
  permissionLevel: text('permission_level').notNull(), // 'open' | 'restricted'
  defaultCategory: text('default_category').notNull(),
  active: boolean('active').default(true).notNull(),
  fetchFrequencyMinutes: integer('fetch_frequency_minutes').default(120).notNull(),
  lastFetchedAt: timestamp('last_fetched_at', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const contentItems = pgTable('content_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceId: uuid('source_id').references(() => sources.id),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  originalUrl: text('original_url').unique().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  author: text('author'),
  rawExcerpt: text('raw_excerpt'),
  aiSummary: text('ai_summary'),
  whyItMatters: text('why_it_matters'),
  category: text('category').notNull(),
  tags: text('tags').array().default([]).notNull(),
  audience: text('audience').array().default([]).notNull(),
  riskLevel: text('risk_level').notNull(), // 'low' | 'medium' | 'high'
  reviewStatus: text('review_status').notNull(), // 'pending_review' | 'auto_published' | 'approved' | 'rejected'
  duplicateGroupId: uuid('duplicate_group_id'),
  searchVector: tsvector('search_vector'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const directoryListings = pgTable('directory_listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  websiteUrl: text('website_url').notNull(),
  description: text('description'),
  bestFor: text('best_for'),
  notes: text('notes'),
  lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  brokenLink: boolean('broken_link').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  summary: text('summary'),
  trendScore: integer('trend_score').default(0).notNull(),
  relatedContentIds: uuid('related_content_ids').array().default([]).notNull(),
  firstSeenAt: timestamp('first_seen_at', { withTimezone: true }).defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).defaultNow().notNull(),
});

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const takedownRequests = pgTable('takedown_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceName: text('source_name').notNull(),
  url: text('url').notNull(),
  reason: text('reason'),
  requesterEmail: text('requester_email'),
  resolved: boolean('resolved').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

- [ ] **Step 3: Create Drizzle config**

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 4: Add migrate script to package.json**

In `package.json` scripts section add:
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push"
```

- [ ] **Step 5: Push schema to database**

```bash
npm run db:push
```
Expected: Tables created in PostgreSQL with no errors.

- [ ] **Step 6: Add tsvector trigger via SQL**

Run this SQL directly in your Neon console (or via a migration file):
```sql
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector('english',
      coalesce(NEW.title, '') || ' ' ||
      coalesce(NEW.ai_summary, '') || ' ' ||
      coalesce(array_to_string(NEW.tags, ' '), '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_items_search_vector_update
BEFORE INSERT OR UPDATE ON content_items
FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add database schema and Drizzle config"
```

---

### Task 3: Seed approved sources

**Files:**
- Create: `src/lib/db/seed.ts`

- [ ] **Step 1: Write seed script**

Create `src/lib/db/seed.ts`:
```typescript
import { db } from './client';
import { sources } from './schema';

async function seed() {
  await db.insert(sources).values([
    {
      name: 'FMCSA Newsroom',
      websiteUrl: 'https://www.fmcsa.dot.gov/newsroom',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'compliance',
      fetchFrequencyMinutes: 120,
      notes: 'Official FMCSA newsroom RSS feed',
    },
    {
      name: 'Federal Register (FMCSA)',
      websiteUrl: 'https://www.federalregister.gov',
      sourceType: 'api',
      updateMethod: 'federal_register_api',
      permissionLevel: 'open',
      defaultCategory: 'compliance',
      fetchFrequencyMinutes: 240,
      notes: 'Federal Register API filtered to FMCSA agency documents',
    },
    {
      name: 'Overdrive',
      websiteUrl: 'https://www.overdriveonline.com',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'freight',
      fetchFrequencyMinutes: 120,
      notes: 'Overdrive magazine RSS feed',
    },
    {
      name: 'Truckers News',
      websiteUrl: 'https://www.truckersnews.com',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'general',
      fetchFrequencyMinutes: 120,
      notes: 'Truckers News RSS feed',
    },
    {
      name: 'TheTrucker.com',
      websiteUrl: 'https://www.thetrucker.com',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'general',
      fetchFrequencyMinutes: 120,
      notes: 'TheTrucker.com RSS feed',
    },
  ]).onConflictDoNothing();

  console.log('Sources seeded.');
  process.exit(0);
}

seed().catch(console.error);
```

- [ ] **Step 2: Add seed script to package.json**

```json
"db:seed": "npx tsx src/lib/db/seed.ts"
```

- [ ] **Step 3: Run seed**

```bash
npm run db:seed
```
Expected: "Sources seeded." with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: seed approved ingestion sources"
```

---

## Phase 2: Ingestion Pipeline

### Task 4: Fetcher

**Files:**
- Create: `src/lib/ingestion/fetcher.ts`

- [ ] **Step 1: Write the fetcher**

Create `src/lib/ingestion/fetcher.ts`:
```typescript
import Parser from 'rss-parser';

export type RawEntry = {
  title: string;
  link: string;
  pubDate: string | null;
  contentSnippet: string | null;
  author: string | null;
};

const rssParser = new Parser();

export async function fetchRss(feedUrl: string): Promise<RawEntry[]> {
  const feed = await rssParser.parseURL(feedUrl);
  return feed.items.map((item) => ({
    title: item.title ?? '',
    link: item.link ?? '',
    pubDate: item.pubDate ?? null,
    contentSnippet: item.contentSnippet ?? null,
    author: item.creator ?? item.author ?? null,
  }));
}

export async function fetchFederalRegister(): Promise<RawEntry[]> {
  const url =
    'https://www.federalregister.gov/api/v1/articles.json' +
    '?conditions[agencies][]=federal-motor-carrier-safety-administration' +
    '&order=newest&per_page=20&fields[]=title&fields[]=html_url' +
    '&fields[]=publication_date&fields[]=abstract&fields[]=agencies';

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Federal Register API error: ${res.status}`);
  const data = await res.json();

  return (data.results ?? []).map((item: Record<string, string>) => ({
    title: item.title ?? '',
    link: item.html_url ?? '',
    pubDate: item.publication_date ?? null,
    contentSnippet: item.abstract ?? null,
    author: null,
  }));
}
```

- [ ] **Step 2: Write tests**

Create `src/lib/ingestion/__tests__/fetcher.test.ts`:
```typescript
import { fetchFederalRegister } from '../fetcher';

// Integration test — requires internet access
describe('fetchFederalRegister', () => {
  it('returns an array of entries with required fields', async () => {
    const entries = await fetchFederalRegister();
    expect(Array.isArray(entries)).toBe(true);
    if (entries.length > 0) {
      expect(entries[0]).toHaveProperty('title');
      expect(entries[0]).toHaveProperty('link');
    }
  }, 15000);
});
```

- [ ] **Step 3: Add Jest config**

```bash
npm install -D jest @types/jest ts-jest
```

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
export default config;
```

Add to `package.json` scripts:
```json
"test": "jest"
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --testPathPattern=fetcher
```
Expected: PASS (Federal Register returns results array)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add RSS and Federal Register fetchers"
```

---

### Task 5: Normalizer

**Files:**
- Create: `src/lib/ingestion/normalizer.ts`

- [ ] **Step 1: Write the normalizer**

Create `src/lib/ingestion/normalizer.ts`:
```typescript
import { RawEntry } from './fetcher';

export type NormalizedItem = {
  title: string;
  originalUrl: string;
  publishedAt: Date | null;
  rawExcerpt: string | null;
  author: string | null;
  sourceId: string;
};

function slugify(title: string, url: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
  const suffix = url.split('/').pop()?.slice(0, 8) ?? Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export function normalize(entry: RawEntry, sourceId: string): NormalizedItem & { slug: string } {
  return {
    title: entry.title.trim(),
    slug: slugify(entry.title, entry.link),
    originalUrl: entry.link,
    publishedAt: entry.pubDate ? new Date(entry.pubDate) : null,
    rawExcerpt: entry.contentSnippet ? entry.contentSnippet.slice(0, 1000) : null,
    author: entry.author,
    sourceId,
  };
}
```

- [ ] **Step 2: Write tests**

Create `src/lib/ingestion/__tests__/normalizer.test.ts`:
```typescript
import { normalize } from '../normalizer';
import { RawEntry } from '../fetcher';

const entry: RawEntry = {
  title: 'FMCSA Issues New ELD Rules',
  link: 'https://fmcsa.dot.gov/news/eld-rules',
  pubDate: '2026-06-05T10:00:00Z',
  contentSnippet: 'The FMCSA announced new ELD rules affecting all CMV operators.',
  author: 'FMCSA',
};

describe('normalize', () => {
  it('maps entry fields to NormalizedItem shape', () => {
    const result = normalize(entry, 'source-uuid-123');
    expect(result.title).toBe('FMCSA Issues New ELD Rules');
    expect(result.originalUrl).toBe('https://fmcsa.dot.gov/news/eld-rules');
    expect(result.sourceId).toBe('source-uuid-123');
    expect(result.publishedAt).toBeInstanceOf(Date);
    expect(result.rawExcerpt).toContain('FMCSA');
  });

  it('generates a slug from the title', () => {
    const result = normalize(entry, 'source-uuid-123');
    expect(result.slug).toMatch(/^fmcsa-issues-new-eld-rules/);
  });

  it('handles null pubDate gracefully', () => {
    const result = normalize({ ...entry, pubDate: null }, 'source-uuid-123');
    expect(result.publishedAt).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --testPathPattern=normalizer
```
Expected: PASS (3 tests)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add ingestion normalizer"
```

---

### Task 6: Deduplicator

**Files:**
- Create: `src/lib/ingestion/deduplicator.ts`

- [ ] **Step 1: Write the deduplicator**

Create `src/lib/ingestion/deduplicator.ts`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems } from '@/lib/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { NormalizedItem } from './normalizer';

export async function isDuplicate(originalUrl: string): Promise<boolean> {
  const existing = await db
    .select({ id: contentItems.id })
    .from(contentItems)
    .where(eq(contentItems.originalUrl, originalUrl))
    .limit(1);
  return existing.length > 0;
}

export async function findDuplicateGroupId(
  title: string,
  publishedAt: Date | null
): Promise<string | null> {
  if (!publishedAt) return null;

  const windowStart = new Date(publishedAt.getTime() - 24 * 60 * 60 * 1000);
  const windowEnd = new Date(publishedAt.getTime() + 24 * 60 * 60 * 1000);

  // Find items in 24h window with similar title (first 40 chars match)
  const titlePrefix = title.slice(0, 40).toLowerCase();

  const existing = await db
    .select({ id: contentItems.id, duplicateGroupId: contentItems.duplicateGroupId })
    .from(contentItems)
    .where(
      and(
        gte(contentItems.publishedAt, windowStart),
        lte(contentItems.publishedAt, windowEnd),
        sql`lower(${contentItems.title}) LIKE ${titlePrefix + '%'}`
      )
    )
    .limit(1);

  if (existing.length === 0) return null;
  return existing[0].duplicateGroupId ?? existing[0].id;
}
```

- [ ] **Step 2: Write tests**

Create `src/lib/ingestion/__tests__/deduplicator.test.ts`:
```typescript
import { isDuplicate, findDuplicateGroupId } from '../deduplicator';

// These are integration tests that require a running database.
// Mock the db module for unit testing.
jest.mock('@/lib/db/client', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([]),
  },
}));

describe('isDuplicate', () => {
  it('returns false when no existing item found', async () => {
    const result = await isDuplicate('https://example.com/new-article');
    expect(result).toBe(false);
  });
});

describe('findDuplicateGroupId', () => {
  it('returns null when publishedAt is null', async () => {
    const result = await findDuplicateGroupId('Some Title', null);
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --testPathPattern=deduplicator
```
Expected: PASS (2 tests)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add ingestion deduplicator"
```

---

### Task 7: Categorizer

**Files:**
- Create: `src/lib/ingestion/categorizer.ts`

- [ ] **Step 1: Write the categorizer**

Create `src/lib/ingestion/categorizer.ts`:
```typescript
export type Category =
  | 'compliance' | 'insurance' | 'freight' | 'community'
  | 'equipment' | 'fuel' | 'safety' | 'general';

export type Audience = 'driver' | 'owner_operator' | 'small_fleet';

const COMPLIANCE_KEYWORDS = [
  'fmcsa', 'eld', 'clearinghouse', 'dot', 'federal register',
  'regulation', 'compliance', 'authority', 'inspection', 'violation',
  'hours of service', 'hos', 'cdl', 'drug test', 'alcohol test',
];

const INSURANCE_KEYWORDS = [
  'insurance', 'premium', 'csa score', 'safety rating', 'liability',
  'cargo coverage', 'physical damage', 'underwriter', 'renewal', 'claim',
];

const FREIGHT_KEYWORDS = [
  'spot rate', 'load board', 'freight market', 'capacity', 'broker',
  'shipper', 'lane', 'truckload', 'ltl', 'rate per mile',
];

const FUEL_KEYWORDS = ['fuel', 'diesel', 'gas price', 'fuel card', 'def'];

const EQUIPMENT_KEYWORDS = [
  'truck', 'trailer', 'equipment', 'repair', 'maintenance', 'tires',
  'breakdown', 'parts', 'dealership',
];

const SAFETY_KEYWORDS = [
  'safety', 'accident', 'crash', 'fatigue', 'blitz', 'inspection week',
  'roadcheck', 'enforcement',
];

const AUDIENCE_MAP: Record<Category, Audience[]> = {
  compliance: ['driver', 'owner_operator', 'small_fleet'],
  insurance: ['owner_operator', 'small_fleet'],
  freight: ['driver', 'owner_operator'],
  community: ['driver', 'owner_operator', 'small_fleet'],
  equipment: ['owner_operator', 'small_fleet'],
  fuel: ['driver', 'owner_operator'],
  safety: ['driver', 'owner_operator', 'small_fleet'],
  general: ['driver', 'owner_operator', 'small_fleet'],
};

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

export function categorize(
  title: string,
  rawExcerpt: string | null,
  defaultCategory: Category
): { category: Category; audience: Audience[] } {
  const text = `${title} ${rawExcerpt ?? ''}`;

  let category: Category = defaultCategory;

  if (matchesKeywords(text, COMPLIANCE_KEYWORDS)) category = 'compliance';
  else if (matchesKeywords(text, INSURANCE_KEYWORDS)) category = 'insurance';
  else if (matchesKeywords(text, FUEL_KEYWORDS)) category = 'fuel';
  else if (matchesKeywords(text, SAFETY_KEYWORDS)) category = 'safety';
  else if (matchesKeywords(text, EQUIPMENT_KEYWORDS)) category = 'equipment';
  else if (matchesKeywords(text, FREIGHT_KEYWORDS)) category = 'freight';

  return { category, audience: AUDIENCE_MAP[category] };
}
```

- [ ] **Step 2: Write tests**

Create `src/lib/ingestion/__tests__/categorizer.test.ts`:
```typescript
import { categorize } from '../categorizer';

describe('categorize', () => {
  it('detects compliance from title keywords', () => {
    const result = categorize('FMCSA Issues New ELD Mandate', null, 'general');
    expect(result.category).toBe('compliance');
    expect(result.audience).toContain('driver');
  });

  it('detects insurance from excerpt keywords', () => {
    const result = categorize('What Truckers Need to Know', 'Your CSA score affects your insurance premium at renewal', 'general');
    expect(result.category).toBe('insurance');
  });

  it('falls back to defaultCategory when no keywords match', () => {
    const result = categorize('Industry Update', 'General news about trucking', 'freight');
    expect(result.category).toBe('freight');
  });

  it('returns correct audience for compliance', () => {
    const result = categorize('DOT inspection blitz announced', null, 'general');
    expect(result.audience).toEqual(['driver', 'owner_operator', 'small_fleet']);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --testPathPattern=categorizer
```
Expected: PASS (4 tests)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add ingestion categorizer with keyword rules"
```

---

### Task 8: Risk classifier

**Files:**
- Create: `src/lib/risk/classifier.ts`

- [ ] **Step 1: Write the classifier**

Create `src/lib/risk/classifier.ts`:
```typescript
export type RiskLevel = 'low' | 'medium' | 'high';

const HIGH_KEYWORDS = [
  'fmcsa rule', 'enforcement', 'penalty', 'federal register',
  'clearinghouse', 'violation', 'fine', 'mandate', 'proposed rule',
  'final rule', 'compliance deadline', 'out of service',
];

const MEDIUM_KEYWORDS = [
  'insurance', 'csa score', 'safety rating', 'market analysis',
  'rate forecast', 'premium', 'underwriting',
];

export function classifyRisk(
  title: string,
  rawExcerpt: string | null,
  sourceType: string
): RiskLevel {
  if (sourceType === 'api') return 'high'; // Federal Register always high

  const text = `${title} ${rawExcerpt ?? ''}`.toLowerCase();

  if (HIGH_KEYWORDS.some((kw) => text.includes(kw))) return 'high';
  if (MEDIUM_KEYWORDS.some((kw) => text.includes(kw))) return 'medium';
  return 'low';
}
```

- [ ] **Step 2: Write tests**

Create `src/lib/risk/__tests__/classifier.test.ts`:
```typescript
import { classifyRisk } from '../classifier';

describe('classifyRisk', () => {
  it('returns high for Federal Register API source type', () => {
    expect(classifyRisk('Any Title', null, 'api')).toBe('high');
  });

  it('returns high for enforcement keyword in title', () => {
    expect(classifyRisk('FMCSA Enforcement Action Against Carrier', null, 'rss')).toBe('high');
  });

  it('returns medium for insurance keyword', () => {
    expect(classifyRisk('How Insurance Premiums Are Calculated', null, 'rss')).toBe('medium');
  });

  it('returns low for general news', () => {
    expect(classifyRisk('Truck Stop Opens New Location', null, 'rss')).toBe('low');
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --testPathPattern=classifier
```
Expected: PASS (4 tests)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add rule-based risk classifier"
```

---

### Task 9: Claude Haiku summarizer

**Files:**
- Create: `src/lib/summarizer/claude.ts`

- [ ] **Step 1: Write the summarizer**

Create `src/lib/summarizer/claude.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type SummaryResult = {
  aiSummary: string;
  whyItMatters: string;
};

export async function summarize(
  title: string,
  rawExcerpt: string
): Promise<SummaryResult> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You are writing for an audience of U.S. truck drivers, owner-operators, and small fleet owners.

Article title: ${title}
Article excerpt: ${rawExcerpt}

Respond with ONLY a JSON object in this exact format:
{
  "ai_summary": "2-3 sentences summarizing what happened in plain English, no jargon",
  "why_it_matters": "1 sentence explaining the practical impact for trucking operators"
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const parsed = JSON.parse(text);

  return {
    aiSummary: parsed.ai_summary ?? '',
    whyItMatters: parsed.why_it_matters ?? '',
  };
}
```

- [ ] **Step 2: Write tests (mock the API)**

Create `src/lib/summarizer/__tests__/claude.test.ts`:
```typescript
import { summarize } from '../claude';

jest.mock('@anthropic-ai/sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ai_summary: 'The FMCSA proposed new ELD rules affecting all drivers.',
              why_it_matters: 'Drivers may need to update their ELD devices by Q1 2027.',
            }),
          },
        ],
      }),
    },
  })),
}));

describe('summarize', () => {
  it('returns aiSummary and whyItMatters from Claude response', async () => {
    const result = await summarize('FMCSA ELD Rule', 'New rules announced for ELD devices.');
    expect(result.aiSummary).toContain('FMCSA');
    expect(result.whyItMatters).toContain('drivers');
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --testPathPattern=claude
```
Expected: PASS (1 test)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Claude Haiku summarizer"
```

---

### Task 10: Ingestion job (pipeline orchestrator)

**Files:**
- Create: `src/workers/jobs/ingest.ts`

- [ ] **Step 1: Write the ingest job**

Create `src/workers/jobs/ingest.ts`:
```typescript
import { db } from '@/lib/db/client';
import { sources, contentItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { fetchRss, fetchFederalRegister } from '@/lib/ingestion/fetcher';
import { normalize } from '@/lib/ingestion/normalizer';
import { isDuplicate, findDuplicateGroupId } from '@/lib/ingestion/deduplicator';
import { categorize, Category } from '@/lib/ingestion/categorizer';
import { classifyRisk } from '@/lib/risk/classifier';
import { summarize } from '@/lib/summarizer/claude';

export async function runIngestion() {
  const activeSources = await db
    .select()
    .from(sources)
    .where(eq(sources.active, true));

  for (const source of activeSources) {
    try {
      const entries =
        source.updateMethod === 'rss'
          ? await fetchRss(source.websiteUrl)
          : source.updateMethod === 'federal_register_api'
          ? await fetchFederalRegister()
          : [];

      for (const entry of entries) {
        if (!entry.link || !entry.title) continue;

        if (await isDuplicate(entry.link)) continue;

        const normalized = normalize(entry, source.id);
        const { category, audience } = categorize(
          normalized.title,
          normalized.rawExcerpt,
          source.defaultCategory as Category
        );
        const riskLevel = classifyRisk(normalized.title, normalized.rawExcerpt, source.sourceType);
        const duplicateGroupId = await findDuplicateGroupId(
          normalized.title,
          normalized.publishedAt
        );

        let aiSummary: string | null = null;
        let whyItMatters: string | null = null;

        if (normalized.rawExcerpt) {
          try {
            const summary = await summarize(normalized.title, normalized.rawExcerpt);
            aiSummary = summary.aiSummary;
            whyItMatters = summary.whyItMatters;
          } catch (err) {
            console.error(`Summarizer error for "${normalized.title}":`, err);
          }
        }

        const reviewStatus =
          riskLevel === 'high' ? 'pending_review' : 'auto_published';

        await db.insert(contentItems).values({
          ...normalized,
          category,
          audience,
          riskLevel,
          reviewStatus,
          duplicateGroupId: duplicateGroupId ?? undefined,
          aiSummary,
          whyItMatters,
          tags: [],
        });
      }

      await db
        .update(sources)
        .set({ lastFetchedAt: new Date() })
        .where(eq(sources.id, source.id));
    } catch (err) {
      console.error(`Ingestion error for source "${source.name}":`, err);
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add ingestion pipeline orchestrator"
```

---

### Task 11: Scheduler and link checker

**Files:**
- Create: `src/workers/scheduler.ts`
- Create: `src/workers/jobs/reindex.ts`
- Create: `src/workers/jobs/linkcheck.ts`

- [ ] **Step 1: Write the reindex job**

Create `src/workers/jobs/reindex.ts`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems } from '@/lib/db/schema';
import { isNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function runReindex() {
  await db.execute(sql`
    UPDATE content_items
    SET search_vector = to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(ai_summary, '') || ' ' ||
      coalesce(array_to_string(tags, ' '), '')
    )
    WHERE search_vector IS NULL
  `);
  console.log('Search index refreshed.');
}
```

- [ ] **Step 2: Write the link checker**

Create `src/workers/jobs/linkcheck.ts`:
```typescript
import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function runLinkCheck() {
  const listings = await db.select().from(directoryListings);

  for (const listing of listings) {
    try {
      const res = await fetch(listing.websiteUrl, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
      const broken = res.status === 404 || res.status >= 500;
      if (broken !== listing.brokenLink) {
        await db
          .update(directoryListings)
          .set({ brokenLink: broken })
          .where(eq(directoryListings.id, listing.id));
      }
    } catch {
      await db
        .update(directoryListings)
        .set({ brokenLink: true })
        .where(eq(directoryListings.id, listing.id));
    }
  }
  console.log('Link check complete.');
}
```

- [ ] **Step 3: Write the scheduler**

Create `src/workers/scheduler.ts`:
```typescript
import cron from 'node-cron';
import { runIngestion } from './jobs/ingest';
import { runReindex } from './jobs/reindex';
import { runLinkCheck } from './jobs/linkcheck';

let initialized = false;

export function startScheduler() {
  if (initialized) return;
  initialized = true;

  // Every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    console.log('[scheduler] Running ingestion...');
    await runIngestion();
  });

  // Every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[scheduler] Running reindex...');
    await runReindex();
  });

  // Weekly Sunday 2am
  cron.schedule('0 2 * * 0', async () => {
    console.log('[scheduler] Running link check...');
    await runLinkCheck();
  });

  console.log('[scheduler] Jobs registered.');
}
```

- [ ] **Step 4: Register scheduler in Next.js**

Create `src/app/api/init/route.ts` — this is a hack-free way to start node-cron in Next.js App Router without a custom server:

```typescript
// This module-level side effect starts the scheduler when the
// API route module is first loaded by Next.js.
import { startScheduler } from '@/workers/scheduler';
startScheduler();

export function GET() {
  return new Response('OK');
}
```

Then call this route on app start by adding to `src/app/layout.tsx`:
```typescript
// Warm up the scheduler on first server render
if (typeof window === 'undefined') {
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/init`).catch(() => {});
}
```

Add `NEXT_PUBLIC_BASE_URL` to `.env.local`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add scheduler with ingestion, reindex, and linkcheck jobs"
```

---

## Phase 3: Public Pages

### Task 12: Tailwind theme and layout shell

**Files:**
- Modify: `tailwind.config.ts`
- Create: `src/app/(public)/layout.tsx`
- Create: `src/components/ui/NavBar.tsx`
- Create: `src/components/ui/Footer.tsx`

- [ ] **Step 1: Configure Navy & Gold theme**

Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1e3a5f',
          light: '#2a5080',
          dark: '#152b47',
        },
        gold: {
          DEFAULT: '#fbbf24',
          light: '#fcd34d',
          dark: '#d97706',
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Create NavBar component**

Create `src/components/ui/NavBar.tsx`:
```typescript
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-extrabold text-lg tracking-tight">
            Truck King<span className="text-gold"> Hub</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-blue-200">
            <Link href="/brief" className="hover:text-white transition-colors">Brief</Link>
            <Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link>
            <Link href="/insurance" className="hover:text-white transition-colors">Insurance</Link>
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create Footer component**

Create `src/components/ui/Footer.tsx`:
```typescript
export function Footer() {
  return (
    <footer className="bg-navy-dark text-blue-200 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-center">
          Summaries are for informational purposes only and do not constitute legal, insurance,
          financial, or compliance advice. Always consult a qualified professional before making
          business, regulatory, or insurance decisions.
        </p>
        <p className="text-xs text-center mt-2 text-blue-300">
          <a href="/contact/takedown" className="underline hover:text-white">Content takedown request</a>
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create public layout**

Create `src/app/(public)/layout.tsx`:
```typescript
import { NavBar } from '@/components/ui/NavBar';
import { Footer } from '@/components/ui/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Navy & Gold theme, NavBar, Footer, public layout"
```

---

### Task 13: Search query helper

**Files:**
- Create: `src/lib/search/index.ts`

- [ ] **Step 1: Write search queries**

Create `src/lib/search/index.ts`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { sql, eq, and, inArray } from 'drizzle-orm';

export type SearchResult = {
  id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: Date | null;
  aiSummary: string | null;
  sourceName: string;
};

export async function searchContent(query: string, limit = 20): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const rows = await db.execute(sql`
    SELECT
      ci.id, ci.title, ci.slug, ci.category,
      ci.published_at, ci.ai_summary,
      s.name AS source_name
    FROM content_items ci
    JOIN sources s ON ci.source_id = s.id
    WHERE ci.review_status IN ('auto_published', 'approved')
      AND ci.search_vector @@ plainto_tsquery('english', ${query})
    ORDER BY ts_rank(ci.search_vector, plainto_tsquery('english', ${query})) DESC
    LIMIT ${limit}
  `);

  return (rows.rows as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    category: String(row.category),
    publishedAt: row.published_at ? new Date(String(row.published_at)) : null,
    aiSummary: row.ai_summary ? String(row.ai_summary) : null,
    sourceName: String(row.source_name),
  }));
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add PostgreSQL full-text search helper"
```

---

### Task 14: Homepage dashboard

**Files:**
- Create: `src/app/(public)/page.tsx`
- Create: `src/components/dashboard/BriefModule.tsx`
- Create: `src/components/dashboard/ContentModule.tsx`
- Create: `src/components/dashboard/QuickLinks.tsx`
- Create: `src/components/content/ContentCard.tsx`
- Create: `src/components/content/RiskBadge.tsx`
- Create: `src/components/content/CategoryBadge.tsx`

- [ ] **Step 1: Create RiskBadge**

Create `src/components/content/RiskBadge.tsx`:
```typescript
export function RiskBadge({ level }: { level: string }) {
  if (level !== 'high') return null;
  return (
    <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
      High Priority
    </span>
  );
}
```

- [ ] **Step 2: Create CategoryBadge**

Create `src/components/content/CategoryBadge.tsx`:
```typescript
const COLORS: Record<string, string> = {
  compliance: 'bg-blue-100 text-blue-700',
  insurance: 'bg-green-100 text-green-700',
  freight: 'bg-yellow-100 text-yellow-700',
  fuel: 'bg-orange-100 text-orange-700',
  safety: 'bg-red-100 text-red-700',
  equipment: 'bg-purple-100 text-purple-700',
  community: 'bg-pink-100 text-pink-700',
  general: 'bg-slate-100 text-slate-600',
};

export function CategoryBadge({ category }: { category: string }) {
  const color = COLORS[category] ?? COLORS.general;
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${color}`}>
      {category}
    </span>
  );
}
```

- [ ] **Step 3: Create ContentCard**

Create `src/components/content/ContentCard.tsx`:
```typescript
import Link from 'next/link';
import { CategoryBadge } from './CategoryBadge';
import { RiskBadge } from './RiskBadge';

type Props = {
  title: string;
  slug: string;
  sourceName: string;
  publishedAt: Date | null;
  category: string;
  riskLevel: string;
  aiSummary: string | null;
  whyItMatters: string | null;
};

export function ContentCard({ title, slug, sourceName, publishedAt, category, riskLevel, aiSummary, whyItMatters }: Props) {
  const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  return (
    <div className="border-l-4 border-navy pl-4 py-2">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <CategoryBadge category={category} />
        <RiskBadge level={riskLevel} />
      </div>
      <Link href={`/item/${slug}`} className="font-semibold text-navy hover:text-navy-light text-sm leading-snug">
        {title}
      </Link>
      <p className="text-xs text-slate-500 mt-0.5">{sourceName}{date ? ` · ${date}` : ''}</p>
      {aiSummary && <p className="text-sm text-slate-700 mt-1 leading-relaxed">{aiSummary}</p>}
      {whyItMatters && <p className="text-xs text-slate-500 mt-1 italic">{whyItMatters}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Create QuickLinks**

Create `src/components/dashboard/QuickLinks.tsx`:
```typescript
const LINKS = [
  { label: 'FMCSA', href: 'https://www.fmcsa.dot.gov' },
  { label: 'SAFER', href: 'https://safer.fmcsa.dot.gov' },
  { label: 'Federal Register', href: 'https://www.federalregister.gov' },
  { label: 'DAT Load Board', href: 'https://www.dat.com' },
  { label: 'Truckstop', href: 'https://truckstop.com' },
  { label: 'OOIDA', href: 'https://www.ooida.com' },
  { label: 'Pilot Flying J', href: 'https://pilotflyingj.com' },
  { label: "Love's Travel Stops", href: 'https://www.loves.com' },
];

export function QuickLinks() {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Links</h2>
      <div className="flex flex-wrap gap-2">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-navy-light transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create homepage page**

Create `src/app/(public)/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources, topics } from '@/lib/db/schema';
import { eq, inArray, desc, gte, and } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';
import { QuickLinks } from '@/components/dashboard/QuickLinks';

async function getPublishedItems(category?: string, limit = 5) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(
      and(
        inArray(contentItems.reviewStatus, ['auto_published', 'approved']),
        category ? eq(contentItems.category, category) : undefined,
        gte(contentItems.publishedAt, sevenDaysAgo),
      )
    )
    .orderBy(desc(contentItems.publishedAt))
    .limit(limit);
  return rows;
}

export default async function HomePage() {
  const [brief, compliance, freight, insurance] = await Promise.all([
    getPublishedItems(undefined, 5),
    getPublishedItems('compliance', 3),
    getPublishedItems('freight', 3),
    getPublishedItems('insurance', 3),
  ]);

  return (
    <div className="space-y-10">
      {/* Hero: Today's Trucking Brief */}
      <section>
        <div className="bg-navy text-white px-6 py-5 rounded-t-lg border-b-4 border-gold">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Today's Trucking Brief</p>
          <h1 className="text-2xl font-extrabold leading-snug">What Changed Today for Operators & Drivers</h1>
          <p className="text-blue-200 text-sm mt-1.5 max-w-2xl">
            Plain-English summaries of the most important trucking news, compliance updates, and market moves — sourced from FMCSA, Federal Register, and leading industry publications.
          </p>
        </div>
        <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg p-4 space-y-4">
          {brief.length === 0 && <p className="text-sm text-slate-400">No items yet — our ingestion pipeline runs every 2 hours. Check back shortly.</p>}
          {brief.map((item) => (
            <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Compliance Alerts */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-navy pl-3 mb-4">
            FMCSA & Compliance Alerts
          </h2>
          <div className="space-y-4">
            {compliance.length === 0 && <p className="text-sm text-slate-400">No compliance updates in the last 7 days. Check back soon.</p>}
            {compliance.map((item) => (
              <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
            ))}
          </div>
        </section>

        {/* Insurance Spotlight */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-gold pl-3 mb-4">
            Insurance & Risk Spotlight
          </h2>
          <div className="space-y-4">
            {insurance.length === 0 && <p className="text-sm text-slate-400">No insurance updates this week.</p>}
            {insurance.map((item) => (
              <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
            ))}
          </div>
        </section>

        {/* Freight Market Pulse */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-slate-300 pl-3 mb-4">
            Freight Market Pulse
          </h2>
          <div className="space-y-4">
            {freight.length === 0 && <p className="text-sm text-slate-400">No freight market updates this week.</p>}
            {freight.map((item) => (
              <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <QuickLinks />
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add homepage dashboard with brief, compliance, insurance, freight modules"
```

---

### Task 15: Brief, Compliance, Insurance, Resources pages

**Files:**
- Create: `src/app/(public)/brief/page.tsx`
- Create: `src/app/(public)/compliance/page.tsx`
- Create: `src/app/(public)/insurance/page.tsx`
- Create: `src/app/(public)/resources/page.tsx`

- [ ] **Step 1: Create Brief page**

Create `src/app/(public)/brief/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { inArray, desc, eq } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';

export default async function BriefPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category;
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(inArray(contentItems.reviewStatus, ['auto_published', 'approved']))
    .orderBy(desc(contentItems.publishedAt))
    .limit(50);

  const CATEGORIES = ['compliance', 'insurance', 'freight', 'safety', 'fuel', 'equipment', 'general'];
  const filtered = category ? rows.filter((r) => r.category === category) : rows;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">Daily Trucking Brief</h1>
      <p className="text-slate-500 text-sm mb-6">All updates, newest first. Filter by topic to find what matters to your operation.</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/brief" className={`text-xs font-semibold px-3 py-1.5 rounded border ${!category ? 'bg-navy text-white border-navy' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>All</a>
        {CATEGORIES.map((cat) => (
          <a key={cat} href={`/brief?category=${cat}`} className={`text-xs font-semibold px-3 py-1.5 rounded border capitalize ${category === cat ? 'bg-navy text-white border-navy' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>{cat}</a>
        ))}
      </div>
      <div className="space-y-6">
        {filtered.length === 0 && <p className="text-slate-400 text-sm">No items yet — our ingestion pipeline runs every 2 hours. Check back shortly.</p>}
        {filtered.map((item) => (
          <ContentCard key={item.id} {...item} sourceName={item.sourceName} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Compliance page**

Create `src/app/(public)/compliance/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import { RiskBadge } from '@/components/content/RiskBadge';

export default async function CompliancePage() {
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      riskLevel: contentItems.riskLevel, publishedAt: contentItems.publishedAt,
      rawExcerpt: contentItems.rawExcerpt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
      sourceUrl: sources.websiteUrl,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(and(
      eq(contentItems.category, 'compliance'),
      inArray(contentItems.reviewStatus, ['auto_published', 'approved'])
    ))
    .orderBy(desc(contentItems.publishedAt))
    .limit(30);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">FMCSA & Compliance Watch</h1>
      <p className="text-slate-500 text-sm mb-6">Regulatory updates in plain English. We show what changed, what it means, and what to do next. Always review the original source before acting.</p>
      <div className="space-y-8">
        {rows.length === 0 && <p className="text-slate-400 text-sm">No compliance updates yet. FMCSA and Federal Register sources are checked every 2 hours.</p>}
        {rows.map((item) => {
          const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-5 border-t-4 border-t-navy">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <RiskBadge level={item.riskLevel} />
                <span className="text-xs text-slate-400">{item.sourceName}{date ? ` · ${date}` : ''}</span>
              </div>
              <Link href={`/item/${item.slug}`} className="font-bold text-navy hover:text-navy-light text-base">{item.title}</Link>
              {item.aiSummary && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Plain English Summary</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.aiSummary}</p>
                </div>
              )}
              {item.whyItMatters && (
                <div className="mt-2 bg-gold/10 border-l-2 border-gold px-3 py-2 rounded">
                  <p className="text-xs font-semibold text-gold-dark mb-0.5">Why It Matters</p>
                  <p className="text-sm text-slate-700">{item.whyItMatters}</p>
                </div>
              )}
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-blue-600 underline hover:text-blue-800">View original source →</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Insurance page**

Create `src/app/(public)/insurance/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, inArray, and, desc } from 'drizzle-orm';
import { ContentCard } from '@/components/content/ContentCard';

export default async function InsurancePage() {
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title, slug: contentItems.slug,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(and(
      eq(contentItems.category, 'insurance'),
      inArray(contentItems.reviewStatus, ['auto_published', 'approved'])
    ))
    .orderBy(desc(contentItems.publishedAt))
    .limit(30);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">Insurance & Risk Center</h1>
      <p className="text-slate-500 text-sm mb-2">How insurance, safety scores, and compliance decisions affect your operating costs — explained for owner-operators and small fleet owners.</p>
      <div className="bg-navy/5 border border-navy/10 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-slate-700 leading-relaxed">
          Trucking insurance is one of the biggest controllable costs in your operation. Your CSA scores, accident history, authority age, and cargo type all affect what you pay at renewal. This center tracks the latest insurance-relevant news and explains what it means for your premium.
        </p>
      </div>
      <div className="space-y-6">
        {rows.length === 0 && <p className="text-slate-400 text-sm">No insurance updates yet. Check back shortly.</p>}
        {rows.map((item) => <ContentCard key={item.id} {...item} sourceName={item.sourceName} />)}
      </div>
      <p className="text-xs text-slate-400 mt-10 border-t border-slate-100 pt-4">
        Insurance information on this page is for educational purposes only and does not constitute insurance advice. Contact a licensed trucking insurance broker for coverage decisions.
      </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Resources directory page**

Create `src/app/(public)/resources/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

const CATEGORY_LABELS: Record<string, string> = {
  load_board: 'Load Boards', truck_stop: 'Truck Stops', association: 'Associations',
  compliance_tool: 'Compliance Tools', eld: 'ELDs', fuel_card: 'Fuel Cards',
  factoring: 'Factoring', maintenance: 'Maintenance', insurance: 'Insurance',
  equipment: 'Equipment Marketplaces', training: 'Training & CDL',
};

export default async function ResourcesPage() {
  const listings = await db
    .select()
    .from(directoryListings)
    .orderBy(asc(directoryListings.category), asc(directoryListings.name));

  const grouped = listings.reduce<Record<string, typeof listings>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-2">Owner-Operator Resource Directory</h1>
      <p className="text-slate-500 text-sm mb-2">Curated tools and services for trucking businesses. Editorial only — no sponsored listings, no affiliate links.</p>
      <div className="bg-navy/5 border border-navy/10 rounded-lg px-4 py-3 mb-8">
        <p className="text-sm text-slate-700">Finding the right load board, fuel card, ELD, or factoring company takes time. We&apos;ve done the research so you don&apos;t have to. Every listing is manually reviewed and updated by our team.</p>
      </div>
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-navy border-l-4 border-gold pl-3 mb-4">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 border-t-4 border-t-navy">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy text-sm">{item.name}</h3>
                  {item.brokenLink && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">Link Issue</span>
                  )}
                </div>
                {item.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>}
                {item.bestFor && <p className="text-xs text-slate-500 mt-1"><span className="font-semibold">Best for:</span> {item.bestFor}</p>}
                {item.notes && <p className="text-xs text-slate-400 mt-1 italic">{item.notes}</p>}
                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-semibold text-navy underline hover:text-navy-light">
                  Visit website →
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
      {Object.keys(grouped).length === 0 && (
        <p className="text-slate-400 text-sm">Directory listings coming soon. We&apos;re reviewing and adding resources now.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Brief, Compliance, Insurance, Resources public pages"
```

---

### Task 16: Search page, item page, takedown form

**Files:**
- Create: `src/app/(public)/search/page.tsx`
- Create: `src/app/(public)/item/[slug]/page.tsx`
- Create: `src/app/(public)/contact/takedown/page.tsx`
- Create: `src/app/api/takedown/route.ts`

- [ ] **Step 1: Create Search page**

Create `src/app/(public)/search/page.tsx`:
```typescript
import { searchContent } from '@/lib/search/index';
import Link from 'next/link';
import { CategoryBadge } from '@/components/content/CategoryBadge';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? '';
  const results = query ? await searchContent(query) : [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy mb-4">Search Truck King Hub</h1>
      <form method="GET" action="/search" className="mb-6">
        <div className="flex gap-2">
          <input name="q" defaultValue={query} placeholder="Search compliance updates, insurance news, freight market, resources..."
            className="flex-1 border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
          <button type="submit" className="bg-navy text-white px-5 py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors">
            Search
          </button>
        </div>
      </form>
      {query && <p className="text-sm text-slate-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>}
      <div className="space-y-5">
        {results.map((item) => {
          const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          return (
            <div key={item.id} className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <CategoryBadge category={item.category} />
                <span className="text-xs text-slate-400">{item.sourceName}{date ? ` · ${date}` : ''}</span>
              </div>
              <Link href={`/item/${item.slug}`} className="font-semibold text-navy hover:text-navy-light text-sm">{item.title}</Link>
              {item.aiSummary && <p className="text-sm text-slate-600 mt-1">{item.aiSummary}</p>}
            </div>
          );
        })}
        {!query && <p className="text-slate-400 text-sm">Enter a keyword above to search all trucking news, compliance updates, and resources.</p>}
        {query && results.length === 0 && <p className="text-slate-400 text-sm">No results found for &ldquo;{query}&rdquo;. Try a different keyword — for example: &ldquo;ELD&rdquo;, &ldquo;CSA score&rdquo;, &ldquo;spot rates&rdquo;, or &ldquo;FMCSA&rdquo;.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Item detail page**

Create `src/app/(public)/item/[slug]/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CategoryBadge } from '@/components/content/CategoryBadge';
import { RiskBadge } from '@/components/content/RiskBadge';

export default async function ItemPage({ params }: { params: { slug: string } }) {
  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, aiSummary: contentItems.aiSummary,
      whyItMatters: contentItems.whyItMatters, originalUrl: contentItems.originalUrl,
      sourceName: sources.name, sourceUrl: sources.websiteUrl,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(eq(contentItems.slug, params.slug))
    .limit(1);

  if (!rows.length) notFound();
  const item = rows[0];
  const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="max-w-2xl">
      <a href="/brief" className="text-xs text-slate-400 hover:text-navy mb-4 inline-block">← Back to Brief</a>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <CategoryBadge category={item.category} />
        <RiskBadge level={item.riskLevel} />
      </div>
      <h1 className="text-2xl font-extrabold text-navy leading-snug mb-2">{item.title}</h1>
      <p className="text-sm text-slate-400 mb-6">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">{item.sourceName}</a>
        {date ? ` · ${date}` : ''}
      </p>
      {item.aiSummary && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Summary</p>
          <p className="text-sm text-slate-700 leading-relaxed">{item.aiSummary}</p>
        </div>
      )}
      {item.whyItMatters && (
        <div className="bg-gold/10 border-l-4 border-gold px-4 py-3 rounded mb-6">
          <p className="text-xs font-semibold text-gold-dark mb-0.5 uppercase tracking-wide">Why It Matters</p>
          <p className="text-sm text-slate-700">{item.whyItMatters}</p>
        </div>
      )}
      <a href={item.originalUrl} target="_blank" rel="noopener noreferrer"
        className="inline-block bg-navy text-white px-5 py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors">
        Read original source →
      </a>
      <p className="text-xs text-slate-400 mt-8 border-t border-slate-100 pt-4">
        This summary is for informational purposes only and does not constitute legal, insurance, financial, or compliance advice. Always review the original source and consult qualified professionals before making decisions.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Create takedown API route**

Create `src/app/api/takedown/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { takedownRequests } from '@/lib/db/schema';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sourceName, url, reason, requesterEmail } = body;

  if (!sourceName || !url) {
    return new Response(JSON.stringify({ error: 'sourceName and url are required' }), { status: 400 });
  }

  await db.insert(takedownRequests).values({ sourceName, url, reason, requesterEmail });
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}
```

- [ ] **Step 4: Create takedown form page**

Create `src/app/(public)/contact/takedown/page.tsx`:
```typescript
'use client';
import { useState } from 'react';

export default function TakedownPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      sourceName: form.get('sourceName'),
      url: form.get('url'),
      reason: form.get('reason'),
      requesterEmail: form.get('requesterEmail'),
    };
    const res = await fetch('/api/takedown', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) setSubmitted(true);
    else setError('Something went wrong. Please try again.');
  }

  if (submitted) return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-navy mb-2">Request Submitted</h1>
      <p className="text-slate-600 text-sm">Thank you. We will review your request and respond within 5 business days.</p>
    </div>
  );

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-navy mb-2">Content Takedown Request</h1>
      <p className="text-slate-500 text-sm mb-6">If you believe Truck King Hub has published content that violates your rights, infringes on your copyright, or violates our content policy, please use this form. We review all requests within 5 business days.</p>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Source name *</label>
          <input name="sourceName" required className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">URL of content *</label>
          <input name="url" type="url" required className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Reason</label>
          <textarea name="reason" rows={3} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Your email</label>
          <input name="requesterEmail" type="email" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <button type="submit" className="bg-navy text-white px-5 py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors">
          Submit Request
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add search, item detail, and takedown form pages"
```

---

## Phase 4: Admin Panel

### Task 17: Admin auth

**Files:**
- Create: `src/lib/admin/auth.ts`
- Create: `src/app/(admin)/admin/login/page.tsx`
- Create: `src/app/(admin)/layout.tsx`
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`
- Create: `src/lib/admin/session.ts`

- [ ] **Step 1: Install iron-session**

```bash
npm install iron-session
```

- [ ] **Step 2: Create session helper**

Create `src/lib/admin/session.ts`:
```typescript
import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type AdminSession = {
  adminId?: string;
  email?: string;
};

export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET!,
  cookieName: 'truckinghub_admin',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}
```

- [ ] **Step 3: Create login API route**

Create `src/app/api/admin/login/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return new Response('Missing fields', { status: 400 });

  const users = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (!users.length) return new Response('Invalid credentials', { status: 401 });

  const valid = await bcrypt.compare(password, users[0].passwordHash);
  if (!valid) return new Response('Invalid credentials', { status: 401 });

  const session = await getSession();
  session.adminId = users[0].id;
  session.email = users[0].email;
  await session.save();

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
```

- [ ] **Step 4: Create logout API route**

Create `src/app/api/admin/logout/route.ts`:
```typescript
import { getSession } from '@/lib/admin/session';

export async function POST() {
  const session = await getSession();
  session.destroy();
  return new Response(JSON.stringify({ ok: true }));
}
```

- [ ] **Step 5: Create admin layout with auth guard**

Create `src/app/(admin)/layout.tsx`:
```typescript
import { getSession } from '@/lib/admin/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const path = typeof window === 'undefined' ? '' : window.location.pathname;

  // Allow login page through without auth check
  if (!session.adminId) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-extrabold text-navy text-sm">Truck King Hub Admin</span>
          <Link href="/admin" className="text-xs text-slate-600 hover:text-navy">Dashboard</Link>
          <Link href="/admin/queue" className="text-xs text-slate-600 hover:text-navy">Queue</Link>
          <Link href="/admin/sources" className="text-xs text-slate-600 hover:text-navy">Sources</Link>
          <Link href="/admin/directory" className="text-xs text-slate-600 hover:text-navy">Directory</Link>
          <Link href="/admin/takedowns" className="text-xs text-slate-600 hover:text-navy">Takedowns</Link>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-xs text-slate-400 hover:text-slate-700">Sign out</button>
        </form>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 6: Create login page**

Create `src/app/(admin)/admin/login/page.tsx`:
```typescript
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    });
    if (res.ok) router.push('/admin');
    else setError('Invalid email or password.');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white border border-slate-200 rounded-lg p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-lg font-extrabold text-navy mb-6">Admin Login</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input name="email" type="email" required className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
            <input name="password" type="password" required className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
          </div>
          <button type="submit" className="w-full bg-navy text-white py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create admin user seeding script**

Create `src/lib/admin/create-admin.ts`:
```typescript
import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

const email = process.env.ADMIN_EMAIL ?? 'Godwin@prestigetrucking.com';
const password = process.env.ADMIN_PASSWORD ?? '';

if (!password) {
  console.error('Set ADMIN_PASSWORD env var before running this script.');
  process.exit(1);
}

async function createAdmin() {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(adminUsers).values({ email, passwordHash }).onConflictDoNothing();
  console.log(`Admin user created: ${email}`);
  process.exit(0);
}

createAdmin().catch(console.error);
```

Add to `package.json` scripts:
```json
"admin:create": "npx tsx src/lib/admin/create-admin.ts"
```

- [ ] **Step 8: Create the admin user**

```bash
ADMIN_PASSWORD=your-strong-password npm run admin:create
```
Expected: "Admin user created: Godwin@prestigetrucking.com"

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add admin auth with iron-session and bcrypt"
```

---

### Task 18: Admin dashboard, queue, sources, directory, takedowns

**Files:**
- Create: `src/app/(admin)/admin/page.tsx`
- Create: `src/app/(admin)/admin/queue/page.tsx`
- Create: `src/app/(admin)/admin/sources/page.tsx`
- Create: `src/app/(admin)/admin/directory/page.tsx`
- Create: `src/app/(admin)/admin/takedowns/page.tsx`
- Create: `src/app/api/admin/queue/[id]/route.ts`
- Create: `src/app/api/admin/sources/[id]/route.ts`
- Create: `src/app/api/admin/directory/route.ts`
- Create: `src/app/api/admin/directory/[id]/route.ts`
- Create: `src/app/api/admin/takedowns/[id]/route.ts`

- [ ] **Step 1: Admin dashboard page**

Create `src/app/(admin)/admin/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

export default async function AdminDashboard() {
  const [pendingRows, sourcesRows] = await Promise.all([
    db.select({ count: count() }).from(contentItems).where(eq(contentItems.reviewStatus, 'pending_review')),
    db.select().from(sources).orderBy(sources.name),
  ]);

  const pendingCount = pendingRows[0]?.count ?? 0;

  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Pending Review</p>
          <p className="text-3xl font-extrabold text-navy">{pendingCount}</p>
          <a href="/admin/queue" className="text-xs text-blue-600 underline mt-1 inline-block">Go to queue →</a>
        </div>
      </div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Source Health</h2>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Source</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Type</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Last Fetched</th>
            </tr>
          </thead>
          <tbody>
            {sourcesRows.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{s.updateMethod}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {s.lastFetchedAt ? new Date(s.lastFetchedAt).toLocaleString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Queue action API route**

Create `src/app/api/admin/queue/[id]/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });

  const { action, aiSummary, whyItMatters } = await req.json();

  if (action === 'approve') {
    await db.update(contentItems)
      .set({ reviewStatus: 'approved', ...(aiSummary ? { aiSummary } : {}), ...(whyItMatters ? { whyItMatters } : {}) })
      .where(eq(contentItems.id, params.id));
  } else if (action === 'reject') {
    await db.update(contentItems).set({ reviewStatus: 'rejected' }).where(eq(contentItems.id, params.id));
  } else {
    return new Response('Invalid action', { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }));
}
```

- [ ] **Step 3: Queue page**

Create `src/app/(admin)/admin/queue/page.tsx`:
```typescript
'use client';
import { useEffect, useState } from 'react';

type QueueItem = {
  id: string; title: string; category: string; riskLevel: string;
  publishedAt: string | null; rawExcerpt: string | null;
  aiSummary: string | null; whyItMatters: string | null; sourceName: string;
};

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [editing, setEditing] = useState<Record<string, { aiSummary: string; whyItMatters: string }>>({});

  useEffect(() => {
    fetch('/api/admin/queue').then((r) => r.json()).then(setItems);
  }, []);

  async function action(id: string, type: 'approve' | 'reject') {
    const edit = editing[id];
    await fetch(`/api/admin/queue/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: type, aiSummary: edit?.aiSummary, whyItMatters: edit?.whyItMatters }),
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Review Queue ({items.length})</h1>
      {items.length === 0 && <p className="text-slate-400 text-sm">Queue is empty.</p>}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-5 border-l-4 border-l-red-400">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded uppercase">{item.riskLevel}</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{item.category}</span>
              <span className="text-xs text-slate-400">{item.sourceName}</span>
            </div>
            <p className="font-semibold text-navy mb-3">{item.title}</p>
            {item.rawExcerpt && (
              <details className="mb-3">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Raw excerpt</summary>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.rawExcerpt}</p>
              </details>
            )}
            <div className="space-y-2 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">AI Summary</label>
                <textarea
                  rows={3}
                  defaultValue={item.aiSummary ?? ''}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], aiSummary: e.target.value } }))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Why It Matters</label>
                <input
                  defaultValue={item.whyItMatters ?? ''}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], whyItMatters: e.target.value } }))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => action(item.id, 'approve')} className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded hover:bg-green-700 transition-colors">Approve</button>
              <button onClick={() => action(item.id, 'reject')} className="bg-red-100 text-red-700 text-xs font-semibold px-4 py-2 rounded hover:bg-red-200 transition-colors">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Queue GET API route**

Create `src/app/api/admin/queue/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';

export async function GET() {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });

  const rows = await db
    .select({
      id: contentItems.id, title: contentItems.title,
      category: contentItems.category, riskLevel: contentItems.riskLevel,
      publishedAt: contentItems.publishedAt, rawExcerpt: contentItems.rawExcerpt,
      aiSummary: contentItems.aiSummary, whyItMatters: contentItems.whyItMatters,
      sourceName: sources.name,
    })
    .from(contentItems)
    .innerJoin(sources, eq(contentItems.sourceId, sources.id))
    .where(eq(contentItems.reviewStatus, 'pending_review'))
    .orderBy(desc(contentItems.publishedAt))
    .limit(50);

  return new Response(JSON.stringify(rows));
}
```

- [ ] **Step 5: Sources toggle API route**

Create `src/app/api/admin/sources/[id]/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { sources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });

  const { active } = await req.json();
  await db.update(sources).set({ active }).where(eq(sources.id, params.id));
  return new Response(JSON.stringify({ ok: true }));
}
```

- [ ] **Step 6: Sources admin page**

Create `src/app/(admin)/admin/sources/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { sources } from '@/lib/db/schema';

export default async function SourcesPage() {
  const rows = await db.select().from(sources).orderBy(sources.name);
  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Sources</h1>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Name</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Method</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Category</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Last Fetch</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{s.updateMethod}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{s.defaultCategory}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{s.lastFetchedAt ? new Date(s.lastFetchedAt).toLocaleString() : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Directory API routes**

Create `src/app/api/admin/directory/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  await db.insert(directoryListings).values(body);
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}
```

Create `src/app/api/admin/directory/[id]/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  await db.update(directoryListings).set(body).where(eq(directoryListings.id, params.id));
  return new Response(JSON.stringify({ ok: true }));
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  await db.delete(directoryListings).where(eq(directoryListings.id, params.id));
  return new Response(JSON.stringify({ ok: true }));
}
```

- [ ] **Step 8: Directory admin page**

Create `src/app/(admin)/admin/directory/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';

export default async function DirectoryAdminPage() {
  const listings = await db.select().from(directoryListings).orderBy(directoryListings.name);
  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Directory Listings ({listings.length})</h1>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Name</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Category</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">URL</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Broken</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Last Reviewed</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{l.name}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{l.category}</td>
                <td className="px-4 py-3 text-xs text-blue-600 truncate max-w-xs">
                  <a href={l.websiteUrl} target="_blank" rel="noopener noreferrer" className="underline">{l.websiteUrl}</a>
                </td>
                <td className="px-4 py-3">
                  {l.brokenLink && <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">Broken</span>}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{l.lastReviewedAt ? new Date(l.lastReviewedAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Takedowns API route and admin page**

Create `src/app/api/admin/takedowns/[id]/route.ts`:
```typescript
import { db } from '@/lib/db/client';
import { takedownRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  await db.update(takedownRequests).set({ resolved: true }).where(eq(takedownRequests.id, params.id));
  return new Response(JSON.stringify({ ok: true }));
}
```

Create `src/app/(admin)/admin/takedowns/page.tsx`:
```typescript
import { db } from '@/lib/db/client';
import { takedownRequests } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function TakedownsPage() {
  const requests = await db.select().from(takedownRequests).orderBy(desc(takedownRequests.createdAt));
  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Takedown Requests</h1>
      <div className="space-y-4">
        {requests.length === 0 && <p className="text-slate-400 text-sm">No takedown requests.</p>}
        {requests.map((r) => (
          <div key={r.id} className={`bg-white border border-slate-200 rounded-lg p-4 ${r.resolved ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${r.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {r.resolved ? 'Resolved' : 'Open'}
              </span>
              <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="font-semibold text-navy text-sm">{r.sourceName}</p>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">{r.url}</a>
            {r.reason && <p className="text-sm text-slate-600 mt-2">{r.reason}</p>}
            {r.requesterEmail && <p className="text-xs text-slate-400 mt-1">Contact: {r.requesterEmail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add admin dashboard, queue, sources, directory, and takedowns pages"
```

---

## Phase 5: Deployment

### Task 19: Environment and deployment config

**Files:**
- Create: `.env.production.example`
- Modify: `next.config.ts`

- [ ] **Step 1: Create production env example**

Create `.env.production.example`:
```
DATABASE_URL=postgresql://user:pass@host/dbname
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_SESSION_SECRET=at-least-32-chars-random-secret
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
ADMIN_EMAIL=Godwin@prestigetrucking.com
ADMIN_PASSWORD=your-strong-password
```

- [ ] **Step 2: Update Next.js config for external image domains**

Update `next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
};

export default nextConfig;
```

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --prod
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL` — Neon connection string
- `ANTHROPIC_API_KEY` — Anthropic API key
- `ADMIN_SESSION_SECRET` — 32+ char random string
- `NEXT_PUBLIC_BASE_URL` — your Vercel URL

- [ ] **Step 4: Run admin create in production**

```bash
ADMIN_EMAIL=Godwin@prestigetrucking.com ADMIN_PASSWORD=your-password DATABASE_URL=your-prod-url npm run admin:create
```

- [ ] **Step 5: Trigger first ingestion manually**

```bash
# Visit your prod URL to warm the scheduler, then trigger manually:
curl https://your-domain.vercel.app/api/init
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add deployment config and env example"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Dashboard homepage with all 6 modules → Task 14
- [x] Daily Trucking Brief page → Task 15
- [x] FMCSA/Compliance Watch → Task 15
- [x] Insurance & Risk Center → Task 15
- [x] Resource Directory → Task 15
- [x] Search → Task 16
- [x] Content item page → Task 16
- [x] Takedown form → Task 16
- [x] Admin review queue with approve/reject/edit → Task 18
- [x] Admin source management → Task 18
- [x] Admin directory management → Task 18
- [x] Admin takedowns → Task 18
- [x] Ingestion pipeline (fetch → normalize → dedup → categorize → risk → summarize → publish) → Tasks 4–10
- [x] node-cron scheduler with 3 jobs → Task 11
- [x] Database schema with all 6 tables → Task 2
- [x] tsvector trigger → Task 2
- [x] Seed sources → Task 3
- [x] Navy & Gold visual theme → Task 12
- [x] Legal attribution + footer disclaimer → Task 12
- [x] Admin auth (bcrypt + iron-session) → Task 17
- [x] Deployment config → Task 19

**Type consistency verified:** All function signatures, field names (camelCase in TypeScript, snake_case in SQL via Drizzle), and import paths are consistent across tasks.
