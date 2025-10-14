# TodoList 專案實作計畫 - 後端

> 基於 TDD (測試驅動開發) 方法論的完整開發路線圖
>
> 生成日期: 2025-10-14
> 最後更新: 2025-10-14 13:30 (UTC+8)

## 🎯 專案進度總覽

| Phase | 任務 | 狀態 | 完成日期 |
|-------|------|------|----------|
| Phase 1 | Task 1: 初始化 Node.js/Express 後端 | ✅ 完成 | 2025-10-14 |
| Phase 1 | Task 2: 配置 ESLint, Prettier, Husky | ✅ 完成 | 2025-10-14 |
| Phase 1 | Task 3: 設置 Jest + Supertest 測試框架 | ✅ 完成 | 2025-10-14 |
| Phase 1 | Task 4: 設計資料庫 Schema (Prisma) | ✅ 完成 | 2025-10-14 |
| Phase 2 | Task 5: 撰寫 Create Todo API 測試 | ✅ 完成 | 2025-10-14 |
| Phase 2 | Task 6: 實作 Create Todo API | ✅ 完成 | 2025-10-14 |
| Phase 2 | Task 7: 撰寫 List All Todos API 測試 | ✅ 完成 | 2025-10-14 |
| Phase 2 | Task 8: 實作 List All Todos API | ✅ 完成 | 2025-10-14 |
| Phase 2 | Task 9-16: 其他 API 開發 | ⏳ 待辦 | - |
| Phase 3 | Task 17: Swagger/OpenAPI 文件 | ⏳ 待辦 | - |
| Phase 4-6 | Task 18-30: 前端、整合、部署 | ⏳ 待辦 | - |

**整體完成度**: 26.7% (8/30 tasks)

---


1. [專案概述](#專案概述)
2. [開發原則](#開發原則)
3. [任務清單](#任務清單)
4. [關鍵里程碑](#關鍵里程碑)
5. [技術決策](#技術決策)
6. [風險管理](#風險管理)

---

## 專案概述

### 核心價值主張
為忙碌的專業人士打造一個簡潔、高效的任務管理工具，支援快速記錄、追蹤和管理日常待辦事項。

### 五大核心功能
基於 `.doc/userStory.md` 的使用者故事分析：

1. **新增待辦事項** - 快速建立任務避免遺忘
2. **查看所有待辦事項** - 一目了然查看所有待辦任務
3. **標示完成狀態** - 切換完成狀態追蹤進度
4. **編輯待辦事項** - 需求變更時修改任務內容
5. **刪除待辦事項** - 移除無關或錯誤的任務

### 技術架構
```
┌──────────────────────────────┐
│  前端層 (Presentation)        │  React 18 + TypeScript + Vite
├──────────────────────────────┤
│  業務邏輯層 (Business Logic) │  Node.js + Express + TypeScript
├──────────────────────────────┤
│  資料層 (Data Access)        │  SQLite (dev) / PostgreSQL (prod)
└──────────────────────────────┘
```

### 成功指標
- ✅ API 回應時間 < 200ms
- ✅ 前端載入時間 < 2s
- ✅ 測試覆蓋率 > 80%
- ✅ 零重大安全漏洞

---

## 開發原則

### 🔴 嚴格的 TDD 流程

```
RED Phase (測試先行)
    ↓
    撰寫失敗的測試案例
    ↓
🛑 強制性使用者審查檢查點 🛑
    ↓
GREEN Phase (實作功能)
    ↓
    撰寫最少程式碼使測試通過
    ↓
REFACTOR Phase (重構優化)
    ↓
    在保持測試通過的前提下重構
    ↓
    回到 RED Phase (下一個功能)
```

### ⚠️ 關鍵規則

1. **絕對不過度設計、不過度工程化** (development-guide.md 強調 3 次)
2. **每個實作必須先有對應測試** - 沒有測試 = 不能實作
3. **測試覆蓋率必須超過 80%** - 這是最低要求
4. **所有測試必須通過才能繼續** - 紅燈狀態下不允許開發新功能
5. **每個 TDD 週期需要使用者審查批准** - 確保測試設計正確

---

## 任務清單

### Phase 1: 專案設置與基礎架構 ✅ 已完成 (2025-10-14)

#### Task 1: 初始化 Node.js/Express 後端 ✅
- [x] 建立專案目錄結構
  ```
  backend/
  ├── src/
  │   ├── controllers/
  │   ├── models/
  │   ├── routes/
  │   ├── middleware/
  │   ├── config/
  │   └── app.ts
  ├── tests/
  ├── package.json
  └── tsconfig.json
  ```
- [x] 初始化 npm 專案: `npm init -y`
- [x] 安裝核心依賴
- [x] 配置 TypeScript (`tsconfig.json`)
- [x] 建立基礎 Express 應用 (`src/app.ts`)
- [x] 配置開發腳本 (`package.json`)

**驗收標準**: ✅ 完成 - 29個測試全部通過

---

#### Task 2: 配置程式碼品質工具 ✅
- [x] 安裝 ESLint 9.37.0:
- [x] 配置 ESLint (`eslint.config.js` - 新版 flat config)
  - TypeScript 嚴格規則
  - Jest 環境支援
- [x] 安裝 Prettier 3.6.2
- [x] 配置 Prettier (`.prettierrc`)
- [x] 安裝 Husky 9.1.7 + lint-staged 16.2.4
- [x] 設定 pre-commit hooks

**驗收標準**: ✅ 完成 - Git hooks 正常運作

---

#### Task 3: 設置測試框架 ✅
- [x] 安裝 Jest 29.7.0 + Supertest 6.3.3:
- [x] 配置 Jest (`jest.config.js`)
- [x] 建立測試目錄結構 (`tests/`)
- [x] 撰寫基礎測試 (29 tests for app setup)
- [x] 配置測試覆蓋率報告 (>80% threshold)

**驗收標準**: ✅ 完成 - 29個測試全部通過

---

#### Task 4: 設計並實作資料庫 Schema ✅
- [x] 選擇 ORM 工具: Prisma 6.17.1
- [x] 安裝 Prisma:
- [x] 定義 Todo 資料模型 (`prisma/schema.prisma`)
- [x] 執行資料庫遷移: `20251014052131_init`
- [x] 生成 Prisma Client
- [x] 建立資料庫連線模組 (`src/config/database.ts`)
- [x] 建立 TypeScript 型別定義 (`src/types/todo.types.ts`)

**驗收標準**: ✅ 完成 - SQLite database created, Prisma Client generated

---

---

## 📊 目前進度

**已完成**: Tasks 1-8 (專案設置與基礎架構 + Create Todo API + List All Todos API)
**進行中**: Task 9 (Get Single Todo API 測試)
**完成度**: 26.7% (8/30 tasks)

**最後更新**: 2025-10-14 (UTC+8)

---

### Phase 2: 後端 API 開發 (TDD 循環) (預計 5-7 天)

#### Task 5: 撰寫 Create Todo API 測試 ✅
**RED Phase - 測試先行**

- [x] 建立測試檔案: `tests/integration/todos.create.test.ts`
- [x] 撰寫測試案例:
  - ✅ 成功建立待辦事項 (返回 201 status)
  - ✅ 驗證必填欄位 `title`
  - ✅ 處理空白 `title` 的錯誤
  - ✅ 處理過長 `title` 的錯誤 (>255 字元)
  - ✅ 正確設定預設值 (`isCompleted: false`)
  - ✅ 自動生成 `id`, `createdAt`, `updatedAt`
  - ✅ 支援選填欄位 `description`
- [x] 執行測試 - **59 failed, 4 passed (符合預期紅燈)**

**驗收標準**: ✅ 完成 - 63個測試案例全部撰寫完成

---

#### Task 6: 實作 Create Todo API ✅
**GREEN Phase - 最小實作**

- [x] 建立 Controller: `src/controllers/todoController.ts`
- [x] 建立 Route: `src/routes/todoRoutes.ts`
- [x] 實作 `POST /api/todos` 端點
- [x] 加入輸入驗證邏輯
- [x] 加入 JSON 錯誤處理 middleware
- [x] 執行測試 - **All 92 tests passing (綠燈)**
- [x] 更新 Prisma Client 配置

**驗收標準**: ✅ 完成 - 所有測試通過 + 手動測試成功

---

#### Task 7: 撰寫 List All Todos API 測試 ✅
**RED Phase - 測試先行**

- [x] 建立測試檔案: `tests/integration/todos.list.test.ts`
- [x] 撰寫測試案例:
  - ✅ 成功獲取所有待辦事項 (返回 200 status)
  - ✅ 返回空陣列當沒有資料
  - ✅ 返回正確的資料格式
  - ✅ 依照建立時間排序 (最新在前)
  - ✅ 包含所有必要欄位
  - ✅ 支援分頁 (query parameters: `page`, `limit`)
  - ✅ 支援篩選 (query parameter: `isCompleted`)
- [x] 執行測試 - **48 failed, 2 passed (符合預期紅燈)**

**驗收標準**: ✅ 完成 - 50個測試案例全部撰寫完成

---

#### Task 8: 實作 List All Todos API ✅
**GREEN Phase - 最小實作**

- [x] 實作 `GET /api/todos` 端點
- [x] 實作排序邏輯 (按 `createdAt` DESC)
- [x] 實作分頁邏輯 (支援 `page`, `limit` 參數)
- [x] 實作篩選邏輯 (支援 `isCompleted` 參數)
- [x] 加入查詢參數驗證
- [x] 執行測試 - **All 142 tests passing (綠燈)**
- [x] 修正並發請求測試 (調整為 5 個並發以避免 SQLite write lock)

**驗收標準**: ✅ 完成 - 所有測試通過

---

#### Task 9: 撰寫 Get Single Todo API 測試
**RED Phase**

- [ ] 建立測試檔案: `tests/integration/todos.getById.test.ts`
- [ ] 撰寫測試案例:
  - ✅ 成功獲取單一待辦事項 (返回 200)
  - ✅ 返回正確的資料格式
  - ✅ 處理不存在的 ID (返回 404)
  - ✅ 處理無效的 UUID 格式 (返回 400)
- [ ] 執行測試 - **預期全部失敗**

**🛑 檢查點: 提交測試程式碼供使用者審查**

---

#### Task 10: 實作 Get Single Todo API
**GREEN Phase**

- [ ] 實作 `GET /api/todos/:id` 端點
- [ ] 實作 UUID 驗證 middleware
- [ ] 實作 404 錯誤處理
- [ ] 執行測試 - **預期全部通過**
- [ ] 重構程式碼

**驗收標準**: 所有測試通過

---

#### Task 11: 撰寫 Update Todo API 測試
**RED Phase**

- [ ] 建立測試檔案: `tests/integration/todos.update.test.ts`
- [ ] 撰寫測試案例:
  - ✅ 成功更新待辦事項 (返回 200)
  - ✅ 支援部分更新 (PATCH 語意)
  - ✅ 更新 `title` 欄位
  - ✅ 更新 `description` 欄位
  - ✅ 更新 `isCompleted` 狀態
  - ✅ 標示完成時自動設定 `completedAt`
  - ✅ 取消完成時清除 `completedAt`
  - ✅ 自動更新 `updatedAt` 時間戳
  - ✅ 處理不存在的 ID (返回 404)
  - ✅ 處理無效的資料格式 (返回 400)
  - ✅ 不允許更新 `id`, `createdAt` 等唯讀欄位
- [ ] 執行測試 - **預期全部失敗**

**🛑 檢查點: 提交測試程式碼供使用者審查**

---

#### Task 12: 實作 Update Todo API
**GREEN Phase**

- [ ] 實作 `PUT /api/todos/:id` 端點
- [ ] 實作部分更新邏輯
- [ ] 實作 `completedAt` 自動處理邏輯
- [ ] 實作欄位白名單驗證
- [ ] 執行測試 - **預期全部通過**
- [ ] 重構程式碼

**驗收標準**: 所有測試通過

---

#### Task 13: 撰寫 Delete Todo API 測試
**RED Phase**

- [ ] 建立測試檔案: `tests/integration/todos.delete.test.ts`
- [ ] 撰寫測試案例:
  - ✅ 成功刪除待辦事項 (返回 204 或 200)
  - ✅ 確認資料庫中資料已被移除
  - ✅ 處理不存在的 ID (返回 404)
  - ✅ 處理無效的 UUID 格式 (返回 400)
  - ✅ 刪除操作為冪等性 (重複刪除不報錯)
- [ ] 執行測試 - **預期全部失敗**

**🛑 檢查點: 提交測試程式碼供使用者審查**

---

#### Task 14: 實作 Delete Todo API
**GREEN Phase**

- [ ] 實作 `DELETE /api/todos/:id` 端點
- [ ] 實作軟刪除或硬刪除 (根據需求決定)
- [ ] 實作冪等性處理
- [ ] 執行測試 - **預期全部通過**
- [ ] 重構程式碼

**驗收標準**: 所有測試通過

---

#### Task 15: 撰寫輸入驗證與錯誤處理測試
**RED Phase**

- [ ] 建立測試檔案: `tests/unit/validation.test.ts`
- [ ] 撰寫測試案例:
  - ✅ 驗證 `title` 必填且非空白
  - ✅ 驗證 `title` 長度限制 (1-255 字元)
  - ✅ 驗證 `description` 長度限制 (如有)
  - ✅ 驗證 `isCompleted` 必須為布林值
  - ✅ 驗證 `priority` 只能是 'low', 'medium', 'high'
  - ✅ 驗證 `dueDate` 為有效日期格式
  - ✅ 統一的錯誤回應格式
  - ✅ 適當的 HTTP 狀態碼
- [ ] 執行測試 - **預期全部失敗**

**🛑 檢查點: 提交測試程式碼供使用者審查**

---

#### Task 16: 實作輸入驗證與錯誤處理
**GREEN Phase**

- [ ] 安裝驗證套件:
  ```bash
  npm install express-validator
  # 或
  npm install joi
  # 或
  npm install zod
  ```
- [ ] 建立驗證 middleware: `src/middleware/validation.ts`
- [ ] 建立錯誤處理 middleware: `src/middleware/errorHandler.ts`
- [ ] 實作統一的 API 回應格式
- [ ] 將驗證套用到所有路由
- [ ] 執行測試 - **預期全部通過**
- [ ] 重構程式碼

**驗收標準**: 所有測試通過 + 覆蓋率 > 80%

---

### Phase 3: API 文件化 (預計 1 天)

#### Task 17: 設置 Swagger/OpenAPI 文件
- [ ] 安裝 Swagger 套件:
  ```bash
  npm install swagger-jsdoc swagger-ui-express
  npm install -D @types/swagger-jsdoc @types/swagger-ui-express
  ```
- [ ] 配置 Swagger (`src/config/swagger.ts`)
- [ ] 為所有 API 端點加上 JSDoc 註解
- [ ] 設定 API 文件路由 `/api-docs`
- [ ] 測試文件可訪問性

**驗收標準**: 訪問 `http://localhost:3000/api-docs` 可查看完整 API 文件

---

### Phase 4: 前端開發 (TDD) (預計 5-7 天)

#### Task 18: 初始化 React 前端專案
- [ ] 使用 Vite 建立專案:
  ```bash
  npm create vite@latest frontend -- --template react-ts
  cd frontend
  npm install
  ```
- [ ] 安裝核心依賴:
  ```bash
  npm install axios react-router-dom
  ```
- [ ] 配置專案結構:
  ```
  src/
  ├── components/
  ├── pages/
  ├── hooks/
  ├── services/
  ├── types/
  ├── styles/
  └── App.tsx
  ```
- [ ] 設定開發代理連接後端 API

**驗收標準**: 執行 `npm run dev` 可啟動前端開發伺服器

---

#### Task 19: 設置狀態管理
- [ ] 選擇狀態管理方案 (推薦 Zustand)
- [ ] 安裝 Zustand:
  ```bash
  npm install zustand
  ```
- [ ] 建立 Todo Store (`src/stores/todoStore.ts`)
- [ ] 定義 TypeScript 型別 (`src/types/todo.ts`)
- [ ] 實作基本的狀態管理邏輯

**驗收標準**: Store 可正常初始化

---

#### Task 20: 實作 TodoList 容器組件 (TDD)
- [ ] 安裝測試工具:
  ```bash
  npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
  ```
- [ ] 撰寫測試: `src/components/TodoList.test.tsx`
  - ✅ 正確渲染待辦事項列表
  - ✅ 顯示空狀態訊息
  - ✅ 呼叫 API 獲取資料
  - ✅ 處理載入狀態
  - ✅ 處理錯誤狀態
- [ ] 實作 `TodoList.tsx` 組件
- [ ] 執行測試確保通過

**驗收標準**: 所有組件測試通過

---

#### Task 21: 實作 TodoItem 組件 (TDD)
- [ ] 撰寫測試: `src/components/TodoItem.test.tsx`
  - ✅ 正確顯示待辦事項內容
  - ✅ 顯示完成/未完成狀態
  - ✅ 點擊切換完成狀態
  - ✅ 編輯按鈕功能
  - ✅ 刪除按鈕功能
  - ✅ 確認刪除對話框
- [ ] 實作 `TodoItem.tsx` 組件
- [ ] 執行測試確保通過

**驗收標準**: 所有組件測試通過

---

#### Task 22: 實作 TodoForm 組件 (TDD)
- [ ] 撰寫測試: `src/components/TodoForm.test.tsx`
  - ✅ 正確渲染表單
  - ✅ 輸入驗證 (必填欄位)
  - ✅ 提交表單建立新待辦事項
  - ✅ 提交後清空表單
  - ✅ 處理提交錯誤
  - ✅ 支援編輯模式
- [ ] 實作 `TodoForm.tsx` 組件
- [ ] 執行測試確保通過

**驗收標準**: 所有組件測試通過

---

#### Task 23: 實作響應式 UI 設計
- [ ] 選擇 UI 框架 (Material-UI 或 Tailwind CSS)
- [ ] 安裝依賴:
  ```bash
  # Material-UI
  npm install @mui/material @emotion/react @emotion/styled
  # 或 Tailwind CSS
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] 設計響應式佈局 (Desktop / Tablet / Mobile)
- [ ] 實作主題系統 (Light/Dark mode - 選用)
- [ ] 加入動畫與過渡效果

**驗收標準**: 在不同螢幕尺寸下正常顯示

---

#### Task 24: 實作載入狀態與錯誤處理
- [ ] 建立 Loading 組件
- [ ] 建立 ErrorBoundary 組件
- [ ] 建立 Toast/Snackbar 通知系統
- [ ] 實作樂觀更新 (Optimistic UI)
- [ ] 實作錯誤重試機制

**驗收標準**: 使用者體驗流暢無卡頓

---

### Phase 5: 整合測試與品質保證 (預計 3-4 天)

#### Task 25: 設置並撰寫 E2E 測試
- [ ] 安裝 Playwright:
  ```bash
  npm install -D @playwright/test
  npx playwright install
  ```
- [ ] 建立 E2E 測試目錄: `e2e/`
- [ ] 撰寫核心使用者流程測試:
  - ✅ 完整的新增待辦事項流程
  - ✅ 查看待辦事項列表
  - ✅ 標示完成與取消完成
  - ✅ 編輯待辦事項內容
  - ✅ 刪除待辦事項
  - ✅ 多個操作的組合流程
- [ ] 執行 E2E 測試

**驗收標準**: 所有 E2E 測試通過

---

#### Task 26: 驗證測試覆蓋率
- [ ] 執行後端測試覆蓋率報告:
  ```bash
  npm test -- --coverage
  ```
- [ ] 執行前端測試覆蓋率報告:
  ```bash
  npm run test:coverage
  ```
- [ ] 確保覆蓋率 > 80%
- [ ] 針對未覆蓋的關鍵邏輯補充測試

**驗收標準**: 整體覆蓋率 > 80%

---

#### Task 27: 程式碼重構與優化
- [ ] 審查程式碼品質
- [ ] 移除重複程式碼 (DRY 原則)
- [ ] 優化資料庫查詢效能
- [ ] 優化前端渲染效能
- [ ] 執行 ESLint 檢查
- [ ] 執行效能測試 (Lighthouse)
- [ ] 確保所有測試仍然通過

**驗收標準**:
- Lighthouse Score > 90
- API 回應時間 < 200ms
- 無 ESLint 錯誤

---

### Phase 6: 部署準備 (預計 2-3 天)

#### Task 28: 建立 Docker 配置
- [ ] 建立後端 Dockerfile
- [ ] 建立前端 Dockerfile
- [ ] 建立 docker-compose.yml
- [ ] 配置環境變數管理
- [ ] 測試容器化部署

**驗收標準**: `docker-compose up` 可成功啟動整個應用

---

#### Task 29: 設置 CI/CD Pipeline
- [ ] 建立 GitHub Actions workflow (`.github/workflows/ci.yml`)
- [ ] 配置自動化測試流程:
  - Lint 檢查
  - 單元測試
  - 整合測試
  - E2E 測試
  - 測試覆蓋率報告
- [ ] 配置自動化部署流程 (選用)

**驗收標準**: Push 到 main 分支自動觸發 CI/CD

---

#### Task 30: 最終效能優化與部署
- [ ] 執行完整的效能測試
- [ ] 優化資料庫索引
- [ ] 實作 API 快取策略 (選用)
- [ ] 壓縮靜態資源
- [ ] 設定 CDN (選用)
- [ ] 準備生產環境配置
- [ ] 撰寫部署文件

**驗收標準**:
- API 回應時間 < 200ms
- 前端載入時間 < 2s
- 所有功能正常運作

---

## 關鍵里程碑

### Milestone 1: 後端基礎完成 (Day 10)
- ✅ 專案設置完成
- ✅ 所有 CRUD API 實作並通過測試
- ✅ API 文件發佈

### Milestone 2: 前端基礎完成 (Day 17)
- ✅ 所有核心組件實作並通過測試
- ✅ 基本 UI/UX 完成

### Milestone 3: 整合完成 (Day 21)
- ✅ E2E 測試全部通過
- ✅ 測試覆蓋率達標
- ✅ 程式碼品質達標

### Milestone 4: 上線準備完成 (Day 24)
- ✅ Docker 化完成
- ✅ CI/CD 配置完成
- ✅ 效能指標達標

---

## 技術決策

### 已確定的技術選型

| 類別 | 技術 | 理由 |
|------|------|------|
| 後端框架 | Express.js | 輕量、靈活、社群支援完善 |
| 語言 | TypeScript | 型別安全、開發體驗佳 |
| ORM | Prisma | 現代化、型別安全、開發效率高 |
| 測試框架 | Jest + Supertest | 功能完整、生態系統成熟 |
| 前端框架 | React 18 | 業界標準、生態系統豐富 |
| 建置工具 | Vite | 快速、現代化 |
| E2E 測試 | Playwright | 跨瀏覽器支援、可靠性高 |

### 待決定的技術選型

| 類別 | 選項 | 評估標準 |
|------|------|----------|
| UI 框架 | Material-UI vs Tailwind CSS | 開發速度 vs 客製化程度 |
| 狀態管理 | Zustand vs Redux Toolkit | 複雜度 vs 生態系統 |
| 驗證套件 | express-validator vs Joi vs Zod | 開發體驗、型別推導 |
| 部署平台 | Vercel / Railway / AWS | 成本、可擴展性 |

---

## 風險管理

### 技術風險

| 風險 | 可能性 | 影響 | 緩解策略 |
|------|--------|------|----------|
| 測試覆蓋率不足 | 中 | 高 | 每個 PR 必須包含測試，設定 CI 門檻 |
| 效能瓶頸 | 低 | 中 | 定期效能測試，資料庫索引優化 |
| API 設計變更 | 中 | 中 | 使用版本化 API，維護 changelog |
| 前後端整合問題 | 低 | 中 | 使用 TypeScript 共享型別定義 |

### 專案風險

| 風險 | 可能性 | 影響 | 緩解策略 |
|------|--------|------|----------|
| 範圍擴張 | 高 | 高 | 嚴格遵循 MVP 範圍，未來功能放入 backlog |
| TDD 流程遵守度 | 中 | 高 | 程式碼審查強制檢查測試 |
| 技術債務累積 | 中 | 中 | 定期重構時段，保持程式碼品質 |
| 時程延誤 | 中 | 中 | 每週里程碑檢查，及時調整計畫 |

---

## 開發流程檢查清單

### 每個功能開發前
- [ ] 確認使用者故事和驗收標準
- [ ] 設計 API 介面 (如為後端功能)
- [ ] 設計組件介面 (如為前端功能)
- [ ] 撰寫測試案例 (RED Phase)
- [ ] **提交測試供使用者審查** 🛑

### 每個功能開發後
- [ ] 實作最小程式碼使測試通過 (GREEN Phase)
- [ ] 執行所有測試確保通過
- [ ] 重構程式碼改善品質 (REFACTOR Phase)
- [ ] 執行 lint 檢查
- [ ] 更新文件 (如需要)
- [ ] 提交 PR 供程式碼審查

### 每個 Sprint 結束前
- [ ] 執行完整測試套件
- [ ] 檢查測試覆蓋率報告
- [ ] 執行 E2E 測試
- [ ] 執行效能測試
- [ ] 更新專案文件
- [ ] Demo 給相關人員

---

## 參考文件

- [使用者故事](./.doc/userStory.md)
- [開發指南](./.doc/development-guide.md)
- [API 文件](http://localhost:3000/api-docs) (開發中)
- [測試報告](./coverage/index.html) (待生成)

---

**文件維護**: 本計畫文件應隨專案進展持續更新，標記已完成任務並記錄重要決策變更。

**最後更新**: 2025-10-14
**版本**: 1.0.0
