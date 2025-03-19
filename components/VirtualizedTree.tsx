import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useEditorStore, FileNode } from '../store/editorStore';
import styles from './Sidebar.module.css';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder,
  FolderOpen,
  Hexagon,
  Atom,
  Info
} from 'lucide-react';

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

// Substitua a definição do AutoSizer
interface AutoSizerProps {
  children: (size: { width: number; height: number }) => React.ReactNode;
}

const VirtualizedTree: React.FC = () => {
  const { fileTree, toggleFolder, openProject, activeFileId } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const [height, setHeight] = useState(500);
  
  // Estado local para acompanhar as pastas expandidas
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  
  // Cache da lista plana - só recalcula quando necessário
  const flatList = useMemo(() => {
    if (!fileTree) return [];
    return flattenTree(fileTree, 0, expandedMap);
  }, [fileTree, expandedMap]);
  
  // Atualizar a altura com base no container pai
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
      }
    };
    
    updateHeight();
    
    // Observer para detectar mudanças de tamanho
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateHeight);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    } else {
      // Fallback para navegadores que não suportam ResizeObserver
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);
  
  // Quando uma pasta é expandida/contraída, atualize a lista
  useEffect(() => {
    if (listRef.current) {
      // Força a lista a recalcular com as novas dimensões
      (listRef.current as any).resetAfterIndex(0);
    }
  }, [flatList.length]);
  
  // Manipuladores de eventos com memoização para evitar recriações desnecessárias
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
  
  // Renderizar cada linha com memoização para evitar re-renderizações desnecessárias
  const Row = useCallback(({ index, style }: ListChildComponentProps) => {
    const { node, level } = flatList[index];
    const isActive = activeFileId === node.id;
    const paddingLeft = `${level * 16}px`;
    
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
                <ChevronDown size={14} /> : 
                <ChevronRight size={14} />
              }
            </div>
            {isOpen ? 
              <FolderOpen size={18} className={`${styles.folderIcon} ${styles.iconFolderOpen}`} /> : 
              <Folder size={18} className={`${styles.folderIcon} ${styles.iconFolder}`} />
            }
            <span className={styles.itemName}>{node.name}</span>
          </div>
          
          {isOpen && (
            <div className={styles.folderContents}>
              {/* Conteúdo existente já será renderizado pelo componente List */}
            </div>
          )}
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
          <span className={styles.tabIcon}>
            {(() => {
              const fileType = node.fileType;
              if (fileType === 'ts') {
                return <span className={`${styles.fileIcon} ${styles.iconTS}`}>TS</span>;
              } else if (fileType === 'tsx') {
                return <Atom size={16} className={`${styles.fileIcon} ${styles.iconReact}`} />;
              } else if (fileType === 'js') {
                return <span className={`${styles.fileIcon} ${styles.iconJS}`}>JS</span>;
              } else if (fileType === 'md') {
                return <Info size={16} className={`${styles.fileIcon} ${styles.iconMD}`} />;
              } else if (fileType === 'json') {
                return <Hexagon size={16} className={`${styles.fileIcon} ${styles.iconJSON}`} />;
              } else {
                return <span className={styles.fileIcon}>F</span>;
              }
            })()}
          </span>
          <span className={styles.itemName}>{node.name}</span>
        </div>
      </div>
    );
  }, [flatList, activeFileId, expandedMap, handleToggleFolder, handleFileClick]);
  
  if (!fileTree) return null;

  return (
    <div ref={containerRef} className={styles.fileTree} style={{ height: '100%' }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={listRef}
            className={styles.virtualList}
            width={width}
            height={height}
            itemCount={flatList.length}
            itemSize={24} // altura de cada item
            overscanCount={10} // número de itens a serem renderizados fora da área visível
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(VirtualizedTree); 