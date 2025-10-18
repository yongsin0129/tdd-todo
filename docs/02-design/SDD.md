# SDD - System Design Document
# TodoList 應用程式系統設計文件

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | TodoList 應用程式系統設計文件 (SDD) |
| 版本號 | 1.3.0 |
| 撰寫日期 | 2025-10-14 |
| 最後更新 | 2025-10-18 |
| 撰寫人 | Technical Team |
| 審核人 | DevOps Team |
| 狀態 | 已核准 |

## 變更歷史記錄

| 版本 | 日期 | 變更內容 | 變更人 | 相關 CR |
|------|------|---------|--------|---------|
| 1.3.0 | 2025-10-18 | 新增 Zeabur 部署平台相關內容：更新部署架構圖、新增 ADR-008、更新第三方整合清單、新增部署文檔連結 | DevOps Team | - |
| 1.2.0 | 2025-01-17 | 前端架構重構：移除 localStorage、Hook 分層設計、E2E 測試優化 | Technical Team | - |
| 1.1.0 | 2025-10-17 | 重新組織文件結構，符合標準 SDD 格式 | Technical Team | - |
| 1.0.0 | 2025-10-14 | 初始版本建立 | Technical Team | - |

---

## 目錄

1. [技術架構圖](#1-技術架構圖)
2. [技術選型](#2-技術選型)
3. [系統流程圖](#3-系統流程圖)
4. [模組劃分](#4-模組劃分)
5. [介面設計](#5-介面設計)
6. [資料模型](#6-資料模型)
7. [安全性考量](#7-安全性考量)
8. [效能考量](#8-效能考量)
9. [錯誤處理](#9-錯誤處理)
10. [第三方整合](#10-第三方整合)
11. [附件](#11-附件)

---

## 1. 技術架構圖

### 1.1 整體系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (前端層)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React 18 + TypeScript                                 │ │
│  │  ├─ Components (UI 組件)                               │ │
│  │  ├─ Zustand Store (狀態管理 - 僅內存)                  │ │
│  │  ├─ Hooks (業務邏輯 + API 整合)                        │ │
│  │  └─ Tailwind CSS (樣式)                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓ HTTP/HTTPS                      │
│                  (完全依賴後端 API，無 localStorage)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (業務邏輯層)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Node.js + Express + TypeScript                        │ │
│  │  ├─ Routes (路由)                                      │ │
│  │  ├─ Controllers (控制器)                               │ │
│  │  ├─ Middleware (中間件)                                │ │
│  │  │   ├─ Validation (驗證)                              │ │
│  │  │   ├─ Error Handler (錯誤處理)                       │ │
│  │  │   └─ CORS (跨域)                                    │ │
│  │  └─ Utils (工具函式)                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (資料存取層)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Prisma ORM                                            │ │
│  │  ├─ Schema Definition (資料模型定義)                   │ │
│  │  ├─ Migrations (資料庫遷移)                            │ │
│  │  └─ Query Builder (查詢建構器)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database (資料庫)                                     │ │
│  │  ├─ SQLite (開發環境)                                 │ │
│  │  └─ PostgreSQL (生產環境 - 未來)                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Support Services (支援服務)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Swagger API  │  │   Jest       │  │   ESLint     │      │
│  │ 文件服務      │  │   測試框架    │  │   程式碼檢查  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 部署架構圖 (Zeabur 平台)

```
┌─────────────────────────────────────────────────────────────┐
│                          Users (使用者)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      Zeabur Platform                         │
│                  自動 HTTPS + CDN 加速                        │
│                  GitHub Auto Deployment                      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ↓                               ↓
┌──────────────────────────┐    ┌──────────────────────────┐
│   Frontend (Zeabur)      │    │   Backend (Zeabur)       │
│   - React 19 + Vite      │    │   - Node.js 20 LTS       │
│   - Static Hosting       │    │   - Express Server       │
│   - Tailwind CSS v4      │    │   - Prisma ORM           │
│   - 自動建置部署          │    │   - 自動執行 Migration    │
└──────────────────────────┘    └──────────────────────────┘
                                            │
                                            ↓ ${POSTGRES_DATABASE_URL}
                              ┌──────────────────────────┐
                              │   Database (Zeabur)      │
                              │   - PostgreSQL 15        │
                              │   - 自動備份              │
                              │   - 模板變數自動連接      │
                              └──────────────────────────┘
```

**部署特性**:
- **一鍵部署**: 推送至 GitHub main 分支自動觸發部署
- **環境隔離**: 開發環境使用 SQLite，生產環境使用 PostgreSQL
- **零配置**: Zeabur 自動檢測 Monorepo 結構 (`/backend`, `/frontend`)
- **模板變數**: 使用 `${POSTGRES_DATABASE_URL}` 自動連接資料庫服務
- **HTTPS/SSL**: 自動生成並更新 SSL 證書
- **域名管理**: 提供免費 `.zeabur.app` 子域名，支援自訂域名

---

## 2. 技術選型

### 2.1 核心技術選擇與理由

#### 前端技術棧

| 技術 | 版本 | 選擇理由 | 替代方案 |
|------|------|---------|---------|
| **React** | 19.1.1 | • 業界標準，生態系統豐富<br>• 組件化開發效率高<br>• 虛擬 DOM 效能優異<br>• TypeScript 支援完善 | Vue 3, Angular |
| **TypeScript** | 5.9.3 | • 靜態型別檢查，減少執行時錯誤<br>• 優秀的 IDE 支援與自動完成<br>• 大型專案維護性佳<br>• 重構安全性高<br>• ESM 模組系統 | JavaScript |
| **Vite** | 7.1.10 | • 開發伺服器啟動極快 (< 1s)<br>• 熱模組替換 (HMR) 快速<br>• 原生 ES modules 支援<br>• 生產建置優化 | Webpack, Parcel |
| **Zustand** | 4.5+ | • 極小體積 (~1.2KB gzipped)<br>• 簡單 API，學習曲線低<br>• 無需 Provider 包裝<br>• 優秀的 TypeScript 推斷<br>• 內建 DevTools 支援<br>• 僅作為內存狀態管理（v1.2.0 起移除 localStorage） | Redux Toolkit, Jotai, Recoil |
| **Tailwind CSS** | 4.0.0 | • Utility-first 開發速度快<br>• Tree-shakable CSS<br>• 無 runtime overhead<br>• 響應式設計簡單<br>• v4 原生 CSS 整合 (`@import`)<br>• CSS 變數配置 (`@theme`) | Styled Components, Emotion, CSS Modules |
| **Vitest** | 3.2.4 | • 與 Vite 無縫整合<br>• 快速測試執行<br>• 支援 TypeScript<br>• 覆蓋率報告內建 | Jest, Mocha |
| **React Testing Library** | 16.3.0 | • 測試使用者行為導向<br>• 無障礙測試支援<br>• 與 Vitest 整合良好 | Enzyme |

#### 後端技術棧

| 技術 | 版本 | 選擇理由 | 替代方案 |
|------|------|---------|---------|
| **Node.js** | 20 LTS | • JavaScript 全棧開發<br>• 非同步 I/O 效能佳<br>• npm 生態系統豐富<br>• 社群活躍 | Deno, Bun |
| **Express.js** | 4.21+ | • 輕量靈活<br>• 中間件生態完整<br>• 簡單易學<br>• 社群支援強大 | Fastify, Koa, NestJS |
| **Prisma** | 6.17+ | • 型別安全的 ORM<br>• 自動生成 TypeScript 型別<br>• 優秀的 Migration 工具<br>• 支援多種資料庫<br>• 效能優異 | TypeORM, Sequelize, Drizzle |
| **SQLite** | 3 | • 零配置，開發快速<br>• 檔案式資料庫，易於測試<br>• 適合小型專案<br>• 易於遷移至 PostgreSQL | PostgreSQL (生產環境) |
| **Jest** | 29.7+ | • 功能完整的測試框架<br>• 內建 Mock 與 Spy<br>• Snapshot testing<br>• 覆蓋率報告<br>• TypeScript 支援 | Vitest, Mocha + Chai |
| **Supertest** | 6.3+ | • API 測試專用<br>• 與 Jest 整合良好<br>• HTTP 斷言簡潔<br>• 支援 async/await | node-fetch, axios (測試用) |

### 2.2 開發工具選擇

| 工具 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **ESLint** | 9.37+ | 程式碼品質檢查 | TypeScript 支援、可自訂規則 |
| **Prettier** | 3.6+ | 程式碼格式化 | 自動化格式、團隊一致性 |
| **Husky** | 9.1+ | Git hooks 管理 | Pre-commit 檢查、防止錯誤提交 |
| **lint-staged** | 16.2+ | 只檢查暫存檔案 | 提升 hook 執行速度 |
| **Swagger** | 3.0 | API 文件 | 自動生成、互動式測試 |
| **Vitest** | 2.0+ | 前端測試 | 與 Vite 無縫整合、速度快 |

### 2.3 技術決策記錄 (ADR)

#### ADR-001: 選擇 Zustand 而非 Redux Toolkit

**日期**: 2025-10-14

**狀態**: 已採用

**背景**: 需要選擇前端狀態管理解決方案

**決策**: 使用 Zustand

**理由**:
- Bundle size: Zustand 1.2KB vs Redux Toolkit 12KB
- 程式碼量: Zustand 減少約 50% 樣板代碼
- 學習曲線: Zustand 更簡單直覺
- 型別推斷: Zustand TypeScript 支援更好
- 效能: 無 Context API 開銷

**後果**:
- ✅ 更快的開發速度
- ✅ 更小的 bundle size
- ✅ 更好的開發體驗
- ⚠️ 社群規模較小 (但文件完整)

---

#### ADR-002: 選擇 Tailwind CSS 而非 Material-UI

**日期**: 2025-10-14

**狀態**: 已採用

**背景**: 需要選擇 UI 框架

**決策**: 使用 Tailwind CSS

**理由**:
- 完全客製化控制
- Tree-shakable CSS (只打包用到的樣式)
- 無 JavaScript runtime overhead
- 響應式設計簡單
- 符合 < 2s 載入時間目標

**後果**:
- ✅ 更小的 bundle size
- ✅ 更快的載入時間
- ✅ 完全客製化設計
- ⚠️ 需要自行設計組件 (無預製組件)

---

#### ADR-003: 選擇 Prisma 而非 TypeORM

**日期**: 2025-10-14

**狀態**: 已採用

**背景**: 需要選擇 ORM 工具

**決策**: 使用 Prisma

**理由**:
- 自動生成 TypeScript 型別定義
- 優秀的 Migration 工具
- 型別安全的查詢 API
- 支援多種資料庫 (SQLite → PostgreSQL)
- 現代化的開發體驗

**後果**:
- ✅ 型別安全
- ✅ 開發效率高
- ✅ 易於測試
- ⚠️ 相對較新 (但已成熟)

---

#### ADR-004: 選擇 Tailwind CSS v4 而非 v3

**日期**: 2025-10-17

**狀態**: 已採用

**背景**: Tailwind CSS 發布 v4,需要評估是否採用最新版本

**決策**: 使用 Tailwind CSS v4

**理由**:
- 效能提升: v4 提供更快的建置速度
- 現代化架構: 使用 CSS 原生 `@import` 取代 `@tailwind` 指令
- CSS 變數配置: 使用 `@theme` 定義主題,取代 JavaScript 配置檔案
- Vite 專用插件: `@tailwindcss/vite` 提供更好的整合
- 學習最新技術: 為團隊未來發展做準備
- 專案啟動階段: 新專案無遷移成本

**後果**:
- ✅ 更快的建置與 HMR 速度
- ✅ 更簡潔的配置方式 (CSS 變數)
- ✅ 與 Vite 更好的整合
- ⚠️ 需要 Node.js 20+ (已滿足: v24.4.0)
- ⚠️ 部分語法變更 (已文件化於 `Tailwind-CSS-Version-Comparison.md`)

**參考文件**: `.doc/Tailwind-CSS-Version-Comparison.md`

---

#### ADR-005: 移除 localStorage 持久化，完全依賴後端 API

**日期**: 2025-01-17

**狀態**: 已採用

**背景**:
在同時使用 localStorage (Zustand persist middleware) 和後端 API 的混合架構中，
發現數據同步問題導致 E2E 測試失敗率達 40% (6/10 通過)。主要問題：
- 同一個 todo 出現兩次（localStorage + API 各一份）
- 數據不一致
- useTodos hook 在每個組件掛載時都觸發 API 請求（N+2 次重複）

**決策**:
1. 移除 Zustand persist middleware
2. Store 僅作為內存緩存
3. 所有數據完全依賴後端 API

**理由**:
- **單一數據源**: 避免 localStorage 與 API 數據衝突
- **數據一致性**: 所有客戶端共享同一份後端數據
- **簡化架構**: 減少數據同步邏輯
- **測試穩定性**: E2E 測試通過率從 60% 提升至 100%
- **未來擴展**: 為多用戶、權限管理打基礎

**後果**:
- ✅ E2E 測試穩定性大幅提升 (60% → 100%)
- ✅ 消除數據重複問題
- ✅ 架構更簡潔清晰
- ✅ 減少 80-90% 不必要的 API 請求
- ⚠️ 離線使用受限（未來可用 Service Worker 補償）
- ⚠️ 舊用戶 localStorage 數據無法遷移（可接受）

**相關變更**:
- Hook 架構重構（見 ADR-006）
- E2E 測試策略優化

---

#### ADR-006: Hook 架構分層設計（useTodoActions vs useInitTodos）

**日期**: 2025-01-17

**狀態**: 已採用

**背景**:
原 useTodos hook 在每個組件掛載時都會觸發 useEffect 執行 fetchTodos()，
導致性能問題：
- TodoList: 1 次
- TodoForm: 1 次
- TodoItem × N: N 次
- 總計: N+2 次重複 API 請求

**決策**:
1. 拆分成兩個 hook：
   - `useTodoActions`: 僅提供操作函數，無自動 fetch
   - `useInitTodos`: 初始化 + 操作函數，僅在 TodoList 使用
2. 保留 `useTodos` 作為 deprecated wrapper（向後兼容）

**理由**:
- **職責分離**: 數據初始化與操作函數分離
- **性能優化**: API 請求從 N+2 次降至 1 次
- **清晰語義**: Hook 名稱明確表達用途
- **可維護性**: 減少不必要的 side effects

**後果**:
- ✅ API 請求減少 80-90%
- ✅ 組件職責更清晰
- ✅ 向後兼容（useTodos 仍可用）
- ✅ 更好的性能表現

**使用指南**:
```typescript
// ✅ 根組件（僅一次初始化）
function TodoList() {
  useInitTodos(); // 自動 fetch + 提供操作函數
}

// ✅ 子組件（僅操作）
function TodoForm() {
  const { createTodo } = useTodoActions(); // 無 fetch
}

// ⚠️ Deprecated（仍可用但不推薦）
function OldComponent() {
  useTodos(); // 等同於 useInitTodos
}
```

---

#### ADR-007: E2E 測試執行策略優化

**日期**: 2025-01-17

**狀態**: 已採用

**背景**:
並行執行 E2E 測試（fullyParallel: true）時，測試之間共享後端數據庫，
導致數據競爭和不可預測的測試失敗。

**決策**:
1. 禁用並行執行（fullyParallel: false）
2. 使用 `waitForResponse` 替代 `waitForTimeout`
3. 統一使用語義化選擇器（getByRole, getByLabel）
4. 處理動態 DOM 變化（aria-label 變化時重新定位元素）

**理由**:
- **測試穩定性**: 避免數據競爭
- **可預測性**: 固定執行順序
- **可靠等待**: API 響應比固定時間更準確
- **可維護性**: 語義化選擇器抗變化能力強

**後果**:
- ✅ E2E 測試通過率 100%
- ✅ 測試更穩定可靠
- ✅ 選擇器更有語義
- ⚠️ 執行時間略增（~21.6s，可接受）

**測試最佳實踐** (詳見 Section 8.5):
- 等待 API 響應而非固定時間
- 使用語義化選擇器
- 處理動態 DOM 屬性變化
- 串行執行避免數據競爭

---

#### ADR-008: 選擇 Zeabur 作為部署平台

**日期**: 2025-10-18

**狀態**: 已採用

**背景**: 需要選擇雲端部署平台來部署全棧 TodoList 應用

**決策**: 使用 Zeabur 作為統一部署平台

**理由**:
- **一站式部署**: 前端、後端、資料庫統一管理
- **自動檢測**: 自動識別 Node.js、React、Prisma 專案
- **Monorepo 支援**: 原生支援 `/backend` 和 `/frontend` 目錄結構
- **環境變數模板**: 使用 `${POSTGRES_DATABASE_URL}` 自動連接服務
- **零配置 HTTPS**: 自動生成 SSL 證書和域名
- **快速部署**: 推送 GitHub 自動觸發部署 (~2-3 分鐘)
- **免費方案**: 提供免費額度適合 MVP 測試
- **GitHub 整合**: 無縫連接 GitHub repository
- **開發體驗**: zbpack.json 配置簡潔，支援自訂 build/start 命令

**後果**:
- ✅ 簡化部署流程（單一平台管理）
- ✅ 降低學習曲線（無需學習多個平台）
- ✅ 降低運維成本（統一監控和日誌）
- ✅ 快速迭代（自動化 CI/CD）
- ✅ 環境一致性（開發環境 SQLite，生產環境 PostgreSQL 無縫切換）
- ⚠️ 平台依賴（需要遷移計畫作為備案）

**技術實作**:
- Backend zbpack.json: `npx prisma migrate deploy && npm start`
- Frontend zbpack.json: `npm run build`
- 環境變數模板: `DATABASE_URL=${POSTGRES_DATABASE_URL}`

**相關文件**:
- `docs/04-execution/devops/Zeabur-Deployment-Guide.md` - 完整部署指南
- `docs/02-design/Database-Migration-Guide.md` - 資料庫遷移說明
- `docs/04-execution/devops/Zeabur-Deployment-Checklist.md` - 部署檢查清單

---

## 3. 系統流程圖

### 3.1 新增待辦事項流程

```
User                Frontend           API Server        Database
  │                   │                     │                │
  │  輸入標題並按下    │                     │                │
  │  Enter/Add 按鈕   │                     │                │
  │──────────────────>│                     │                │
  │                   │                     │                │
  │                   │ 1. 驗證輸入          │                │
  │                   │    (必填、長度)      │                │
  │                   │                     │                │
  │                   │ 2. POST /api/todos  │                │
  │                   │    { title: "..." } │                │
  │                   │────────────────────>│                │
  │                   │                     │                │
  │                   │                     │ 3. 驗證請求     │
  │                   │                     │    (middleware) │
  │                   │                     │                │
  │                   │                     │ 4. 建立 Todo    │
  │                   │                     │───────────────>│
  │                   │                     │                │
  │                   │                     │ 5. 返回新 Todo  │
  │                   │                     │<───────────────│
  │                   │                     │                │
  │                   │ 6. 201 Created      │                │
  │                   │    { data: {...} }  │                │
  │                   │<────────────────────│                │
  │                   │                     │                │
  │                   │ 7. 更新本地 store   │                │
  │                   │                     │                │
  │  8. 顯示新 Todo    │                     │                │
  │<──────────────────│                     │                │
  │                   │                     │                │
```

### 3.2 切換完成狀態流程

```
User                Frontend           API Server        Database
  │                   │                     │                │
  │  點擊 checkbox     │                     │                │
  │──────────────────>│                     │                │
  │                   │                     │                │
  │                   │ 1. 樂觀更新 UI      │                │
  │                   │    (立即反映)        │                │
  │                   │                     │                │
  │  立即看到變化      │                     │                │
  │<──────────────────│                     │                │
  │                   │                     │                │
  │                   │ 2. PUT /api/todos/:id               │
  │                   │    { isCompleted: true/false }      │
  │                   │────────────────────>│                │
  │                   │                     │                │
  │                   │                     │ 3. 更新 Todo    │
  │                   │                     │    設定 completedAt
  │                   │                     │───────────────>│
  │                   │                     │                │
  │                   │                     │ 4. 返回更新的 Todo
  │                   │                     │<───────────────│
  │                   │                     │                │
  │                   │ 5. 200 OK           │                │
  │                   │    { data: {...} }  │                │
  │                   │<────────────────────│                │
  │                   │                     │                │
  │                   │ 6. 確認更新成功      │                │
  │                   │    (或回滾錯誤)      │                │
  │                   │                     │                │
```

### 3.3 刪除待辦事項流程

```
User                Frontend           API Server        Database
  │                   │                     │                │
  │  點擊刪除按鈕      │                     │                │
  │──────────────────>│                     │                │
  │                   │                     │                │
  │                   │ 1. 顯示確認對話框    │                │
  │                   │                     │                │
  │  確認刪除         │                     │                │
  │──────────────────>│                     │                │
  │                   │                     │                │
  │                   │ 2. DELETE /api/todos/:id            │
  │                   │────────────────────>│                │
  │                   │                     │                │
  │                   │                     │ 3. 查詢 Todo 是否存在
  │                   │                     │───────────────>│
  │                   │                     │                │
  │                   │                     │ 4. 刪除 Todo    │
  │                   │                     │───────────────>│
  │                   │                     │                │
  │                   │                     │ 5. 確認刪除     │
  │                   │                     │<───────────────│
  │                   │                     │                │
  │                   │ 6. 204 No Content   │                │
  │                   │<────────────────────│                │
  │                   │                     │                │
  │                   │ 7. 從 store 移除    │                │
  │                   │                     │                │
  │  Todo 從清單消失   │                     │                │
  │<──────────────────│                     │                │
  │                   │                     │                │
```

---

## 4. 模組劃分

### 4.1 前端模組結構

```
src/
├── components/              # UI 組件
│   ├── todo/               # Todo 相關組件
│   │   ├── TodoList.tsx    # 容器組件 (連接 store)
│   │   ├── TodoItem.tsx    # 單一項目組件
│   │   ├── TodoForm.tsx    # 新增表單組件
│   │   └── index.ts        # Barrel exports
│   ├── ui/                 # 可重用 UI 組件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   └── index.ts
│   └── layout/             # 佈局組件
│       ├── AppLayout.tsx
│       └── Header.tsx
│
├── store/                  # 狀態管理
│   └── todoStore.ts        # Zustand store
│
├── hooks/                  # 自訂 Hooks
│   ├── useTodos.ts         # Todo 操作 hook
│   ├── useKeyboardShortcuts.ts  # 鍵盤快捷鍵
│   └── useLocalStorage.ts  # 本地儲存
│
├── types/                  # TypeScript 型別定義
│   ├── todo.ts             # Todo 介面
│   └── index.ts
│
├── utils/                  # 工具函式
│   ├── validation.ts       # 輸入驗證
│   ├── date.ts             # 日期處理
│   └── performance.ts      # 效能監控
│
├── test/                   # 測試工具
│   ├── setup.ts            # 測試設定
│   └── test-utils.tsx      # 自訂測試工具
│
├── App.tsx                 # 根組件
├── main.tsx                # 進入點
└── index.css               # 全域樣式
```

### 4.2 後端模組結構

```
backend/src/
├── controllers/            # 控制器層
│   └── todoController.ts   # Todo CRUD 邏輯
│
├── routes/                 # 路由層
│   └── todoRoutes.ts       # Todo API 路由
│
├── middleware/             # 中間件
│   ├── errorHandler.ts     # 錯誤處理
│   ├── validation.ts       # 輸入驗證
│   └── jsonErrorHandler.ts # JSON 錯誤處理
│
├── config/                 # 配置
│   ├── database.ts         # 資料庫連線
│   └── swagger.ts          # API 文件配置
│
├── utils/                  # 工具函式
│   └── validation.ts       # 共用驗證函式
│
├── types/                  # TypeScript 型別
│   └── todo.types.ts       # Todo 型別定義
│
├── app.ts                  # Express 應用設定
└── server.ts               # HTTP 伺服器啟動
```

### 4.3 模組職責說明

#### 前端模組職責

| 模組 | 職責 | 依賴 |
|------|------|------|
| **components/todo** | 渲染 Todo UI、處理使用者互動 | store, hooks |
| **components/ui** | 提供可重用的基礎 UI 組件 | 無 |
| **store** | 管理全域應用狀態、業務邏輯 | 無 |
| **hooks** | 封裝可重用的狀態邏輯 | store |
| **utils** | 提供純函式工具 | 無 |

#### 後端模組職責

| 模組 | 職責 | 依賴 |
|------|------|------|
| **controllers** | 處理業務邏輯、呼叫資料層 | config/database |
| **routes** | 定義 API 路由、綁定控制器 | controllers, middleware |
| **middleware** | 請求預處理、驗證、錯誤處理 | 無 |
| **config** | 應用配置、資料庫連線 | Prisma |
| **utils** | 共用工具函式 | 無 |

---

## 5. 介面設計

### 5.1 模組間通訊

#### 前端模組通訊

```
Component <─────> Zustand Store <─────> Local Storage
    │                                          │
    │                                          │
    └──────────> HTTP Client ─────────────────┘
                     │
                     ↓
                 Backend API
```

**通訊方式**:
- Components 透過 Zustand hooks 讀取/更新狀態
- Store 透過 Zustand middleware 自動同步 Local Storage
- 未來可能透過 HTTP 與後端同步

#### 後端模組通訊

```
HTTP Request → Routes → Middleware → Controller → Prisma → Database
                                          │
                                          ↓
HTTP Response ←──────────────────────────┘
```

**通訊方式**:
- RESTful HTTP/JSON
- 內部模組透過函式呼叫
- 資料庫透過 Prisma Client

### 5.2 API 介面設計概覽

詳細規格請參閱 `API-Specification.md`

#### 基本規範

- **協議**: HTTP/1.1, HTTPS (生產環境)
- **數據格式**: JSON
- **字元編碼**: UTF-8
- **API 版本**: v1 (未來可能在 URL 加入版本號 `/api/v1/...`)

#### 統一回應格式

**成功回應**:
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功" // 選用
}
```

**錯誤回應**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "標題不能為空",
    "details": { ... } // 選用
  }
}
```

#### HTTP 狀態碼規範

| 狀態碼 | 意義 | 使用場景 |
|--------|------|---------|
| 200 | OK | GET, PUT 成功 |
| 201 | Created | POST 成功建立資源 |
| 204 | No Content | DELETE 成功 |
| 400 | Bad Request | 輸入驗證失敗 |
| 404 | Not Found | 資源不存在 |
| 500 | Internal Server Error | 伺服器錯誤 |

---

## 6. 資料模型

詳細設計請參閱 `Database-Design.md`

### 6.1 主要資料實體

#### Todo 實體

```typescript
interface Todo {
  id: string;           // UUID, Primary Key
  title: string;        // 待辦事項標題, 必填, 1-255 字元
  description?: string; // 詳細描述, 選用
  isCompleted: boolean; // 完成狀態, 預設 false
  createdAt: Date;      // 建立時間, 自動生成
  updatedAt: Date;      // 更新時間, 自動更新
  completedAt?: Date;   // 完成時間, 完成時設定
}
```

### 6.2 資料庫 Schema (Prisma)

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

### 6.3 資料流向

```
Frontend Form Input
     │
     ↓ Validation
Frontend Store (Zustand)
     │
     ↓ HTTP POST/PUT
Backend API (Express)
     │
     ↓ Validation Middleware
Backend Controller
     │
     ↓ Prisma Client
Database (SQLite/PostgreSQL)
```

---

## 7. 安全性考量

### 7.1 輸入驗證

#### 前端驗證
- **目的**: 提升使用者體驗，即時反饋
- **實作位置**: `utils/validation.ts`
- **驗證項目**:
  - 標題必填
  - 標題長度 1-255 字元
  - 去除前後空白
  - 防止 XSS 攻擊 (React 預設已轉義)

#### 後端驗證
- **目的**: 安全防護，資料完整性
- **實作位置**: `middleware/validation.ts`
- **驗證項目**:
  - 必填欄位檢查
  - 資料型別檢查
  - 長度限制檢查
  - UUID 格式檢查
  - 白名單欄位驗證

### 7.2 SQL 注入防護

- **方式**: 使用 Prisma ORM
- **原理**: Prisma 自動參數化查詢，防止 SQL 注入
- **範例**:
  ```typescript
  // ✅ 安全 - Prisma 自動處理
  await prisma.todo.findUnique({
    where: { id: userInput }
  });

  // ❌ 危險 - 原生 SQL
  await prisma.$executeRaw`SELECT * FROM todos WHERE id = ${userInput}`;
  ```

### 7.3 XSS 防護

- **前端**: React 預設轉義輸出，防止 XSS
- **後端**: 驗證輸入，不允許 HTML 標籤
- **Content Security Policy**: 未來可加入 CSP header

### 7.4 CORS 設定

```typescript
// app.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'  // 生產環境限制來源
    : '*',                       // 開發環境允許所有來源
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### 7.5 環境變數管理

```bash
# .env (不提交至 Git)
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
PORT=3000

# .env.production
DATABASE_URL="postgresql://..."
NODE_ENV="production"
PORT=3000
```

### 7.6 未來安全性增強 (Phase 2+)

- JWT 身份驗證
- Rate limiting (防止 DDoS)
- HTTPS 強制使用
- API Key 認證
- 資料加密儲存

---

## 8. 效能考量

### 8.1 效能目標

| 指標 | 目標值 | 測量方式 |
|------|--------|---------|
| **First Contentful Paint** | < 1.0s | Lighthouse |
| **Time to Interactive** | < 2.0s | Lighthouse |
| **API 回應時間** | < 200ms | 伺服器日誌 |
| **Bundle Size** | < 150KB gzipped | Vite build analysis |
| **Database Query** | < 50ms | Prisma Query Log |

### 8.2 前端效能優化

#### 8.2.1 Bundle 優化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'zustand-vendor': ['zustand'],
        },
      },
    },
  },
});
```

#### 8.2.2 程式碼分割

- **策略**: 目前不分割 (bundle 很小)
- **未來**: Phase 2+ 進階功能使用 `React.lazy()`

#### 8.2.3 圖片優化

- 使用 WebP 格式
- 適當尺寸 (不用載入超大圖)
- Lazy loading

#### 8.2.4 CSS 優化

- Tailwind CSS 自動移除未使用的樣式
- PostCSS 自動添加瀏覽器前綴
- 生產環境壓縮 CSS

### 8.3 後端效能優化

#### 8.3.1 資料庫查詢優化

```typescript
// ✅ 好 - 只選取需要的欄位
await prisma.todo.findMany({
  select: {
    id: true,
    title: true,
    isCompleted: true,
  },
});

// ❌ 不好 - 選取所有欄位
await prisma.todo.findMany();
```

#### 8.3.2 索引設計

```prisma
model Todo {
  id          String    @id @default(uuid())
  title       String
  isCompleted Boolean   @default(false)
  createdAt   DateTime  @default(now())

  @@index([createdAt(sort: Desc)])      // 加速列表查詢
  @@index([isCompleted])                 // 加速篩選查詢
}
```

#### 8.3.3 快取策略 (未來)

- Redis 快取熱門查詢
- HTTP Cache-Control headers
- CDN 快取靜態資源

### 8.4 效能監控

```typescript
// utils/performance.ts
export function measureRender(componentName: string) {
  if (import.meta.env.DEV) {
    performance.mark(`${componentName}-start`);

    return () => {
      performance.mark(`${componentName}-end`);
      performance.measure(
        componentName,
        `${componentName}-start`,
        `${componentName}-end`
      );

      const measure = performance.getEntriesByName(componentName)[0];
      if (measure.duration > 16) { // 60fps threshold
        console.warn(`${componentName} took ${measure.duration.toFixed(2)}ms`);
      }
    };
  }
  return () => {};
}
```

---

## 9. 錯誤處理

### 9.1 錯誤分類

| 錯誤類型 | HTTP 狀態碼 | 處理方式 |
|---------|-----------|---------|
| **Validation Error** | 400 | 返回驗證錯誤訊息 |
| **Not Found Error** | 404 | 返回資源不存在訊息 |
| **Server Error** | 500 | 記錄日誌、返回通用錯誤訊息 |
| **Database Error** | 500 | 記錄詳細錯誤、返回通用訊息 |

### 9.2 統一錯誤處理 Middleware

```typescript
// middleware/errorHandler.ts
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details,
      },
    });
  }

  // Not Found Error
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: err.message,
      },
    });
  }

  // Database Error (Prisma)
  if (err.code?.startsWith('P')) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
      },
    });
  }

  // Generic Server Error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
```

### 9.3 前端錯誤處理

```typescript
// hooks/useTodos.ts
export function useTodos() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createTodo = async (title: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTodo, error, loading };
}
```

### 9.4 錯誤日誌記錄

```typescript
// utils/logger.ts
export const logger = {
  error: (message: string, error: unknown) => {
    console.error(`[ERROR] ${message}`, error);

    // 未來可發送至監控服務 (如 Sentry)
    if (process.env.NODE_ENV === 'production') {
      // sendToSentry(error);
    }
  },

  warn: (message: string) => {
    console.warn(`[WARN] ${message}`);
  },

  info: (message: string) => {
    console.info(`[INFO] ${message}`);
  },
};
```

---

## 10. 第三方整合

### 10.1 當前整合服務

| 服務 | 用途 | 整合方式 |
|------|------|---------|
| **Prisma** | ORM / 資料庫管理 | npm package |
| **Swagger UI** | API 文件服務 | npm package (swagger-ui-express) |
| **Jest** | 測試框架 | npm package |
| **Supertest** | API 測試 | npm package |

### 10.2 已整合與未來服務

**已完成整合**:

| 服務 | 用途 | 狀態 | 說明 |
|------|------|------|------|
| **Zeabur** | 全棧部署平台 | ✅ 已部署 | 前端、後端、資料庫統一部署平台 |

**計劃整合**:

| 服務 | 用途 | 優先級 | 說明 |
|------|------|--------|------|
| **Sentry** | 錯誤監控 | P1 | 生產環境錯誤追蹤與報警 |
| **Google Analytics** | 使用者行為分析 | P2 | 了解使用者行為模式 |
| **SendGrid** | Email 通知 | P3 | 任務提醒和通知功能 |
| **Redis Cloud** | 快取服務 | P2 | 提升 API 查詢效能 |

### 10.3 整合架構

```
TodoList App
    │
    ├─> Prisma ──────> SQLite (Dev) / PostgreSQL (Prod)
    │
    ├─> Swagger UI ──> API Documentation
    │
    ├─> Jest ────────> Unit/Integration Tests
    │
    ├─> Zeabur ──────> Deployment Platform
    │   ├─> Frontend Hosting (React + Vite)
    │   ├─> Backend Hosting (Node.js + Express)
    │   └─> PostgreSQL Database
    │
    └─> (Future)
        ├─> Sentry ──────> Error Tracking
        ├─> Redis ───────> Caching Layer
        └─> SendGrid ────> Email Notifications
```

---

## 11. 附件

### 11.1 相關文件連結

**核心文檔**:
- **需求文檔**: `docs/01-requirements/PRD.md` (產品需求文件)
- **設計文檔**: `docs/02-design/SDD.md` (系統設計文件 - 本文件)
- **API 規格**: `docs/02-design/API-Specification.md` (詳細的 API 端點定義)
- **資料庫設計**: `docs/02-design/Database-Design.md` (資料表結構、索引、關聯)
- **專案路線圖**: `docs/03-planning/Project-Roadmap.md` (開發時程與里程碑)

**技術參考文檔**:
- **Tailwind CSS v4**: `docs/02-design/Tailwind-CSS-Version-Comparison.md` (v3 vs v4 比較)

**執行文檔**:
- **前端團隊**: `docs/04-execution/frontend/Frontend-Team-Todolist.md`
- **後端團隊**: `docs/04-execution/backend/Backend-Team-Todolist.md`

**部署文檔**:
- **部署導航**: `docs/04-execution/devops/Zeabur-Deployment-README.md` (部署指南索引)
- **完整指南**: `docs/04-execution/devops/Zeabur-Deployment-Guide.md` (逐步部署說明)
- **快速概覽**: `docs/04-execution/devops/Zeabur-Deployment-Summary.md` (架構圖與概要)
- **檢查清單**: `docs/04-execution/devops/Zeabur-Deployment-Checklist.md` (部署前檢查)
- **資料庫遷移**: `docs/02-design/Database-Migration-Guide.md` (SQLite→PostgreSQL)

**變更管理**:
- **變更日誌**: `docs/05-change-management/Change-Log.md` (所有變更記錄)

### 11.2 開發環境設置

#### 必要軟體

- **Node.js**: 20 LTS
- **npm**: 10+
- **Git**: 2.40+
- **VSCode**: 最新版 (推薦)

#### VSCode 推薦擴充套件

- ESLint
- Prettier
- Prisma
- TypeScript
- Tailwind CSS IntelliSense

#### 環境設定步驟

```bash
# 1. Clone repository
git clone <repository-url>
cd TDD-test-todolist

# 2. 安裝後端依賴
cd backend
npm install

# 3. 設置資料庫
npx prisma migrate dev

# 4. 啟動後端開發伺服器
npm run dev

# 5. (另開終端) 安裝前端依賴
cd ../frontend
npm install

# 6. 啟動前端開發伺服器
npm run dev
```

---

## 文件維護

**維護責任**: 技術團隊負責人
**更新頻率**: 每個重大技術決策變更時更新
**版本控制**: 使用 Git 追蹤變更

**最後更新**: 2025-10-18
**下一次審查**: 2025-11-01

---

**文件結束**
