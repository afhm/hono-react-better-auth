import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import * as schema from '../db/schema';
import { db } from '../db/edge-adapter'; // Always use edge-compatible adapter

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    // Optimize for session queries
    useSingleQuery: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.CLIENT_URL!],
  plugins: [openAPI()],
  session: {
    // Optimize session handling
    updateAge: 60 * 60 * 24, // Only update session every 24 hours
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes client-side cache
    },
  },
  advanced: {
    // Reduce database round trips
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false, // Disable for better performance
    },
    generateId: false, // Use database default IDs
  },
});
