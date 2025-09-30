import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Edge-compatible database connection for Vercel Edge Runtime
// Optimized for performance with connection caching

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Use pooled connection URL if available (ends with -pooler)
// This provides server-side connection pooling
const databaseUrl = process.env.DATABASE_URL;

// Create HTTP client - optimal for one-shot queries in Edge Runtime
// Connection caching is enabled by default for HTTP queries
const sql = neon(databaseUrl, {
  // Fetch options for better performance
  fetchOptions: {
    cache: 'no-store', // Ensure fresh data
    // Keep connections alive for better performance
    keepalive: true,
  },
  // Reduce payload size for faster queries
  fullResults: false,
  // Enable array mode for faster parsing
  arrayMode: true,
});

export const db = drizzle(sql, {
  schema,
  logger: false, // Disable logging in production for performance
});

// For compatibility with existing code
export { db as database };