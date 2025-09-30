# Edge Runtime Database Configuration

## Important: Database Connection for Vercel Edge Runtime

When deploying to Vercel Edge Runtime, the standard `pg` driver doesn't work. You need to use edge-compatible database drivers.

### For Production Deployment:

1. **Update your database imports** in files that use the database:

Replace:
```typescript
import { db } from './db/db'
```

With:
```typescript
import { db } from './db/edge-adapter'
```

### Affected Files:
- `server/routes/todo.routes.ts`
- `server/lib/auth.ts`
- Any other files that import the database

### Database Provider Compatibility:

1. **Vercel Postgres** - Works out of the box with the Neon adapter
2. **Neon Database** - Native support with `@neondatabase/serverless`
3. **Supabase** - Works with the Neon adapter using pooler connection

### Local Development:

For local development, you can continue using the regular `pg` driver. Consider using environment detection:

```typescript
const isEdgeRuntime = typeof EdgeRuntime !== 'undefined';
const db = isEdgeRuntime
  ? require('./db/edge-adapter').db
  : require('./db/db').db;
```

Or use separate entry points for local vs production.