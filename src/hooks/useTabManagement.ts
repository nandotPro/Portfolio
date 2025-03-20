import { useCallback } from 'react';
import { OpenFile } from '../store/editorStore';
import { useDragDrop } from './useDragDrop';

interface UseTabManagementOptions {
  openFiles: OpenFile[];
  activeFileId: string | null;
  onCloseProject: (fileId: string) => void;
  onSwitchProject: (fileId: string) => void;
  onReorderFiles: (newOrder: OpenFile[]) => void;
}

interface DragDropResult {
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, hoverIndex: number) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  draggingIndex: number | null;
  dropIndicatorPosition: { visible: boolean; position: number } | null;
}

export function useTabManagement({
  openFiles,
  activeFileId,
  onCloseProject,
  onSwitchProject,
  onReorderFiles
}: UseTabManagementOptions) {
  
  // Utilizar o hook de drag and drop
  const dragDrop = useDragDrop({
    onReorder: onReorderFiles,
    items: openFiles
  }) as DragDropResult;
  
  // Função para manipular o fechamento de abas
  const handleCloseTab = useCallback((fileId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onCloseProject(fileId);
  }, [onCloseProject]);
  
  // Função para manipular a troca de abas
  const handleSwitchTab = useCallback((fileId: string) => {
    onSwitchProject(fileId);
  }, [onSwitchProject]);
  
  // Função para obter o tipo de ícone (sem JSX)
  const getTabIcon = useCallback((fileId: string) => {
    if (fileId.endsWith('.ts')) {
      return 'typescript';
    } else if (fileId.endsWith('.tsx')) {
      return 'react';
    } else if (fileId.endsWith('.js') || fileId.endsWith('.jsx')) {
      return 'javascript';
    } else if (fileId.endsWith('.css')) {
      return 'css';
    } else if (fileId.endsWith('.json')) {
      return 'node';
    } else if (fileId.endsWith('.md')) {
      return 'info';
    }
    return 'file';
  }, []);
  
  // Verificar se uma aba está ativa
  const isTabActive = useCallback((fileId: string) => {
    return activeFileId === fileId;
  }, [activeFileId]);
  
  return {
    itemRefs: dragDrop.itemRefs,
    containerRef: dragDrop.containerRef,
    handleDragStart: dragDrop.handleDragStart,
    handleDragOver: dragDrop.handleDragOver,
    handleDragEnd: dragDrop.handleDragEnd,
    handleDragLeave: dragDrop.handleDragLeave,
    isDragging: dragDrop.isDragging,
    draggingIndex: dragDrop.draggingIndex,
    dropIndicatorPosition: dragDrop.dropIndicatorPosition,
    handleCloseTab,
    handleSwitchTab,
    getTabIcon,
    isTabActive
  };
} 