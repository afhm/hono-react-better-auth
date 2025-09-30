import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL ||
    (import.meta.env.PROD ? "https://hono-react-better-auth.vercel.app" : "http://localhost:3000"),
  // Remove aggressive caching that interferes with auth state
  fetchOptions: {
    cache: 'no-cache', // Ensure fresh auth state
  },
})
