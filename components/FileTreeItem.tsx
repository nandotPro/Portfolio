import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../stores/editorStore';
import { useI18nStore } from '../stores/i18nStore';
import styles from '../styles/FileTreeItem.module.css';

const FileTreeItem = ({ node, level, onToggleFolder, onFileClick, activeFileId }) => {
  const { t } = useI18nStore();
  const { toggleFolder } = useEditorStore();
  const [isOpen, setIsOpen] = useState(node.isOpen);

  const handleToggleFolder = () => {
    toggleFolder(node.id);
    setIsOpen(!isOpen);
  };

  if (node.isFolder) {
    console.log(`Folder ${node.name} is ${node.isOpen ? 'open' : 'closed'}`);
    
    return (
      <div>
        <div 
          className={styles.folderItem} 
          onClick={handleToggleFolder}
          style={{ paddingLeft: level * 20 }}
        >
          {node.name}
        </div>
        
        <AnimatePresence>
          {isOpen && node.children && (
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
    <div className={styles.fileItem}>
      {node.name}
    </div>
  );
};

export default FileTreeItem; 