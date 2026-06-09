import { runReindex } from '@/workers/jobs/reindex';
import { NextRequest } from 'next/server';

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await runReindex();
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[cron/reindex] error:', err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
