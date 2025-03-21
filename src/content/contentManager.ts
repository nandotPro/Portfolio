import readmeContent from './readme';
import aboutContent from './about';
import contactContent from './contact';

// Interface para um item de conteúdo
export interface ContentItem {
  content: string;
  type: string;
}

// Mapa de conteúdos por nome de arquivo
const contentMap: Record<string, ContentItem[]> = {
  'README.md': readmeContent,
  'about.json': aboutContent,
  'contact.ts': contactContent,
  // Outros arquivos serão adicionados aqui conforme criados
};

/**
 * Obtém o conteúdo de um arquivo pelo seu nome
 */
export function getContentByFileName(fileName: string): ContentItem[] | null {
  return contentMap[fileName] || null;
}

/**
 * Obtém a extensão/tipo de um arquivo pelo seu nome
 */
export function getFileType(fileName: string): string {
  const extension = fileName.split('.').pop() || '';
  return extension.toLowerCase();
} 