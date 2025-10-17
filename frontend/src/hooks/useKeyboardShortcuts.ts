import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
}

/**
 * Custom hook for handling keyboard shortcuts
 *
 * @param shortcuts - Array of keyboard shortcuts to register
 * @param enabled - Whether the shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input/textarea
      const target = event.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : true;
        const metaMatch = shortcut.metaKey ? event.metaKey : true;

        // Special handling for single key shortcuts (like '/')
        if (!shortcut.ctrlKey && !shortcut.metaKey) {
          if (isTyping) continue; // Skip if user is typing
        }

        if (keyMatch && ctrlMatch && metaMatch) {
          // For Ctrl/Cmd shortcuts, check both
          if (shortcut.ctrlKey || shortcut.metaKey) {
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              shortcut.action();
              break;
            }
          } else {
            // Single key shortcut
            event.preventDefault();
            shortcut.action();
            break;
          }
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}
