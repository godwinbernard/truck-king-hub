import { ArticleEditor } from '@/components/admin/ArticleEditor';
import Link from 'next/link';

export default function NewArticlePage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/articles" className="text-sm font-medium text-silver hover:text-crimson">
          Back to posts
        </Link>
        <span className="text-silver">/</span>
        <h1 className="text-3xl font-editorial font-bold text-ink">New Article</h1>
      </div>
      <ArticleEditor />
    </div>
  );
}
