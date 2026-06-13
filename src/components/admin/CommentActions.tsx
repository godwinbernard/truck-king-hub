'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Action = 'approve' | 'reject' | 'flag' | 'delete';

const ACTION_CONFIG: Record<Action, { label: string; payload?: Record<string, unknown>; method: string; tone: string }> = {
  approve: { label: 'Approve', payload: { status: 'approved' }, method: 'PATCH', tone: 'text-green-600 hover:underline' },
  reject:  { label: 'Reject',  payload: { status: 'rejected' }, method: 'PATCH', tone: 'text-slate-500 hover:underline' },
  flag:    { label: 'Flag',    payload: { flagged: true },       method: 'PATCH', tone: 'text-amber-600 hover:underline' },
  delete:  { label: 'Delete',  method: 'DELETE', tone: 'text-red-600 hover:underline' },
};

export function CommentActions({ id, status, flagged }: { id: string; status: string; flagged: boolean }) {
  const [loading, setLoading] = useState<Action | null>(null);
  const router = useRouter();

  async function act(action: Action) {
    if (action === 'delete' && !confirm('Delete this comment?')) return;
    const config = ACTION_CONFIG[action];
    setLoading(action);
    try {
      await fetch(`/api/admin/comments/${id}`, {
        method: config.method,
        headers: config.payload ? { 'Content-Type': 'application/json' } : {},
        body: config.payload ? JSON.stringify(config.payload) : undefined,
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  const actions: Action[] = [];
  if (status === 'pending') { actions.push('approve', 'reject'); }
  if (status === 'approved') { actions.push('reject'); }
  if (status === 'rejected') { actions.push('approve'); }
  if (!flagged) actions.push('flag');
  actions.push('delete');

  return (
    <div className="flex items-center gap-3 mt-2 text-xs font-semibold flex-wrap">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => act(action)}
          disabled={loading !== null}
          className={`${ACTION_CONFIG[action].tone} disabled:opacity-40`}
        >
          {loading === action ? '…' : ACTION_CONFIG[action].label}
        </button>
      ))}
    </div>
  );
}
