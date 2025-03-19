import { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../content/contentManager';

interface UseCodeAnimationOptions {
  content: ContentItem[] | null;
  skipAnimation: boolean;
  animationSpeed?: number;
  onLineCountChange?: (count: number) => void;
  onAnimationComplete?: (content: any) => void;
}

interface UseCodeAnimationReturn {
  lines: string[];
  lineTypes: string[];
  currentLine: number;
  visibleLineCount: number;
  isAnimating: boolean;
}

export function useCodeAnimation({
  content,
  skipAnimation,
  animationSpeed = 35,
  onLineCountChange,
  onAnimationComplete
}: UseCodeAnimationOptions): UseCodeAnimationReturn {
  const [lines, setLines] = useState<string[]>([]);
  const [lineTypes, setLineTypes] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [visibleLineCount, setVisibleLineCount] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<ContentItem[] | null>(null);
  const isFirstRenderRef = useRef(true);
  
  // Função para limpar o timeout da animação
  const clearAnimation = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  // Atualiza a referência de conteúdo quando muda
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Reset da animação quando o conteúdo muda
  useEffect(() => {
    clearAnimation();
    
    if (!content) {
      setLines([]);
      setLineTypes([]);
      setCurrentLine(0);
      setVisibleLineCount(0);
      setIsAnimating(false);
      return;
    }
    
    if (skipAnimation) {
      // Se devemos pular a animação, exibir tudo de uma vez
      const contentLines = content.map(item => item.content);
      const contentTypes = content.map(item => item.type);
      
      setLines(contentLines);
      setLineTypes(contentTypes);
      setCurrentLine(contentLines.length);
      setVisibleLineCount(contentLines.length);
      setIsAnimating(false);
      
      if (onLineCountChange) {
        onLineCountChange(contentLines.length);
      }
      
      if (onAnimationComplete) {
        onAnimationComplete(content);
      }
    } else {
      // Iniciar a animação de digitação
      setLines([]);
      setLineTypes([]);
      setCurrentLine(0);
      setVisibleLineCount(1);
      setIsAnimating(true);
      
      if (onLineCountChange) {
        onLineCountChange(content.length);
      }

      // Iniciar a animação fora do useEffect para evitar loops
      startAnimation();
    }
    
    return clearAnimation;
  }, [content, skipAnimation]); // Removidas dependências problemáticas

  // Função para iniciar a animação - extraída para evitar loops no useEffect
  const startAnimation = () => {
    if (!contentRef.current || !isAnimating) return;
    
    let lineIndex = 0;
    
    const animateNextLine = () => {
      if (!contentRef.current || lineIndex >= contentRef.current.length) {
        setIsAnimating(false);
        if (onAnimationComplete && contentRef.current) {
          onAnimationComplete(contentRef.current);
        }
        return;
      }
      
      const lineContent = contentRef.current[lineIndex].content;
      const lineType = contentRef.current[lineIndex].type;
      
      setLines(prev => [...prev, lineContent]);
      setLineTypes(prev => [...prev, lineType]);
      setVisibleLineCount(lineIndex + 2); // +2 para mostrar a próxima linha
      setCurrentLine(lineIndex + 1);
      
      lineIndex++;
      
      // Agendar a próxima linha
      animationRef.current = setTimeout(animateNextLine, animationSpeed);
    };
    
    // Iniciar a animação
    animationRef.current = setTimeout(animateNextLine, animationSpeed);
  };
  
  // Hook para iniciar a animação apenas uma vez após a primeira renderização
  useEffect(() => {
    if (isFirstRenderRef.current && isAnimating && contentRef.current) {
      isFirstRenderRef.current = false;
      startAnimation();
    }
  }, [isAnimating]);
  
  return {
    lines,
    lineTypes,
    currentLine,
    visibleLineCount,
    isAnimating
  };
} 