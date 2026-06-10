import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { ArticleValidationError, buildArticlePayload } from '@/lib/admin/articles';
import { can } from '@/lib/admin/permissions';

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
  const [existing] = await db.select().from(articles).where(eq(articles.id, id));
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });
  try {
    const payload = buildArticlePayload(await req.json());
    if (!can(session.role, 'edit_article')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (payload.status === 'published' && !can(session.role, 'publish_article')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (payload.status === 'scheduled' && !can(session.role, 'schedule_article')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (payload.status === 'archived' && !can(session.role, 'archive_article')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [slugOwner] = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, payload.slug));
    if (slugOwner && slugOwner.id !== id) {
      return Response.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const nextStatus = payload.status || existing.status;
    const publishedAt =
      nextStatus === 'published'
        ? existing.publishedAt ?? new Date()
        : nextStatus === 'archived'
          ? existing.publishedAt
          : existing.status === 'published' && nextStatus === 'draft'
            ? existing.publishedAt
            : null;

    const [updated] = await db.update(articles).set({
      title: payload.title,
      slug: payload.slug,
      author: payload.author,
      category: payload.category,
      excerpt: payload.excerpt,
      contentType: payload.contentType,
      body: payload.body,
      coverImage: payload.coverImage,
      metaTitle: payload.metaTitle,
      metaDescription: payload.metaDescription,
      focusKeyword: payload.focusKeyword,
      canonicalUrl: payload.canonicalUrl,
      openGraphTitle: payload.openGraphTitle,
      openGraphDescription: payload.openGraphDescription,
      schemaMarkup: payload.schemaMarkup,
      tags: payload.tags,
      featured: payload.featured,
      status: nextStatus,
      publishedAt,
      scheduledAt: nextStatus === 'scheduled' ? new Date(payload.scheduledAt!) : null,
      updatedAt: new Date(),
    }).where(eq(articles.id, id)).returning();

    return Response.json({ article: updated });
  } catch (error) {
    if (error instanceof ArticleValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: 'Save failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!can(session.role, 'create_article')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

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
  if (!can(session.role, 'delete_article')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(articles).where(eq(articles.id, id));
  return Response.json({ ok: true });
}
