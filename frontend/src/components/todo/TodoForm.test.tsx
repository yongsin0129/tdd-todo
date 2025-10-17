import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoForm } from './TodoForm';
import { useTodoStore } from '@store/todoStore';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TodoForm', () => {
  beforeEach(() => {
    // Reset store before each test
    useTodoStore.setState({
      todos: [],
      filter: 'all',
      loading: false,
      error: null,
    });

    // Clear mock
    vi.clearAllMocks();

    // Default mock for fetchTodos (returns empty array)
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
  });

  describe('Rendering', () => {
    it('should render the form with input field', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      expect(input).toBeInTheDocument();
    });

    it('should render the submit button', () => {
      render(<TodoForm />);

      const button = screen.getByRole('button', { name: /add todo/i });
      expect(button).toBeInTheDocument();
    });

    it('should render input with correct attributes', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('maxLength', '255');
    });
  });

  describe('Input Validation', () => {
    it('should show error when submitting empty title', () => {
      render(<TodoForm />);

      const button = screen.getByRole('button', { name: /add todo/i });
      fireEvent.click(button);

      expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument();
    });

    it('should show error when submitting whitespace-only title', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(button);

      expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument();
    });

    it('should show error when title exceeds 255 characters', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      const longTitle = 'a'.repeat(256);
      fireEvent.change(input, { target: { value: longTitle } });
      fireEvent.click(button);

      expect(screen.getByText(/title must be less than 255 characters/i)).toBeInTheDocument();
    });

    it('should clear error when user starts typing', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      // Trigger error
      fireEvent.click(button);
      expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument();

      // Start typing
      fireEvent.change(input, { target: { value: 'New Todo' } });
      expect(screen.queryByText(/title cannot be empty/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should add todo to store when submitting valid title', async () => {
      const newTodo = {
        id: '1',
        title: 'New Todo',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock: createTodo + fetchTodos
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: newTodo }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: [newTodo] }),
        });

      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      fireEvent.change(input, { target: { value: 'New Todo' } });
      fireEvent.click(button);

      await waitFor(() => {
        const todos = useTodoStore.getState().todos;
        expect(todos).toHaveLength(1);
        expect(todos[0].title).toBe('New Todo');
      });
    });

    it('should clear input after successful submission', async () => {
      const newTodo = {
        id: '1',
        title: 'New Todo',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock: createTodo + fetchTodos
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: newTodo }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: [newTodo] }),
        });

      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i) as HTMLInputElement;
      const button = screen.getByRole('button', { name: /add todo/i });

      fireEvent.change(input, { target: { value: 'New Todo' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should clear error after successful submission', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      // Trigger error
      fireEvent.click(button);
      expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument();

      // Submit valid todo
      fireEvent.change(input, { target: { value: 'New Todo' } });
      fireEvent.click(button);

      expect(screen.queryByText(/title cannot be empty/i)).not.toBeInTheDocument();
    });

    it('should trim whitespace from title before submission', async () => {
      const newTodo = {
        id: '1',
        title: 'New Todo',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock: createTodo + fetchTodos
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: newTodo }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: [newTodo] }),
        });

      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      fireEvent.change(input, { target: { value: '  New Todo  ' } });
      fireEvent.click(button);

      await waitFor(() => {
        const todos = useTodoStore.getState().todos;
        expect(todos[0].title).toBe('New Todo');
      });
    });

    it('should handle Enter key submission', async () => {
      const newTodo = {
        id: '1',
        title: 'New Todo',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock: createTodo + fetchTodos
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: newTodo }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: [newTodo] }),
        });

      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      fireEvent.change(input, { target: { value: 'New Todo' } });
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        const todos = useTodoStore.getState().todos;
        expect(todos).toHaveLength(1);
        expect(todos[0].title).toBe('New Todo');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible error messages with role="alert"', () => {
      render(<TodoForm />);

      const button = screen.getByRole('button', { name: /add todo/i });
      fireEvent.click(button);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(/title cannot be empty/i);
    });

    it('should have accessible form structure', () => {
      render(<TodoForm />);

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should focus input on mount', async () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });
  });

  describe('User Experience', () => {
    it('should allow typing in the input field', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'Test Todo' } });

      expect(input.value).toBe('Test Todo');
    });

    it('should accept titles exactly 255 characters', async () => {
      const maxTitle = 'a'.repeat(255);
      const newTodo = {
        id: '1',
        title: maxTitle,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock: createTodo + fetchTodos
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: newTodo }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: [newTodo] }),
        });

      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      fireEvent.change(input, { target: { value: maxTitle } });
      fireEvent.click(button);

      await waitFor(() => {
        const todos = useTodoStore.getState().todos;
        expect(todos).toHaveLength(1);
        expect(todos[0].title).toBe(maxTitle);
      });
    });

    it('should handle rapid submissions gracefully', async () => {
      const todos = [
        {
          id: '1',
          title: 'Todo 1',
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Todo 2',
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          title: 'Todo 3',
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock: all create/fetch pairs
      mockFetch
        // First todo create + fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: todos[0] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: [todos[0]] }),
        })
        // Second todo create + fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: todos[1] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: [todos[0], todos[1]] }),
        })
        // Third todo create + fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: todos[2] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: todos }),
        });

      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const button = screen.getByRole('button', { name: /add todo/i });

      // Submit 3 todos rapidly
      fireEvent.change(input, { target: { value: 'Todo 1' } });
      fireEvent.click(button);

      await waitFor(() => expect(useTodoStore.getState().todos).toHaveLength(1));

      fireEvent.change(input, { target: { value: 'Todo 2' } });
      fireEvent.click(button);

      await waitFor(() => expect(useTodoStore.getState().todos).toHaveLength(2));

      fireEvent.change(input, { target: { value: 'Todo 3' } });
      fireEvent.click(button);

      await waitFor(() => {
        const finalTodos = useTodoStore.getState().todos;
        expect(finalTodos).toHaveLength(3);
      });
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes to input', () => {
      render(<TodoForm />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      expect(input).toHaveClass('w-full');
      expect(input.className).toMatch(/px-/); // Responsive padding
      expect(input.className).toMatch(/py-/); // Responsive padding
    });

    it('should apply correct CSS classes to button', () => {
      render(<TodoForm />);

      const button = screen.getByRole('button', { name: /add todo/i });

      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('should show error text in red color', () => {
      render(<TodoForm />);

      const button = screen.getByRole('button', { name: /add todo/i });
      fireEvent.click(button);

      const error = screen.getByText(/title cannot be empty/i);
      expect(error).toHaveClass('text-red-600');
    });
  });
});
