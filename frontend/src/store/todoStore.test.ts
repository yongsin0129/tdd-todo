import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from './todoStore';

describe('TodoStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useTodoStore.setState({
      todos: [],
      filter: 'all',
      loading: false,
      error: null,
    });
  });

  describe('addTodo', () => {
    it('should add a new todo to the beginning of the list', () => {
      const { addTodo } = useTodoStore.getState();

      addTodo('Test Todo');

      const todos = useTodoStore.getState().todos;
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Test Todo');
      expect(todos[0].isCompleted).toBe(false);
    });

    it('should trim whitespace from title', () => {
      const { addTodo } = useTodoStore.getState();

      addTodo('  Test Todo  ');

      const todos = useTodoStore.getState().todos;
      expect(todos[0].title).toBe('Test Todo');
    });

    it('should add todo with description', () => {
      const { addTodo } = useTodoStore.getState();

      addTodo('Test Todo', 'Test Description');

      const todos = useTodoStore.getState().todos;
      expect(todos[0].description).toBe('Test Description');
    });

    it('should trim whitespace from description', () => {
      const { addTodo } = useTodoStore.getState();

      addTodo('Test Todo', '  Test Description  ');

      const todos = useTodoStore.getState().todos;
      expect(todos[0].description).toBe('Test Description');
    });

    it('should generate unique ID for each todo', () => {
      const { addTodo } = useTodoStore.getState();

      addTodo('Todo 1');
      addTodo('Todo 2');

      const todos = useTodoStore.getState().todos;
      expect(todos[0].id).not.toBe(todos[1].id);
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const { addTodo } = useTodoStore.getState();
      const beforeTime = new Date();

      addTodo('Test Todo');

      const todos = useTodoStore.getState().todos;
      const afterTime = new Date();

      expect(todos[0].createdAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(todos[0].createdAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      expect(todos[0].updatedAt.getTime()).toBe(todos[0].createdAt.getTime());
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion status from false to true', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const todoId = useTodoStore.getState().todos[0].id;

      toggleTodo(todoId);

      const todo = useTodoStore.getState().todos[0];
      expect(todo.isCompleted).toBe(true);
    });

    it('should toggle todo completion status from true to false', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const todoId = useTodoStore.getState().todos[0].id;

      toggleTodo(todoId);
      toggleTodo(todoId);

      const todo = useTodoStore.getState().todos[0];
      expect(todo.isCompleted).toBe(false);
    });

    it('should set completedAt when marking as complete', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const todoId = useTodoStore.getState().todos[0].id;

      toggleTodo(todoId);

      const todo = useTodoStore.getState().todos[0];
      expect(todo.completedAt).toBeInstanceOf(Date);
    });

    it('should clear completedAt when marking as incomplete', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const todoId = useTodoStore.getState().todos[0].id;

      toggleTodo(todoId);
      toggleTodo(todoId);

      const todo = useTodoStore.getState().todos[0];
      expect(todo.completedAt).toBeUndefined();
    });

    it('should update updatedAt timestamp', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const todoId = useTodoStore.getState().todos[0].id;
      const originalUpdatedAt = useTodoStore.getState().todos[0].updatedAt;

      // Wait a tiny bit to ensure timestamp difference
      setTimeout(() => {
        toggleTodo(todoId);

        const todo = useTodoStore.getState().todos[0];
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('should do nothing if todo ID not found', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const originalTodos = useTodoStore.getState().todos;

      toggleTodo('non-existent-id');

      const todos = useTodoStore.getState().todos;
      expect(todos).toEqual(originalTodos);
    });
  });

  describe('updateTodo', () => {
    it('should update todo title', () => {
      const { addTodo, updateTodo } = useTodoStore.getState();

      addTodo('Original Title');
      const todoId = useTodoStore.getState().todos[0].id;

      updateTodo(todoId, { title: 'Updated Title' });

      const todo = useTodoStore.getState().todos[0];
      expect(todo.title).toBe('Updated Title');
    });

    it('should update todo description', () => {
      const { addTodo, updateTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const todoId = useTodoStore.getState().todos[0].id;

      updateTodo(todoId, { description: 'New Description' });

      const todo = useTodoStore.getState().todos[0];
      expect(todo.description).toBe('New Description');
    });

    it('should update updatedAt timestamp', () => {
      const { addTodo, updateTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const todoId = useTodoStore.getState().todos[0].id;
      const originalUpdatedAt = useTodoStore.getState().todos[0].updatedAt;

      setTimeout(() => {
        updateTodo(todoId, { title: 'Updated' });

        const todo = useTodoStore.getState().todos[0];
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('should do nothing if todo ID not found', () => {
      const { addTodo, updateTodo } = useTodoStore.getState();

      addTodo('Test Todo');
      const originalTodos = useTodoStore.getState().todos;

      updateTodo('non-existent-id', { title: 'Updated' });

      const todos = useTodoStore.getState().todos;
      expect(todos).toEqual(originalTodos);
    });
  });

  describe('deleteTodo', () => {
    it('should remove todo from the list', () => {
      const { addTodo, deleteTodo } = useTodoStore.getState();

      addTodo('Todo 1');
      addTodo('Todo 2');
      const todoId = useTodoStore.getState().todos[1].id;

      deleteTodo(todoId);

      const todos = useTodoStore.getState().todos;
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Todo 2'); // Todo 2 was added last, so it's at index 0
    });

    it('should do nothing if todo ID not found', () => {
      const { addTodo, deleteTodo } = useTodoStore.getState();

      addTodo('Test Todo');

      deleteTodo('non-existent-id');

      const todos = useTodoStore.getState().todos;
      expect(todos).toHaveLength(1);
    });
  });

  describe('setFilter', () => {
    it('should set filter to "all"', () => {
      const { setFilter } = useTodoStore.getState();

      setFilter('all');

      expect(useTodoStore.getState().filter).toBe('all');
    });

    it('should set filter to "active"', () => {
      const { setFilter } = useTodoStore.getState();

      setFilter('active');

      expect(useTodoStore.getState().filter).toBe('active');
    });

    it('should set filter to "completed"', () => {
      const { setFilter } = useTodoStore.getState();

      setFilter('completed');

      expect(useTodoStore.getState().filter).toBe('completed');
    });
  });

  describe('getFilteredTodos', () => {
    beforeEach(() => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Active Todo 1');
      addTodo('Active Todo 2');
      addTodo('Completed Todo 1');
      addTodo('Completed Todo 2');

      // Mark last two as completed
      const todos = useTodoStore.getState().todos;
      toggleTodo(todos[2].id);
      toggleTodo(todos[3].id);
    });

    it('should return all todos when filter is "all"', () => {
      const { setFilter, getFilteredTodos } = useTodoStore.getState();

      setFilter('all');
      const filtered = getFilteredTodos();

      expect(filtered).toHaveLength(4);
    });

    it('should return only active todos when filter is "active"', () => {
      const { setFilter, getFilteredTodos } = useTodoStore.getState();

      setFilter('active');
      const filtered = getFilteredTodos();

      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => !t.isCompleted)).toBe(true);
    });

    it('should return only completed todos when filter is "completed"', () => {
      const { setFilter, getFilteredTodos } = useTodoStore.getState();

      setFilter('completed');
      const filtered = getFilteredTodos();

      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.isCompleted)).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return stats for empty todo list', () => {
      const { getStats } = useTodoStore.getState();

      const stats = getStats();

      expect(stats).toEqual({
        total: 0,
        active: 0,
        completed: 0,
      });
    });

    it('should return correct stats for mixed todo list', () => {
      const { addTodo, toggleTodo, getStats } = useTodoStore.getState();

      addTodo('Active 1');
      addTodo('Active 2');
      addTodo('Completed 1');

      const todos = useTodoStore.getState().todos;
      toggleTodo(todos[2].id);

      const stats = getStats();

      expect(stats).toEqual({
        total: 3,
        active: 2,
        completed: 1,
      });
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      const { setLoading } = useTodoStore.getState();

      setLoading(true);

      expect(useTodoStore.getState().loading).toBe(true);
    });

    it('should set loading state to false', () => {
      const { setLoading } = useTodoStore.getState();

      setLoading(false);

      expect(useTodoStore.getState().loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const { setError } = useTodoStore.getState();

      setError('Test error message');

      expect(useTodoStore.getState().error).toBe('Test error message');
    });

    it('should clear error by setting to null', () => {
      const { setError } = useTodoStore.getState();

      setError('Test error');
      setError(null);

      expect(useTodoStore.getState().error).toBeNull();
    });
  });

  describe('setTodos', () => {
    it('should replace entire todos array', () => {
      const { setTodos } = useTodoStore.getState();

      const mockTodos = [
        {
          id: '1',
          title: 'Todo 1',
          description: null,
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Todo 2',
          description: null,
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: new Date(),
        },
      ];

      setTodos(mockTodos);

      const todos = useTodoStore.getState().todos;
      expect(todos).toEqual(mockTodos);
    });
  });
});
