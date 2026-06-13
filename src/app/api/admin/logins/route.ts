import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { can } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';
import { desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const ROLES = ['Admin', 'Editor', 'Author', 'SEO Manager', 'Analyst', 'Advertiser'] as const;

function normalizeRole(role: unknown) {
  return typeof role === 'string' && ROLES.includes(role as (typeof ROLES)[number]) ? role : 'Editor';
}

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      role: adminUsers.role,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(desc(adminUsers.createdAt));
  return Response.json({ users: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId || !can(session.role, 'manage_users')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email, password, role } = await req.json();
  if (!email || !password) {
    return Response.json({ error: 'email and password are required' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(String(password), 12);

  let row: typeof adminUsers.$inferSelect;
  try {
    [row] = await db.insert(adminUsers).values({
      email: String(email).trim().toLowerCase(),
      passwordHash,
      role: normalizeRole(role),
    }).returning();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('23505')) {
      return Response.json({ error: 'That email already exists.' }, { status: 409 });
    }
    throw err;
  }

  await writeAuditLog(session.email ?? 'admin', 'created_login', 'admin_user', row.email, { id: row.id, role: row.role });

  return Response.json({
    user: {
      id: row.id,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    },
  }, { status: 201 });
}
