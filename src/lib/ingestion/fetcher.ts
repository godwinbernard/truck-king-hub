import Parser from 'rss-parser';

export type RawEntry = {
  title: string;
  link: string;
  pubDate: string | null;
  contentSnippet: string | null;
  author: string | null;
};

const rssParser = new Parser();

export async function fetchRss(feedUrl: string): Promise<RawEntry[]> {
  const feed = await rssParser.parseURL(feedUrl);
  return feed.items.map((item) => ({
    title: item.title ?? '',
    link: item.link ?? '',
    pubDate: item.pubDate ?? null,
    contentSnippet: item.contentSnippet ?? null,
    author: item.creator ?? item.author ?? null,
  }));
}

export async function fetchFederalRegister(): Promise<RawEntry[]> {
  const url =
    'https://www.federalregister.gov/api/v1/articles.json' +
    '?conditions[agencies][]=federal-motor-carrier-safety-administration' +
    '&order=newest&per_page=20&fields[]=title&fields[]=html_url' +
    '&fields[]=publication_date&fields[]=abstract&fields[]=agencies';

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Federal Register API error: ${res.status}`);
  const data = await res.json();

  return (data.results ?? []).map((item: Record<string, string>) => ({
    title: item.title ?? '',
    link: item.html_url ?? '',
    pubDate: item.publication_date ?? null,
    contentSnippet: item.abstract ?? null,
    author: null,
  }));
}
