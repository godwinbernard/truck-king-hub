import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/admin/session';
import { can } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const ROLES = ['Admin', 'Editor', 'Author', 'SEO Manager', 'Analyst', 'Advertiser'] as const;

function normalizeRole(role: unknown) {
  return typeof role === 'string' && ROLES.includes(role as (typeof ROLES)[number]) ? role : 'Editor';
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId || !can(session.role, 'manage_users')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};

  if ('role' in body) update.role = normalizeRole(body.role);
  if (typeof body.password === 'string' && body.password.trim()) {
    update.passwordHash = await bcrypt.hash(body.password, 12);
  }

  if (Object.keys(update).length === 0) {
    return Response.json({ error: 'No valid fields' }, { status: 400 });
  }

  const [row] = await db.update(adminUsers).set(update).where(eq(adminUsers.id, id)).returning({
    id: adminUsers.id,
    email: adminUsers.email,
    role: adminUsers.role,
  });
  if (row) {
    await writeAuditLog(session.email ?? 'admin', 'updated_login', 'admin_user', row.email, { id: row.id, role: row.role });
  }

  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.adminId || !can(session.role, 'manage_users')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const [row] = await db.select({ email: adminUsers.email }).from(adminUsers).where(eq(adminUsers.id, id));
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  if (row) {
    await writeAuditLog(session.email ?? 'admin', 'deleted_login', 'admin_user', row.email, { id });
  }

  return Response.json({ ok: true });
}
