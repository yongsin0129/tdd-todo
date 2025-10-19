import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 測試配置
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* 測試超時時間設定為 60 秒 */
  timeout: 60000,

  /* 平行執行測試 - 禁用以避免共享數據庫時的測試干擾 */
  fullyParallel: false,

  /* 在 CI 環境失敗重試 */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  /* 平行 worker 數量 */
  workers: process.env.CI ? 1 : undefined,

  /* 測試報告 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  /* 全局設定 */
  use: {
    /* 基礎 URL */
    baseURL: 'http://localhost:5173',

    /* 截圖設定 */
    screenshot: 'only-on-failure',

    /* 錄影設定 */
    video: 'retain-on-failure',

    /* Trace 設定 (失敗時保留) */
    trace: 'on-first-retry',
  },

  /* 不同瀏覽器的測試配置 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 行動裝置測試 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /*
   * Note: Web server auto-start is disabled.
   * You need to manually start frontend and backend servers before running E2E tests:
   *
   * Terminal 1 (Backend):
   *   cd backend && npm run dev
   *
   * Terminal 2 (Frontend):
   *   cd frontend && npm run dev
   *
   * Terminal 3 (E2E Tests):
   *   cd frontend && npm run test:e2e
   */
});
