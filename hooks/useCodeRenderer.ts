import { useState, useEffect, useRef, useCallback } from 'react';
import { CodeLine } from '../components/CodeContent';
import { useI18nStore } from '../i18n/i18n';

interface UseCodeRendererOptions {
  activeSection: string | null;
  skipAnimation?: boolean;
  cachedContent?: CodeLine[];
  onContentChange?: (count: number) => void;
  onLineAnimation?: (lineNumber: number) => void;
  onAnimationComplete?: (content: CodeLine[]) => void;
}

export function useCodeRenderer({
  activeSection,
  skipAnimation = false,
  cachedContent,
  onContentChange,
  onLineAnimation,
  onAnimationComplete
}: UseCodeRendererOptions) {
  const { getContentForSection } = useI18nStore();
  const [content, setContent] = useState<CodeLine[]>([]);
  const [displayedLines, setDisplayedLines] = useState<CodeLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  
  const currentLineRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);
  
  // Referências para evitar problemas de closure com os callbacks
  const contentChangeRef = useRef(onContentChange);
  const lineAnimationRef = useRef(onLineAnimation);
  const animationCompleteRef = useRef(onAnimationComplete);
  
  // Atualizar referências quando as props mudarem
  useEffect(() => {
    contentChangeRef.current = onContentChange;
    lineAnimationRef.current = onLineAnimation;
    animationCompleteRef.current = onAnimationComplete;
  }, [onContentChange, onLineAnimation, onAnimationComplete]);
  
  // Limpar intervalos quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  // Carregar o conteúdo inicial e gerenciar animação
  useEffect(() => {
    if (!activeSection) {
      setContent([]);
      setDisplayedLines([]);
      return;
    }
    
    // Limpar qualquer intervalo existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Resetar o estado
    completedRef.current = false;
    currentLineRef.current = 0;
    
    // Usar conteúdo em cache se disponível e skipAnimation estiver ativado
    if (skipAnimation && cachedContent && cachedContent.length > 0) {
      setContent(cachedContent);
      setDisplayedLines(cachedContent);
      setLineCount(cachedContent.length);
      
      if (contentChangeRef.current) {
        contentChangeRef.current(cachedContent.length);
      }
      
      // Notificar que a animação está completa
      if (animationCompleteRef.current) {
        setTimeout(() => {
          animationCompleteRef.current?.(cachedContent);
        }, 0);
      }
      return;
    }
    
    // Obter o conteúdo para a seção ativa
    const sectionContent = getContentForSection(activeSection);
    setContent(sectionContent);
    setLineCount(sectionContent.length);
    
    // Notificar sobre a mudança de conteúdo
    if (contentChangeRef.current) {
      contentChangeRef.current(sectionContent.length);
    }
    
    // Se formos pular a animação, mostrar tudo de uma vez
    if (skipAnimation) {
      setDisplayedLines(sectionContent);
      completedRef.current = true;
      
      // Notificar que a animação está completa
      if (animationCompleteRef.current) {
        setTimeout(() => {
          animationCompleteRef.current?.(sectionContent);
        }, 0);
      }
      return;
    }
    
    // Iniciar a animação de digitação
    setDisplayedLines([]);
    setIsTyping(true);
    
    // Configurar o intervalo para a animação
    intervalRef.current = setInterval(() => {
      if (currentLineRef.current >= sectionContent.length) {
        // Se chegamos ao fim, limpar o intervalo
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setIsTyping(false);
        completedRef.current = true;
        
        // Notificar que a animação foi concluída
        if (animationCompleteRef.current) {
          animationCompleteRef.current(sectionContent);
        }
        return;
      }
      
      // Obter a próxima linha, com verificação de segurança
      const nextLine = sectionContent[currentLineRef.current];
      
      // Verificar se a linha existe antes de adicioná-la
      if (nextLine) {
        setDisplayedLines(prev => [...prev, nextLine]);
        
        // Notificar sobre a linha atual
        if (lineAnimationRef.current) {
          lineAnimationRef.current(currentLineRef.current + 1);
        }
      }
      
      // Incrementar o contador de linha
      currentLineRef.current += 1;
    }, 50);
    
  }, [activeSection, skipAnimation, cachedContent, getContentForSection]);
  
  // Método para destacar sintaxe (pode ser expandido no futuro)
  const highlightSyntax = useCallback((code: string): CodeLine[] => {
    // Implementação básica - no futuro pode ser mais sofisticada
    const lines = code.split('\n');
    return lines.map(line => ({
      text: line,
      type: 'default'
    }));
  }, []);

  return {
    displayedLines,
    isTyping,
    lineCount,
    highlightSyntax
  };
} 