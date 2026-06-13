import { db } from '@/lib/db/client';
import { takedownRequests } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { TakedownActions } from './TakedownActions';

export default async function TakedownsPage() {
  const requests = await db.select().from(takedownRequests).orderBy(desc(takedownRequests.createdAt));
  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Takedown Requests ({requests.length})</h1>
      <div className="space-y-4">
        {requests.length === 0 && <p className="text-slate-400 text-sm">No takedown requests.</p>}
        {requests.map((r) => (
          <div key={r.id} className={`bg-white border border-slate-200 rounded-lg p-4 ${r.resolved ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${r.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {r.resolved ? 'Resolved' : 'Open'}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="font-semibold text-navy text-sm">{r.sourceName}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline break-all">{r.url}</a>
                {r.reason && <p className="text-sm text-slate-600 mt-2">{r.reason}</p>}
                {r.requesterEmail && <p className="text-xs text-slate-400 mt-1">Contact: {r.requesterEmail}</p>}
              </div>
              {!r.resolved && <TakedownActions id={r.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
