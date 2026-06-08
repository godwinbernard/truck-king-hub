import { classifyRisk } from '../classifier';

describe('classifyRisk', () => {
  it('returns high for Federal Register API source type', () => {
    expect(classifyRisk('Any Title', null, 'api')).toBe('high');
  });

  it('returns high for enforcement keyword in title', () => {
    expect(classifyRisk('FMCSA Enforcement Action Against Carrier', null, 'rss')).toBe('high');
  });

  it('returns medium for insurance keyword', () => {
    expect(classifyRisk('How Insurance Premiums Are Calculated', null, 'rss')).toBe('medium');
  });

  it('returns low for general news', () => {
    expect(classifyRisk('Truck Stop Opens New Location', null, 'rss')).toBe('low');
  });
});
