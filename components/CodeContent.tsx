'use client';

import React from 'react';
import styles from './Editor.module.css';
import { ContentItem } from '../content/contentManager';
import { useCodeAnimation } from '../hooks/useCodeAnimation';

export interface CodeLine {
  text: string;
  type?: 'keyword' | 'string' | 'comment' | 'function' | 'variable' | 'default' | 'object';
}

interface CodeContentProps {
  activeSection: string;
  customContent?: ContentItem[];
  onContentChange?: (count: number) => void;
  onLineAnimation?: (lineIndex: number) => void;
  onAnimationComplete?: (content: any) => void;
  skipAnimation?: boolean;
  cachedContent?: any;
  onLineCountChange?: (count: number) => void;
}

export default function CodeContent({
  customContent,
  onContentChange,
  onAnimationComplete,
  onLineAnimation,
  skipAnimation = false,
  onLineCountChange
}: CodeContentProps) {
  const {
    lines,
    lineTypes,
    visibleLineCount,
    isAnimating
  } = useCodeAnimation({
    content: customContent || null,
    skipAnimation,
    onLineCountChange,
    onAnimationComplete
  });

  // Relatar mudanças na contagem de linhas
  React.useEffect(() => {
    if (onContentChange) {
      onContentChange(lines.length);
    }
  }, [lines.length, onContentChange]);

  // Relatar linhas visíveis
  React.useEffect(() => {
    if (onLineAnimation && visibleLineCount > 0) {
      onLineAnimation(visibleLineCount - 1);
    }
  }, [visibleLineCount, onLineAnimation]);

  // Renderização de cada linha com base no tipo
  const renderLine = (line: string, index: number) => {
    const type = lineTypes[index] || 'normal';
    
    switch (type) {
      case 'link':
        return <span className={styles.linkText}>{line}</span>;
      case 'comment':
        return <span className={styles.commentText}>{line}</span>;
      case 'keyword':
        return <span className={styles.keywordText}>{line}</span>;
      case 'string':
        return <span className={styles.stringText}>{line}</span>;
      default:
        return <span className={styles.plainText}>{line}</span>;
    }
  };
  
  return (
    <div className={styles.codeContentWrapper}>
      {lines.map((line, index) => (
        <div key={index} className={styles.codeLine}>
          {renderLine(line, index)}
          {index === lines.length - 1 && isAnimating && (
            <span className={styles.cursor} />
          )}
        </div>
      ))}
    </div>
  );
} 