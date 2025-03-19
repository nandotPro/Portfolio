import { useState, useEffect, useRef } from 'react';
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
  
  const contentChangeRef = useRef(onContentChange);
  const lineAnimationRef = useRef(onLineAnimation);
  const animationCompleteRef = useRef(onAnimationComplete);
  
  useEffect(() => {
    contentChangeRef.current = onContentChange;
    lineAnimationRef.current = onLineAnimation;
    animationCompleteRef.current = onAnimationComplete;
  }, [onContentChange, onLineAnimation, onAnimationComplete]);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (activeSection) {
      const newContent = cachedContent || getContentForSection(activeSection);
      setContent(newContent);
      
      if (skipAnimation) {
        setDisplayedLines(newContent);
        setLineCount(newContent.length);
        currentLineRef.current = newContent.length;
        completedRef.current = true;
        
        if (animationCompleteRef.current) {
          animationCompleteRef.current(newContent);
        }
        
        if (contentChangeRef.current) {
          contentChangeRef.current(newContent.length);
        }
      } else {
        setDisplayedLines([]);
        setLineCount(1);
        currentLineRef.current = 0;
        completedRef.current = false;
        setIsTyping(true);
        
        startTypingAnimation(newContent);
      }
    }
  }, [activeSection, skipAnimation, cachedContent, getContentForSection]);
  
  const startTypingAnimation = (codeLines: CodeLine[]) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      const currentLine = currentLineRef.current;
      
      if (currentLine < codeLines.length) {
        setDisplayedLines(prev => [...prev, codeLines[currentLine]]);
        currentLineRef.current += 1;
        setLineCount(prev => prev + 1);
        
        if (lineAnimationRef.current) {
          lineAnimationRef.current(currentLine);
        }
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setIsTyping(false);
        completedRef.current = true;
        
        if (animationCompleteRef.current) {
          animationCompleteRef.current(codeLines);
        }
      }
    }, 100);
  };
  
  const highlightSyntax = (code: string): CodeLine[] => {
    const lines = code.split('\n');
    return lines.map(line => ({
      text: line,
      type: 'default'
    }));
  };

  return {
    displayedLines,
    isTyping,
    lineCount,
    highlightSyntax
  };
} 