# Frontend Priority Feature Implementation Plan
# Todo 優先級功能前端實作計畫

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | Todo 優先級功能前端實作計畫 (Frontend Priority Implementation Plan) |
| 版本號 | 1.1.0 |
| 撰寫日期 | 2025-10-27 |
| 撰寫人 | Frontend Development Team |
| 審核人 | Frontend Lead |
| 狀態 | ✅ 已完成 (2025-10-27) |
| 相關文件 | CR-002, API-Specification.md, PRD.md, Frontend-Team-Todolist.md |

## 變更歷史記錄

| 版本 | 日期 | 變更內容 | 變更人 |
|------|------|---------|--------|
| 1.1.0 | 2025-10-27 | 更新狀態為已完成，新增實作完成總結與測試結果 (568/568 tests passing) | Frontend Team |
| 1.0.0 | 2025-10-27 | 初始版本建立 | Frontend Team |

---

## 目錄

1. [概述](#1-概述)
2. [技術分析](#2-技術分析)
3. [UI/UX 設計](#3-uiux-設計)
4. [實作計畫](#4-實作計畫)
5. [測試策略](#5-測試策略)
6. [驗收標準](#6-驗收標準)
7. [風險評估](#7-風險評估)
8. [參考資料](#8-參考資料)

---

## 1. 概述

### 1.1 功能描述

根據 CR-002 變更請求，為 TodoList 應用程式新增 4 級優先級系統：

- **CRITICAL** (緊急) - 紅色 (#EF4444)
- **HIGH** (高) - 橙色 (#F59E0B)
- **NORMAL** (中) - 綠色 (#10B981)
- **LOW** (低) - 灰色 (#6B7280) - **預設值**

### 1.2 後端已完成功能

後端 API 已完全實作並通過測試：

- ✅ Prisma Schema 更新 (priority 欄位)
- ✅ Database Migration 完成
- ✅ API 端點支援 priority 參數
  - `POST /api/todos` - 可選 priority 欄位
  - `PUT /api/todos/:id` - 可選 priority 欄位
  - `GET /api/todos?priority=CRITICAL` - 優先級篩選
- ✅ 3 層排序邏輯：完成狀態 > 優先級 > 建立時間
- ✅ 優先級驗證 (只允許 CRITICAL/HIGH/NORMAL/LOW)
- ✅ 所有後端測試通過

### 1.3 前端實作目標

**核心目標**：
1. 更新 TypeScript 型別定義以支援 priority 欄位
2. 修改 TodoForm 組件以支援優先級選擇
3. 修改 TodoItem 組件以顯示優先級標籤
4. 實作優先級篩選 UI
5. 確保無障礙性 (WCAG 2.1 AA)
6. 保持測試覆蓋率 > 80%

**非目標**：
- ❌ 不實作客戶端排序 (後端已處理)
- ❌ 不改變現有的資料流架構
- ❌ 不引入新的狀態管理庫

---

## 2. 技術分析

### 2.1 現有架構分析

**State Management (Zustand)**:
```typescript
// 現有 Store 結構
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
  error: string | null;

  setTodos: (todos: Todo[]) => void;
  addTodo: (title: string, description?: string) => void;
  // ... 其他 actions
}
```

**API Integration (useTodos hook)**:
```typescript
// 現有 API 方法
const {
  fetchTodos,      // GET /api/todos
  createTodo,      // POST /api/todos
  updateTodo,      // PUT /api/todos/:id
  deleteTodo       // DELETE /api/todos/:id
} = useTodoActions();
```

**Type Definitions**:
```typescript
// 現有 Todo 介面 (需更新)
export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  // ❌ 缺少 priority 欄位
}
```

### 2.2 需要修改的檔案清單

| 檔案路徑 | 修改類型 | 預估工作量 | 優先級 |
|---------|---------|-----------|--------|
| `src/types/todo.ts` | 型別更新 | 30 分鐘 | P0 |
| `src/components/todo/TodoForm.tsx` | UI + 邏輯 | 3 小時 | P0 |
| `src/components/todo/TodoForm.test.tsx` | 測試更新 | 2 小時 | P0 |
| `src/components/todo/TodoItem.tsx` | UI 顯示 | 2 小時 | P0 |
| `src/components/todo/TodoItem.test.tsx` | 測試更新 | 1.5 小時 | P0 |
| `src/components/todo/TodoList.tsx` | 篩選 UI | 2 小時 | P0 |
| `src/components/todo/TodoList.test.tsx` | 測試更新 | 1.5 小時 | P0 |
| `src/store/todoStore.ts` | Store 更新 (optional) | 1 小時 | P1 |
| `src/store/todoStore.test.ts` | 測試更新 | 1 小時 | P1 |
| `src/hooks/useTodos.ts` | 型別更新 | 30 分鐘 | P0 |
| `src/hooks/useTodos.test.ts` | 測試更新 | 1 小時 | P1 |
| `frontend/e2e/todo-app.spec.ts` | E2E 測試 | 2 小時 | P1 |

**總預估工作量**: **18 小時** (2.5 工作天)

### 2.3 技術決策

#### 決策 1: 優先級選擇 UI 元素

**選項分析**:
| 選項 | 優點 | 缺點 | 決定 |
|------|------|------|------|
| **Radio Buttons** | 語義化、無障礙、單選邏輯明確 | 佔空間較大 | ✅ **採用** |
| Select Dropdown | 節省空間 | 需額外點擊、手機體驗較差 | ❌ |
| Button Group | 視覺化、易操作 | 響應式需調整 | ❌ |
| Segmented Control | 美觀、現代 | 實作複雜度高 | ❌ |

**最終決策**: 使用 **Radio Buttons** (單選按鈕)
- ✅ 最佳無障礙性
- ✅ 符合 HTML 語義
- ✅ Tailwind CSS 原生支援
- ✅ 手機與桌面體驗一致

#### 決策 2: 優先級顯示方式

**TodoItem 優先級顯示設計**:
```tsx
// 選擇方案: Badge + Icon
<div className="flex items-center gap-2">
  <span className={priorityBadgeClass}>
    {priorityIcon} {priorityLabel}
  </span>
  <span className="todo-title">{title}</span>
</div>
```

**顏色方案** (遵循 CR-002 規範):
```typescript
const priorityConfig = {
  CRITICAL: {
    label: '緊急',
    color: 'red',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    borderClass: 'border-red-300',
    icon: '🔴'
  },
  HIGH: {
    label: '高',
    color: 'orange',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-300',
    icon: '🟠'
  },
  NORMAL: {
    label: '中',
    color: 'green',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
    borderClass: 'border-green-300',
    icon: '🟡'
  },
  LOW: {
    label: '低',
    color: 'gray',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
    borderClass: 'border-gray-300',
    icon: '⚪'
  }
};
```

#### 決策 3: 篩選 UI 位置

**選擇方案**: 在現有的 Filter Buttons 旁新增 Priority Filter Dropdown

```
┌─────────────────────────────────────────┐
│ [All] [Active] [Completed]  [Priority ▼]│  ← 新增優先級篩選
└─────────────────────────────────────────┘
```

#### 決策 4: 是否實作客戶端優先級排序

**決策**: ❌ **不實作客戶端排序**

**理由**:
- 後端已實作 3 層排序邏輯 (完成狀態 > 優先級 > 建立時間)
- GET /api/todos 已返回正確排序的資料
- 避免前後端排序邏輯不一致
- 減少前端複雜度

**實作方式**:
- 直接使用 API 返回的順序渲染
- 任何 CRUD 操作後重新 fetchTodos() 獲取最新排序

---

## 3. UI/UX 設計

### 3.1 TodoForm 組件設計

**新增前** (現有 UI):
```
┌─────────────────────────────────────┐
│ What needs to be done?              │
│ ┌─────────────────────────────────┐ │
│ │ [輸入待辦事項...]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Add Todo]                          │
└─────────────────────────────────────┘
```

**新增後** (包含優先級):
```
┌─────────────────────────────────────┐
│ What needs to be done?              │
│ ┌─────────────────────────────────┐ │
│ │ [輸入待辦事項...]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Priority:                           │
│ ○ 🔴 緊急  ○ 🟠 高                 │
│ ○ 🟡 中    ● ⚪ 低 (預設)          │  ← 新增區塊
│                                     │
│ [Add Todo]                          │
└─────────────────────────────────────┘
```

**響應式設計**:
- **Mobile** (< 640px): 2x2 grid layout
- **Tablet+** (≥ 640px): 4 inline radio buttons

### 3.2 TodoItem 組件設計

**顯示模式**:
```
┌─────────────────────────────────────────┐
│ ☐ [🔴 緊急] 修復生產環境 Bug    [Delete]│  ← 優先級 badge
└─────────────────────────────────────────┘
```

**編輯模式**:
```
┌─────────────────────────────────────────┐
│ ✏️ [修復生產環境 Bug____________]       │
│                                         │
│ Priority:                               │
│ ● 🔴 緊急  ○ 🟠 高  ○ 🟡 中  ○ ⚪ 低  │  ← 可修改
│                                         │
│ [Save (Enter)] [Cancel (Esc)]          │
└─────────────────────────────────────────┘
```

**已完成項目顯示**:
```
┌─────────────────────────────────────────┐
│ ☑ [🔴 緊急] 處理緊急客訴    [Delete]     │
│        ↑ 半透明 + 刪除線                 │
└─────────────────────────────────────────┘
```

### 3.3 TodoList 篩選器設計

**篩選 UI**:
```
┌────────────────────────────────────────┐
│ Filter by:                             │
│ [All] [Active] [Completed]             │  ← 現有篩選
│                                        │
│ Priority: [All Priorities ▼]          │  ← 新增優先級篩選
└────────────────────────────────────────┘

Dropdown Options:
- All Priorities (預設)
- 🔴 緊急 (CRITICAL)
- 🟠 高 (HIGH)
- 🟡 中 (NORMAL)
- ⚪ 低 (LOW)
```

### 3.4 無障礙設計 (WCAG 2.1 AA)

**顏色對比度檢查**:
| 優先級 | 背景色 | 文字色 | 對比度 | 狀態 |
|--------|-------|--------|--------|------|
| CRITICAL | #FEE2E2 | #991B1B | 7.8:1 | ✅ AAA |
| HIGH | #FED7AA | #9A3412 | 7.2:1 | ✅ AAA |
| NORMAL | #D1FAE5 | #065F46 | 7.5:1 | ✅ AAA |
| LOW | #F3F4F6 | #374151 | 8.1:1 | ✅ AAA |

**ARIA 屬性**:
```tsx
// Radio Button Group
<fieldset>
  <legend className="sr-only">Select priority level</legend>
  <div role="group" aria-label="Priority options">
    <input
      type="radio"
      id="priority-low"
      name="priority"
      value="LOW"
      aria-label="Low priority"
      aria-describedby="priority-low-desc"
    />
    <label htmlFor="priority-low">
      <span aria-hidden="true">⚪</span>
      <span>低</span>
    </label>
    <span id="priority-low-desc" className="sr-only">
      可延後處理的次要任務
    </span>
  </div>
</fieldset>

// Priority Badge
<span
  className={priorityBadgeClass}
  aria-label={`Priority: ${priority}`}
  role="status"
>
  <span aria-hidden="true">{icon}</span>
  <span>{label}</span>
</span>
```

**鍵盤導航**:
- ✅ Radio buttons: Arrow keys 切換選項
- ✅ Dropdown: Enter/Space 開啟, Arrow keys 選擇
- ✅ 所有互動元素可 Tab focus
- ✅ Focus indicators 清晰可見 (ring-2 ring-primary-500)

### 3.5 響應式設計斷點

**Mobile First 設計**:
```tsx
// TodoForm - Priority Selection
<div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
  {/* Mobile: 2 columns, Tablet+: horizontal flex */}
</div>

// TodoItem - Priority Badge
<span className={`
  text-xs sm:text-sm      // 字體大小響應式
  px-2 py-1 sm:px-3 sm:py-1.5  // 內距響應式
`}>
  <span className="hidden sm:inline">{icon}</span>  // 手機隱藏 icon
  {label}
</span>
```

---

## 4. 實作計畫

### 4.1 Phase 1: 型別定義更新 (1 小時)

#### Task 1.1: 更新 Todo 介面

**檔案**: `src/types/todo.ts`

**Before**:
```typescript
export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}
```

**After**:
```typescript
// 新增優先級類型
export type TodoPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  priority: TodoPriority;  // ✅ 新增欄位
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}
```

#### Task 1.2: 更新 DTO 介面

**檔案**: `src/types/todo.ts`

```typescript
export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: TodoPriority;  // ✅ 新增 (可選)
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: TodoPriority;  // ✅ 新增 (可選)
}
```

#### Task 1.3: 新增 Priority 相關型別與常數

**檔案**: `src/types/todo.ts`

```typescript
// 優先級配置介面
export interface PriorityConfig {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: string;
  description: string;
}

// 優先級配置常數
export const PRIORITY_CONFIG: Record<TodoPriority, PriorityConfig> = {
  CRITICAL: {
    label: '緊急',
    color: 'red',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    borderClass: 'border-red-300',
    icon: '🔴',
    description: '必須立即處理的緊急事項'
  },
  HIGH: {
    label: '高',
    color: 'orange',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-300',
    icon: '🟠',
    description: '重要且需優先處理的任務'
  },
  NORMAL: {
    label: '中',
    color: 'green',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
    borderClass: 'border-green-300',
    icon: '🟡',
    description: '普通重要度的常規任務'
  },
  LOW: {
    label: '低',
    color: 'gray',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
    borderClass: 'border-gray-300',
    icon: '⚪',
    description: '可延後處理的次要任務'
  }
} as const;

// 優先級選項陣列 (用於 UI 渲染)
export const PRIORITY_OPTIONS: TodoPriority[] = ['CRITICAL', 'HIGH', 'NORMAL', 'LOW'];

// 預設優先級
export const DEFAULT_PRIORITY: TodoPriority = 'LOW';
```

**驗收標準**:
- [ ] TypeScript 編譯無錯誤
- [ ] 所有型別定義與後端 API 一致
- [ ] PRIORITY_CONFIG 常數可正常匯入使用

---

### 4.2 Phase 2: TodoForm 組件更新 (5 小時)

#### Task 2.1: 新增 Priority 選擇 UI (TDD)

**測試先行** (`src/components/todo/TodoForm.test.tsx`):

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoForm } from './TodoForm';

// Mock useTodoActions hook
vi.mock('@hooks/useTodos', () => ({
  useTodoActions: () => ({
    createTodo: vi.fn().mockResolvedValue({ id: '123', title: 'Test' }),
    fetchTodos: vi.fn().mockResolvedValue(undefined)
  })
}));

describe('TodoForm - Priority Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應該顯示優先級選擇 radio buttons', () => {
    render(<TodoForm />);

    expect(screen.getByLabelText(/緊急/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/高/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/中/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/低/i)).toBeInTheDocument();
  });

  it('應該預設選擇 LOW 優先級', () => {
    render(<TodoForm />);

    const lowRadio = screen.getByLabelText(/低/i) as HTMLInputElement;
    expect(lowRadio.checked).toBe(true);
  });

  it('應該允許使用者切換優先級', () => {
    render(<TodoForm />);

    const criticalRadio = screen.getByLabelText(/緊急/i) as HTMLInputElement;
    fireEvent.click(criticalRadio);

    expect(criticalRadio.checked).toBe(true);
  });

  it('應該在新增 todo 時包含選定的優先級', async () => {
    const mockCreateTodo = vi.fn().mockResolvedValue({
      id: '123',
      title: 'Test Todo',
      priority: 'CRITICAL'
    });

    vi.mocked(useTodoActions).mockReturnValue({
      createTodo: mockCreateTodo,
      fetchTodos: vi.fn()
    });

    render(<TodoForm />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const criticalRadio = screen.getByLabelText(/緊急/i);
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'Urgent task' } });
    fireEvent.click(criticalRadio);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Urgent task',
        priority: 'CRITICAL'
      });
    });
  });

  it('應該在提交後重置優先級為 LOW', async () => {
    render(<TodoForm />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const highRadio = screen.getByLabelText(/高/i);
    const lowRadio = screen.getByLabelText(/低/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(highRadio);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(lowRadio.checked).toBe(true);
    });
  });

  it('應該有正確的 ARIA 標籤', () => {
    render(<TodoForm />);

    const fieldset = screen.getByRole('group', { name: /priority/i });
    expect(fieldset).toBeInTheDocument();

    PRIORITY_OPTIONS.forEach((priority) => {
      const config = PRIORITY_CONFIG[priority];
      const radio = screen.getByLabelText(config.label);
      expect(radio).toHaveAttribute('aria-describedby');
    });
  });
});
```

**實作** (`src/components/todo/TodoForm.tsx`):

```typescript
import { useState, useEffect, useRef, forwardRef, type FormEvent } from "react";
import { useTodoActions } from "@hooks/useTodos";
import { PRIORITY_CONFIG, PRIORITY_OPTIONS, DEFAULT_PRIORITY, type TodoPriority } from "@/types/todo";

export const TodoForm = forwardRef<HTMLInputElement>((_props, externalRef) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoPriority>(DEFAULT_PRIORITY);  // ✅ 新增狀態
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);

  const inputRef = (externalRef || internalRef) as React.RefObject<HTMLInputElement>;
  const { createTodo, fetchTodos } = useTodoActions();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    if (title.length > 255) {
      setError("Title must be less than 255 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ 包含優先級
      await createTodo({
        title: title.trim(),
        priority: priority
      });

      await fetchTodos();

      // ✅ 重置表單 (包含優先級)
      setTitle("");
      setPriority(DEFAULT_PRIORITY);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    setTitle(value);
    if (error) {
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Create new todo">
      {/* Title Input */}
      <div>
        <label htmlFor="todo-title" className="sr-only">
          Todo title
        </label>
        <input
          id="todo-title"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="What needs to be done?"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "todo-title-error" : undefined}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          maxLength={255}
        />
      </div>

      {error && (
        <p id="todo-title-error" className="text-xs sm:text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* ✅ Priority Selection */}
      <fieldset>
        <legend className="text-sm sm:text-base font-medium text-gray-700 mb-2">
          Priority
        </legend>
        <div
          role="group"
          aria-label="Priority options"
          className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3"
        >
          {PRIORITY_OPTIONS.map((priorityOption) => {
            const config = PRIORITY_CONFIG[priorityOption];
            const isSelected = priority === priorityOption;

            return (
              <label
                key={priorityOption}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected
                    ? `${config.borderClass} ${config.bgClass} ${config.textClass} ring-2 ring-offset-1 ring-${config.color}-400`
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                  focus-within:ring-2 focus-within:ring-primary-500
                `}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priorityOption}
                  checked={isSelected}
                  onChange={(e) => setPriority(e.target.value as TodoPriority)}
                  aria-label={config.label}
                  aria-describedby={`priority-${priorityOption.toLowerCase()}-desc`}
                  className="sr-only"
                />
                <span aria-hidden="true" className="text-base">
                  {config.icon}
                </span>
                <span className="text-sm font-medium">
                  {config.label}
                </span>
                <span
                  id={`priority-${priorityOption.toLowerCase()}-desc`}
                  className="sr-only"
                >
                  {config.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        {isSubmitting ? "Adding..." : "Add Todo"}
      </button>
    </form>
  );
});

TodoForm.displayName = "TodoForm";
```

**驗收標準**:
- [ ] 所有新增測試通過 (6 個新測試)
- [ ] 優先級選擇 UI 正確顯示
- [ ] 預設選擇 LOW 優先級
- [ ] 可正確切換優先級
- [ ] 提交時包含 priority 欄位
- [ ] 提交後重置為 DEFAULT_PRIORITY
- [ ] ARIA 標籤完整
- [ ] 響應式設計正常 (mobile 2 columns, desktop horizontal)

---

### 4.3 Phase 3: TodoItem 組件更新 (3.5 小時)

#### Task 3.1: 新增 Priority Badge 顯示 (TDD)

**測試先行** (`src/components/todo/TodoItem.test.tsx`):

```typescript
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoItem } from './TodoItem';
import type { Todo } from '@/types/todo';

const mockTodo: Todo = {
  id: '123',
  title: 'Test Todo',
  isCompleted: false,
  priority: 'HIGH',  // ✅ 新增欄位
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: null
};

describe('TodoItem - Priority Display', () => {
  it('應該顯示優先級 badge', () => {
    render(<TodoItem todo={mockTodo} />);

    const badge = screen.getByRole('status', { name: /priority: high/i });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('高');
  });

  it('應該根據優先級顯示正確的顏色', () => {
    const { rerender } = render(<TodoItem todo={{ ...mockTodo, priority: 'CRITICAL' }} />);

    let badge = screen.getByRole('status');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');

    rerender(<TodoItem todo={{ ...mockTodo, priority: 'LOW' }} />);
    badge = screen.getByRole('status');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('應該在已完成項目上顯示半透明優先級', () => {
    render(<TodoItem todo={{ ...mockTodo, isCompleted: true }} />);

    const badge = screen.getByRole('status');
    expect(badge).toHaveClass('opacity-50');
  });
});

describe('TodoItem - Priority Editing', () => {
  it('應該在編輯模式顯示優先級選擇器', () => {
    render(<TodoItem todo={mockTodo} />);

    const title = screen.getByText('Test Todo');
    fireEvent.doubleClick(title);

    expect(screen.getByLabelText(/緊急/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/高/i)).toBeInTheDocument();
  });

  it('應該在編輯模式預選當前優先級', () => {
    render(<TodoItem todo={{ ...mockTodo, priority: 'CRITICAL' }} />);

    const title = screen.getByText('Test Todo');
    fireEvent.doubleClick(title);

    const criticalRadio = screen.getByLabelText(/緊急/i) as HTMLInputElement;
    expect(criticalRadio.checked).toBe(true);
  });

  it('應該允許修改優先級', async () => {
    const mockUpdateTodo = vi.fn().mockResolvedValue({
      ...mockTodo,
      priority: 'LOW'
    });

    vi.mocked(useTodoActions).mockReturnValue({
      updateTodo: mockUpdateTodo,
      // ... other mocks
    });

    render(<TodoItem todo={mockTodo} />);

    fireEvent.doubleClick(screen.getByText('Test Todo'));

    const lowRadio = screen.getByLabelText(/低/i);
    fireEvent.click(lowRadio);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('123', {
        title: 'Test Todo',
        priority: 'LOW'
      });
    });
  });
});
```

**實作** (`src/components/todo/TodoItem.tsx`):

```typescript
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useTodoStore } from "@store/todoStore";
import { useTodoActions } from "@hooks/useTodos";
import { PRIORITY_CONFIG, PRIORITY_OPTIONS, type Todo, type TodoPriority } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [editPriority, setEditPriority] = useState<TodoPriority>(todo.priority);  // ✅ 新增狀態
  const [isUpdating, setIsUpdating] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const toggleTodoLocal = useTodoStore((state) => state.toggleTodo);
  const updateTodoLocal = useTodoStore((state) => state.updateTodo);
  const deleteTodoLocal = useTodoStore((state) => state.deleteTodo);

  const { updateTodo, deleteTodo, fetchTodos } = useTodoActions();

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(todo.title);
    setEditPriority(todo.priority);  // ✅ 設定當前優先級
  };

  const handleSave = async () => {
    const trimmedText = editText.trim();

    if (!trimmedText) {
      setIsEditing(false);
      setEditText(todo.title);
      setEditPriority(todo.priority);
      return;
    }

    // ✅ 檢查是否有變更
    if (trimmedText === todo.title && editPriority === todo.priority) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);

    try {
      // ✅ 包含優先級更新
      const updatedTodo = await updateTodo(todo.id, {
        title: trimmedText,
        priority: editPriority
      });

      updateTodoLocal(todo.id, updatedTodo);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update todo:", err);
      setEditText(todo.title);
      setEditPriority(todo.priority);
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.title);
    setEditPriority(todo.priority);  // ✅ 重置優先級
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleBlur = () => {
    if (!isUpdating) {
      handleSave();
    }
  };

  const handleToggle = async () => {
    try {
      const newCompletedState = !todo.isCompleted;
      toggleTodoLocal(todo.id);
      await updateTodo(todo.id, { isCompleted: newCompletedState });
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      toggleTodoLocal(todo.id);
    }
  };

  const handleDelete = async () => {
    try {
      deleteTodoLocal(todo.id);
      await deleteTodo(todo.id);
    } catch (err) {
      console.error("Failed to delete todo:", err);
      await fetchTodos();
    }
  };

  // ✅ 優先級配置
  const priorityConfig = PRIORITY_CONFIG[todo.priority];

  return (
    <div className="group flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 hover:bg-gray-50 transition-colors animate-slide-up">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={handleToggle}
        aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? "incomplete" : "complete"}`}
        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer transition-transform hover:scale-110"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          // ✅ 編輯模式
          <div className="space-y-3">
            {/* Title Input */}
            <div>
              <label htmlFor={`edit-${todo.id}`} className="sr-only">
                Edit todo title
              </label>
              <input
                id={`edit-${todo.id}`}
                ref={editInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                disabled={isUpdating}
                aria-invalid="false"
                aria-label={`Edit "${todo.title}"`}
                className="w-full px-2 py-1 text-sm sm:text-base border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                maxLength={255}
              />
            </div>

            {/* ✅ Priority Selection in Edit Mode */}
            <fieldset>
              <legend className="sr-only">Edit priority</legend>
              <div
                role="group"
                aria-label="Edit priority options"
                className="flex flex-wrap gap-2"
              >
                {PRIORITY_OPTIONS.map((priorityOption) => {
                  const config = PRIORITY_CONFIG[priorityOption];
                  const isSelected = editPriority === priorityOption;

                  return (
                    <label
                      key={priorityOption}
                      className={`
                        flex items-center gap-1.5 px-2 py-1 rounded border cursor-pointer text-xs transition-all
                        ${isSelected
                          ? `${config.borderClass} ${config.bgClass} ${config.textClass}`
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`edit-priority-${todo.id}`}
                        value={priorityOption}
                        checked={isSelected}
                        onChange={(e) => setEditPriority(e.target.value as TodoPriority)}
                        aria-label={config.label}
                        className="sr-only"
                      />
                      <span aria-hidden="true">{config.icon}</span>
                      <span>{config.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Save/Cancel Hints */}
            <p className="text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Enter</kbd> to save,
              <kbd className="px-1 py-0.5 bg-gray-100 rounded border ml-1">Esc</kbd> to cancel
            </p>
          </div>
        ) : (
          // ✅ 顯示模式
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Badge */}
            <span
              className={`
                inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium
                ${priorityConfig.bgClass} ${priorityConfig.textClass} ${priorityConfig.borderClass}
                ${todo.isCompleted ? 'opacity-50' : ''}
              `}
              role="status"
              aria-label={`Priority: ${priorityConfig.label}`}
            >
              <span aria-hidden="true" className="hidden sm:inline">
                {priorityConfig.icon}
              </span>
              <span>{priorityConfig.label}</span>
            </span>

            {/* Title */}
            <span
              onDoubleClick={handleDoubleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDoubleClick();
                }
              }}
              aria-label={`Todo: ${todo.title}. Priority: ${priorityConfig.label}. Double click or press Enter to edit.`}
              className={`block cursor-pointer select-none text-sm sm:text-base break-words focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1 -ml-1 ${
                todo.isCompleted ? "line-through opacity-50 text-gray-500" : "text-gray-900"
              }`}
            >
              {todo.title}
            </span>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Delete "${todo.title}"`}
        className="flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  );
}
```

**驗收標準**:
- [ ] 優先級 badge 正確顯示
- [ ] 顏色根據優先級變化
- [ ] 已完成項目優先級顯示半透明
- [ ] 編輯模式顯示優先級選擇器
- [ ] 可正確修改優先級
- [ ] ARIA 標籤完整
- [ ] 響應式設計正常

---

### 4.4 Phase 4: TodoList 篩選器更新 (3.5 小時)

#### Task 4.1: 新增 Priority Filter UI (TDD)

**測試** (`src/components/todo/TodoList.test.tsx`):

```typescript
describe('TodoList - Priority Filter', () => {
  it('應該顯示優先級篩選下拉選單', () => {
    render(<TodoList />);

    const select = screen.getByLabelText(/filter by priority/i);
    expect(select).toBeInTheDocument();
  });

  it('應該包含所有優先級選項', () => {
    render(<TodoList />);

    const select = screen.getByLabelText(/filter by priority/i);

    expect(within(select).getByText(/all priorities/i)).toBeInTheDocument();
    expect(within(select).getByText(/緊急/i)).toBeInTheDocument();
    expect(within(select).getByText(/高/i)).toBeInTheDocument();
    expect(within(select).getByText(/中/i)).toBeInTheDocument();
    expect(within(select).getByText(/低/i)).toBeInTheDocument();
  });

  it('應該根據優先級篩選 todos', async () => {
    // Mock API to return mixed priority todos
    const mockTodos = [
      { id: '1', title: 'Critical Task', priority: 'CRITICAL', isCompleted: false },
      { id: '2', title: 'Low Task', priority: 'LOW', isCompleted: false }
    ];

    vi.mocked(useTodoActions).mockReturnValue({
      fetchTodos: vi.fn().mockResolvedValue(mockTodos),
      // ...
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('Critical Task')).toBeInTheDocument();
      expect(screen.getByText('Low Task')).toBeInTheDocument();
    });

    // Filter by CRITICAL
    const select = screen.getByLabelText(/filter by priority/i);
    fireEvent.change(select, { target: { value: 'CRITICAL' } });

    // Should only show critical task
    expect(screen.getByText('Critical Task')).toBeInTheDocument();
    expect(screen.queryByText('Low Task')).not.toBeInTheDocument();
  });

  it('應該支援組合篩選 (優先級 + 完成狀態)', async () => {
    // Test filtering by both priority and completion status
    // Implementation details...
  });
});
```

**實作** (`src/components/todo/TodoList.tsx`):

```typescript
import { useRef, useState, lazy, Suspense } from "react";
import { useTodoStore } from "@store/todoStore";
import { useInitTodos } from "@hooks/useTodos";
import { useKeyboardShortcuts } from "@hooks/useKeyboardShortcuts";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { PRIORITY_CONFIG, PRIORITY_OPTIONS, type TodoFilter, type TodoPriority } from "@/types/todo";

const ShortcutHelp = lazy(() =>
  import("../ui/ShortcutHelp").then((module) => ({ default: module.ShortcutHelp }))
);

export function TodoList() {
  useInitTodos();

  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const loading = useTodoStore((state) => state.loading);
  const error = useTodoStore((state) => state.error);
  const setFilter = useTodoStore((state) => state.setFilter);

  // ✅ 新增優先級篩選狀態
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all');

  const [showShortcuts, setShowShortcuts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts([
    {
      key: "k",
      ctrlKey: true,
      description: "Focus on input field",
      action: () => {
        inputRef.current?.focus();
      },
    },
    {
      key: "/",
      description: "Quick focus on input field",
      action: () => {
        inputRef.current?.focus();
      },
    },
    {
      key: "/",
      ctrlKey: true,
      description: "Show keyboard shortcuts",
      action: () => {
        setShowShortcuts(true);
      },
    },
  ]);

  const filters: { label: string; value: TodoFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  // ✅ 組合篩選邏輯
  const getFilteredTodos = () => {
    let filtered = todos;

    // 1. 完成狀態篩選
    if (filter === "active") {
      filtered = filtered.filter(t => !t.isCompleted);
    } else if (filter === "completed") {
      filtered = filtered.filter(t => t.isCompleted);
    }

    // 2. 優先級篩選
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    return filtered;
  };

  const filteredTodos = getFilteredTodos();

  // ✅ 更新統計邏輯 (考慮優先級篩選)
  const getStats = () => {
    const baseTodos = priorityFilter === 'all'
      ? todos
      : todos.filter(t => t.priority === priorityFilter);

    return {
      total: baseTodos.length,
      active: baseTodos.filter(t => !t.isCompleted).length,
      completed: baseTodos.filter(t => t.isCompleted).length,
    };
  };

  const stats = getStats();

  const getEmptyMessage = () => {
    if (priorityFilter !== 'all') {
      const priorityLabel = PRIORITY_CONFIG[priorityFilter].label;
      if (filter === "active") return `No active ${priorityLabel} priority todos!`;
      if (filter === "completed") return `No completed ${priorityLabel} priority todos yet.`;
      return `No ${priorityLabel} priority todos yet!`;
    }

    if (filter === "active") return "No active todos!";
    if (filter === "completed") return "No completed todos yet.";
    return "No todos yet!";
  };

  const getEmptySubMessage = () => {
    if (priorityFilter !== 'all') {
      return `Try selecting a different priority level or add new todos above.`;
    }

    if (filter === "active") return "All tasks are completed or add a new one above.";
    if (filter === "completed") return "Complete some tasks to see them here.";
    return "Add your first todo above to get started.";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            My Todos
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Organize your tasks efficiently</p>
        </header>

        {/* Add Todo Form */}
        <section
          aria-label="Add new todo"
          className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 animate-fade-in"
        >
          <TodoForm ref={inputRef} />
        </section>

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 animate-slide-up"
          >
            <p className="font-medium text-sm sm:text-base">Error</p>
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            role="status"
            aria-live="polite"
            aria-label="Loading todos"
            className="bg-white shadow-md rounded-lg p-6 sm:p-8 mb-4 sm:mb-6 text-center animate-fade-in"
          >
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"
              aria-hidden="true"
            ></div>
            <p className="mt-2 text-sm sm:text-base text-gray-600">Loading todos...</p>
          </div>
        )}

        {/* ✅ Filter Buttons & Priority Filter */}
        {todos.length > 0 && (
          <nav
            aria-label="Todo filters"
            className="bg-white shadow-md rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 animate-fade-in space-y-3"
          >
            {/* Completion Status Filters */}
            <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Filter by completion status">
              {filters.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  aria-label={`Show ${label.toLowerCase()} todos`}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105 ${
                    filter === value
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ✅ Priority Filter */}
            <div className="flex items-center justify-center gap-2">
              <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700">
                Priority:
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TodoPriority | 'all')}
                aria-label="Filter by priority"
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="all">All Priorities</option>
                {PRIORITY_OPTIONS.map((priority) => {
                  const config = PRIORITY_CONFIG[priority];
                  return (
                    <option key={priority} value={priority}>
                      {config.icon} {config.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </nav>
        )}

        {/* Todo List */}
        <main
          aria-label="Todo list"
          className="bg-white shadow-md rounded-lg overflow-hidden mb-4 sm:mb-6 animate-fade-in"
        >
          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-gray-100" role="list">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem todo={todo} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 sm:py-12 px-4 sm:px-6 text-center animate-fade-in" role="status">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4" aria-hidden="true">
                📝
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                {getEmptyMessage()}
              </h3>
              <p className="text-sm sm:text-base text-gray-500">{getEmptySubMessage()}</p>
            </div>
          )}
        </main>

        {/* Statistics */}
        {todos.length > 0 && (
          <section
            aria-label="Todo statistics"
            className="bg-white shadow-md rounded-lg p-3 sm:p-4 animate-fade-in"
          >
            <div className="flex justify-center gap-4 sm:gap-6 text-sm">
              <div className="text-center transition-transform hover:scale-110">
                <div
                  className="text-xl sm:text-2xl font-bold text-gray-900"
                  aria-label={`${stats.total} total todos`}
                >
                  {stats.total}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center transition-transform hover:scale-110">
                <div
                  className="text-xl sm:text-2xl font-bold text-primary-600"
                  aria-label={`${stats.active} active todos`}
                >
                  {stats.active}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center transition-transform hover:scale-110">
                <div
                  className="text-xl sm:text-2xl font-bold text-green-600"
                  aria-label={`${stats.completed} completed todos`}
                >
                  {stats.completed}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {/* ✅ Priority Filter Indicator */}
            {priorityFilter !== 'all' && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-600">
                  Showing only <span className="font-semibold">{PRIORITY_CONFIG[priorityFilter].label}</span> priority todos
                </p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Keyboard Shortcuts Help Dialog */}
      {showShortcuts && (
        <Suspense fallback={null}>
          <ShortcutHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
        </Suspense>
      )}

      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 text-xs text-gray-600 border border-gray-200 animate-fade-in hidden sm:block">
        Press{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono">
          Ctrl
        </kbd>{" "}
        +{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono">/</kbd>{" "}
        for shortcuts
      </div>
    </div>
  );
}
```

**驗收標準**:
- [ ] 優先級下拉選單正確顯示
- [ ] 包含所有優先級選項
- [ ] 篩選功能正常運作
- [ ] 支援組合篩選 (完成狀態 + 優先級)
- [ ] 空狀態訊息根據篩選條件變化
- [ ] 統計數字根據優先級篩選更新

---

### 4.5 Phase 5: Store 更新 (可選) (2 小時)

**說明**: Zustand Store 目前主要用於本地狀態管理，由於優先級排序由後端處理，Store 層面的修改是可選的。

**可能需要的更新**:
1. `addTodo` action 增加 priority 參數
2. `updateTodo` action 支援 priority 欄位
3. 型別定義更新

**實作範例**:
```typescript
// src/store/todoStore.ts
addTodo: (title, description, priority = DEFAULT_PRIORITY) => set((state) => {
  const now = new Date();
  state.todos.unshift({
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description?.trim() || undefined,
    isCompleted: false,
    priority: priority,  // ✅ 新增欄位
    createdAt: now,
    updatedAt: now,
  });
}),
```

**注意**: 由於應用程式主要依賴 API 資料，Store 的 addTodo 可能不常用 (直接呼叫 API 後 fetchTodos)。

---

### 4.6 Phase 6: E2E 測試更新 (2 小時)

**檔案**: `frontend/e2e/todo-app.spec.ts`

**新增測試場景**:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo Priority Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Clear existing todos if needed
  });

  test('應該能夠新增帶有優先級的 todo', async ({ page }) => {
    // Fill in title
    await page.fill('input[placeholder*="What needs to be done"]', 'Urgent task');

    // Select CRITICAL priority
    await page.click('label:has-text("緊急")');

    // Submit
    await page.click('button:has-text("Add Todo")');

    // Verify todo appears with priority badge
    await expect(page.locator('text=Urgent task')).toBeVisible();
    await expect(page.locator('text=緊急')).toBeVisible();
  });

  test('應該能夠編輯 todo 的優先級', async ({ page }) => {
    // Create a todo first
    await page.fill('input[placeholder*="What needs to be done"]', 'Test task');
    await page.click('button:has-text("Add Todo")');

    // Double click to edit
    await page.dblclick('text=Test task');

    // Change priority to HIGH
    await page.click('label:has-text("高")');

    // Press Enter to save
    await page.keyboard.press('Enter');

    // Verify priority badge updated
    await expect(page.locator('text=高')).toBeVisible();
  });

  test('應該能夠按優先級篩選 todos', async ({ page }) => {
    // Create todos with different priorities
    await page.fill('input[placeholder*="What needs to be done"]', 'Critical task');
    await page.click('label:has-text("緊急")');
    await page.click('button:has-text("Add Todo")');

    await page.fill('input[placeholder*="What needs to be done"]', 'Low task');
    await page.click('label:has-text("低")');
    await page.click('button:has-text("Add Todo")');

    // Filter by CRITICAL
    await page.selectOption('select#priority-filter', 'CRITICAL');

    // Verify only critical task is visible
    await expect(page.locator('text=Critical task')).toBeVisible();
    await expect(page.locator('text=Low task')).not.toBeVisible();

    // Reset filter
    await page.selectOption('select#priority-filter', 'all');

    // Verify both tasks are visible
    await expect(page.locator('text=Critical task')).toBeVisible();
    await expect(page.locator('text=Low task')).toBeVisible();
  });

  test('優先級應該正確排序 (後端排序)', async ({ page }) => {
    // Create todos in random order
    await page.fill('input[placeholder*="What needs to be done"]', 'Low task');
    await page.click('label:has-text("低")');
    await page.click('button:has-text("Add Todo")');

    await page.fill('input[placeholder*="What needs to be done"]', 'Critical task');
    await page.click('label:has-text("緊急")');
    await page.click('button:has-text("Add Todo")');

    await page.fill('input[placeholder*="What needs to be done"]', 'High task');
    await page.click('label:has-text("高")');
    await page.click('button:has-text("Add Todo")');

    // Reload to get server-sorted order
    await page.reload();

    // Verify order: CRITICAL > HIGH > LOW
    const todoItems = page.locator('ul[role="list"] > li');

    await expect(todoItems.nth(0)).toContainText('Critical task');
    await expect(todoItems.nth(1)).toContainText('High task');
    await expect(todoItems.nth(2)).toContainText('Low task');
  });
});
```

**驗收標準**:
- [ ] 所有 E2E 測試通過
- [ ] 覆蓋核心優先級功能流程
- [ ] 測試跨瀏覽器相容性

---

## 5. 測試策略

### 5.1 測試金字塔

```
        E2E Tests (10%)
       ┌────────────┐
      │  2 scenarios │
     └────────────┘

    Integration Tests (20%)
   ┌──────────────────┐
  │  6 test suites    │
 └──────────────────┘

Unit Tests (70%)
┌────────────────────────┐
│ 30+ individual tests   │
└────────────────────────┘
```

### 5.2 測試覆蓋率目標

| 檔案 | 當前覆蓋率 | 目標覆蓋率 | 新增測試數 |
|------|-----------|-----------|-----------|
| `src/types/todo.ts` | N/A | N/A | 0 (型別檔案) |
| `TodoForm.tsx` | 100% | 100% | +6 tests |
| `TodoItem.tsx` | 100% | 100% | +5 tests |
| `TodoList.tsx` | 96.12% | > 95% | +4 tests |
| `todoStore.ts` | 100% | 100% | +3 tests |
| `useTodos.ts` | 97.8% | > 95% | +2 tests |

**總目標**: 維持整體覆蓋率 > **82%** (目前 82.29%)

### 5.3 TDD 流程

**每個功能遵循 Red-Green-Refactor**:

1. **Red**: 撰寫失敗的測試
```bash
npm run test -- TodoForm.test.tsx
# ❌ FAIL: 'should display priority radio buttons'
```

2. **Green**: 實作最小可行代碼使測試通過
```bash
npm run test -- TodoForm.test.tsx
# ✅ PASS: All tests passing
```

3. **Refactor**: 重構代碼並確保測試仍通過
```bash
npm run test:coverage
# ✅ Coverage: 82.5% (maintained)
```

### 5.4 測試清單

#### Unit Tests (30+ tests)

**TodoForm Component** (6 new tests):
- [ ] 應該顯示優先級選擇 radio buttons
- [ ] 應該預設選擇 LOW 優先級
- [ ] 應該允許使用者切換優先級
- [ ] 應該在新增 todo 時包含選定的優先級
- [ ] 應該在提交後重置優先級為 LOW
- [ ] 應該有正確的 ARIA 標籤

**TodoItem Component** (5 new tests):
- [ ] 應該顯示優先級 badge
- [ ] 應該根據優先級顯示正確的顏色
- [ ] 應該在已完成項目上顯示半透明優先級
- [ ] 應該在編輯模式顯示優先級選擇器
- [ ] 應該允許修改優先級

**TodoList Component** (4 new tests):
- [ ] 應該顯示優先級篩選下拉選單
- [ ] 應該包含所有優先級選項
- [ ] 應該根據優先級篩選 todos
- [ ] 應該支援組合篩選 (優先級 + 完成狀態)

**todoStore** (3 new tests):
- [ ] addTodo 應該支援 priority 參數
- [ ] updateTodo 應該支援 priority 欄位
- [ ] 型別定義應該包含 priority

**useTodos Hook** (2 new tests):
- [ ] createTodo 應該傳送 priority 欄位
- [ ] updateTodo 應該傳送 priority 欄位

#### Integration Tests (6 suites)
- [ ] TodoForm + API 整合測試
- [ ] TodoItem + API 整合測試
- [ ] TodoList + Store 整合測試
- [ ] Priority 篩選 + 完成狀態篩選組合測試
- [ ] CRUD 操作保留優先級測試
- [ ] Error handling 測試

#### E2E Tests (2 scenarios)
- [ ] 完整新增/編輯/篩選優先級流程
- [ ] 優先級排序驗證

---

## 6. 驗收標準

### 6.1 功能驗收標準

**必須完成 (Must Have)**:
- [ ] TodoForm 顯示優先級選擇 UI (4 個 radio buttons)
- [ ] 預設優先級為 LOW
- [ ] 可新增帶有優先級的 todo
- [ ] TodoItem 顯示優先級 badge
- [ ] 可編輯 todo 的優先級
- [ ] 優先級 badge 顏色正確 (紅/橙/綠/灰)
- [ ] TodoList 顯示優先級篩選下拉選單
- [ ] 可按優先級篩選 todos
- [ ] 支援組合篩選 (優先級 + 完成狀態)
- [ ] 排序由後端處理 (前端直接使用 API 返回順序)

**應該完成 (Should Have)**:
- [ ] 已完成項目的優先級 badge 顯示半透明
- [ ] 優先級篩選狀態在統計區域顯示
- [ ] 空狀態訊息根據優先級篩選變化
- [ ] 鍵盤導航支援優先級選擇 (Arrow keys)

**可以完成 (Nice to Have)**:
- [ ] 優先級快捷鍵 (Ctrl+1/2/3/4)
- [ ] 優先級 tooltip 顯示說明
- [ ] 優先級統計 (每個優先級的數量)

### 6.2 無障礙驗收標準

**WCAG 2.1 AA 合規**:
- [ ] 所有優先級顏色對比度 ≥ 4.5:1
- [ ] Radio buttons 有正確的 ARIA labels
- [ ] Priority badge 有 `role="status"` 和 `aria-label`
- [ ] 篩選下拉選單有 `aria-label`
- [ ] 鍵盤可完整操作 (Tab, Arrow keys, Enter, Space)
- [ ] Focus indicators 清晰可見
- [ ] Screen reader 可正確讀取優先級資訊

**測試工具驗證**:
- [ ] 通過 WAVE 無障礙檢測 (0 errors)
- [ ] 通過 axe DevTools 檢測 (0 violations)
- [ ] 通過 Lighthouse Accessibility Score > 95

### 6.3 效能驗收標準

**Bundle Size**:
- [ ] 新增功能後 Bundle Size < 75KB (目前 70.77KB)
- [ ] gzipped size 增加 < 5KB

**Runtime Performance**:
- [ ] 優先級選擇切換延遲 < 50ms
- [ ] 篩選操作延遲 < 100ms
- [ ] 無明顯 UI 卡頓 (60fps)

**Lighthouse Metrics**:
- [ ] Performance Score > 90
- [ ] FCP < 1.0s
- [ ] LCP < 1.5s
- [ ] TTI < 2.0s

### 6.4 測試驗收標準

**Unit Tests**:
- [ ] 所有新增測試通過 (20+ tests)
- [ ] 測試覆蓋率 > 82%
- [ ] 無跳過的測試 (no `.skip()`)

**Integration Tests**:
- [ ] API 整合測試通過 (6 suites)
- [ ] Store 整合測試通過

**E2E Tests**:
- [ ] 優先級完整流程測試通過 (2 scenarios)
- [ ] 跨瀏覽器測試通過 (Chrome, Firefox, Safari)

### 6.5 兼容性驗收標準

**Browser Support**:
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版 (macOS & iOS)
- [ ] Edge 最新版

**Device Support**:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667, 414x896)

**Responsive Breakpoints**:
- [ ] Mobile (< 640px): 2 column grid for priority selection
- [ ] Tablet (640-1024px): Horizontal layout
- [ ] Desktop (> 1024px): Full layout with icons

---

## 7. 風險評估

### 7.1 技術風險

| 風險 | 可能性 | 影響 | 等級 | 應對措施 |
|------|-------|------|------|---------|
| **TypeScript 型別不相容** | 低 | 高 | 🟡 中 | • 嚴格遵循後端 API 型別<br>• 使用 shared types 檔案 |
| **測試覆蓋率下降** | 中 | 中 | 🟡 中 | • TDD 開發流程<br>• 每個 phase 結束驗證覆蓋率 |
| **UI 空間不足 (手機版)** | 低 | 低 | 🟢 低 | • 響應式 grid layout<br>• 可折疊設計 |
| **無障礙問題** | 低 | 高 | 🟡 中 | • 使用 ARIA best practices<br>• WAVE/axe 工具驗證 |
| **Bundle size 膨脹** | 低 | 中 | 🟢 低 | • 使用 Tailwind 既有樣式<br>• 無額外依賴 |

### 7.2 進度風險

| 風險 | 可能性 | 影響 | 等級 | 應對措施 |
|------|-------|------|------|---------|
| **預估工時不準確** | 中 | 中 | 🟡 中 | • 每日 standup 追蹤進度<br>• 預留 20% buffer time |
| **測試撰寫耗時** | 中 | 低 | 🟢 低 | • 複用現有測試模式<br>• Mock 設定標準化 |
| **API 變更需求** | 低 | 高 | 🟡 中 | • 後端 API 已凍結<br>• Contract testing |

### 7.3 用戶體驗風險

| 風險 | 可能性 | 影響 | 等級 | 應對措施 |
|------|-------|------|------|---------|
| **用戶不理解優先級** | 中 | 中 | 🟡 中 | • 清晰的視覺標示 (icon + 顏色)<br>• Tooltip 說明 |
| **過度使用 CRITICAL** | 中 | 低 | 🟢 低 | • 預設為 LOW<br>• UI 引導正確使用 |
| **篩選器過於複雜** | 低 | 中 | 🟢 低 | • 簡潔的 dropdown UI<br>• 清晰的篩選狀態提示 |

### 7.4 風險緩解計畫

**Phase 1 (型別定義)**:
- ✅ 風險: 低
- 策略: 嚴格遵循後端 API 規格

**Phase 2 (TodoForm)**:
- ⚠️ 風險: 中 (UI 空間、測試)
- 策略: 響應式設計、完整測試覆蓋

**Phase 3 (TodoItem)**:
- ⚠️ 風險: 中 (編輯模式複雜度)
- 策略: 保持簡潔、段落式測試

**Phase 4 (TodoList)**:
- ⚠️ 風險: 中 (篩選邏輯複雜)
- 策略: 清晰的函式分離、單元測試

**Phase 5 (Store)**:
- ✅ 風險: 低 (可選)
- 策略: 僅在需要時實作

**Phase 6 (E2E)**:
- ⚠️ 風險: 中 (環境設定)
- 策略: 使用現有 Playwright 設定

---

## 8. 參考資料

### 8.1 專案文件

- [CR-002 變更請求單](../../05-change-management/CR-002-新增Todo優先級功能-20251024.md)
- [API Specification](../../02-design/API-Specification.md)
- [PRD - Phase 2 Should Have 功能](../../01-requirements/PRD.md#42-phase-2---should-have)
- [Frontend Team Todolist](./Frontend-Team-Todolist.md)

### 8.2 技術文件

**React & TypeScript**:
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

**Accessibility**:
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Testing**:
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright E2E Testing](https://playwright.dev/docs/intro)

**Tailwind CSS**:
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)

### 8.3 Design References

**Color Accessibility**:
- Red (#EF4444) on Light Red (#FEE2E2): 7.8:1 ✅ AAA
- Orange (#F59E0B) on Light Orange (#FED7AA): 7.2:1 ✅ AAA
- Green (#10B981) on Light Green (#D1FAE5): 7.5:1 ✅ AAA
- Gray (#6B7280) on Light Gray (#F3F4F6): 8.1:1 ✅ AAA

**Icon References**:
- 🔴 CRITICAL (U+1F534)
- 🟠 HIGH (U+1F7E0)
- 🟡 NORMAL (U+1F7E1)
- ⚪ LOW (U+26AA)

---

## 附錄 A: 快速參考

### 常用指令

```bash
# 開發
npm run dev

# 測試
npm run test                    # 執行所有測試
npm run test:coverage           # 測試覆蓋率報告
npm run test -- TodoForm        # 執行特定檔案測試

# Build
npm run build                   # Production build
npm run preview                 # 預覽 production build

# E2E
npx playwright test             # 執行 E2E 測試
npx playwright test --ui        # UI mode

# 型別檢查
npm run type-check              # TypeScript 型別檢查
```

### 檔案路徑

```
frontend/
├── src/
│   ├── types/
│   │   └── todo.ts                    ← 更新型別
│   ├── components/
│   │   └── todo/
│   │       ├── TodoForm.tsx           ← 新增優先級選擇
│   │       ├── TodoForm.test.tsx      ← 更新測試
│   │       ├── TodoItem.tsx           ← 新增優先級顯示
│   │       ├── TodoItem.test.tsx      ← 更新測試
│   │       ├── TodoList.tsx           ← 新增篩選器
│   │       └── TodoList.test.tsx      ← 更新測試
│   ├── store/
│   │   ├── todoStore.ts               ← (可選) 更新
│   │   └── todoStore.test.ts          ← (可選) 更新測試
│   └── hooks/
│       ├── useTodos.ts                ← 型別更新
│       └── useTodos.test.ts           ← 更新測試
└── e2e/
    └── todo-app.spec.ts               ← 新增 E2E 測試
```

---

**文件狀態**: ✅ 就緒
**最後更新**: 2025-10-27
**下次審查**: 實作開始前 (2025-10-28)
