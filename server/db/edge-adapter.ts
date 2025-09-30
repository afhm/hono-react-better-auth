import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Edge-compatible database connection for Vercel Edge Runtime
// Works with Neon, Vercel Postgres, and other Postgres providers

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// For compatibility with existing code
export { db as database };