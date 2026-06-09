'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type ArticleForm = {
  title: string;
  slug: string;
  author: string;
  contentType: string;
  category: string;
  excerpt: string;
  body: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  openGraphTitle: string;
  openGraphDescription: string;
  schemaMarkup: string;
  scheduledAt: string;
  tags: string;
  featured: boolean;
  status: string;
};

const CONTENT_TYPES = ['blog', 'news', 'article', 'review', 'sponsored'];
const CATEGORIES = ['news', 'compliance', 'freight', 'equipment', 'insurance', 'general', 'lifestyle', 'reviews', 'sponsored'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function toDatetimeLocal(value?: string | Date | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function ArticleEditor({
  initial,
  id,
}: {
  initial?: Partial<ArticleForm & { tags: string[] }>;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleForm>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    author: initial?.author ?? 'Truck King Hub',
    contentType: initial?.contentType ?? 'blog',
    category: initial?.category ?? 'general',
    excerpt: initial?.excerpt ?? '',
    body: initial?.body ?? '',
    coverImage: initial?.coverImage ?? '',
    metaTitle: initial?.metaTitle ?? '',
    metaDescription: initial?.metaDescription ?? '',
    focusKeyword: initial?.focusKeyword ?? '',
    canonicalUrl: initial?.canonicalUrl ?? '',
    openGraphTitle: initial?.openGraphTitle ?? '',
    openGraphDescription: initial?.openGraphDescription ?? '',
    schemaMarkup: initial?.schemaMarkup ?? '',
    scheduledAt: toDatetimeLocal(initial?.scheduledAt ?? ''),
    tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : (initial?.tags ?? ''),
    featured: initial?.featured ?? false,
    status: initial?.status ?? 'draft',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof ArticleForm, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !id) next.slug = slugify(value as string);
      if (field === 'status' && value === 'published') {
        next.scheduledAt = '';
      }
      return next;
    });
  }

  const excerptCount = useMemo(() => form.excerpt.trim().length, [form.excerpt]);
  const metaCount = useMemo(() => form.metaDescription.trim().length, [form.metaDescription]);

  async function save(nextStatus: string) {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        status: nextStatus,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
      };
      const url = id ? `/api/admin/articles/${id}` : '/api/admin/articles';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Save failed');
        return;
      }
      router.push('/admin/articles');
      router.refresh();
    } catch {
      setError('Network error — try again.');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full rounded-2xl border border-silver-light bg-white px-4 py-3 text-sm text-ink focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20';
  const labelCls = 'mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-silver';

  return (
    <div className="max-w-6xl">
      {error && <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-silver-light bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-4">Story details</p>

            <div className="grid gap-5">
              <div>
                <label className={labelCls} htmlFor="title">Title</label>
                <input id="title" className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Article headline" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="slug">Slug</label>
                  <input id="slug" className={inputCls} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="url-friendly-slug" />
                </div>
                <div>
                  <label className={labelCls} htmlFor="author">Author</label>
                  <input id="author" className={inputCls} value={form.author} onChange={(e) => set('author', e.target.value)} />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="contentType">Content Type</label>
                  <select id="contentType" className={inputCls} value={form.contentType} onChange={(e) => set('contentType', e.target.value)}>
                    {CONTENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="category">Category</label>
                  <select id="category" className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="excerpt">Excerpt</label>
                <textarea
                  id="excerpt"
                  className={`${inputCls} resize-none`}
                  rows={4}
                  value={form.excerpt}
                  onChange={(e) => set('excerpt', e.target.value)}
                  placeholder="Short summary shown on cards and article listings..."
                />
                <p className="mt-1 text-xs text-silver">{excerptCount} characters</p>
              </div>

              <div>
                <label className={labelCls} htmlFor="body">Article Body</label>
                <textarea
                  id="body"
                  className={`${inputCls} min-h-[24rem] font-mono text-xs leading-6`}
                  value={form.body}
                  onChange={(e) => set('body', e.target.value)}
                  placeholder="Write your full article here. You can use Markdown headings, lists, quotes, and tables."
                />
                <p className="mt-1 text-xs text-silver">Markdown-supported editor for editorial publishing.</p>
              </div>

              <div>
                <label className={labelCls} htmlFor="coverImage">Cover Image URL</label>
                <input id="coverImage" className={inputCls} value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} placeholder="https://images.unsplash.com/..." />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-silver-light bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-4">SEO controls</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="metaTitle">Meta Title</label>
                <input id="metaTitle" className={inputCls} value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="focusKeyword">Focus Keyword</label>
                <input id="focusKeyword" className={inputCls} value={form.focusKeyword} onChange={(e) => set('focusKeyword', e.target.value)} placeholder="truck driver health" />
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="canonicalUrl">Canonical URL</label>
                <input id="canonicalUrl" className={inputCls} value={form.canonicalUrl} onChange={(e) => set('canonicalUrl', e.target.value)} placeholder="https://truck-king-hub.vercel.app/article/example" />
              </div>
              <div>
                <label className={labelCls} htmlFor="metaDescription">Meta Description</label>
                <textarea id="metaDescription" className={`${inputCls} resize-none`} rows={4} value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
                <p className="mt-1 text-xs text-silver">{metaCount} characters</p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="openGraphTitle">Open Graph Title</label>
                <input id="openGraphTitle" className={inputCls} value={form.openGraphTitle} onChange={(e) => set('openGraphTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="openGraphDescription">Open Graph Description</label>
                <textarea id="openGraphDescription" className={`${inputCls} resize-none`} rows={4} value={form.openGraphDescription} onChange={(e) => set('openGraphDescription', e.target.value)} />
              </div>
            </div>

            <div className="mt-5">
              <label className={labelCls} htmlFor="schemaMarkup">Schema Markup</label>
              <textarea id="schemaMarkup" className={`${inputCls} min-h-36 font-mono text-xs`} value={form.schemaMarkup} onChange={(e) => set('schemaMarkup', e.target.value)} placeholder='{"@type":"NewsArticle"}' />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-silver-light bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-4">Publish</p>
            <div className="grid gap-2">
              <button
                onClick={() => save('published')}
                disabled={saving}
                className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Publish'}
              </button>
              <button
                onClick={() => save('draft')}
                disabled={saving}
                className="rounded-2xl border border-silver-light bg-white px-4 py-3 text-sm font-semibold text-charcoal transition hover:border-crimson hover:text-crimson disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => save('scheduled')}
                disabled={saving}
                className="rounded-2xl border border-silver-light bg-parchment px-4 py-3 text-sm font-semibold text-ink transition hover:border-crimson hover:text-crimson disabled:opacity-50"
              >
                Schedule
              </button>
              <button
                onClick={() => save('archived')}
                disabled={saving}
                className="rounded-2xl border border-silver-light bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink disabled:opacity-50"
              >
                Archive
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-silver-light bg-white p-5 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Metadata</p>

            <div>
              <label className={labelCls} htmlFor="tags">Tags</label>
              <input id="tags" className={inputCls} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="trucking, CDL, safety" />
            </div>

            <div>
              <label className={labelCls} htmlFor="scheduledAt">Scheduled At</label>
              <input id="scheduledAt" type="datetime-local" className={inputCls} value={form.scheduledAt} onChange={(e) => set('scheduledAt', e.target.value)} />
            </div>

            <div>
              <label className={labelCls} htmlFor="status">Status</label>
              <select id="status" className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-silver-light p-4">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 accent-crimson"
              />
              <span className="text-sm font-medium text-charcoal">Feature on homepage hero</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
