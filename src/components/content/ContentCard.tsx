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
  const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  return (
    <div className="border-l-4 border-navy pl-4 py-2">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <CategoryBadge category={category} />
        <RiskBadge level={riskLevel} />
      </div>
      <Link href={`/item/${slug}`} className="font-semibold text-navy hover:text-navy-light text-sm leading-snug">
        {title}
      </Link>
      <p className="text-xs text-slate-500 mt-0.5">{sourceName}{date ? ` · ${date}` : ''}</p>
      {aiSummary && <p className="text-sm text-slate-700 mt-1 leading-relaxed">{aiSummary}</p>}
      {whyItMatters && <p className="text-xs text-slate-500 mt-1 italic">{whyItMatters}</p>}
    </div>
  );
}
