'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    });
    if (res.ok) router.push('/admin');
    else setError('Invalid email or password.');
  }

  return (
    <div className="min-h-[100dvh] flex items-start justify-center bg-slate-50 px-4 py-8 sm:items-center sm:py-12">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Truck King Hub</p>
          <h1 className="mt-2 text-xl font-extrabold text-navy">Admin Login</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Sign in to manage articles, SEO, media, and trucking content.
          </p>
        </div>
        {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input name="email" type="email" required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
            <input name="password" type="password" required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1e2f4f' }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
