# TodoList 前端實作計畫

> 基於開發指南和前端架構專家分析的詳細實作計畫

## 目錄

1. [技術棧決策](#技術棧決策)
2. [專案結構](#專案結構)
3. [組件架構設計](#組件架構設計)
4. [狀態管理實作](#狀態管理實作)
5. [樣式系統](#樣式系統)
6. [效能優化策略](#效能優化策略)
7. [測試策略](#測試策略)
8. [無障礙設計](#無障礙設計)
9. [實作步驟](#實作步驟)
10. [成功指標](#成功指標)

---

## 技術棧決策

### 核心技術選擇

| 技術領域 | 選擇方案 | 替代方案 | 選擇理由 |
|---------|---------|---------|---------|
| **狀態管理** | ✅ **Zustand** | Redux Toolkit | • 程式碼減少 50%<br>• Bundle size 小 (~1.2KB vs ~12KB)<br>• 無需 Provider 包裝<br>• TypeScript 支援優秀 |
| **UI 框架** | ✅ **Tailwind CSS** | Material-UI | • 可搖樹優化的 CSS<br>• 無 JS runtime overhead<br>• 完全客製化控制<br>• 有助達成 <2s 載入目標 |
| **建置工具** | Vite | Create React App | • 更快的 HMR<br>• 更小的 bundle<br>• 原生 ES modules 支援 |
| **測試框架** | Vitest + RTL | Jest + RTL | • 與 Vite 完美整合<br>• 更快的測試執行<br>• 相同的 Jest API |

### 依賴套件清單

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0"
  }
}
```

---

## 專案結構

### 完整目錄結構

```
/mnt/d/TDD-test-todolist
├── /src
│   ├── /components
│   │   ├── /todo
│   │   │   ├── TodoList.tsx           # 容器組件
│   │   │   ├── TodoList.test.tsx
│   │   │   ├── TodoItem.tsx           # 單一待辦事項
│   │   │   ├── TodoItem.test.tsx
│   │   │   ├── TodoForm.tsx           # 新增/編輯表單
│   │   │   ├── TodoForm.test.tsx
│   │   │   └── index.ts               # Barrel exports
│   │   ├── /ui
│   │   │   ├── Button.tsx             # 可重用按鈕
│   │   │   ├── Input.tsx              # 可重用輸入框
│   │   │   ├── Checkbox.tsx           # 可重用複選框
│   │   │   └── index.ts
│   │   └── /layout
│   │       ├── AppLayout.tsx
│   │       └── Header.tsx
│   ├── /store
│   │   ├── todoStore.ts               # Zustand store
│   │   └── todoStore.test.ts
│   ├── /hooks
│   │   ├── useTodos.ts                # 待辦事項操作 hook
│   │   ├── useKeyboardShortcuts.ts    # 鍵盤快捷鍵
│   │   └── useLocalStorage.ts         # 本地儲存
│   ├── /types
│   │   ├── todo.ts                    # TypeScript 介面
│   │   └── index.ts
│   ├── /utils
│   │   ├── validation.ts              # 輸入驗證
│   │   ├── validation.test.ts
│   │   ├── date.ts                    # 日期處理
│   │   └── performance.ts             # 效能監控
│   ├── /test
│   │   ├── setup.ts                   # 測試設定
│   │   └── test-utils.tsx             # 自訂測試工具
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── main.tsx
│   └── index.css
├── /public
│   └── vite.svg
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

### 路徑別名配置

```typescript
// tsconfig.json
{
  "compilerOptions": {
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

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
```

---

## 組件架構設計

### 設計原則

**✅ 應該做的:**
- 組件專注於單一職責
- 使用組合模式優於 prop drilling
- 直接從 Zustand store 取用狀態
- 提取可重用的 UI 組件到 `/ui` 資料夾
- 測試檔案與組件檔案放在一起
- 使用 TypeScript 嚴格模式

**❌ 不應該做的:**
- 不要透過 props 傳遞 store actions
- 不要建立不必要的抽象層
- 不要過早優化
- 不要建立過深的組件層次結構

### 核心組件層次結構

```
App
├── TodoList
│   ├── TodoForm (新增表單)
│   └── TodoItems
│       ├── TodoItem (單一項目)
│       └── TodoItem (其他項目)
```

### 型別定義

```typescript
// /src/types/todo.ts
export interface Todo {
  id: string;           // UUID
  title: string;        // 待辦事項標題
  description?: string; // 詳細描述 (選用)
  isCompleted: boolean; // 完成狀態
  createdAt: Date;      // 建立時間
  updatedAt: Date;      // 更新時間
  completedAt?: Date;   // 完成時間 (選用)
}

// 未來擴展欄位
export interface TodoExtended extends Todo {
  priority?: 'low' | 'medium' | 'high'; // 優先級
  dueDate?: Date;                       // 截止日期
  tags?: string[];                      // 標籤
}
```

### TodoItem 組件實作

```typescript
// /src/components/todo/TodoItem.tsx
import { useState } from 'react';
import { useTodoStore } from '@store/todoStore';
import type { Todo } from '@types/todo';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const { toggleTodo, updateTodo, deleteTodo } = useTodoStore();

  const handleSave = () => {
    if (editValue.trim()) {
      updateTodo(todo.id, { title: editValue.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => toggleTodo(todo.id)}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
      />

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          aria-label="Edit todo title"
        />
      ) : (
        <span
          className={`flex-1 ${todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <div className="flex gap-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
            aria-label={`Edit "${todo.title}"`}
          >
            Edit
          </button>
        )}
        <button
          onClick={() => deleteTodo(todo.id)}
          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
```

### TodoList 組件實作

```typescript
// /src/components/todo/TodoList.tsx
import { useTodoStore } from '@store/todoStore';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';

export function TodoList() {
  const todos = useTodoStore((state) => state.todos);

  const activeTodos = todos.filter(t => !t.isCompleted);
  const completedTodos = todos.filter(t => t.isCompleted);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Todos</h1>
        <TodoForm />
      </header>

      <div className="space-y-6">
        {activeTodos.length > 0 && (
          <section aria-labelledby="active-todos-heading">
            <h2 id="active-todos-heading" className="text-xl font-semibold text-gray-800 mb-3">
              Active ({activeTodos.length})
            </h2>
            <ul className="space-y-2">
              {activeTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </section>
        )}

        {completedTodos.length > 0 && (
          <section aria-labelledby="completed-todos-heading">
            <h2 id="completed-todos-heading" className="text-xl font-semibold text-gray-800 mb-3">
              Completed ({completedTodos.length})
            </h2>
            <ul className="space-y-2">
              {completedTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </section>
        )}

        {todos.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No todos yet. Add one above to get started!
          </p>
        )}
      </div>
    </div>
  );
}
```

### TodoForm 組件實作

```typescript
// /src/components/todo/TodoForm.tsx
import { useState, useRef } from 'react';
import { useTodoStore } from '@store/todoStore';

export function TodoForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = 'todo-form-error';

  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Todo title cannot be empty');
      inputRef.current?.focus();
      return;
    }

    if (title.length > 200) {
      setError('Todo title must be less than 200 characters');
      return;
    }

    addTodo(title);
    setTitle('');
    setError('');

    // 通知螢幕閱讀器
    announceToScreenReader(`Todo "${title}" added successfully`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="todo-input" className="sr-only">
          Add new todo
        </label>
        <input
          ref={inputRef}
          id="todo-input"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          maxLength={200}
        />
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Add Todo
      </button>
    </form>
  );
}

// 螢幕閱讀器通知工具
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

---

## 狀態管理實作

### 為什麼選擇 Zustand

1. **最小樣板代碼**: 5 個 CRUD 操作，Zustand 需 ~80 行，Redux Toolkit 需 ~150+ 行
2. **無需 Provider 包裝**: 直接存取 store，無 Context API 開銷
3. **內建 DevTools**: 支援 Redux DevTools
4. **TypeScript 優先**: 優秀的型別推斷
5. **Bundle 大小**: Zustand (~1.2KB) vs Redux Toolkit (~12KB)
6. **學習曲線**: 更簡單
7. **持久化**: 原生 middleware 支援 localStorage

### Zustand Store 完整實作

```typescript
// /src/store/todoStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Todo } from '@types/todo';

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';

  // Actions
  addTodo: (title: string, description?: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoState['filter']) => void;

  // Selectors (computed values)
  getFilteredTodos: () => Todo[];
  getStats: () => { total: number; active: number; completed: number };
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      immer((set, get) => ({
        todos: [],
        filter: 'all',

        addTodo: (title, description) => set((state) => {
          state.todos.push({
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

### Zustand Selector 優化

```typescript
// ❌ 不好: 任何狀態變更都會導致重新渲染
const { todos, addTodo, toggleTodo } = useTodoStore();

// ✅ 好: 只在特定 slice 變更時重新渲染
const todos = useTodoStore((state) => state.todos);
const addTodo = useTodoStore((state) => state.addTodo);

// ✅ 更好: 使用 shallow 比較選取多個值
import { shallow } from 'zustand/shallow';

const { addTodo, toggleTodo } = useTodoStore(
  (state) => ({ addTodo: state.addTodo, toggleTodo: state.toggleTodo }),
  shallow
);
```

---

## 樣式系統

### Tailwind CSS 配置

```javascript
// tailwind.config.js
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
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

### 全域樣式

```css
/* /src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }

  body {
    @apply bg-gray-50 text-gray-900;
  }
}

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

---

## 效能優化策略

### 關鍵優化技術

#### 1. 策略性 Memoization

```typescript
// ❌ 不好: 過度優化
import { memo } from 'react';

// 不要 memo 所有組件 - 會增加開銷！
export const TodoItem = memo(({ todo }: TodoItemProps) => {
  // 簡單組件，無昂貴計算
});

// ✅ 好: 先分析，必要時優化
export function TodoItem({ todo }: TodoItemProps) {
  // 保持簡單，除非分析顯示有問題
}

// ✅ 好: 渲染昂貴組件時使用 memo
import { memo } from 'react';

export const ExpensiveChart = memo(({ data }: ChartProps) => {
  // 複雜的 D3 視覺化，不常變更
});
```

#### 2. 代碼分割策略

```typescript
// /src/App.tsx
import { lazy, Suspense } from 'react';
import { TodoList } from './components/todo/TodoList';

// Phase 1: 不分割 - bundle 很小
// Phase 3: 分割進階功能
const TodoStatistics = lazy(() => import('./components/statistics/TodoStatistics'));
const TodoSettings = lazy(() => import('./components/settings/TodoSettings'));

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TodoList />

      <Suspense fallback={<div>Loading...</div>}>
        {/* 按需載入進階功能 */}
        <TodoStatistics />
      </Suspense>
    </div>
  );
}
```

#### 3. Vite 優化配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // 啟用 Fast Refresh
      fastRefresh: true,
    }),
  ],
  build: {
    // 針對現代瀏覽器
    target: 'es2020',

    // 優化 chunk 分割
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'zustand-vendor': ['zustand'],
        },
      },
    },

    // 啟用壓縮
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生產環境移除 console.logs
      },
    },
  },

  // 優化依賴預打包
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand'],
  },
});
```

#### 4. 效能監控

```typescript
// /src/utils/performance.ts
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
      if (measure.duration > 16) { // 60fps 閾值
        console.warn(`${componentName} took ${measure.duration.toFixed(2)}ms`);
      }
    };
  }
  return () => {};
}

// 組件中使用
import { useEffect } from 'react';
import { measureRender } from '@utils/performance';

export function TodoList() {
  useEffect(() => {
    const endMeasure = measureRender('TodoList');
    return endMeasure;
  });

  // 組件邏輯...
}
```

---

## 測試策略

### 測試哲學

**測試使用者行為，非實作細節。**

遵循 **測試金字塔** 方法：
- **70%** 整合測試 (React Testing Library)
- **20%** 單元測試 (純函式、工具)
- **10%** E2E 測試 (關鍵使用者流程)

### 測試配置

```typescript
// vitest.config.ts
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

```typescript
// /src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 每次測試後清理
afterEach(() => {
  cleanup();
});
```

### 組件測試範例

```typescript
// /src/components/todo/TodoItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoItem } from './TodoItem';
import { useTodoStore } from '@store/todoStore';
import type { Todo } from '@types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // 每次測試前重置 store
    useTodoStore.setState({ todos: [] });
  });

  it('正確渲染待辦事項標題', () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('點擊複選框時切換完成狀態', () => {
    render(<TodoItem todo={mockTodo} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // 驗證 store action 被呼叫
    expect(useTodoStore.getState().todos[0]?.isCompleted).toBe(true);
  });

  it('雙擊時進入編輯模式', () => {
    render(<TodoItem todo={mockTodo} />);

    const title = screen.getByText('Test Todo');
    fireEvent.doubleClick(title);

    const input = screen.getByRole('textbox', { name: /edit todo title/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('按 Enter 鍵儲存編輯', () => {
    render(<TodoItem todo={mockTodo} />);

    // 進入編輯模式
    fireEvent.doubleClick(screen.getByText('Test Todo'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Updated Todo')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('按 Escape 鍵取消編輯', () => {
    render(<TodoItem todo={mockTodo} />);

    fireEvent.doubleClick(screen.getByText('Test Todo'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Should not save' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('點擊刪除按鈕時刪除待辦事項', () => {
    useTodoStore.setState({ todos: [mockTodo] });
    render(<TodoItem todo={mockTodo} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it('具有適當的無障礙屬性', () => {
    render(<TodoItem todo={mockTodo} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test Todo" as complete');

    const editButton = screen.getByRole('button', { name: /edit "Test Todo"/i });
    expect(editButton).toBeInTheDocument();
  });
});
```

### Store 測試範例

```typescript
// /src/store/todoStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from './todoStore';

describe('TodoStore', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [] });
  });

  it('新增待辦事項', () => {
    const { addTodo } = useTodoStore.getState();

    addTodo('New Todo');

    const todos = useTodoStore.getState().todos;
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('New Todo');
    expect(todos[0].isCompleted).toBe(false);
  });

  it('切換待辦事項完成狀態', () => {
    const { addTodo, toggleTodo } = useTodoStore.getState();

    addTodo('Test Todo');
    const todoId = useTodoStore.getState().todos[0].id;

    toggleTodo(todoId);

    const todo = useTodoStore.getState().todos[0];
    expect(todo.isCompleted).toBe(true);
    expect(todo.completedAt).toBeInstanceOf(Date);
  });

  it('更新待辦事項標題', () => {
    const { addTodo, updateTodo } = useTodoStore.getState();

    addTodo('Original Title');
    const todoId = useTodoStore.getState().todos[0].id;

    updateTodo(todoId, { title: 'Updated Title' });

    expect(useTodoStore.getState().todos[0].title).toBe('Updated Title');
  });

  it('刪除待辦事項', () => {
    const { addTodo, deleteTodo } = useTodoStore.getState();

    addTodo('Todo to Delete');
    const todoId = useTodoStore.getState().todos[0].id;

    deleteTodo(todoId);

    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it('正確計算統計資訊', () => {
    const { addTodo, toggleTodo, getStats } = useTodoStore.getState();

    addTodo('Todo 1');
    addTodo('Todo 2');
    addTodo('Todo 3');

    const firstTodoId = useTodoStore.getState().todos[0].id;
    toggleTodo(firstTodoId);

    const stats = getStats();
    expect(stats.total).toBe(3);
    expect(stats.active).toBe(2);
    expect(stats.completed).toBe(1);
  });
});
```

### 測試檢查清單

**每個組件:**
- [ ] 使用 props 正確渲染
- [ ] 處理使用者互動 (點擊、輸入、鍵盤)
- [ ] 正確更新 store 狀態
- [ ] 顯示錯誤狀態
- [ ] 具有適當的無障礙屬性
- [ ] 處理邊界情況 (空輸入、特殊字元)

**Store:**
- [ ] 所有 CRUD 操作正確運作
- [ ] 狀態更新是不可變的
- [ ] Selectors 回傳正確值
- [ ] 持久化正常運作

---

## 無障礙設計

### WCAG 2.1 AA 合規檢查清單

**鍵盤導航:**
- [ ] 所有互動元素可透過 Tab 聚焦
- [ ] Enter/Space 觸發動作
- [ ] Escape 取消模態/編輯模式
- [ ] 焦點指示器可見 (最小 2px 對比度)

**螢幕閱讀器支援:**
- [ ] 語義化 HTML (header, main, nav, section)
- [ ] 互動元素的 ARIA 標籤
- [ ] 動態更新的 Live regions
- [ ] 圖片/圖示的替代文字

**視覺無障礙:**
- [ ] 文字顏色對比度 ≥ 4.5:1
- [ ] 顏色不是狀態的唯一指示器
- [ ] 文字可放大至 200%
- [ ] 焦點指示器可見

### 鍵盤快捷鍵 Hook

```typescript
// /src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = shortcuts.find(s =>
        s.key.toLowerCase() === e.key.toLowerCase() &&
        (s.ctrlKey === undefined || s.ctrlKey === e.ctrlKey) &&
        (s.shiftKey === undefined || s.shiftKey === e.shiftKey)
      );

      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// 在 App.tsx 中使用
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useTodoStore } from '@store/todoStore';

export function App() {
  const setFilter = useTodoStore((state) => state.setFilter);

  useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      action: () => document.getElementById('todo-input')?.focus(),
      description: 'Focus new todo input',
    },
    {
      key: 'a',
      ctrlKey: true,
      action: () => setFilter('all'),
      description: 'Show all todos',
    },
    {
      key: 'c',
      ctrlKey: true,
      action: () => setFilter('completed'),
      description: 'Show completed todos',
    },
  ]);

  return <TodoList />;
}
```

---

## 實作步驟

### Phase 1: 專案初始化 (第 1-2 天)

#### 1. 初始化專案

```bash
# 建立 Vite + React + TypeScript 專案
npm create vite@latest . -- --template react-ts

# 安裝核心依賴
npm install zustand

# 安裝 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npx tailwindcss init -p

# 安裝測試框架
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# 安裝開發工具
npm install -D eslint prettier eslint-config-prettier
```

#### 2. 配置開發環境

- 設置 `tsconfig.json` (啟用嚴格模式和路徑別名)
- 配置 `vite.config.ts` (路徑別名、優化)
- 配置 `vitest.config.ts` (測試設定、覆蓋率閾值)
- 設置 `tailwind.config.js` (主題、動畫)
- 配置 `.eslintrc.cjs` 和 `.prettierrc`

#### 3. 建立資料夾結構

```bash
mkdir -p src/{components/{todo,ui,layout},store,hooks,types,utils,test}
```

### Phase 2: 核心功能實作 (第 3-7 天)

#### 4. 定義型別和 Store

- 建立 `src/types/todo.ts`
- 實作 `src/store/todoStore.ts` (Zustand store)
- 撰寫 `src/store/todoStore.test.ts`

#### 5. 實作核心組件

按順序實作 (TDD 方法):

1. **TodoForm** (最簡單)
   - 建立組件
   - 撰寫測試
   - 加入 Tailwind 樣式
   - 驗證無障礙性

2. **TodoItem**
   - 建立組件
   - 撰寫測試
   - 實作編輯模式
   - 加入鍵盤導航

3. **TodoList**
   - 建立容器組件
   - 整合 TodoForm 和 TodoItem
   - 撰寫整合測試

#### 6. 建立 App 根組件

- 設置 App.tsx
- 加入全域樣式
- 實作鍵盤快捷鍵

### Phase 3: 優化與完善 (第 8-10 天)

#### 7. 響應式設計

- 手機版佈局優化
- 平板和桌面版調整
- 測試不同螢幕尺寸

#### 8. 使用者體驗優化

- 加入載入狀態
- 錯誤處理和顯示
- 動畫和過渡效果
- 空狀態處理

#### 9. 測試覆蓋率

- 確保所有組件測試覆蓋率 > 80%
- 執行 E2E 測試
- 效能測試

#### 10. 文件和部署準備

- 更新 README.md
- 加入使用說明
- 準備部署配置

---

## 成功指標

### 效能目標 (< 2s 要求)

- **First Contentful Paint (FCP)**: < 1.0s
- **Largest Contentful Paint (LCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 2.0s
- **Bundle size**: < 150KB gzipped (Phase 1)

### 測試指標

- 單元測試覆蓋率: > 80%
- 整合測試覆蓋率: > 70%
- 所有測試通過
- 無 console errors/warnings

### 無障礙指標

- WCAG 2.1 AA 合規
- 所有互動元素可鍵盤存取
- 螢幕閱讀器相容
- 顏色對比度符合標準

### 程式碼品質指標

- TypeScript 嚴格模式無錯誤
- ESLint 無警告
- Prettier 格式化一致
- 組件平均複雜度 < 10

---

## 開發工作流程

### 日常指令

```bash
# 開發
npm run dev              # 啟動開發伺服器

# 測試
npm run test             # 執行測試 (watch 模式)
npm run test:ui          # Vitest UI
npm run test:coverage    # 覆蓋率報告

# 建置
npm run build            # 生產環境建置
npm run preview          # 預覽生產建置

# 程式碼品質
npm run lint             # ESLint 檢查
npm run format           # Prettier 格式化
```

### Git 工作流程

```bash
# 功能開發
git checkout -b feature/todo-form
git add .
git commit -m "feat: implement TodoForm component with validation"
git push origin feature/todo-form

# 提交訊息格式
# feat: 新功能
# fix: 錯誤修復
# refactor: 重構
# test: 測試
# docs: 文件
# style: 樣式
# perf: 效能優化
```

---

## 關鍵建議總結

### ✅ 應該做的事情 (Phase 1)

1. **設置專案結構**
   - 初始化 Vite + React + TypeScript
   - 配置 Tailwind CSS
   - 設置 Zustand store 與持久化
   - 配置 Vitest + React Testing Library

2. **實作核心組件**
   - 從 TodoList → TodoItem → TodoForm 開始
   - 直接使用 Zustand (無 prop drilling)
   - 加入基本 Tailwind 樣式
   - 為每個組件撰寫測試

3. **從第一天開始無障礙**
   - 語義化 HTML
   - ARIA 標籤
   - 鍵盤導航
   - 焦點管理

4. **測試策略**
   - 測試使用者行為，非實作
   - 從一開始就追求 80% 覆蓋率
   - 測試與組件放在一起

### ❌ 不要做的事情 (避免過度工程)

1. **過早優化**
   - ❌ 不要 memo 每個組件
   - ❌ 不要一開始就加入虛擬化
   - ❌ Phase 1 不要分割程式碼

2. **不必要的抽象**
   - ❌ 不要建立自訂表單函式庫
   - ❌ 不要建立組件函式庫
   - ❌ 使用 Zustand 時不要加入 Redux

3. **功能蔓延**
   - ❌ 不要加入使用者故事外的功能
   - ❌ Phase 1 不要實作拖放
   - ❌ 不要一開始就加入複雜動畫

---

## 參考資源

### 官方文件

- [React 文件](https://react.dev/)
- [TypeScript 文件](https://www.typescriptlang.org/)
- [Vite 文件](https://vitejs.dev/)
- [Zustand 文件](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS 文件](https://tailwindcss.com/)
- [Vitest 文件](https://vitest.dev/)
- [React Testing Library 文件](https://testing-library.com/react)

### 最佳實踐

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**文件版本**: 1.0
**最後更新**: 2025-10-14
**維護者**: Frontend Development Team
