'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  contentType?: string;
  status: string;
  featured: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-amber-50 text-amber-700',
  scheduled: 'bg-blue-50 text-blue-700',
  archived: 'bg-slate-100 text-slate-600',
};

function typeLabel(value?: string) {
  return (value ?? 'blog').toLowerCase();
}

export default function ArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/articles');
    const data = await res.json();
    setItems(data.articles ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  async function duplicate(id: string) {
    const res = await fetch(`/api/admin/articles/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate' }),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.article) {
      setItems((prev) => [data.article, ...prev]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson mb-2">Content</p>
          <h1 className="text-3xl font-editorial font-bold text-ink">Posts and publishing queue</h1>
          <p className="mt-1 text-sm text-charcoal">Create, edit, preview, duplicate, and manage trucking content from one place.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal"
        >
          New Article
        </Link>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-silver">Loading...</p>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-silver-light bg-white py-16 text-center">
          <p className="text-silver mb-4">No articles yet.</p>
          <Link href="/admin/articles/new" className="text-sm font-semibold text-crimson hover:underline">
            Write your first article
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-silver-light bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-silver-light px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">All posts</p>
            <p className="text-sm text-silver">{items.length} total</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment/70">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-silver">Title</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-silver">Type</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-silver">Category</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-silver">Status</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-silver">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((article) => (
                  <tr key={article.id} className="border-t border-silver-light/80 hover:bg-parchment/50">
                    <td className="px-5 py-4 align-top">
                      <div className="max-w-sm">
                        <p className="font-semibold text-ink">{article.title}</p>
                        <p className="text-xs text-silver">/{article.slug}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-charcoal">{typeLabel(article.contentType)}</td>
                    <td className="px-5 py-4 align-top capitalize text-charcoal">{article.category}</td>
                    <td className="px-5 py-4 align-top">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[article.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-silver text-xs">
                      {new Date(article.scheduledAt ?? article.publishedAt ?? article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap items-center justify-end gap-3 text-xs font-semibold">
                        <Link href={`/admin/articles/${article.id}`} className="text-crimson hover:underline">
                          Edit
                        </Link>
                        <a href={`/article/${article.slug}`} target="_blank" rel="noreferrer" className="text-charcoal hover:underline">
                          Preview
                        </a>
                        <button onClick={() => duplicate(article.id)} className="text-slate-600 hover:text-ink hover:underline">
                          Duplicate
                        </button>
                        <button onClick={() => del(article.id, article.title)} className="text-rose-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
