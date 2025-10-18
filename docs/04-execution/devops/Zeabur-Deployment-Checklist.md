# Zeabur Deployment Checklist
# Quick reference guide for deploying to Zeabur

## Pre-Deployment Checklist

### 1. Database Migration Preparation
- [ ] Update `backend/prisma/schema.prisma` to use PostgreSQL
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```
- [ ] Test migrations locally (optional)
  ```bash
  cd backend
  npx prisma migrate dev --name init
  ```

### 2. Environment Configuration
- [ ] Create `.env.example` files (already created)
- [ ] Verify `.env` files are in `.gitignore`
- [ ] Document all required environment variables

### 3. Code Verification
- [ ] Backend builds successfully
  ```bash
  cd backend
  npm run build
  ```
- [ ] Frontend builds successfully
  ```bash
  cd frontend
  npm run build
  ```
- [ ] All tests pass
  ```bash
  npm test
  ```

### 4. Configuration Files
- [ ] `backend/zbpack.json` exists
- [ ] `frontend/zbpack.json` exists
- [ ] PORT environment variable is properly used in server.ts
- [ ] Node.js version specified in package.json

---

## Deployment Steps (Dashboard Method)

### Step 1: Create Zeabur Project
- [ ] Login to https://dash.zeabur.com
- [ ] Click "Create New Project"
- [ ] Name: `tdd-todolist` (or your preference)
- [ ] Select region (choose closest to your users)

### Step 2: Deploy PostgreSQL
- [ ] In project, click "Add Service"
- [ ] Select "Marketplace"
- [ ] Search "PostgreSQL"
- [ ] Click "Deploy"
- [ ] Wait for service to be ready (~1-2 minutes)

### Step 3: Deploy Backend
- [ ] Click "Add Service" > "Git"
- [ ] Install Zeabur GitHub App (if first time)
- [ ] Select repository: `TDD-test-todolist`
- [ ] Zeabur auto-detects backend in `/backend`
- [ ] Click "Deploy"

**Add Environment Variables:**
```
DATABASE_URL = ${POSTGRES_DATABASE_URL}
NODE_ENV = production
```

- [ ] Wait for deployment to complete
- [ ] Note the generated backend URL

### Step 4: Deploy Frontend
- [ ] Click "Add Service" > "Git"
- [ ] Select same repository
- [ ] Zeabur auto-detects frontend in `/frontend`
- [ ] Click "Deploy"

**Add Environment Variables:**
```
VITE_API_URL = https://your-backend-url.zeabur.app/api
```
(Replace with actual backend URL from Step 3)

- [ ] Wait for deployment to complete
- [ ] Note the generated frontend URL

### Step 5: Configure Domains
- [ ] Backend: Click service > Domain tab > Generate Domain
- [ ] Frontend: Click service > Domain tab > Generate Domain
- [ ] (Optional) Add custom domains

### Step 6: Update Frontend API URL
- [ ] Update frontend's `VITE_API_URL` with actual backend domain
- [ ] Trigger frontend redeploy (push to GitHub or manual redeploy)

---

## Deployment Steps (CLI Method)

### Prerequisites
```bash
# Install Zeabur CLI
npm install -g zeabur

# Or use without installing
npx zeabur@latest
```

### Step 1: Login
```bash
zeabur auth login
```

### Step 2: Deploy Backend
```bash
cd backend
zeabur

# Follow prompts:
# 1. Create/select project
# 2. Choose region
# 3. Wait for deployment
```

### Step 3: Add PostgreSQL
```bash
# In same project
zeabur service add postgresql
```

### Step 4: Configure Backend
- [ ] Go to Zeabur dashboard
- [ ] Add environment variables to backend service
- [ ] Redeploy if needed

### Step 5: Deploy Frontend
```bash
cd ../frontend
zeabur

# Select same project as backend
```

### Step 6: Configure Frontend
- [ ] Add `VITE_API_URL` environment variable
- [ ] Redeploy frontend

---

## Post-Deployment Verification

### Backend Health Check
```bash
curl https://your-backend.zeabur.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-18T..."
}
```

### API Documentation
- [ ] Visit: `https://your-backend.zeabur.app/api-docs`
- [ ] Verify Swagger UI loads

### Database Connection
```bash
curl -X POST https://your-backend.zeabur.app/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test deployment"}'
```

### Frontend Check
- [ ] Visit frontend URL
- [ ] Create a todo
- [ ] Update a todo
- [ ] Delete a todo
- [ ] Check browser console for errors

### CORS Verification
- [ ] Ensure frontend can call backend API
- [ ] No CORS errors in browser console

---

## Environment Variables Reference

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| DATABASE_URL | `${POSTGRES_DATABASE_URL}` | Auto-filled by Zeabur |
| NODE_ENV | `production` | Environment mode |
| PORT | (auto-set) | Server port |

### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| VITE_API_URL | `https://backend-url.zeabur.app/api` | Backend API endpoint |

---

## Troubleshooting Quick Reference

### Build Fails
1. Check build logs in Zeabur dashboard
2. Verify `npm run build` works locally
3. Check all dependencies are in package.json

### Database Connection Error
1. Verify DATABASE_URL is set: `${POSTGRES_DATABASE_URL}`
2. Check PostgreSQL service is running
3. Ensure Prisma schema uses `postgresql`

### Frontend API Calls Fail
1. Check VITE_API_URL is correct
2. Verify backend is accessible
3. Check CORS configuration
4. Inspect browser console

### Migrations Don't Run
1. Verify start command includes migration
2. Check migration files exist
3. Run manually via console if needed

---

## Useful Commands

### Local Development
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

# Run both (from root)
npm run dev
```

### Build Locally
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Prisma Commands
```bash
cd backend

# Generate client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset
```

### Zeabur CLI
```bash
# Login
zeabur auth login

# Deploy
zeabur

# View logs
zeabur logs

# Open dashboard
zeabur open
```

---

## Common Zeabur URLs

- Dashboard: https://dash.zeabur.com
- Documentation: https://zeabur.com/docs
- Discord: https://discord.gg/zeabur
- Status: https://status.zeabur.com

---

## Next Steps After Deployment

- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS (automatic on Zeabur)
- [ ] Set up monitoring and alerts
- [ ] Document deployment process for team
- [ ] Set up CI/CD for automatic deployments
- [ ] Configure database backups
- [ ] Implement rate limiting
- [ ] Add error tracking (e.g., Sentry)

---

## Notes

- Zeabur automatically redeploys when you push to GitHub
- Free tier available for testing
- Pay-as-you-go pricing for production
- Automatic HTTPS on all domains
- Built-in monitoring and logs

---

**Quick Help**

If something goes wrong:
1. Check Zeabur logs (Dashboard > Service > Logs)
2. Verify environment variables
3. Check GitHub Actions (if configured)
4. Consult full guide: `Zeabur-Deployment-Guide.md`
5. Ask in Zeabur Discord

---

Last Updated: 2025-10-18
Version: 1.0.0
