import { db } from './client';
import { sources } from './schema';

async function seed() {
  await db.insert(sources).values([
    {
      name: 'FMCSA Newsroom',
      websiteUrl: 'https://www.fmcsa.dot.gov/rss.xml',
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
      websiteUrl: 'https://www.overdriveonline.com/feed/',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'freight',
      fetchFrequencyMinutes: 120,
      notes: 'Overdrive magazine RSS feed',
    },
    {
      name: 'Truckers News',
      websiteUrl: 'https://www.truckersnews.com/feed/',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'general',
      fetchFrequencyMinutes: 120,
      notes: 'Truckers News RSS feed',
    },
    {
      name: 'TheTrucker.com',
      websiteUrl: 'https://www.thetrucker.com/feed/',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'general',
      fetchFrequencyMinutes: 120,
      notes: 'TheTrucker.com RSS feed',
    },
    {
      name: 'FleetOwner',
      websiteUrl: 'https://www.fleetowner.com/rss/all/',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'freight',
      fetchFrequencyMinutes: 120,
      notes: 'Fleet Owner magazine RSS feed',
    },
    {
      name: 'Transport Topics',
      websiteUrl: 'https://www.ttnews.com/rss.xml',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'freight',
      fetchFrequencyMinutes: 120,
      notes: 'Transport Topics news RSS feed',
    },
    {
      name: 'Commercial Carrier Journal',
      websiteUrl: 'https://www.ccjdigital.com/feed/',
      sourceType: 'rss',
      updateMethod: 'rss',
      permissionLevel: 'open',
      defaultCategory: 'equipment',
      fetchFrequencyMinutes: 180,
      notes: 'CCJ - equipment, technology, and operations news',
    },
  ]).onConflictDoNothing();

  console.log('Sources seeded.');
  process.exit(0);
}

seed().catch(console.error);
