import { db } from '@/lib/db/client';
import { contentItems, sources } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

export default async function AdminDashboard() {
  const [pendingRows, sourcesRows] = await Promise.all([
    db.select({ count: count() }).from(contentItems).where(eq(contentItems.reviewStatus, 'pending_review')),
    db.select().from(sources).orderBy(sources.name),
  ]);

  const pendingCount = pendingRows[0]?.count ?? 0;

  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Pending Review</p>
          <p className="text-3xl font-extrabold text-navy">{pendingCount}</p>
          <a href="/admin/queue" className="text-xs text-blue-600 underline mt-1 inline-block">Go to queue →</a>
        </div>
      </div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Source Health</h2>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Source</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Type</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Last Fetched</th>
            </tr>
          </thead>
          <tbody>
            {sourcesRows.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{s.updateMethod}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {s.lastFetchedAt ? new Date(s.lastFetchedAt).toLocaleString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
