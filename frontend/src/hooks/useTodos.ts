import { useEffect } from 'react';
import { useTodoStore } from '@/store/todoStore';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

const API_BASE = '/api';

/**
 * useTodoActions Hook
 *
 * Provides ONLY the action functions for CRUD operations.
 * Does NOT fetch data on mount - use useInitTodos for that.
 *
 * Use this hook in components that need to perform actions but don't need
 * to trigger initial data fetching (TodoForm, TodoItem).
 *
 * @returns Object containing API action functions
 */
export function useTodoActions() {
  const { setTodos, setLoading, setError } = useTodoStore();

  // Fetch all todos from API
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

  // Create a new todo
  const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
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
  };

  // Update an existing todo
  const updateTodo = async (
    id: string,
    updates: UpdateTodoInput
  ): Promise<Todo> => {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    return data.data as Todo;
  };

  // Delete a todo
  const deleteTodo = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error.message);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string): Promise<Todo> => {
    // Get current state from store
    const currentTodo = useTodoStore
      .getState()
      .todos.find((t) => t.id === id);

    if (!currentTodo) {
      throw new Error('Todo not found in store');
    }

    // Toggle completion status
    return updateTodo(id, {
      isCompleted: !currentTodo.isCompleted,
    });
  };

  return {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
}

/**
 * useInitTodos Hook
 *
 * Initializes the todo list by fetching data from API on mount.
 * This hook should ONLY be used in the root TodoList component.
 *
 * IMPORTANT: Do not use this hook in TodoForm or TodoItem components
 * to avoid multiple unnecessary API calls.
 *
 * @returns Object containing API action functions (same as useTodoActions)
 */
export function useInitTodos() {
  const actions = useTodoActions();

  // Fetch todos only once on mount
  useEffect(() => {
    actions.fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return actions;
}

/**
 * @deprecated Use useTodoActions or useInitTodos instead
 *
 * This hook is kept for backward compatibility but will be removed.
 * - Use useInitTodos in TodoList component (fetches on mount)
 * - Use useTodoActions in TodoForm/TodoItem (no fetch on mount)
 */
export function useTodos() {
  return useInitTodos();
}
