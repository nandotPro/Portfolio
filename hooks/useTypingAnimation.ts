import { useState, useEffect, useRef } from 'react';

interface TypingAnimationOptions {
  text: string[];
  speed?: number;
  initialDelay?: number;
  onLineTyped?: (lineNumber: number) => void;
  onComplete?: (content: string[]) => void;
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
    // Limpar timeout anterior ao desmontar ou quando as dependências mudarem
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Resetar estado quando o texto mudar
    setDisplayedText([]);
    setCurrentLine(0);
    setCurrentChar(0);
    setIsComplete(false);
    setIsTyping(false);

    if (skipAnimation) {
      // Se devemos pular a animação, apenas mostrar o texto completo
      setDisplayedText([...text]);
      setCurrentLine(text.length);
      setIsComplete(true);
      if (onComplete) onComplete([...text]);
      return;
    }

    // Iniciar a animação após o delay inicial
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, initialDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, initialDelay, skipAnimation, onComplete]);

  useEffect(() => {
    if (!isTyping || isComplete || skipAnimation) return;

    // Se chegamos ao final do texto
    if (currentLine >= text.length) {
      setIsTyping(false);
      setIsComplete(true);
      if (onComplete) onComplete(displayedText);
      return;
    }

    const currentLineText = text[currentLine] || '';

    // Se terminamos de digitar a linha atual
    if (currentChar >= currentLineText.length) {
      if (onLineTyped) onLineTyped(currentLine);
      
      // Passar para a próxima linha
      setCurrentLine(prev => prev + 1);
      setCurrentChar(0);
      
      // Adicionar uma pequena pausa entre as linhas
      timeoutRef.current = setTimeout(() => {}, speed * 3);
      return;
    }

    // Digitar o próximo caractere
    timeoutRef.current = setTimeout(() => {
      const newDisplayedText = [...displayedText];
      
      // Se for a primeira letra da linha, adicionar uma nova linha
      if (currentChar === 0) {
        newDisplayedText.push(currentLineText.charAt(0));
      } else {
        // Caso contrário, atualizar a linha atual
        newDisplayedText[currentLine] = (newDisplayedText[currentLine] || '') + currentLineText.charAt(currentChar);
      }
      
      setDisplayedText(newDisplayedText);
      setCurrentChar(prev => prev + 1);
    }, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isTyping, currentLine, currentChar, text, displayedText, speed, isComplete, onLineTyped, onComplete, skipAnimation]);

  return {
    displayedText,
    currentLine,
    isComplete,
    isTyping
  };
}; 