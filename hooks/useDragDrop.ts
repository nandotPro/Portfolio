import { useState, useRef } from 'react';
import styles from '../components/Editor.module.css';

interface DragDropOptions {
  onReorder: (sourceIndex: number, targetIndex: number) => void;
}

export const useDragDrop = ({ onReorder }: DragDropOptions) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndicatorPos, setDropIndicatorPos] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggingIndex(index);

    // Adiciona um atraso para aplicar o estilo de arrasto
    setTimeout(() => {
      if (itemRefs.current[index]) {
        itemRefs.current[index]?.classList.add(styles.draggingTab);
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggingIndex === null || draggingIndex === index) {
      setDropIndicatorPos(null);
      return;
    }

    // Calcula a posição do indicador de soltura
    const targetTab = itemRefs.current[index];
    if (targetTab && containerRef.current) {
      const tabRect = targetTab.getBoundingClientRect();
      const mouseX = e.clientX;
      const middleX = tabRect.left + tabRect.width / 2;
      
      // Determina se o indicador deve aparecer à esquerda ou à direita da aba
      if (mouseX < middleX) {
        setDropIndicatorPos(tabRect.left);
      } else {
        setDropIndicatorPos(tabRect.right);
      }
    }
  };

  const handleTabsBarDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (draggingIndex === null) {
      return;
    }
    
    let overTabIndex = -1;
    let closestDistance = Infinity;
    
    itemRefs.current.forEach((tabRef, index) => {
      if (!tabRef) return;
      
      const tabRect = tabRef.getBoundingClientRect();
      const tabCenter = tabRect.left + tabRect.width / 2;
      const distance = Math.abs(e.clientX - tabCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        overTabIndex = index;
      }
    });
    
    if (overTabIndex === -1 || overTabIndex === draggingIndex) {
      setDropIndicatorPos(null);
      return;
    }
    
    const targetTab = itemRefs.current[overTabIndex];
    if (targetTab && containerRef.current) {
      const tabRect = targetTab.getBoundingClientRect();
      const mouseX = e.clientX;
      const tabCenter = tabRect.left + tabRect.width / 2;
      
      if (mouseX < tabCenter) {
        setDropIndicatorPos(tabRect.left);
      } else {
        setDropIndicatorPos(tabRect.right);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX < containerRect.left || 
        e.clientX > containerRect.right || 
        e.clientY < containerRect.top || 
        e.clientY > containerRect.bottom
      ) {
        setDropIndicatorPos(null);
      }
    }
  };

  const handleDragEnd = () => {
    if (draggingIndex !== null && itemRefs.current[draggingIndex]) {
      itemRefs.current[draggingIndex]?.classList.remove(styles.draggingTab);
    }
    setDraggingIndex(null);
    setDropIndicatorPos(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    
    try {
      const sourceIndexStr = e.dataTransfer.getData('text/plain');
      if (!sourceIndexStr) return;
      
      const sourceIndex = parseInt(sourceIndexStr, 10);
      if (isNaN(sourceIndex) || sourceIndex === targetIndex) {
        return;
      }

      const targetTab = itemRefs.current[targetIndex];
      if (targetTab) {
        const tabRect = targetTab.getBoundingClientRect();
        const mouseX = e.clientX;
        const middleX = tabRect.left + tabRect.width / 2;
        
        let insertionIndex = targetIndex;
        
        if (sourceIndex < targetIndex) {
          if (mouseX > middleX) {
            insertionIndex = targetIndex;
          } else {
            insertionIndex = targetIndex - 1;
          }
        } else {
          if (mouseX < middleX) {
            insertionIndex = targetIndex;
          } else {
            insertionIndex = targetIndex + 1;
          }
        }
        
        onReorder(sourceIndex, insertionIndex);
      } else {
        onReorder(sourceIndex, targetIndex);
      }
    } catch (error) {
      console.error('Erro durante o drop:', error);
    } finally {
      handleDragEnd();
    }
  };

  return {
    draggingIndex,
    dropIndicatorPos,
    itemRefs,
    containerRef,
    handleDragStart,
    handleDragOver,
    handleTabsBarDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop
  };
}; 