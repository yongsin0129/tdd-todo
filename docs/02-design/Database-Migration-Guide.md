# Database Migration Guide
# Migrating from SQLite to PostgreSQL for Zeabur Deployment

## Overview

This guide walks you through migrating your Todo application database from SQLite (development) to PostgreSQL (production) for deployment on Zeabur.

---

## Current State

Your application currently uses:
- **Database**: SQLite
- **Provider**: `sqlite`
- **Location**: `backend/prisma/dev.db`
- **Connection**: `file:./dev.db`

---

## Target State (Production)

For Zeabur deployment, you need:
- **Database**: PostgreSQL
- **Provider**: `postgresql`
- **Location**: Zeabur managed PostgreSQL
- **Connection**: Provided by Zeabur

---

## Migration Steps

### Option 1: Switch to PostgreSQL Only (Recommended for Production)

#### Step 1: Update Prisma Schema

**File**: `/backend/prisma/schema.prisma`

**Change:**
```diff
datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Complete Updated Schema:**
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  isCompleted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  completedAt DateTime?
  priority    String    @default("medium")
  dueDate     DateTime?

  @@map("todos")
}
```

#### Step 2: Update .env for Local Development

**Option A: Use PostgreSQL Locally (Recommended)**

Install PostgreSQL locally or use Docker:

```bash
# Using Docker
docker run --name todo-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todolist -p 5432:5432 -d postgres:15
```

Update `/backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todolist"
```

**Option B: Keep SQLite for Local (Not Recommended)**

You can keep using SQLite locally, but this creates environment inconsistency.

#### Step 3: Regenerate Prisma Client

```bash
cd backend
npx prisma generate
```

#### Step 4: Create Initial Migration

```bash
# Create migration for PostgreSQL
npx prisma migrate dev --name init

# This creates:
# - prisma/migrations/TIMESTAMP_init/migration.sql
# - Updates Prisma client
```

#### Step 5: Test Locally

```bash
# Start backend
npm run dev

# Test API
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test PostgreSQL"}'
```

#### Step 6: Commit Changes

```bash
git add .
git commit -m "chore: migrate from SQLite to PostgreSQL"
git push origin master
```

---

### Option 2: Support Both SQLite and PostgreSQL (Development Flexibility)

This approach allows SQLite for local development and PostgreSQL for production.

#### Step 1: Update Prisma Schema

Keep schema compatible with both databases:

```prisma
datasource db {
  provider = "postgresql"  // Default to PostgreSQL
  url      = env("DATABASE_URL")
}
```

#### Step 2: Environment-Specific Configuration

**Local Development** (`.env`):
```env
# Use SQLite for local development
DATABASE_URL="file:./dev.db"
```

**Production** (Zeabur):
```env
# Use PostgreSQL in production
DATABASE_URL="${POSTGRES_DATABASE_URL}"
```

#### Step 3: Handle Provider Switching

Update `backend/prisma/schema.prisma` to be database-agnostic where possible.

**Note**: Some Prisma features are database-specific. Most of your schema is compatible with both.

---

## Migration Verification

### Local Verification

```bash
cd backend

# Check Prisma status
npx prisma migrate status

# Generate client
npx prisma generate

# Test connection
npx prisma db push

# View database
npx prisma studio
```

### Production Verification (After Deployment)

On Zeabur, migrations run automatically via the start command:
```bash
npx prisma migrate deploy && npm start
```

To verify:
1. Check Zeabur logs for migration output
2. Test API endpoints
3. Create/read/update/delete todos

---

## Data Migration (If Needed)

If you have existing SQLite data you want to migrate:

### Step 1: Export Data from SQLite

```bash
cd backend

# Export as JSON
node -e "
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function exportData() {
  const todos = await prisma.todo.findMany();
  fs.writeFileSync('todos-export.json', JSON.stringify(todos, null, 2));
  console.log('Exported', todos.length, 'todos');
  await prisma.\$disconnect();
}

exportData();
"
```

### Step 2: Import to PostgreSQL

```bash
# After switching to PostgreSQL

node -e "
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  const todos = JSON.parse(fs.readFileSync('todos-export.json', 'utf8'));

  for (const todo of todos) {
    await prisma.todo.create({ data: todo });
  }

  console.log('Imported', todos.length, 'todos');
  await prisma.\$disconnect();
}

importData();
"
```

---

## Troubleshooting

### Issue: "Provider not supported"

**Error**: `Error: Provider "postgresql" is not supported with this Prisma Client`

**Solution**:
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Issue: "Connection refused"

**Error**: `Can't reach database server at localhost:5432`

**Solution**:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL is correct
3. Verify PostgreSQL port (default: 5432)

### Issue: "Migration failed"

**Error**: Migration fails in Prisma

**Solution**:
```bash
# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Or manually fix migration
npx prisma migrate resolve --rolled-back "migration_name"
```

### Issue: Type Differences

Some SQLite types differ from PostgreSQL:

| SQLite | PostgreSQL | Notes |
|--------|------------|-------|
| TEXT | VARCHAR/TEXT | Compatible |
| INTEGER | INTEGER/BIGINT | Compatible |
| REAL | DECIMAL/NUMERIC | May need adjustment |
| BLOB | BYTEA | Different syntax |

Your current schema is compatible with both! ✓

---

## Best Practices

### 1. Always Use Migrations

```bash
# Good: Create migration
npx prisma migrate dev --name add_priority_field

# Bad: Direct schema push in production
npx prisma db push  # Only for development!
```

### 2. Version Control Migrations

- Always commit migration files
- Don't modify existing migrations
- Create new migrations for changes

### 3. Test Migrations Locally First

```bash
# Test migration locally
npx prisma migrate dev

# Then deploy to production
npx prisma migrate deploy
```

### 4. Backup Before Migration

For production with existing data:
1. Backup PostgreSQL database
2. Test migration on staging
3. Run migration during low-traffic period
4. Have rollback plan ready

---

## PostgreSQL-Specific Features

Once on PostgreSQL, you can use advanced features:

### Full-Text Search
```prisma
model Todo {
  // ... existing fields
  @@index([title(ops: TextSearchOps)], type: GIN)
}
```

### JSON Fields
```prisma
model Todo {
  metadata Json?
}
```

### Array Fields
```prisma
model Todo {
  tags String[]
}
```

---

## Performance Considerations

### Indexes

Your current schema already has:
- Primary key index on `id`
- Automatic index on foreign keys (if any)

For better performance, consider adding:

```prisma
model Todo {
  // ... existing fields

  @@index([isCompleted])
  @@index([createdAt])
  @@index([userId]) // When you add multi-user support
}
```

### Connection Pooling

Prisma handles connection pooling automatically. For production, you can configure:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // Optional: Configure connection pool
  // connectionLimit = 10
}
```

---

## Rollback Plan

If something goes wrong:

### Rollback to SQLite

1. Revert Prisma schema:
```diff
datasource db {
-  provider = "postgresql"
+  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Update .env:
```env
DATABASE_URL="file:./dev.db"
```

3. Regenerate client:
```bash
npx prisma generate
```

### Rollback Migration

```bash
# Roll back last migration
npx prisma migrate resolve --rolled-back "migration_name"
```

---

## Summary Checklist

- [ ] Update `datasource db` provider to `postgresql`
- [ ] Set up PostgreSQL locally (or use Docker)
- [ ] Update `DATABASE_URL` in `.env`
- [ ] Run `npx prisma generate`
- [ ] Create migration: `npx prisma migrate dev --name init`
- [ ] Test locally
- [ ] Export existing data (if needed)
- [ ] Commit migration files
- [ ] Deploy to Zeabur
- [ ] Verify migrations ran in production
- [ ] Test production API
- [ ] Import data (if needed)

---

## Quick Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# View database
npx prisma studio

# Check migration status
npx prisma migrate status

# Format schema
npx prisma format
```

---

## Additional Resources

- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Database Provider Switching](https://www.prisma.io/docs/guides/migrate/seed-database)

---

Last Updated: 2025-10-18
Version: 1.0.0
