import { db } from '@/lib/db/client';
import { sources } from '@/lib/db/schema';

export default async function SourcesPage() {
  const rows = await db.select().from(sources).orderBy(sources.name);
  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Sources</h1>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Name</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Method</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Category</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Last Fetch</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{s.updateMethod}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{s.defaultCategory}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{s.lastFetchedAt ? new Date(s.lastFetchedAt).toLocaleString() : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
