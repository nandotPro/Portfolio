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

  // Função para detectar se uma string é uma URL válida
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Renderização de cada linha com base no tipo
  const renderLine = (line: string, index: number) => {
    const type = lineTypes[index] || 'normal';
    
    // Determinar o nível de indentação baseado no conteúdo da linha
    let indentLevel = 0;
    
    // Regras de indentação específicas para JSON
    if (line.startsWith('  "') || line === '  }' || line === '  },') {
      indentLevel = 1; // Primeiro nível
    } else if (line.startsWith('    "') || line === '    }' || line === '    },') {
      indentLevel = 2; // Segundo nível
    }
    
    const indentClass = styles[`indent${indentLevel}`] || '';
    
    // Continuar com o switch case para determinar as cores
    let content;
    switch (type) {
      case 'link':
        content = <span className={styles.linkText}>{line}</span>;
        break;
      case 'purpleLink':
        // Se o texto for uma URL válida, torna o link funcional
        if (isValidUrl(line)) {
          content = (
            <a 
              href={line} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.purpleLink}
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            >
              {line}
              <span className={styles.linkTooltip}>follow link (ctrl + click)</span>
            </a>
          );
        } else {
          content = <span className={styles.purpleLink}>{line}</span>;
        }
        break;
      case 'comment':
        content = <span className={styles.commentText}>{line}</span>;
        break;
      case 'keyword':
        content = <span className={styles.keywordText}>{line}</span>;
        break;
      case 'string':
        content = <span className={styles.stringText}>{line}</span>;
        break;
      case 'bracket':
        if (line.includes(',')) {
          const bracketPart = line.slice(0, line.indexOf(','));
          const isMainBracket = bracketPart === '{' || bracketPart === '}';
          
          content = (
            <>
              <span className={isMainBracket ? styles.jsonMainBracket : styles.jsonNestedBracket}>
                {bracketPart}
              </span>
              <span className={styles.jsonPunctuation}>,</span>
            </>
          );
        } else {
          // Caso normal sem vírgula
          const isMainBracket = line === '{' || line === '}';
          content = (
            <span className={isMainBracket ? styles.jsonMainBracket : styles.jsonNestedBracket}>
              {line}
            </span>
          );
        }
        break;
      case 'property':
        if (line.includes(':')) {
          const colonIndex = line.indexOf(':');
          const key = line.substring(0, colonIndex);
          const restParts = line.substring(colonIndex + 1);
          
          // Verificar se termina com vírgula e tratá-la separadamente
          if (restParts.trim().endsWith(',')) {
            const valueWithoutComma = restParts.slice(0, restParts.lastIndexOf(','));
            content = (
              <>
                <span className={styles.jsonPropertyKey}>{key}</span>
                <span className={styles.jsonPunctuation}>:</span>
                <span className={styles.jsonPropertyValue}>{valueWithoutComma}</span>
                <span className={styles.jsonPunctuation}>,</span>
              </>
            );
          } else {
            content = (
              <>
                <span className={styles.jsonPropertyKey}>{key}</span>
                <span className={styles.jsonPunctuation}>:</span>
                <span className={styles.jsonPropertyValue}>{restParts}</span>
              </>
            );
          }
        } else {
          content = <span className={styles.plainText}>{line}</span>;
        }
        break;
      case 'punctuation':
        content = <span className={styles.jsonPunctuation}>{line}</span>;
        break;
      default:
        content = <span className={styles.plainText}>{line}</span>;
    }
    
    return (
      <div className={indentClass}>
        {content}
      </div>
    );
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