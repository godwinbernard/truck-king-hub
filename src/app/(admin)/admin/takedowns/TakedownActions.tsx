'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TakedownActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function resolve() {
    setLoading(true);
    const res = await fetch(`/api/admin/takedowns/${id}`, { method: 'PATCH' });
    if (!res.ok) {
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={resolve}
      disabled={loading}
      className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? 'Resolving…' : 'Mark Resolved'}
    </button>
  );
}
