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

  const handleOpenProject = (projectPath: string, fileId: string = '') => {
    const fileInfo = {
      id: fileId || projectPath,
      path: projectPath,
      name: getProjectName(projectPath),
      content: null,
      animated: false
    };
    
    // Verificação para garantir que o nome do arquivo inclua a extensão .ts
    if (fileInfo.name && !fileInfo.name.endsWith('.ts') && !fileInfo.name.endsWith('.js')) {
      fileInfo.name = `${fileInfo.name}.ts`;
    }
    
    // Verificar se o arquivo já está aberto
    const isFileOpen = openFiles.some(file => file.id === fileInfo.id);
    
    if (!isFileOpen) {
      // Adicionar novo arquivo à lista (não animado ainda)
      setOpenFiles(prev => [...prev, fileInfo]);
    }
    
    // Definir como arquivo ativo
    setActiveFileId(fileInfo.id);
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

  const handleReorderFiles = (newOrder: any[]) => {
    setOpenFiles(newOrder);
  };

  // Encontrar o arquivo atual
  const currentFile = openFiles.find(file => file.id === activeFileId);

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <Sidebar 
          setActiveProject={handleOpenProject} 
          activeFileId={activeFileId} 
          openFiles={openFiles} 
        />
        <Editor 
          openFiles={openFiles}
          activeFileId={activeFileId}
          onCloseProject={handleCloseProject}
          onSwitchProject={handleSwitchProject}
          onContentLoaded={handleContentLoaded}
          onReorderFiles={handleReorderFiles}
          currentFileAnimated={currentFile?.animated || false}
          currentFileContent={currentFile?.content}
        >
          {children}
        </Editor>
      </div>
    </div>
  );
}

const getProjectName = (projectPath: string): string => {
  // Mapear caminhos para nomes de arquivos específicos da sidebar
  const pathToNameMap: Record<string, string> = {
    'about': 'about-me.ts',
    'contact': 'contact.ts',
    'backend': 'backend-api.ts',
    'devops': 'devops-pipeline.ts',
    'ai': 'ai-project.ts',
    'tech': 'tech-stack.ts',
    'tools': 'tools.ts',
    // Adicione outros mapeamentos conforme necessário
  };
  
  return pathToNameMap[projectPath] || `${projectPath}.ts`;
}; 