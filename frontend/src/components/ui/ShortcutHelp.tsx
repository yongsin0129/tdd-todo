import { useEffect } from 'react';

interface ShortcutHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Ctrl', 'K'], description: 'Focus on input field' },
  { keys: ['/'], description: 'Quick focus on input field' },
  { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
  { keys: ['Enter'], description: 'Submit todo (when in input)' },
  { keys: ['Escape'], description: 'Cancel editing or close dialog' },
  { keys: ['Tab'], description: 'Navigate between elements' },
  { keys: ['Space'], description: 'Toggle todo completion (when focused)' },
];

export function ShortcutHelp({ isOpen, onClose }: ShortcutHelpProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcut-help-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="shortcut-help-title" className="text-xl font-bold text-gray-900">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            aria-label="Close shortcuts dialog"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm"
                  >
                    {key === 'Ctrl' && navigator.platform.includes('Mac') ? '⌘' : key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
