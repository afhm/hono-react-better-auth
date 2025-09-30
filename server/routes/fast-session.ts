import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../db/edge-adapter';
import { session as sessionTable, user as userTable } from '../db/schema';
import { getCachedSession, setCachedSession } from '../lib/session-cache';

const app = new Hono();

// Ultra-fast session endpoint that bypasses better-auth overhead
app.get('/fast-session', async (c) => {
  try {
    // Get session token from cookie
    const token = getCookie(c, 'better-auth.session_token');

    if (!token) {
      return c.json({ user: null, session: null }, 200);
    }

    // Check cache first
    const cached = getCachedSession(token);
    if (cached) {
      return c.json({
        user: cached.user,
        session: { id: cached.sessionId, userId: cached.userId }
      }, 200);
    }

    // Single optimized database query with join
    const result = await db
      .select({
        sessionId: sessionTable.id,
        userId: sessionTable.userId,
        expiresAt: sessionTable.expiresAt,
        userName: userTable.name,
        userEmail: userTable.email,
      })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(
        and(
          eq(sessionTable.token, token),
          gt(sessionTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (result.length === 0) {
      return c.json({ user: null, session: null }, 200);
    }

    const sessionData = result[0];
    const responseData = {
      user: {
        id: sessionData.userId,
        name: sessionData.userName,
        email: sessionData.userEmail,
      },
      session: {
        id: sessionData.sessionId,
        userId: sessionData.userId,
      },
    };

    // Cache the result
    setCachedSession(token, {
      userId: sessionData.userId,
      sessionId: sessionData.sessionId,
      expiresAt: sessionData.expiresAt.getTime(),
      user: responseData.user,
    });

    return c.json(responseData, 200);
  } catch (error) {
    console.error('Fast session error:', error);
    return c.json({ user: null, session: null }, 200);
  }
});

export { app as fastSession };