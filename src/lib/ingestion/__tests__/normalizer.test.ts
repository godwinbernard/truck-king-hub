import { normalize } from '../normalizer';
import { RawEntry } from '../fetcher';

const entry: RawEntry = {
  title: 'FMCSA Issues New ELD Rules',
  link: 'https://fmcsa.dot.gov/news/eld-rules',
  pubDate: '2026-06-05T10:00:00Z',
  contentSnippet: 'The FMCSA announced new ELD rules affecting all CMV operators.',
  author: 'FMCSA',
};

describe('normalize', () => {
  it('maps entry fields to NormalizedItem shape', () => {
    const result = normalize(entry, 'source-uuid-123');
    expect(result.title).toBe('FMCSA Issues New ELD Rules');
    expect(result.originalUrl).toBe('https://fmcsa.dot.gov/news/eld-rules');
    expect(result.sourceId).toBe('source-uuid-123');
    expect(result.publishedAt).toBeInstanceOf(Date);
    expect(result.rawExcerpt).toContain('FMCSA');
  });

  it('generates a slug from the title', () => {
    const result = normalize(entry, 'source-uuid-123');
    expect(result.slug).toMatch(/^fmcsa-issues-new-eld-rules/);
  });

  it('handles null pubDate gracefully', () => {
    const result = normalize({ ...entry, pubDate: null }, 'source-uuid-123');
    expect(result.publishedAt).toBeNull();
  });
});
