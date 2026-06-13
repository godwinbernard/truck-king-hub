import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { LoginsManager } from './LoginsManager';

export default async function LoginsPage() {
  const users = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      role: adminUsers.role,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(desc(adminUsers.createdAt));
  return <LoginsManager initialUsers={users} />;
}
