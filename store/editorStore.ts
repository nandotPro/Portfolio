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
  fileTree: FileNode | null;
  openFiles: OpenFile[];
  activeFileId: string | null;
  fileContents: Record<string, any>;

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
      const existingFileIndex = state.openFiles.findIndex(file => file.id === fileId);
      
      if (existingFileIndex >= 0 && state.activeFileId === fileId) {
        return {};
      }
      
      if (existingFileIndex >= 0) {
        state.activeFileId = fileId;
      } else {
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
      const fileIndex = state.openFiles.findIndex(file => file.id === fileId);
      
      if (fileIndex >= 0) {
        state.openFiles.splice(fileIndex, 1);
        
        if (state.activeFileId === fileId) {
          if (state.openFiles.length > 0) {
            const newIndex = Math.min(fileIndex, state.openFiles.length - 1);
            state.activeFileId = state.openFiles[newIndex].id;
          } else {
            state.activeFileId = null;
          }
        }
      }
    }),

    switchProject: (fileId) => set((state) => {
      if (state.openFiles.some(file => file.id === fileId)) {
        state.activeFileId = fileId;
      }
    }),

    reorderFiles: (newOrder) => set((state) => {
      state.openFiles = newOrder;
    }),

    setContentLoaded: (fileId, content, lineCount, language) => set((state) => {
      const fileIndex = state.openFiles.findIndex(file => file.id === fileId);
      if (fileIndex >= 0) {
        state.openFiles[fileIndex].content = content;
        state.openFiles[fileIndex].animated = true;
        
        if (language) {
          state.openFiles[fileIndex].language = language;
        }
      }
    }),

    resetAnimationState: (fileId) => set((state) => {
      const fileIndex = state.openFiles.findIndex(file => file.id === fileId);
      if (fileIndex >= 0) {
        state.openFiles[fileIndex].animated = false;
        state.openFiles[fileIndex].content = null;
      }
    }),

    toggleFolder: (folderId) => set((state) => {
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
      const i18nStore = useI18nStore.getState();
      return i18nStore.getContentForSection(section);
    }
  }))
);
