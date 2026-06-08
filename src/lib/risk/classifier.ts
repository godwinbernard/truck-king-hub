export type RiskLevel = 'low' | 'medium' | 'high';

const HIGH_KEYWORDS = [
  'fmcsa rule', 'enforcement', 'penalty', 'federal register',
  'clearinghouse', 'violation', 'fine', 'mandate', 'proposed rule',
  'final rule', 'compliance deadline', 'out of service',
];

const MEDIUM_KEYWORDS = [
  'insurance', 'csa score', 'safety rating', 'market analysis',
  'rate forecast', 'premium', 'underwriting',
];

export function classifyRisk(
  title: string,
  rawExcerpt: string | null,
  sourceType: string
): RiskLevel {
  if (sourceType === 'api') return 'high'; // Federal Register always high

  const text = `${title} ${rawExcerpt ?? ''}`.toLowerCase();

  if (HIGH_KEYWORDS.some((kw) => text.includes(kw))) return 'high';
  if (MEDIUM_KEYWORDS.some((kw) => text.includes(kw))) return 'medium';
  return 'low';
}
