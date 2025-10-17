import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useTodos } from '@hooks/useTodos';

/**
 * TodoForm Component
 *
 * A form component for creating new todo items.
 * Features:
 * - Input validation (required, max length 255)
 * - Auto-focus on mount
 * - Trim whitespace
 * - Clear input after submission
 * - Accessible error messages
 * - API integration for creating todos
 *
 * @see .doc/Frontend-Team-Todolist.md Task 2.3, Task 2.6
 */
export function TodoForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { createTodo, fetchTodos } = useTodos();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation: Empty title
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    // Validation: Title too long
    if (title.length > 255) {
      setError('Title must be less than 255 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create todo via API
      await createTodo({ title: title.trim() });

      // Refresh from server to update UI
      await fetchTodos();

      // Clear form
      setTitle('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    setTitle(value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          maxLength={255}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
}
