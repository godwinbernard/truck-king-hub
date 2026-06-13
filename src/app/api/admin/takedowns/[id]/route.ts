import { db } from '@/lib/db/client';
import { takedownRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { writeAuditLog } from '@/lib/admin/audit';
import { NextRequest } from 'next/server';

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const [row] = await db.select({ sourceName: takedownRequests.sourceName }).from(takedownRequests).where(eq(takedownRequests.id, id));
  await db.update(takedownRequests).set({ resolved: true }).where(eq(takedownRequests.id, id));
  if (row) {
    await writeAuditLog(session.email ?? 'admin', 'resolved_takedown', 'takedown_request', row.sourceName, { id });
  }
  return new Response(JSON.stringify({ ok: true }));
}
