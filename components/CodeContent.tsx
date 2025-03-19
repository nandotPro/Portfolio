'use client';

import React from 'react';
import styles from './CodeContent.module.css';
import { useCodeRenderer } from '../hooks/useCodeRenderer';

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
  // Usar o hook useCodeRenderer para gerenciar a renderização e animação
  const {
    displayedLines,
    isTyping,
    lineCount
  } = useCodeRenderer({
    activeSection,
    skipAnimation,
    cachedContent,
    onContentChange,
    onLineAnimation,
    onAnimationComplete
  });

  // Notificar o componente pai sobre a contagem de linhas
  React.useEffect(() => {
    onLineCountChange(lineCount);
  }, [lineCount, onLineCountChange]);
  
  return (
    <div className={styles.codeContentWrapper}>
      {displayedLines.map((line, index) => (
        // Usando optional chaining para evitar erro se line for undefined
        <div key={`${activeSection}-line-${index}`} className={styles.codeLine}>
          <span className={line?.type && styles[line.type] ? styles[line.type] : ''}>
            {line?.text || ''}
          </span>
          {index === displayedLines.length - 1 && isTyping && (
            <span className={styles.cursor} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CodeContent; 