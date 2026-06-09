import { db } from '@/lib/db/client';
import { sources } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db.select().from(sources).orderBy(sources.name);
  return Response.json({ sources: rows });
}
