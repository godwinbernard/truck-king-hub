# WordPress-Style CMS Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Truck King Hub into a WordPress-style admin backend where editors can create, edit, schedule, and optimize articles and blogs with SEO metadata, tags, slugs, media, and permissions from one place.

**Architecture:** Build on the existing Next.js App Router admin shell, `articles` table, and admin API routes already in the repo. Keep content in PostgreSQL via Drizzle, use route handlers for CRUD, and keep the editor client-side so writers get fast form updates, slug generation, preview, and publish controls without leaving the CMS.

**Tech Stack:** Next.js 16 App Router, React client components, Drizzle ORM, PostgreSQL, iron-session auth, Jest, ESLint

---

## Phase 1: Lock the article contract

### Task 1: Centralize article validation and slug rules

**Files:**
- Create: `src/lib/admin/articles.ts`
- Create: `src/lib/admin/__tests__/articles.test.ts`
- Modify: `src/app/api/admin/articles/route.ts`
- Modify: `src/app/api/admin/articles/[id]/route.ts`
- Modify: `src/lib/db/schema.ts`
- Modify: `src/lib/db/migrate.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/admin/__tests__/articles.test.ts` with tests for:
```ts
describe('article input helpers', () => {
  it('slugifies titles into URL-safe slugs');
  it('keeps an explicit slug when the editor edits it manually');
  it('normalizes tags by trimming, deduping, and dropping empties');
  it('rejects meta titles longer than 60 characters');
  it('rejects meta descriptions longer than 160 characters');
  it('marks scheduled posts as scheduled only when publish time is in the future');
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/articles.test.ts
```
Expected: failure because the helper module does not exist yet.

- [ ] **Step 3: Implement the helper module**

Create `src/lib/admin/articles.ts` with concrete helpers that the API can reuse:
- `slugifyTitle(title: string): string`
- `normalizeTags(tags: string[]): string[]`
- `validateSeoFields(input: { metaTitle?: string; metaDescription?: string }): string[]`
- `normalizeArticleStatus(status: string, scheduledAt: string | null): 'draft' | 'published' | 'scheduled' | 'archived'`
- `buildArticlePayload(body: unknown): ArticlePayload`

Define `ArticlePayload` in the same file so the route handlers and editor share one exact shape:
```ts
type ArticlePayload = {
  title: string;
  slug: string;
  author: string;
  contentType: 'blog' | 'news' | 'article' | 'review' | 'sponsored';
  category: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  schemaMarkup: string | null;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledAt: string | null;
};
```

Keep these rules explicit:
- slug is lowercase, URL-safe, and unique per article
- tags are trimmed and deduped before insert/update
- meta title max length is 60 characters
- meta description max length is 160 characters
- `publishedAt` is set only when status becomes `published`
- `scheduledAt` is required for `scheduled` status and cleared for `published`

- [ ] **Step 4: Wire the helpers into the API**

Update both article routes so they call the helper functions before any database write:
- `POST /api/admin/articles`
- `PUT /api/admin/articles/[id]`

Keep the API behavior explicit:
- return `400` for missing title, slug, category, excerpt, or body
- return `400` for invalid SEO lengths
- return `409` if slug is already taken
- preserve `publishedAt` when archiving an already-published article
- support duplicate creation through `POST /api/admin/articles/[id]` with `{ action: 'duplicate' }`

- [ ] **Step 5: Run the tests again**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/articles.test.ts
```
Expected: PASS.

- [ ] **Step 6: Push the schema update**

Run:
```bash
npm run db:push
```
Expected: `articles` and CMS tables match the schema in `src/lib/db/schema.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin/articles.ts src/lib/admin/__tests__/articles.test.ts src/app/api/admin/articles/route.ts src/app/api/admin/articles/[id]/route.ts src/lib/db/schema.ts src/lib/db/migrate.ts
git commit -m "feat: centralize article validation and SEO rules"
```

---

## Phase 2: Turn the editor into a WordPress-style workspace

### Task 2: Upgrade the article editor UI

**Files:**
- Modify: `src/components/admin/ArticleEditor.tsx`
- Create: `src/components/admin/RichTextToolbar.tsx`
- Create: `src/components/admin/SeoSidebar.tsx`
- Create: `src/components/admin/PublishSidebar.tsx`
- Create: `src/components/admin/TagPicker.tsx`
- Create: `src/components/admin/article-editor-helpers.ts`
- Create: `src/components/admin/__tests__/article-editor-helpers.test.ts`
- Modify: `src/app/(admin)/admin/articles/new/page.tsx`
- Modify: `src/app/(admin)/admin/articles/[id]/page.tsx`

- [ ] **Step 1: Write the failing UI contract test**

Create `src/components/admin/__tests__/article-editor-helpers.test.ts` with tests for the pure helpers used by the editor:
```ts
describe('editor field mapping', () => {
  it('derives an initial slug from a new title');
  it('keeps a manually edited slug unchanged');
  it('serializes tag chips into the API payload format');
  it('blocks publish until title, slug, category, excerpt, and body are present');
});
```

- [ ] **Step 2: Run the test and confirm the failure**

Run:
```bash
npm test -- --runInBand src/components/admin/__tests__/article-editor-helpers.test.ts
```
Expected: failure until the helper exists.

- [ ] **Step 3: Split the editor into clear regions**

Keep the existing article editor page, but restructure the UI into four panels:
- **Main editor:** title, slug, author, content type, category, excerpt, and body
- **SEO sidebar:** meta title, meta description, focus keyword, canonical URL, open graph title/description, schema markup
- **Publish sidebar:** draft/publish/schedule/archive, featured toggle, scheduled date/time
- **Tag picker:** reusable tags with quick add/remove and dedupe behavior

Store article body as Markdown for now so the repo keeps a single content format. Add toolbar buttons that insert Markdown for:
- headings
- bold/italic
- quotes
- bullet and numbered lists
- links
- tables
- image embeds
- call-to-action buttons

- [ ] **Step 4: Wire the editor to API payloads**

Update the save flow so the editor sends one normalized payload shape to both create and update routes:
- `title`
- `slug`
- `author`
- `contentType`
- `category`
- `excerpt`
- `body`
- `coverImage`
- `metaTitle`
- `metaDescription`
- `focusKeyword`
- `canonicalUrl`
- `openGraphTitle`
- `openGraphDescription`
- `schemaMarkup`
- `tags`
- `featured`
- `status`
- `scheduledAt`

Make the publish actions explicit:
- **Save draft:** keeps status `draft`
- **Publish now:** sets status `published`
- **Schedule:** sets status `scheduled` and requires a future timestamp
- **Archive:** keeps the article in the CMS but removes it from public listings

- [ ] **Step 5: Run the local checks**

Run:
```bash
npm run lint
npm run build
```
Expected: no editor regressions and the admin article pages still compile.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/ArticleEditor.tsx src/components/admin/RichTextToolbar.tsx src/components/admin/SeoSidebar.tsx src/components/admin/PublishSidebar.tsx src/components/admin/TagPicker.tsx src/components/admin/article-editor-helpers.ts src/components/admin/__tests__/article-editor-helpers.test.ts src/app/(admin)/admin/articles/new/page.tsx src/app/(admin)/admin/articles/[id]/page.tsx
git commit -m "feat: split article editor into CMS panels"
```

---

## Phase 3: Add taxonomy, media, and SEO management

### Task 3: Build category, tag, and media admin screens

**Files:**
- Create: `src/app/(admin)/admin/categories/page.tsx`
- Create: `src/app/(admin)/admin/tags/page.tsx`
- Create: `src/app/(admin)/admin/media/page.tsx`
- Create: `src/app/api/admin/categories/route.ts`
- Create: `src/app/api/admin/categories/[id]/route.ts`
- Create: `src/app/api/admin/tags/route.ts`
- Create: `src/app/api/admin/tags/[id]/route.ts`
- Create: `src/app/api/admin/media/route.ts`
- Create: `src/lib/admin/taxonomy.ts`
- Create: `src/lib/admin/__tests__/taxonomy.test.ts`
- Modify: `src/lib/db/schema.ts`
- Modify: `src/lib/db/migrate.ts`

- [ ] **Step 1: Write the failing taxonomy tests**

Create `src/lib/admin/__tests__/taxonomy.test.ts` with tests for:
```ts
describe('taxonomy helpers', () => {
  it('slugifies category names');
  it('dedupes tags across articles');
  it('increments tag usage counts when tags are assigned');
  it('decrements tag usage counts when tags are removed');
  it('stores media alt text and tag metadata');
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/taxonomy.test.ts
```
Expected: failure because the taxonomy helpers do not exist yet.

- [ ] **Step 3: Add the taxonomy helpers and routes**

Implement CRUD for:
- categories with `name`, `slug`, `description`, `contentType`, `color`, `sortOrder`, `featured`
- tags with `name`, `slug`, `usageCount`
- media with `filename`, `url`, `altText`, `mediaType`, `fileSizeKb`, `tags`, `status`

Normalize the data before write:
- category slugs must be unique
- tag slugs must be unique
- media tags must dedupe and trim
- alt text should always be stored as plain text, not HTML

Add `cms_article_tags` so tags can be queried independently of the article’s raw tag array and usage counts can be derived without parsing article text.

- [ ] **Step 4: Wire the admin screens**

Each page should support:
- search
- filter by status or content type
- add/edit/delete
- inline counts for usage and visibility

The media page should support:
- upload URL import
- tag assignment
- alt text editing
- copy URL
- preview thumbnail

- [ ] **Step 5: Run the tests and build**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/taxonomy.test.ts
npm run lint
npm run build
```
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/(admin)/admin/categories/page.tsx src/app/(admin)/admin/tags/page.tsx src/app/(admin)/admin/media/page.tsx src/app/api/admin/categories/route.ts src/app/api/admin/categories/[id]/route.ts src/app/api/admin/tags/route.ts src/app/api/admin/tags/[id]/route.ts src/app/api/admin/media/route.ts src/lib/admin/taxonomy.ts src/lib/admin/__tests__/taxonomy.test.ts
git commit -m "feat: add taxonomy and media management"
```

---

## Phase 4: Enforce roles, approvals, and audit logging

### Task 4: Add permission gates and publishing audit trails

**Files:**
- Create: `src/lib/admin/permissions.ts`
- Create: `src/lib/admin/__tests__/permissions.test.ts`
- Modify: `src/lib/admin/session.ts`
- Modify: `src/app/(admin)/layout.tsx`
- Modify: `src/app/api/admin/articles/route.ts`
- Modify: `src/app/api/admin/articles/[id]/route.ts`
- Modify: `src/app/api/admin/categories/route.ts`
- Modify: `src/app/api/admin/tags/route.ts`
- Modify: `src/lib/db/migrate.ts`
- Modify: `src/lib/db/schema.ts`

- [ ] **Step 1: Write the failing permissions tests**

Create `src/lib/admin/__tests__/permissions.test.ts` with tests for:
```ts
describe('permission matrix', () => {
  it('lets Admin create, edit, publish, delete, and manage users');
  it('lets Editor edit and publish but not manage roles');
  it('lets Author create drafts but not publish without approval');
  it('lets SEO Manager edit SEO fields without changing the article body');
  it('lets Analyst read analytics but not change content');
  it('lets Advertiser manage ad placements only');
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/permissions.test.ts
```
Expected: failure until the matrix exists.

- [ ] **Step 3: Implement explicit permission checks**

Create a `can(role, action)` helper and use it in every admin route that changes data. Keep the matrix simple and explicit:
- Admin: all actions
- Editor: create/edit/publish/archive/delete content
- Author: create/edit own drafts, request publish
- SEO Manager: edit SEO fields and slugs, not publish or delete
- Analyst: read-only analytics
- Advertiser: manage ad placements and sponsored content only

Add audit log writes for:
- create
- edit
- publish
- schedule
- archive
- delete
- duplicate
- slug change
- SEO field change
- category/tag change

- [ ] **Step 4: Protect the admin shell**

Update the admin layout so unauthorized users cannot reach the backend views. The layout should redirect unauthenticated users to the login page and hide routes the current role cannot use.

- [ ] **Step 5: Run the tests and smoke-check the admin shell**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/permissions.test.ts
npm run lint
npm run build
```
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/permissions.ts src/lib/admin/__tests__/permissions.test.ts src/lib/admin/session.ts src/app/(admin)/layout.tsx src/app/api/admin/articles/route.ts src/app/api/admin/articles/[id]/route.ts src/app/api/admin/categories/route.ts src/app/api/admin/tags/route.ts src/lib/db/schema.ts src/lib/db/migrate.ts
git commit -m "feat: enforce CMS permissions and audit logs"
```

---

## Phase 5: Verify the CMS end to end

### Task 5: Connect the backend to the public article experience

**Files:**
- Modify: `src/app/(public)/article/[slug]/page.tsx`
- Modify: `src/app/(public)/brief/page.tsx`
- Modify: `src/app/(public)/search/page.tsx`
- Modify: `src/components/admin/CmsDashboard.tsx`
- Modify: `src/lib/admin/cms-dashboard.ts`
- Create: `src/lib/admin/__tests__/dashboard.test.ts`

- [ ] **Step 1: Write the failing dashboard tests**

Create `src/lib/admin/__tests__/dashboard.test.ts` with tests for:
```ts
describe('dashboard summary helpers', () => {
  it('counts drafts, scheduled items, published items, and archived items');
  it('returns top tags and top categories from article data');
  it('surfaces SEO completion counts from meta fields');
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/dashboard.test.ts
```
Expected: failure until the helper exists.

- [ ] **Step 3: Implement the dashboard helpers**

Update the CMS dashboard data layer so it can summarize:
- total posts
- drafts
- scheduled posts
- published posts
- comments awaiting moderation
- ad performance
- top categories
- top tags
- SEO completion rate

Use the same article fields the editor writes so the dashboard stays in sync with the backend.

- [ ] **Step 4: Make the public pages consume the CMS fields**

Ensure the article page uses:
- `metaTitle`
- `metaDescription`
- `canonicalUrl`
- `openGraphTitle`
- `openGraphDescription`
- `schemaMarkup`
- `tags`
- `contentType`

Ensure article listing/search pages respect:
- `status === 'published'`
- `featured`
- `category`
- `tags`
- `scheduledAt`

- [ ] **Step 5: Run the full verification pass**

Run:
```bash
npm test -- --runInBand src/lib/admin/__tests__/dashboard.test.ts
npm run lint
npm run build
```
Expected: all checks pass and the CMS and public article pages compile together.

- [ ] **Step 6: Commit**

```bash
git add src/app/(public)/article/[slug]/page.tsx src/app/(public)/brief/page.tsx src/app/(public)/search/page.tsx src/components/admin/CmsDashboard.tsx src/lib/admin/cms-dashboard.ts src/lib/admin/__tests__/dashboard.test.ts
git commit -m "feat: connect CMS backend to public article views"
```

---

## Self-Review Checklist

- [ ] Every article-related request is covered by a task: create, edit, publish, schedule, archive, duplicate, slug, meta title, meta description, tags, category, and content body.
- [ ] The plan uses the existing `articles` table and admin routes instead of inventing a new backend service.
- [ ] Each task names exact files, exact behaviors, and exact verification commands.
- [ ] No task relies on placeholders like “add validation later” or “write tests for the above.”
- [ ] The plan stays focused on the CMS backend and only touches public pages where they need to consume CMS metadata.
