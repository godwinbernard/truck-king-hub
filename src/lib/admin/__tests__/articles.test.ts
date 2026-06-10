import {
  buildArticlePayload,
  normalizeArticleStatus,
  normalizeTags,
  slugifyTitle,
  validateSeoFields,
} from '../articles';

describe('article helpers', () => {
  it('slugifies titles into URL-safe slugs', () => {
    expect(slugifyTitle('Top 10 Trucking Insurance Companies in the USA!')).toBe('top-10-trucking-insurance-companies-in-the-usa');
  });

  it('keeps an explicit slug when the editor edits it manually', () => {
    const payload = buildArticlePayload({
      title: 'Example',
      slug: 'custom-slug',
      author: 'Truck King Hub',
      contentType: 'blog',
      category: 'general',
      excerpt: 'Short summary',
      body: 'Body copy',
      tags: ['fleet', 'fleet', 'insurance '],
      status: 'draft',
    });
    expect(payload.slug).toBe('custom-slug');
    expect(payload.tags).toEqual(['fleet', 'insurance']);
  });

  it('normalizes tags by trimming, deduping, and dropping empties', () => {
    expect(normalizeTags([' fuel ', 'fuel', '', ' dispatch '])).toEqual(['fuel', 'dispatch']);
  });

  it('rejects meta titles longer than 60 characters', () => {
    expect(validateSeoFields({ metaTitle: 'x'.repeat(61) })).toEqual(['Meta title must be 60 characters or fewer']);
  });

  it('rejects meta descriptions longer than 160 characters', () => {
    expect(validateSeoFields({ metaDescription: 'x'.repeat(161) })).toEqual(['Meta description must be 160 characters or fewer']);
  });

  it('marks scheduled posts as scheduled only when publish time is present', () => {
    expect(normalizeArticleStatus('scheduled', null)).toBe('draft');
    expect(normalizeArticleStatus('scheduled', new Date().toISOString())).toBe('scheduled');
  });
});
