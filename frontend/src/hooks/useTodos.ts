import { useEffect } from 'react';
import { useTodoStore } from '@/store/todoStore';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

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

  // 更新待辦事項
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

  // 刪除待辦事項
  const deleteTodo = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error.message);
    }
  };

  // 切換完成狀態
  const toggleTodo = async (id: string): Promise<Todo> => {
    // 先從 store 取得當前狀態
    const currentTodo = useTodoStore
      .getState()
      .todos.find((t) => t.id === id);

    if (!currentTodo) {
      throw new Error('Todo not found in store');
    }

    // 切換完成狀態
    return updateTodo(id, {
      isCompleted: !currentTodo.isCompleted,
    });
  };

  // 初始載入資料
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
}
