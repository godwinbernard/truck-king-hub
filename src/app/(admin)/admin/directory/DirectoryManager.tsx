'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Listing = {
  id: string;
  name: string;
  category: string;
  websiteUrl: string;
  description: string | null;
  bestFor: string | null;
  notes: string | null;
  brokenLink: boolean;
  lastReviewedAt: Date | null;
  createdAt: Date;
};

const CATEGORIES = ['load_board', 'insurance', 'fuel_card', 'factoring', 'compliance', 'equipment', 'association', 'training', 'other'];

const EMPTY_FORM = { name: '', category: '', websiteUrl: '', description: '', bestFor: '', notes: '', brokenLink: false };

export function DirectoryManager({ initialListings }: { initialListings: Listing[] }) {
  const [listings, setListings] = useState(initialListings);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  function startNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(listing: Listing) {
    setForm({
      name: listing.name,
      category: listing.category,
      websiteUrl: listing.websiteUrl,
      description: listing.description ?? '',
      bestFor: listing.bestFor ?? '',
      notes: listing.notes ?? '',
      brokenLink: listing.brokenLink,
    });
    setEditingId(listing.id);
    setShowForm(true);
    setError('');
  }

  function cancel() {
    setShowForm(false);
    setEditingId(null);
    setError('');
  }

  async function save() {
    if (!form.name || !form.websiteUrl || !form.category) {
      setError('Name, URL, and category are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const url = editingId ? `/api/admin/directory/${editingId}` : '/api/admin/directory';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          websiteUrl: form.websiteUrl,
          description: form.description || null,
          bestFor: form.bestFor || null,
          notes: form.notes || null,
          brokenLink: form.brokenLink,
          lastReviewedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setShowForm(false);
      setEditingId(null);
      router.refresh();
      const fresh = await fetch('/api/admin/directory-list').catch(() => null);
      if (!fresh) {
        window.location.reload();
      }
    } catch {
      setError('Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/admin/directory/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  }

  async function markBroken(id: string, broken: boolean) {
    await fetch(`/api/admin/directory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brokenLink: broken }),
    });
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, brokenLink: broken } : l));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-extrabold text-navy">Directory Listings ({listings.length})</h1>
        <button
          onClick={startNew}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: '#1e2f4f' }}
        >
          + Add Listing
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy mb-4">{editingId ? 'Edit Listing' : 'New Listing'}</h2>
          {error && <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DAT Freight & Analytics"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Website URL *</label>
              <input
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.dat.com"
                type="url"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Best For</label>
              <input
                value={form.bestFor}
                onChange={(e) => setForm({ ...form, bestFor: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Owner-operators, small fleets"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="brokenLink"
                checked={form.brokenLink}
                onChange={(e) => setForm({ ...form, brokenLink: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="brokenLink" className="text-sm text-slate-600">Mark as broken link</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={save}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#1e2f4f' }}
            >
              {loading ? 'Saving…' : editingId ? 'Update' : 'Add Listing'}
            </button>
            <button onClick={cancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Name</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Category</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">URL</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No listings yet. Add your first directory entry above.</td>
              </tr>
            )}
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">
                  {l.name}
                  {l.bestFor && <p className="text-xs text-slate-400 font-normal mt-0.5">{l.bestFor}</p>}
                </td>
                <td className="px-4 py-3 text-slate-500 capitalize">{l.category.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-xs text-blue-600 truncate max-w-[200px]">
                  <a href={l.websiteUrl} target="_blank" rel="noopener noreferrer" className="underline">{l.websiteUrl}</a>
                </td>
                <td className="px-4 py-3">
                  {l.brokenLink ? (
                    <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">Broken</span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded">Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <button onClick={() => startEdit(l)} className="text-blue-600 hover:underline">Edit</button>
                    <button
                      onClick={() => markBroken(l.id, !l.brokenLink)}
                      className="text-amber-600 hover:underline"
                    >
                      {l.brokenLink ? 'Unmark' : 'Flag'}
                    </button>
                    <button onClick={() => del(l.id, l.name)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
