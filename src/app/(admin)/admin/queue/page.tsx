import Link from 'next/link';
import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { desc, inArray } from 'drizzle-orm';

const QUEUE_STATUSES = ['draft', 'scheduled'] as const;

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-amber-50 text-amber-700',
  scheduled: 'bg-blue-50 text-blue-700',
};

export default async function QueuePage() {
  const rows = await db
    .select()
    .from(articles)
    .where(inArray(articles.status, [...QUEUE_STATUSES]))
    .orderBy(desc(articles.scheduledAt), desc(articles.updatedAt), desc(articles.createdAt));

  const pendingReview = rows.filter((article) => article.status === 'draft');
  const scheduled = rows.filter((article) => article.status === 'scheduled');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson mb-2">Queue</p>
          <h1 className="text-3xl font-editorial font-bold text-ink">Editorial approval queue</h1>
          <p className="mt-1 text-sm text-charcoal">
            Drafts and scheduled posts waiting for editorial review before they go live.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal"
        >
          New Article
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-silver-light bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">In Queue</p>
          <p className="mt-2 text-3xl font-editorial font-bold text-ink">{rows.length}</p>
        </div>
        <div className="rounded-3xl border border-silver-light bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Pending Review</p>
          <p className="mt-2 text-3xl font-editorial font-bold text-ink">{pendingReview.length}</p>
        </div>
        <div className="rounded-3xl border border-silver-light bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Scheduled</p>
          <p className="mt-2 text-3xl font-editorial font-bold text-ink">{scheduled.length}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-silver-light bg-white py-16 text-center">
          <p className="text-silver">Nothing is waiting for approval right now.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-silver-light bg-white">
          <div className="border-b border-silver-light px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Queue items</p>
          </div>
          <div className="divide-y divide-silver-light">
            {rows.map((article) => (
              <div key={article.id} className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[article.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {article.status}
                    </span>
                    {article.scheduledAt && (
                      <span className="text-xs font-medium text-silver">
                        Publishing {new Date(article.scheduledAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 truncate font-semibold text-ink">{article.title}</p>
                  <p className="mt-1 text-xs text-silver">
                    /{article.slug} · {article.category} · Updated {new Date(article.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                  <Link href={`/admin/articles/${article.id}`} className="text-crimson hover:underline">
                    Review
                  </Link>
                  <Link href={`/admin/articles/${article.id}`} className="text-charcoal hover:underline">
                    Edit
                  </Link>
                  <a href={`/article/${article.slug}`} target="_blank" rel="noreferrer" className="text-slate-600 hover:underline">
                    Preview
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
