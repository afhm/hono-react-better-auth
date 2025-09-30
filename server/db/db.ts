import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  drizzle as neonDrizzle,
  NeonHttpDatabase,
} from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// WebSocket configuration only for local development
// Not needed for Vercel Edge Runtime
if (typeof process !== 'undefined' && process.env.APP_ENV === 'development') {
  // Only configure WebSocket for local development
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

let dbClient:
  | (NodePgDatabase<Record<string, never>> & { $client: Pool })
  | NeonHttpDatabase<Record<string, never>>;

const getDbConn = () => {
  if (!process.env.DATABASE_URL)
    throw new Error('No database connection string specified.');

  if (!dbClient && process.env.APP_ENV === 'development') {
    dbClient = drizzle(process.env.DATABASE_URL);
  }

  if (!dbClient && process.env.APP_ENV === 'production') {
    const sql = neon(process.env.DATABASE_URL);
    dbClient = neonDrizzle({ client: sql });
  }

  return dbClient;
};

export const db = getDbConn();
