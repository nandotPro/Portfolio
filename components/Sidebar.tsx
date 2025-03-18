'use client';

import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  setActiveProject: (project: string) => void;
  activeFileId: string | null;
  openFiles: any[];
}

type FolderType = {
  id: string;
  name: string;
  isFolder: true;
  children: (FolderType | FileType)[];
  isOpen?: boolean;
};

type FileType = {
  id: string;
  name: string;
  isFolder: false;
  path: string;
  fileType?: string;
};

const getFileType = (fileName: string): string => {
  if (fileName.endsWith('.ts')) return 'ts';
  if (fileName.endsWith('.js')) return 'js';
  if (fileName.endsWith('.html')) return 'html';
  if (fileName.endsWith('.css')) return 'css';
  if (fileName.endsWith('.json')) return 'json';
  return 'default';
};

export default function Sidebar({ setActiveProject, activeFileId, openFiles }: SidebarProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  
  useEffect(() => {
    setActiveFile(activeFileId);
  }, [activeFileId]);
  
  const [fileStructure, setFileStructure] = useState<FolderType>({
    id: 'root',
    name: 'main',
    isFolder: true,
    isOpen: true,
    children: [
      {
        id: 'about-me',
        name: 'about-me.ts',
        isFolder: false,
        path: 'about',
        fileType: 'ts'
      },
      {
        id: 'contact',
        name: 'contact.ts',
        isFolder: false,
        path: 'contact',
        fileType: 'ts'
      },
      {
        id: 'projects',
        name: 'projects',
        isFolder: true,
        isOpen: false,
        children: [
          {
            id: 'backend-api',
            name: 'backend-api.ts',
            isFolder: false,
            path: 'backend',
            fileType: 'ts'
          },
          {
            id: 'devops-pipeline',
            name: 'devops-pipeline.ts',
            isFolder: false,
            path: 'devops',
            fileType: 'ts'
          },
          {
            id: 'ai-project',
            name: 'ai-project.ts',
            isFolder: false,
            path: 'ai',
            fileType: 'ts'
          }
        ]
      },
      {
        id: 'skills',
        name: 'skills',
        isFolder: true,
        isOpen: false,
        children: [
          {
            id: 'tech-stack',
            name: 'tech-stack.ts',
            isFolder: false,
            path: 'tech',
            fileType: 'ts'
          },
          {
            id: 'tools',
            name: 'tools.ts',
            isFolder: false,
            path: 'tools',
            fileType: 'ts'
          }
        ]
      }
    ]
  });

  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const toggleFolderRecursive = (item: FolderType | FileType): FolderType | FileType => {
      if (!item.isFolder) return item;
      
      if (item.id === folderId) {
        return { ...item, isOpen: !item.isOpen };
      }
      
      return {
        ...item,
        children: item.children.map(child => toggleFolderRecursive(child))
      };
    };
    
    setFileStructure(prevStructure => toggleFolderRecursive(prevStructure) as FolderType);
  };

  const isFileOpen = (fileId: string): boolean => {
    return openFiles.some(file => file.id === fileId);
  };

  const handleFileClick = (filePath: string, fileId: string) => {
    setActiveProject(filePath);
    setActiveFile(fileId);
  };

  const renderFolderIcon = (isOpen: boolean = false) => (
    <svg className={`${styles.folderIcon} ${isOpen ? styles.iconFolderOpen : styles.iconFolder}`} 
         width="16" height="16" viewBox="0 0 24 24">
      {isOpen 
        ? <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
        : <path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
      }
    </svg>
  );

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'ts':
        return (
          <svg className={`${styles.fileIcon} ${styles.iconTS}`} width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z" />
          </svg>
        );
      case 'js':
        return (
          <svg className={`${styles.fileIcon} ${styles.iconJS}`} width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
          </svg>
        );
      default:
        return (
          <svg className={styles.fileIcon} width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
          </svg>
        );
    }
  };

  const FileTreeItem = ({ item, depth = 0 }: { item: FolderType | FileType, depth?: number }) => {
    const paddingLeft = 8 + (depth * 16);

    if (item.isFolder) {
      return (
        <div>
          <div 
            className={styles.folderItem} 
            onClick={(e) => toggleFolder(item.id, e)}
          >
            <div style={{ paddingLeft: `${paddingLeft}px`, display: 'flex', alignItems: 'center' }}>
              <div className={styles.folderArrow}>
                {item.isOpen ? '▾' : '▸'}
              </div>
              {renderFolderIcon(item.isOpen)}
              <span className={styles.itemName}>{item.name}</span>
            </div>
          </div>
          
          {item.isOpen && (
            <div className={styles.folderContents}>
              {item.children.map(child => (
                <FileTreeItem key={child.id} item={child} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      const fileType = item.fileType || getFileType(item.name);
      return (
        <div 
          className={styles.fileItem}
          onClick={() => handleFileClick(item.path, item.id)}
        >
          <div style={{ paddingLeft: `${paddingLeft + 20}px`, display: 'flex', alignItems: 'center' }}>
            {getFileIcon(fileType)}
            <span className={styles.itemName}>{item.name}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.explorerSection}>
        <div className={styles.explorerHeader}>
          <span>EXPLORER</span>
          <div className={styles.explorerActions}>
            <span className={styles.actionButton} title="New File">+</span>
            <span className={styles.actionButton} title="Refresh">↻</span>
            <span className={`${styles.actionButton} ${styles.collapseButton}`} title="Collapse All">⌄</span>
          </div>
        </div>
      </div>
      
      <div className={styles.fileTree}>
        <FileTreeItem item={fileStructure} />
      </div>
    </div>
  );
} 