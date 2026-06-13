import Link from 'next/link';

export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson mb-2">Sources</p>
        <h1 className="text-3xl font-editorial font-bold text-ink">Ingestion pipeline retired</h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal">
          The old source-ingestion flow is no longer active, so this section is now a dead end by design.
          Article curation, editorial queueing, and publishing live in the article and queue screens instead.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-silver-light bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Recommended next steps</p>
          <ul className="mt-4 space-y-3 text-sm text-charcoal">
            <li>Use <Link href="/admin/articles" className="font-semibold text-crimson hover:underline">Articles</Link> for drafting and publishing.</li>
            <li>Use <Link href="/admin/queue" className="font-semibold text-crimson hover:underline">Queue</Link> for pending review and scheduled posts.</li>
            <li>Use <Link href="/admin/directory" className="font-semibold text-crimson hover:underline">Directory</Link> for curated resources.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-silver-light bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Why this changed</p>
          <p className="mt-3 text-sm leading-relaxed text-charcoal">
            The newsroom no longer depends on third-party source polling, so keeping a source dashboard in the
            sidebar would only add maintenance overhead without serving a live workflow.
          </p>
        </div>
      </div>
    </div>
  );
}
