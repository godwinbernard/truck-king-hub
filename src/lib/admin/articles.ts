export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type ArticleContentType = 'blog' | 'news' | 'article' | 'review' | 'sponsored';

export type ArticlePayload = {
  title: string;
  slug: string;
  author: string;
  contentType: ArticleContentType;
  category: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  schemaMarkup: string | null;
  tags: string[];
  featured: boolean;
  status: ArticleStatus;
  scheduledAt: string | null;
};

export class ArticleValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'ArticleValidationError';
    this.status = status;
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDate(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function slugifyTitle(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

export function validateSeoFields(input: { metaTitle?: string | null; metaDescription?: string | null }) {
  const errors: string[] = [];
  const metaTitle = asString(input.metaTitle);
  const metaDescription = asString(input.metaDescription);

  if (metaTitle && metaTitle.length > 60) errors.push('Meta title must be 60 characters or fewer');
  if (metaDescription && metaDescription.length > 160) errors.push('Meta description must be 160 characters or fewer');

  return errors;
}

export function normalizeArticleStatus(status: string, scheduledAt: string | null): ArticleStatus {
  const allowed: ArticleStatus[] = ['draft', 'published', 'scheduled', 'archived'];
  const value = allowed.includes(status as ArticleStatus) ? (status as ArticleStatus) : 'draft';
  if (value === 'scheduled' && !scheduledAt) return 'draft';
  return value;
}

export function buildArticlePayload(body: unknown): ArticlePayload {
  if (!body || typeof body !== 'object') {
    throw new ArticleValidationError('Invalid request payload');
  }

  const input = body as Record<string, unknown>;
  const title = asString(input.title);
  const slugInput = asString(input.slug);
  const author = asString(input.author) || 'Truck King Hub';
  const contentType = asString(input.contentType) as ArticleContentType;
  const category = asString(input.category);
  const excerpt = asString(input.excerpt);
  const articleBody = asString(input.body);
  const coverImage = asString(input.coverImage) || null;
  const metaTitle = asString(input.metaTitle) || null;
  const metaDescription = asString(input.metaDescription) || null;
  const focusKeyword = asString(input.focusKeyword) || null;
  const canonicalUrl = asString(input.canonicalUrl) || null;
  const openGraphTitle = asString(input.openGraphTitle) || null;
  const openGraphDescription = asString(input.openGraphDescription) || null;
  const schemaMarkup = asString(input.schemaMarkup) || null;
  const tags = Array.isArray(input.tags) ? normalizeTags(input.tags.map(String)) : [];
  const featured = Boolean(input.featured);
  const scheduledDate = parseDate(input.scheduledAt);
  const scheduledAt = scheduledDate ? scheduledDate.toISOString() : null;
  const status = normalizeArticleStatus(asString(input.status), scheduledAt);

  const errors: string[] = [];
  if (!title) errors.push('Title is required');
  if (!slugInput) errors.push('Slug is required');
  if (!category) errors.push('Category is required');
  if (!excerpt) errors.push('Excerpt is required');
  if (!articleBody) errors.push('Body is required');
  if (!contentType || !['blog', 'news', 'article', 'review', 'sponsored'].includes(contentType)) {
    errors.push('Content type is invalid');
  }
  errors.push(...validateSeoFields({ metaTitle, metaDescription }));

  if (status === 'scheduled' && (!scheduledDate || scheduledDate.getTime() <= Date.now())) {
    errors.push('Scheduled posts require a future publish date');
  }

  if (errors.length > 0) {
    throw new ArticleValidationError(errors[0]);
  }

  return {
    title,
    slug: slugInput || slugifyTitle(title),
    author,
    contentType: contentType || 'blog',
    category,
    excerpt,
    body: articleBody,
    coverImage,
    metaTitle,
    metaDescription,
    focusKeyword,
    canonicalUrl,
    openGraphTitle,
    openGraphDescription,
    schemaMarkup,
    tags,
    featured,
    status,
    scheduledAt,
  };
}
