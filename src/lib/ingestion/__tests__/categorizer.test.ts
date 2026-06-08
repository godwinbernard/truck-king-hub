import { categorize } from '../categorizer';

describe('categorize', () => {
  it('detects compliance from title keywords', () => {
    const result = categorize('FMCSA Issues New ELD Mandate', null, 'general');
    expect(result.category).toBe('compliance');
    expect(result.audience).toContain('driver');
  });

  it('detects insurance from excerpt keywords', () => {
    const result = categorize('What Truckers Need to Know', 'Your CSA score affects your insurance premium at renewal', 'general');
    expect(result.category).toBe('insurance');
  });

  it('falls back to defaultCategory when no keywords match', () => {
    const result = categorize('Industry Update', 'General news about trucking', 'freight');
    expect(result.category).toBe('freight');
  });

  it('returns correct audience for compliance', () => {
    const result = categorize('DOT inspection blitz announced', null, 'general');
    expect(result.audience).toEqual(['driver', 'owner_operator', 'small_fleet']);
  });
});
