'use client';

import React from 'react';
import styles from '../../styles/modules/editor/editor.module.css';
import tsStyles from '../../styles/modules/editor/file-types/ts.module.css';
import jsonStyles from '../../styles/modules/editor/file-types/json.module.css';
import mdStyles from '../../styles/modules/editor/file-types/md.module.css';
import { ContentItem } from '../../content/contentManager';
import { useCodeAnimation } from '../../hooks/useCodeAnimation';

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
    
    const indentClass = jsonStyles[`indent${indentLevel}`] || '';
    
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
              className={mdStyles.purpleLink}
              onClick={(e) => e.stopPropagation()} // Previne a propagação do clique
            >
              {line}
              <span className={mdStyles.linkTooltip}>follow link (ctrl + click)</span>
            </a>
          );
        } else {
          content = <span className={mdStyles.purpleLink}>{line}</span>;
        }
        break;
      case 'comment':
        content = <span className={styles.commentText}>{line}</span>;
        break;
      case 'keyword':
        content = <span className={tsStyles.keywordText}>{line}</span>;
        break;
      case 'string':
        content = <span className={tsStyles.stringText}>{line}</span>;
        break;
      case 'bracket':
        if (line.includes(',')) {
          const bracketPart = line.slice(0, line.indexOf(','));
          const isMainBracket = bracketPart === '{' || bracketPart === '}';
          
          content = (
            <>
              <span className={isMainBracket ? jsonStyles.jsonMainBracket : jsonStyles.jsonNestedBracket}>
                {bracketPart}
              </span>
              <span className={jsonStyles.jsonPunctuation}>,</span>
            </>
          );
        } else {
          // Caso normal sem vírgula
          const isMainBracket = line === '{' || line === '}';
          content = (
            <span className={isMainBracket ? jsonStyles.jsonMainBracket : jsonStyles.jsonNestedBracket}>
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
                <span className={jsonStyles.jsonPropertyKey}>{key}</span>
                <span className={jsonStyles.jsonPunctuation}>:</span>
                <span className={jsonStyles.jsonPropertyValue}>{valueWithoutComma}</span>
                <span className={jsonStyles.jsonPunctuation}>,</span>
              </>
            );
          } else {
            content = (
              <>
                <span className={jsonStyles.jsonPropertyKey}>{key}</span>
                <span className={jsonStyles.jsonPunctuation}>:</span>
                <span className={jsonStyles.jsonPropertyValue}>{restParts}</span>
              </>
            );
          }
        } else {
          content = <span className={mdStyles.plainText}>{line}</span>;
        }
        break;
      case 'punctuation':
        content = <span className={jsonStyles.jsonPunctuation}>{line}</span>;
        break;
      default:
        content = <span className={mdStyles.plainText}>{line}</span>;
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