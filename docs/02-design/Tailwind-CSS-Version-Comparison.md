# Tailwind CSS 版本比較文件
# Tailwind CSS v3 vs v4 Version Comparison

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | Tailwind CSS 版本比較文件 (v3 vs v4) |
| 版本號 | 1.0.0 |
| 撰寫日期 | 2025-10-17 |
| 最後更新 | 2025-10-17 |
| 撰寫人 | Frontend Team |
| 目的 | 協助團隊選擇適合的 Tailwind CSS 版本 |

---

## 目錄

1. [執行摘要](#1-執行摘要)
2. [版本選擇建議](#2-版本選擇建議)
3. [主要差異對照表](#3-主要差異對照表)
4. [安裝與設定差異](#4-安裝與設定差異)
5. [破壞性變更清單](#5-破壞性變更清單)
6. [遷移指南](#6-遷移指南)
7. [參考資源](#7-參考資源)

---

## 1. 執行摘要

### 1.1 版本概況

| 項目 | Tailwind CSS v3 | Tailwind CSS v4 |
|------|----------------|----------------|
| **發布狀態** | ✅ 穩定版 (Stable) | ⚠️ Beta/最新版 |
| **生產就緒** | ✅ 是 | ⚠️ 需評估 |
| **文件完整度** | ✅ 完整 | ⚠️ 持續更新中 |
| **社群支援** | ✅ 成熟 | 🆕 逐漸增加 |
| **生態系兼容** | ✅ 廣泛支援 | ⚠️ 部分工具需更新 |

### 1.2 核心變更概述

**Tailwind CSS v4 主要改進**:
- 🚀 **效能提升**: 更快的建置速度
- 🎨 **原生 CSS**: 使用標準 `@import` 取代 `@tailwind` 指令
- 🔧 **簡化配置**: 使用 CSS 變數取代 JS 配置
- 📦 **模組化**: 更好的 Vite 整合 (`@tailwindcss/vite`)
- ⚡ **現代化**: 需要 Node.js 20+

---

## 2. 版本選擇建議

### 2.1 建議使用 Tailwind CSS v3 的情境

✅ **強烈推薦使用 v3 如果**:

1. **MVP 快速開發**: 專案需要快速上線,穩定性優先
2. **團隊經驗**: 團隊已熟悉 v3,不想學習新語法
3. **生態系兼容**: 需要使用大量第三方插件 (可能尚未支援 v4)
4. **文件完整**: 需要完整的官方文件和社群資源
5. **生產環境**: 專案即將部署,不想冒險

**本專案建議**: ✅ **使用 Tailwind CSS v3.4+**

**理由**:
- MVP 階段,穩定性優先
- v4 仍在 Beta,可能有未知問題
- 團隊可專注於功能開發,而非版本遷移
- 未來可輕鬆升級 (v3 → v4 有官方遷移工具)

### 2.2 可考慮使用 Tailwind CSS v4 的情境

⚠️ **可嘗試 v4 如果**:

1. **新專案且願意承擔風險**: 全新專案,可接受潛在問題
2. **追求最新特性**: 想使用最新的 CSS 特性和語法
3. **效能要求極高**: 需要最快的建置速度
4. **純 Vite 專案**: 使用 Vite 並想用 `@tailwindcss/vite` 插件
5. **學習目的**: 探索新技術,為未來做準備

---

## 3. 主要差異對照表

### 3.1 安裝與依賴

| 項目 | Tailwind CSS v3 | Tailwind CSS v4 |
|------|----------------|----------------|
| **Node.js 版本** | Node.js 12+ | **Node.js 20+** ⚠️ |
| **安裝命令** | `npm install -D tailwindcss@3 postcss autoprefixer` | `npm install -D tailwindcss@next` |
| **PostCSS 配置** | 需要 `postcss.config.js` | `@tailwindcss/postcss` (可選) |
| **Vite 整合** | 透過 PostCSS | **`@tailwindcss/vite` 插件** 🆕 |

### 3.2 配置檔案

| 項目 | Tailwind CSS v3 | Tailwind CSS v4 |
|------|----------------|----------------|
| **配置方式** | `tailwind.config.js` (JavaScript) | **CSS 變數** (`@theme`) 🆕 |
| **初始化命令** | `npx tailwindcss init` | 不需要 (或使用遷移工具) |
| **主題定義** | JS 物件 | **CSS 變數** |
| **插件系統** | JavaScript | **保持 JS** (未變) |

**v3 配置範例**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#3b82f6',
      },
    },
  },
  plugins: [],
}
```

**v4 配置範例**:
```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-brand-blue: #3b82f6;
  --font-display: "Satoshi", sans-serif;
}
```

### 3.3 CSS 指令

| 項目 | Tailwind CSS v3 | Tailwind CSS v4 |
|------|----------------|----------------|
| **導入方式** | `@tailwind base;`<br>`@tailwind components;`<br>`@tailwind utilities;` | **`@import "tailwindcss";`** 🆕 |
| **自訂 Utilities** | `@layer utilities { ... }` | **`@utility { ... }`** 🆕 |
| **自訂 Components** | `@layer components { ... }` | **`@utility { ... }`** (改用 utility) |

### 3.4 Utility Class 變更

| 功能 | Tailwind CSS v3 | Tailwind CSS v4 | 破壞性 |
|------|----------------|----------------|--------|
| **Ring 預設寬度** | `ring` = 3px | **`ring` = 1px** (需用 `ring-3`) | ⚠️ 是 |
| **Ring 預設顏色** | `blue-500` | **`currentColor`** | ⚠️ 是 |
| **Shadow 縮寫** | `shadow-sm` | **`shadow-xs`** | ⚠️ 是 |
| **Outline 預設** | `outline-none` | **`outline-hidden`** (新增 `outline-none`) | ⚠️ 是 |
| **Border 預設顏色** | `gray-200` | **`currentColor`** (需明確指定) | ⚠️ 是 |
| **Gradient 覆蓋** | 會重置其他值 | **保留其他值** | ✅ 改進 |
| **Arbitrary 變數** | `bg-[--var]` | **`bg-(--var)`** (改用圓括號) | ⚠️ 是 |

### 3.5 效能與建置

| 項目 | Tailwind CSS v3 | Tailwind CSS v4 |
|------|----------------|----------------|
| **建置速度** | 快 | **更快** ⚡ |
| **CSS 輸出大小** | 小 | **更小** 📦 |
| **HMR (熱更新)** | 支援 | **更快** |
| **Vite 整合** | 透過 PostCSS | **專用插件** (`@tailwindcss/vite`) |

---

## 4. 安裝與設定差異

### 4.1 Tailwind CSS v3 安裝 (推薦)

#### 步驟 1: 安裝依賴

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

#### 步驟 2: 配置 `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 步驟 3: 配置 `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 步驟 4: 新增 CSS 指令 (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 步驟 5: 在 Vite 中使用

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

### 4.2 Tailwind CSS v4 安裝 (實驗性)

#### 步驟 1: 安裝依賴

```bash
npm install -D tailwindcss@next @tailwindcss/vite
```

**注意**: 需要 Node.js 20+

#### 步驟 2: 配置 Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 新增 Tailwind v4 插件
  ],
})
```

#### 步驟 3: 更新 CSS (`src/index.css`)

```css
@import "tailwindcss";

/* 使用 @theme 定義自訂主題 */
@theme {
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
}
```

#### 步驟 4: 不需要 `tailwind.config.js`

v4 推薦使用 CSS 變數,但仍支援 JS 配置 (需用 `@config` 指令):

```css
@config "./tailwind.config.js";
@import "tailwindcss";
```

---

## 5. 破壞性變更清單

### 5.1 必須修改的項目

| 變更項目 | v3 語法 | v4 語法 | 影響範圍 |
|---------|--------|--------|---------|
| **CSS 指令** | `@tailwind base;` | `@import "tailwindcss";` | 所有 CSS 檔案 |
| **Ring 寬度** | `ring` (3px) | `ring-3` | 所有使用 ring 的地方 |
| **Ring 顏色** | `ring` (blue-500) | `ring-3 ring-blue-500` | 需明確指定顏色 |
| **Shadow 縮寫** | `shadow-sm` | `shadow-xs` | 所有 shadow-sm 使用 |
| **Outline 移除** | `outline-none` | `outline-hidden` | Focus 狀態處理 |
| **Border 顏色** | `border` (gray-200) | `border border-gray-200` | 需明確指定顏色 |
| **Arbitrary 變數** | `bg-[--color]` | `bg-(--color)` | CSS 變數使用 |
| **自訂 Utilities** | `@layer utilities` | `@utility` | 自訂樣式 |

### 5.2 可能影響的項目

| 變更項目 | 說明 | 建議處理方式 |
|---------|------|-------------|
| **Placeholder 顏色** | 不再預設 `gray-400` | 使用 `@layer base` 恢復 |
| **Button Cursor** | 改為 `cursor: default` | 使用 `@layer base` 恢復 `pointer` |
| **Dialog Margin** | 不再有 `margin: auto` | 使用 `@layer base` 恢復 |
| **Hover 在觸控裝置** | 不會觸發 | 需評估 UX 影響 |
| **Variant 堆疊順序** | 從右到左 | **從左到右** (反轉) |

---

## 6. 遷移指南

### 6.1 從 v3 遷移到 v4 (未來參考)

Tailwind 提供官方自動遷移工具:

```bash
npx @tailwindcss/upgrade
```

**功能**:
- 自動更新依賴版本
- 轉換配置檔案
- 更新 CSS 指令
- 掃描並修正模板檔案中的 class

### 6.2 手動遷移步驟 (參考)

#### 1. 更新依賴

```bash
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss@next @tailwindcss/vite
```

#### 2. 更新 CSS 檔案

```css
/* 舊 (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 新 (v4) */
@import "tailwindcss";
```

#### 3. 更新 Vite 配置

```typescript
// 新增
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 新增
  ],
})
```

#### 4. 轉換主題配置

```javascript
// v3: tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': '#3b82f6',
      },
    },
  },
}
```

```css
/* v4: app.css */
@theme {
  --color-brand: #3b82f6;
}
```

#### 5. 更新 HTML/JSX Class Names

使用自動化工具或手動替換:

```jsx
// v3
<button className="ring focus:ring-blue-500">

// v4
<button className="ring-3 ring-blue-500 focus:ring-3 focus:ring-blue-500">
```

---

## 7. 參考資源

### 7.1 官方文件

- **Tailwind CSS v3 官方文件**: https://v3.tailwindcss.com/
- **Tailwind CSS v4 官方文件**: https://tailwindcss.com/
- **升級指南**: https://tailwindcss.com/docs/upgrade-guide
- **v4 變更日誌**: https://github.com/tailwindlabs/tailwindcss/releases

### 7.2 社群資源

- **Tailwind Discord**: https://tailwindcss.com/discord
- **GitHub Discussions**: https://github.com/tailwindlabs/tailwindcss/discussions
- **Stack Overflow**: `[tailwindcss]` tag

### 7.3 遷移工具

- **官方升級工具**: `npx @tailwindcss/upgrade`
- **配置轉換器**: https://tailwindcss.com/docs/upgrade-guide

---

## 8. 結論與建議

### 8.1 本專案決策

**✅ 決定: 使用 Tailwind CSS v4 (最新版)**

**理由**:
1. ✅ **最新特性**: 使用最新的 CSS 語法和功能
2. ✅ **效能提升**: v4 提供更快的建置速度
3. ✅ **現代化架構**: 原生 CSS 整合,使用 `@import` 和 `@theme`
4. ✅ **Vite 整合**: 專用的 `@tailwindcss/vite` 插件
5. ✅ **學習新技術**: 團隊願意學習最新版本,為未來做準備

**注意事項**:
- ⚠️ 需要 Node.js 20+
- ⚠️ 部分語法與 v3 不同 (已在文件中詳細說明)
- ⚠️ 需要團隊學習新的配置方式 (CSS 變數而非 JS 配置)

### 8.2 未來規劃

**持續關注 v4 發展**:
- ✅ 已採用 v4,持續關注更新
- ✅ 如遇重大問題,可考慮降級至 v3 (有完整遷移文件)
- ✅ 定期檢查官方更新和最佳實踐

---

## 文件維護

**維護責任**: Frontend Team Lead
**更新頻率**: 每當 Tailwind 發布重要版本時更新
**版本控制**: 使用 Git 追蹤變更

**最後更新**: 2025-10-17
**下一次審查**: v4 正式版發布時

---

**文件結束**
