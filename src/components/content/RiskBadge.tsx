const RISK_STYLES: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border border-red-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const RISK_LABELS: Record<string, string> = {
  high: 'High Priority',
  medium: 'Medium',
  low: 'Routine',
};

export function RiskBadge({ level }: { level: string }) {
  const style = RISK_STYLES[level];
  if (!style) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === 'high' ? 'bg-red-500' : level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} aria-hidden="true" />
      {RISK_LABELS[level]}
    </span>
  );
}
