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
  
  // Adicionar um useEffect para carregar o conteúdo quando a seção ativa mudar
  useEffect(() => {
    if (activeSection) {
      // Usar conteúdo em cache se disponível, caso contrário obter novo
      const newContent = cachedContent || getContentForSection(activeSection);
      setContent(newContent);
      
      // Se pular animação, mostrar tudo de uma vez
      if (skipAnimation) {
        setDisplayedLines(newContent);
        setLineCount(newContent.length);
        currentLineRef.current = newContent.length;
        completedRef.current = true;
        
        // Notificar que a animação está completa
        if (animationCompleteRef.current) {
          animationCompleteRef.current(newContent);
        }
        
        // Notificar mudança de conteúdo
        if (contentChangeRef.current) {
          contentChangeRef.current(newContent.length);
        }
      } else {
        // Resetar para começar a animação
        setDisplayedLines([]);
        setLineCount(1);
        currentLineRef.current = 0;
        completedRef.current = false;
        setIsTyping(true);
        
        // Iniciar animação
        startTypingAnimation(newContent);
      }
    }
  }, [activeSection, skipAnimation, cachedContent, getContentForSection]);
  
  // Adicionar função para iniciar a animação
  const startTypingAnimation = (codeLines: CodeLine[]) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      const currentLine = currentLineRef.current;
      
      if (currentLine < codeLines.length) {
        // Adicionar próxima linha
        setDisplayedLines(prev => [...prev, codeLines[currentLine]]);
        currentLineRef.current += 1;
        setLineCount(prev => prev + 1);
        
        // Notificar animação de linha
        if (lineAnimationRef.current) {
          lineAnimationRef.current(currentLine);
        }
      } else {
        // Animação completa
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setIsTyping(false);
        completedRef.current = true;
        
        // Notificar que a animação está completa
        if (animationCompleteRef.current) {
          animationCompleteRef.current(codeLines);
        }
      }
    }, 100); // Velocidade da animação - ajuste conforme necessário
  };
  
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