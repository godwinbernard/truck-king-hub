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

  // Create articles table
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      author TEXT NOT NULL DEFAULT 'Truck King Hub',
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      cover_image TEXT,
      meta_title TEXT,
      meta_description TEXT,
      tags TEXT[] NOT NULL DEFAULT '{}',
      featured BOOLEAN NOT NULL DEFAULT false,
      status TEXT NOT NULL DEFAULT 'draft',
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch((e) => { console.error(e); process.exit(1); });
