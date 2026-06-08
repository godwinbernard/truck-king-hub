import { db } from '@/lib/db/client';
import { contentItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.adminId) return new Response('Unauthorized', { status: 401 });

  const { id } = await params;
  const { action, aiSummary, whyItMatters } = await req.json();

  if (action === 'approve') {
    await db.update(contentItems)
      .set({ reviewStatus: 'approved', ...(aiSummary ? { aiSummary } : {}), ...(whyItMatters ? { whyItMatters } : {}) })
      .where(eq(contentItems.id, id));
  } else if (action === 'reject') {
    await db.update(contentItems).set({ reviewStatus: 'rejected' }).where(eq(contentItems.id, id));
  } else {
    return new Response('Invalid action', { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }));
}
