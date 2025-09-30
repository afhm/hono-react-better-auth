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

// Add cache middleware for GET requests (except auth)
app.use('/todos/*', cache({
  cacheName: 'todos-cache',
  cacheControl: 's-maxage=10, stale-while-revalidate=59',
  wait: false,
}));

const router = app
  .on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw))
  .route('/todos', todos);

export type AppType = typeof router;
export default app;
