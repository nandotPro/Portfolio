'use client';

import { useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sidebar.module.css';
import { useEditorStore, FileNode } from '../store/editorStore';
import { useI18nStore } from '../i18n/i18n';
import VirtualizedTree from './VirtualizedTree';
// Importação de ícones
import { VscFolder, VscFolderOpened, VscChevronRight, VscChevronDown, VscFile } from 'react-icons/vsc';
import { SiTypescript } from 'react-icons/si';
import { DiJavascript1 } from 'react-icons/di';

// Componente de item de arquivo memoizado para evitar re-renderizações desnecessárias
const FileTreeItem = memo(({ 
  node, 
  level, 
  onToggleFolder, 
  onFileClick, 
  activeFileId 
}: {
  node: FileNode;
  level: number;
  onToggleFolder: (id: string) => void;
  onFileClick: (path: string, id: string, name: string) => void;
  activeFileId: string | null;
}) => {
  const isActive = activeFileId === node.id;
  const paddingLeft = `${level * 16}px`;

  const getFileIcon = (fileType: string | undefined) => {
    switch (fileType) {
      case 'ts':
        return <SiTypescript className={`${styles.fileIcon} ${styles.iconTS}`} />;
      case 'js':
        return <DiJavascript1 className={`${styles.fileIcon} ${styles.iconJS}`} />;
      default:
        return <VscFile className={styles.fileIcon} />;
    }
  };

  if (node.isFolder) {
    return (
      <div>
        <div 
          className={styles.folderItem} 
          onClick={() => onToggleFolder(node.id)}
          style={{ paddingLeft }}
        >
          <div className={styles.folderArrow}>
            {node.isOpen ? 
              <VscChevronDown /> : 
              <VscChevronRight />
            }
          </div>
          {node.isOpen ? 
            <VscFolderOpened className={`${styles.folderIcon} ${styles.iconFolderOpen}`} /> : 
            <VscFolder className={`${styles.folderIcon} ${styles.iconFolder}`} />
          }
          <span className={styles.itemName}>{node.name}</span>
        </div>
        
        {node.isOpen && node.children && (
          <div className={styles.folderContents}>
            {node.children.map((child) => (
              <FileTreeItem
                key={child.id}
                node={child}
                level={level + 1}
                onToggleFolder={onToggleFolder}
                onFileClick={onFileClick}
                activeFileId={activeFileId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`${styles.fileItem} ${isActive ? styles.active : ''}`}
      onClick={() => onFileClick(node.path, node.id, node.name)}
      style={{ paddingLeft }}
    >
      {getFileIcon(node.fileType)}
      <span className={styles.itemName}>{node.name}</span>
    </div>
  );
}, (prevProps, nextProps) => {
  // Lógica personalizada para definir quando o componente deve re-renderizar
  return (
    prevProps.node.isOpen === nextProps.node.isOpen &&
    prevProps.activeFileId === nextProps.activeFileId &&
    // Se o nó for o ativo, forçar re-renderização
    (prevProps.node.id !== prevProps.activeFileId && prevProps.node.id !== nextProps.activeFileId)
  );
});

// Componente principal de Sidebar também memoizado
const Sidebar = () => {
  const { fileTree } = useEditorStore();
  const { t } = useI18nStore();
  
  if (!fileTree) return <div className={styles.sidebar}>Carregando...</div>;

  return (
    <div className={styles.sidebar}>
      <div className={styles.explorerHeader}>
        <span>{t('ui.explorer')}</span>
      </div>
      <div className={styles.treeContainer}>
        <VirtualizedTree />
      </div>
    </div>
  );
};

export default memo(Sidebar); 