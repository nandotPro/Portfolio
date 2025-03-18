'use client';

import styles from './Editor.module.css';
import ProjectPreview from './ProjectPreview';
import CodeContent from './CodeContent';
import { useState, useEffect, useRef } from 'react';

interface OpenFile {
  id: string;
  name: string;
  animated?: boolean;
  content?: any;
}

interface EditorProps {
  openFiles: OpenFile[];
  activeFileId: string | null;
  onCloseProject: (projectId: string) => void;
  onSwitchProject: (projectId: string) => void;
  onContentLoaded: (projectId: string, content: any, lineCount: number) => void;
  onReorderFiles: (newOrder: OpenFile[]) => void;
  currentFileAnimated: boolean;
  currentFileContent?: any;
  children?: React.ReactNode;
}

export default function Editor({ 
  openFiles, 
  activeFileId, 
  onCloseProject, 
  onSwitchProject,
  onContentLoaded,
  onReorderFiles,
  currentFileAnimated,
  currentFileContent,
  children 
}: EditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Estado para drag & drop
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndicatorPos, setDropIndicatorPos] = useState<number | null>(null);
  const tabsBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Redimensionar a array de refs quando o número de abas mudar
    tabRefs.current = tabRefs.current.slice(0, openFiles.length);
    
    // Definir se deve mostrar o preview
    if (activeFileId && 
        activeFileId !== 'about' && 
        activeFileId !== 'contact' && 
        activeFileId !== 'frontend' && 
        activeFileId !== 'backend') {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    
    // Resetar contagem de linhas visíveis ao trocar arquivo
    if (!currentFileAnimated) {
      setVisibleLineCount(0);
      setIsAnimating(true);
    } else {
      // Se já foi animado, mostrar todas as linhas imediatamente
      if (currentFileContent && currentFileContent.length > 0) {
        setVisibleLineCount(currentFileContent.length);
      } else if (lineCount > 0) {
        setVisibleLineCount(lineCount);
      }
      setIsAnimating(false);
    }
  }, [activeFileId, currentFileAnimated, openFiles.length]);

  const handleContentChange = (count: number) => {
    // Só atualiza se o valor for diferente para evitar re-renders desnecessários
    if (count !== lineCount) {
      setLineCount(count);
      
      // Se o arquivo já foi animado, atualize imediatamente
      if (currentFileAnimated) {
        setVisibleLineCount(count);
      }
    }
  };

  const handleLineAnimation = (currentLine: number) => {
    // Atualizar a contagem de linhas visíveis durante a animação
    setVisibleLineCount(currentLine);
  };

  const handleAnimationComplete = (content: any) => {
    // Marcar a animação como concluída
    setIsAnimating(false);
    
    // Notificar o componente pai sobre o conteúdo carregado
    if (activeFileId) {
      onContentLoaded(activeFileId, content, lineCount);
    }
  };

  const handleCloseTab = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Impedir propagação para não ativar a aba
    onCloseProject(projectId);
  };

  const getFileIcon = (fileName: string) => {
    // Verificar se é um arquivo TS
    if (fileName.endsWith('.ts')) {
      return (
        <svg className={`${styles.tabIcon} ${styles.iconTS}`} width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z" />
        </svg>
      );
    }
    
    // Para outros tipos de arquivo, adicione aqui se necessário
    return null;
  };

  // Funções de drag & drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggingIndex(index);

    // Adiciona um atraso para aplicar o estilo de arrasto
    setTimeout(() => {
      if (tabRefs.current[index]) {
        tabRefs.current[index]?.classList.add(styles.draggingTab);
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
    const targetTab = tabRefs.current[index];
    if (targetTab && tabsBarRef.current) {
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

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Verifica se o mouse saiu completamente da barra de abas
    if (tabsBarRef.current) {
      const tabsBarRect = tabsBarRef.current.getBoundingClientRect();
      if (
        e.clientX < tabsBarRect.left || 
        e.clientX > tabsBarRect.right || 
        e.clientY < tabsBarRect.top || 
        e.clientY > tabsBarRect.bottom
      ) {
        setDropIndicatorPos(null);
      }
    }
  };

  const handleDragEnd = () => {
    // Limpa os estilos e estados de arrasto
    if (draggingIndex !== null && tabRefs.current[draggingIndex]) {
      tabRefs.current[draggingIndex]?.classList.remove(styles.draggingTab);
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

      // Calcula a nova ordem das abas
      const reorderedFiles = [...openFiles];
      const [movedFile] = reorderedFiles.splice(sourceIndex, 1);
      
      // Ajuste na lógica de inserção para lidar melhor com o movimento para a direita
      const targetTab = tabRefs.current[targetIndex];
      if (targetTab) {
        const tabRect = targetTab.getBoundingClientRect();
        const mouseX = e.clientX;
        const middleX = tabRect.left + tabRect.width / 2;
        
        // Ajuste para lidar com o caso especial quando arrastando da esquerda para a direita
        let insertionIndex = targetIndex;
        
        if (sourceIndex < targetIndex) {
          // Se estamos arrastando para a direita
          if (mouseX > middleX) {
            // Se o mouse estiver além do meio da aba alvo, insira após ela
            insertionIndex = targetIndex;
          } else {
            // Se o mouse estiver antes do meio da aba alvo, insira antes dela
            insertionIndex = targetIndex - 1;
          }
        } else {
          // Se estamos arrastando para a esquerda
          if (mouseX < middleX) {
            // Se o mouse estiver antes do meio da aba alvo, insira antes dela
            insertionIndex = targetIndex;
          } else {
            // Se o mouse estiver além do meio da aba alvo, insira após ela
            insertionIndex = targetIndex + 1;
          }
        }
        
        // Garante que o índice de inserção é válido
        insertionIndex = Math.max(0, Math.min(insertionIndex, reorderedFiles.length));
        reorderedFiles.splice(insertionIndex, 0, movedFile);
      } else {
        // Fallback caso o targetTab não seja encontrado
        reorderedFiles.splice(targetIndex, 0, movedFile);
      }
      
      // Atualiza a ordem no componente pai
      onReorderFiles(reorderedFiles);
    } catch (error) {
      console.error('Erro durante o drop:', error);
    } finally {
      // Sempre limpa os estados de arrasto ao final
      handleDragEnd();
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.tabsBar} 
        ref={tabsBarRef}
        onDragLeave={handleDragLeave}
      >
        {openFiles.map((file, index) => (
          <div 
            key={file.id} 
            ref={(el: HTMLDivElement | null) => {
              tabRefs.current[index] = el;
            }}
            className={`${styles.tab} ${activeFileId === file.id ? styles.activeTab : ''}`}
            onClick={() => onSwitchProject(file.id)}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={styles.tabContent}>
              {getFileIcon(file.name.endsWith('.js') ? file.name.replace('.js', '.ts') : file.name)}
              <span>{file.name.endsWith('.js') ? file.name.replace('.js', '.ts') : file.name}</span>
            </div>
            <span 
              className={styles.closeTab} 
              onClick={(e) => handleCloseTab(file.id, e)}
            >
              ×
            </span>
          </div>
        ))}
        
        {/* Indicador de local de soltura - melhorado para garantir posicionamento correto */}
        {dropIndicatorPos !== null && tabsBarRef.current && (
          <div 
            className={styles.dropIndicator} 
            style={{ 
              left: `${dropIndicatorPos - tabsBarRef.current.getBoundingClientRect().left}px`,
              height: '80%',
              top: '10%'
            }} 
          />
        )}
      </div>
      
      <div className={styles.editorContainer}>
        {activeFileId ? (
          <div className={styles.codeArea}>
            <div className={styles.lineNumbers}>
              {/* Números de linha dinâmicos que acompanham a animação */}
              {Array.from({ length: Math.max(1, visibleLineCount) }, (_, i) => (
                <div key={i} className={styles.lineNumber}>{i + 1}</div>
              ))}
            </div>
            <div className={styles.codeContent}>
              <CodeContent 
                activeSection={activeFileId}
                onContentChange={handleContentChange}
                onLineAnimation={handleLineAnimation}
                onAnimationComplete={handleAnimationComplete}
                skipAnimation={currentFileAnimated}
                cachedContent={currentFileContent}
              />
            </div>
          </div>
        ) : (
          <div className={styles.welcomeScreen}>
            <div className={styles.welcomeText}>
              <span className={styles.welcomeTitle}>Portfolio by ILAN</span>
              <span className={styles.welcomeSubtitle}>Select a file to start</span>
            </div>
          </div>
        )}

        {showPreview && (
          <ProjectPreview projectId={activeFileId} />
        )}
      </div>
    </div>
  );
} 