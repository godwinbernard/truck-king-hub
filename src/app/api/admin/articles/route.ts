import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { desc, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { ArticleValidationError, buildArticlePayload } from '@/lib/admin/articles';
import { can } from '@/lib/admin/permissions';

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(articles).orderBy(desc(articles.updatedAt), desc(articles.createdAt));
  return Response.json({ articles: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload = buildArticlePayload(await req.json());
    if (!can(session.role, 'create_article')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (payload.status === 'published' && !can(session.role, 'publish_article')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (payload.status === 'scheduled' && !can(session.role, 'schedule_article')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [conflict] = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, payload.slug));
    if (conflict) {
      return Response.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const [article] = await db.insert(articles).values({
      title: payload.title,
      slug: payload.slug,
      author: payload.author,
      contentType: payload.contentType,
      category: payload.category,
      excerpt: payload.excerpt,
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
      status: payload.status,
      publishedAt: payload.status === 'published' ? new Date() : null,
      scheduledAt: payload.status === 'scheduled' ? new Date(payload.scheduledAt!) : null,
    }).returning();

    return Response.json({ article }, { status: 201 });
  } catch (error) {
    if (error instanceof ArticleValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: 'Save failed' }, { status: 500 });
  }
}
