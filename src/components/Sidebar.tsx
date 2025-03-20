'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/modules/sidebar.module.css';
import { useEditorStore, FileNode } from '../store/editorStore';
import { useI18nStore } from '../i18n/i18n';
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
          <FolderArrow isOpen={node.isOpen} />
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
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

interface FolderArrowProps {
  isOpen: boolean | undefined;
}

const FolderArrow = memo<FolderArrowProps>(({ isOpen }) => (
  <div className={styles.folderArrow}>
    {isOpen ? 
      <ChevronDown size={14} data-opened="true" /> : 
      <ChevronRight size={14} />
    }
  </div>
));

FolderArrow.displayName = 'FolderArrow';

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