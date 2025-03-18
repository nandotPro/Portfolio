'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Editor from './Editor';
import styles from './Layout.module.css';

interface LayoutProps {
  children?: React.ReactNode;
}

interface OpenFile {
  id: string;
  name: string;
  content?: any; // Armazenar conteúdo do arquivo
  animated: boolean; // Controlar se já foi animado
}

export default function Layout({ children }: LayoutProps) {
  // Lista de arquivos abertos
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  // Arquivo ativo atual
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const handleOpenProject = (projectId: string) => {
    // Verificar se o arquivo já está aberto
    const isFileOpen = openFiles.some(file => file.id === projectId);
    
    if (!isFileOpen) {
      // Adicionar novo arquivo à lista (não animado ainda)
      setOpenFiles(prev => [...prev, { 
        id: projectId, 
        name: `${projectId}.js`,
        animated: false 
      }]);
    }
    
    // Definir como arquivo ativo
    setActiveFileId(projectId);
  };

  const handleCloseProject = (projectId: string) => {
    // Remover arquivo da lista
    const newOpenFiles = openFiles.filter(file => file.id !== projectId);
    setOpenFiles(newOpenFiles);
    
    // Se estava ativo, ativar outro arquivo ou nenhum
    if (activeFileId === projectId) {
      setActiveFileId(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1].id : null);
    }
  };

  const handleSwitchProject = (projectId: string) => {
    setActiveFileId(projectId);
  };

  const handleContentLoaded = (projectId: string, content: any, lineCount: number) => {
    console.log('Content loaded for', projectId, 'with', lineCount, 'lines');
    
    // Atualizar o arquivo como já animado e armazenar seu conteúdo
    setOpenFiles(prev => 
      prev.map(file => 
        file.id === projectId 
          ? { ...file, content, animated: true } 
          : file
      )
    );
  };

  // Encontrar o arquivo atual
  const currentFile = openFiles.find(file => file.id === activeFileId);

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <Sidebar setActiveProject={handleOpenProject} />
        <Editor 
          openFiles={openFiles}
          activeFileId={activeFileId}
          onCloseProject={handleCloseProject}
          onSwitchProject={handleSwitchProject}
          onContentLoaded={handleContentLoaded}
          currentFileAnimated={currentFile?.animated || false}
          currentFileContent={currentFile?.content}
        >
          {children}
        </Editor>
      </div>
    </div>
  );
} 