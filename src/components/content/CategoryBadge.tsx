const COLORS: Record<string, string> = {
  compliance: 'bg-blue-50 text-blue-700 border border-blue-200',
  insurance:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  freight:    'bg-amber-50 text-amber-700 border border-amber-200',
  fuel:       'bg-orange-50 text-orange-700 border border-orange-200',
  safety:     'bg-red-50 text-red-700 border border-red-200',
  equipment:  'bg-purple-50 text-purple-700 border border-purple-200',
  community:  'bg-pink-50 text-pink-700 border border-pink-200',
  general:    'bg-slate-100 text-slate-600 border border-slate-200',
};

const LABELS: Record<string, string> = {
  compliance: 'Compliance',
  insurance:  'Insurance',
  freight:    'Freight',
  fuel:       'Fuel',
  safety:     'Safety',
  equipment:  'Equipment',
  community:  'Community',
  general:    'General',
};

export function CategoryBadge({ category }: { category: string }) {
  const color = COLORS[category] ?? COLORS.general;
  const label = LABELS[category] ?? category;
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}
