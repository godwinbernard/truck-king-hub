import { getSession } from '@/lib/admin/session';

export async function POST() {
  const session = await getSession();
  session.destroy();
  return new Response(JSON.stringify({ ok: true }));
}
