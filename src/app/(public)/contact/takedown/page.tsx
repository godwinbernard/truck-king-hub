'use client';
import { useState } from 'react';

export default function TakedownPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      sourceName: form.get('sourceName'),
      url: form.get('url'),
      reason: form.get('reason'),
      requesterEmail: form.get('requesterEmail'),
    };
    const res = await fetch('/api/takedown', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) setSubmitted(true);
    else setError('Something went wrong. Please try again.');
  }

  if (submitted) return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-navy mb-2">Request Submitted</h1>
      <p className="text-slate-600 text-sm">Thank you. We will review your request and respond within 5 business days.</p>
    </div>
  );

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-navy mb-2">Content Takedown Request</h1>
      <p className="text-slate-500 text-sm mb-6">If you believe Truck King Hub has published content that violates your rights, infringes on your copyright, or violates our content policy, please use this form. We review all requests within 5 business days.</p>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Source name *</label>
          <input name="sourceName" required className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">URL of content *</label>
          <input name="url" type="url" required className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Reason</label>
          <textarea name="reason" rows={3} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Your email</label>
          <input name="requesterEmail" type="email" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        </div>
        <button type="submit" className="bg-navy text-white px-5 py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors">
          Submit Request
        </button>
      </form>
    </div>
  );
}
