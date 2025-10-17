import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTodoStore } from '@store/todoStore';
import { useTodos } from '@hooks/useTodos';
import type { Todo } from '@types/todo';

interface TodoItemProps {
  todo: Todo;
}

/**
 * TodoItem Component
 *
 * Displays a single todo item with:
 * - Checkbox to toggle completion
 * - Title display (with line-through when completed)
 * - Double-click to edit
 * - Delete button
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * - API integration for updates and deletes
 *
 * @see .doc/Frontend-Team-Todolist.md Task 2.4, Task 2.6
 */
export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const toggleTodoLocal = useTodoStore((state) => state.toggleTodo);
  const updateTodoLocal = useTodoStore((state) => state.updateTodo);
  const deleteTodoLocal = useTodoStore((state) => state.deleteTodo);
  const { toggleTodo, updateTodo, deleteTodo, fetchTodos } = useTodos();

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(todo.title);
  };

  const handleSave = async () => {
    const trimmedText = editText.trim();

    // Don't save if empty
    if (!trimmedText) {
      setIsEditing(false);
      setEditText(todo.title);
      return;
    }

    // Skip if unchanged
    if (trimmedText === todo.title) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);

    try {
      // Update via API
      await updateTodo(todo.id, { title: trimmedText });

      // Update local store for immediate UI update
      updateTodoLocal(todo.id, { title: trimmedText });

      // Refresh from server
      await fetchTodos();

      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update todo:', err);
      // Revert on error
      setEditText(todo.title);
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.title);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    if (!isUpdating) {
      handleSave();
    }
  };

  const handleToggle = async () => {
    try {
      // Optimistic update
      toggleTodoLocal(todo.id);

      // Update via API
      await toggleTodo(todo.id);

      // Refresh from server
      await fetchTodos();
    } catch (err) {
      console.error('Failed to toggle todo:', err);
      // Revert on error
      toggleTodoLocal(todo.id);
    }
  };

  const handleDelete = async () => {
    try {
      // Optimistic delete
      deleteTodoLocal(todo.id);

      // Delete via API
      await deleteTodo(todo.id);

      // Refresh from server
      await fetchTodos();
    } catch (err) {
      console.error('Failed to delete todo:', err);
      // Note: Cannot easily revert delete, would need to re-fetch
      await fetchTodos();
    }
  };

  return (
    <div className="group flex items-center gap-3 py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={handleToggle}
        aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer"
      />

      {/* Title (View or Edit mode) */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={isUpdating}
            className="w-full px-2 py-1 border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            maxLength={255}
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className={`block cursor-pointer select-none ${
              todo.isCompleted ? 'line-through opacity-50 text-gray-500' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Delete "${todo.title}"`}
        className="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  );
}
