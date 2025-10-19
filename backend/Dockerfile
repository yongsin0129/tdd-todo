# Backend Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# 複製 package files
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 使用 PostgreSQL schema
RUN cp prisma/schema.production.prisma prisma/schema.prisma

# 生成 Prisma Client
RUN npx prisma generate

# 建置應用程式
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# 複製 package files
COPY package*.json ./

# 複製 prisma 目錄（包含 schema.production.prisma）
COPY prisma ./prisma/

# 使用 PostgreSQL schema（在 production stage 也要替換）
RUN cp prisma/schema.production.prisma prisma/schema.prisma

# 只安裝生產依賴（包含 prisma）
# --ignore-scripts: 跳過 prepare 腳本（不需要 husky）
RUN npm ci --only=production --ignore-scripts

# 重新生成 Prisma Client（使用 PostgreSQL schema）
RUN npx prisma generate

# 從 builder 複製建置好的應用程式碼
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# ==================== 啟動指令說明 ====================
# 使用 `prisma db push` 而不是 `prisma migrate deploy`
#
# 背景：
# 本專案有 SQLite (開發) 和 PostgreSQL (生產) 兩種資料庫配置
# 現有的 migration 檔案是為 SQLite 生成的 (見 prisma/migrations/)
#
# 為什麼用 db push？
# 1. 現有 migration 是 SQLite 語法 (DATETIME, PRIMARY KEY 等)
# 2. PostgreSQL 語法不完全相同 (應使用 TIMESTAMP)
# 3. migrate deploy 會嘗試執行 SQLite migration → 可能報錯
# 4. db push 會根據 schema.production.prisma 直接同步到 PostgreSQL
#
# prisma migrate deploy vs prisma db push：
# ┌─────────────────┬──────────────────┬─────────────────────┐
# │                 │ migrate deploy   │ db push             │
# ├─────────────────┼──────────────────┼─────────────────────┤
# │ 執行方式        │ 執行 migration   │ 直接同步 schema     │
# │ 需要 migration  │ ✅ 必須           │ ❌ 不需要            │
# │ 歷史記錄        │ ✅ 有             │ ❌ 無                │
# │ 跨資料庫        │ ❌ 需匹配語法     │ ✅ 自動適配          │
# │ 安全性          │ 高（生產推薦）   │ 中等                │
# └─────────────────┴──────────────────┴─────────────────────┘
#
# 如何改用 migrate deploy？（未來如果需要）
# 1. 為 PostgreSQL 生成新的 migration：
#    - 切換到 schema.production.prisma
#    - 執行 npx prisma migrate dev --name init_postgres
# 2. 將新 migration 檔案 commit 到 git
# 3. 修改此行為: npx prisma migrate deploy
#
# --skip-generate: 跳過重新生成 Prisma Client（建置時已生成）
# ======================================================

CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
