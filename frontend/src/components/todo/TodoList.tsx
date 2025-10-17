import { useRef, useState } from 'react';
import { useTodoStore } from '@store/todoStore';
import { useTodos } from '@hooks/useTodos';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { ShortcutHelp } from '../ui/ShortcutHelp';
import type { TodoFilter } from '@types/todo';

/**
 * TodoList Component
 *
 * Main container component that:
 * - Displays TodoForm for adding new todos
 * - Shows filtered list of todos using TodoItem
 * - Provides filter buttons (All, Active, Completed)
 * - Displays statistics (total, active, completed counts)
 * - Handles empty states for different filters
 * - Shows loading and error states
 * - Integrates with API via useTodos hook (automatic data fetching on mount)
 *
 * @see .doc/Frontend-Team-Todolist.md Task 2.5, Task 2.6
 */
export function TodoList() {
  // Initialize API integration (fetches todos on mount)
  useTodos();

  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const loading = useTodoStore((state) => state.loading);
  const error = useTodoStore((state) => state.error);
  const setFilter = useTodoStore((state) => state.setFilter);
  const getFilteredTodos = useTodoStore((state) => state.getFilteredTodos);
  const getStats = useTodoStore((state) => state.getStats);

  const filteredTodos = getFilteredTodos();
  const stats = getStats();

  // Keyboard shortcuts
  const [showShortcuts, setShowShortcuts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      description: 'Focus on input field',
      action: () => {
        inputRef.current?.focus();
      },
    },
    {
      key: '/',
      description: 'Quick focus on input field',
      action: () => {
        inputRef.current?.focus();
      },
    },
    {
      key: '/',
      ctrlKey: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        setShowShortcuts(true);
      },
    },
  ]);

  const filters: { label: string; value: TodoFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const getEmptyMessage = () => {
    if (filter === 'active') return 'No active todos!';
    if (filter === 'completed') return 'No completed todos yet.';
    return 'No todos yet!';
  };

  const getEmptySubMessage = () => {
    if (filter === 'active') return 'All tasks are completed or add a new one above.';
    if (filter === 'completed') return 'Complete some tasks to see them here.';
    return 'Add your first todo above to get started.';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Todos</h1>
          <p className="text-sm sm:text-base text-gray-600">Organize your tasks efficiently</p>
        </header>

        {/* Add Todo Form */}
        <section aria-label="Add new todo" className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 animate-fade-in">
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

        {/* Filter Buttons */}
        {todos.length > 0 && (
          <nav aria-label="Todo filters" className="bg-white shadow-md rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 animate-fade-in">
            <div className="flex flex-wrap gap-2 justify-center" role="group">
              {filters.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  aria-label={`Show ${label.toLowerCase()} todos`}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105 ${
                    filter === value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Todo List */}
        <main aria-label="Todo list" className="bg-white shadow-md rounded-lg overflow-hidden mb-4 sm:mb-6 animate-fade-in">
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
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4" aria-hidden="true">📝</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">{getEmptyMessage()}</h3>
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
                <div className="text-xl sm:text-2xl font-bold text-gray-900" aria-label={`${stats.total} total todos`}>
                  {stats.total}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center transition-transform hover:scale-110">
                <div className="text-xl sm:text-2xl font-bold text-primary-600" aria-label={`${stats.active} active todos`}>
                  {stats.active}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center transition-transform hover:scale-110">
                <div className="text-xl sm:text-2xl font-bold text-green-600" aria-label={`${stats.completed} completed todos`}>
                  {stats.completed}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Keyboard Shortcuts Help Dialog */}
      <ShortcutHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 text-xs text-gray-600 border border-gray-200 animate-fade-in hidden sm:block">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono">/</kbd> for shortcuts
      </div>
    </div>
  );
}
