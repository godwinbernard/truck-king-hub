import { db } from './client';
import { sources } from './schema';

async function seed() {
  await db.insert(sources).values([
    {
      name: 'FMCSA Newsroom',
      websiteUrl: 'https://www.fmcsa.dot.gov/newsroom',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'compliance',
      fetchFrequencyMinutes: 120,
      notes: 'Official FMCSA newsroom RSS feed',
    },
    {
      name: 'Federal Register (FMCSA)',
      websiteUrl: 'https://www.federalregister.gov',
      sourceType: 'api',
      updateMethod: 'federal_register_api',
      permissionLevel: 'open',
      defaultCategory: 'compliance',
      fetchFrequencyMinutes: 240,
      notes: 'Federal Register API filtered to FMCSA agency documents',
    },
    {
      name: 'Overdrive',
      websiteUrl: 'https://www.overdriveonline.com',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'freight',
      fetchFrequencyMinutes: 120,
      notes: 'Overdrive magazine RSS feed',
    },
    {
      name: 'Truckers News',
      websiteUrl: 'https://www.truckersnews.com',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'general',
      fetchFrequencyMinutes: 120,
      notes: 'Truckers News RSS feed',
    },
    {
      name: 'TheTrucker.com',
      websiteUrl: 'https://www.thetrucker.com',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'general',
      fetchFrequencyMinutes: 120,
      notes: 'TheTrucker.com RSS feed',
    },
  ]).onConflictDoNothing();

  console.log('Sources seeded.');
  process.exit(0);
}

seed().catch(console.error);
