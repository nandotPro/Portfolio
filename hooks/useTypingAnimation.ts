import { useState, useEffect, useRef } from 'react';

interface TypingAnimationOptions {
  text: string[];
  speed?: number;
  initialDelay?: number;
  onLineTyped?: (lineNumber: number) => void;
  onComplete?: (text: string[]) => void;
  skipAnimation?: boolean;
}

export const useTypingAnimation = ({
  text,
  speed = 30,
  initialDelay = 500,
  onLineTyped,
  onComplete,
  skipAnimation = false
}: TypingAnimationOptions) => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setDisplayedText([]);
    setCurrentLine(0);
    setCurrentChar(0);
    setIsComplete(false);
    setIsTyping(false);

    if (skipAnimation) {
      setDisplayedText([...text]);
      setCurrentLine(text.length);
      setIsComplete(true);
      onComplete?.([...text]);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, initialDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, initialDelay, skipAnimation, onComplete]);

  useEffect(() => {
    if (!isTyping || isComplete || skipAnimation) return;

    if (currentLine >= text.length) {
      setIsTyping(false);
      setIsComplete(true);
      onComplete?.(displayedText);
      return;
    }

    const currentLineText = text[currentLine] || '';

    if (currentChar >= currentLineText.length) {
      onLineTyped?.(currentLine);
      
      setCurrentLine(prev => prev + 1);
      setCurrentChar(0);
      
      timeoutRef.current = setTimeout(() => {}, speed * 3);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const newDisplayedText = [...displayedText];
      
      if (currentChar === 0) {
        newDisplayedText.push(currentLineText.charAt(0));
      } else {
        newDisplayedText[currentLine] = (newDisplayedText[currentLine] || '') + currentLineText.charAt(currentChar);
      }
      
      setDisplayedText(newDisplayedText);
      setCurrentChar(prev => prev + 1);
    }, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isTyping, currentLine, currentChar, text, displayedText, speed, isComplete, onLineTyped, onComplete, skipAnimation]);

  return {
    displayedText,
    currentLine,
    currentChar,
    isComplete,
    isTyping
  };
}; 