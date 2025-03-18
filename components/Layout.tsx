'use client';

import { useEffect } from 'react';
import styles from './Layout.module.css';
import Sidebar from './Sidebar';
import Editor from './Editor';
import { useEditorStore } from '../store/editorStore';
import { initialFileTree } from '../data/fileTreeData';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { 
    openFiles, 
    activeFileId, 
    openProject, 
    closeProject, 
    switchProject, 
    reorderFiles, 
    setContentLoaded,
    setFileTree,
    fileTree
  } = useEditorStore();

  // Inicializar a árvore de arquivos
  useEffect(() => {
    // Só inicialize a árvore de arquivos se ela ainda não existir
    if (!fileTree) {
      setFileTree(initialFileTree);
    }
  }, [fileTree, setFileTree]);

  // Encontrar o arquivo atual
  const currentFile = openFiles.find(file => file.id === activeFileId);

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <Sidebar />
        <Editor 
          openFiles={openFiles}
          activeFileId={activeFileId}
          onCloseProject={closeProject}
          onSwitchProject={switchProject}
          onContentLoaded={setContentLoaded}
          onReorderFiles={reorderFiles}
          currentFileAnimated={currentFile?.animated || false}
          currentFileContent={currentFile?.content}
        >
          {children}
        </Editor>
      </div>
    </div>
  );
} 