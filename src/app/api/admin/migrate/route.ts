import { db } from '@/lib/db/client';
import { getSession } from '@/lib/admin/session';
import { sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return runMigrations();
}

async function runMigrations() {

  const tables = [
    {
      name: 'cms_media',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_media (
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
      )`,
    },
    {
      name: 'cms_roles',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        permissions TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_users',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        last_active_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_comments',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        article_id UUID,
        author_name TEXT NOT NULL,
        body TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        flagged BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_ads',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_ads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        placement TEXT NOT NULL,
        sponsor TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        impressions INTEGER NOT NULL DEFAULT 0,
        clicks INTEGER NOT NULL DEFAULT 0,
        daily_budget INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_analytics_snapshots',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_analytics_snapshots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        page_views INTEGER NOT NULL DEFAULT 0,
        sessions INTEGER NOT NULL DEFAULT 0,
        bounce_rate INTEGER NOT NULL DEFAULT 0,
        traffic_sources JSONB NOT NULL DEFAULT '{}',
        device_breakdown JSONB NOT NULL DEFAULT '{}',
        top_content JSONB NOT NULL DEFAULT '{}'
      )`,
    },
    {
      name: 'cms_audit_logs',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_name TEXT NOT NULL,
        details JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_notifications',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'info',
        read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_scheduled_items',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_scheduled_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content_type TEXT NOT NULL,
        publish_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL DEFAULT 'scheduled',
        owner TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'normal',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_categories',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        content_type TEXT NOT NULL DEFAULT 'blog',
        color TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        featured BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_tags',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        usage_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: 'cms_article_tags',
      stmt: sql`CREATE TABLE IF NOT EXISTS cms_article_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        article_id UUID NOT NULL,
        tag_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
  ];

  const results: string[] = [];
  for (const { name, stmt } of tables) {
    try {
      await db.execute(stmt);
      results.push(`OK: ${name}`);
    } catch (err) {
      results.push(`ERR: ${name} — ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return Response.json({ ok: true, results });
}

export async function POST() {
  const session = await getSession();
  if (!session?.adminId || session.role !== 'Admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return runMigrations();
}
