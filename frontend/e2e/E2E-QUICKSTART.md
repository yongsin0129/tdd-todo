# E2E 測試快速入門指南

## ✅ 已完成設定

### 1. 安裝 Playwright
```bash
npm install -D @playwright/test  # ✅ 完成
```

### 2. 配置檔案
- ✅ `playwright.config.ts` - Playwright 配置
- ✅ `e2e/todo-app.spec.ts` - 10 個核心測試案例
- ✅ `package.json` - 新增測試腳本

### 3. 測試腳本
```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:report": "playwright show-report"
}
```

## 🚀 如何執行 E2E 測試

### 方式 1: 自動模式 (推薦初次使用)

**步驟 1**: 確保後端 API 正在運行
```bash
cd backend
npm run dev
```

**步驟 2**: 在新終端執行 E2E 測試
```bash
cd frontend
npm run test:e2e
```

### 方式 2: UI 模式 (推薦開發時使用)

```bash
cd frontend
npm run test:e2e:ui
```

優點:
- 圖形化介面
- 可視化測試執行過程
- 時間軸回放
- DOM 快照檢視
- 網路請求監控

### 方式 3: Debug 模式 (除錯用)

```bash
cd frontend
npm run test:e2e:debug
```

優點:
- 逐步執行測試
- 設定中斷點
- 檢查變數值
- 手動操作頁面

## 📋 測試案例說明

### 已實作的 10 個測試案例

| # | 測試名稱 | 測試內容 |
|---|---------|---------|
| 1 | 應該能成功新增待辦事項 | 輸入標題 → 點擊新增 → 驗證出現 |
| 2 | 應該能顯示所有待辦事項 | 新增多個 → 驗證統計正確 |
| 3 | 應該能切換待辦事項的完成狀態 | 點擊 checkbox → 驗證樣式改變 |
| 4 | 應該能編輯待辦事項 | 雙擊 → 修改 → Enter → 驗證更新 |
| 5 | 應該能刪除待辦事項 | 點擊刪除 → 驗證消失 |
| 6 | 應該能過濾待辦事項 | 測試 All/Active/Completed |
| 7 | 應該拒絕空標題的待辦事項 | 空輸入 → 驗證錯誤訊息 |
| 8 | 應該將待辦事項儲存至 localStorage | 新增 → 重新載入 → 驗證存在 |
| 9 | 應該支援鍵盤快捷鍵 | `/` 聚焦 → Enter 提交 |
| 10 | 應該在手機版正常運作 | 手機視窗 → 驗證功能 |

## 🎯 測試覆蓋的瀏覽器

根據 `playwright.config.ts`:

### Desktop
- ✅ Chromium (Chrome, Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

### Mobile
- ✅ Pixel 5 (Android Chrome)
- ✅ iPhone 12 (iOS Safari)

## 📊 預期測試結果

### 成功情況
```
Running 10 tests using 5 workers

  ✓  [chromium] › todo-app.spec.ts:11:3 › 應該能成功新增待辦事項 (2s)
  ✓  [chromium] › todo-app.spec.ts:29:3 › 應該能顯示所有待辦事項 (1s)
  ✓  [chromium] › todo-app.spec.ts:51:3 › 應該能切換待辦事項的完成狀態 (2s)
  ✓  [chromium] › todo-app.spec.ts:75:3 › 應該能編輯待辦事項 (2s)
  ✓  [chromium] › todo-app.spec.ts:95:3 › 應該能刪除待辦事項 (1s)
  ✓  [chromium] › todo-app.spec.ts:113:3 › 應該能過濾待辦事項 (3s)
  ✓  [chromium] › todo-app.spec.ts:145:3 › 應該拒絕空標題的待辦事項 (1s)
  ✓  [chromium] › todo-app.spec.ts:158:3 › 應該將待辦事項儲存至 localStorage (2s)
  ✓  [chromium] › todo-app.spec.ts:171:3 › 應該支援鍵盤快捷鍵 (1s)
  ✓  [chromium] › todo-app.spec.ts:185:3 › 應該在手機版正常運作 (2s)

  10 passed (17s)
```

## ⚠️ 常見問題排除

### 問題 1: 測試超時
```
Error: Test timeout of 30000ms exceeded
```

**原因**: 前端 dev server 或後端 API 未啟動

**解決**:
1. 確認後端運行中: `cd backend && npm run dev`
2. Playwright config 會自動啟動前端 (設定了 webServer)

### 問題 2: 找不到元素
```
Error: locator.click: Target closed
```

**原因**: 元素選擇器錯誤或時機問題

**解決**: 使用 `await expect(element).toBeVisible()` 先等待元素

### 問題 3: API 整合問題

如果測試失敗是因為 API 問題,有兩種解決方案:

**方案 A: 使用真實 API**
```bash
# Terminal 1: 啟動後端
cd backend && npm run dev

# Terminal 2: 執行 E2E 測試
cd frontend && npm run test:e2e
```

**方案 B: Mock API (未來可實作)**
使用 MSW (Mock Service Worker) 模擬 API 回應。

## 🔍 查看測試報告

### HTML 報告
```bash
npm run test:e2e:report
```

自動在瀏覽器開啟詳細的 HTML 報告,包含:
- 測試執行時間
- 截圖
- 錄影
- Trace 檔案
- 錯誤堆疊

### 失敗測試的 Trace

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

提供:
- 完整的測試執行時間軸
- DOM 快照
- 網路請求
- Console logs
- 可回放測試過程

## 📝 撰寫新測試

### 範例: 測試統計功能

```typescript
test('應該正確顯示統計資訊', async ({ page }) => {
  // 1. 新增 5 個待辦事項
  const input = page.getByPlaceholder(/what needs to be done/i);
  const addButton = page.getByRole('button', { name: /add todo/i });

  for (let i = 1; i <= 5; i++) {
    await input.fill(`任務 ${i}`);
    await addButton.click();
  }

  // 2. 完成其中 2 個
  await page.getByRole('checkbox', { name: /mark "任務 1" as complete/i }).check();
  await page.getByRole('checkbox', { name: /mark "任務 2" as complete/i }).check();

  // 3. 驗證統計
  const stats = page.getByLabelText(/todo statistics/i);
  await expect(stats).toContainText('5'); // Total
  await expect(stats).toContainText('3'); // Active
  await expect(stats).toContainText('2'); // Completed
});
```

## 🚀 CI/CD 整合 (未來階段)

E2E 測試可整合至 GitHub Actions:

```yaml
# .github/workflows/e2e.yml
- name: Run E2E tests
  run: npm run test:e2e
  working-directory: ./frontend
```

## 📚 進階主題

### Page Object Model (POM)

將頁面元素和操作封裝成類別:

```typescript
// pages/TodoPage.ts
export class TodoPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async addTodo(title: string) {
    await this.page.getByPlaceholder(/what needs to be done/i).fill(title);
    await this.page.getByRole('button', { name: /add todo/i }).click();
  }

  async getTodoCount() {
    return await this.page.getByTestId('todo-item').count();
  }
}
```

### Visual Regression Testing

使用截圖比對偵測 UI 變化:

```typescript
test('UI should match snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## 🎓 學習資源

- [Playwright 官方文件](https://playwright.dev)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [最佳實踐](https://playwright.dev/docs/best-practices)

---

**下一步**: 執行 `npm run test:e2e` 開始測試! 🚀
