'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Editor.module.css';
import ProjectPreview from './ProjectPreview';
import dynamic from 'next/dynamic';
import { OpenFile } from '../store/editorStore';
import { useDragDrop } from '../hooks/useDragDrop';
import { useEditorStore } from '../store/editorStore';
import { DiReact } from 'react-icons/di';
import { SiTypescript } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { useTabManagement } from '../hooks/useTabManagement';

// Lazy loading do componente CodeContent
const CodeContent = dynamic(() => import('./CodeContent'), {
  loading: () => <div className={styles.loadingContent}>Carregando conteúdo...</div>,
  ssr: false
});

// Definição da interface EditorProps que estava faltando
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
  const [lineCount, setLineCount] = useState(1);
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Usar o hook de gerenciamento de abas
  const {
    itemRefs,
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    isDragging,
    draggingIndex,
    dropIndicatorPosition,
    handleCloseTab,
    handleSwitchTab,
    getTabIcon,
    isTabActive
  } = useTabManagement({
    openFiles,
    activeFileId,
    onCloseProject,
    onSwitchProject,
    onReorderFiles
  });

  const codeAreaRef = useRef<HTMLDivElement>(null);

  const { 
    fileContents
  } = useEditorStore();

  useEffect(() => {
    // Redimensionar a array de refs quando o número de abas mudar
    itemRefs.current = itemRefs.current.slice(0, openFiles.length);
    
    // Remover ou comentar este trecho
    /*
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
    */
    // Sempre definir como false
    setShowPreview(false);
    
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
  }, [activeFileId, currentFileAnimated, openFiles.length, currentFileContent, lineCount, itemRefs]);

  useEffect(() => {
    // Garantir que os números de linha estejam alinhados com o conteúdo do código
    const codeArea = codeAreaRef.current;
    if (codeArea) {
      // Ajustar a altura dos números de linha para corresponder exatamente à altura do conteúdo
      const codeContent = codeArea.querySelector(`.${styles.codeContent}`);
      const lineNumbers = codeArea.querySelector(`.${styles.lineNumbers}`);
      
      if (codeContent && lineNumbers) {
        // Observer para ajustar a altura quando o conteúdo muda
        const resizeObserver = new ResizeObserver(() => {
          lineNumbers.scrollTop = codeContent.scrollTop;
        });
        
        resizeObserver.observe(codeContent);
        
        return () => {
          resizeObserver.disconnect();
        };
      }
    }
  }, []);

  const handleContentChange = (count: number) => {
    if (count !== lineCount) {
      setLineCount(count);
      
      if (currentFileAnimated) {
        setVisibleLineCount(count);
      }
    }
  };

  const handleLineAnimation = (currentLine: number) => {
    setVisibleLineCount(currentLine);
  };

  const handleAnimationComplete = (content: any) => {
    setIsAnimating(false);
    
    if (activeFileId) {
      onContentLoaded(activeFileId, content, lineCount);
    }
  };

  // Esta função será chamada pelo CodeContent para informar quantas linhas existem
  const handleLineCountChange = (count: number) => {
    setLineCount(Math.max(1, count));
  };
  
  // Efeito para sincronizar a rolagem entre números de linha e conteúdo
  useEffect(() => {
    const codeArea = codeAreaRef.current;
    if (codeArea) {
      const lineNumbers = codeArea.querySelector(`.${styles.lineNumbers}`);
      const codeContent = codeArea.querySelector(`.${styles.codeContent}`);
      
      if (lineNumbers && codeContent) {
        const syncScroll = () => {
          lineNumbers.scrollTop = codeContent.scrollTop;
        };
        
        codeContent.addEventListener('scroll', syncScroll);
        return () => {
          codeContent.removeEventListener('scroll', syncScroll);
        };
      }
    }
  }, []);

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.tabsContainer}>
        <div 
          className={styles.tabs}
          ref={containerRef}
        >
          <AnimatePresence>
            {openFiles.map((file, index) => (
              <div
                key={file.id}
                className={`${styles.tab} ${isTabActive(file.id) ? styles.activeTab : ''} ${isDragging && draggingIndex === index ? styles.draggingTab : ''}`}
                onClick={() => handleSwitchTab(file.id)}
                ref={el => {
                  itemRefs.current[index] = el;
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDragLeave={handleDragLeave}
              >
                <span className={styles.tabIcon}>
                  {getTabIcon(file.id) === 'typescript' ? 
                    <SiTypescript className={styles.iconTS} /> : 
                    <DiReact className={styles.iconReact} />}
                </span>
                <span className={styles.tabTitle}>{file.name}</span>
                <span 
                  className={styles.closeButton}
                  onClick={(e) => handleCloseTab(file.id, e)}
                >
                  ×
                </span>
              </div>
            ))}
          </AnimatePresence>
          
          {dropIndicatorPosition && dropIndicatorPosition.visible && (
            <div 
              className={styles.dropIndicator}
              style={{
                left: `${dropIndicatorPosition.position}px`
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.editorContainer}>
        {activeFileId ? (
          <div 
            key={activeFileId}
            className={styles.codeArea}
            ref={codeAreaRef}
          >
            <div className={styles.lineNumbers}>
              {Array.from({ length: Math.max(1, visibleLineCount) }, (_, i) => (
                <div 
                  key={i} 
                  className={styles.lineNumber}
                >
                  {i + 1}
                </div>
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
                onLineCountChange={handleLineCountChange}
              />
            </div>
          </div>
        ) : (
          <div className={styles.welcomeScreen}>
            <div className={styles.welcomeText}>
              <h1 className={styles.welcomeTitle}>{"{CodeFolio}"}</h1>
              <h1 className={styles.welcomeTitle}>Portfolio by ILAN</h1>
              <p className={styles.welcomeSubtitle}>select a file to start</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 