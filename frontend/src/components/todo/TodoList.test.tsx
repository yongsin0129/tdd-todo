import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoList } from './TodoList';
import { useTodoStore } from '@store/todoStore';

// Mock useTodos hook to prevent API calls in tests
vi.mock('@hooks/useTodos', () => ({
  useTodoActions: () => ({
    fetchTodos: vi.fn().mockResolvedValue(undefined),
    createTodo: vi.fn().mockResolvedValue(undefined),
    updateTodo: vi.fn().mockResolvedValue(undefined),
    deleteTodo: vi.fn().mockResolvedValue(undefined),
    toggleTodo: vi.fn().mockResolvedValue(undefined),
  }),
  useInitTodos: () => ({
    fetchTodos: vi.fn().mockResolvedValue(undefined),
    createTodo: vi.fn().mockResolvedValue(undefined),
    updateTodo: vi.fn().mockResolvedValue(undefined),
    deleteTodo: vi.fn().mockResolvedValue(undefined),
    toggleTodo: vi.fn().mockResolvedValue(undefined),
  }),
  useTodos: () => ({
    fetchTodos: vi.fn().mockResolvedValue(undefined),
    createTodo: vi.fn().mockResolvedValue(undefined),
    updateTodo: vi.fn().mockResolvedValue(undefined),
    deleteTodo: vi.fn().mockResolvedValue(undefined),
    toggleTodo: vi.fn().mockResolvedValue(undefined),
  }),
}));

// Mock useKeyboardShortcuts hook to prevent keyboard event listeners in tests
vi.mock('@hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn(),
}));

describe('TodoList', () => {
  beforeEach(() => {
    // Reset store before each test
    useTodoStore.setState({
      todos: [],
      filter: 'all',
      loading: false,
      error: null,
    });
  });

  describe('Rendering - Empty State', () => {
    it('should render TodoForm', () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      expect(input).toBeInTheDocument();
    });

    it('should show empty state message when no todos', () => {
      render(<TodoList />);

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });

    it('should show helpful message in empty state', () => {
      render(<TodoList />);

      expect(screen.getByText(/add your first todo above/i)).toBeInTheDocument();
    });
  });

  describe('Rendering - With Todos', () => {
    beforeEach(() => {
      useTodoStore.setState({
        todos: [
          {
            id: '1',
            title: 'Active Todo 1',
            description: null,
            isCompleted: false,
            createdAt: new Date('2025-10-17T10:00:00.000Z'),
            updatedAt: new Date('2025-10-17T10:00:00.000Z'),
          },
          {
            id: '2',
            title: 'Active Todo 2',
            description: null,
            isCompleted: false,
            createdAt: new Date('2025-10-17T10:01:00.000Z'),
            updatedAt: new Date('2025-10-17T10:01:00.000Z'),
          },
          {
            id: '3',
            title: 'Completed Todo 1',
            description: null,
            isCompleted: true,
            createdAt: new Date('2025-10-17T10:02:00.000Z'),
            updatedAt: new Date('2025-10-17T10:03:00.000Z'),
            completedAt: new Date('2025-10-17T10:03:00.000Z'),
          },
        ],
        filter: 'all',
        loading: false,
        error: null,
      });
    });

    it('should render all todos', () => {
      render(<TodoList />);

      expect(screen.getByText('Active Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Active Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Completed Todo 1')).toBeInTheDocument();
    });

    it('should not show empty state when there are todos', () => {
      render(<TodoList />);

      expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
    });

    it('should render correct number of TodoItem components', () => {
      render(<TodoList />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });
  });

  describe('Filter Functionality', () => {
    beforeEach(() => {
      useTodoStore.setState({
        todos: [
          {
            id: '1',
            title: 'Active Todo',
            description: null,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            title: 'Completed Todo',
            description: null,
            isCompleted: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: new Date(),
          },
        ],
        filter: 'all',
        loading: false,
        error: null,
      });
    });

    it('should show all todos when filter is "all"', () => {
      useTodoStore.setState({ filter: 'all' });
      render(<TodoList />);

      expect(screen.getByText('Active Todo')).toBeInTheDocument();
      expect(screen.getByText('Completed Todo')).toBeInTheDocument();
    });

    it('should show only active todos when filter is "active"', () => {
      useTodoStore.setState({ filter: 'active' });
      render(<TodoList />);

      expect(screen.getByText('Active Todo')).toBeInTheDocument();
      expect(screen.queryByText('Completed Todo')).not.toBeInTheDocument();
    });

    it('should show only completed todos when filter is "completed"', () => {
      useTodoStore.setState({ filter: 'completed' });
      render(<TodoList />);

      expect(screen.queryByText('Active Todo')).not.toBeInTheDocument();
      expect(screen.getByText('Completed Todo')).toBeInTheDocument();
    });

    it('should show empty state when filter has no matching todos', () => {
      useTodoStore.setState({
        todos: [
          {
            id: '1',
            title: 'Active Todo',
            description: null,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        filter: 'completed',
      });

      render(<TodoList />);

      expect(screen.getByText(/no completed todos/i)).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    beforeEach(() => {
      useTodoStore.setState({
        todos: [
          {
            id: '1',
            title: 'Active 1',
            description: null,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            title: 'Active 2',
            description: null,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '3',
            title: 'Completed',
            description: null,
            isCompleted: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: new Date(),
          },
        ],
        filter: 'all',
        loading: false,
        error: null,
      });
    });

    it('should display total count', () => {
      render(<TodoList />);

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('should display active count', () => {
      render(<TodoList />);

      // Find the statistics section using ARIA label (more robust than CSS selectors)
      const statsSection = screen.getByLabelText('Todo statistics');
      expect(statsSection).toBeInTheDocument();

      // Check for active count within statistics
      expect(within(statsSection).getByText('2')).toBeInTheDocument();
      expect(within(statsSection).getByText('Active')).toBeInTheDocument();
    });

    it('should display completed count', () => {
      render(<TodoList />);

      // Find the statistics section using ARIA label (more robust than CSS selectors)
      const statsSection = screen.getByLabelText('Todo statistics');
      expect(statsSection).toBeInTheDocument();

      // Check for completed count within statistics
      expect(within(statsSection).getByText('1')).toBeInTheDocument();
      expect(within(statsSection).getByText('Completed')).toBeInTheDocument();
    });

    it('should update stats when todos change', () => {
      const { rerender } = render(<TodoList />);

      // Initially
      expect(screen.getByText('2')).toBeInTheDocument();

      // Toggle one todo
      const { toggleTodo } = useTodoStore.getState();
      toggleTodo('1');

      rerender(<TodoList />);

      // Now should show 1 active, 2 completed
      const numbers = screen.getAllByText('1');
      expect(numbers.length).toBeGreaterThan(0);
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Filter Buttons', () => {
    beforeEach(() => {
      useTodoStore.setState({
        todos: [
          {
            id: '1',
            title: 'Test Todo',
            description: null,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        filter: 'all',
        loading: false,
        error: null,
      });
    });

    it('should render filter buttons', () => {
      render(<TodoList />);

      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument();
    });

    it('should highlight active filter button', () => {
      useTodoStore.setState({ filter: 'active' });
      render(<TodoList />);

      const activeButton = screen.getByRole('button', { name: /active/i });
      expect(activeButton).toHaveClass('bg-primary-600');
      expect(activeButton).toHaveClass('text-white');
    });

    it('should change filter when clicking filter buttons', () => {
      render(<TodoList />);

      const activeButton = screen.getByRole('button', { name: /active/i });
      activeButton.click();

      expect(useTodoStore.getState().filter).toBe('active');
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      useTodoStore.setState({ loading: true });
      render(<TodoList />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should not show loading indicator when loading is false', () => {
      useTodoStore.setState({ loading: false });
      render(<TodoList />);

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when error exists', () => {
      useTodoStore.setState({ error: 'Failed to load todos' });
      render(<TodoList />);

      expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
    });

    it('should show error with alert role', () => {
      useTodoStore.setState({ error: 'Test error' });
      render(<TodoList />);

      const error = screen.getByRole('alert');
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(/test error/i);
    });

    it('should not show error when error is null', () => {
      useTodoStore.setState({ error: null });
      render(<TodoList />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have proper container structure', () => {
      const { container } = render(<TodoList />);

      const mainContainer = container.querySelector('.max-w-2xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should apply card styling to todo list section', () => {
      useTodoStore.setState({
        todos: [
          {
            id: '1',
            title: 'Test',
            description: null,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      const { container } = render(<TodoList />);

      const listCard = container.querySelector('.bg-white.shadow-md.rounded-lg');
      expect(listCard).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should integrate TodoForm and allow adding todos', () => {
      render(<TodoList />);

      // Initially empty
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // Add a todo via form
      const { addTodo } = useTodoStore.getState();
      addTodo('New Todo from List');

      // Re-render to see changes
      const { rerender } = render(<TodoList />);
      rerender(<TodoList />);

      // Todo should appear
      expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
    });
  });
});
