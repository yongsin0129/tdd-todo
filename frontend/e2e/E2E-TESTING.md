# E2E 測試指南

## 📚 概述

本專案使用 **Playwright** 進行端到端 (End-to-End) 測試，確保應用程式在真實瀏覽器環境中的完整功能正常運作。

## 🎯 測試覆蓋範圍

### 核心功能測試 (10 個測試案例)

| 測試 ID | 測試案例 | 描述 |
|---------|---------|------|
| **E2E-1** | 新增待辦事項 | 驗證使用者可以成功新增待辦事項 |
| **E2E-2** | 查看待辦列表 | 驗證所有待辦事項正確顯示 |
| **E2E-3** | 切換完成狀態 | 驗證 checkbox 可正確標記完成/未完成 |
| **E2E-4** | 編輯待辦事項 | 驗證雙擊可進入編輯模式並儲存 |
| **E2E-5** | 刪除待辦事項 | 驗證刪除按鈕正常運作 |
| **E2E-6** | 過濾功能 | 驗證 All/Active/Completed 過濾器 |
| **E2E-7** | 輸入驗證 | 驗證空標題會顯示錯誤訊息 |
| **E2E-8** | LocalStorage | 驗證資料持久化到本地儲存 |
| **E2E-9** | 鍵盤快捷鍵 | 驗證 `/` 和 `Enter` 快捷鍵 |
| **E2E-10** | 響應式設計 | 驗證手機版介面正常運作 |

## 🚀 執行測試

### 前置需求

1. 確保後端 API 正在運行 (或使用 mock)
2. 安裝相依套件: `npm install`
3. 安裝瀏覽器驅動: `npx playwright install`

### 測試指令

```bash
# 執行所有 E2E 測試 (headless 模式)
npm run test:e2e

# 使用 UI 模式執行測試 (推薦)
npm run test:e2e:ui

# Debug 模式 (逐步執行)
npm run test:e2e:debug

# 查看測試報告
npm run test:e2e:report
```

### 進階選項

```bash
# 只在 Chromium 執行測試
npx playwright test --project=chromium

# 只執行特定測試檔案
npx playwright test e2e/todo-app.spec.ts

# 只執行包含特定關鍵字的測試
npx playwright test -g "新增待辦事項"

# 顯示瀏覽器視窗 (非 headless)
npx playwright test --headed

# 執行測試並產生 trace
npx playwright test --trace on
```

## 🏗️ 測試架構

### 檔案結構

```
frontend/
├── e2e/
│   ├── todo-app.spec.ts       # 主要測試案例
│   └── (future tests)
├── playwright.config.ts        # Playwright 配置
├── playwright-report/          # HTML 測試報告
└── test-results/              # 截圖、影片、trace
```

### 測試配置 (playwright.config.ts)

```typescript
- baseURL: http://localhost:5173 (自動啟動 dev server)
- 瀏覽器: Chromium, Firefox, WebKit
- 行動裝置: Pixel 5, iPhone 12
- 失敗時截圖、錄影、trace
```

## 📝 撰寫測試最佳實踐

### 1. 使用語義化選擇器

```typescript
// ✅ 好的做法 - 使用 role 和 name
const button = page.getByRole('button', { name: /add todo/i });
const input = page.getByPlaceholder(/what needs to be done/i);

// ❌ 不好的做法 - 使用 CSS selector
const button = page.locator('.btn-primary');
```

### 2. 清理測試環境

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});
```

### 3. 明確的斷言

```typescript
// ✅ 好的做法 - 等待元素可見
await expect(page.getByText('買牛奶')).toBeVisible();

// ❌ 不好的做法 - 硬編碼延遲
await page.waitForTimeout(1000);
```

### 4. 使用 Page Object Model (進階)

```typescript
// pages/TodoPage.ts
class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByPlaceholder(/what needs to be done/i);
    this.addButton = page.getByRole('button', { name: /add todo/i });
  }

  async addTodo(title: string) {
    await this.input.fill(title);
    await this.addButton.click();
  }
}
```

## 🐛 除錯技巧

### 1. 使用 UI 模式

```bash
npm run test:e2e:ui
```

提供圖形介面、時間軸、DOM 快照、網路請求等。

### 2. 使用 Debug 模式

```bash
npm run test:e2e:debug
```

逐步執行測試，可設定中斷點。

### 3. 查看 Trace

失敗測試會自動產生 trace 檔案:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### 4. 截圖與錄影

失敗測試會自動截圖和錄影，儲存在 `test-results/` 目錄。

### 5. Console Logs

```typescript
page.on('console', msg => console.log(msg.text()));
```

## 🔧 常見問題

### Q1: 測試超時

**問題**: `Test timeout of 30000ms exceeded`

**解決**:
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 設定 60 秒
  // ...
});
```

### Q2: 元素找不到

**問題**: `locator.click: Target closed`

**解決**:
```typescript
// 等待元素可見
await expect(element).toBeVisible();
await element.click();
```

### Q3: 跨測試干擾

**問題**: 測試間互相影響

**解決**: 確保 `beforeEach` 清空 localStorage:
```typescript
test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});
```

### Q4: 後端 API 未啟動

**問題**: 測試失敗因為 API 無回應

**解決**:
1. 確保後端運行: `cd backend && npm run dev`
2. 或使用 MSW (Mock Service Worker) mock API

## 📊 CI/CD 整合

### GitHub Actions 範例

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend

      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        working-directory: ./frontend

      - name: Run E2E tests
        run: npm run test:e2e
        working-directory: ./frontend

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## 📈 測試指標

### 目標

- ✅ 所有核心流程測試覆蓋: 100%
- ✅ 測試通過率: 100%
- ✅ 測試執行時間: < 2 分鐘
- ✅ 支援瀏覽器: Chrome, Firefox, Safari, Edge
- ✅ 支援裝置: Desktop, Mobile

## 🔗 相關資源

- [Playwright 官方文件](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [專案文件: Frontend-Team-Todolist.md](../.doc/Frontend-Team-Todolist.md)

---

**最後更新**: 2025-10-17
**維護人**: Frontend Team
