'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sidebar.module.css';
import { useEditorStore, FileNode } from '../store/editorStore';
import { useI18nStore } from '../i18n/i18n';
// Importação de ícones
import { 
  ChevronRight, 
  ChevronDown, 
  Folder,
  FolderOpen,
  FilePlus,
  FolderPlus,
  RefreshCw,
  Hexagon,
  Atom,
  Info
} from 'lucide-react';

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

  // Implementação de getFileIcon simplificada usando spans
  const getFileIcon = (fileType: string | undefined) => {
    switch (fileType) {
      case 'ts':
        return <span className={`${styles.fileIcon} ${styles.iconTS}`}>TS</span>;
      case 'tsx':
        return <Atom size={16} className={`${styles.fileIcon} ${styles.iconReact}`} />;
      case 'js':
        return <span className={`${styles.fileIcon} ${styles.iconJS}`}>JS</span>;
      case 'md':
        return <Info size={16} className={`${styles.fileIcon} ${styles.iconMD}`} />;
      case 'json':
        return <Hexagon size={16} className={`${styles.fileIcon} ${styles.iconJSON}`} />;
      default:
        return <span className={styles.fileIcon}>F</span>;
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
              <ChevronDown size={14} /> : 
              <ChevronRight size={14} />
            }
          </div>
          {node.isOpen ? 
            <FolderOpen size={18} className={`${styles.folderIcon} ${styles.iconFolderOpen}`} /> : 
            <Folder size={18} className={`${styles.folderIcon} ${styles.iconFolder}`} />
          }
          <span className={styles.itemName}>{node.name}</span>
        </div>
        
        <AnimatePresence>
          {node.isOpen && node.children && (
            <motion.div 
              className={styles.folderContents}
              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
              animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
              exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
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
});

FileTreeItem.displayName = 'FileTreeItem';

// Componente principal de Sidebar também memoizado
const Sidebar = () => {
  const { 
    fileTree, 
    openProject, 
    toggleFolder, 
    activeFileId 
  } = useEditorStore();
  
  const { t } = useI18nStore();

  const handleFileClick = (filePath: string, fileId: string, fileName: string) => {
    openProject(filePath, fileId, fileName);
  };
  
  if (!fileTree) return <div className={styles.sidebar}>Carregando...</div>;

  return (
    <div className={styles.sidebar}>
      <div className={styles.explorerHeader}>
        <span>{t('ui.explorer')}</span>
        <div className={styles.explorerActions}>
          <div className={styles.fakeButton}>
            <FilePlus size={16} />
          </div>
          <div className={styles.fakeButton}>
            <FolderPlus size={16} />
          </div>
          <div className={styles.fakeButton}>
            <RefreshCw size={16} />
          </div>
        </div>
      </div>
      <div className={styles.treeContainer}>
        <FileTreeItem
          node={fileTree}
          level={0}
          onToggleFolder={toggleFolder}
          onFileClick={handleFileClick}
          activeFileId={activeFileId}
        />
      </div>
    </div>
  );
};

export default memo(Sidebar); 