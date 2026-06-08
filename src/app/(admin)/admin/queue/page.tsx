'use client';
import { useEffect, useState } from 'react';

type QueueItem = {
  id: string; title: string; category: string; riskLevel: string;
  publishedAt: string | null; rawExcerpt: string | null;
  aiSummary: string | null; whyItMatters: string | null; sourceName: string;
};

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [editing, setEditing] = useState<Record<string, { aiSummary: string; whyItMatters: string }>>({});

  useEffect(() => {
    fetch('/api/admin/queue').then((r) => r.json()).then(setItems);
  }, []);

  async function action(id: string, type: 'approve' | 'reject') {
    const edit = editing[id];
    await fetch(`/api/admin/queue/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: type, aiSummary: edit?.aiSummary, whyItMatters: edit?.whyItMatters }),
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold text-navy mb-6">Review Queue ({items.length})</h1>
      {items.length === 0 && <p className="text-slate-400 text-sm">Queue is empty.</p>}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-5 border-l-4 border-l-red-400">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded uppercase">{item.riskLevel}</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{item.category}</span>
              <span className="text-xs text-slate-400">{item.sourceName}</span>
            </div>
            <p className="font-semibold text-navy mb-3">{item.title}</p>
            {item.rawExcerpt && (
              <details className="mb-3">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Raw excerpt</summary>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.rawExcerpt}</p>
              </details>
            )}
            <div className="space-y-2 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">AI Summary</label>
                <textarea
                  rows={3}
                  defaultValue={item.aiSummary ?? ''}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], aiSummary: e.target.value } }))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Why It Matters</label>
                <input
                  defaultValue={item.whyItMatters ?? ''}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], whyItMatters: e.target.value } }))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => action(item.id, 'approve')} className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded hover:bg-green-700 transition-colors">Approve</button>
              <button onClick={() => action(item.id, 'reject')} className="bg-red-100 text-red-700 text-xs font-semibold px-4 py-2 rounded hover:bg-red-200 transition-colors">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
