'use client';

import styles from './Editor.module.css';
import ProjectPreview from './ProjectPreview';
import CodeContent from './CodeContent';
import { useState, useEffect } from 'react';

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
  currentFileAnimated,
  currentFileContent,
  children 
}: EditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
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
  }, [activeFileId, currentFileAnimated]);

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

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.tabsBar}>
        {openFiles.map(file => (
          <div 
            key={file.id} 
            className={`${styles.tab} ${activeFileId === file.id ? styles.activeTab : ''}`}
            onClick={() => onSwitchProject(file.id)}
          >
            {file.name.endsWith('.js') 
              ? file.name.replace('.js', '.ts') 
              : file.name}
            <span 
              className={styles.closeTab} 
              onClick={(e) => handleCloseTab(file.id, e)}
            >
              ×
            </span>
          </div>
        ))}
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