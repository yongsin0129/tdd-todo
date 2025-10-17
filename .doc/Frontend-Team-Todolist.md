# Frontend Team Todolist
# TodoList 應用程式前端團隊任務清單

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | TodoList 應用程式前端團隊任務清單 (Frontend Team Todolist) |
| 版本號 | 1.0.0 |
| 撰寫日期 | 2025-10-17 |
| 最後更新 | 2025-10-17 |
| 撰寫人 | Frontend Team Lead |
| 相關文件 | implementation-plan-frontend.md, SDD.md, PRD.md |

## 變更歷史記錄

| 版本 | 日期 | 變更內容 | 變更人 |
|------|------|---------|--------|
| 1.0.0 | 2025-10-17 | 初始版本建立，定義前端開發任務 | Frontend Team |

---

## 目錄

1. [專案進度總覽](#1-專案進度總覽)
2. [Phase 1: 專案設置](#2-phase-1-專案設置)
3. [Phase 2: 核心組件開發](#3-phase-2-核心組件開發)
4. [Phase 3: UI/UX 完善](#4-phase-3-uiux-完善)
5. [Phase 4: 測試與優化](#5-phase-4-測試與優化)
6. [Phase 5: 整合與部署](#6-phase-5-整合與部署)
7. [Phase 6: 功能擴展](#7-phase-6-功能擴展-未來規劃)
8. [團隊資源與責任分配](#8-團隊資源與責任分配)
9. [設計規範與最佳實踐](#9-設計規範與最佳實踐)

---

## 1. 專案進度總覽

### 1.1 整體進度

**專案狀態**: 🟡 待開始 - 等待後端 API 完成

| Phase | 階段名稱 | 任務數 | 已完成 | 進行中 | 待辦 | 完成率 |
|-------|---------|-------|--------|--------|------|--------|
| **Phase 1** | 專案設置 | 5 | 0 | 0 | 5 | 0% ⏳ |
| **Phase 2** | 核心組件開發 | 9 | 0 | 0 | 9 | 0% ⏳ |
| **Phase 3** | UI/UX 完善 | 6 | 0 | 0 | 6 | 0% ⏳ |
| **Phase 4** | 測試與優化 | 4 | 0 | 0 | 4 | 0% ⏳ |
| **Phase 5** | 整合與部署 | 3 | 0 | 0 | 3 | 0% ⏳ |
| **總計 (MVP)** | - | **27** | **0** | **0** | **27** | **0%** |

### 1.2 關鍵里程碑

| 里程碑 | 目標日期 | 依賴條件 | 狀態 |
|--------|---------|---------|------|
| M1: 專案設置完成 | 2025-10-18 | 無 | ⏳ 待開始 |
| M2: 核心組件完成 | 2025-10-24 | M1 完成 | ⏳ 待開始 |
| M3: UI/UX 完成 | 2025-10-27 | M2 完成 | ⏳ 待開始 |
| M4: 測試通過 | 2025-10-30 | M3 完成 | ⏳ 待開始 |
| M5: MVP 上線 | 2025-11-06 | M4 + 後端完成 | ⏳ 待開始 |

### 1.3 效能目標

| 指標名稱 | 目標值 | 測量工具 | 當前值 | 狀態 |
|---------|-------|---------|--------|------|
| First Contentful Paint | < 1.0s | Lighthouse | - | ⏳ 待測 |
| Largest Contentful Paint | < 1.5s | Lighthouse | - | ⏳ 待測 |
| Time to Interactive | < 2.0s | Lighthouse | - | ⏳ 待測 |
| Bundle Size (gzipped) | < 150KB | Vite build | - | ⏳ 待測 |
| Lighthouse Performance | > 90 | Chrome DevTools | - | ⏳ 待測 |
| 測試覆蓋率 | > 80% | Vitest Coverage | - | ⏳ 待測 |

### 1.4 技術堆疊

| 技術 | 版本 | 選擇理由 | 狀態 |
|------|------|---------|------|
| **React** | 18.3.1 | 業界標準，生態豐富 | ✅ 確定 |
| **TypeScript** | 5.5+ | 型別安全，減少錯誤 | ✅ 確定 |
| **Vite** | 5.4+ | 快速建置，HMR 優秀 | ✅ 確定 |
| **Zustand** | 4.5+ | 輕量狀態管理 (1.2KB) | ✅ 確定 |
| **Tailwind CSS** | 3.4+ | Utility-first, 小 bundle | ✅ 確定 |
| **Vitest** | 2.0+ | 與 Vite 整合，快速 | ✅ 確定 |
| **React Testing Library** | 16.0+ | 測試使用者行為 | ✅ 確定 |
| **Playwright** | 最新 | E2E 測試 (Phase 4) | ⏳ 待安裝 |

---

## 2. Phase 1: 專案設置

**預估時間**: 1-2 天 (8-16 小時)
**預計開始**: 2025-10-18
**預計完成**: 2025-10-19
**狀態**: ⏳ 待開始

### 2.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 依賴 | 狀態 |
|----|---------|--------|---------|--------|------|------|
| **1.1** | 初始化 React + Vite 專案 | Frontend Lead | 2h | P0 | 無 | ⏳ 待辦 |
| **1.2** | 配置 TypeScript 嚴格模式 | Frontend Lead | 1h | P0 | 1.1 | ⏳ 待辦 |
| **1.3** | 設置 Tailwind CSS | Frontend Dev | 2h | P0 | 1.1 | ⏳ 待辦 |
| **1.4** | 配置 Vitest + RTL 測試框架 | Frontend Dev | 3h | P0 | 1.1 | ⏳ 待辦 |
| **1.5** | 設置專案結構與路徑別名 | Frontend Lead | 2h | P1 | 1.1 | ⏳ 待辦 |

**總工作量**: 10 小時 (約 1.5 天)

### 2.2 詳細任務說明

#### Task 1.1: 初始化 React + Vite 專案

**執行步驟**:
```bash
# 1. 建立專案
npm create vite@latest frontend -- --template react-ts

# 2. 進入目錄
cd frontend

# 3. 安裝依賴
npm install

# 4. 啟動開發伺服器
npm run dev
```

**驗收標準**:
- [x] 專案成功建立
- [ ] 執行 `npm run dev` 可啟動開發伺服器
- [ ] 瀏覽器訪問 http://localhost:5173 顯示預設頁面

#### Task 1.2: 配置 TypeScript 嚴格模式

**修改 `tsconfig.json`**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@store/*": ["./src/store/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

**驗收標準**:
- [ ] TypeScript 嚴格模式啟用
- [ ] 路徑別名設定正確
- [ ] 無編譯錯誤

#### Task 1.3: 設置 Tailwind CSS

**安裝與配置**:
```bash
# 安裝 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npx tailwindcss init -p
```

**`tailwind.config.js`**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

**`src/index.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
}
```

**驗收標準**:
- [ ] Tailwind CSS 正常運作
- [ ] @tailwindcss/forms 插件可用
- [ ] 自訂主題色正確

#### Task 1.4: 配置 Vitest + RTL 測試框架

**安裝依賴**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

**`vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

**`src/test/setup.ts`**:
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

**驗收標準**:
- [ ] 執行 `npm run test` 可運行測試
- [ ] 測試覆蓋率報告正常生成
- [ ] 測試環境設定正確

#### Task 1.5: 設置專案結構與路徑別名

**建立目錄結構**:
```bash
mkdir -p src/components/{todo,ui,layout}
mkdir -p src/{store,hooks,types,utils,test}
```

**最終結構**:
```
src/
├── components/
│   ├── todo/
│   │   ├── TodoList.tsx
│   │   ├── TodoList.test.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoItem.test.tsx
│   │   ├── TodoForm.tsx
│   │   ├── TodoForm.test.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   └── layout/
│       ├── AppLayout.tsx
│       └── Header.tsx
├── store/
│   ├── todoStore.ts
│   └── todoStore.test.ts
├── hooks/
│   ├── useTodos.ts
│   └── useKeyboardShortcuts.ts
├── types/
│   ├── todo.ts
│   └── index.ts
├── utils/
│   ├── validation.ts
│   └── validation.test.ts
├── test/
│   ├── setup.ts
│   └── test-utils.tsx
├── App.tsx
├── App.test.tsx
├── main.tsx
└── index.css
```

**驗收標準**:
- [ ] 目錄結構正確建立
- [ ] 路徑別名可正常使用 (`@/...`)

### 2.3 交付成果

- [ ] 完整的 React + TypeScript + Vite 專案
- [ ] Tailwind CSS 樣式系統
- [ ] Vitest + RTL 測試框架
- [ ] 清晰的專案結構
- [ ] ESLint + Prettier 配置

---

## 3. Phase 2: 核心組件開發

**預估時間**: 6-8 天 (48-64 小時)
**預計開始**: 2025-10-20
**預計完成**: 2025-10-27
**狀態**: ⏳ 待開始

### 3.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | TDD | 優先級 | 依賴 | 狀態 |
|----|---------|--------|---------|-----|--------|------|------|
| **2.1** | 定義 TypeScript 型別 | Frontend Lead | 2h | - | P0 | 1.5 | ⏳ 待辦 |
| **2.2** | 實作 Zustand Store | Frontend Lead | 4h | ✅ | P0 | 2.1 | ⏳ 待辦 |
| **2.3** | 實作 TodoForm 組件 | Frontend Dev 1 | 8h | ✅ | P0 | 2.2 | ⏳ 待辦 |
| **2.4** | 實作 TodoItem 組件 | Frontend Dev 2 | 8h | ✅ | P0 | 2.2 | ⏳ 待辦 |
| **2.5** | 實作 TodoList 組件 | Frontend Dev 1 | 8h | ✅ | P0 | 2.3, 2.4 | ⏳ 待辦 |
| **2.6** | 整合後端 API | Frontend Lead | 6h | ✅ | P0 | 2.5 | ⏳ 待辦 |
| **2.7** | 實作本地儲存 (localStorage) | Frontend Dev 2 | 4h | ✅ | P1 | 2.2 | ⏳ 待辦 |
| **2.8** | 實作錯誤處理與載入狀態 | Frontend Dev 1 | 4h | ✅ | P0 | 2.6 | ⏳ 待辦 |
| **2.9** | 實作可重用 UI 組件 | Frontend Dev 2 | 4h | ✅ | P1 | 無 | ⏳ 待辦 |

**總工作量**: 48 小時 (約 6 天)

### 3.2 詳細任務說明

#### Task 2.1: 定義 TypeScript 型別

**`src/types/todo.ts`**:
```typescript
export interface Todo {
  id: string;           // UUID
  title: string;        // 1-255 字元
  description?: string; // 選填
  isCompleted: boolean;
  createdAt: Date;      // ISO 8601
  updatedAt: Date;      // ISO 8601
  completedAt?: Date;   // 選填
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**驗收標準**:
- [ ] 型別定義與後端 API 一致
- [ ] 無 TypeScript 錯誤

#### Task 2.2: 實作 Zustand Store

**`src/store/todoStore.ts`**:
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Todo } from '@types/todo';

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
  error: string | null;

  // Actions
  setTodos: (todos: Todo[]) => void;
  addTodo: (title: string, description?: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoState['filter']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Selectors
  getFilteredTodos: () => Todo[];
  getStats: () => { total: number; active: number; completed: number };
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      immer((set, get) => ({
        todos: [],
        filter: 'all',
        loading: false,
        error: null,

        setTodos: (todos) => set({ todos }),

        addTodo: (title, description) => set((state) => {
          state.todos.unshift({
            id: crypto.randomUUID(),
            title: title.trim(),
            description: description?.trim(),
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),

        toggleTodo: (id) => set((state) => {
          const todo = state.todos.find(t => t.id === id);
          if (todo) {
            todo.isCompleted = !todo.isCompleted;
            todo.completedAt = todo.isCompleted ? new Date() : undefined;
            todo.updatedAt = new Date();
          }
        }),

        updateTodo: (id, updates) => set((state) => {
          const todo = state.todos.find(t => t.id === id);
          if (todo) {
            Object.assign(todo, updates, { updatedAt: new Date() });
          }
        }),

        deleteTodo: (id) => set((state) => {
          state.todos = state.todos.filter(t => t.id !== id);
        }),

        setFilter: (filter) => set({ filter }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        getFilteredTodos: () => {
          const { todos, filter } = get();
          if (filter === 'active') return todos.filter(t => !t.isCompleted);
          if (filter === 'completed') return todos.filter(t => t.isCompleted);
          return todos;
        },

        getStats: () => {
          const todos = get().todos;
          return {
            total: todos.length,
            active: todos.filter(t => !t.isCompleted).length,
            completed: todos.filter(t => t.isCompleted).length,
          };
        },
      })),
      {
        name: 'todo-storage',
        version: 1,
      }
    ),
    { name: 'TodoStore' }
  )
);
```

**測試 (`src/store/todoStore.test.ts`)**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from './todoStore';

describe('TodoStore', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [] });
  });

  it('should add a todo', () => {
    const { addTodo } = useTodoStore.getState();

    addTodo('Test Todo');

    const todos = useTodoStore.getState().todos;
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Test Todo');
  });

  it('should toggle todo completion', () => {
    const { addTodo, toggleTodo } = useTodoStore.getState();

    addTodo('Test Todo');
    const todoId = useTodoStore.getState().todos[0].id;

    toggleTodo(todoId);

    const todo = useTodoStore.getState().todos[0];
    expect(todo.isCompleted).toBe(true);
    expect(todo.completedAt).toBeInstanceOf(Date);
  });

  // ... 更多測試
});
```

**驗收標準**:
- [ ] Store 測試覆蓋率 > 80%
- [ ] 所有 CRUD 操作正常
- [ ] 本地儲存持久化正常

#### Task 2.3: 實作 TodoForm 組件

**測試優先 (TDD)**:
```typescript
// src/components/todo/TodoForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TodoForm } from './TodoForm';

describe('TodoForm', () => {
  it('應該渲染表單', () => {
    render(<TodoForm />);
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
  });

  it('應該驗證空標題', () => {
    render(<TodoForm />);
    const button = screen.getByRole('button', { name: /add todo/i });

    fireEvent.click(button);

    expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument();
  });

  it('應該成功新增 todo', () => {
    render(<TodoForm />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const button = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);

    expect(input).toHaveValue('');
  });
});
```

**實作 (`src/components/todo/TodoForm.tsx`)**:
```typescript
import { useState } from 'react';
import { useTodoStore } from '@store/todoStore';

export function TodoForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    if (title.length > 255) {
      setError('Title must be less than 255 characters');
      return;
    }

    addTodo(title);
    setTitle('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={255}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Todo
      </button>
    </form>
  );
}
```

**驗收標準**:
- [ ] 組件測試覆蓋率 > 80%
- [ ] 輸入驗證正確
- [ ] 提交後表單清空
- [ ] 無障礙屬性完整

#### Task 2.4: 實作 TodoItem 組件

**測試 + 實作** (參照 implementation-plan-frontend.md 的詳細範例)

**驗收標準**:
- [ ] 組件測試覆蓋率 > 80%
- [ ] 顯示/編輯模式切換
- [ ] 鍵盤操作 (Enter, Escape)
- [ ] 無障礙屬性完整

#### Task 2.5: 實作 TodoList 組件

**測試 + 實作** (參照 implementation-plan-frontend.md 的詳細範例)

**驗收標準**:
- [ ] 組件測試覆蓋率 > 80%
- [ ] 正確整合 TodoForm 和 TodoItem
- [ ] 空狀態正確顯示
- [ ] Active/Completed 分組顯示

#### Task 2.6: 整合後端 API

**`src/hooks/useTodos.ts`**:
```typescript
import { useEffect } from 'react';
import { useTodoStore } from '@store/todoStore';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@types/todo';

const API_BASE = '/api';

export function useTodos() {
  const { setTodos, setLoading, setError } = useTodoStore();

  // 獲取所有待辦事項
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/todos`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      setTodos(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 新增待辦事項
  const createTodo = async (input: CreateTodoInput) => {
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      return data.data as Todo;
    } catch (err) {
      throw err;
    }
  };

  // ... 其他 API 方法 (updateTodo, deleteTodo)

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    createTodo,
    // ... 其他方法
  };
}
```

**驗收標準**:
- [ ] 所有 API 呼叫正常
- [ ] 錯誤處理正確
- [ ] 載入狀態正確

---

## 4. Phase 3: UI/UX 完善

**預估時間**: 3-4 天 (24-32 小時)
**預計開始**: 2025-10-24
**預計完成**: 2025-10-27
**狀態**: ⏳ 待開始

### 4.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 依賴 | 狀態 |
|----|---------|--------|---------|--------|------|------|
| **3.1** | 響應式設計 (RWD) | Frontend Dev 1 | 6h | P0 | 2.5 | ⏳ 待辦 |
| **3.2** | 無障礙設計 (a11y) | Frontend Dev 2 | 6h | P0 | 2.5 | ⏳ 待辦 |
| **3.3** | 動畫與過渡效果 | Frontend Dev 1 | 4h | P1 | 2.5 | ⏳ 待辦 |
| **3.4** | 鍵盤快捷鍵 | Frontend Dev 2 | 4h | P1 | 2.5 | ⏳ 待辦 |
| **3.5** | 空狀態與錯誤狀態 | Frontend Dev 1 | 3h | P0 | 2.8 | ⏳ 待辦 |
| **3.6** | UI 打磨與細節優化 | Frontend Lead | 4h | P1 | 全部 | ⏳ 待辦 |

**總工作量**: 27 小時 (約 3.5 天)

### 4.2 詳細任務說明

#### Task 3.1: 響應式設計 (RWD)

**斷點設計**:
```css
/* Tailwind CSS 預設斷點 */
sm: 640px   /* 手機 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大桌面 */
```

**響應式 TodoList**:
```tsx
<div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
    My Todos
  </h1>
  {/* ... */}
</div>
```

**驗收標準**:
- [ ] 手機版 (< 640px) 正常顯示
- [ ] 平板版 (640-1024px) 正常顯示
- [ ] 桌面版 (> 1024px) 正常顯示
- [ ] 無水平滾動條

#### Task 3.2: 無障礙設計 (a11y)

**WCAG 2.1 AA 檢查清單**:
- [ ] 所有互動元素可鍵盤操作
- [ ] ARIA 標籤完整
- [ ] 顏色對比度 ≥ 4.5:1
- [ ] 焦點指示器清晰可見
- [ ] 螢幕閱讀器相容

**實作範例**:
```tsx
<input
  type="checkbox"
  checked={todo.isCompleted}
  onChange={() => toggleTodo(todo.id)}
  aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
/>
```

**驗收標準**:
- [ ] 通過 WAVE 工具檢測
- [ ] 通過 axe DevTools 檢測
- [ ] 鍵盤可完整操作

#### Task 3.3: 動畫與過渡效果

**Tailwind 動畫配置**:
```javascript
// tailwind.config.js
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.2s ease-in',
      'slide-up': 'slideUp 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
  },
}
```

**驗收標準**:
- [ ] 新增 Todo 有淡入動畫
- [ ] 刪除 Todo 有淡出動畫
- [ ] 過渡效果流暢 (60fps)

---

## 5. Phase 4: 測試與優化

**預估時間**: 2-3 天 (16-24 小時)
**預計開始**: 2025-10-28
**預計完成**: 2025-10-30
**狀態**: ⏳ 待開始

### 5.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 狀態 |
|----|---------|--------|---------|--------|------|
| **4.1** | 驗證測試覆蓋率 (> 80%) | QA + Frontend | 4h | P0 | ⏳ 待辦 |
| **4.2** | 效能優化 (Lighthouse > 90) | Frontend Lead | 6h | P0 | ⏳ 待辦 |
| **4.3** | 跨瀏覽器測試 | QA | 4h | P0 | ⏳ 待辦 |
| **4.4** | Bug 修復與打磨 | Full Team | 8h | P0 | ⏳ 待辦 |

**總工作量**: 22 小時 (約 3 天)

---

## 6. Phase 5: 整合與部署

**預估時間**: 1-2 天 (8-16 小時)
**預計開始**: 2025-11-04
**預計完成**: 2025-11-06
**狀態**: ⏳ 待開始

### 6.1 任務清單

| ID | 任務名稱 | 負責人 | 預估時間 | 優先級 | 狀態 |
|----|---------|--------|---------|--------|------|
| **5.1** | 建立生產環境建置配置 | Frontend Lead | 2h | P0 | ⏳ 待辦 |
| **5.2** | 部署至 Vercel | DevOps | 2h | P0 | ⏳ 待辦 |
| **5.3** | 生產環境測試與驗證 | Full Team | 4h | P0 | ⏳ 待辦 |

---

## 7. Phase 6: 功能擴展 (未來規劃)

### 7.1 優先級排序

| 功能 | 優先級 | 預估時間 | 商業價值 | 規劃時間 |
|------|--------|---------|---------|---------|
| **暗黑模式** | P0 | 2 天 | 高 | Week 6 |
| **待辦事項分類/標籤 UI** | P0 | 3 天 | 高 | Week 8 |
| **搜尋與篩選 UI** | P1 | 2 天 | 中 | Week 9 |
| **拖放排序** | P1 | 3 天 | 中 | Week 10 |
| **統計圖表** | P2 | 1 週 | 中 | Week 11 |
| **PWA 支援** | P1 | 2 天 | 中 | Week 12 |

---

## 8. 團隊資源與責任分配

### 8.1 團隊成員

| 姓名 | 角色 | 主要職責 |
|------|------|---------|
| **成員 A** | Frontend Lead | 架構設計、程式碼審查、Store 實作 |
| **成員 B** | Frontend Dev 1 | TodoForm, TodoList, RWD |
| **成員 C** | Frontend Dev 2 | TodoItem, UI 組件, a11y |
| **成員 D** | UI/UX Designer | 設計稿、原型、視覺規範 |

---

## 9. 設計規範與最佳實踐

### 9.1 Tailwind CSS 設計系統

**色彩規範**:
```css
/* 主色 */
Primary: #3B82F6 (blue-500)
Primary Hover: #2563EB (blue-600)

/* 成功/完成 */
Success: #10B981 (green-500)

/* 錯誤/警告 */
Error: #EF4444 (red-500)

/* 文字 */
Text Primary: #1F2937 (gray-900)
Text Secondary: #6B7280 (gray-500)
Text Disabled: #9CA3AF (gray-400)

/* 背景 */
Background: #F9FAFB (gray-50)
Surface: #FFFFFF (white)
```

**間距規範**:
```css
xs: 0.5rem (8px)
sm: 0.75rem (12px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
```

### 9.2 無障礙最佳實踐

**顏色對比度檢查**:
- 正常文字 (< 18pt): 最低 4.5:1
- 大字體 (≥ 18pt): 最低 3:1
- UI 組件: 最低 3:1

**ARIA 標籤規範**:
```tsx
// ✅ 好的範例
<button
  onClick={handleDelete}
  aria-label={`Delete "${todo.title}"`}
>
  Delete
</button>

// ❌ 不好的範例
<button onClick={handleDelete}>
  <TrashIcon />
</button>
```

---

## 文件維護

**維護責任**: Frontend Team Lead
**更新頻率**: 每週更新進度
**版本控制**: 使用 Git 追蹤變更

**最後更新**: 2025-10-17
**下一次審查**: 2025-10-24

---

**文件結束**
