'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Editor.module.css';
import ProjectPreview from './ProjectPreview';
import CodeContent from './CodeContent';
import { OpenFile } from '../store/editorStore';
import { useDragDrop } from '../hooks/useDragDrop';
import { useEditorStore } from '../store/editorStore';
import { DiReact } from 'react-icons/di';
import { SiTypescript } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Use o hook personalizado de drag and drop
  const {
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
  } = useDragDrop({
    onReorder: (sourceIndex, targetIndex) => {
      const reorderedFiles = [...openFiles];
      const [movedFile] = reorderedFiles.splice(sourceIndex, 1);
      
      // Garante que o índice de inserção é válido
      const validTargetIndex = Math.max(0, Math.min(targetIndex, reorderedFiles.length));
      reorderedFiles.splice(validTargetIndex, 0, movedFile);
      
      onReorderFiles(reorderedFiles);
    }
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

  const handleCloseTab = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique propague para a aba
    onCloseProject(projectId);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.ts')) {
      return (
        <svg className={`${styles.tabIcon} ${styles.iconTS}`} width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z" />
        </svg>
      );
    }
    
    return null;
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
          onDragOver={handleTabsBarDragOver as any}
        >
          <AnimatePresence>
            {openFiles.map((file, index) => (
              <motion.div
                key={file.id}
                className={`${styles.tab} ${activeFileId === file.id ? styles.activeTab : ''}`}
                onClick={() => onSwitchProject(file.id)}
                ref={el => {
                  itemRefs.current[index] = el;
                }}
                draggable
                onDragStart={(e: any) => handleDragStart(e, index)}
                onDragOver={(e: any) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd as any}
                onDragLeave={handleDragLeave as any}
                onDrop={(e: any) => handleDrop(e, index)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className={styles.tabIcon}>
                  {file.id.endsWith('.ts') ? 
                    <SiTypescript className={styles.iconTS} /> : 
                    <DiReact className={styles.iconReact} />}
                </span>
                <span className={styles.tabTitle}>{file.name}</span>
                <span 
                  className={styles.closeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(file.id, e);
                  }}
                >
                  ×
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {dropIndicatorPos !== null && (
            <div 
              className={styles.dropIndicator} 
              style={{ left: `${dropIndicatorPos}px` }}
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
              <h1 className={styles.welcomeTitle}>Portfolio by ILAN</h1>
              <p className={styles.welcomeSubtitle}>select a file to start</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 