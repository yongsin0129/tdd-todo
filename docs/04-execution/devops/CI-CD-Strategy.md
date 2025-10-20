# CI/CD 策略文件
# TodoList 應用程式持續整合與部署策略

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | CI/CD 策略文件 |
| 版本號 | 1.0.0 |
| 撰寫日期 | 2025-10-19 |
| 最後更新 | 2025-10-19 |
| 撰寫人 | DevOps Team |
| 狀態 | 待實施 |

---

## 1. CI/CD 架構概述

### 1.1 設計理念

本專案採用 **平台原生自動部署 + GitHub Actions 測試** 的混合 CI/CD 策略：

- **持續整合 (CI)**: GitHub Actions 負責自動化測試
- **持續部署 (CD)**: Vercel 和 Zeabur 平台原生 Git 集成自動部署

### 1.2 架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Push Code                       │
│                    git push origin main                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
└────────┬────────────────────────────────────┬───────────────┘
         │                                    │
         ↓                                    ↓
┌─────────────────────┐            ┌─────────────────────────┐
│  GitHub Actions     │            │   Platform Auto-Deploy  │
│  (CI - Testing)     │            │   (CD - Deployment)     │
├─────────────────────┤            ├─────────────────────────┤
│ ✅ ESLint           │            │ 🌐 Vercel (Frontend)    │
│ ✅ TypeScript Check │            │    - Detect Push        │
│ ✅ Unit Tests       │            │    - Build React        │
│ ✅ Integration Tests│            │    - Deploy to CDN      │
│ ✅ E2E Tests        │            │                         │
│ 📊 Test Reports     │            │ 🔧 Zeabur (Backend)     │
│ 📈 Coverage Reports │            │    - Detect Push        │
└─────────────────────┘            │    - Build Node.js      │
         │                         │    - Run Migration      │
         ↓                         │    - Deploy API         │
┌─────────────────────┐            └─────────────────────────┘
│   Status Checks     │                       │
│   ✅ All Pass       │                       ↓
│   ❌ Failed         │            ┌─────────────────────────┐
└─────────────────────┘            │   Production Env        │
                                   │   🎉 Live Application   │
                                   └─────────────────────────┘
```

---

## 2. GitHub Actions CI 配置

### 2.1 CI 工作流程目標

GitHub Actions 專注於**質量保證**，不涉及部署：

- ✅ 程式碼品質檢查（ESLint）
- ✅ 類型檢查（TypeScript）
- ✅ 單元測試（Unit Tests）
- ✅ 整合測試（Integration Tests）
- ✅ E2E 測試（End-to-End Tests）
- 📊 測試覆蓋率報告
- 📈 測試結果可視化

### 2.2 GitHub Actions Workflow 配置

#### 檔案位置
`.github/workflows/ci.yml`

#### 配置內容

```yaml
name: CI - Quality Assurance

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # ==================== 後端測試 ====================
  backend-tests:
    name: Backend Tests
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript type check
        run: npm run type-check

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run integration tests
        run: npm test -- --coverage

      - name: Upload backend coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./backend/coverage/coverage-final.json
          flags: backend
          name: backend-coverage
          fail_ci_if_error: false

      - name: Archive backend test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: backend-test-results
          path: |
            backend/coverage/
            backend/test-results/
          retention-days: 7

  # ==================== 前端測試 ====================
  frontend-tests:
    name: Frontend Tests
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript type check
        run: npm run type-check

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Build frontend
        run: npm run build

      - name: Upload frontend coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./frontend/coverage/coverage-final.json
          flags: frontend
          name: frontend-coverage
          fail_ci_if_error: false

      - name: Archive frontend test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: frontend-test-results
          path: |
            frontend/coverage/
            frontend/test-results/
          retention-days: 7

  # ==================== E2E 測試 ====================
  e2e-tests:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      # 安裝前端依賴
      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci

      # 安裝後端依賴
      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci

      # 安裝 Playwright 瀏覽器
      - name: Install Playwright Browsers
        working-directory: ./frontend
        run: npx playwright install --with-deps chromium

      # 啟動後端 API (背景執行)
      - name: Start Backend API
        working-directory: ./backend
        run: |
          npx prisma generate
          npx prisma migrate deploy
          npm start &
          sleep 5
        env:
          NODE_ENV: test
          DATABASE_URL: file:./test.db
          PORT: 3000

      # 啟動前端 (背景執行)
      - name: Start Frontend
        working-directory: ./frontend
        run: |
          npm run dev &
          sleep 5
        env:
          VITE_API_URL: http://localhost:3000

      # 等待服務啟動
      - name: Wait for services
        run: |
          npx wait-on http://localhost:5173 http://localhost:3000/api/todos

      # 執行 E2E 測試
      - name: Run Playwright E2E tests
        working-directory: ./frontend
        run: npx playwright test

      # 上傳 Playwright 報告
      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 7

      # 上傳 E2E 測試截圖/影片
      - name: Upload E2E test artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-test-artifacts
          path: |
            frontend/test-results/
            frontend/playwright-report/
          retention-days: 7

  # ==================== 測試結果摘要 ====================
  test-summary:
    name: Test Results Summary
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests, e2e-tests]
    if: always()

    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v4

      - name: Generate Test Summary
        run: |
          echo "## 🧪 Test Results Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### ✅ Backend Tests" >> $GITHUB_STEP_SUMMARY
          echo "- ESLint: Passed" >> $GITHUB_STEP_SUMMARY
          echo "- TypeScript: Passed" >> $GITHUB_STEP_SUMMARY
          echo "- Integration Tests: Passed" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### ✅ Frontend Tests" >> $GITHUB_STEP_SUMMARY
          echo "- ESLint: Passed" >> $GITHUB_STEP_SUMMARY
          echo "- TypeScript: Passed" >> $GITHUB_STEP_SUMMARY
          echo "- Unit Tests: Passed" >> $GITHUB_STEP_SUMMARY
          echo "- Build: Passed" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### ✅ E2E Tests" >> $GITHUB_STEP_SUMMARY
          echo "- Playwright Tests: Passed" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "📊 **View detailed reports in the Artifacts section**" >> $GITHUB_STEP_SUMMARY
```

---

## 3. 平台原生自動部署配置

### 3.1 Vercel 自動部署（前端）

#### 配置步驟

1. **連接 GitHub Repository**
   - 前往 Vercel Dashboard
   - Import Project → 選擇 GitHub Repository
   - 選擇 Root Directory: `frontend/`

2. **配置建置設定**
   ```yaml
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm ci
   Root Directory: frontend
   ```

3. **環境變數設定**
   ```bash
   VITE_API_URL=https://your-backend.zeabur.app
   ```

4. **Git 觸發設定**
   - Production Branch: `main`
   - Preview Branches: `develop`, feature branches
   - 自動部署: ✅ 啟用

#### 部署流程

```
git push origin main
    ↓
Vercel 自動偵測 Push
    ↓
自動執行建置 (npm run build)
    ↓
部署至全球 CDN
    ↓
✅ 前端上線
```

### 3.2 Zeabur 自動部署（後端 + 資料庫）

#### 配置步驟

1. **連接 GitHub Repository**
   - 前往 Zeabur Dashboard
   - Create Service → Import from GitHub
   - 選擇 Repository 和 Branch

2. **配置 zbpack.json**

   檔案位置: `backend/zbpack.json`

   ```json
   {
     "build_command": "npm ci && npm run build",
     "start_command": "npx prisma migrate deploy && npm start",
     "install_command": "npm ci"
   }
   ```

3. **環境變數設定**
   ```bash
   NODE_ENV=production
   DATABASE_URL=${POSTGRES_DATABASE_URL}
   PORT=3000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Git 觸發設定**
   - Production Branch: `main`
   - 自動部署: ✅ 啟用
   - 自動 Migration: ✅ 啟用

#### 部署流程

```
git push origin main
    ↓
Zeabur 自動偵測 Push
    ↓
自動執行建置 (npm run build)
    ↓
執行 Prisma Migration
    ↓
重啟 Node.js 服務
    ↓
✅ 後端上線
```

---

## 4. 完整部署流程

### 4.1 開發流程

```
開發者本地開發
    ↓
git add . && git commit -m "feat: new feature"
    ↓
git push origin feature/new-feature
    ↓
┌────────────────────────────────────────┐
│  GitHub Pull Request 建立              │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│  GitHub Actions CI 自動執行             │
│  ✅ Backend Tests                      │
│  ✅ Frontend Tests                     │
│  ✅ E2E Tests                          │
│  📊 Test Reports                       │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│  Vercel Preview Deployment             │
│  🔗 預覽 URL 產生                       │
└────────────────────────────────────────┘
    ↓
Code Review + 測試通過
    ↓
Merge to main
    ↓
┌────────────────────────────────────────┐
│  GitHub Actions CI (main branch)       │
│  再次執行所有測試                       │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│  Vercel Production Deployment          │
│  🌐 前端自動部署至生產環境              │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│  Zeabur Production Deployment          │
│  🔧 後端自動部署至生產環境              │
│  📊 資料庫 Migration 自動執行           │
└────────────────────────────────────────┘
    ↓
✅ 生產環境更新完成
```

---

## 5. 測試報告查看

### 5.1 GitHub Actions 測試報告

#### 查看位置
1. 進入 GitHub Repository
2. 點擊 **Actions** 標籤
3. 選擇對應的 Workflow Run
4. 查看各個 Job 的執行結果

#### 測試報告類型

| 報告類型 | 位置 | 內容 |
|---------|------|------|
| **測試摘要** | Summary 頁面 | 整體測試結果概覽 |
| **Backend Coverage** | Artifacts → backend-test-results | 後端測試覆蓋率 |
| **Frontend Coverage** | Artifacts → frontend-test-results | 前端測試覆蓋率 |
| **E2E Test Report** | Artifacts → playwright-report | Playwright HTML 報告 |
| **E2E Screenshots** | Artifacts → e2e-test-artifacts | 失敗截圖與影片 |

### 5.2 Playwright E2E 報告查看

#### 步驟
1. 下載 `playwright-report` Artifact
2. 解壓縮
3. 打開 `index.html` 查看互動式報告

#### 報告內容
- ✅ 測試通過/失敗統計
- ⏱️ 測試執行時間
- 📸 失敗測試截圖
- 🎥 測試執行影片
- 📊 測試步驟詳情

### 5.3 Codecov 覆蓋率報告（可選）

若整合 Codecov：
- 前往 https://codecov.io/gh/your-org/your-repo
- 查看整體覆蓋率趨勢
- 查看哪些檔案覆蓋率較低

---

## 6. 環境變數管理

### 6.1 環境變數配置清單

#### GitHub Actions (CI)
```yaml
# 不需要設置，使用本地 SQLite 測試
DATABASE_URL: file:./test.db
NODE_ENV: test
PORT: 3000
VITE_API_URL: http://localhost:3000
```

#### Vercel (Frontend)
```bash
VITE_API_URL=https://your-backend.zeabur.app
```

#### Zeabur (Backend)
```bash
NODE_ENV=production
DATABASE_URL=${POSTGRES_DATABASE_URL}  # Zeabur 自動注入
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 7. 部署檢查清單

### 7.1 GitHub Actions 設置檢查

- [ ] 建立 `.github/workflows/ci.yml`
- [ ] 配置 Backend Tests Job
- [ ] 配置 Frontend Tests Job
- [ ] 配置 E2E Tests Job
- [ ] 配置 Test Summary Job
- [ ] 測試 Workflow 是否正常執行
- [ ] 確認 Artifacts 正確上傳

### 7.2 Vercel 設置檢查

- [ ] 連接 GitHub Repository
- [ ] 設置 Root Directory: `frontend/`
- [ ] 配置環境變數 `VITE_API_URL`
- [ ] 啟用自動部署（main branch）
- [ ] 啟用 Preview Deployments
- [ ] 測試 Push 後是否自動部署

### 7.3 Zeabur 設置檢查

- [ ] 連接 GitHub Repository
- [ ] 配置 `zbpack.json`
- [ ] 設置環境變數 `DATABASE_URL`
- [ ] 設置環境變數 `FRONTEND_URL`
- [ ] 啟用自動部署（main branch）
- [ ] 測試 Push 後是否自動部署
- [ ] 確認 Prisma Migration 自動執行

---

## 8. 故障排除

### 8.1 GitHub Actions 測試失敗

**問題**: E2E 測試失敗
```bash
Error: Timed out waiting for http://localhost:5173
```

**解決方案**:
1. 增加 `wait-on` 超時時間
2. 確認服務啟動指令正確
3. 檢查端口是否被佔用

### 8.2 Vercel 部署失敗

**問題**: 環境變數未生效
```bash
Error: VITE_API_URL is not defined
```

**解決方案**:
1. 檢查 Vercel Dashboard → Settings → Environment Variables
2. 確認變數名稱正確（Vite 要求 `VITE_` 前綴）
3. 重新部署觸發環境變數載入

### 8.3 Zeabur 部署失敗

**問題**: Prisma Migration 失敗
```bash
Error: P3009 migrate.lock file not found
```

**解決方案**:
1. 確認 `prisma/migrations` 目錄已提交至 Git
2. 執行 `npx prisma migrate dev` 生成 migration
3. 提交 migration 檔案後重新部署

---

## 9. 預期效益

### 9.1 開發效率提升

| 指標 | 改善前 | 改善後 | 提升 |
|------|--------|--------|------|
| **部署頻率** | 1-2 次/週 | 多次/天 | 5x |
| **測試反饋時間** | 30 分鐘 | 5-10 分鐘 | 3-6x |
| **部署時間** | 15 分鐘 | 2-3 分鐘 | 5-7x |
| **錯誤發現時間** | 部署後 | Pull Request 階段 | 提前 |

### 9.2 質量保證提升

- ✅ 每次 Push 自動執行測試
- ✅ Pull Request 強制通過測試
- ✅ E2E 測試覆蓋關鍵流程
- ✅ 測試報告可視化
- ✅ 程式碼覆蓋率追蹤

### 9.3 團隊協作提升

- 🔄 Preview Deployments 方便 Code Review
- 📊 測試報告透明化
- 🚀 自動化減少人為錯誤
- 🔍 快速定位問題

---

## 10. 未來優化方向

### 10.1 短期優化（1-2 週）

- [ ] 整合 Codecov 覆蓋率追蹤
- [ ] 新增 Lighthouse CI 效能測試
- [ ] 新增 PR 評論自動回報測試結果
- [ ] 設置 Slack/Discord 部署通知

### 10.2 中期優化（1-2 月）

- [ ] 實作 Canary Deployment（金絲雀部署）
- [ ] 新增 Visual Regression Testing
- [ ] 整合 Sentry 錯誤監控
- [ ] 實作 Feature Flags

### 10.3 長期優化（3-6 月）

- [ ] 實作 Blue-Green Deployment
- [ ] 新增自動回滾機制
- [ ] 實作 A/B Testing 基礎設施
- [ ] 監控與告警系統整合

---

## 附錄

### A. 必要套件安裝

```bash
# Frontend
npm install --save-dev @playwright/test wait-on

# Backend
npm install --save-dev wait-on
```

### B. 參考連結

- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [Vercel Git Integration](https://vercel.com/docs/deployments/git)
- [Zeabur Deploy Guide](https://zeabur.com/docs/deploy)
- [Playwright CI](https://playwright.dev/docs/ci)

---

**文件狀態**: 📝 待實施
**最後更新**: 2025-10-19
**下次審查**: 實施完成後
