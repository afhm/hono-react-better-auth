import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import * as schema from '../db/schema';

// Use edge-compatible database for production
const getDb = () => {
  if (typeof EdgeRuntime !== 'undefined' || process.env.VERCEL) {
    // Use edge adapter for Vercel deployment
    const { db: edgeDb } = require('../db/edge-adapter');
    return edgeDb;
  }
  // Use regular db for local development
  const { db } = require('../db/db');
  return db;
};

const db = getDb();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.CLIENT_URL!],
  plugins: [openAPI()],
});
