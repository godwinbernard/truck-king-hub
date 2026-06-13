'use client';

import { useState } from 'react';

export function ArticleCommentForm({ articleId }: { articleId: string }) {
  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, authorName, body }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Comment submission failed');
        return;
      }

      setAuthorName('');
      setBody('');
      setMessage(data.message ?? 'Comment submitted for review.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border px-4 py-3 text-sm bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#6b7280] focus:border-[#F5C518] focus:outline-none focus:ring-1 focus:ring-[#F5C518]/40';

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-5">
      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#F5C518' }}>
        Leave a Comment
      </p>
      <p className="mt-2 text-sm" style={{ color: '#9ca3af' }}>
        Reader comments are reviewed before they appear publicly.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <label
            className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: '#6b7280' }}
            htmlFor="comment-name"
          >
            Name
          </label>
          <input
            id="comment-name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={inputCls}
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: '#6b7280' }}
            htmlFor="comment-body"
          >
            Comment
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className={inputCls}
            placeholder="Add your perspective, question, or correction."
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-3 rounded-xl border border-[#F5C518]/30 bg-[#F5C518]/10 px-4 py-3 text-sm font-semibold" style={{ color: '#F5C518' }}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={loading || !authorName.trim() || !body.trim()}
        className="mt-4 px-5 py-3 text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: '#F5C518', color: '#0d0d0d' }}
      >
        {loading ? 'Submitting…' : 'Submit Comment'}
      </button>
    </div>
  );
}
