import { db } from '@/lib/db/client';
import { articles, cmsComments, cmsAds, cmsUsers, cmsAuditLogs, cmsNotifications } from '@/lib/db/schema';
import { and, desc, eq, lte } from 'drizzle-orm';
import { buildDashboardModel } from '@/lib/admin/cms-dashboard';
import { CmsDashboard } from '@/components/admin/CmsDashboard';
import { writeAuditLog } from '@/lib/admin/audit';

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function autoPublishDue() {
  const now = new Date();
  const due = await db
    .select({ id: articles.id, title: articles.title, scheduledAt: articles.scheduledAt })
    .from(articles)
    .where(and(eq(articles.status, 'scheduled'), lte(articles.scheduledAt, now)));
  for (const article of due) {
    await db.update(articles).set({ status: 'published', publishedAt: now, updatedAt: now }).where(eq(articles.id, article.id));
    await writeAuditLog('cron', 'auto_published', 'article', article.title, { id: article.id });
  }
}

export default async function AdminDashboard() {
  await autoPublishDue();

  const [articleRows, comments, ads, users, auditLogs, notifications] = await Promise.all([
    db.select().from(articles).orderBy(desc(articles.updatedAt)),
    safeQuery(() => db.select().from(cmsComments).orderBy(desc(cmsComments.createdAt)).limit(20), []),
    safeQuery(() => db.select().from(cmsAds).orderBy(desc(cmsAds.createdAt)).limit(20), []),
    safeQuery(() => db.select().from(cmsUsers).orderBy(desc(cmsUsers.createdAt)), []),
    safeQuery(() => db.select().from(cmsAuditLogs).orderBy(desc(cmsAuditLogs.createdAt)).limit(20), []),
    safeQuery(() => db.select().from(cmsNotifications).orderBy(desc(cmsNotifications.createdAt)).limit(10), []),
  ]);

  const dashboard = buildDashboardModel({ articles: articleRows, comments, ads, users, auditLogs, notifications });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-editorial font-bold text-ink">Truck King Hub publishing studio</h1>
        <p className="max-w-3xl text-sm text-charcoal">
          A WordPress-style CMS workspace for trucking news, blogs, reviews, sponsored content, SEO, analytics, ads, moderation, and team permissions.
        </p>
      </div>

      <CmsDashboard data={dashboard} />
    </div>
  );
}
