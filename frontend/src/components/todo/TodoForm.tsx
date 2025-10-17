import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useTodoStore } from '@store/todoStore';

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
 *
 * @see .doc/Frontend-Team-Todolist.md Task 2.3
 */
export function TodoForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = useTodoStore((state) => state.addTodo);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    // Add todo to store
    addTodo(title);

    // Clear form
    setTitle('');
    setError('');
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
        className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
      >
        Add Todo
      </button>
    </form>
  );
}
