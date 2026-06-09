'use client';

import { useState, useEffect } from 'react';

type Source = {
  id: string;
  name: string;
  updateMethod: string;
  defaultCategory: string;
  active: boolean;
  lastFetchedAt: string | null;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/sources')
      .then((r) => r.json())
      .then((data) => setSources(data.sources ?? []));
  }, []);

  async function runIngestion() {
    setRunning(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/ingest', { method: 'POST' });
      const data = await res.json();
      setMessage(data.ok ? 'Ingestion complete. Refresh to see new content.' : `Error: ${data.error}`);
    } catch {
      setMessage('Network error — try again.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-extrabold text-navy">Sources</h1>
        <button
          onClick={runIngestion}
          disabled={running}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {running ? 'Running…' : 'Run Ingestion Now'}
        </button>
      </div>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}
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
            {sources.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{s.updateMethod}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{s.defaultCategory}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
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
