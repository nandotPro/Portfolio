import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useEditorStore, FileNode } from '../store/editorStore';
import styles from './Sidebar.module.css';
import { VscFolder, VscFolderOpened, VscChevronRight, VscChevronDown, VscFile } from 'react-icons/vsc';
import { SiTypescript } from 'react-icons/si';
import { DiJavascript1 } from 'react-icons/di';

// Função para transformar a estrutura de árvore em uma lista plana para virtualização
const flattenTree = (node: FileNode, level = 0, expandedMap: Record<string, boolean>): Array<{node: FileNode, level: number}> => {
  let result: Array<{node: FileNode, level: number}> = [{ node, level }];
  
  if (node.isFolder && node.children && (node.isOpen || expandedMap[node.id])) {
    for (const child of node.children) {
      result = [...result, ...flattenTree(child, level + 1, expandedMap)];
    }
  }
  
  return result;
};

const VirtualizedTree: React.FC = () => {
  const { fileTree, toggleFolder, openProject, activeFileId } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(500);
  
  // Estado local para acompanhar as pastas expandidas
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  
  // Atualizar a altura com base no container pai
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  
  // Manipuladores de eventos
  const handleToggleFolder = useCallback((id: string) => {
    toggleFolder(id);
    setExpandedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, [toggleFolder]);
  
  const handleFileClick = useCallback((path: string, id: string, name: string) => {
    openProject(path, id, name);
  }, [openProject]);
  
  // Obter a lista plana para a virtualização
  const flatList = useMemo(() => {
    if (!fileTree) return [];
    return flattenTree(fileTree, 0, expandedMap);
  }, [fileTree, expandedMap]);
  
  // Renderizar cada linha
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const { node, level } = flatList[index];
    const isActive = activeFileId === node.id;
    const paddingLeft = `${level * 16}px`;
    
    // Obter o ícone para o tipo de arquivo
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
      const isOpen = node.isOpen || expandedMap[node.id];
      
      return (
        <div style={style}>
          <div 
            className={styles.folderItem} 
            onClick={() => handleToggleFolder(node.id)}
            style={{ paddingLeft }}
          >
            <div className={styles.folderArrow}>
              {isOpen ? 
                <VscChevronDown /> : 
                <VscChevronRight />
              }
            </div>
            {isOpen ? 
              <VscFolderOpened className={`${styles.folderIcon} ${styles.iconFolderOpen}`} /> : 
              <VscFolder className={`${styles.folderIcon} ${styles.iconFolder}`} />
            }
            <span className={styles.itemName}>{node.name}</span>
          </div>
        </div>
      );
    }
    
    return (
      <div style={style}>
        <div 
          className={`${styles.fileItem} ${isActive ? styles.active : ''}`}
          onClick={() => handleFileClick(node.path, node.id, node.name)}
          style={{ paddingLeft }}
        >
          {getFileIcon(node.fileType)}
          <span className={styles.itemName}>{node.name}</span>
        </div>
      </div>
    );
  };
  
  if (!fileTree) return null;
  
  return (
    <div className={styles.virtualTreeContainer} ref={containerRef}>
      <List
        height={height}
        itemCount={flatList.length}
        itemSize={24}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default React.memo(VirtualizedTree); 