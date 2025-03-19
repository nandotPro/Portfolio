'use client';

import React, { useEffect, Suspense, lazy } from 'react';
import styles from './Layout.module.css';
import { useEditorStore } from '../store/editorStore';
import { useI18nStore } from '../i18n/i18n';
import { initialFileTree } from '../data/fileTreeData';

// Substituindo importações diretas por lazy loading
const Sidebar = lazy(() => import('./Sidebar'));
const Footer = lazy(() => import('./Footer'));
const Editor = lazy(() => import('./Editor'));

// Componentes de fallback
const SidebarFallback = () => <div className={styles.sidebarFallback}></div>;
const EditorFallback = () => <div className={styles.editorFallback}></div>;
const FooterFallback = () => <div className={styles.footerFallback}></div>;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { 
    openFiles, 
    activeFileId, 
    closeProject, 
    switchProject, 
    reorderFiles, 
    setContentLoaded,
    setFileTree,
    fileTree,
    resetAnimationState
  } = useEditorStore();
  
  const { currentLanguage } = useI18nStore();

  // Inicializar a árvore de arquivos
  useEffect(() => {
    if (!fileTree) {
      setFileTree(initialFileTree);
    }
  }, [fileTree, setFileTree]);
  
  // Efeito para limpar o cache quando o idioma mudar
  useEffect(() => {
    openFiles.forEach(file => {
      if (!file.language || file.language !== currentLanguage) {
        resetAnimationState(file.id);
      }
    });
  }, [currentLanguage, openFiles, resetAnimationState]);

  // Encontrar o arquivo atual
  const currentFile = openFiles.find(file => file.id === activeFileId);

  // Função para lidar com a conclusão do carregamento do conteúdo
  const handleContentLoaded = (fileId: string, content: any, lineCount: number) => {
    setContentLoaded(fileId, content, lineCount, currentLanguage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar />
        </Suspense>
        <Suspense fallback={<EditorFallback />}>
          <Editor 
            openFiles={openFiles}
            activeFileId={activeFileId}
            onCloseProject={closeProject}
            onSwitchProject={switchProject}
            onContentLoaded={handleContentLoaded}
            onReorderFiles={reorderFiles}
            currentFileAnimated={currentFile?.animated || false}
            currentFileContent={currentFile?.content}
          >
            {children}
          </Editor>
        </Suspense>
      </div>
      <Suspense fallback={<FooterFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
} 