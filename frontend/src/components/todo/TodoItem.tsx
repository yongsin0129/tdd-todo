import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTodoStore } from '@store/todoStore';
import { useTodos } from '@hooks/useTodos';
import type { Todo } from '@/types/todo';

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
      // Update via API (returns the updated todo from server)
      const updatedTodo = await updateTodo(todo.id, { title: trimmedText });

      // Update local store with server response to ensure sync
      updateTodoLocal(todo.id, updatedTodo);

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
      // Store the current state BEFORE optimistic update
      const newCompletedState = !todo.isCompleted;

      // Optimistic update
      toggleTodoLocal(todo.id);

      // Update via API with the NEW state (not reading from store)
      await updateTodo(todo.id, { isCompleted: newCompletedState });

      // No need to update local store again - optimistic update already handled it
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

      // No need to refresh - optimistic delete already updated UI
    } catch (err) {
      console.error('Failed to delete todo:', err);
      // On error, re-fetch to restore the deleted item
      await fetchTodos();
    }
  };

  return (
    <div className="group flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 hover:bg-gray-50 transition-colors animate-slide-up">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={handleToggle}
        aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer transition-transform hover:scale-110"
      />

      {/* Title (View or Edit mode) */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div>
            <label htmlFor={`edit-${todo.id}`} className="sr-only">
              Edit todo title
            </label>
            <input
              id={`edit-${todo.id}`}
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              disabled={isUpdating}
              aria-invalid="false"
              aria-label={`Edit "${todo.title}"`}
              className="w-full px-2 py-1 text-sm sm:text-base border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              maxLength={255}
            />
          </div>
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDoubleClick();
              }
            }}
            aria-label={`Todo: ${todo.title}. Double click or press Enter to edit.`}
            className={`block cursor-pointer select-none text-sm sm:text-base break-words focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1 -ml-1 ${
              todo.isCompleted ? 'line-through opacity-50 text-gray-500' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      {/* Delete Button - visible on mobile, hover on desktop */}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Delete "${todo.title}"`}
        className="flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  );
}
