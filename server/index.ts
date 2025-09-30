import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';
import { auth } from './lib/auth';
import { todos } from './routes/todo.routes';

const app = new Hono().basePath('/api');

// Add CORS middleware for better performance
app.use('*', cors({
  origin: process.env.CLIENT_URL || 'https://hono-react-better-auth.vercel.app',
  credentials: true,
}));

// Aggressive caching for session get requests
app.use('/auth/get-session', cache({
  cacheName: 'session-cache',
  cacheControl: 's-maxage=30, stale-while-revalidate=300', // 30s cache, 5min stale
  wait: false,
}));

// Add warm-up caching for auth operations
app.use('/auth/sign-in/*', cache({
  cacheName: 'auth-cache',
  cacheControl: 'max-age=0, s-maxage=10', // Brief server cache for repeated operations
  wait: false,
}));

// Add cache middleware for todos
app.use('/todos/*', cache({
  cacheName: 'todos-cache',
  cacheControl: 's-maxage=10, stale-while-revalidate=59',
  wait: false,
}));

// Mount auth handler
app.all('/auth/*', async (c) => {
  return await auth.handler(c.req.raw);
});

const router = app
  .route('/todos', todos);

export type AppType = typeof router;
export default app;
