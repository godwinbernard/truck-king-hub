import { runIngestion } from '@/workers/jobs/ingest';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export const maxDuration = 300;

export async function POST(_req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await runIngestion();
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[admin/ingest] error:', err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
