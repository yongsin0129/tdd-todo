# Backend Team Todolist
# TodoList 應用程式後端團隊任務清單

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | TodoList 應用程式後端團隊任務清單 (Backend Team Todolist) |
| 版本號 | 1.2.0 |
| 撰寫日期 | 2025-10-17 |
| 最後更新 | 2025-10-24 |
| 撰寫人 | Backend Team Lead |
| 相關文件 | implementation-plan-backend.md, API-Specification.md, Database-Design.md, CR-002 |

## 變更歷史記錄

| 版本 | 日期 | 變更內容 | 變更人 |
|------|------|---------|--------|
| 1.2.0 | 2025-10-24 | 新增 Phase 6.1 Todo 優先級功能開發任務（CR-002），詳細規劃資料庫遷移、API 更新、測試策略 | Backend Team |
| 1.1.0 | 2025-10-20 | 更新 Phase 5 部署完成狀態，MVP 已成功上線 | Backend Team |
| 1.0.0 | 2025-10-17 | 初始版本建立，記錄當前進度與未來任務 | Backend Team |

---

## 目錄

1. [專案進度總覽](#1-專案進度總覽)
2. [Phase 1: 專案設置 (已完成)](#2-phase-1-專案設置-已完成)
3. [Phase 2: CRUD API 開發 (已完成)](#3-phase-2-crud-api-開發-已完成)
4. [Phase 3: API 文件化 (已完成)](#4-phase-3-api-文件化-已完成)
5. [Phase 4: 整合與優化 (已完成)](#5-phase-4-整合與優化-已完成)
6. [Phase 5: 部署準備 (已完成)](#6-phase-5-部署準備-已完成)
7. [Phase 6.1: Todo 優先級功能 (進行中)](#7-phase-61-todo-優先級功能-進行中)
8. [Phase 6: 功能擴展 (未來規劃)](#8-phase-6-功能擴展-未來規劃)
9. [團隊資源與責任分配](#9-團隊資源與責任分配)
10. [待解決問題與技術債務](#10-待解決問題���技術債務)

---

## 1. 專案進度總覽

### 1.1 整體進度

**專案狀態**: 🚀 Phase 6.1 進行中 - Todo 優先級功能開發（CR-002）

| Phase | 階段名稱 | 任務數 | 已完成 | 進行中 | 待辦 | 完成率 |
|-------|---------|-------|--------|--------|------|--------|
| **Phase 1** | 專案設置與基礎架構 | 4 | 4 | 0 | 0 | 100% ✅ |
| **Phase 2** | CRUD API 開發 | 12 | 12 | 0 | 0 | 100% ✅ |
| **Phase 3** | API 文件化 | 1 | 1 | 0 | 0 | 100% ✅ |
| **Phase 4** | 整合與優化 | 5 | 5 | 0 | 0 | 100% ✅ |
| **Phase 5** | 部署準備 | 6 | 6 | 0 | 0 | 100% ✅ |
| **Phase 6.1** | Todo 優先級功能 | 16 | 0 | 0 | 16 | 0% 🔄 |
| **總計 (MVP)** | - | **28** | **28** | **0** | **0** | **100%** |
| **總計 (含 Phase 6.1)** | - | **44** | **28** | **0** | **16** | **64%** |

**備註**: MVP 核心功能已完成並上線，當前專注於 Phase 6.1 優先級功能開發

### 1.2 關鍵里程碑

| 里程碑 | 目標日期 | ��態 | 實際完成日期 |
|--------|---------|------|-------------|
| M1: 專案設置完成 | 2025-10-14 | ✅ 完成 | 2025-10-14 |
| M2: CRUD API 完成 | 2025-10-16 | ✅ 完成 | 2025-10-16 |
| M3: API 文件完成 | 2025-10-16 | ✅ 完成 | 2025-10-16 |
| M4: 整合測試完成 | 2025-11-03 | ✅ 完成 | 2025-10-19 |
| M5: 生產環境部署 | 2025-11-06 | ✅ 完成 | 2025-10-19 |
| M6: 優先級功能完成 (Phase 6.1) | 2025-11-01 | 🔄 進行中 | - |

### 1.3 測試統計

| 測試類型 | 測試數量 | 通過 | 失敗 | 覆蓋率 | 狀態 |
|---------|---------|------|------|--------|------|
| 整合測試 | 327 | 327 | 0 | ~92% | ✅ 優秀 |
| 單元測試 | 0 | 0 | 0 | N/A | ⚠️ 待補充 |
| E2E 測試 | 0 | 0 | 0 | N/A | ⏳ 待建立 |
| **總計** | **327** | **327** | **0** | **~92%** | ✅ 達標 |

### 1.4 效能指標

| 指標名稱 | 目標值 | 當前值 | 狀態 |
|---------|-------|--------|------|
| API 平均回應時間 | < 200ms | ~50ms | ✅ 優秀 |
| 資料庫查詢時間 | < 50ms | ~10ms | ✅ 優秀 |
| 測試執行時間 | < 30s | ~15s | ✅ 良好 |
| 測試覆蓋率 | > 80% | ~92% | ✅ 優秀 |

---

## 2. Phase 1: 專案設置 (已完成)

### 2.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | 實際時間 | 狀態 | 完成日期 |
|----|---------|--------|---------|---------|------|----------|
| **1.1** | 初始化 Node.js/Express 專案 | Backend Team | 4h | 4h | ✅ 完成 | 2025-10-14 |
| **1.2** | 配置 ESLint/Prettier/Husky | Backend Team | 4h | 4h | ✅ 完成 | 2025-10-14 |
| **1.3** | 設置 Jest + Supertest | Backend Team | 4h | 4h | ✅ 完成 | 2025-10-14 |
| **1.4** | 設計資料庫 Schema (Prisma) | Backend Team | 8h | 8h | ✅ 完成 | 2025-10-14 |

**總工作量**: 20h (約 2.5 天)

### 2.2 交付成果

- ✅ 完整的 Node.js + Express + TypeScript 專案結構
- ✅ Prisma ORM 配置 (SQLite 開發環境)
- ✅ Jest + Supertest 測試框架
- ✅ ESLint + Prettier + Husky Git Hooks
- ✅ 29 個基礎測試全部通過
- ✅ TypeScript 嚴格模式配置
- ✅ ESM 模組系統 (非 CommonJS)

### 2.3 技術堆疊

| 技術 | 版本 | 用途 |
|------|------|------|
| Node.js | 20 LTS | 執行環境 |
| Express.js | 4.21.2 | Web 框架 |
| TypeScript | 5.8.3 | 程式語言 |
| Prisma | 6.17.1 | ORM |
| SQLite | 3 | 資料庫 (開發) |
| Jest | 29.7.0 | 測試框架 |
| Supertest | 6.3.3 | API 測試 |
| ESLint | 9.37.0 | 程式碼檢查 |
| Prettier | 3.6.2 | 程式碼格式化 |
| Husky | 9.1.7 | Git Hooks |

---

## 3. Phase 2: CRUD API 開發 (已完成)

### 3.1 任務清單

| ID | 任務名稱 | TDD 階段 | 預估時間 | 實際時間 | 狀態 | 完成日期 |
|----|---------|---------|---------|---------|------|----------|
| **2.1** | 撰寫 Create Todo API 測試 | RED | 4h | 4h | ✅ 完成 | 2025-10-14 |
| **2.2** | 實作 Create Todo API | GREEN | 4h | 4h | ✅ 完成 | 2025-10-14 |
| **2.3** | 撰寫 List All Todos API 測試 | RED | 4h | 4h | ✅ 完成 | 2025-10-14 |
| **2.4** | 實作 List All Todos API | GREEN | 6h | 6h | ✅ 完成 | 2025-10-14 |
| **2.5** | 撰寫 Get Single Todo API 測試 | RED | 4h | 4h | ✅ 完成 | 2025-10-16 |
| **2.6** | 實作 Get Single Todo API | GREEN | 4h | 4h | ✅ 完成 | 2025-10-16 |
| **2.7** | 撰寫 Update Todo API 測試 | RED | 4h | 4h | ✅ 完成 | 2025-10-16 |
| **2.8** | 實作 Update Todo API | GREEN | 6h | 6h | ✅ 完成 | 2025-10-16 |
| **2.9** | 撰寫 Delete Todo API 測試 | RED | 4h | 4h | ✅ 完成 | 2025-10-16 |
| **2.10** | 實作 Delete Todo API | GREEN | 4h | 4h | ✅ 完成 | 2025-10-16 |
| **2.11** | 撰寫驗證與錯誤處理測試 | RED | 4h | 4h | ✅ 完成 | 2025-10-16 |
| **2.12** | 實作驗證與錯誤處理 | GREEN | 6h | 6h | ✅ 完成 | 2025-10-16 |

**總工作量**: 54h (約 7 天)

### 3.2 API 端點摘要

| 端點 | 方法 | 功能 | 測試數 | 覆蓋範圍 | 狀態 |
|------|------|------|-------|---------|------|
| `/api/todos` | POST | 新增待辦事項 | 63 | 成功/驗證/錯誤處理 | ✅ 完成 |
| `/api/todos` | GET | 獲取所有待辦事項 | 50 | 分頁/篩選/排序 | ✅ 完成 |
| `/api/todos/:id` | GET | 獲取單一待辦事項 | 31 | 成功/404/UUID驗證 | ✅ 完成 |
| `/api/todos/:id` | PUT | 更新待辦事項 | 43 | 部分更新/完成邏輯 | ✅ 完成 |
| `/api/todos/:id` | DELETE | 刪除待辦事項 | 140 | 成功/404/冪等性 | ✅ 完成 |

**總測試數**: 327 tests (全部通過 ✅)

### 3.3 實作亮點

#### 3.3.1 TDD 嚴格遵守

- ✅ 每個功能都先撰寫測試 (RED)
- ✅ 實作最小程式碼使測試通過 (GREEN)
- ✅ 重構程式碼改善品質 (REFACTOR)
- ✅ 測試覆蓋率達 92%

#### 3.3.2 完整的輸入驗證

```typescript
// 驗證邏輯 (src/utils/validation.ts)
- UUID 格式驗證
- Title 必填且長度限制 (1-255)
- Description 長度限制 (< 1000)
- 唯讀欄位保護 (id, createdAt, updatedAt)
```

#### 3.3.3 自動化業務邏輯

```typescript
// completedAt 自動處理
- isCompleted: true  → completedAt: 當前時間
- isCompleted: false → completedAt: null
```

#### 3.3.4 統一的錯誤處理

```typescript
// 標準錯誤回應格式
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {...}
  }
}
```

### 3.4 程式碼結構

```
backend/src/
├── controllers/
│   └── todoController.ts       # 所有 CRUD 邏輯
├── routes/
│   └── todoRoutes.ts           # API 路由定義
├── middleware/
│   ├── errorHandler.ts         # 統一錯誤處理
│   └── jsonErrorHandler.ts     # JSON 格式錯誤處理
├── config/
│   ├── database.ts             # Prisma Client
│   └── swagger.ts              # API 文件配置
├── utils/
│   └── validation.ts           # 共用驗證函式
├── types/
│   └── todo.types.ts           # TypeScript 型別
├── app.ts                      # Express 應用設置
└── server.ts                   # HTTP 伺服器啟動
```

---

## 4. Phase 3: API 文件化 (已完成)

### 4.1 任務清單

| ID | 任務名稱 | 預估時間 | 實際時間 | 狀態 | 完成日期 |
|----|---------|---------|---------|------|----------|
| **3.1** | 安裝 Swagger 套件 | 1h | 1h | ✅ 完成 | 2025-10-16 |
| **3.2** | 配置 Swagger (OpenAPI 3.0) | 2h | 2h | ✅ 完成 | 2025-10-16 |
| **3.3** | 為所有 API 添加 JSDoc 註解 | 3h | 3h | ✅ 完成 | 2025-10-16 |
| **3.4** | 定義完整的 Schema 模型 | 2h | 2h | ✅ 完成 | 2025-10-16 |
| **3.5** | 測試文件可訪問性 | 1h | 1h | ✅ 完成 | 2025-10-16 |

**總工作量**: 9h (約 1 天)

### 4.2 交付成果

- ✅ Swagger UI 互動式 API 文件
- ✅ OpenAPI 3.0 規範配置
- ✅ 所有 5 個 API 端點的完整文件
- ✅ 完整的資料模型 Schema 定義
- ✅ 請求/回應範例
- ✅ 錯誤碼說明

### 4.3 文件訪問

**開發環境**:
- Swagger UI: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/api-docs.json

**定義的 Schema**:
- Todo (完整待辦事項模型)
- CreateTodoRequest (新增請求)
- UpdateTodoRequest (更新請求)
- SuccessResponse (成功回應)
- ErrorResponse (錯誤回應)

---

## 5. Phase 4: 整合與優化 (已完成)

### 5.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 狀態 | 完成日期 |
|----|---------|--------|---------|--------|------|----------|
| **4.1** | 與前端整合測試 | Full Stack | 6h | P0 | ✅ 完成 | 2025-10-19 |
| **4.2** | API 效能優化 | Backend Team | 4h | P1 | ✅ 完成 | 2025-10-19 |
| **4.3** | 資料庫索引優化 | Backend Team | 3h | P1 | ✅ 完成 | 2025-10-19 |
| **4.4** | 程式碼重構與清理 | Backend Team | 4h | P2 | ✅ 完成 | 2025-10-19 |
| **4.5** | 安全性審查與加固 | Backend Team | 4h | P0 | ✅ 完成 | 2025-10-19 |

**總工作量**: 21h (約 3 天)

### 5.2 詳細任務說明

#### Task 4.1: 與前端整合測試

**目標**: 確保前後端 API 整合無誤

**檢查項目**:
- [x] CORS 設定正確
- [x] 前端可正常呼叫所有 API
- [x] 資料格式符合前端預期
- [x] 錯誤處理前端可正確解析
- [x] API 回應時間符合預期

**驗收標準**:
- 前端所有功能正常運作
- 無 CORS 錯誤
- API 回應格式一致

#### Task 4.2: API 效能優化

**目標**: 確保 API 回應時間 < 200ms

**優化項目**:
- [x] 資料庫查詢優化 (只選取需要的欄位)
- [x] 減少不必要的資料庫查詢
- [x] 加入查詢結果快取 (選用)
- [x] 壓縮 API 回應 (gzip)

**驗收標準**:
- 所有 API 回應時間 < 200ms
- 無 N+1 查詢問題

#### Task 4.3: 資料庫索引優化

**目標**: 加速常用查詢

**待建立索引**:
```prisma
@@index([createdAt(sort: Desc)])
@@index([isCompleted])
@@index([isCompleted, createdAt(sort: Desc)])
```

**驗收標準**:
- 查詢時間改善 > 50%
- 索引正確建立

#### Task 4.4: 程式碼重構與清理

**目標**: 提升程式碼品質與可維護性

**重構項目**:
- [x] 移除重複程式碼
- [x] 提取共用函式
- [x] 改善命名與註解
- [x] 移除除錯用 console.log
- [x] 統一錯誤訊息格式

**驗收標準**:
- ESLint 無警告
- 程式碼複雜度合理
- 所有測試仍然通過

#### Task 4.5: 安全性審查與加固

**目標**: 確保 API 安全性

**審查項目**:
- [x] SQL 注入防護 (Prisma ORM 已處理)
- [x] XSS 防護
- [x] 輸入驗證完整性
- [x] CORS 設定正確
- [x] 環境變數保護
- [x] 敏感資訊不洩露

**驗收標準**:
- 無已知安全漏洞
- 通過安全審查

---

## 6. Phase 5: 部署準備 (已完成)

### 6.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 狀態 | 完成日期 |
|----|---------|--------|---------|--------|------|----------|
| **5.1** | 建立 Dockerfile | DevOps | 3h | P0 | ✅ 完成 | 2025-10-19 |
| **5.2** | 配置環境變數管理 | Backend Team | 2h | P0 | ✅ 完成 | 2025-10-19 |
| **5.3** | 設置 CI Pipeline (GitHub Actions) | DevOps | 6h | P0 | ⏳ 待辦 | - |
| **5.4** | 遷移至 PostgreSQL (選用) | Backend Team | 4h | P1 | ✅ 完成 | 2025-10-19 |
| **5.5** | 部署至 Zeabur | DevOps | 4h | P0 | ✅ 完成 | 2025-10-19 |
| **5.6** | 生產環境測試與驗證 | Full Team | 4h | P0 | ✅ 完成 | 2025-10-19 |

**總工作量**: 23h (約 3 天)
**已完成**: 17h | **待完成**: 6h (CI/CD)

### 6.2 詳細任務說明

#### Task 5.1: 建立 Dockerfile

**目標**: 容器化後端應用

**Dockerfile 範例**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**驗收標準**:
- Docker 映像建置成功
- 容器可正常啟動
- API 可正常訪問

#### Task 5.2: 配置環境變數管理

**目標**: 安全管理敏感配置

**環境變數清單**:
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://yourdomain.com
```

**驗收標準**:
- .env 檔案不提交至 Git
- 生產環境變數正確設定
- 無硬編碼敏感資訊

#### Task 5.3: 設置 CI Pipeline (GitHub Actions)

**目標**: 自動化測試與質量保證

**CI 策略**:
- ✅ **CI (測試)**: GitHub Actions 負責所有測試
- ✅ **CD (部署)**: Vercel + Zeabur 平台原生 Git 自動部署

**GitHub Actions Workflow**:
```yaml
name: CI - Quality Assurance

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    - Checkout code
    - Setup Node.js 20
    - Install dependencies
    - Run ESLint
    - Run TypeScript check
    - Run integration tests
    - Upload coverage

  frontend-tests:
    - Checkout code
    - Setup Node.js 20
    - Install dependencies
    - Run ESLint
    - Run TypeScript check
    - Run unit tests
    - Build frontend
    - Upload coverage

  e2e-tests:
    - Start backend & frontend
    - Run Playwright E2E tests
    - Upload test reports
    - Upload screenshots/videos
```

**驗收標準**:
- Push 到 main/develop 自動執行測試
- Pull Request 強制通過測試
- E2E 測試報告可查看
- 測試覆蓋率上傳至 Artifacts

**參考文件**: `docs/04-execution/devops/CI-CD-Strategy.md`

#### Task 5.4: 遷移至 PostgreSQL (選用)

**目標**: 使用生產級資料庫

**遷移步驟**:
1. 修改 `prisma/schema.prisma` provider
2. 執行 `prisma migrate deploy`
3. 匯入 SQLite 資料 (如有)
4. 驗證資料完整性
5. 更新環境變數

**驗收標準**:
- PostgreSQL 連線正常
- 所有測試通過
- 資料遷移成功

#### Task 5.5: 部署至 Zeabur

**目標**: 將應用部署至生產環境

**部署清單**:
- [x] 建立 Zeabur 專案
- [x] 連結 GitHub Repository
- [x] 設定環境變數
- [x] 配置 PostgreSQL 資料庫
- [x] 執行資料庫遷移
- [x] 驗證部署成功
- [x] 設定自訂域名

**驗收標準**:
- API 可透過公開 URL 訪問
- 資料庫操作正常
- 效能符合預期

#### Task 5.6: 生產環境測試與驗證

**目標**: 確保生產環境正常運行

**測試項目**:
- [x] 所有 API 端點正常
- [x] 資料庫操作正常
- [x] 錯誤處理正確
- [x] 效能符合目標
- [x] 監控與日誌正常
- [x] 備份策略正確

**驗收標準**:
- 所有功能正常運作
- 無重大錯誤
- 效能指標達標

---

## 7. Phase 6.1: Todo 優先級功能 (進行中)

### 7.1 階段概述

| 項目 | 內容 |
|------|------|
| **目標** | 實現 Todo 優先級功能（四級優先級系統）|
| **預估時間** | 6 工作天 (48 小時) |
| **開始日期** | 2025-10-25 |
| **預計完成** | 2025-11-01 |
| **狀態** | 🔄 待開始 |
| **負責人** | Backend Team |
| **相關 CR** | CR-002 |

### 7.2 功能需求摘要

**核心需求**：
- ✅ 四級優先級分類（CRITICAL, HIGH, NORMAL, LOW）
- ✅ 資料庫 Schema 更新（priority 欄位）
- ✅ API 支援優先級參數（CREATE/UPDATE）
- ✅ 優先級篩選功能（GET with query）
- ✅ 舊資料自動遷移（預設 LOW）
- ✅ 完整測試覆蓋率 > 80%

**技術規格**：
- 資料庫：新增 `priority` 欄位（String，預設 "LOW"）
- 驗證：只允許 CRITICAL/HIGH/NORMAL/LOW 四種值
- 索引：新增 `priority` 索引優化查詢效能
- 向下相容：所有 priority 參數均為選填

### 7.3 任務清單

#### 7.3.1 資料庫設計與遷移

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 狀態 | 技術細節 |
|----|---------|--------|---------|--------|------|---------|
| **6.1.1** | 更新 Prisma Schema | Backend Team | 1h | P0 | ⏳ 待辦 | 新增 priority 欄位定義 |
| **6.1.2** | 撰寫資料庫遷移腳本 | Backend Team | 2h | P0 | ⏳ 待辦 | 處理舊資料預設值 |
| **6.1.3** | 測試遷移腳本（開發環境） | Backend Team | 1h | P0 | ⏳ 待辦 | 驗證遷移正確性 |
| **6.1.4** | 設定資料庫索引 | Backend Team | 1h | P1 | ⏳ 待辦 | 新增 priority 單一索引 |
| **6.1.5** | 設定複合索引 | Backend Team | 1h | P1 | ⏳ 待辦 | isCompleted + priority |

**總工作量（資料庫）**: 6h

#### 7.3.2 API 開發

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 狀態 | 技術細節 |
|----|---------|--------|---------|--------|------|---------|
| **6.1.6** | 更新 POST /api/todos | Backend Team | 3h | P0 | ⏳ 待辦 | 支援 priority 參數 |
| **6.1.7** | 更新 PUT /api/todos/:id | Backend Team | 3h | P0 | ⏳ 待辦 | 支援 priority 更新 |
| **6.1.8** | 更新 GET /api/todos | Backend Team | 4h | P0 | ⏳ 待辦 | 支援 priority 查詢 |
| **6.1.9** | 實作 priority 驗證邏輯 | Backend Team | 2h | P0 | ⏳ 待辦 | 四種值驗證 |
| **6.1.10** | 實作排序邏輯優化 | Backend Team | 2h | P1 | ⏳ 待辦 | priority 排序整合 |

**總工作量（API）**: 14h

#### 7.3.3 測試開發

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 狀態 | 技術細節 |
|----|---------|--------|---------|--------|------|---------|
| **6.1.11** | 單元測試（priority 驗證） | Backend Team | 3h | P0 | ⏳ 待辦 | 測試四種值+無效值 |
| **6.1.12** | 整合測試（POST API） | Backend Team | 3h | P0 | ⏳ 待辦 | 測試新增含 priority |
| **6.1.13** | 整合測試（PUT API） | Backend Team | 3h | P0 | ⏳ 待辦 | 測試更新 priority |
| **6.1.14** | 整合測試（GET API） | Backend Team | 4h | P0 | ⏳ 待辦 | 測試篩選和排序 |
| **6.1.15** | 資料遷移測試 | Backend Team | 2h | P0 | ⏳ 待辦 | 驗證舊資料遷移 |

**總工作量（測試）**: 15h


## 8. Phase 6: 功能擴展 (未來規劃)

### 8.1 優先級排序

| 功能 | 優先級 | 預估時間 | 商業價值 | 技術複雜度 | 規劃時間 |
|------|--------|---------|---------|-----------|---------|
| **Todo 優先級功能** | P0 | 6 天 | 高 | 低 | Phase 6.1 (進行中) |
| **使用者認證系統** | P0 | 2 週 | 高 | 中 | Phase 6.2 |
| **待辦事項分類/標籤** | P0 | 1 週 | 高 | 低 | Phase 6.3 |
| **截止日期功能** | P1 | 3 天 | 中 | 低 | Phase 6.4 |
| **搜尋與篩選** | P1 | 2 天 | 中 | 低 | Phase 6.5 |
| **API 快取 (Redis)** | P1 | 1 週 | 中 | 中 | Week 10 |
| **雲端同步** | P0 | 2 週 | 高 | 高 | Week 11-12 |
| **通知系統 (Email)** | P1 | 1 週 | 中 | 中 | Week 13 |
| **協作功能** | P2 | 2 週 | 中 | 高 | Week 14-15 |

### 8.2 使用者認證系統 (Phase 6.2)

**預估工作量**: 2 週 (80 小時)

**主要任務**:
- [ ] 設計 Users 資料表
- [ ] 實作註冊/登入 API
- [ ] JWT Token 機制
- [ ] 密碼雜湊 (bcrypt)
- [ ] Email 驗證 (選用)
- [ ] 密碼重置流程
- [ ] 多對多關聯 (User ↔ Todo)
- [ ] 權限控制 middleware
- [ ] 測試覆蓋率 > 80%

**新增 API 端點**:
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
PUT    /api/auth/profile
```

**資料庫變更**:
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  todos     Todo[]

  @@map("users")
}

model Todo {
  // 新增欄位
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

### 8.3 待辦事項分類/標籤 (Phase 6.3)

**預估工作量**: 1 週 (40 小時)

**主要任務**:
- [ ] 設計 Tags 資料表
- [ ] 設計 TodoTags 關聯表 (多對多)
- [ ] 實作 Tag CRUD API
- [ ] 實作 Todo-Tag 關聯 API
- [ ] 測試覆蓋率 > 80%

**新增 API 端點**:
```
POST   /api/tags
GET    /api/tags
GET    /api/tags/:id
PUT    /api/tags/:id
DELETE /api/tags/:id
POST   /api/todos/:todoId/tags/:tagId
DELETE /api/todos/:todoId/tags/:tagId
```

---

## 9. 團隊資源與責任分配

### 9.1 團隊成員

| 姓名 | 角色 | 主要職責 | 技能 |
|------|------|---------|------|
| **成員 A** | Backend Lead | API 設計、架構決策、程式碼審查 | Node.js, TypeScript, Prisma |
| **成員 B** | Backend Developer | API 實作、測試撰寫 | Express, Jest, SQL |
| **成員 C** | DevOps Engineer | 部署、CI/CD、監控 | Docker, GitHub Actions |

### 9.2 責任分配 (當前 Sprint - Phase 6.1)

| 任務類別 | 負責人 | 預計工作量 | 狀態 |
|---------|--------|-----------|------|
| Phase 6.1: 優先級功能 | 成員 A, B | 38h | ⏳ 待開始 |
| 資料庫設計與遷移 | 成員 A | 6h | ⏳ 待開始 |
| API 開發 | 成員 B | 14h | ⏳ 待開始 |
| 測試開發 | 成員 A, B | 15h | ⏳ 待開始 |
| 文件更新 | 成員 A | 3h | ⏳ 待開始 |
| Bug 修復 | 全員 | 按需 | 持續 |

### 9.3 每週工作安排

**Week 5 (2025-10-25 ~ 2025-11-01)**:
- Phase 6.1 優先級功能開發
- 資料庫遷移實作與測試
- API 更新與驗證邏輯
- 完整測試覆蓋

**備註**: Phase 6.1 預計 6 工作天完成

---

## 10. 待解決問題與技術債務

### 10.1 已知問題

| ID | 問題描述 | 影響 | 優先級 | 負責人 | 狀態 |
|----|---------|------|--------|--------|------|
| **I-1** | SQLite 並發寫入限制 | 低 | P2 | Backend | ⏳ 待遷移 PostgreSQL |
| **I-2** | 缺少 API 版本控制 | 中 | P1 | Backend | ⏳ 待實作 |
| **I-3** | 缺少單元測試 | 低 | P2 | Backend | ⏳ 待補充 |
| **I-4** | 缺少 API 速率限制 | 中 | P1 | Backend | ⏳ 待實作 |

### 10.2 技術債務

| ID | 債務描述 | 影響 | 預估工時 | 規劃時間 |
|----|---------|------|---------|---------|
| **TD-1** | 遷移至 PostgreSQL | 中 | 4h | Phase 5 |
| **TD-2** | 實作 API 版本化 (`/api/v1/`) | 低 | 2h | Phase 6 |
| **TD-3** | 補充單元測試 (utils, validation) | 低 | 4h | Phase 4 |
| **TD-4** | 實作 Redis 快取 | 低 | 8h | Phase 6 |
| **TD-5** | 實作速率限制 (rate limiting) | 中 | 4h | Phase 6 |
| **TD-6** | 程式碼文件化 (JSDoc) | 低 | 6h | 持續 |

### 10.3 改進建議

#### 10.3.1 測試改進

**當前狀況**:
- ✅ 整合測試覆蓋率 92%
- ⚠️ 缺少單元測試

**改進計畫**:
- [ ] 為 `src/utils/validation.ts` 添加單元測試
- [ ] 為 `src/config/database.ts` 添加單元測試
- [ ] 為 middleware 添加單元測試

#### 10.3.2 效能改進

**當前狀況**:
- ✅ API 回應時間 ~50ms (優秀)
- ⚠️ 無快取機制

**改進計畫**:
- [ ] 實作 Redis 快取 (Phase 6)
- [ ] 實作 HTTP Cache-Control Headers
- [ ] 資料庫查詢優化

#### 10.3.3 安全性改進

**當前狀況**:
- ✅ Prisma ORM (SQL 注入防護)
- ✅ 輸入驗證
- ⚠️ 無速率限制

**改進計畫**:
- [ ] 實作速率限制 (express-rate-limit)
- [ ] 實作 Helmet.js (安全 Headers)
- [ ] 實作請求大小限制

---

## 文件維護

**維護責任**: Backend Team Lead
**更新頻率**: 每週更新進度，重大變更即時更新
**版本控制**: 使用 Git 追蹤變更

**最後更新**: 2025-10-24 (新增 Phase 6.1 優先級功能開發規劃)
**下一次審查**: 2025-11-01 (Phase 6.1 完成後)

---

**文件結束**
