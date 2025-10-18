# Zeabur Deployment Guide
# Complete Guide to Deploy Full-Stack Todo Application on Zeabur

## Document Information

| Item | Details |
|------|---------|
| Document Title | Zeabur Deployment Guide for TDD TodoList Application |
| Version | 1.0.0 |
| Date Created | 2025-10-18 |
| Last Updated | 2025-10-18 |
| Author | DevOps Team |
| Related Docs | PRD.md, SDD.md, API-Specification.md |

---

## Table of Contents

1. [Introduction to Zeabur](#1-introduction-to-zeabur)
2. [Project Overview](#2-project-overview)
3. [Prerequisites](#3-prerequisites)
4. [Database Configuration](#4-database-configuration)
5. [Backend Deployment](#5-backend-deployment)
6. [Frontend Deployment](#6-frontend-deployment)
7. [Environment Variables](#7-environment-variables)
8. [Deployment Steps](#8-deployment-steps)
9. [Post-Deployment Configuration](#9-post-deployment-configuration)
10. [Troubleshooting](#10-troubleshooting)
11. [Best Practices](#11-best-practices)

---

## 1. Introduction to Zeabur

### What is Zeabur?

Zeabur is a modern Platform-as-a-Service (PaaS) that allows you to deploy full-stack applications with minimal configuration. It automatically detects your project type and handles the build and deployment process.

### Key Features

- **Automatic Detection**: Recognizes Node.js, React, and other frameworks automatically
- **Built-in Database Support**: PostgreSQL, MySQL, Redis, MongoDB
- **Zero Configuration**: Works out of the box for most projects
- **Environment Variables**: Easy management of secrets and configuration
- **Monorepo Support**: Can deploy multiple services from a single repository
- **Custom Domains**: Support for custom domain binding
- **Auto-scaling**: Handles traffic spikes automatically

### Why Zeabur for This Project?

- Simple deployment for Node.js + React stack
- Built-in PostgreSQL support (we'll migrate from SQLite)
- Easy environment variable management
- Automatic HTTPS
- Pay-as-you-go pricing model

---

## 2. Project Overview

### Current Project Structure

```
/mnt/d/software/TDD-test-todolist/
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── index.ts         # Entry point
│   │   ├── server.ts        # Server configuration
│   │   ├── app.ts           # Express app
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── config/
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
└── package.json              # Root package.json
```

### Technology Stack

**Backend:**
- Node.js 18+
- Express.js
- TypeScript
- Prisma ORM
- SQLite (development) -> PostgreSQL (production)

**Frontend:**
- React 19
- TypeScript
- Vite
- Zustand (state management)
- Tailwind CSS v4

---

## 3. Prerequisites

### Required Accounts and Tools

1. **Zeabur Account**
   - Sign up at https://zeabur.com
   - Link your GitHub account

2. **GitHub Repository**
   - Your code must be in a GitHub repository
   - Zeabur needs read access to deploy

3. **Local Development Tools**
   - Node.js 18+ installed
   - Git installed
   - npm or pnpm

### Optional Tools

- Zeabur CLI (for command-line deployment)
  ```bash
  npm install -g zeabur
  ```

---

## 4. Database Configuration

### Migrating from SQLite to PostgreSQL

Your current project uses SQLite (`file:./dev.db`). For production on Zeabur, we'll use PostgreSQL.

#### Step 1: Update Prisma Schema

**File**: `/backend/prisma/schema.prisma`

**Current Configuration:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Production Configuration:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Recommended: Support Both Environments**
```prisma
datasource db {
  provider = "postgresql"  // Use postgresql for production
  url      = env("DATABASE_URL")
}

// Note: For local development, you can:
// 1. Use PostgreSQL locally via Docker
// 2. Or keep SQLite for development and only use PostgreSQL in production
```

#### Step 2: Update Package.json Scripts

Add Prisma migration scripts to `/backend/package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "postinstall": "prisma generate"
  }
}
```

---

## 5. Backend Deployment

### Backend Configuration

#### Step 1: Verify PORT Environment Variable

**File**: `/backend/src/server.ts`

Your current configuration already supports dynamic PORT (GOOD!):

```typescript
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
```

This is exactly what Zeabur needs. No changes required.

#### Step 2: Create zbpack.json for Backend

Create `/backend/zbpack.json`:

```json
{
  "build_command": "npm run build && npx prisma generate",
  "start_command": "npx prisma migrate deploy && npm start"
}
```

**Explanation:**
- `build_command`: Compiles TypeScript and generates Prisma client
- `start_command`: Runs migrations before starting the server

#### Step 3: Update Package.json

Ensure `/backend/package.json` has the correct scripts:

```json
{
  "name": "todolist-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "test": "jest",
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "engines": {
    "node": "18.x"
  }
}
```

**Important Notes:**
- `"start"` should use `node` (not `tsx` or `nodemon`)
- `"engines"` specifies Node.js version for Zeabur

---

## 6. Frontend Deployment

### Frontend Configuration

#### Step 1: Update Vite Configuration

**File**: `/frontend/vite.config.ts`

Update to support production API URL:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // Production build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'zustand': ['zustand', 'immer'],
        },
      },
    },
  },
})
```

#### Step 2: Create zbpack.json for Frontend

Create `/frontend/zbpack.json`:

```json
{
  "build_command": "npm run build",
  "output_dir": "dist"
}
```

**Explanation:**
- `build_command`: Builds the React app
- `output_dir`: Where Vite outputs the built files

#### Step 3: Update API Configuration

**File**: `/frontend/src/hooks/useTodos.ts`

The API base URL needs to be environment-aware:

```typescript
// Update this line
const API_BASE = '/api';

// To support both development and production:
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

---

## 7. Environment Variables

### Backend Environment Variables

Required environment variables for the backend service:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `${POSTGRES_DATABASE_URL}` | Yes |
| `PORT` | Server port (auto-set by Zeabur) | Auto | No |
| `NODE_ENV` | Environment mode | `production` | Yes |

**In Zeabur Dashboard:**

1. Go to your backend service
2. Click "Variables" tab
3. Add these variables:

```env
DATABASE_URL=${POSTGRES_DATABASE_URL}
NODE_ENV=production
```

**Note**: `${POSTGRES_DATABASE_URL}` is a Zeabur template variable that automatically references your PostgreSQL service.

### Frontend Environment Variables

Required environment variables for the frontend service:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `/api` or full URL | No |

**In Zeabur Dashboard:**

```env
VITE_API_URL=/api
```

**Or** if you want the frontend to call the backend directly:

```env
VITE_API_URL=https://your-backend.zeabur.app/api
```

---

## 8. Deployment Steps

### Method 1: Deploy via Zeabur Dashboard (Recommended)

This is the easiest method for first-time deployment.

#### Step 1: Create a New Project

1. Log in to https://dash.zeabur.com
2. Click "Create New Project"
3. Choose a project name (e.g., "tdd-todolist")
4. Select a region (choose one closest to your users)

#### Step 2: Add PostgreSQL Service

1. In your project, click "Add Service"
2. Select "Marketplace"
3. Search for "PostgreSQL"
4. Click "Deploy"
5. Wait for PostgreSQL to be ready (usually 1-2 minutes)

**Important**: Note the service name (usually `postgres` or `postgresql`)

#### Step 3: Deploy Backend Service

1. Click "Add Service" again
2. Select "Git"
3. If prompted, install the Zeabur GitHub App
4. Select your repository: `TDD-test-todolist`
5. Zeabur will auto-detect the backend in `/backend` folder
6. Click "Deploy"

**Configuration:**
- Service Name: `backend` (or `todolist-backend`)
- Root Directory: `/backend` (auto-detected)
- Branch: `master` (or `main`)

**Add Environment Variables:**
```env
DATABASE_URL=${POSTGRES_DATABASE_URL}
NODE_ENV=production
```

**Build Configuration:**
- Build Command: `npm run build && npx prisma generate`
- Start Command: `npx prisma migrate deploy && npm start`

#### Step 4: Deploy Frontend Service

1. Click "Add Service" again
2. Select "Git"
3. Select the same repository
4. Choose the frontend directory
5. Click "Deploy"

**Configuration:**
- Service Name: `frontend`
- Root Directory: `/frontend` (auto-detected)
- Branch: `master` (or `main`)

**Add Environment Variables:**
```env
VITE_API_URL=https://your-backend-url.zeabur.app/api
```

**Note**: Replace `your-backend-url` with the actual URL from Step 3.

#### Step 5: Configure Domains

**Backend:**
1. Go to backend service
2. Click "Domain" tab
3. Click "Generate Domain" to get a free `.zeabur.app` domain
4. Or add a custom domain

**Frontend:**
1. Go to frontend service
2. Click "Domain" tab
3. Click "Generate Domain"
4. Or add a custom domain

#### Step 6: Update Frontend Environment Variable

After getting the backend domain, update the frontend's `VITE_API_URL`:

```env
VITE_API_URL=https://your-actual-backend.zeabur.app/api
```

Then redeploy the frontend service.

---

### Method 2: Deploy via Zeabur CLI

For developers who prefer command-line tools.

#### Step 1: Install Zeabur CLI

```bash
npm install -g zeabur
```

Or use without installing:
```bash
npx zeabur@latest
```

#### Step 2: Login to Zeabur

```bash
zeabur auth login
```

This will open a browser for authentication.

#### Step 3: Deploy Backend

Navigate to the backend directory:

```bash
cd /mnt/d/software/TDD-test-todolist/backend
```

Initialize and deploy:

```bash
# First time deployment
zeabur

# Follow the prompts:
# 1. Select or create a project
# 2. Choose deployment region
# 3. Wait for deployment to complete
```

#### Step 4: Add PostgreSQL via CLI

```bash
# In the same project, add PostgreSQL
zeabur service add postgresql
```

#### Step 5: Deploy Frontend

Navigate to the frontend directory:

```bash
cd /mnt/d/software/TDD-test-todolist/frontend
```

Deploy:

```bash
zeabur
```

**Note**: Make sure to select the same project as the backend.

---

### Method 3: Deploy Monorepo (Both Services Together)

If you want to deploy both services from the root directory.

#### Step 1: Create Root zbpack Configuration

Create `/zbpack.backend.json`:

```json
{
  "app_dir": "backend",
  "build_command": "cd backend && npm run build && npx prisma generate",
  "start_command": "cd backend && npx prisma migrate deploy && npm start"
}
```

Create `/zbpack.frontend.json`:

```json
{
  "app_dir": "frontend",
  "build_command": "cd frontend && npm run build",
  "output_dir": "frontend/dist"
}
```

#### Step 2: Deploy via Dashboard

1. Create a new project
2. Add PostgreSQL service
3. Add a Git service, select the repository
4. Zeabur will detect both services
5. Deploy each one separately

---

## 9. Post-Deployment Configuration

### Verify Deployment

#### Check Backend Health

Visit your backend URL with `/health` endpoint:

```bash
curl https://your-backend.zeabur.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-18T10:00:00.000Z"
}
```

#### Check API Documentation

Visit:
```
https://your-backend.zeabur.app/api-docs
```

You should see the Swagger UI with your API documentation.

#### Check Database Connection

Create a test todo via the API:

```bash
curl -X POST https://your-backend.zeabur.app/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test deployment", "description": "Testing Zeabur deployment"}'
```

#### Check Frontend

Visit your frontend URL:
```
https://your-frontend.zeabur.app
```

Try creating, updating, and deleting todos.

### Database Migrations

If you need to run migrations manually:

1. Go to the Zeabur dashboard
2. Select your backend service
3. Click "Console" tab (terminal access)
4. Run:
```bash
npx prisma migrate deploy
```

Or add migrations to your Git repository:

```bash
# In /backend directory locally
npx prisma migrate dev --name init

# Commit and push
git add .
git commit -m "Add initial database migration"
git push
```

Zeabur will automatically run `prisma migrate deploy` on the next deployment.

### CORS Configuration

If you have CORS issues, update `/backend/src/app.ts`:

```typescript
import cors from 'cors';

const app = express();

// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://your-frontend.zeabur.app',  // Production frontend
    // Add your custom domain if you have one
  ],
  credentials: true,
}));
```

---

## 10. Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Cannot find module" Error

**Symptom**: Backend fails to start with module not found error.

**Solution**:
1. Ensure all dependencies are in `package.json`
2. Check that `postinstall` script runs `prisma generate`
3. Verify build command includes Prisma generation:
   ```json
   {
     "build_command": "npm run build && npx prisma generate"
   }
   ```

#### Issue 2: Database Connection Error

**Symptom**: Backend starts but fails to connect to database.

**Solution**:
1. Verify `DATABASE_URL` environment variable is set
2. Check it uses the template: `${POSTGRES_DATABASE_URL}`
3. Ensure PostgreSQL service is running
4. Verify Prisma schema uses `postgresql` provider

#### Issue 3: Frontend Cannot Connect to Backend

**Symptom**: Frontend loads but API calls fail.

**Solution**:
1. Check `VITE_API_URL` is set correctly
2. Verify CORS is configured on backend
3. Check browser console for errors
4. Ensure backend domain is accessible

#### Issue 4: Build Fails with TypeScript Errors

**Symptom**: Deployment fails during build step.

**Solution**:
1. Run `npm run build` locally to reproduce
2. Fix TypeScript errors
3. Ensure `tsconfig.json` is configured correctly
4. Commit and push fixes

#### Issue 5: Prisma Migration Fails

**Symptom**: Backend starts but migrations don't run.

**Solution**:
1. Check migration files exist in `/backend/prisma/migrations`
2. Verify start command includes migration:
   ```bash
   npx prisma migrate deploy && npm start
   ```
3. Check database permissions
4. Run migration manually via console

#### Issue 6: Environment Variables Not Working

**Symptom**: App can't read environment variables.

**Solution**:
1. For backend: Use `process.env.VARIABLE_NAME`
2. For frontend: Use `import.meta.env.VITE_VARIABLE_NAME`
3. Frontend variables MUST start with `VITE_`
4. Rebuild after changing environment variables

#### Issue 7: Port Binding Error

**Symptom**: "Port already in use" or "EADDRINUSE".

**Solution**:
1. Ensure you use `process.env.PORT` (not hardcoded port)
2. Zeabur assigns ports automatically
3. Verify server.ts:
   ```typescript
   const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
   ```

---

## 11. Best Practices

### Development Workflow

1. **Local Development**
   - Use SQLite locally (faster, simpler)
   - Or run PostgreSQL via Docker
   - Keep `.env.example` file with required variables

2. **Git Workflow**
   - Never commit `.env` files
   - Use `.env.example` as template
   - Commit migration files
   - Use meaningful commit messages

3. **Testing Before Deployment**
   - Run all tests locally: `npm test`
   - Build locally to catch errors: `npm run build`
   - Test migrations: `npx prisma migrate reset`

### Production Best Practices

1. **Environment Variables**
   - Never hardcode secrets
   - Use Zeabur's template variables: `${POSTGRES_DATABASE_URL}`
   - Separate environment variables per environment

2. **Database Management**
   - Always use migrations (never modify schema directly)
   - Backup database regularly
   - Use `prisma migrate deploy` (not `migrate dev`) in production

3. **Performance Optimization**
   - Enable gzip compression in Express
   - Use proper caching headers
   - Optimize images and assets
   - Use code splitting in Vite

4. **Security**
   - Keep dependencies updated
   - Use HTTPS (Zeabur provides this automatically)
   - Implement rate limiting
   - Validate all inputs
   - Set proper CORS origins

5. **Monitoring**
   - Check Zeabur logs regularly
   - Set up health check endpoints
   - Monitor database performance
   - Track error rates

### Cost Optimization

1. **Resource Management**
   - Use appropriate instance sizes
   - Scale down during low-traffic periods
   - Monitor resource usage in Zeabur dashboard

2. **Database Optimization**
   - Use connection pooling
   - Optimize queries
   - Clean up old data regularly

3. **Frontend Optimization**
   - Enable static file caching
   - Minimize bundle size
   - Use lazy loading

### Continuous Deployment

Zeabur automatically deploys when you push to your main branch:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin master
   ```

2. Zeabur automatically:
   - Detects the push
   - Runs build
   - Runs tests (if configured)
   - Deploys to production
   - Runs migrations

3. Monitor deployment:
   - Check Zeabur dashboard
   - Review deployment logs
   - Verify health endpoints

---

## Quick Reference

### Essential Commands

```bash
# Build backend locally
cd backend && npm run build

# Build frontend locally
cd frontend && npm run build

# Run Prisma migrations locally
cd backend && npx prisma migrate dev

# Deploy Prisma migrations (production)
cd backend && npx prisma migrate deploy

# Generate Prisma client
cd backend && npx prisma generate

# Test API locally
curl http://localhost:3000/api/todos

# Test health endpoint
curl http://localhost:3000/health
```

### Environment Variable Templates

**Backend (.env.production):**
```env
DATABASE_URL=${POSTGRES_DATABASE_URL}
NODE_ENV=production
PORT=3000
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend.zeabur.app/api
```

### Zeabur CLI Commands

```bash
# Login
zeabur auth login

# Deploy current directory
zeabur

# View logs
zeabur logs

# List services
zeabur list

# Open dashboard
zeabur open
```

---

## Additional Resources

### Official Documentation

- [Zeabur Documentation](https://zeabur.com/docs)
- [Zeabur Node.js Guide](https://zeabur.com/docs/guides/nodejs)
- [Zeabur PostgreSQL Guide](https://zeabur.com/docs/services/postgresql)
- [Prisma Documentation](https://www.prisma.io/docs)

### Project-Specific Documentation

- [API Specification](./API-Specification.md)
- [System Design Document](./SDD.md)
- [Database Design](./Database-Design.md)
- [Project Roadmap](./Project-Roadmap.md)

### Support

- Zeabur Discord: https://discord.gg/zeabur
- Zeabur GitHub Issues: https://github.com/zeabur/zeabur/issues

---

## Maintenance Information

**Document Owner**: DevOps Team
**Last Updated**: 2025-10-18
**Next Review Date**: 2025-11-18
**Version**: 1.0.0

---

**End of Document**
