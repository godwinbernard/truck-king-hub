const COLORS: Record<string, string> = {
  compliance: 'bg-blue-100 text-blue-700',
  insurance: 'bg-green-100 text-green-700',
  freight: 'bg-yellow-100 text-yellow-700',
  fuel: 'bg-orange-100 text-orange-700',
  safety: 'bg-red-100 text-red-700',
  equipment: 'bg-purple-100 text-purple-700',
  community: 'bg-pink-100 text-pink-700',
  general: 'bg-slate-100 text-slate-600',
};

export function CategoryBadge({ category }: { category: string }) {
  const color = COLORS[category] ?? COLORS.general;
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${color}`}>
      {category}
    </span>
  );
}
