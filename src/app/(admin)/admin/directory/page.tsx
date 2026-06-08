import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';

export default async function DirectoryAdminPage() {
  const listings = await db.select().from(directoryListings).orderBy(directoryListings.name);
  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Directory Listings ({listings.length})</h1>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Name</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Category</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">URL</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Broken</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Last Reviewed</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{l.name}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{l.category}</td>
                <td className="px-4 py-3 text-xs text-blue-600 truncate max-w-xs">
                  <a href={l.websiteUrl} target="_blank" rel="noopener noreferrer" className="underline">{l.websiteUrl}</a>
                </td>
                <td className="px-4 py-3">
                  {l.brokenLink && <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">Broken</span>}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{l.lastReviewedAt ? new Date(l.lastReviewedAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
