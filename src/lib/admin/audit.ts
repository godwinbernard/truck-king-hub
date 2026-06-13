import { db } from '@/lib/db/client';
import { cmsAuditLogs } from '@/lib/db/schema';

export async function writeAuditLog(
  actor: string,
  action: string,
  targetType: string,
  targetName: string,
  details: Record<string, unknown> = {}
) {
  try {
    await db.insert(cmsAuditLogs).values({ actor, action, targetType, targetName, details });
  } catch {
    // Audit logging failure must never break the primary action
  }
}
