'use client';
import { useState } from 'react';

type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActiveAt: Date | null;
  createdAt: Date;
};

const ROLES = ['Admin', 'Editor', 'Author', 'SEO Manager', 'Analyst', 'Advertiser'];
const STATUSES = ['active', 'invited', 'suspended'];

const EMPTY_FORM = { name: '', email: '', role: 'Author' };

export function UsersManager({ initialUsers }: { initialUsers: CmsUser[] }) {
  const [users, setUsers] = useState(initialUsers);
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

  function startEdit(user: CmsUser) {
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
    setShowForm(true);
    setError('');
  }

  function cancel() {
    setShowForm(false);
    setEditingId(null);
    setError('');
  }

  async function save() {
    if (!form.name || !form.email || !form.role) {
      setError('Name, email, and role are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/users/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, role: form.role }),
        });
        if (!res.ok) throw new Error('Update failed');
        setUsers((prev) => prev.map((u) => u.id === editingId ? { ...u, name: form.name, role: form.role } : u));
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.status === 409) { setError('That email already exists.'); setLoading(false); return; }
        if (!res.ok) throw new Error('Create failed');
        const data = await res.json();
        setUsers((prev) => [data.user, ...prev]);
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
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status } : u));
  }

  async function del(id: string, name: string) {
    if (!confirm(`Remove "${name}" from the CMS team?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  const statusTone: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    invited: 'bg-amber-100 text-amber-700',
    suspended: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-navy">CMS Team ({users.length})</h1>
          <p className="text-sm text-slate-500 mt-1">Manage editorial team access and roles. Admin-only.</p>
        </div>
        <button
          onClick={startNew}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: '#1e2f4f' }}
        >
          + Add Member
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy mb-4">{editingId ? 'Edit Member' : 'Add Team Member'}</h2>
          {error && <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jordan Wells"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email *</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                disabled={!!editingId}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                placeholder="jordan@truckkinghub.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={save}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#1e2f4f' }}
            >
              {loading ? 'Saving…' : editingId ? 'Update' : 'Add Member'}
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
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Email</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Role</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No team members yet. Add editors, authors, and analysts above.</td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusTone[u.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
                    <button onClick={() => startEdit(u)} className="text-blue-600 hover:underline">Edit</button>
                    {STATUSES.filter((s) => s !== u.status).map((s) => (
                      <button key={s} onClick={() => changeStatus(u.id, s)} className="text-amber-600 hover:underline capitalize">{s}</button>
                    ))}
                    <button onClick={() => del(u.id, u.name)} className="text-red-600 hover:underline">Remove</button>
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
