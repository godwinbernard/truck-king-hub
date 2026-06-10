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
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-navy mb-2">Request Submitted</h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Thank you. We will review your request and respond within 5 business days.
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Legal</p>
          <h1 className="text-2xl font-bold text-navy mb-3 sm:text-3xl">Content Takedown Request</h1>
          <p className="text-slate-500 text-sm leading-relaxed sm:text-base mb-6">
            If you believe Truck King Hub has published content that violates your rights, infringes on your copyright, or violates our content policy, please use this form.
            We review all requests within 5 business days.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Source name *</label>
                <input
                  name="sourceName"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Your email</label>
                <input
                  name="requesterEmail"
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">URL of content *</label>
              <input
                name="url"
                type="url"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Reason</label>
              <textarea
                name="reason"
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-navy text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              Submit Request
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Before you submit</p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>• Provide the exact page URL where the content appears.</li>
              <li>• Include supporting details for copyright or policy concerns.</li>
              <li>• Use the email field if you want a response from our team.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Review timeline</p>
            <p className="text-sm leading-relaxed text-slate-600">
              We review takedown requests within 5 business days and contact you if we need more information.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
