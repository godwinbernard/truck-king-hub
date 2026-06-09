import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { buildDashboardModel } from '@/lib/admin/cms-dashboard';
import { CmsDashboard } from '@/components/admin/CmsDashboard';

export default async function AdminDashboard() {
  const articleRows = await db.select().from(articles).orderBy(desc(articles.updatedAt));
  const dashboard = buildDashboardModel(articleRows);

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
