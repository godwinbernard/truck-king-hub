import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function duplicateSlug(base: string) {
  return `${slugify(base)}-copy-${Date.now().toString(36)}`;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  if (!article) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ article });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
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

  const [existing] = await db.select().from(articles).where(eq(articles.id, id));
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const wasPublished = existing.status === 'published';
  const nowPublished = status === 'published';
  const normalizedStatus = status || existing.status;
  const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;

  const [updated] = await db.update(articles).set({
    title, slug, author, category, excerpt,
    contentType: contentType || existing.contentType || 'blog',
    body: content, coverImage, metaTitle, metaDescription,
    focusKeyword: focusKeyword || null,
    canonicalUrl: canonicalUrl || null,
    openGraphTitle: openGraphTitle || null,
    openGraphDescription: openGraphDescription || null,
    schemaMarkup: schemaMarkup || null,
    tags: tags || [],
    featured: featured || false,
    status: normalizedStatus,
    publishedAt: nowPublished && !wasPublished ? new Date() : normalizedStatus === 'published' ? existing.publishedAt ?? new Date() : existing.publishedAt,
    scheduledAt: normalizedStatus === 'scheduled' ? scheduledDate : null,
    updatedAt: new Date(),
  }).where(eq(articles.id, id)).returning();

  return Response.json({ article: updated });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (body.action !== 'duplicate') {
    return Response.json({ error: 'Unsupported action' }, { status: 400 });
  }

  const [existing] = await db.select().from(articles).where(eq(articles.id, id));
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const [article] = await db.insert(articles).values({
    title: `${existing.title} Copy`,
    slug: duplicateSlug(existing.slug),
    author: existing.author,
    contentType: existing.contentType ?? 'blog',
    category: existing.category,
    excerpt: existing.excerpt,
    body: existing.body,
    coverImage: existing.coverImage,
    metaTitle: existing.metaTitle,
    metaDescription: existing.metaDescription,
    focusKeyword: existing.focusKeyword,
    canonicalUrl: existing.canonicalUrl,
    openGraphTitle: existing.openGraphTitle,
    openGraphDescription: existing.openGraphDescription,
    schemaMarkup: existing.schemaMarkup,
    tags: existing.tags,
    featured: false,
    status: 'draft',
    publishedAt: null,
    scheduledAt: null,
  }).returning();

  return Response.json({ article }, { status: 201 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.delete(articles).where(eq(articles.id, id));
  return Response.json({ ok: true });
}
