# Vercel Deployment Guide

This guide will help you deploy your Hono + React + Better-Auth application to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub/GitLab/Bitbucket account with your repository
- Database service account (choose one):
  - Vercel Postgres (recommended)
  - Neon Database
  - Supabase

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Create a new Postgres database
4. Copy the `DATABASE_URL` from the database dashboard

### Option B: Neon Database
1. Sign up at https://neon.tech
2. Create a new project
3. Copy your connection string (use the pooled connection URL)

### Option C: Supabase
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the Connection String (URI)

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (your-app-name)
# - Directory? ./ (current directory)
# - Override settings? No
```

### Method 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `bun run vercel-build`
   - Output Directory: `client/dist`
   - Install Command: `bun install`

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add the following variables:

```env
DATABASE_URL=your_database_connection_string
BETTER_AUTH_SECRET=your_generated_secret_key
BETTER_AUTH_URL=https://your-app.vercel.app
CLIENT_URL=https://your-app.vercel.app
```

### Generate BETTER_AUTH_SECRET:
```bash
openssl rand -hex 32
```

## Step 4: Run Database Migrations

### Option 1: Automatic (via build command)
The migrations will run automatically during build if you're using the `vercel-build` script.

### Option 2: Manual (one-time setup)
```bash
# Set your production DATABASE_URL locally
export DATABASE_URL="your_production_database_url"

# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate
```

## Step 5: Update Frontend API URLs

The frontend should automatically use the correct API URLs in production, but verify that:

1. The Vite proxy configuration in `client/vite.config.ts` handles `/api` routes
2. API calls use relative URLs like `/api/todos` instead of hardcoded localhost URLs

## Step 6: Deploy Updates

After initial deployment, future updates are simple:

### Using Git:
```bash
git add .
git commit -m "Update message"
git push origin main
# Vercel will automatically redeploy
```

### Using Vercel CLI:
```bash
vercel --prod
```

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Ensure DATABASE_URL is set correctly
   - Add `?sslmode=require` to the connection string
   - Check if IP needs to be whitelisted (Supabase)

2. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node/Bun version compatibility

3. **API Routes Not Working**
   - Check vercel.json rewrites configuration
   - Verify api/index.ts exports correctly
   - Check Edge Function logs in Vercel dashboard

4. **Authentication Issues**
   - Verify BETTER_AUTH_SECRET is set
   - Ensure BETTER_AUTH_URL matches your Vercel domain
   - Check Better-Auth configuration in server/lib/auth.ts

### Useful Commands:

```bash
# View deployment logs
vercel logs

# List environment variables
vercel env ls

# Add environment variable
vercel env add DATABASE_URL

# Redeploy production
vercel --prod

# Check deployment status
vercel ls
```

## Production Checklist

- [ ] Database is provisioned and accessible
- [ ] All environment variables are set in Vercel
- [ ] Database migrations have run successfully
- [ ] Authentication is working (sign up, login)
- [ ] API endpoints are accessible
- [ ] Frontend can communicate with backend
- [ ] SSL/HTTPS is enabled (automatic with Vercel)
- [ ] Custom domain configured (optional)

## Monitoring & Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry
3. **Database Monitoring**: Use your database provider's dashboard
4. **API Monitoring**: Check Vercel Functions tab for logs

## Scaling Considerations

- **Database Connections**: Use connection pooling (Vercel Postgres/Neon handle this)
- **Edge Functions**: Have 30-second timeout limit
- **Static Assets**: Served from Vercel's CDN automatically
- **Rate Limiting**: Consider implementing rate limiting for API routes

## Support

- Vercel Documentation: https://vercel.com/docs
- Hono Documentation: https://hono.dev
- Better-Auth Documentation: https://better-auth.com
- Database-specific docs:
  - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
  - Neon: https://neon.tech/docs
  - Supabase: https://supabase.com/docs