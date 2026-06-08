export type Category =
  | 'compliance' | 'insurance' | 'freight' | 'community'
  | 'equipment' | 'fuel' | 'safety' | 'general';

export type Audience = 'driver' | 'owner_operator' | 'small_fleet';

const COMPLIANCE_KEYWORDS = [
  'fmcsa', 'eld', 'clearinghouse', 'dot', 'federal register',
  'regulation', 'compliance', 'authority', 'inspection', 'violation',
  'hours of service', 'hos', 'cdl', 'drug test', 'alcohol test',
];

const INSURANCE_KEYWORDS = [
  'insurance', 'premium', 'csa score', 'safety rating', 'liability',
  'cargo coverage', 'physical damage', 'underwriter', 'renewal', 'claim',
];

const FREIGHT_KEYWORDS = [
  'spot rate', 'load board', 'freight market', 'capacity', 'broker',
  'shipper', 'lane', 'truckload', 'ltl', 'rate per mile',
];

const FUEL_KEYWORDS = ['fuel', 'diesel', 'gas price', 'fuel card', 'def'];

const EQUIPMENT_KEYWORDS = [
  'truck', 'trailer', 'equipment', 'repair', 'maintenance', 'tires',
  'breakdown', 'parts', 'dealership',
];

const SAFETY_KEYWORDS = [
  'safety', 'accident', 'crash', 'fatigue', 'blitz', 'inspection week',
  'roadcheck', 'enforcement',
];

const AUDIENCE_MAP: Record<Category, Audience[]> = {
  compliance: ['driver', 'owner_operator', 'small_fleet'],
  insurance: ['owner_operator', 'small_fleet'],
  freight: ['driver', 'owner_operator'],
  community: ['driver', 'owner_operator', 'small_fleet'],
  equipment: ['owner_operator', 'small_fleet'],
  fuel: ['driver', 'owner_operator'],
  safety: ['driver', 'owner_operator', 'small_fleet'],
  general: ['driver', 'owner_operator', 'small_fleet'],
};

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => {
    // Use word-boundary matching for single-word keywords to avoid
    // partial matches (e.g. "truck" matching inside "trucking").
    if (!kw.includes(' ')) {
      return new RegExp(`\\b${kw}\\b`).test(lower);
    }
    return lower.includes(kw);
  });
}

export function categorize(
  title: string,
  rawExcerpt: string | null,
  defaultCategory: Category
): { category: Category; audience: Audience[] } {
  const text = `${title} ${rawExcerpt ?? ''}`;

  let category: Category = defaultCategory;

  if (matchesKeywords(text, COMPLIANCE_KEYWORDS)) category = 'compliance';
  else if (matchesKeywords(text, INSURANCE_KEYWORDS)) category = 'insurance';
  else if (matchesKeywords(text, FUEL_KEYWORDS)) category = 'fuel';
  else if (matchesKeywords(text, SAFETY_KEYWORDS)) category = 'safety';
  else if (matchesKeywords(text, EQUIPMENT_KEYWORDS)) category = 'equipment';
  else if (matchesKeywords(text, FREIGHT_KEYWORDS)) category = 'freight';

  return { category, audience: AUDIENCE_MAP[category] };
}
