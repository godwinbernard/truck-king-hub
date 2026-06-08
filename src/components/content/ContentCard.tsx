import Link from 'next/link';
import { CategoryBadge } from './CategoryBadge';
import { RiskBadge } from './RiskBadge';

type Props = {
  title: string;
  slug: string;
  sourceName: string;
  publishedAt: Date | null;
  category: string;
  riskLevel: string;
  aiSummary: string | null;
  whyItMatters: string | null;
};

export function ContentCard({ title, slug, sourceName, publishedAt, category, riskLevel, aiSummary, whyItMatters }: Props) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Link
      href={`/item/${slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 hover:border-navy/40 hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={category} />
          <RiskBadge level={riskLevel} />
        </div>
        {date && <span className="text-xs text-slate-400 tabular-nums flex-shrink-0">{date}</span>}
      </div>
      <p className="text-sm font-semibold text-slate-800 group-hover:text-navy leading-snug line-clamp-2 transition-colors">
        {title}
      </p>
      {aiSummary && (
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">{aiSummary}</p>
      )}
      {whyItMatters && (
        <div className="mt-2 bg-gold/10 border-l-2 border-gold px-2.5 py-1.5 rounded-r">
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{whyItMatters}</p>
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2">{sourceName}</p>
    </Link>
  );
}
