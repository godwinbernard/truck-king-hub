import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(articles).orderBy(desc(articles.updatedAt), desc(articles.createdAt));
  return Response.json({ articles: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    title,
    slug,
    author,
    contentType,
    category,
    excerpt,
    body: content,
    coverImage,
    metaTitle,
    metaDescription,
    focusKeyword,
    canonicalUrl,
    openGraphTitle,
    openGraphDescription,
    schemaMarkup,
    tags,
    featured,
    status,
    scheduledAt,
  } = body;

  if (!title || !slug || !category || !excerpt || !content) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const normalizedStatus = status || 'draft';
  const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;

  const [article] = await db.insert(articles).values({
    title, slug, author: author || 'Truck King Hub',
    contentType: contentType || 'blog',
    category, excerpt, body: content,
    coverImage: coverImage || null,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    focusKeyword: focusKeyword || null,
    canonicalUrl: canonicalUrl || null,
    openGraphTitle: openGraphTitle || null,
    openGraphDescription: openGraphDescription || null,
    schemaMarkup: schemaMarkup || null,
    tags: tags || [],
    featured: featured || false,
    status: normalizedStatus,
    publishedAt: normalizedStatus === 'published' ? new Date() : null,
    scheduledAt: normalizedStatus === 'scheduled' ? scheduledDate : null,
  }).returning();

  return Response.json({ article }, { status: 201 });
}
