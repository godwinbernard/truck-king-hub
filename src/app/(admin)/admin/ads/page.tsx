import { db } from '@/lib/db/client';
import { cmsAds } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { AdsManager } from './AdsManager';
import type { InferSelectModel } from 'drizzle-orm';

type Ad = InferSelectModel<typeof cmsAds>;

export default async function AdsAdminPage() {
  let ads: Ad[] = [];
  try {
    ads = await db.select().from(cmsAds).orderBy(desc(cmsAds.createdAt));
  } catch {
    // table may not exist yet in dev
  }
  return <AdsManager initialAds={ads} />;
}
