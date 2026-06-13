import { db } from '@/lib/db/client';
import { directoryListings } from '@/lib/db/schema';
import { DirectoryManager } from './DirectoryManager';

export default async function DirectoryAdminPage() {
  const listings = await db.select().from(directoryListings).orderBy(directoryListings.name);
  return <DirectoryManager initialListings={listings} />;
}
