import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

function createFallbackDb() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error('DATABASE_URL is required to use the database');
      },
    }
  ) as ReturnType<typeof drizzle>;
}

export const db = databaseUrl ? drizzle(neon(databaseUrl), { schema }) : createFallbackDb();
