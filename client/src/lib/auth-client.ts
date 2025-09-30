import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
  // Optimize for performance
  fetchOptions: {
    cache: 'force-cache', // Aggressive client-side caching
  },
  session: {
    // Use fast session endpoint
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes client cache
    },
  },
})
