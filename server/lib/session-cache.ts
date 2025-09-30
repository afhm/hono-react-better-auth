// Ultra-fast session cache for Edge Runtime
// Reduces database round trips for session validation

interface CachedSession {
  userId: string;
  sessionId: string;
  expiresAt: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// In-memory cache with TTL (5 minutes)
const SESSION_CACHE = new Map<string, CachedSession>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

// Cleanup expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of SESSION_CACHE.entries()) {
    if (session.expiresAt < now) {
      SESSION_CACHE.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export function getCachedSession(token: string): CachedSession | null {
  const cached = SESSION_CACHE.get(token);
  if (!cached) return null;

  // Check if expired
  if (cached.expiresAt < Date.now()) {
    SESSION_CACHE.delete(token);
    return null;
  }

  return cached;
}

export function setCachedSession(token: string, session: CachedSession): void {
  // Set expiry to cache TTL or session expiry, whichever is shorter
  const cacheExpiry = Date.now() + CACHE_TTL;
  const sessionExpiry = session.expiresAt;

  SESSION_CACHE.set(token, {
    ...session,
    expiresAt: Math.min(cacheExpiry, sessionExpiry),
  });
}

export function invalidateSession(token: string): void {
  SESSION_CACHE.delete(token);
}