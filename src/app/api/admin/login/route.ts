import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/admin/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return new Response('Missing fields', { status: 400 });

  const users = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (!users.length) return new Response('Invalid credentials', { status: 401 });

  const valid = await bcrypt.compare(password, users[0].passwordHash);
  if (!valid) return new Response('Invalid credentials', { status: 401 });

  const session = await getSession();
  session.adminId = users[0].id;
  session.email = users[0].email;
  session.role = users[0].role ?? 'Admin';
  await session.save();

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
