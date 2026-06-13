import { db } from '@/lib/db/client';
import { cmsUsers } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { UsersManager } from './UsersManager';

export default async function UsersAdminPage() {
  const users = await db.select().from(cmsUsers).orderBy(desc(cmsUsers.createdAt));
  return <UsersManager initialUsers={users} />;
}
