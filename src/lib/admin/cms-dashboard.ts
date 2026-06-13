import type { InferSelectModel } from 'drizzle-orm';
import { articles, cmsComments, cmsAds, cmsUsers, cmsAuditLogs, cmsNotifications } from '@/lib/db/schema';

export type ArticleRow = InferSelectModel<typeof articles>;
export type CommentRow = InferSelectModel<typeof cmsComments>;
export type AdRow = InferSelectModel<typeof cmsAds>;
export type CmsUserRow = InferSelectModel<typeof cmsUsers>;
export type AuditLogRow = InferSelectModel<typeof cmsAuditLogs>;
export type NotificationRow = InferSelectModel<typeof cmsNotifications>;

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type DashboardListItem = {
  title: string;
  subtitle: string;
  value?: string;
  status?: string;
};

export type DashboardModel = {
  metrics: DashboardMetric[];
  contentBuckets: Array<{
    name: string;
    count: number;
    description: string;
    tone: string;
  }>;
  recentArticles: ArticleRow[];
  topCategories: Array<{ name: string; count: number; accent: string }>;
  scheduledItems: DashboardListItem[];
  mediaAssets: DashboardListItem[];
  seoChecklist: DashboardListItem[];
  analytics: {
    trafficSources: Array<{ source: string; value: number; detail: string }>;
    deviceBreakdown: Array<{ device: string; value: number; detail: string }>;
    topPages: Array<{ title: string; value: string; detail: string }>;
  };
  comments: CommentRow[];
  ads: AdRow[];
  users: CmsUserRow[];
  roles: DashboardListItem[];
  notifications: NotificationRow[];
  auditLogs: AuditLogRow[];
  sitemap: Array<{ path: string; priority: string; status: string }>;
  settings: Array<{ label: string; value: string }>;
};

export const CMS_NAV = [
  { label: 'Overview', href: '#overview' },
  { label: 'Posts', href: '#posts' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'News', href: '#news' },
  { label: 'Media', href: '#media' },
  { label: 'SEO', href: '#seo' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Comments', href: '#comments' },
  { label: 'Ads', href: '#ads' },
  { label: 'Users', href: '#users' },
  { label: 'Roles', href: '#roles' },
  { label: 'Settings', href: '#settings' },
  { label: 'Audit Logs', href: '#audit-logs' },
  { label: 'Sitemap', href: '#sitemap' },
] as const;

const CONTENT_BUCKETS = [
  { name: 'Blog', description: 'Editorial features, how-tos, and trucking advice.', tone: 'Magazine voice' },
  { name: 'News', description: 'Fast updates, policy shifts, and industry events.', tone: 'Breaking desk' },
  { name: 'Article', description: 'Long-form explainers and evergreen guides.', tone: 'Analysis' },
  { name: 'Review', description: 'Truck, gear, and service reviews with real-world context.', tone: 'Product desk' },
  { name: 'Sponsored', description: 'Integrated partner content and advertiser placements.', tone: 'Monetized slots' },
] as const;

const SEO_CHECKLIST: DashboardListItem[] = [
  { title: 'Meta title length', subtitle: 'All featured posts under 60 characters', status: 'Healthy' },
  { title: 'Meta descriptions', subtitle: 'Average 152 characters across published posts', status: 'Healthy' },
  { title: 'Canonical URLs', subtitle: 'Enabled for all live articles', status: 'Enabled' },
  { title: 'Open Graph previews', subtitle: 'Images and headlines render correctly', status: 'Ready' },
  { title: 'Schema markup', subtitle: 'Article and NewsArticle templates applied', status: 'Ready' },
  { title: 'XML sitemap', subtitle: 'Auto-generated daily for content discoverability', status: 'Updated' },
];

const ROLES: DashboardListItem[] = [
  { title: 'Admin', subtitle: 'Full control over content, settings, and permissions.' },
  { title: 'Editor', subtitle: 'Can approve, publish, and manage the editorial calendar.' },
  { title: 'Author', subtitle: 'Can draft, edit, and submit stories for review.' },
  { title: 'SEO Manager', subtitle: 'Can edit metadata, canonical URLs, and schema.' },
  { title: 'Analyst', subtitle: 'Can view traffic, cohorts, and performance reports.' },
  { title: 'Advertiser', subtitle: 'Can manage campaigns and sponsored placements.' },
];

const SETTINGS = [
  { label: 'Default publish workflow', value: 'Draft → Review → Scheduled → Published' },
  { label: 'Role approval policy', value: 'Editors approve, admins override' },
  { label: 'Media optimization', value: 'Auto-generate alt text and WebP variants' },
  { label: 'Sitemap refresh', value: 'Nightly at 2:00 AM ET' },
];

function inferContentType(article: ArticleRow) {
  const contentType = article.contentType?.toLowerCase?.() ?? '';
  if (contentType) return contentType;
  const category = article.category.toLowerCase();
  if (category.includes('news')) return 'news';
  if (category.includes('review')) return 'review';
  if (category.includes('sponsored')) return 'sponsored';
  return 'blog';
}

export type DashboardInput = {
  articles: ArticleRow[];
  comments: CommentRow[];
  ads: AdRow[];
  users: CmsUserRow[];
  auditLogs: AuditLogRow[];
  notifications: NotificationRow[];
};

export function buildDashboardModel(input: DashboardInput): DashboardModel {
  const { articles: articleRows, comments, ads, users, auditLogs, notifications } = input;

  const totalPosts = articleRows.length;
  const byStatus = articleRows.reduce<Record<string, number>>((acc, article) => {
    acc[article.status] = (acc[article.status] ?? 0) + 1;
    return acc;
  }, {});
  const byCategory = articleRows.reduce<Record<string, number>>((acc, article) => {
    acc[article.category] = (acc[article.category] ?? 0) + 1;
    return acc;
  }, {});
  const byType = articleRows.reduce<Record<string, number>>((acc, article) => {
    const type = inferContentType(article);
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});

  const published = byStatus.published ?? 0;
  const drafts = byStatus.draft ?? 0;
  const scheduled = byStatus.scheduled ?? 0;
  const archived = byStatus.archived ?? 0;
  const featured = articleRows.filter((article) => article.featured).length;
  const totalWords = articleRows.reduce((sum, article) => sum + article.body.split(/\s+/).filter(Boolean).length, 0);
  const avgReadTime = Math.max(3, Math.round(totalWords / Math.max(totalPosts, 1) / 200));

  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count], index) => ({
      name,
      count,
      accent: ['bg-crimson', 'bg-gold', 'bg-ink-soft', 'bg-silver'][index % 4],
    }));

  const contentBuckets = CONTENT_BUCKETS.map((bucket) => ({
    ...bucket,
    count: byType[bucket.name.toLowerCase()] ?? 0,
  }));

  const metrics: DashboardMetric[] = [
    { label: 'Total Posts', value: String(totalPosts), detail: 'Every article in the newsroom CMS' },
    { label: 'Published', value: String(published), detail: 'Live across the public site' },
    { label: 'Drafts', value: String(drafts), detail: 'Waiting on editorial review' },
    { label: 'Scheduled', value: String(scheduled), detail: 'Queued for future publishing' },
    { label: 'Archived', value: String(archived), detail: 'Saved for reference and republishing' },
    { label: 'Featured', value: String(featured), detail: 'Pinned to the homepage hero or cards' },
    { label: 'Avg. Read Time', value: `${avgReadTime} min`, detail: 'Estimated from article length' },
  ];

  const recentArticles = [...articleRows]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const scheduledItems = articleRows
    .filter((article) => article.status === 'scheduled' || article.scheduledAt)
    .slice(0, 4)
    .map((article) => ({
      title: article.title,
      subtitle: article.scheduledAt
        ? `Publishing ${new Date(article.scheduledAt).toLocaleString()}`
        : 'Queued for the editorial calendar',
      status: 'Scheduled',
    }));

  return {
    metrics,
    contentBuckets,
    recentArticles,
    topCategories,
    scheduledItems,
    mediaAssets: [],
    seoChecklist: SEO_CHECKLIST,
    analytics: {
      trafficSources: [
        { source: 'Organic search', value: 0, detail: 'Connect analytics to see data' },
        { source: 'Direct', value: 0, detail: 'Connect analytics to see data' },
        { source: 'Social', value: 0, detail: 'Connect analytics to see data' },
        { source: 'Referral', value: 0, detail: 'Connect analytics to see data' },
      ],
      deviceBreakdown: [
        { device: 'Desktop', value: 0, detail: 'Connect analytics to see data' },
        { device: 'Mobile', value: 0, detail: 'Connect analytics to see data' },
        { device: 'Tablet', value: 0, detail: 'Connect analytics to see data' },
      ],
      topPages: recentArticles.slice(0, 4).map((a) => ({
        title: a.title,
        value: a.status === 'published' ? 'Published' : a.status,
        detail: a.category,
      })),
    },
    comments,
    ads,
    users,
    roles: ROLES,
    notifications,
    auditLogs,
    sitemap: [
      { path: '/article/[slug]', priority: 'High', status: 'Indexed' },
      { path: '/news', priority: 'High', status: 'Indexed' },
      { path: '/brief', priority: 'High', status: 'Indexed' },
      { path: '/compliance', priority: 'Medium', status: 'Indexed' },
      { path: '/insurance', priority: 'Medium', status: 'Indexed' },
      { path: '/freight', priority: 'Medium', status: 'Indexed' },
    ],
    settings: SETTINGS,
  };
}
