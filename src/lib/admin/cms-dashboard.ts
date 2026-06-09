import type { InferSelectModel } from 'drizzle-orm';
import { articles } from '@/lib/db/schema';

export type ArticleRow = InferSelectModel<typeof articles>;

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
  comments: DashboardListItem[];
  ads: DashboardListItem[];
  users: DashboardListItem[];
  roles: DashboardListItem[];
  notifications: DashboardListItem[];
  auditLogs: DashboardListItem[];
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

const MEDIA_ASSETS: DashboardListItem[] = [
  { title: 'Hero rig at dusk', subtitle: 'Cover image · 3.4 MB', status: 'Ready' },
  { title: 'Driver profile portrait', subtitle: 'Editorial headshot · JPG', status: 'Tagged' },
  { title: 'Fleet yard loading dock', subtitle: 'News image · 4.1 MB', status: 'SEO alt set' },
  { title: 'Highway night shot', subtitle: 'Feature banner · WebP', status: 'Approved' },
];

const SEO_CHECKLIST: DashboardListItem[] = [
  { title: 'Meta title length', subtitle: 'All featured posts under 60 characters', status: 'Healthy' },
  { title: 'Meta descriptions', subtitle: 'Average 152 characters across published posts', status: 'Healthy' },
  { title: 'Canonical URLs', subtitle: 'Enabled for all live articles', status: 'Enabled' },
  { title: 'Open Graph previews', subtitle: 'Images and headlines render correctly', status: 'Ready' },
  { title: 'Schema markup', subtitle: 'Article and NewsArticle templates applied', status: 'Ready' },
  { title: 'XML sitemap', subtitle: 'Auto-generated daily for content discoverability', status: 'Updated' },
];

const ANALYTICS_SOURCES = [
  { source: 'Organic search', value: 48, detail: 'Largest traffic driver' },
  { source: 'Direct', value: 23, detail: 'Returning readers and bookmarks' },
  { source: 'Social', value: 17, detail: 'LinkedIn, Facebook, and X' },
  { source: 'Referral', value: 12, detail: 'Partner sites and directory links' },
];

const DEVICE_BREAKDOWN = [
  { device: 'Desktop', value: 52, detail: 'Long-form readers and editors' },
  { device: 'Mobile', value: 38, detail: 'Drivers on the road' },
  { device: 'Tablet', value: 10, detail: 'Dispatch and back-office users' },
];

const TOP_PAGES = [
  { title: 'How to Start a Career in Trucking', value: '18.4K views', detail: 'Evergreen top performer' },
  { title: 'Fuel-Saving Tips for Truck Drivers', value: '12.1K views', detail: 'High commercial intent' },
  { title: 'DOT Regulations and Compliance', value: '9.7K views', detail: 'Authority content' },
  { title: 'Electric Trucks in Logistics', value: '8.1K views', detail: 'Trending industry coverage' },
];

const COMMENTS: DashboardListItem[] = [
  { title: 'Mike R.', subtitle: 'Asked about the best ELD setup for owner-operators.', status: 'Pending review' },
  { title: 'Sharon T.', subtitle: 'Highlighted a broken link in the compliance article.', status: 'Flagged' },
  { title: 'Darnell P.', subtitle: 'Shared a freight-rate tip for fleet managers.', status: 'Approved' },
  { title: 'Elena S.', subtitle: 'Requested a source citation for a stats claim.', status: 'Needs reply' },
];

const ADS: DashboardListItem[] = [
  { title: 'Hero banner', subtitle: 'Top homepage slot · 92% fill rate', status: 'Live' },
  { title: 'Sponsored story block', subtitle: 'Mid-article placement · 18 clicks today', status: 'Active' },
  { title: 'Sidebar partner ad', subtitle: 'Newsletter and article sidebar', status: 'Scheduled' },
  { title: 'Affiliate slot', subtitle: 'Gear review pages and buying guides', status: 'Monetized' },
];

const USERS: DashboardListItem[] = [
  { title: 'Avery Stone', subtitle: 'Editor · Content approvals and homepage curation', status: 'Online' },
  { title: 'Jordan Wells', subtitle: 'SEO Manager · Schema, metadata, and crawl checks', status: 'Active' },
  { title: 'Priya Patel', subtitle: 'Author · Blogs, lifestyle, and driver stories', status: 'Active' },
  { title: 'Malik Johnson', subtitle: 'Analyst · Traffic and retention reporting', status: 'Active' },
  { title: 'Nina Brooks', subtitle: 'Advertiser · Sponsored content placements', status: 'Invited' },
];

const ROLES: DashboardListItem[] = [
  { title: 'Admin', subtitle: 'Full control over content, settings, and permissions.' },
  { title: 'Editor', subtitle: 'Can approve, publish, and manage the editorial calendar.' },
  { title: 'Author', subtitle: 'Can draft, edit, and submit stories for review.' },
  { title: 'SEO Manager', subtitle: 'Can edit metadata, canonical URLs, and schema.' },
  { title: 'Analyst', subtitle: 'Can view traffic, cohorts, and performance reports.' },
  { title: 'Advertiser', subtitle: 'Can manage campaigns and sponsored placements.' },
];

const NOTIFICATIONS: DashboardListItem[] = [
  { title: '3 drafts waiting for approval', subtitle: 'Two articles and one sponsored post are queued.' },
  { title: 'SEO review due today', subtitle: 'Meta description check on three high-value pages.' },
  { title: 'Comment moderation alert', subtitle: 'A flagged compliance comment needs a response.' },
  { title: 'Ad inventory nearly full', subtitle: 'Homepage hero and sidebar are both above 85% fill.' },
];

const AUDIT_LOGS: DashboardListItem[] = [
  { title: 'Avery Stone published article', subtitle: 'How the Trucking Industry Is Adapting to New Technology · 12 min ago' },
  { title: 'Jordan Wells updated SEO', subtitle: 'Added canonical URL and schema markup · 38 min ago' },
  { title: 'Malik Johnson viewed analytics', subtitle: 'Checked top traffic sources for the last 24 hours · 1 hr ago' },
  { title: 'Nina Brooks updated ad slot', subtitle: 'Activated sponsored block in the logistics category · 2 hr ago' },
];

const SETTINGS = [
  { label: 'Default publish workflow', value: 'Draft -> Review -> Scheduled -> Published' },
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

export function buildDashboardModel(articleRows: ArticleRow[]): DashboardModel {
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
    mediaAssets: MEDIA_ASSETS,
    seoChecklist: SEO_CHECKLIST,
    analytics: {
      trafficSources: ANALYTICS_SOURCES,
      deviceBreakdown: DEVICE_BREAKDOWN,
      topPages: TOP_PAGES,
    },
    comments: COMMENTS,
    ads: ADS,
    users: USERS,
    roles: ROLES,
    notifications: NOTIFICATIONS,
    auditLogs: AUDIT_LOGS,
    sitemap: [
      { path: '/article/[slug]', priority: 'High', status: 'Indexed' },
      { path: '/news', priority: 'High', status: 'Indexed' },
      { path: '/blogs', priority: 'High', status: 'Indexed' },
      { path: '/reviews', priority: 'Medium', status: 'Indexed' },
      { path: '/sponsored', priority: 'Medium', status: 'Indexed' },
      { path: '/categories/[slug]', priority: 'Medium', status: 'Auto-updated' },
    ],
    settings: SETTINGS,
  };
}
