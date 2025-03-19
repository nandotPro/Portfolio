import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CodeLine } from '../components/CodeContent';
import { useI18nStore } from '../i18n/i18n';

export interface FileNode {
  id: string;
  name: string;
  isFolder: boolean;
  path: string;
  children?: FileNode[];
  isOpen?: boolean;
  fileType?: string;
}

export interface OpenFile {
  id: string;
  name: string;
  path: string;
  content: any;
  animated: boolean;
  language?: string;
}

interface EditorState {
  // Estado
  fileTree: FileNode | null;
  openFiles: OpenFile[];
  activeFileId: string | null;
  fileContents: Record<string, any>;

  // Ações
  openProject: (path: string, fileId: string, fileName: string) => void;
  closeProject: (fileId: string) => void;
  switchProject: (fileId: string) => void;
  reorderFiles: (newOrder: OpenFile[]) => void;
  setContentLoaded: (fileId: string, content: any, lineCount: number, language?: string) => void;
  resetAnimationState: (fileId: string) => void;
  toggleFolder: (folderId: string) => void;
  setFileTree: (fileTree: FileNode) => void;
  getContentForSection: (section: string) => CodeLine[];
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    fileTree: null,
    openFiles: [] as OpenFile[],
    activeFileId: null,
    fileContents: {},

    openProject: (path, fileId, fileName) => set((state) => {
      // Verificar se o arquivo já está aberto E já é o ativo
      const existingFileIndex = state.openFiles.findIndex(file => file.id === fileId);
      
      // Se já for o arquivo ativo, não faça nada - isso evita renderizações desnecessárias
      if (existingFileIndex >= 0 && state.activeFileId === fileId) {
        return {}; // Não altere o estado, retornando um objeto vazio
      }
      
      if (existingFileIndex >= 0) {
        // Se o arquivo já estiver aberto, apenas ative-o
        state.activeFileId = fileId;
      } else {
        // Se não estiver aberto, adicione à lista de arquivos abertos
        state.openFiles.push({
          id: fileId,
          name: fileName,
          path: path,
          content: null,
          animated: false
        });
        state.activeFileId = fileId;
      }
    }),

    closeProject: (fileId) => set((state) => {
      // Encontra o índice do arquivo a ser fechado
      const fileIndex = state.openFiles.findIndex(file => file.id === fileId);
      
      if (fileIndex >= 0) {
        // Remove o arquivo
        state.openFiles.splice(fileIndex, 1);
        
        // Se o arquivo fechado era o ativo, ative outro
        if (state.activeFileId === fileId) {
          if (state.openFiles.length > 0) {
            // Ativar o próximo arquivo ou o anterior, dependendo da posição
            const newIndex = Math.min(fileIndex, state.openFiles.length - 1);
            state.activeFileId = state.openFiles[newIndex].id;
          } else {
            // Se não houver mais arquivos, defina como null
            state.activeFileId = null;
          }
        }
      }
    }),

    switchProject: (fileId) => set((state) => {
      // Ativa um arquivo específico
      if (state.openFiles.some(file => file.id === fileId)) {
        state.activeFileId = fileId;
      }
    }),

    reorderFiles: (newOrder) => set((state) => {
      state.openFiles = newOrder;
    }),

    setContentLoaded: (fileId, content, lineCount, language) => set((state) => {
      // Atualiza o conteúdo de um arquivo e marca como animado
      const fileIndex = state.openFiles.findIndex(file => file.id === fileId);
      if (fileIndex >= 0) {
        state.openFiles[fileIndex].content = content;
        state.openFiles[fileIndex].animated = true;
        
        // Se fornecido, armazene o idioma atual do conteúdo
        if (language) {
          state.openFiles[fileIndex].language = language;
        }
      }
    }),

    resetAnimationState: (fileId) => set((state) => {
      // Resetar o estado de animação para um arquivo específico
      const fileIndex = state.openFiles.findIndex(file => file.id === fileId);
      if (fileIndex >= 0) {
        state.openFiles[fileIndex].animated = false;
        state.openFiles[fileIndex].content = null;
      }
    }),

    toggleFolder: (folderId) => set((state) => {
      // Função recursiva para alternar a pasta
      const toggleFolderRecursive = (node: FileNode): FileNode => {
        if (!node.isFolder) return node;
        
        if (node.id === folderId) {
          return { ...node, isOpen: !node.isOpen };
        }
        
        if (node.children) {
          return {
            ...node,
            children: node.children.map(toggleFolderRecursive)
          };
        }
        
        return node;
      };
      
      if (state.fileTree) {
        state.fileTree = toggleFolderRecursive(state.fileTree);
      }
    }),

    setFileTree: (fileTree) => set((state) => {
      state.fileTree = fileTree;
    }),

    getContentForSection: (section: string) => {
      // Usar getState() para acessar o estado atual do i18nStore sem criar dependência circular
      const i18nStore = useI18nStore.getState();
      return i18nStore.getContentForSection(section);
    }
  }))
);
