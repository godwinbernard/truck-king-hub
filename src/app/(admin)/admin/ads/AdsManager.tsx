'use client';
import { useState } from 'react';

type Ad = {
  id: string;
  name: string;
  placement: string;
  sponsor: string;
  status: string;
  impressions: number;
  clicks: number;
  dailyBudget: number;
  createdAt: Date;
};

const PLACEMENTS = [
  'homepage_leaderboard',
  'homepage_mid',
  'homepage_sidebar',
  'homepage_footer',
  'article_top',
  'article_mid',
  'article_bottom',
  'brief_sidebar',
  'newsletter',
];

const STATUSES = ['active', 'paused', 'scheduled', 'ended'];

const EMPTY_FORM = {
  name: '',
  placement: '',
  sponsor: '',
  status: 'active',
  dailyBudget: '',
};

export function AdsManager({ initialAds }: { initialAds: Ad[] }) {
  const [ads, setAds] = useState(initialAds);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function startNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(ad: Ad) {
    setForm({
      name: ad.name,
      placement: ad.placement,
      sponsor: ad.sponsor,
      status: ad.status,
      dailyBudget: ad.dailyBudget > 0 ? String(ad.dailyBudget) : '',
    });
    setEditingId(ad.id);
    setShowForm(true);
    setError('');
  }

  function cancel() {
    setShowForm(false);
    setEditingId(null);
    setError('');
  }

  async function save() {
    if (!form.name || !form.placement || !form.sponsor) {
      setError('Name, placement, and sponsor are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        placement: form.placement,
        sponsor: form.sponsor,
        status: form.status,
        dailyBudget: form.dailyBudget ? parseInt(form.dailyBudget, 10) : 0,
      };

      if (editingId) {
        const res = await fetch(`/api/admin/ads/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setAds((prev) => prev.map((a) => a.id === editingId ? { ...a, ...payload } : a));
      } else {
        const res = await fetch('/api/admin/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Create failed');
        const data = await res.json();
        setAds((prev) => [data.ad, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
    } catch {
      setError('Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: string) {
    await fetch(`/api/admin/ads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete ad "${name}"?`)) return;
    const res = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
    if (res.ok) setAds((prev) => prev.filter((a) => a.id !== id));
  }

  const statusStyle: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    paused:    'bg-amber-100 text-amber-700',
    scheduled: 'bg-blue-100 text-blue-700',
    ended:     'bg-slate-100 text-slate-500',
  };

  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clicks, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const activeCount = ads.filter((a) => a.status === 'active').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-navy">Ad Campaigns ({ads.length})</h1>
          <p className="text-sm text-slate-500 mt-1">Manage sponsored placements and ad inventory.</p>
        </div>
        <button
          onClick={startNew}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: '#1e2f4f' }}
        >
          + New Campaign
        </button>
      </div>

      {/* Stats strip */}
      {ads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Active', value: String(activeCount) },
            { label: 'Total Impressions', value: totalImpressions.toLocaleString() },
            { label: 'Total Clicks', value: totalClicks.toLocaleString() },
            { label: 'Avg CTR', value: `${ctr}%` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="text-xl font-extrabold text-navy mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy mb-4">{editingId ? 'Edit Campaign' : 'New Campaign'}</h2>
          {error && (
            <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Campaign Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Geico Commercial Auto Q3"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sponsor *</label>
              <input
                value={form.sponsor}
                onChange={(e) => setForm({ ...form, sponsor: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Geico"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Placement *</label>
              <select
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select placement…</option>
                {PLACEMENTS.map((p) => (
                  <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Daily Budget ($)</label>
              <input
                value={form.dailyBudget}
                onChange={(e) => setForm({ ...form, dailyBudget: e.target.value })}
                type="number"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={save}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#1e2f4f' }}
            >
              {loading ? 'Saving…' : editingId ? 'Update' : 'Create Campaign'}
            </button>
            <button
              onClick={cancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Campaign</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Placement</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Impr.</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Clicks</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">CTR</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No campaigns yet. Create your first ad placement above.
                </td>
              </tr>
            )}
            {ads.map((ad) => {
              const adCtr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '—';
              return (
                <tr key={ad.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{ad.name}</p>
                    <p className="text-xs text-slate-400">{ad.sponsor}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{ad.placement.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-slate-600">{ad.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{ad.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{adCtr}{adCtr !== '—' ? '%' : ''}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusStyle[ad.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
                      <button onClick={() => startEdit(ad)} className="text-blue-600 hover:underline">Edit</button>
                      {ad.status === 'active' && (
                        <button onClick={() => changeStatus(ad.id, 'paused')} className="text-amber-600 hover:underline">Pause</button>
                      )}
                      {ad.status === 'paused' && (
                        <button onClick={() => changeStatus(ad.id, 'active')} className="text-green-600 hover:underline">Resume</button>
                      )}
                      {ad.status !== 'ended' && (
                        <button onClick={() => changeStatus(ad.id, 'ended')} className="text-slate-500 hover:underline">End</button>
                      )}
                      <button onClick={() => del(ad.id, ad.name)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
