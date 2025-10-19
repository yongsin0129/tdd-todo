# Docker Compose 使用說明

本專案提供兩種 Docker Compose 配置：
- **開發環境** (`docker-compose.dev.yml`) - 使用 SQLite，支援熱重載
- **生產環境** (`docker-compose.prod.yml`) - 使用 PostgreSQL，完整的生產配置

## 開發環境設置 (推薦本地使用)

### 特點
- 使用 **SQLite** 資料庫 (schema.prisma)
- 支援**熱重載**，修改代碼即時生效
- 無需 PostgreSQL 容器，更輕量
- Vite 開發服務器 (port 5173)

### 快速開始

#### 1. 設置環境變數

```bash
cp .env.dev.example .env
```

#### 2. 啟動開發環境

```bash
docker-compose -f docker-compose.dev.yml up -d
```

第一次啟動時，會自動：
- 建置開發環境 Docker 映像檔
- 使用 SQLite 資料庫
- **執行 `prisma db push` 同步資料庫結構**（不使用 migration）
- 啟動 Backend API (開發模式)
- 啟動 Frontend (Vite 開發服務器)

#### 3. 訪問應用

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API 文檔**: http://localhost:3000/api-docs

#### 4. 修改代碼

由於掛載了源代碼目錄，您可以直接修改本地文件，容器內會自動重載：
- 修改 `backend/src/**/*.ts` → Backend 自動重啟
- 修改 `frontend/src/**/*` → Frontend 自動熱更新

#### 5. 停止開發環境

```bash
docker-compose -f docker-compose.dev.yml down
```

---

## 生產環境設置

### 特點
- 使用 **PostgreSQL** 資料庫 (schema.production.prisma)
- 優化的生產建置
- Nginx 提供靜態文件服務
- 包含健康檢查和自動重啟

### 快速開始

#### 1. 設置環境變數

```bash
cp .env.example .env
```

修改 `.env` 檔案，特別是：
- `POSTGRES_PASSWORD` (生產環境請務必更改)
- `CORS_ORIGIN` (設置為您的前端域名)

#### 2. 啟動生產環境

```bash
docker-compose -f docker-compose.prod.yml up -d
```

第一次啟動時，會自動：
- 建置生產環境 Docker 映像檔
- 啟動 PostgreSQL 資料庫
- **執行 `prisma db push` 同步資料庫結構**（不使用 migration）
- 啟動 Backend API (生產模式)
- 啟動 Frontend (Nginx)

#### 3. 訪問應用

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **API 文檔**: http://localhost:3000/api-docs

#### 4. 停止生產環境

```bash
docker-compose -f docker-compose.prod.yml down
```

停止並刪除所有數據（包括資料庫）：
```bash
docker-compose -f docker-compose.prod.yml down -v
```

---

## 常用命令

### 開發環境

```bash
# 啟動
docker-compose -f docker-compose.dev.yml up -d

# 查看日誌
docker-compose -f docker-compose.dev.yml logs -f

# 查看特定服務日誌
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend

# 重新建置
docker-compose -f docker-compose.dev.yml up -d --build

# 停止
docker-compose -f docker-compose.dev.yml down

# 進入 backend 容器
docker-compose -f docker-compose.dev.yml exec backend sh

# 執行資料庫命令
docker-compose -f docker-compose.dev.yml exec backend npx prisma studio
```

### 生產環境

```bash
# 啟動
docker-compose -f docker-compose.prod.yml up -d

# 查看日誌
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服務日誌
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres

# 重新建置
docker-compose -f docker-compose.prod.yml up -d --build

# 停止
docker-compose -f docker-compose.prod.yml down

# 進入 backend 容器
docker-compose -f docker-compose.prod.yml exec backend sh

# 進入 postgres 容器
docker-compose -f docker-compose.prod.yml exec postgres sh

# 執行資料庫命令
docker-compose -f docker-compose.prod.yml exec backend npx prisma studio
```

---

## 環境變數說明

### 開發環境 (.env.dev.example)

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| BACKEND_PORT | 3000 | Backend API 端口 |
| NODE_ENV | development | Node 環境 |
| CORS_ORIGIN | http://localhost:5173 | CORS 允許的來源 |
| FRONTEND_PORT | 5173 | Frontend 端口 (Vite) |
| VITE_API_URL | http://localhost:3000/api | API URL |

**注意**: 開發環境使用 SQLite，無需配置 PostgreSQL

### 生產環境 (.env.example)

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| POSTGRES_USER | todolist | PostgreSQL 用戶名 |
| POSTGRES_PASSWORD | todolist123 | PostgreSQL 密碼 |
| POSTGRES_DB | todolist | PostgreSQL 資料庫名稱 |
| POSTGRES_PORT | 5432 | PostgreSQL 端口 |
| BACKEND_PORT | 3000 | Backend API 端口 |
| NODE_ENV | production | Node 環境 |
| CORS_ORIGIN | http://localhost | CORS 允許的來源 |
| FRONTEND_PORT | 80 | Frontend 端口 (Nginx) |
| VITE_API_URL | http://localhost:3000/api | API URL |

---

## 選擇開發方式

### 方案 1: Docker 開發環境 (推薦初學者)

**優點**:
- 環境一致性，避免"在我電腦上可以運行"的問題
- 無需在本地安裝 Node.js
- 支援熱重載

**缺點**:
- 首次建置較慢
- 需要熟悉 Docker 命令

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 方案 2: 本地直接運行 (推薦有經驗的開發者)

**優點**:
- 啟動快速
- 方便除錯
- IDE 支援更好

**缺點**:
- 需要本地安裝 Node.js 22
- 需要手動管理依賴

```bash
# 安裝依賴
npm run install:all

# 啟動開發服務器
npm run dev
```

### 方案 3: 混合模式

只在 Docker 中運行資料庫，本地運行應用：

```bash
# 只啟動 PostgreSQL (如果需要)
docker-compose -f docker-compose.prod.yml up -d postgres

# 本地運行應用
npm run dev
```

---

## 資料庫區別

### 開發環境 - SQLite
- 檔案: `backend/prisma/schema.prisma`
- 資料庫位置: `backend/prisma/dev.db`
- 優點: 輕量、無需額外服務
- 適用: 本地開發、測試

### 生產環境 - PostgreSQL
- 檔案: `backend/prisma/schema.production.prisma`
- 資料庫: Docker PostgreSQL 容器
- 優點: 功能完整、高性能
- 適用: 生產部署、完整測試

---

## 資料庫初始化策略

### 為什麼使用 `prisma db push` 而不是 `prisma migrate`？

本專案在 Docker 容器啟動時使用 `prisma db push` 來初始化資料庫，而不是傳統的 `prisma migrate deploy`。

#### 背景說明

本專案有兩種資料庫配置：
- **開發環境**: SQLite (`schema.prisma`)
- **生產環境**: PostgreSQL (`schema.production.prisma`)

專案中的 migration 檔案（`prisma/migrations/`）是為 SQLite 生成的，包含 SQLite 特定的語法（如 `DATETIME`、`PRIMARY KEY`），這些語法在 PostgreSQL 中可能不完全相容。

#### `prisma db push` vs `prisma migrate` 比較

| 特性 | `prisma db push` | `prisma migrate deploy` |
|------|-----------------|------------------------|
| **執行方式** | 直接同步 schema.prisma 到資料庫 | 執行 `migrations/` 目錄中的 SQL 檔案 |
| **需要 migration 檔案** | ❌ 不需要 | ✅ 必須存在 |
| **生成 migration** | ❌ 不生成 | ❌ 不生成（只執行） |
| **歷史記錄** | ❌ 無版本控制 | ✅ 有完整歷史 |
| **跨資料庫相容** | ✅ 自動適配不同資料庫 | ❌ SQL 語法需匹配資料庫 |
| **互動式** | ❌ 非互動 | ❌ 非互動 |
| **適用環境** | 開發、原型、Docker | 生產環境（團隊協作） |
| **安全性** | 中等 | 高（可審查 SQL） |
| **速度** | 快 | 較快 |

#### 具體原因

1. **SQLite vs PostgreSQL 語法差異**
   - 現有 migration 使用 `DATETIME`（SQLite）
   - PostgreSQL 應使用 `TIMESTAMP`
   - `db push` 會自動處理這些差異

2. **Docker 非互動環境**
   - `migrate dev` 需要輸入 migration 名稱
   - `db push` 完全自動化

3. **簡化部署流程**
   - 第一次部署時自動建立資料庫結構
   - 不需要預先準備 migration 檔案

#### 何時改用 `prisma migrate`？

如果你需要完整的 migration 管理（推薦用於大型專案），請按以下步驟操作：

1. **為 PostgreSQL 生成新的 migration**：
   ```bash
   # 在本地切換到 PostgreSQL schema
   cd backend
   cp prisma/schema.production.prisma prisma/schema.prisma

   # 連接到 PostgreSQL 並生成 migration
   # 設置 DATABASE_URL 為 PostgreSQL 連接字串
   export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   npx prisma migrate dev --name init_postgres
   ```

2. **commit migration 檔案到 git**：
   ```bash
   git add prisma/migrations/
   git commit -m "Add PostgreSQL migrations"
   ```

3. **修改 Dockerfile 使用 migrate deploy**：
   ```dockerfile
   # backend/Dockerfile
   CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
   ```

4. **團隊成員部署時自動執行 migration**

#### 查看實際的資料庫初始化腳本

開發環境 (`backend/Dockerfile.dev`):
```dockerfile
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run dev"]
```

生產環境 (`backend/Dockerfile`):
```dockerfile
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
```

兩個 Dockerfile 中都有詳細的註解說明，解釋了為什麼使用 `db push` 而不是 `migrate`。

---

## 故障排除

### 端口衝突

如果端口已被佔用，請修改 `.env` 檔案中的端口號。

### 開發環境熱重載不工作

確保源代碼目錄正確掛載：
```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### 生產環境資料庫連接失敗

確保 PostgreSQL 容器已完全啟動：
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs postgres
```

### 清理並重新開始

開發環境：
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d --build
```

生產環境：
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 健康檢查

### 開發環境
- Backend: 自動重載，無健康檢查
- Frontend: Vite 開發服務器

### 生產環境
- PostgreSQL: 檢查資料庫是否可連接
- Backend: 檢查 /health 端點
- Frontend: 檢查 nginx 是否正常響應

查看服務健康狀態：
```bash
docker-compose -f docker-compose.prod.yml ps
```

---

## 生產部署建議

1. **更改預設密碼**: 務必修改 `POSTGRES_PASSWORD`
2. **使用環境變數**: 不要在 `.env` 檔案中存儲敏感信息
3. **配置 HTTPS**: 使用反向代理配置 SSL/TLS
4. **數據備份**: 定期備份 `postgres_data` volume
5. **資源限制**: 為容器設置適當的資源限制
6. **監控**: 設置日誌收集和監控系統

---

## 檔案結構

```
.
├── docker-compose.dev.yml       # 開發環境配置 (SQLite)
├── docker-compose.prod.yml      # 生產環境配置 (PostgreSQL)
├── .env.dev.example             # 開發環境變數範例
├── .env.example                 # 生產環境變數範例
├── backend/
│   ├── Dockerfile.dev           # Backend 開發環境 Dockerfile
│   ├── Dockerfile               # Backend 生產環境 Dockerfile
│   └── prisma/
│       ├── schema.prisma        # SQLite schema (開發)
│       └── schema.production.prisma  # PostgreSQL schema (生產)
└── frontend/
    ├── Dockerfile.dev           # Frontend 開發環境 Dockerfile
    ├── Dockerfile               # Frontend 生產環境 Dockerfile
    └── nginx.conf               # Nginx 配置 (生產)
```

---

## 更多資訊

- [Docker Compose 文檔](https://docs.docker.com/compose/)
- [Prisma 文檔](https://www.prisma.io/docs)
- [專案 README](./readme.md)
