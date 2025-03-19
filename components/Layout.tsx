'use client';

import React, { useEffect } from 'react';
import styles from './Layout.module.css';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Footer from './Footer';
import { useEditorStore } from '../store/editorStore';
import { useI18nStore } from '../i18n/i18n';
import { initialFileTree } from '../data/fileTreeData';

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
    // Só inicialize a árvore de arquivos se ela ainda não existir
    if (!fileTree) {
      setFileTree(initialFileTree);
    }
  }, [fileTree, setFileTree]);
  
  // Efeito para limpar o cache quando o idioma mudar
  useEffect(() => {
    // Limpar o cache de arquivos animados quando o idioma mudar
    // para forçar que o conteúdo seja recarregado com o novo idioma
    openFiles.forEach(file => {
      // Comparar o idioma armazenado com o atual
      if (!file.language || file.language !== currentLanguage) {
        console.log("Resetando animação para", file.id, "devido à mudança de idioma");
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
        <Sidebar />
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
      </div>
      <Footer />
    </div>
  );
} 