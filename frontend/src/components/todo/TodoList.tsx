import { useTodoStore } from '@store/todoStore';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
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
 *
 * @see .doc/Frontend-Team-Todolist.md Task 2.5
 */
export function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const loading = useTodoStore((state) => state.loading);
  const error = useTodoStore((state) => state.error);
  const setFilter = useTodoStore((state) => state.setFilter);
  const getFilteredTodos = useTodoStore((state) => state.getFilteredTodos);
  const getStats = useTodoStore((state) => state.getStats);

  const filteredTodos = getFilteredTodos();
  const stats = getStats();

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Todos</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <TodoForm />
        </div>

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white shadow-md rounded-lg p-8 mb-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading todos...</p>
          </div>
        )}

        {/* Filter Buttons */}
        {todos.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="flex gap-2 justify-center">
              {filters.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          {filteredTodos.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          ) : (
            <div className="py-12 px-6 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{getEmptyMessage()}</h3>
              <p className="text-gray-500">{getEmptySubMessage()}</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        {todos.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{stats.active}</div>
                <div className="text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
