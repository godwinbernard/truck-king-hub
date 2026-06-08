import { isDuplicate, findDuplicateGroupId } from '../deduplicator';

jest.mock('@/lib/db/client', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([]),
  },
}));

describe('isDuplicate', () => {
  it('returns false when no existing item found', async () => {
    const result = await isDuplicate('https://example.com/new-article');
    expect(result).toBe(false);
  });
});

describe('findDuplicateGroupId', () => {
  it('returns null when publishedAt is null', async () => {
    const result = await findDuplicateGroupId('Some Title', null);
    expect(result).toBeNull();
  });
});
