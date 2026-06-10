import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('Running migration...');

  // Drop old RSS-based tables
  await sql`DROP TABLE IF EXISTS content_items CASCADE`;
  await sql`DROP TABLE IF EXISTS sources CASCADE`;
  await sql`DROP TABLE IF EXISTS topics CASCADE`;

  // Create or expand the articles table
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      author TEXT NOT NULL DEFAULT 'Truck King Hub',
      content_type TEXT NOT NULL DEFAULT 'blog',
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      cover_image TEXT,
      meta_title TEXT,
      meta_description TEXT,
      focus_keyword TEXT,
      canonical_url TEXT,
      open_graph_title TEXT,
      open_graph_description TEXT,
      schema_markup TEXT,
      tags TEXT[] NOT NULL DEFAULT '{}',
      featured BOOLEAN NOT NULL DEFAULT false,
      status TEXT NOT NULL DEFAULT 'draft',
      published_at TIMESTAMPTZ,
      scheduled_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'blog'`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS focus_keyword TEXT`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS canonical_url TEXT`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS open_graph_title TEXT`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS open_graph_description TEXT`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS schema_markup TEXT`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ`;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      content_type TEXT NOT NULL DEFAULT 'blog',
      color TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      featured BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      usage_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_article_tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_id UUID NOT NULL,
      tag_id UUID NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_media (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      alt_text TEXT,
      media_type TEXT NOT NULL,
      file_size_kb INTEGER NOT NULL DEFAULT 0,
      tags TEXT[] NOT NULL DEFAULT '{}',
      uploaded_by TEXT NOT NULL DEFAULT 'Truck King Hub',
      status TEXT NOT NULL DEFAULT 'ready',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      permissions TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      last_active_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Admin'`;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_id UUID,
      author_name TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      flagged BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_ads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      placement TEXT NOT NULL,
      sponsor TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      impressions INTEGER NOT NULL DEFAULT 0,
      clicks INTEGER NOT NULL DEFAULT 0,
      daily_budget INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_analytics_snapshots (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      page_views INTEGER NOT NULL DEFAULT 0,
      sessions INTEGER NOT NULL DEFAULT 0,
      bounce_rate INTEGER NOT NULL DEFAULT 0,
      traffic_sources JSONB NOT NULL,
      device_breakdown JSONB NOT NULL,
      top_content JSONB NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_name TEXT NOT NULL,
      details JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info',
      read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_scheduled_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content_type TEXT NOT NULL,
      publish_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      owner TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'normal',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch((e) => { console.error(e); process.exit(1); });
