import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  if (!article) notFound();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/articles" className="text-sm font-medium text-silver hover:text-crimson">
          Back to posts
        </Link>
        <span className="text-silver">/</span>
        <h1 className="max-w-3xl truncate text-3xl font-editorial font-bold text-ink">{article.title}</h1>
      </div>
      <ArticleEditor
        id={article.id}
        initial={{
          title: article.title,
          slug: article.slug,
          author: article.author,
          contentType: article.contentType ?? 'blog',
          category: article.category,
          excerpt: article.excerpt,
          body: article.body,
          coverImage: article.coverImage ?? '',
          metaTitle: article.metaTitle ?? '',
          metaDescription: article.metaDescription ?? '',
          focusKeyword: article.focusKeyword ?? '',
          canonicalUrl: article.canonicalUrl ?? '',
          openGraphTitle: article.openGraphTitle ?? '',
          openGraphDescription: article.openGraphDescription ?? '',
          schemaMarkup: article.schemaMarkup ?? '',
          scheduledAt: article.scheduledAt ? article.scheduledAt.toISOString() : '',
          tags: article.tags,
          featured: article.featured,
          status: article.status,
        }}
      />
    </div>
  );
}
