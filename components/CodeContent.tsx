'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './CodeContent.module.css';
import { useI18nStore } from '../i18n/i18n';

export interface CodeLine {
  text: string;
  type?: 'keyword' | 'string' | 'comment' | 'function' | 'variable' | 'default' | 'object';
}

interface CodeContentProps {
  activeSection: string;
  onLineCountChange: (count: number) => void;
  onContentChange?: (count: number) => void;
  onLineAnimation?: (lineNumber: number) => void;
  onAnimationComplete?: (content: CodeLine[]) => void;
  skipAnimation?: boolean;
  cachedContent?: CodeLine[];
}

const CodeContent: React.FC<CodeContentProps> = ({ 
  activeSection, 
  onLineCountChange,
  onContentChange,
  onLineAnimation, 
  onAnimationComplete,
  skipAnimation = false,
  cachedContent
}) => {
  const { getContentForSection } = useI18nStore();
  const [content, setContent] = useState<CodeLine[]>([]);
  const [displayedLines, setDisplayedLines] = useState<CodeLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const currentLineRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);
  const contentChangeRef = useRef(onContentChange);
  const lineAnimationRef = useRef(onLineAnimation);
  const animationCompleteRef = useRef(onAnimationComplete);
  
  // Atualizar refs quando as props mudarem
  useEffect(() => {
    contentChangeRef.current = onContentChange;
    lineAnimationRef.current = onLineAnimation;
    animationCompleteRef.current = onAnimationComplete;
  }, [onContentChange, onLineAnimation, onAnimationComplete]);
  
  // Efeito para carregar o conteúdo inicial
  useEffect(() => {
    // Limpar qualquer intervalo existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Resetar o estado
    completedRef.current = false;
    currentLineRef.current = 0;
    
    // Verificação explícita: se temos conteúdo em cache E skipAnimation está ligado
    if (skipAnimation && cachedContent && cachedContent.length > 0) {
      setContent(cachedContent);
      setDisplayedLines(cachedContent);
      if (contentChangeRef.current) contentChangeRef.current(cachedContent.length);
      
      // Importante: notificar que a animação está completa
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
    
    // Se formos pular a animação, mostrar tudo de uma vez
    if (skipAnimation) {
      setDisplayedLines(sectionContent);
      if (contentChangeRef.current) contentChangeRef.current(sectionContent.length);
      completedRef.current = true;
      
      // Importante: notificar que a animação está completa
      if (animationCompleteRef.current) {
        setTimeout(() => {
          animationCompleteRef.current?.(sectionContent);
        }, 0);
      }
      return;
    }
    
    // Caso contrário, iniciar a animação
    setDisplayedLines([]);
    setIsTyping(true);
    
    if (contentChangeRef.current) contentChangeRef.current(sectionContent.length);
    
    // Configurar o intervalo para a animação de digitação
    intervalRef.current = setInterval(() => {
      if (currentLineRef.current >= sectionContent.length) {
        // Se chegamos ao fim, limpar o intervalo
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setIsTyping(false);
        completedRef.current = true;
        
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
        
        // Notificar sobre a linha atual usando a ref, não a prop diretamente
        if (lineAnimationRef.current) {
          lineAnimationRef.current(currentLineRef.current + 1);
        }
      }
      
      // Incrementar o contador de linha
      currentLineRef.current += 1;
    }, 50);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeSection, skipAnimation, cachedContent, getContentForSection]);
  
  // Efeito para atualizar as linhas exibidas e informar a contagem de linhas
  useEffect(() => {
    if (activeSection) {
      const contentLines = getContentForSection(activeSection);
      if (contentLines && contentLines.length > 0) {
        // Informar ao componente pai quantas linhas existem
        onLineCountChange(contentLines.length);
      } else {
        onLineCountChange(1);
      }
    }
  }, [activeSection, getContentForSection, onLineCountChange]);
  
  return (
    <div className={styles.codeContentWrapper}>
      {displayedLines.map((line, index) => (
        // Verificar se line está definida antes de acessar suas propriedades
        line ? (
          <div key={`${activeSection}-line-${index}`} className={styles.codeLine}>
            <span className={line.type && styles[line.type] ? styles[line.type] : ''}>{line.text}</span>
            {index === displayedLines.length - 1 && isTyping && (
              <span className={styles.cursor} />
            )}
          </div>
        ) : (
          // Adicionar uma linha vazia mas com a mesma altura para manter o alinhamento
          <div key={`${activeSection}-empty-${index}`} className={styles.codeLine}>&nbsp;</div>
        )
      ))}
    </div>
  );
};

export default CodeContent; 