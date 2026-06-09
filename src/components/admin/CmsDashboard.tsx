import Link from 'next/link';
import { CMS_NAV, type DashboardModel } from '@/lib/admin/cms-dashboard';
import type { ArticleRow } from '@/lib/admin/cms-dashboard';

function Panel({
  id,
  title,
  eyebrow,
  children,
  className = '',
}: {
  id: string;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson mb-2">{eyebrow}</p>
        <h2 className="text-2xl md:text-3xl font-editorial font-bold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="editorial-card rounded-2xl border border-silver-light bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-3">{label}</p>
      <div className="flex items-end justify-between gap-4">
        <span className="text-3xl md:text-4xl font-display-hed text-ink leading-none">{value}</span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-parchment text-crimson text-sm font-bold">
          {label.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <p className="mt-3 text-sm text-charcoal">{detail}</p>
    </div>
  );
}

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent' }) {
  const tones = {
    neutral: 'bg-silver-pale text-charcoal',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    accent: 'bg-parchment text-crimson',
  } as const;

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

function DataTable({
  title,
  items,
  columns,
  emptyLabel,
}: {
  title: string;
  items: Array<Record<string, string | number | boolean | undefined | null>>;
  columns: Array<{ key: string; label: string; render?: (value: any, row: any) => React.ReactNode }>;
  emptyLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-silver-light bg-white overflow-hidden">
      <div className="border-b border-silver-light px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">{title}</p>
        </div>
        <Pill tone="accent">{items.length} items</Pill>
      </div>
      {items.length === 0 ? (
        <div className="px-5 py-10 text-sm text-silver">{emptyLabel}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-parchment/70">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-silver">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-silver-light/80">
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 align-top text-charcoal">
                      {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProgressBars({
  items,
  label,
}: {
  items: Array<{ name: string; value: number; detail: string }>;
  label: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="rounded-3xl border border-silver-light bg-white p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-4">{label}</p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between gap-4 text-sm mb-2">
              <div>
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-silver">{item.detail}</p>
              </div>
              <span className="text-xs font-bold text-charcoal">{item.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-silver-pale overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-crimson via-gold to-ink" style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function contentTypeLabel(row: ArticleRow) {
  return (row.contentType ?? 'blog').toLowerCase();
}

function statusTone(status: string) {
  if (status === 'published') return 'success';
  if (status === 'scheduled') return 'warning';
  if (status === 'archived') return 'neutral';
  return 'accent';
}

export function CmsDashboard({ data }: { data: DashboardModel }) {
  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] border border-silver-light bg-[linear-gradient(145deg,rgba(13,13,13,1)_0%,rgba(44,44,44,1)_52%,rgba(184,152,42,1)_160%)] text-white overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <div className="grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-parchment/80 mb-3">Truck King Hub CMS</p>
            <h1 className="text-4xl md:text-6xl font-editorial font-bold leading-none max-w-3xl">
              WordPress-style publishing control for the trucking newsroom.
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-parchment/80">
              Manage blogs, news, reviews, SEO, analytics, ads, comments, roles, and scheduled publishing from one command center.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin/articles/new" className="rounded-full bg-parchment px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white">
                New Post
              </Link>
              <Link href="/admin/articles" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Manage Posts
              </Link>
              <a href="#analytics" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                View Analytics
              </a>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-parchment/70">Publishing Queue</p>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-display-hed">3</span>
                <Pill tone="accent">Awaiting approval</Pill>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-parchment/70">Ad Fill Rate</p>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-display-hed">92%</span>
                <Pill tone="success">Strong inventory</Pill>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-parchment/70">Traffic Trend</p>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-display-hed">+18%</span>
                <Pill tone="warning">7-day lift</Pill>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="overview" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson mb-2">Overview</p>
            <h2 className="text-2xl md:text-3xl font-editorial font-bold text-ink">Editorial operations at a glance</h2>
          </div>
          <div className="hidden md:flex flex-wrap gap-2">
            {CMS_NAV.slice(0, 5).map((item) => (
              <a key={item.href} href={item.href} className="rounded-full border border-silver-light bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-crimson hover:text-crimson">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.metrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <Panel id="posts" eyebrow="Posts" title="Content pipeline, publishing, and post operations">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <DataTable
              title="Recent posts"
              items={data.recentArticles.map((article) => ({
                title: article.title,
                contentType: contentTypeLabel(article),
                category: article.category,
                status: article.status,
                updatedAt: article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : '—',
                author: article.author,
                slug: article.slug,
                id: article.id,
                featured: article.featured,
              }))}
              columns={[
                { key: 'title', label: 'Title' },
                {
                  key: 'contentType',
                  label: 'Type',
                  render: (value) => <Pill tone="accent">{String(value)}</Pill>,
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => <Pill tone={statusTone(String(value))}>{String(value)}</Pill>,
                },
                { key: 'author', label: 'Author' },
                { key: 'updatedAt', label: 'Updated' },
                {
                  key: 'slug',
                  label: 'Actions',
                  render: (_value, row) => (
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <Link href={`/admin/articles/${row.id}`} className="text-crimson hover:underline">
                        Edit
                      </Link>
                      <a href={`/article/${row.slug}`} target="_blank" rel="noreferrer" className="text-charcoal hover:underline">
                        Preview
                      </a>
                    </div>
                  ),
                },
              ]}
              emptyLabel="No posts yet."
            />

            <div className="grid gap-4 md:grid-cols-2">
              {data.contentBuckets.map((bucket) => (
                <div key={bucket.name} className="rounded-3xl border border-silver-light bg-white p-5 editorial-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-2">{bucket.name}</p>
                      <h3 className="text-xl font-editorial font-bold text-ink">{bucket.count} live pieces</h3>
                    </div>
                    <Pill tone="accent">{bucket.tone}</Pill>
                  </div>
                  <p className="mt-3 text-sm text-charcoal">{bucket.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-silver-light bg-white p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Content calendar</p>
                  <h3 className="text-xl font-editorial font-bold text-ink">Scheduled publishing</h3>
                </div>
                <Link href="/admin/articles/new" className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                  Schedule new
                </Link>
              </div>
              <div className="space-y-3">
                {data.scheduledItems.length === 0 ? (
                  <p className="text-sm text-silver">No scheduled posts.</p>
                ) : (
                  data.scheduledItems.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-silver-light p-4">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-semibold text-ink">{item.title}</h4>
                        <Pill tone="warning">{item.status ?? 'Scheduled'}</Pill>
                      </div>
                      <p className="mt-1 text-sm text-silver">{item.subtitle}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-silver-light bg-parchment p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-3">Top categories</p>
              <div className="space-y-3">
                {data.topCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                    <div>
                      <p className="font-semibold text-ink capitalize">{category.name}</p>
                      <p className="text-xs text-silver">{category.count} posts in the archive</p>
                    </div>
                    <span className={`h-3 w-3 rounded-full ${category.accent}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel id="media" eyebrow="Media" title="Editorial media library and asset controls">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-silver-light bg-white p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Media library</p>
                <h3 className="text-xl font-editorial font-bold text-ink">Search, tag, and reuse assets</h3>
              </div>
              <Pill tone="success">4 assets</Pill>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.mediaAssets.map((asset) => (
                <div key={asset.title} className="rounded-2xl border border-silver-light p-4">
                  <div className="aspect-[4/3] rounded-xl bg-[linear-gradient(135deg,rgba(13,13,13,0.92),rgba(192,57,43,0.75))] mb-3" />
                  <h4 className="font-semibold text-ink">{asset.title}</h4>
                  <p className="text-sm text-silver">{asset.subtitle}</p>
                  <p className="mt-2 text-xs font-semibold text-crimson">{asset.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-silver-light bg-white p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">SEO toolkit</p>
                <h3 className="text-xl font-editorial font-bold text-ink">Metadata, schema, and previews</h3>
              </div>
              <Link href="/admin/articles" className="text-xs font-semibold text-crimson hover:underline">
                Open article editor
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {data.seoChecklist.map((item) => (
                <div key={item.title} className="rounded-2xl border border-silver-light p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-ink">{item.title}</h4>
                    <Pill tone="success">{item.status ?? 'Ready'}</Pill>
                  </div>
                  <p className="mt-2 text-sm text-silver">{item.subtitle}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-3xl border border-silver-light bg-parchment p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-3">Open Graph preview</p>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="aspect-[16/7] rounded-xl bg-[linear-gradient(135deg,rgba(13,13,13,0.96),rgba(184,152,42,0.7))] mb-3" />
                <p className="text-xs uppercase tracking-[0.2em] text-silver">truckkinghub.com</p>
                <h4 className="mt-1 text-lg font-semibold text-ink">Truck King Hub | Trucker news, blogs, and reviews</h4>
                <p className="mt-2 text-sm text-charcoal">
                  Premium editorial coverage for trucking professionals, owner-operators, fleet managers, and advertisers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel id="analytics" eyebrow="Analytics" title="Traffic, audience trends, and monetization performance">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Page Views" value="182K" detail="Last 30 days across all public pages" />
              <StatCard label="Sessions" value="64K" detail="Returning readers plus first-time visitors" />
              <StatCard label="Bounce Rate" value="41%" detail="Average engagement across article pages" />
            </div>
            <ProgressBars items={data.analytics.trafficSources.map((item) => ({ name: item.source, value: item.value, detail: item.detail }))} label="Traffic sources" />
          </div>
          <div className="space-y-6">
            <ProgressBars items={data.analytics.deviceBreakdown.map((item) => ({ name: item.device, value: item.value, detail: item.detail }))} label="Device breakdown" />
            <div className="rounded-3xl border border-silver-light bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-4">Top content</p>
              <div className="space-y-4">
                {data.analytics.topPages.map((page) => (
                  <div key={page.title} className="flex items-start justify-between gap-4 border-b border-silver-light pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-ink">{page.title}</p>
                      <p className="text-xs text-silver">{page.detail}</p>
                    </div>
                    <span className="text-sm font-bold text-crimson">{page.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel id="comments" eyebrow="Comments" title="Moderation queue, ad inventory, users, and roles">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-silver-light bg-white p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Comment moderation</p>
                <h3 className="text-xl font-editorial font-bold text-ink">Approve, reject, or flag discussion</h3>
              </div>
              <Pill tone="warning">4 waiting</Pill>
            </div>
            <div className="space-y-4">
              {data.comments.map((comment) => (
                <div key={comment.title} className="rounded-2xl border border-silver-light p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-ink">{comment.title}</h4>
                      <p className="mt-1 text-sm text-silver">{comment.subtitle}</p>
                    </div>
                    <Pill tone="neutral">{comment.status ?? 'Pending'}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div id="ads" className="rounded-3xl border border-silver-light bg-white p-5 scroll-mt-24">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Ads</p>
                  <h3 className="text-xl font-editorial font-bold text-ink">Sponsored placements and monetization</h3>
                </div>
                <Pill tone="success">92% fill</Pill>
              </div>
              <div className="space-y-3">
                {data.ads.map((ad) => (
                  <div key={ad.title} className="rounded-2xl border border-silver-light p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-ink">{ad.title}</h4>
                        <p className="text-sm text-silver">{ad.subtitle}</p>
                      </div>
                      <Pill tone="accent">{ad.status ?? 'Active'}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="users" className="rounded-3xl border border-silver-light bg-white p-5 scroll-mt-24">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Users</p>
                  <h3 className="text-xl font-editorial font-bold text-ink">Editorial team and permissions</h3>
                </div>
                <Pill tone="neutral">{data.users.length} active</Pill>
              </div>
              <div className="space-y-3">
                {data.users.map((user) => (
                  <div key={user.title} className="rounded-2xl border border-silver-light p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-ink">{user.title}</h4>
                        <p className="text-sm text-silver">{user.subtitle}</p>
                      </div>
                      <Pill tone="success">{user.status ?? 'Active'}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel id="roles" eyebrow="Roles" title="Access controls for the newsroom">
          <div className="grid gap-3 md:grid-cols-2">
            {data.roles.map((role) => (
              <div key={role.title} className="rounded-3xl border border-silver-light bg-white p-5">
                <h3 className="font-editorial text-xl font-bold text-ink">{role.title}</h3>
                <p className="mt-2 text-sm text-charcoal">{role.subtitle}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel id="settings" eyebrow="Settings" title="Publishing, media, and automation settings">
          <div className="rounded-3xl border border-silver-light bg-white p-5 space-y-3">
            {data.settings.map((setting) => (
              <div key={setting.label} className="flex items-start justify-between gap-6 border-b border-silver-light pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-ink">{setting.label}</p>
                </div>
                <p className="max-w-sm text-right text-sm text-silver">{setting.value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel id="audit-logs" eyebrow="Audit logs" title="Content change history and administrative actions">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.notifications.map((notification) => (
            <div key={notification.title} className="rounded-3xl border border-silver-light bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-2">Notification</p>
              <h3 className="font-editorial text-xl font-bold text-ink">{notification.title}</h3>
              <p className="mt-2 text-sm text-charcoal">{notification.subtitle}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-silver-light bg-white overflow-hidden">
          <div className="border-b border-silver-light px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Latest actions</p>
          </div>
          <div className="divide-y divide-silver-light">
            {data.auditLogs.map((log) => (
              <div key={log.title} className="px-5 py-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
                <div>
                  <p className="font-semibold text-ink">{log.title}</p>
                  <p className="text-sm text-silver">{log.subtitle}</p>
                </div>
                <Pill tone="neutral">Logged</Pill>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel id="sitemap" eyebrow="Sitemap" title="Search discoverability and index coverage">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-silver-light bg-white overflow-hidden">
            <div className="border-b border-silver-light px-5 py-4 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Sitemap entries</p>
              <Pill tone="success">Auto-generated</Pill>
            </div>
            <div className="divide-y divide-silver-light">
              {data.sitemap.map((entry) => (
                <div key={entry.path} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{entry.path}</p>
                    <p className="text-sm text-silver">Priority: {entry.priority}</p>
                  </div>
                  <Pill tone="neutral">{entry.status}</Pill>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-silver-light bg-parchment p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-3">Publishing notes</p>
            <div className="space-y-3 text-sm text-charcoal">
              <p>Built for a trucking publication with newsroom workflows, editorial review, monetization, and role-based access.</p>
              <p>Pair this dashboard with the article editor to manage drafts, schedules, SEO metadata, and sponsored placements.</p>
              <p>The admin shell keeps the public site separate while giving editors one command center for daily operations.</p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
