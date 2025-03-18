import { useEffect, useCallback } from 'react';

type KeyboardShortcut = {
  key: string;          // A tecla principal (e.g., 'p', 'f')
  ctrlKey?: boolean;    // Se Ctrl deve estar pressionado
  shiftKey?: boolean;   // Se Shift deve estar pressionado
  altKey?: boolean;     // Se Alt deve estar pressionado
  metaKey?: boolean;    // Se Meta (Command no Mac) deve estar pressionado
  action: () => void;   // A ação a ser executada
  preventDefault?: boolean; // Se deve prevenir o comportamento padrão
};

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
      const shiftMatch = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
      const altMatch = shortcut.altKey === undefined || event.altKey === shortcut.altKey;
      const metaMatch = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;
      
      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}; 