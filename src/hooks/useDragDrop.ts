import { useState, useRef, useCallback } from 'react';
import { OpenFile } from '../store/editorStore';
import styles from '../components/Editor.module.css';
import { throttle, debounce } from 'lodash';

interface DragDropOptions {
  onReorder: (newOrder: OpenFile[]) => void;
  items: OpenFile[];
}

interface DropIndicator {
  visible: boolean;
  position: number;
  beforeIndex: number | null;
}

export const useDragDrop = ({ onReorder, items }: DragDropOptions) => {
  // Referências aos elementos DOM das abas
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Estado para rastrear o índice da aba sendo arrastada
  const [dragState, setDragState] = useState<{
    draggingIndex: number | null;
    draggingItem: OpenFile | null;
  }>({
    draggingIndex: null,
    draggingItem: null
  });
  
  // Estado para o indicador de soltura
  const [dropIndicator, setDropIndicator] = useState<DropIndicator>({
    visible: false,
    position: 0,
    beforeIndex: null
  });

  // Manipulador de início de arrasto
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    // Armazenar dados para transferência
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Atualizar estado de arrasto
    setDragState({
      draggingIndex: index,
      draggingItem: items[index]
    });
    
    // Tornar o indicador de soltura visível
    setDropIndicator(prev => ({
      ...prev,
      visible: true
    }));
    
    // Definir um preview de arrasto (opcional)
    if (e.dataTransfer.setDragImage && itemRefs.current[index]) {
      const element = itemRefs.current[index];
      if (element) {
        // Usar o próprio elemento como imagem de arrasto, mas com transparência
        e.dataTransfer.setDragImage(element, 0, 0);
      }
    }
  }, [items]);

  // Manipulador de arrasto sobre um elemento
  const handleDragOver = useCallback(
    throttle((e: React.DragEvent<HTMLDivElement>, hoverIndex: number) => {
      e.preventDefault();
      
      // Verificar se estamos arrastando algo
      if (dragState.draggingIndex === null) return;
      
      // Não fazer nada se arrastar sobre o próprio item
      if (hoverIndex === dragState.draggingIndex) {
        setDropIndicator(prev => ({
          ...prev,
          visible: false
        }));
        return;
      }
      
      // Obter a referência do elemento atual
      const targetElement = itemRefs.current[hoverIndex];
      if (!targetElement) return;
      
      // Obter posições e dimensões do elemento e do contêiner
      const containerRect = containerRef.current?.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      if (!containerRect) return;
      
      // Posição do mouse relativa ao contêiner
      const mouseX = e.clientX - containerRect.left;
      // Posição do elemento relativa ao contêiner
      const targetLeft = targetRect.left - containerRect.left;
      const targetWidth = targetRect.width;
      
      // Determinar se está antes ou depois do elemento
      const isBeforeItem = mouseX < targetLeft + targetWidth / 2;
      
      let beforeIndex = isBeforeItem ? hoverIndex : hoverIndex + 1;
      
      // Ajustar o índice se arrastarmos antes do nosso próprio elemento
      if (dragState.draggingIndex < hoverIndex && isBeforeItem) {
        beforeIndex = hoverIndex;
      } else if (dragState.draggingIndex > hoverIndex && !isBeforeItem) {
        beforeIndex = hoverIndex + 1;
      }
      
      // Calcular a posição do indicador de soltura
      const indicatorPosition = isBeforeItem ? 
        targetRect.left - containerRect.left : 
        targetRect.right - containerRect.left;
      
      // Atualizar o estado do indicador
      setDropIndicator({
        visible: true,
        position: indicatorPosition,
        beforeIndex: beforeIndex === dragState.draggingIndex ? null : beforeIndex
      });
      
    }, 16),
    [dragState.draggingIndex, dragState.draggingItem]
  );

  // Manipulador de fim de arrasto
  const handleDragEnd = useCallback(
    debounce(() => {
      // Verificar se temos informações válidas de arrasto e soltura
      if (dragState.draggingIndex !== null && 
          dropIndicator.beforeIndex !== null && 
          dragState.draggingItem) {
        
        const newItems = [...items];
        
        // Remover o item arrastado
        newItems.splice(dragState.draggingIndex, 1);
        
        // Calcular a nova posição, levando em conta a remoção anterior
        let newIndex = dropIndicator.beforeIndex;
        if (dropIndicator.beforeIndex > dragState.draggingIndex) {
          newIndex = dropIndicator.beforeIndex - 1;
        }
        
        // Inserir o item na nova posição
        newItems.splice(newIndex, 0, dragState.draggingItem);
        
        // Notificar sobre a reordenação
        onReorder(newItems);
      }
      
      // Limpar estados
      setDragState({
        draggingIndex: null,
        draggingItem: null
      });
      
      setDropIndicator({
        visible: false,
        position: 0,
        beforeIndex: null
      });
    }, 50),
    [items, dragState.draggingIndex, dragState.draggingItem, dropIndicator.beforeIndex, onReorder]
  );

  // Manipulador de saída do arrasto
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    // Verificar se o mouse saiu do contêiner de abas
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Se o mouse estiver fora dos limites do contêiner
      if (
        mouseX < containerRect.left ||
        mouseX > containerRect.right ||
        mouseY < containerRect.top ||
        mouseY > containerRect.bottom
      ) {
        // Esconder o indicador de soltura
        setDropIndicator(prev => ({
          ...prev,
          visible: false
        }));
      }
    }
  }, []);

  // Posição do indicador para ser usado no componente pai
  const getDropIndicatorPosition = () => {
    if (!dropIndicator.visible) return null;
    
    return {
      visible: dropIndicator.visible,
      position: dropIndicator.position
    };
  };

  return {
    itemRefs,
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    isDragging: dragState.draggingIndex !== null,
    draggingIndex: dragState.draggingIndex,
    dropIndicatorPosition: getDropIndicatorPosition()
  };
}; 