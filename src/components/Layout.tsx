'use client';

import React, { useEffect, Suspense, lazy } from 'react';
import styles from '../styles/modules/layout.module.css';
import { useEditorStore } from '../store/editorStore';
import { useI18nStore } from '../i18n/i18n';
import { initialFileTree } from '../data/fileTreeData';
import { ErrorBoundary } from './ErrorBoundary';

const Sidebar = lazy(() => import('./Sidebar'));
const Footer = lazy(() => import('./Footer'));
const Editor = lazy(() => import('./Editor'));

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

  useEffect(() => {
    if (!fileTree) {
      setFileTree(initialFileTree);
    }
  }, [fileTree, setFileTree]);
  
  useEffect(() => {
    openFiles.forEach(file => {
      if (!file.language || file.language !== currentLanguage) {
        resetAnimationState(file.id);
      }
    });
  }, [currentLanguage, openFiles, resetAnimationState]);

  const currentFile = openFiles.find(file => file.id === activeFileId);

  const handleContentLoaded = (fileId: string, content: any, lineCount: number) => {
    setContentLoaded(fileId, content, lineCount, currentLanguage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <ErrorBoundary fallback={<div>Algo deu errado</div>}>
          <Suspense fallback={<SidebarFallback />}>
            <Sidebar />
          </Suspense>
        </ErrorBoundary>
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