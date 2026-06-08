export function RiskBadge({ level }: { level: string }) {
  if (level !== 'high') return null;
  return (
    <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
      High Priority
    </span>
  );
}
