import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

const email = process.env.ADMIN_EMAIL ?? 'Godwin@prestigetrucking.com';
const password = process.env.ADMIN_PASSWORD ?? '';

if (!password) {
  console.error('Set ADMIN_PASSWORD env var before running this script.');
  process.exit(1);
}

async function createAdmin() {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(adminUsers).values({ email, passwordHash }).onConflictDoNothing();
  console.log(`Admin user created: ${email}`);
  process.exit(0);
}

createAdmin().catch(console.error);
