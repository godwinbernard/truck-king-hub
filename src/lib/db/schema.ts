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
