import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Tipos de idiomas suportados
export type LanguageCode = 'pt-BR' | 'en-US' | 'zh-CN';

// Interface para os textos traduzidos
export interface Translations {
  // Mensagens da UI
  ui: {
    welcome: string;
    explorer: string;
    search: string;
    settings: string;
    open: string;
    close: string;
    loading: string;
  };
  // Conteúdo do portfolio
  content: {
    about: CodeLine[];
    contact: CodeLine[];
    frontend: CodeLine[];
    backend: CodeLine[];
    projects: CodeLine[];
    tools: CodeLine[];
    ai: CodeLine[];
    devops: CodeLine[];
    // Adicione outros arquivos conforme necessário
  };
  // Mensagens de erro e status
  errors: {
    notFound: string;
    loading: string;
    unavailable: string;
  };
}

// Definir a interface CodeLine importada de CodeContent
export interface CodeLine {
  text: string;
  type?: 'keyword' | 'string' | 'comment' | 'function' | 'variable' | 'default' | 'object';
}

// Traduções para português
const ptBR: Translations = {
  ui: {
    welcome: "Bem-vindo ao meu Portfolio",
    explorer: "EXPLORADOR",
    search: "Pesquisar",
    settings: "Configurações",
    open: "Abrir",
    close: "Fechar",
    loading: "Carregando..."
  },
  content: {
    about: [
      { text: '/**', type: 'comment' },
      { text: ' * Sobre Mim', type: 'comment' },
      { text: ' */', type: 'comment' },
      { text: 'const aboutMe = {', type: 'keyword' },
      { text: '  nome: "Seu Nome",', type: 'string' },
      { text: '  cargo: "Desenvolvedor Frontend",', type: 'string' },
      { text: '  localização: "São Paulo, Brasil",', type: 'string' },
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
    ],
    contact: [
      { text: '/**', type: 'comment' },
      { text: ' * Contato', type: 'comment' },
      { text: ' */', type: 'comment' },
      { text: 'const contact = {', type: 'keyword' },
      { text: '  email: "seu.email@exemplo.com",', type: 'string' },
      { text: '  telefone: "+55 (11) XXXXX-XXXX",', type: 'string' },
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
    ],
    // Adicione o conteúdo dos outros arquivos
    frontend: [
      { text: '/**', type: 'comment' },
      { text: ' * Habilidades de Frontend', type: 'comment' },
      { text: ' */', type: 'comment' },
      // ...mais linhas
    ],
    backend: [
      { text: '/**', type: 'comment' },
      { text: ' * Habilidades de Backend', type: 'comment' },
      { text: ' */', type: 'comment' },
      // ...mais linhas
    ],
    projects: [
      // Conteúdo para projetos em PT-BR
    ],
    tools: [
      // Conteúdo para ferramentas em PT-BR
    ],
    ai: [
      // Conteúdo sobre IA em PT-BR
    ],
    devops: [
      // Conteúdo sobre DevOps em PT-BR
    ]
  },
  errors: {
    notFound: "Arquivo não encontrado",
    loading: "Carregando conteúdo...",
    unavailable: "Conteúdo não disponível"
  }
};

// Traduções para inglês
const enUS: Translations = {
  ui: {
    welcome: "Welcome to my Portfolio",
    explorer: "EXPLORER",
    search: "Search",
    settings: "Settings",
    open: "Open",
    close: "Close",
    loading: "Loading..."
  },
  content: {
    about: [
      { text: '/**', type: 'comment' },
      { text: ' * About Me', type: 'comment' },
      { text: ' */', type: 'comment' },
      { text: 'const aboutMe = {', type: 'keyword' },
      { text: '  name: "Your Name",', type: 'string' },
      { text: '  role: "Frontend Developer",', type: 'string' },
      { text: '  location: "São Paulo, Brazil",', type: 'string' },
      { text: '  interests: ["React", "TypeScript", "UI/UX", "Animations"],', type: 'variable' },
      { text: '  experience: 5, // years', type: 'variable' },
      { text: '', type: 'default' },
      { text: '  education: {', type: 'default' },
      { text: '    degree: "Computer Science",', type: 'string' },
      { text: '    university: "XYZ University",', type: 'string' },
      { text: '    graduation: 2020', type: 'variable' },
      { text: '  },', type: 'default' },
      { text: '', type: 'default' },
      { text: '  about() {', type: 'function' },
      { text: '    return `I am a developer passionate about creating interactive interfaces and amazing user experiences.`;', type: 'string' },
      { text: '  }', type: 'function' },
      { text: '};', type: 'default' },
      { text: '', type: 'default' },
      { text: 'export default aboutMe;', type: 'keyword' }
    ],
    contact: [
      { text: '/**', type: 'comment' },
      { text: ' * Contact', type: 'comment' },
      { text: ' */', type: 'comment' },
      { text: 'const contact = {', type: 'keyword' },
      { text: '  email: "your.email@example.com",', type: 'string' },
      { text: '  phone: "+55 (11) XXXXX-XXXX",', type: 'string' },
      { text: '  social: {', type: 'default' },
      { text: '    github: "https://github.com/yourusername",', type: 'string' },
      { text: '    linkedin: "https://linkedin.com/in/yourusername",', type: 'string' },
      { text: '    twitter: "https://twitter.com/yourusername",', type: 'string' },
      { text: '  },', type: 'default' },
      { text: '', type: 'default' },
      { text: '  getInTouch() {', type: 'function' },
      { text: '    console.log("Send me a message!");', type: 'function' },
      { text: '    return true;', type: 'keyword' },
      { text: '  }', type: 'function' },
      { text: '};', type: 'default' },
      { text: '', type: 'default' },
      { text: 'export default contact;', type: 'keyword' }
    ],
    // Adicione as traduções para os outros arquivos
    frontend: [
      // Conteúdo de frontend em inglês
    ],
    backend: [
      // Conteúdo de backend em inglês
    ],
    projects: [
      // Conteúdo de projetos em inglês
    ],
    tools: [
      // Conteúdo de ferramentas em inglês
    ],
    ai: [
      // Conteúdo sobre IA em inglês
    ],
    devops: [
      // Conteúdo sobre DevOps em inglês
    ]
  },
  errors: {
    notFound: "File not found",
    loading: "Loading content...",
    unavailable: "Content not available"
  }
};

// Traduções para chinês
const zhCN: Translations = {
  ui: {
    welcome: "欢迎来到我的作品集",
    explorer: "资源管理器",
    search: "搜索",
    settings: "设置",
    open: "打开",
    close: "关闭",
    loading: "加载中..."
  },
  content: {
    about: [
      { text: '/**', type: 'comment' },
      { text: ' * 关于我', type: 'comment' },
      { text: ' */', type: 'comment' },
      { text: 'const aboutMe = {', type: 'keyword' },
      { text: '  名字: "你的名字",', type: 'string' },
      { text: '  职位: "前端开发人员",', type: 'string' },
      { text: '  地址: "圣保罗, 巴西",', type: 'string' },
      { text: '  兴趣: ["React", "TypeScript", "UI/UX", "动画"],', type: 'variable' },
      { text: '  经验: 5, // 年份', type: 'variable' },
      { text: '', type: 'default' },
      { text: '  教育: {', type: 'default' },
      { text: '    学位: "计算机科学",', type: 'string' },
      { text: '    大学: "XYZ大学",', type: 'string' },
      { text: '    毕业: 2020', type: 'variable' },
      { text: '  },', type: 'default' },
      { text: '', type: 'default' },
      { text: '  简介() {', type: 'function' },
      { text: '    return `我是一名热衷于创建交互式界面和令人惊叹的用户体验的开发人员。`;', type: 'string' },
      { text: '  }', type: 'function' },
      { text: '};', type: 'default' },
      { text: '', type: 'default' },
      { text: 'export default aboutMe;', type: 'keyword' }
    ],
    contact: [
      { text: '/**', type: 'comment' },
      { text: ' * 联系方式', type: 'comment' },
      { text: ' */', type: 'comment' },
      { text: 'const contact = {', type: 'keyword' },
      { text: '  邮箱: "your.email@example.com",', type: 'string' },
      { text: '  电话: "+55 (11) XXXXX-XXXX",', type: 'string' },
      { text: '  社交: {', type: 'default' },
      { text: '    github: "https://github.com/yourusername",', type: 'string' },
      { text: '    linkedin: "https://linkedin.com/in/yourusername",', type: 'string' },
      { text: '    twitter: "https://twitter.com/yourusername",', type: 'string' },
      { text: '  },', type: 'default' },
      { text: '', type: 'default' },
      { text: '  联系我() {', type: 'function' },
      { text: '    console.log("给我发消息!");', type: 'function' },
      { text: '    return true;', type: 'keyword' },
      { text: '  }', type: 'function' },
      { text: '};', type: 'default' },
      { text: '', type: 'default' },
      { text: 'export default contact;', type: 'keyword' }
    ],
    // Adicione as traduções para os outros arquivos
    frontend: [
      // Conteúdo de frontend em chinês
    ],
    backend: [
      // Conteúdo de backend em chinês
    ],
    projects: [
      // Conteúdo de projetos em chinês
    ],
    tools: [
      // Conteúdo de ferramentas em chinês
    ],
    ai: [
      // Conteúdo sobre IA em chinês
    ],
    devops: [
      // Conteúdo sobre DevOps em chinês
    ]
  },
  errors: {
    notFound: "找不到文件",
    loading: "加载内容...",
    unavailable: "内容不可用"
  }
};

// Store de internacionalização
export const useI18nStore = create<{
  currentLanguage: LanguageCode;
  translations: Record<LanguageCode, Translations>;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
  getContentForSection: (section: string) => CodeLine[];
}>()(
  immer((set, get) => ({
    currentLanguage: 'pt-BR',
    translations: {
      'pt-BR': ptBR,
      'en-US': enUS,
      'zh-CN': zhCN
    },
    
    setLanguage: (language: LanguageCode) => set((state) => {
      state.currentLanguage = language;
    }),
    
    t: (key: string) => {
      const { currentLanguage, translations } = get();
      const currentTranslations = translations[currentLanguage] || {};
      
      // Navegar pela estrutura de objetos para encontrar a tradução
      const keys = key.split('.');
      let result: any = currentTranslations;
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return key; // Retornar a chave como fallback
        }
      }
      
      return typeof result === 'string' ? result : key;
    },
    
    // Função para obter o conteúdo traduzido para uma seção específica
    getContentForSection: (section: string) => {
      const { currentLanguage, translations } = get();
      const currentTranslations = translations[currentLanguage];
      
      // Verificar se a seção existe nas traduções de conteúdo e é um array
      if (
        currentTranslations.content && 
        section in currentTranslations.content &&
        Array.isArray(currentTranslations.content[section as keyof typeof currentTranslations.content])
      ) {
        return currentTranslations.content[section as keyof typeof currentTranslations.content];
      }
      
      // Fallback para um conteúdo de "não disponível"
      return [
        { text: `// ${currentTranslations.errors.unavailable}`, type: 'comment' },
        { text: 'const comingSoon = () => {', type: 'function' },
        { text: `  console.log("${currentTranslations.errors.loading}");`, type: 'function' },
        { text: '  return "...";', type: 'keyword' },
        { text: '};', type: 'function' },
        { text: '', type: 'default' },
        { text: 'export default comingSoon;', type: 'keyword' }
      ];
    }
  }))
); 