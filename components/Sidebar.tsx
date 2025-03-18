'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sidebar.module.css';
import { useEditorStore, FileNode } from '../store/editorStore';
// Importação de ícones
import { VscFolder, VscFolderOpened, VscChevronRight, VscChevronDown, VscFile } from 'react-icons/vsc';
import { SiTypescript } from 'react-icons/si';
import { DiJavascript1 } from 'react-icons/di';

export default function Sidebar() {
  const { 
    fileTree, 
    openProject, 
    toggleFolder, 
    activeFileId 
  } = useEditorStore();

  const handleFileClick = (filePath: string, fileId: string, fileName: string) => {
    openProject(filePath, fileId, fileName);
  };

  // Substituir os renderFolderIcon e getFileIcon por estas versões com react-icons
  const renderFolderIcon = (isOpen: boolean = false) => {
    return isOpen 
      ? <VscFolderOpened className={`${styles.folderIcon} ${styles.iconFolderOpen}`} /> 
      : <VscFolder className={`${styles.folderIcon} ${styles.iconFolder}`} />;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'ts':
        return <SiTypescript className={`${styles.fileIcon} ${styles.iconTS}`} />;
      case 'js':
        return <DiJavascript1 className={`${styles.fileIcon} ${styles.iconJS}`} />;
      default:
        return <VscFile className={styles.fileIcon} />;
    }
  };

  // Modificar o componente FileTreeItem para usar Framer Motion
  const FileTreeItem = ({ item, depth = 0 }: { item: FileNode, depth?: number }) => {
    const paddingLeft = 8 + (depth * 16);

    if (item.isFolder) {
      return (
        <div>
          <div 
            className={styles.folderItem} 
            onClick={() => toggleFolder(item.id)}
          >
            <div style={{ paddingLeft: `${paddingLeft}px`, display: 'flex', alignItems: 'center' }}>
              <div className={styles.folderArrow}>
                {item.isOpen 
                  ? <VscChevronDown /> 
                  : <VscChevronRight />
                }
              </div>
              {renderFolderIcon(item.isOpen)}
              <span className={styles.itemName}>{item.name}</span>
            </div>
          </div>
          
          {item.isOpen && item.children && (
            <div className={styles.folderContents}>
              {item.children.map(child => (
                <FileTreeItem key={child.id} item={child} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      const fileType = item.fileType || 'default';
      
      return (
        <div 
          className={styles.fileItem}
          onClick={() => handleFileClick(item.path, item.id, item.name)}
        >
          <div style={{ paddingLeft: `${paddingLeft + 20}px`, display: 'flex', alignItems: 'center' }}>
            {getFileIcon(fileType)}
            <span className={styles.itemName}>{item.name}</span>
          </div>
        </div>
      );
    }
  };

  if (!fileTree) {
    return <div className={styles.sidebar}>Carregando...</div>;
  }

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
        <FileTreeItem item={fileTree} />
      </div>
    </div>
  );
} 