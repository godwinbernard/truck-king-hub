import { fetchFederalRegister } from '../fetcher';

// Integration test — requires internet access
describe('fetchFederalRegister', () => {
  it('returns an array of entries with required fields', async () => {
    const entries = await fetchFederalRegister();
    expect(Array.isArray(entries)).toBe(true);
    if (entries.length > 0) {
      expect(entries[0]).toHaveProperty('title');
      expect(entries[0]).toHaveProperty('link');
    }
  }, 15000);
});
