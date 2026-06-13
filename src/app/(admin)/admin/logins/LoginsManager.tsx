'use client';

import { useState } from 'react';

type AdminLogin = {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
};

const ROLES = ['Admin', 'Editor', 'Author', 'SEO Manager', 'Analyst', 'Advertiser'];

type FormState = {
  email: string;
  password: string;
  role: string;
};

const EMPTY_FORM: FormState = { email: '', password: '', role: 'Editor' };

export function LoginsManager({ initialUsers }: { initialUsers: AdminLogin[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function startNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(user: AdminLogin) {
    setForm({ email: user.email, password: '', role: user.role });
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
    if (!form.email || !form.role || (!editingId && !form.password)) {
      setError('Email, role, and password are required when creating a login.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/logins/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: form.role,
            password: form.password || undefined,
          }),
        });
        if (!res.ok) throw new Error('Update failed');
        setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, role: form.role } : u)));
      } else {
        const res = await fetch('/api/admin/logins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.status === 409) {
          setError('That email already exists.');
          return;
        }
        if (!res.ok) throw new Error('Create failed');
        const data = await res.json();
        setUsers((prev) => [data.user, ...prev]);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch {
      setError('Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function del(id: string, email: string) {
    if (!confirm(`Remove login "${email}"?`)) return;
    const res = await fetch(`/api/admin/logins/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-navy">Login Accounts ({users.length})</h1>
          <p className="text-sm text-slate-500 mt-1">Create restricted admin logins for Editors, Authors, and other CMS roles.</p>
        </div>
        <button
          onClick={startNew}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: '#1e2f4f' }}
        >
          + Add Login
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy mb-4">{editingId ? 'Edit Login' : 'Add Login'}</h2>
          {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Email *</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                disabled={!!editingId}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                placeholder="editor@truckkinghub.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Password {editingId ? '(leave blank to keep existing)' : '*'}
              </label>
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type="password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={save}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#1e2f4f' }}
            >
              {loading ? 'Saving…' : editingId ? 'Update Login' : 'Create Login'}
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
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Email</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Role</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Created</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                  No login accounts yet.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">{u.role}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                    <button onClick={() => startEdit(u)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => del(u.id, u.email)} className="text-red-600 hover:underline">
                      Remove
                    </button>
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
