# Zeabur CLI Deployment Summary
# Quick Overview and CLI-Based Deployment Architecture

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ZEABUR PLATFORM                           │
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Frontend   │      │   Backend    │      │  PostgreSQL  │  │
│  │              │      │              │      │              │  │
│  │  React +     │─────▶│  Express +   │─────▶│  Database    │  │
│  │  Vite        │      │  Prisma      │      │              │  │
│  │              │      │              │      │              │  │
│  │  Port: Auto  │      │  Port: Auto  │      │  Port: 5432  │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│         │                      │                                │
│         │                      │                                │
│  ┌──────┴──────┐        ┌──────┴──────┐                        │
│  │   Domain    │        │   Domain    │                        │
│  │ frontend... │        │ backend...  │                        │
│  │ zeabur.app  │        │ zeabur.app  │                        │
│  └─────────────┘        └─────────────┘                        │
│         │                      │                                │
└─────────┼──────────────────────┼────────────────────────────────┘
          │                      │
          │                      │
          ▼                      ▼
     [END USERS]            [API CLIENTS]
```

## Project Structure for Deployment

```
TDD-test-todolist/
│
├── backend/                      # Backend Service on Zeabur
│   ├── src/
│   │   ├── index.ts             # Entry point ✓
│   │   ├── server.ts            # PORT env configured ✓
│   │   └── app.ts               # Express app ✓
│   ├── prisma/
│   │   └── schema.prisma        # PostgreSQL config needed
│   ├── package.json             # Build & start scripts ✓
│   ├── zbpack.json              # Zeabur config ✓
│   └── .env.example             # Environment template ✓
│
├── frontend/                     # Frontend Service on Zeabur
│   ├── src/
│   │   ├── main.tsx             # Entry point ✓
│   │   └── hooks/useTodos.ts    # API integration ✓
│   ├── package.json             # Build scripts ✓
│   ├── vite.config.ts           # Build config ✓
│   ├── zbpack.json              # Zeabur config ✓
│   └── .env.example             # Environment template ✓
│
└── .doc/
    ├── Zeabur-Deployment-Guide.md      # Full guide
    └── Zeabur-Deployment-Checklist.md  # Quick reference
```

## Key Configuration Files

### 1. Backend: zbpack.json
```json
{
  "build_command": "npm run build && npx prisma generate",
  "start_command": "npx prisma migrate deploy && npm start"
}
```

**What this does:**
- Builds TypeScript to JavaScript
- Generates Prisma client
- Runs database migrations before starting
- Starts the server

### 2. Frontend: zbpack.json
```json
{
  "build_command": "npm run build",
  "output_dir": "dist"
}
```

**What this does:**
- Builds React app with Vite
- Outputs static files to dist/
- Zeabur serves with Caddy web server

### 3. Backend: prisma/schema.prisma
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Why this change:**
- SQLite is file-based (not suitable for cloud)
- PostgreSQL is production-ready
- Zeabur provides managed PostgreSQL

## Environment Variables Setup

### Backend Service

| Variable | Value in Zeabur | Purpose |
|----------|-----------------|---------|
| DATABASE_URL | `${POSTGRES_DATABASE_URL}` | Auto-connects to PostgreSQL |
| NODE_ENV | `production` | Enables production mode |
| PORT | (auto-set by Zeabur) | Server listening port |

### Frontend Service

| Variable | Value in Zeabur | Purpose |
|----------|-----------------|---------|
| VITE_API_URL | `https://backend-url.zeabur.app/api` | Backend API endpoint |

**Important**: `VITE_API_URL` must be set BEFORE building the frontend!

## Deployment Flow

### CLI Deployment Workflow

```
1. Install & Login
   ├─▶ Install Zeabur CLI (npm install -g zeabur)
   ├─▶ Login to Zeabur (zeabur auth login)
   └─▶ Link GitHub account

2. Deploy Backend
   ├─▶ Navigate to backend directory
   ├─▶ Run: zeabur
   ├─▶ Create/select project
   ├─▶ Choose region
   ├─▶ Wait for deployment
   └─▶ Note backend URL

3. Add PostgreSQL
   ├─▶ Via CLI: zeabur service add postgresql
   └─▶ Or via Dashboard (recommended)

4. Configure Backend
   ├─▶ Open Zeabur dashboard
   ├─▶ Add environment variables
   │   ├─ DATABASE_URL=${POSTGRES_DATABASE_URL}
   │   └─ NODE_ENV=production
   └─▶ Wait for auto-redeploy

5. Deploy Frontend
   ├─▶ Navigate to frontend directory
   ├─▶ Run: zeabur
   ├─▶ Select same project
   ├─▶ Wait for deployment
   └─▶ Note frontend URL

6. Configure Frontend
   ├─▶ Open Zeabur dashboard
   ├─▶ Add VITE_API_URL (backend URL)
   └─▶ Wait for auto-redeploy

7. Verify & Go Live
   ├─▶ Test backend health endpoint
   ├─▶ Test frontend functionality
   └─▶ Monitor logs for errors
```

## What Zeabur Does Automatically

1. **Build Detection**
   - Detects Node.js version from package.json
   - Identifies build system (npm/yarn/pnpm)
   - Runs build commands

2. **Environment Setup**
   - Sets PORT environment variable
   - Provides DATABASE_URL for PostgreSQL
   - Injects environment variables at runtime

3. **Deployment**
   - Builds Docker container
   - Deploys to selected region
   - Generates HTTPS domain
   - Starts monitoring

4. **Auto-Redeploy**
   - Watches GitHub repository
   - Triggers deployment on push to main branch
   - Runs tests (if configured)

## Critical Changes Required

### 1. Prisma Schema (MUST CHANGE)

**Before (Development):**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**After (Production):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Server Port (ALREADY CORRECT)

Your current code already uses environment PORT correctly:

```typescript
// backend/src/server.ts
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
```

No changes needed! ✓

### 3. API Base URL (NEEDS UPDATE)

**Current (Development):**
```typescript
// frontend/src/hooks/useTodos.ts
const API_BASE = '/api';
```

**Recommended (Support both):**
```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

This allows:
- Local dev: Uses Vite proxy → `http://localhost:3000/api`
- Production: Uses environment variable → `https://backend.zeabur.app/api`

## Post-Deployment Verification

### 1. Backend Health Check
```bash
curl https://your-backend.zeabur.app/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-18T..."}
```

### 2. API Documentation
```
https://your-backend.zeabur.app/api-docs
```
Should show Swagger UI with all endpoints.

### 3. Database Connection
```bash
# Create a test todo
curl -X POST https://your-backend.zeabur.app/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test deployment","description":"Testing Zeabur"}'

# Should return created todo with ID
```

### 4. Frontend Test
Visit frontend URL and test:
- ✓ Create a todo
- ✓ Mark as complete
- ✓ Update title
- ✓ Delete todo
- ✓ Check browser console (no errors)

## Common Issues and Quick Fixes

### Issue: "Cannot find module"
**Fix**: Ensure `postinstall` script runs `prisma generate`

### Issue: Database connection failed
**Fix**: Verify `DATABASE_URL = ${POSTGRES_DATABASE_URL}`

### Issue: Frontend can't reach backend
**Fix**: Check CORS and `VITE_API_URL`

### Issue: Build fails
**Fix**: Test `npm run build` locally first

### Issue: Migrations don't run
**Fix**: Verify start command includes `prisma migrate deploy`

## Estimated Deployment Time (CLI Method)

| Step | Time |
|------|------|
| Install & Login to CLI | 2 min |
| Deploy Backend via CLI | 3-5 min |
| Add PostgreSQL | 2 min |
| Configure Backend Vars | 2 min |
| Deploy Frontend via CLI | 2-3 min |
| Configure Frontend Vars | 2 min |
| Verification | 2 min |
| **Total** | **15-18 min** |

*Subsequent deployments are faster (~2-3 min) as Zeabur caches builds*

## Cost Estimation (Zeabur)

- **Free Tier**: Available for testing
  - Limited resources
  - Good for development/demo

- **Production Tier**: Pay-as-you-go
  - Backend: ~$5-15/month (depends on usage)
  - Frontend: ~$2-5/month (static hosting)
  - PostgreSQL: ~$5-10/month
  - **Estimated Total**: $12-30/month

*Note: Prices are approximate and depend on traffic and resource usage*

## Continuous Deployment with CLI

Once deployed via CLI, Zeabur automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin master

# Zeabur automatically:
# 1. Detects the push
# 2. Builds the project
# 3. Runs migrations
# 4. Deploys to production
# 5. Notifies you of completion
```

You can also manually trigger deployments:
```bash
# Redeploy current service
zeabur deploy

# Or push changes and Zeabur auto-deploys
git push
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Configure proper origins in production
3. **HTTPS**: Automatic on Zeabur (all domains)
4. **Database**: Use strong passwords (auto-generated)
5. **Secrets**: Use Zeabur's environment variables

## Monitoring and Logs

Zeabur provides:
- **Real-time logs**: View application logs
- **Metrics**: CPU, memory, network usage
- **Deployment history**: Track all deployments
- **Alerts**: Get notified of issues

Access via: Dashboard > Service > Logs/Metrics

## Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure database backups**
3. **Implement monitoring** (error tracking)
4. **Set up CI/CD tests**
5. **Document for team**
6. **Scale resources** as needed

## Quick Links

- **Full Guide**: `.doc/Zeabur-Deployment-Guide.md`
- **Checklist**: `.doc/Zeabur-Deployment-Checklist.md`
- **Zeabur Dashboard**: https://dash.zeabur.com
- **Zeabur Docs**: https://zeabur.com/docs

## Support

Need help?
1. Check the full deployment guide
2. Review Zeabur documentation
3. Join Zeabur Discord: https://discord.gg/zeabur
4. GitHub Issues: https://github.com/zeabur/zeabur/issues

---

## Configuration Files Created

This guide created the following files for you:

1. `backend/zbpack.json` - Backend build configuration
2. `frontend/zbpack.json` - Frontend build configuration
3. `backend/.env.example` - Backend environment template
4. `frontend/.env.example` - Frontend environment template
5. `.doc/Zeabur-Deployment-Guide.md` - Complete deployment guide
6. `.doc/Zeabur-Deployment-Checklist.md` - Quick reference checklist
7. `.doc/Zeabur-Deployment-Summary.md` - This summary

All files are ready to use. Just follow the deployment steps!

---

**Ready to Deploy?**

Start here: `.doc/Zeabur-Deployment-Checklist.md`

Or dive deep: `.doc/Zeabur-Deployment-Guide.md`

Good luck with your CLI deployment! 🚀

---

Last Updated: 2025-10-18
Version: 2.0.0 (CLI-focused)
