import { pgTable, uuid, text, boolean, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  author: text('author').notNull().default('Truck King Hub'),
  contentType: text('content_type').notNull().default('blog'),
  category: text('category').notNull(), // 'news' | 'compliance' | 'freight' | 'equipment' | 'insurance' | 'general' | 'lifestyle'
  excerpt: text('excerpt').notNull(),
  body: text('body').notNull(),
  coverImage: text('cover_image'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  focusKeyword: text('focus_keyword'),
  canonicalUrl: text('canonical_url'),
  openGraphTitle: text('open_graph_title'),
  openGraphDescription: text('open_graph_description'),
  schemaMarkup: text('schema_markup'),
  tags: text('tags').array().default([]).notNull(),
  featured: boolean('featured').default(false).notNull(),
  status: text('status').notNull().default('draft'), // 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt: timestamp('published_at', { withTimezone: true }),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
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

export const cmsCategories = pgTable('cms_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  contentType: text('content_type').notNull().default('blog'),
  color: text('color'),
  sortOrder: integer('sort_order').default(0).notNull(),
  featured: boolean('featured').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsTags = pgTable('cms_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  usageCount: integer('usage_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsMedia = pgTable('cms_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  altText: text('alt_text'),
  mediaType: text('media_type').notNull(),
  fileSizeKb: integer('file_size_kb').default(0).notNull(),
  tags: text('tags').array().default([]).notNull(),
  uploadedBy: text('uploaded_by').notNull().default('Truck King Hub'),
  status: text('status').notNull().default('ready'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsRoles = pgTable('cms_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description'),
  permissions: text('permissions').array().default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsUsers = pgTable('cms_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  role: text('role').notNull(),
  status: text('status').notNull().default('active'),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsComments = pgTable('cms_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id'),
  authorName: text('author_name').notNull(),
  body: text('body').notNull(),
  status: text('status').notNull().default('pending'),
  flagged: boolean('flagged').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsAds = pgTable('cms_ads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  placement: text('placement').notNull(),
  sponsor: text('sponsor').notNull(),
  status: text('status').notNull().default('active'),
  impressions: integer('impressions').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  dailyBudget: integer('daily_budget').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsAnalyticsSnapshots = pgTable('cms_analytics_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  pageViews: integer('page_views').default(0).notNull(),
  sessions: integer('sessions').default(0).notNull(),
  bounceRate: integer('bounce_rate').default(0).notNull(),
  trafficSources: jsonb('traffic_sources').notNull(),
  deviceBreakdown: jsonb('device_breakdown').notNull(),
  topContent: jsonb('top_content').notNull(),
});

export const cmsAuditLogs = pgTable('cms_audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetName: text('target_name').notNull(),
  details: jsonb('details').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsNotifications = pgTable('cms_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  type: text('type').notNull().default('info'),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cmsScheduledItems = pgTable('cms_scheduled_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  contentType: text('content_type').notNull(),
  publishAt: timestamp('publish_at', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('scheduled'),
  owner: text('owner').notNull(),
  priority: text('priority').notNull().default('normal'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
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
