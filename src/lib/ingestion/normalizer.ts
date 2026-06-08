import { RawEntry } from './fetcher';

export type NormalizedItem = {
  title: string;
  originalUrl: string;
  publishedAt: Date | null;
  rawExcerpt: string | null;
  author: string | null;
  sourceId: string;
};

function slugify(title: string, url: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
  const suffix = url.split('/').pop()?.slice(0, 8) ?? Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export function normalize(entry: RawEntry, sourceId: string): NormalizedItem & { slug: string } {
  return {
    title: entry.title.trim(),
    slug: slugify(entry.title, entry.link),
    originalUrl: entry.link,
    publishedAt: entry.pubDate ? new Date(entry.pubDate) : null,
    rawExcerpt: entry.contentSnippet ? entry.contentSnippet.slice(0, 1000) : null,
    author: entry.author,
    sourceId,
  };
}
