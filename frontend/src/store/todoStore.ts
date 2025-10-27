import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Todo, TodoFilter, TodoStats } from "@/types/todo";
import { DEFAULT_PRIORITY } from "@/types/todo";

/**
 * TodoStore State Interface
 * Defines the complete state structure and actions for the Todo store
 */
interface TodoState {
  // State
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;

  // Actions
  setTodos: (todos: Todo[]) => void;
  addTodo: (title: string, description?: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Selectors
  getFilteredTodos: () => Todo[];
  getStats: () => TodoStats;
}

/**
 * Todo Store using Zustand
 *
 * Features:
 * - Immer middleware for immutable updates
 * - DevTools middleware for Redux DevTools integration
 * - API-only data persistence (no localStorage)
 *
 * Note: All data is fetched from and persisted to the backend API.
 * The store serves as an in-memory cache only.
 *
 * @see .doc/Frontend-Team-Todolist.md Task 2.2
 */
export const useTodoStore = create<TodoState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      todos: [],
      filter: "all",
      loading: false,
      error: null,

      // Set entire todos array (used for API sync)
      setTodos: (todos) => set({ todos }),

      // Add a new todo (CR-002: includes default priority)
      addTodo: (title, description) =>
        set((state) => {
          const now = new Date();
          state.todos.unshift({
            id: crypto.randomUUID(),
            title: title.trim(),
            description: description?.trim() || undefined,
            isCompleted: false,
            priority: DEFAULT_PRIORITY,
            createdAt: now,
            updatedAt: now,
          });
        }),

      // Toggle todo completion status
      toggleTodo: (id) =>
        set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          if (todo) {
            todo.isCompleted = !todo.isCompleted;
            todo.completedAt = todo.isCompleted ? new Date() : undefined;
            todo.updatedAt = new Date();
          }
        }),

      // Update todo fields
      updateTodo: (id, updates) =>
        set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          if (todo) {
            Object.assign(todo, updates, { updatedAt: new Date() });
          }
        }),

      // Delete a todo
      deleteTodo: (id) =>
        set((state) => {
          state.todos = state.todos.filter((t) => t.id !== id);
        }),

      // Set current filter
      setFilter: (filter) => set({ filter }),

      // Set loading state
      setLoading: (loading) => set({ loading }),

      // Set error message
      setError: (error) => set({ error }),

      // Get filtered todos based on current filter
      getFilteredTodos: () => {
        const { todos, filter } = get();
        if (filter === "active") return todos.filter((t) => !t.isCompleted);
        if (filter === "completed") return todos.filter((t) => t.isCompleted);
        return todos;
      },

      // Get todo statistics
      getStats: () => {
        const todos = get().todos;
        return {
          total: todos.length,
          active: todos.filter((t) => !t.isCompleted).length,
          completed: todos.filter((t) => t.isCompleted).length,
        };
      },
    })),
    { name: "TodoStore" }
  )
);
