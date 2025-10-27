import { useState, useEffect, useRef, forwardRef, type FormEvent } from "react";
import { useTodoActions } from "@hooks/useTodos";
import {
  PRIORITY_LEVELS,
  DEFAULT_PRIORITY,
  PRIORITY_CONFIG,
  type TodoPriority,
} from "@/types/todo";

/**
 * TodoForm Component
 *
 * A form component for creating new todo items.
 * Features:
 * - Input validation (required, max length 255)
 * - Priority selector (CR-002)
 * - Auto-focus on mount
 * - Trim whitespace
 * - Clear input after submission
 * - Accessible error messages
 * - API integration for creating todos
 *
 * Note: Uses useTodoActions (no initial fetch) to avoid unnecessary API calls.
 *
 * @see .doc/Frontend-Team-Todolist.md Task 2.3, Task 2.6, Task 6.1.2
 */
export const TodoForm = forwardRef<HTMLInputElement>((_props, externalRef) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoPriority>(DEFAULT_PRIORITY);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);

  // Use external ref if provided, otherwise use internal ref
  const inputRef = (externalRef || internalRef) as React.RefObject<HTMLInputElement>;

  // Use action hook (no fetch on mount)
  const { createTodo, fetchTodos } = useTodoActions();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation: Empty title
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    // Validation: Title too long
    if (title.length > 255) {
      setError("Title must be less than 255 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create todo via API with priority
      await createTodo({
        title: title.trim(),
        priority,
      });

      // Refresh from server to update UI
      await fetchTodos();

      // Clear form and reset priority
      setTitle("");
      setPriority(DEFAULT_PRIORITY);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    setTitle(value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" aria-label="Create new todo">
      <div>
        <label htmlFor="todo-title" className="sr-only">
          Todo title
        </label>
        <input
          id="todo-title"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="What needs to be done?"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "todo-title-error" : undefined}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          maxLength={255}
        />
      </div>

      {/* Priority Selector (CR-002) */}
      <fieldset
        role="group"
        aria-label="優先級"
        className="border border-gray-200 rounded-lg p-3 sm:p-4"
      >
        <legend className="text-xs sm:text-sm font-medium text-gray-700 px-2">優先級</legend>
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
          {PRIORITY_LEVELS.map((level) => {
            const config = PRIORITY_CONFIG[level];
            const isSelected = priority === level;

            return (
              <label
                key={level}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5
                  rounded-lg cursor-pointer transition-all
                  text-xs sm:text-sm font-medium
                  border-2
                  ${
                    isSelected
                      ? "border-current shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
                style={{
                  color: isSelected ? config.color : "#6B7280",
                  backgroundColor: isSelected ? config.bgColor : "#F9FAFB",
                }}
              >
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={isSelected}
                  onChange={(e) => setPriority(e.target.value as TodoPriority)}
                  className="sr-only"
                  aria-label={config.label}
                />
                <span className="select-none">{config.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p id="todo-title-error" className="text-xs sm:text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        {isSubmitting ? "Adding..." : "Add Todo"}
      </button>
    </form>
  );
});

TodoForm.displayName = "TodoForm";
