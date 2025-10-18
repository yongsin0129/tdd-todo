# Database Design Document
# TodoList 應用程式資料庫設計文件

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | TodoList 應用程式資料庫設計文件 (Database Design Document) |
| 版本號 | 1.1.0 |
| 撰寫日期 | 2025-10-17 |
| 最後更新 | 2025-10-18 |
| 撰寫人 | Backend Development Team |
| 審核人 | Database Architect, DevOps Team |
| 狀態 | 已核准 |
| 相關文件 | SDD.md, API-Specification.md, PRD.md |

## 變更歷史記錄

| 版本 | 日期 | 變更內容 | 變更人 | 相關 CR |
|------|------|---------|--------|---------|
| 1.1.0 | 2025-10-18 | 新增 Zeabur 部署環境資訊：更新生產環境配置、新增 Zeabur 遷移步驟、新增環境變數說明 | DevOps Team | - |
| 1.0.0 | 2025-10-17 | 初始版本建立，定義 Todo 資料表結構 | Backend Team | - |

---

## 目錄

1. [資料庫概述](#1-資料庫概述)
2. [資料庫選型](#2-資料庫選型)
3. [資料表設計](#3-資料表設計)
4. [索引設計](#4-索引設計)
5. [關聯設計](#5-關聯設計)
6. [資料遷移](#6-資料遷移)
7. [資料完整性](#7-資料完整性)
8. [效能優化](#8-效能優化)
9. [備份與恢復策略](#9-備份與恢復策略)
10. [安全性考量](#10-安全性考量)
11. [擴展性規劃](#11-擴展性規劃)
12. [附錄](#12-附錄)

---

## 1. 資料庫概述

### 1.1 資料庫架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                  (Node.js + Express)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                      Prisma Client                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Type-safe queries                                 │   │
│  │  • Auto-generated TypeScript types                   │   │
│  │  • Query builder                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│                   Database Engine                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Development:  SQLite 3                              │   │
│  │  Production:   PostgreSQL 14+ (未來)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Storage                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • SQLite:      File-based (dev.db)                  │   │
│  │  • PostgreSQL:  Server-based (未來)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 資料庫基本資訊

| 項目 | 開發環境 | 生產環境 (Zeabur) |
|------|---------|-------------------|
| **資料庫系統** | SQLite 3 | PostgreSQL 15 |
| **ORM 工具** | Prisma 6.17.1 | Prisma 6.17.1 |
| **字元編碼** | UTF-8 | UTF-8 |
| **時區設定** | UTC | UTC |
| **資料庫檔案** | `prisma/dev.db` | Zeabur Managed Database |
| **連線字串** | `file:./dev.db` | `${POSTGRES_DATABASE_URL}` |
| **部署平台** | Local | Zeabur Platform |
| **自動備份** | 手動備份 | ✅ Zeabur 自動備份 |
| **連線池** | 不需要 | ✅ Zeabur 自動管理 |
| **高可用性** | 單機 | ✅ Zeabur 提供 |

### 1.3 資料庫設計目標

- **簡潔性**: MVP 階段保持最小化設計
- **擴展性**: 設計支援未來功能擴展
- **效能**: 優化查詢效能，滿足 < 50ms 目標
- **一致性**: 確保資料完整性和一致性
- **可維護性**: 清晰的命名和文件化

---

## 2. 資料庫選型

### 2.1 SQLite (開發環境)

#### 選擇理由

| 優點 | 說明 |
|------|------|
| **零配置** | 無需安裝資料庫伺服器，開箱即用 |
| **輕量級** | 單一檔案資料庫，易於管理 |
| **跨平台** | 支援 Windows, macOS, Linux |
| **快速開發** | 適合快速原型開發和測試 |
| **事務支援** | 完整的 ACID 特性 |
| **易於遷移** | Prisma 支援無縫遷移至 PostgreSQL |

#### 限制

| 限制項目 | 說明 | 影響 |
|---------|------|------|
| **並發寫入** | 同時只允許一個寫入操作 | 開發環境影響小 |
| **擴展性** | 不適合高流量生產環境 | 需遷移至 PostgreSQL |
| **功能限制** | 某些進階 SQL 功能不支援 | 目前需求已滿足 |

### 2.2 PostgreSQL (生產環境 - 未來)

#### 選擇理由

| 優點 | 說明 |
|------|------|
| **成熟穩定** | 業界標準，經過充分驗證 |
| **功能完整** | 支援進階 SQL 功能、JSON、全文搜尋 |
| **高並發** | 優秀的多使用者並發處理 |
| **擴展性** | 支援複製、分片、叢集 |
| **開源免費** | 無授權費用 |

#### 遷移策略

```prisma
// Prisma Schema 支援多種資料庫
datasource db {
  provider = "sqlite"        // 開發環境
  // provider = "postgresql" // 生產環境
  url      = env("DATABASE_URL")
}
```

### 2.3 Prisma ORM 選擇理由

| 特性 | 優勢 |
|------|------|
| **型別安全** | 自動生成 TypeScript 型別定義 |
| **遷移工具** | 強大的資料庫遷移系統 |
| **查詢建構器** | 直覺的 API，減少 SQL 錯誤 |
| **多資料庫支援** | 輕鬆切換資料庫引擎 |
| **效能優化** | 自動化查詢優化和連線池管理 |

---

## 3. 資料表設計

### 3.1 todos 資料表

#### 3.1.1 資料表概述

| 屬性 | 值 |
|------|-----|
| **資料表名稱** | `todos` |
| **主要用途** | 儲存待辦事項資料 |
| **預估資料量** | < 10,000 筆 (MVP) |
| **存取頻率** | 高頻讀寫 |

#### 3.1.2 Prisma Schema 定義

```prisma
model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  isCompleted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  completedAt DateTime?

  @@map("todos")
}
```

#### 3.1.3 欄位詳細說明

| 欄位名稱 | 資料型別 | 長度 | 允許 NULL | 預設值 | 描述 |
|---------|---------|------|----------|--------|------|
| **id** | VARCHAR (UUID) | 36 | ❌ | uuid() | 主鍵，自動生成 UUID v4 |
| **title** | VARCHAR | 255 | ❌ | - | 待辦事項標題 |
| **description** | TEXT | - | ✅ | NULL | 待辦事項詳細描述 |
| **isCompleted** | BOOLEAN | - | ❌ | false | 完成狀態 |
| **createdAt** | DATETIME | - | ❌ | now() | 建立時間戳 |
| **updatedAt** | DATETIME | - | ❌ | now() | 最後更新時間戳 |
| **completedAt** | DATETIME | - | ✅ | NULL | 完成時間戳 |

#### 3.1.4 SQL 創建語句 (SQLite)

```sql
CREATE TABLE "todos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME
);
```

#### 3.1.5 SQL 創建語句 (PostgreSQL - 未來)

```sql
CREATE TABLE "todos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);
```

#### 3.1.6 欄位約束條件

| 欄位 | 約束類型 | 約束說明 |
|------|---------|---------|
| **id** | PRIMARY KEY | 主鍵約束 |
| **id** | UNIQUE | 唯一性約束 (隱含於主鍵) |
| **title** | NOT NULL | 非空約束 |
| **title** | CHECK | 長度 > 0 且 <= 255 (應用層驗證) |
| **isCompleted** | NOT NULL | 非空約束 |
| **createdAt** | NOT NULL | 非空約束 |
| **updatedAt** | NOT NULL | 非空約束 |

#### 3.1.7 資料範例

```sql
-- 範例 1: 未完成的待辦事項
INSERT INTO todos (id, title, description, isCompleted, createdAt, updatedAt, completedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '完成專案報告',
  '需要包含需求分析和系統設計兩個部分',
  0,
  '2025-10-17 10:00:00',
  '2025-10-17 10:00:00',
  NULL
);

-- 範例 2: 已完成的待辦事項
INSERT INTO todos (id, title, description, isCompleted, createdAt, updatedAt, completedAt)
VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '回覆客戶郵件',
  NULL,
  1,
  '2025-10-17 09:00:00',
  '2025-10-17 11:30:00',
  '2025-10-17 11:30:00'
);

-- 範例 3: 最小化待辦事項
INSERT INTO todos (id, title, description, isCompleted, createdAt, updatedAt, completedAt)
VALUES (
  '770e8400-e29b-41d4-a716-446655440002',
  'Buy milk',
  NULL,
  0,
  '2025-10-17 10:05:00',
  '2025-10-17 10:05:00',
  NULL
);
```

### 3.2 未來擴展資料表 (Phase 2+)

#### 3.2.1 users 資料表 (使用者認證)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // 雜湊後的密碼
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  todos     Todo[]   // 一對多關聯

  @@map("users")
}
```

#### 3.2.2 tags 資料表 (標籤系統)

```prisma
model Tag {
  id        String   @id @default(uuid())
  name      String   @unique
  color     String?  // 顏色代碼
  createdAt DateTime @default(now())

  todos     TodoTag[]

  @@map("tags")
}
```

#### 3.2.3 todo_tags 資料表 (多對多關聯)

```prisma
model TodoTag {
  todoId    String
  tagId     String
  createdAt DateTime @default(now())

  todo      Todo     @relation(fields: [todoId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([todoId, tagId])
  @@map("todo_tags")
}
```

---

## 4. 索引設計

### 4.1 當前索引 (MVP)

#### 4.1.1 主鍵索引

```sql
-- 自動建立於 id 欄位
CREATE UNIQUE INDEX "todos_pkey" ON "todos"("id");
```

**用途**:
- 快速查詢單一待辦事項 (`GET /api/todos/:id`)
- 保證 id 唯一性

**效能影響**:
- 查詢時間: O(log n)
- 空間成本: ~10% 資料表大小

#### 4.1.2 複合索引 - createdAt (降序)

```prisma
model Todo {
  // ... 其他欄位

  @@index([createdAt(sort: Desc)])
}
```

對應 SQL:
```sql
CREATE INDEX "idx_todos_createdAt" ON "todos"("createdAt" DESC);
```

**用途**:
- 加速列表查詢 (`GET /api/todos`)
- 預設排序: 最新建立的在前

**查詢範例**:
```sql
SELECT * FROM todos ORDER BY createdAt DESC LIMIT 20;
```

**效能影響**:
- 查詢時間: O(log n + k), k = 返回筆數
- 插入時間: 微增 (~5%)

#### 4.1.3 篩選索引 - isCompleted

```prisma
model Todo {
  // ... 其他欄位

  @@index([isCompleted])
}
```

對應 SQL:
```sql
CREATE INDEX "idx_todos_isCompleted" ON "todos"("isCompleted");
```

**用途**:
- 加速完成狀態篩選 (`GET /api/todos?isCompleted=false`)
- 支援統計查詢

**查詢範例**:
```sql
SELECT * FROM todos WHERE isCompleted = 0;
SELECT COUNT(*) FROM todos WHERE isCompleted = 1;
```

**效能影響**:
- 查詢時間: O(log n + k)
- 空間成本: ~5% 資料表大小

#### 4.1.4 複合索引 - isCompleted + createdAt

```prisma
model Todo {
  // ... 其他欄位

  @@index([isCompleted, createdAt(sort: Desc)])
}
```

對應 SQL:
```sql
CREATE INDEX "idx_todos_isCompleted_createdAt"
ON "todos"("isCompleted", "createdAt" DESC);
```

**用途**:
- 優化同時篩選和排序的查詢

**查詢範例**:
```sql
SELECT * FROM todos
WHERE isCompleted = 0
ORDER BY createdAt DESC
LIMIT 20;
```

**效能影響**:
- 查詢時間: O(log n + k)
- 空間成本: ~8% 資料表大小

### 4.2 索引效能分析

#### 4.2.1 查詢效能比較

| 查詢類型 | 無索引 | 有索引 | 改善 |
|---------|-------|-------|------|
| `SELECT * FROM todos WHERE id = ?` | O(n) | O(log n) | ~1000x |
| `SELECT * FROM todos ORDER BY createdAt DESC LIMIT 20` | O(n log n) | O(log n + 20) | ~100x |
| `SELECT * FROM todos WHERE isCompleted = 0` | O(n) | O(log n + k) | ~50x |

#### 4.2.2 索引維護成本

| 操作 | 無索引 | 有索引 | 增加成本 |
|------|-------|-------|---------|
| INSERT | O(1) | O(log n × 索引數) | ~10-15% |
| UPDATE | O(1) | O(log n × 索引數) | ~10-15% |
| DELETE | O(1) | O(log n × 索引數) | ~10-15% |

**結論**: 讀取頻繁的應用，索引帶來的效能提升遠大於維護成本。

### 4.3 索引使用建議

#### 應該建立索引的場景

✅ **經常用於 WHERE 條件的欄位**
```sql
WHERE isCompleted = true
WHERE createdAt > '2025-01-01'
```

✅ **經常用於 ORDER BY 的欄位**
```sql
ORDER BY createdAt DESC
ORDER BY updatedAt DESC
```

✅ **經常用於 JOIN 的外鍵欄位** (未來)
```sql
JOIN users ON todos.userId = users.id
```

#### 不應該建立索引的場景

❌ **低基數欄位** (值種類很少)
```sql
-- isCompleted 只有 true/false 兩種值
-- 但因查詢頻繁，仍建議索引
```

❌ **很少查詢的欄位**
```sql
-- description 欄位很少單獨查詢
```

❌ **頻繁更新的欄位**
```sql
-- 如果某欄位每秒更新數百次，索引成本過高
```

---

## 5. 關聯設計

### 5.1 當前關聯 (MVP)

MVP 階段**無關聯設計**，只有單一 `todos` 資料表。

### 5.2 未來關聯設計 (Phase 2+)

#### 5.2.1 ER 圖 (Entity-Relationship Diagram)

```
┌─────────────────┐
│      User       │
│─────────────────│
│ id (PK)         │───┐
│ email           │   │ 1
│ password        │   │
│ name            │   │
│ createdAt       │   │
│ updatedAt       │   │
└─────────────────┘   │
                      │
                      │ has many
                      │
                      │ N
┌─────────────────┐   │
│      Todo       │───┘
│─────────────────│
│ id (PK)         │───┐
│ title           │   │ N
│ description     │   │
│ isCompleted     │   │
│ userId (FK)     │   │
│ createdAt       │   │
│ updatedAt       │   │
│ completedAt     │   │
└─────────────────┘   │
                      │
                      │ has many
                      │
                      │ N
┌─────────────────┐   │
│    TodoTag      │───┘
│─────────────────│
│ todoId (PK, FK) │───┐
│ tagId (PK, FK)  │   │ N
│ createdAt       │   │
└─────────────────┘   │
                      │
                      │ belongs to
                      │
                      │ 1
┌─────────────────┐   │
│       Tag       │───┘
│─────────────────│
│ id (PK)         │
│ name            │
│ color           │
│ createdAt       │
└─────────────────┘
```

#### 5.2.2 關聯類型說明

**1. User → Todo (一對多)**

```prisma
model User {
  id    String @id @default(uuid())
  todos Todo[]
}

model Todo {
  id     String @id @default(uuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

**SQL 外鍵約束**:
```sql
ALTER TABLE todos
ADD CONSTRAINT fk_todos_user
FOREIGN KEY (userId)
REFERENCES users(id)
ON DELETE CASCADE;  -- 使用者刪除時，連帶刪除其待辦事項
```

**2. Todo ↔ Tag (多對多)**

```prisma
model Todo {
  id   String    @id @default(uuid())
  tags TodoTag[]
}

model Tag {
  id    String    @id @default(uuid())
  todos TodoTag[]
}

model TodoTag {
  todoId String
  tagId  String
  todo   Todo   @relation(fields: [todoId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([todoId, tagId])
}
```

**SQL 外鍵約束**:
```sql
ALTER TABLE todo_tags
ADD CONSTRAINT fk_todo_tags_todo
FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE;

ALTER TABLE todo_tags
ADD CONSTRAINT fk_todo_tags_tag
FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE;
```

#### 5.2.3 級聯操作策略

| 關聯 | ON DELETE | ON UPDATE | 理由 |
|------|----------|-----------|------|
| User → Todo | CASCADE | CASCADE | 使用者刪除時，刪除其所有待辦事項 |
| Todo ↔ Tag | CASCADE | CASCADE | 待辦事項或標籤刪除時，移除關聯記錄 |

---

## 6. 資料遷移

### 6.1 Prisma 遷移系統

#### 6.1.1 遷移檔案結構

```
prisma/
├── schema.prisma           # Schema 定義
├── migrations/             # 遷移歷史
│   ├── 20251014052131_init/
│   │   └── migration.sql   # 初始化資料表
│   ├── 20251017100000_add_priority/
│   │   └── migration.sql   # 新增優先級欄位
│   └── migration_lock.toml # 遷移鎖定檔案
└── dev.db                  # SQLite 資料庫檔案
```

#### 6.1.2 當前遷移記錄

**Migration 1: 初始化 (20251014052131_init)**

```sql
-- CreateTable
CREATE TABLE "todos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME
);
```

### 6.2 遷移操作指令

#### 6.2.1 開發環境遷移

```bash
# 建立新的遷移 (根據 schema.prisma 變更)
npx prisma migrate dev --name add_priority

# 重置資料庫 (⚠️ 警告: 會刪除所有資料)
npx prisma migrate reset

# 查看遷移狀態
npx prisma migrate status

# 生成 Prisma Client (型別定義)
npx prisma generate
```

#### 6.2.2 生產環境遷移

```bash
# 套用遷移 (不建立新遷移)
npx prisma migrate deploy

# 解析遷移歷史
npx prisma migrate resolve --applied "20251014052131_init"
```

### 6.3 遷移最佳實踐

#### 6.3.1 遷移命名規範

```bash
# 好的命名
npx prisma migrate dev --name add_user_table
npx prisma migrate dev --name add_priority_field
npx prisma migrate dev --name create_tags_relation

# 不好的命名
npx prisma migrate dev --name migration1
npx prisma migrate dev --name fix
npx prisma migrate dev --name update
```

#### 6.3.2 遷移安全守則

✅ **應該做的**:
- 每次 Schema 變更都建立遷移
- 遷移前備份生產資料庫
- 在開發環境先測試遷移
- 為遷移命名清楚描述變更內容
- 提交遷移檔案至版本控制

❌ **不應該做的**:
- 手動修改已套用的遷移 SQL
- 在生產環境使用 `migrate reset`
- 跳過遷移直接修改資料庫
- 刪除遷移歷史記錄

#### 6.3.3 資料遷移腳本範例

**場景**: 新增 `priority` 欄位並設定預設值

```sql
-- Migration SQL
ALTER TABLE todos ADD COLUMN priority TEXT DEFAULT 'medium';

-- 資料遷移: 將重要的待辦事項設為高優先級
UPDATE todos
SET priority = 'high'
WHERE title LIKE '%重要%' OR title LIKE '%urgent%';

-- 資料遷移: 已完成的設為低優先級
UPDATE todos
SET priority = 'low'
WHERE isCompleted = 1;
```

### 6.4 SQLite → PostgreSQL 遷移策略

#### 6.4.1 遷移步驟

```bash
# Step 1: 匯出 SQLite 資料
npx prisma db pull  # 確認 schema 最新
sqlite3 dev.db .dump > backup.sql

# Step 2: 修改 schema.prisma
# datasource db {
#   provider = "postgresql"
#   url      = env("DATABASE_URL")
# }

# Step 3: 建立 PostgreSQL 遷移
npx prisma migrate dev --name initial_postgresql

# Step 4: 匯入資料
psql $DATABASE_URL < backup.sql  # 需要轉換 SQL 語法

# Step 5: 驗證資料
npx prisma studio  # 檢查資料完整性
```

#### 6.4.2 資料型別對應

| SQLite | PostgreSQL | 注意事項 |
|--------|-----------|---------|
| TEXT | VARCHAR / TEXT | 需設定長度限制 |
| INTEGER | INTEGER / BIGINT | 數值範圍不同 |
| REAL | NUMERIC / DOUBLE PRECISION | 精度處理 |
| BOOLEAN | BOOLEAN | SQLite 用 0/1 儲存 |
| DATETIME | TIMESTAMP | 時區處理 |

#### 6.4.3 Zeabur 平台部署遷移步驟

**適用場景**: 使用 Zeabur 平台進行生產環境部署

**前置條件**:
- GitHub repository 已更新
- Prisma schema 已改為 `provider = "postgresql"`
- 已創建 zbpack.json 配置文件

**步驟 1: 在 Zeabur 創建專案**

```bash
# 登入 Zeabur Dashboard
https://dash.zeabur.com

# 創建新專案
# 1. 點擊 "Create New Project"
# 2. 命名: "tdd-todolist"
# 3. 選擇部署區域 (推薦: ap-east 或最接近用戶的區域)
```

**步驟 2: 部署 PostgreSQL 服務**

```bash
# 在 Zeabur 專案中
# 1. 點擊 "Add Service" → "Marketplace"
# 2. 搜尋並選擇 "PostgreSQL"
# 3. 點擊 "Deploy"
# 4. 等待服務啟動 (~1-2 分鐘)
# 5. 記下服務名稱 (通常為 "postgres" 或 "postgresql")
```

**步驟 3: 部署後端服務**

```bash
# 在 Zeabur 專案中
# 1. 點擊 "Add Service" → "Git"
# 2. 連接 GitHub 並選擇 repository
# 3. Zeabur 自動檢測 `/backend` 目錄
# 4. 配置環境變數:
```

環境變數設定：
```env
DATABASE_URL=${POSTGRES_DATABASE_URL}
NODE_ENV=production
```

zbpack.json 配置：
```json
{
  "build_command": "npm run build && npx prisma generate",
  "start_command": "npx prisma migrate deploy && npm start"
}
```

**步驟 4: 驗證遷移**

```bash
# 查看 Zeabur 後端服務日誌
# 確認以下訊息:
# ✓ Prisma Migrate applied successfully
# ✓ Database migrations completed
# ✓ Server started on port 3000
```

**步驟 5: 部署前端服務**

```bash
# 1. 點擊 "Add Service" → "Git"
# 2. 選擇同一個 repository
# 3. Zeabur 自動檢測 `/frontend` 目錄
# 4. 配置環境變數:
```

前端環境變數：
```env
VITE_API_URL=https://your-backend-url.zeabur.app/api
```

**環境變數特殊語法**:

Zeabur 提供模板變數功能：
- `${POSTGRES_DATABASE_URL}` - 自動指向 PostgreSQL 服務
- `${SERVICE_NAME.DATABASE_URL}` - 指定服務名稱引用
- 格式: `postgresql://user:pass@host:port/db`

**常見問題排除**:

1. **遷移失敗**: 檢查 Prisma schema provider 是否為 `postgresql`
2. **連線錯誤**: 確認 `DATABASE_URL=${POSTGRES_DATABASE_URL}` 正確設定
3. **服務無法啟動**: 檢查 zbpack.json 的 start_command 是否包含遷移指令

**參考文件**:
- 完整部署指南: `docs/04-execution/devops/Zeabur-Deployment-Guide.md`
- 資料庫遷移: `docs/02-design/Database-Migration-Guide.md`

---

## 7. 資料完整性

### 7.1 約束條件

#### 7.1.1 主鍵約束 (PRIMARY KEY)

```sql
-- 確保每個 Todo 有唯一識別碼
CONSTRAINT todos_pkey PRIMARY KEY (id)
```

**保證**:
- id 欄位唯一
- id 欄位非空
- 快速查詢

#### 7.1.2 非空約束 (NOT NULL)

```sql
ALTER TABLE todos MODIFY COLUMN title TEXT NOT NULL;
ALTER TABLE todos MODIFY COLUMN isCompleted BOOLEAN NOT NULL;
```

**保證**:
- 必填欄位不會為 NULL
- 資料完整性

#### 7.1.3 預設值約束 (DEFAULT)

```sql
ALTER TABLE todos MODIFY COLUMN isCompleted BOOLEAN DEFAULT 0;
ALTER TABLE todos MODIFY COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;
```

**保證**:
- 插入時自動填入預設值
- 減少應用層邏輯

#### 7.1.4 檢查約束 (CHECK) - PostgreSQL

```sql
-- 標題長度限制
ALTER TABLE todos
ADD CONSTRAINT check_title_length
CHECK (LENGTH(title) > 0 AND LENGTH(title) <= 255);

-- 完成時間邏輯
ALTER TABLE todos
ADD CONSTRAINT check_completed_at
CHECK (
  (isCompleted = TRUE AND completedAt IS NOT NULL) OR
  (isCompleted = FALSE AND completedAt IS NULL)
);
```

**注意**: SQLite 對 CHECK 約束支援有限，主要在應用層驗證。

### 7.2 資料驗證策略

#### 7.2.1 資料庫層驗證

```sql
-- 主鍵、外鍵、非空、預設值
-- 由資料庫引擎強制執行
```

**優點**:
- 最後防線，無法繞過
- 效能最佳

**缺點**:
- 錯誤訊息不友善
- 難以客製化

#### 7.2.2 ORM 層驗證 (Prisma)

```typescript
// Prisma 自動驗證 Schema 定義
await prisma.todo.create({
  data: {
    title: '', // ❌ Prisma 會拋出錯誤
  }
});
```

**優點**:
- 型別安全
- 整合至開發流程

**缺點**:
- 依賴 Prisma Client

#### 7.2.3 應用層驗證

```typescript
// middleware/validation.ts
function validateTodo(data: any) {
  const errors = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }

  if (data.title.length > 255) {
    errors.push('Title must be less than 255 characters');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  return errors;
}
```

**優點**:
- 最友善的錯誤訊息
- 完全可控
- 多欄位聯合驗證

**缺點**:
- 可能被繞過（如直接操作資料庫）

### 7.3 資料一致性保證

#### 7.3.1 事務 (Transaction)

```typescript
// 原子性操作: 全部成功或全部失敗
await prisma.$transaction(async (tx) => {
  // 1. 建立 Todo
  const todo = await tx.todo.create({
    data: { title: 'New Todo' }
  });

  // 2. 建立關聯標籤
  await tx.todoTag.create({
    data: {
      todoId: todo.id,
      tagId: 'tag-id'
    }
  });
});
```

#### 7.3.2 樂觀鎖 (Optimistic Locking)

```prisma
model Todo {
  id      String @id
  version Int    @default(0)  // 版本號
  // ... 其他欄位
}
```

```typescript
// 更新時檢查版本號
const todo = await prisma.todo.findUnique({ where: { id } });

await prisma.todo.update({
  where: {
    id,
    version: todo.version  // 確保沒有被其他請求修改
  },
  data: {
    title: 'Updated',
    version: { increment: 1 }
  }
});
```

---

## 8. 效能優化

### 8.1 查詢優化

#### 8.1.1 只選取需要的欄位

```typescript
// ❌ 不好: 選取所有欄位
const todos = await prisma.todo.findMany();

// ✅ 好: 只選取需要的欄位
const todos = await prisma.todo.findMany({
  select: {
    id: true,
    title: true,
    isCompleted: true,
  }
});
```

**效能影響**:
- 減少網路傳輸: ~40%
- 減少記憶體使用: ~30%

#### 8.1.2 使用分頁

```typescript
// ❌ 不好: 一次載入所有資料
const todos = await prisma.todo.findMany();

// ✅ 好: 分頁載入
const todos = await prisma.todo.findMany({
  skip: (page - 1) * limit,
  take: limit,
});
```

**效能影響**:
- 查詢時間: O(n) → O(log n + k)
- 記憶體使用: 固定 (取決於 limit)

#### 8.1.3 避免 N+1 查詢問題

```typescript
// ❌ 不好: N+1 查詢 (未來有關聯時)
const users = await prisma.user.findMany();
for (const user of users) {
  const todos = await prisma.todo.findMany({
    where: { userId: user.id }
  });
}

// ✅ 好: 使用 include 或 select
const users = await prisma.user.findMany({
  include: {
    todos: true
  }
});
```

### 8.2 連線池管理

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// .env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"
```

**建議設定**:
- 開發環境: `connection_limit=5`
- 生產環境: `connection_limit=20-50` (取決於負載)

### 8.3 快取策略 (未來)

#### 8.3.1 應用層快取

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 }); // 60 秒 TTL

async function getTodos() {
  const cacheKey = 'todos:all';

  // 檢查快取
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 查詢資料庫
  const todos = await prisma.todo.findMany();

  // 寫入快取
  cache.set(cacheKey, todos);

  return todos;
}
```

#### 8.3.2 Redis 快取 (未來)

```typescript
import Redis from 'ioredis';

const redis = new Redis();

async function getTodo(id: string) {
  // 檢查 Redis
  const cached = await redis.get(`todo:${id}`);
  if (cached) return JSON.parse(cached);

  // 查詢資料庫
  const todo = await prisma.todo.findUnique({ where: { id } });

  // 寫入 Redis (5 分鐘 TTL)
  await redis.setex(`todo:${id}`, 300, JSON.stringify(todo));

  return todo;
}
```

### 8.4 資料庫監控

#### 8.4.1 Prisma 查詢日誌

```typescript
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

#### 8.4.2 慢查詢分析

```typescript
// 設定慢查詢閾值
prisma.$on('query', (e) => {
  if (e.duration > 50) { // 超過 50ms
    console.warn('Slow query detected:', e.query);
  }
});
```

---

## 9. 備份與恢復策略

### 9.1 SQLite 備份 (開發環境)

#### 9.1.1 檔案備份

```bash
# 簡單複製
cp prisma/dev.db prisma/dev.db.backup

# 使用 tar 壓縮
tar -czf backup-$(date +%Y%m%d).tar.gz prisma/dev.db

# 自動化腳本
#!/bin/bash
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
cp prisma/dev.db "$BACKUP_DIR/dev.db.$(date +%Y%m%d_%H%M%S)"
```

#### 9.1.2 SQL 匯出

```bash
# 匯出為 SQL
sqlite3 prisma/dev.db .dump > backup.sql

# 恢復
sqlite3 prisma/dev.db < backup.sql
```

### 9.2 PostgreSQL 備份 (生產環境 - 未來)

#### 9.2.1 pg_dump 備份

```bash
# 完整備份
pg_dump $DATABASE_URL > backup.sql

# 只備份資料 (不含結構)
pg_dump --data-only $DATABASE_URL > data.sql

# 只備份結構 (不含資料)
pg_dump --schema-only $DATABASE_URL > schema.sql

# 壓縮備份
pg_dump $DATABASE_URL | gzip > backup.sql.gz
```

#### 9.2.2 自動化備份腳本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DATABASE_URL="postgresql://..."

mkdir -p $BACKUP_DIR

# 執行備份
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# 保留最近 7 天的備份
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

#### 9.2.3 Cron 自動排程

```bash
# 每天凌晨 2 點執行備份
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### 9.3 恢復策略

#### 9.3.1 SQLite 恢復

```bash
# 從備份恢復
cp prisma/dev.db.backup prisma/dev.db

# 從 SQL 恢復
rm prisma/dev.db
sqlite3 prisma/dev.db < backup.sql
```

#### 9.3.2 PostgreSQL 恢復

```bash
# 從備份恢復
gunzip < backup.sql.gz | psql $DATABASE_URL

# 或
psql $DATABASE_URL < backup.sql
```

### 9.4 災難恢復計畫

#### 9.4.1 RPO & RTO 目標

| 環境 | RPO (資料遺失) | RTO (恢復時間) |
|------|--------------|--------------|
| 開發環境 | 1 天 | 30 分鐘 |
| 生產環境 | 1 小時 | 4 小時 |

**RPO** (Recovery Point Objective): 可接受的資料遺失量
**RTO** (Recovery Time Objective): 可接受的服務中斷時間

#### 9.4.2 備份檢查清單

- [ ] 每日自動備份執行正常
- [ ] 備份檔案完整性驗證
- [ ] 每週測試恢復流程
- [ ] 備份檔案異地儲存 (Cloud Storage)
- [ ] 記錄備份和恢復日誌
- [ ] 定期檢查磁碟空間

---

## 10. 安全性考量

### 10.1 SQL 注入防護

#### 10.1.1 使用 Prisma ORM

```typescript
// ✅ 安全: Prisma 自動參數化
const todo = await prisma.todo.findUnique({
  where: { id: userInput }
});

// ❌ 危險: 原生 SQL (如必要使用，請參數化)
await prisma.$executeRaw`SELECT * FROM todos WHERE id = ${userInput}`;
```

#### 10.1.2 參數化查詢

```typescript
// ✅ 安全: 使用參數化
await prisma.$queryRaw`
  SELECT * FROM todos
  WHERE title = ${userInput}
`;

// ❌ 危險: 字串拼接
await prisma.$queryRawUnsafe(
  `SELECT * FROM todos WHERE title = '${userInput}'`
);
```

### 10.2 資料加密

#### 10.2.1 傳輸層加密

```
生產環境:
- 使用 HTTPS/TLS 連線
- PostgreSQL SSL 模式: require
```

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

#### 10.2.2 欄位層加密 (未來 - 敏感資料)

```typescript
import crypto from 'crypto';

// 加密函式
function encrypt(text: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

// 解密函式
function decrypt(text: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### 10.3 存取控制

#### 10.3.1 資料庫使用者權限 (PostgreSQL - 未來)

```sql
-- 建立應用專用使用者
CREATE USER todoapp WITH PASSWORD 'strong_password';

-- 只授予必要權限
GRANT CONNECT ON DATABASE todolist TO todoapp;
GRANT SELECT, INSERT, UPDATE, DELETE ON todos TO todoapp;
GRANT USAGE, SELECT ON SEQUENCE todos_id_seq TO todoapp;

-- 不授予 DDL 權限 (CREATE, ALTER, DROP)
```

#### 10.3.2 環境變數管理

```bash
# .env (不提交至 Git)
DATABASE_URL="postgresql://todoapp:password@localhost:5432/todolist"
ENCRYPTION_KEY="32-byte-hex-string"

# .env.example (提交至 Git)
DATABASE_URL="postgresql://user:password@localhost:5432/database"
ENCRYPTION_KEY="your-encryption-key-here"
```

```gitignore
# .gitignore
.env
prisma/dev.db
prisma/dev.db-journal
```

### 10.4 稽核日誌 (未來)

```prisma
model AuditLog {
  id        String   @id @default(uuid())
  userId    String?
  action    String   // CREATE, UPDATE, DELETE
  tableName String
  recordId  String
  oldValue  Json?
  newValue  Json?
  createdAt DateTime @default(now())

  @@map("audit_logs")
}
```

---

## 11. 擴展性規劃

### 11.1 垂直擴展 (Scale Up)

#### 11.1.1 硬體升級

| 資源 | 當前 | 升級建議 |
|------|------|---------|
| CPU | 2 cores | 4-8 cores |
| RAM | 2GB | 8-16GB |
| 儲存 | HDD | SSD / NVMe |
| 網路 | 100Mbps | 1Gbps |

#### 11.1.2 資料庫配置調整 (PostgreSQL)

```sql
-- postgresql.conf 優化

-- 連線設定
max_connections = 100

-- 記憶體設定
shared_buffers = 2GB          -- 系統記憶體的 25%
effective_cache_size = 6GB    -- 系統記憶體的 50-75%
work_mem = 16MB
maintenance_work_mem = 512MB

-- 查詢優化
random_page_cost = 1.1        -- SSD 適用
effective_io_concurrency = 200

-- WAL 設定
wal_buffers = 16MB
checkpoint_completion_target = 0.9
```

### 11.2 水平擴展 (Scale Out - 未來)

#### 11.2.1 讀寫分離

```
┌─────────────┐
│ Application │
└─────────────┘
       │
       ├───────────┐
       ↓           ↓
┌────────────┐  ┌────────────┐
│ Write      │  │ Read       │
│ (Master)   │→ │ (Replica)  │
└────────────┘  └────────────┘
                      ↓
                ┌────────────┐
                │ Read       │
                │ (Replica)  │
                └────────────┘
```

```typescript
// Prisma 讀寫分離配置
const prismaWrite = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_WRITE }
  }
});

const prismaRead = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_READ }
  }
});

// 寫入操作使用 Master
await prismaWrite.todo.create({ ... });

// 讀取操作使用 Replica
await prismaRead.todo.findMany({ ... });
```

#### 11.2.2 資料分片 (Sharding)

**場景**: 資料量超過單一資料庫負載能力時

```
按使用者 ID 分片:
- Shard 1: userId 1-1000000
- Shard 2: userId 1000001-2000000
- Shard 3: userId 2000001-3000000

按時間分片:
- Shard 1: 2025 年資料
- Shard 2: 2024 年資料
- Shard 3: 2023 年資料
```

### 11.3 資料量成長預估

| 時間 | 使用者數 | Todo 數 | 資料庫大小 | 策略 |
|------|---------|--------|----------|------|
| MVP (1 個月) | 100 | 5,000 | < 10MB | 單一資料庫 |
| Phase 2 (3 個月) | 1,000 | 50,000 | < 100MB | 單一資料庫 + 索引優化 |
| Phase 3 (6 個月) | 10,000 | 500,000 | < 1GB | 單一資料庫 + 連線池 |
| Phase 4 (1 年) | 100,000 | 5,000,000 | < 10GB | 讀寫分離 |
| Phase 5 (2 年+) | 1,000,000 | 50,000,000 | < 100GB | 分片 + 快取 |

---

## 12. 附錄

### 12.1 Prisma 常用指令

```bash
# 初始化 Prisma
npx prisma init

# 生成 Prisma Client
npx prisma generate

# 建立遷移
npx prisma migrate dev --name migration_name

# 套用遷移 (生產環境)
npx prisma migrate deploy

# 重置資料庫 (⚠️ 警告: 刪除所有資料)
npx prisma migrate reset

# 開啟 Prisma Studio (GUI)
npx prisma studio

# 查看遷移狀態
npx prisma migrate status

# 從資料庫拉取 Schema
npx prisma db pull

# 推送 Schema 到資料庫 (不建立遷移)
npx prisma db push

# 格式化 Schema
npx prisma format
```

### 12.2 SQL 查詢範例

#### 12.2.1 基本查詢

```sql
-- 查詢所有待辦事項
SELECT * FROM todos;

-- 查詢未完成的待辦事項
SELECT * FROM todos WHERE isCompleted = 0;

-- 查詢最近建立的 10 個待辦事項
SELECT * FROM todos ORDER BY createdAt DESC LIMIT 10;

-- 統計完成率
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completed,
  CAST(SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 as completion_rate
FROM todos;
```

#### 12.2.2 聚合查詢

```sql
-- 每日新增待辦事項統計
SELECT
  DATE(createdAt) as date,
  COUNT(*) as count
FROM todos
GROUP BY DATE(createdAt)
ORDER BY date DESC;

-- 平均完成時間 (建立到完成的時間差)
SELECT
  AVG(JULIANDAY(completedAt) - JULIANDAY(createdAt)) as avg_days_to_complete
FROM todos
WHERE completedAt IS NOT NULL;
```

### 12.3 效能測試腳本

```typescript
// benchmark.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function benchmark() {
  console.time('Insert 1000 todos');
  await Promise.all(
    Array.from({ length: 1000 }, (_, i) =>
      prisma.todo.create({
        data: {
          title: `Todo ${i}`,
        }
      })
    )
  );
  console.timeEnd('Insert 1000 todos');

  console.time('Query 1000 todos');
  const todos = await prisma.todo.findMany();
  console.timeEnd('Query 1000 todos');

  console.time('Update 1000 todos');
  await Promise.all(
    todos.map(todo =>
      prisma.todo.update({
        where: { id: todo.id },
        data: { isCompleted: true }
      })
    )
  );
  console.timeEnd('Update 1000 todos');

  console.time('Delete 1000 todos');
  await prisma.todo.deleteMany();
  console.timeEnd('Delete 1000 todos');
}

benchmark();
```

### 12.4 資料庫 ER 圖 (當前)

```
┌─────────────────────────────────────┐
│              todos                  │
├─────────────────────────────────────┤
│ PK │ id          VARCHAR(36)        │
│    │ title       VARCHAR(255)       │
│    │ description TEXT               │
│    │ isCompleted BOOLEAN            │
│    │ createdAt   DATETIME           │
│    │ updatedAt   DATETIME           │
│    │ completedAt DATETIME           │
└─────────────────────────────────────┘

Indexes:
  - PRIMARY KEY (id)
  - INDEX (createdAt DESC)
  - INDEX (isCompleted)
  - INDEX (isCompleted, createdAt DESC)
```

### 12.5 相關文件連結

- **API 規格文件**: [API-Specification.md](./API-Specification.md)
- **系統設計文件**: [SDD.md](./SDD.md)
- **產品需求文件**: [PRD.md](./PRD.md)
- **專案路線圖**: [Project-Roadmap.md](./Project-Roadmap.md)
- **後端實作計畫**: [implementation-plan-backend.md](./implementation-plan-backend.md)

### 12.6 術語表

| 術語 | 英文 | 說明 |
|------|------|------|
| **ORM** | Object-Relational Mapping | 物件關聯對映，將資料庫操作對應到程式物件 |
| **遷移** | Migration | 資料庫結構變更的版本管理 |
| **索引** | Index | 加速查詢的資料結構 |
| **約束** | Constraint | 確保資料完整性的規則 |
| **事務** | Transaction | 一組原子性的資料庫操作 |
| **主鍵** | Primary Key | 唯一識別資料表中每筆記錄的欄位 |
| **外鍵** | Foreign Key | 建立資料表間關聯的欄位 |

---

## 文件維護

**維護責任**: 資料庫架構師、後端開發團隊
**更新頻率**: 每次資料庫 Schema 變更時更新
**版本控制**: 使用 Git 追蹤變更

**最後更新**: 2025-10-17
**下一次審查**: 2025-11-01

---

**文件結束**
