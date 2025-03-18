import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CodeLine } from '../components/CodeContent';

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
}

interface EditorState {
  // Estado
  fileTree: FileNode | null;
  openFiles: OpenFile[];
  activeFileId: string | null;
  fileContents?: Record<string, any>;

  // Ações
  openProject: (path: string, fileId: string, fileName: string) => void;
  closeProject: (fileId: string) => void;
  switchProject: (fileId: string) => void;
  reorderFiles: (newOrder: OpenFile[]) => void;
  setContentLoaded: (fileId: string, content: any, lineCount: number) => void;
  toggleFolder: (folderId: string) => void;
  setFileTree: (fileTree: FileNode) => void;
  getContentForSection: (section: string) => CodeLine[];
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    fileTree: null,
    openFiles: [],
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

    setContentLoaded: (fileId, content, lineCount) => set((state) => {
      // Atualiza o conteúdo de um arquivo e marca como animado
      const fileIndex = state.openFiles.findIndex(file => file.id === fileId);
      if (fileIndex >= 0) {
        state.openFiles[fileIndex].content = content;
        state.openFiles[fileIndex].animated = true;
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
      // Implementação da função getContentForSection
      return getContentForSection(section);
    }
  }))
);

// Função auxiliar para obter conteúdo com base na seção
const getContentForSection = (section: string): CodeLine[] => {
  switch(section) {
    case 'about':
      return [
        { text: '/**', type: 'comment' },
        { text: ' * Sobre Mim', type: 'comment' },
        { text: ' */', type: 'comment' },
        { text: 'const aboutMe = {', type: 'keyword' },
        { text: '  nome: "Seu Nome",', type: 'string' },
        { text: '  cargo: "Desenvolvedor Frontend",', type: 'string' },
        { text: '  localização: "Sua Cidade, País",', type: 'string' },
        { text: '  interesses: ["React", "TypeScript", "UI/UX", "Animações"],', type: 'variable' },
        { text: '  experiência: 5, // anos', type: 'variable' },
        { text: '', type: 'default' },
        { text: '  educação: {', type: 'default' },
        { text: '    graduação: "Ciência da Computação",', type: 'string' },
        { text: '    universidade: "Universidade XYZ",', type: 'string' },
        { text: '    conclusão: 2020', type: 'variable' },
        { text: '  },', type: 'default' },
        { text: '', type: 'default' },
        { text: '  sobre() {', type: 'function' },
        { text: '    return `Sou um desenvolvedor apaixonado por criar interfaces interativas e experiências de usuário incríveis.`;', type: 'string' },
        { text: '  }', type: 'function' },
        { text: '};', type: 'default' },
        { text: '', type: 'default' },
        { text: 'export default aboutMe;', type: 'keyword' }
      ];
    case 'contact':
      return [
        { text: '/**', type: 'comment' },
        { text: ' * Contato', type: 'comment' },
        { text: ' */', type: 'comment' },
        { text: 'const contact = {', type: 'keyword' },
        { text: '  email: "seu.email@exemplo.com",', type: 'string' },
        { text: '  telefone: "+XX (XX) XXXXX-XXXX",', type: 'string' },
        { text: '  redes: {', type: 'default' },
        { text: '    github: "https://github.com/seuusuario",', type: 'string' },
        { text: '    linkedin: "https://linkedin.com/in/seuusuario",', type: 'string' },
        { text: '    twitter: "https://twitter.com/seuusuario",', type: 'string' },
        { text: '  },', type: 'default' },
        { text: '', type: 'default' },
        { text: '  getInTouch() {', type: 'function' },
        { text: '    console.log("Envie-me uma mensagem!");', type: 'function' },
        { text: '    return true;', type: 'keyword' },
        { text: '  }', type: 'function' },
        { text: '};', type: 'default' },
        { text: '', type: 'default' },
        { text: 'export default contact;', type: 'keyword' }
      ];
    // Adicione aqui os outros casos
    default:
      return [
        { text: `// Conteúdo para "${section}" ainda não está disponível`, type: 'comment' },
        { text: 'const comingSoon = () => {', type: 'function' },
        { text: '  console.log("Em breve!");', type: 'function' },
        { text: '  return "Estamos trabalhando nisso...";', type: 'keyword' },
        { text: '};', type: 'function' },
        { text: '', type: 'default' },
        { text: 'export default comingSoon;', type: 'keyword' }
      ];
  }
}; 