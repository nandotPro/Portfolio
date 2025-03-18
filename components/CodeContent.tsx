'use client';

import styles from './CodeContent.module.css';
import { useEffect, useState, useRef } from 'react';

interface CodeContentProps {
  activeSection: string | null;
  onContentChange?: (lineCount: number) => void;
}

type CodeLine = {
  text: string;
  class: string;
};

export default function CodeContent({ activeSection, onContentChange }: CodeContentProps) {
  const [content, setContent] = useState<CodeLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    // Definir um array vazio como fallback
    let codeContent: CodeLine[] = [];
    
    // Verificar se activeSection não é null antes de continuar
    if (activeSection) {
      switch(activeSection) {
        case 'about':
          codeContent = [
            { text: '// Sobre Mim', class: 'comment' },
            { text: 'const desenvolvedor = {', class: 'keyword' },
            { text: '  nome: "Seu Nome",', class: 'property' },
            { text: '  função: "Desenvolvedor Full Stack",', class: 'property' },
            { text: '  localização: "Sua Cidade, País",', class: 'property' },
            { text: '  bio: `Apaixonado por criar soluções elegantes', class: 'property' },
            { text: '        para problemas complexos.`', class: 'string' },
            { text: '};', class: 'keyword' },
            { text: '', class: '' },
            { text: '// Experiência profissional', class: 'comment' },
            { text: 'function experiencia() {', class: 'function' },
            { text: '  return [', class: 'keyword' },
            { text: '    { cargo: "Desenvolvedor Senior", empresa: "Empresa XYZ", período: "2020-Atual" },', class: 'object' },
            { text: '    { cargo: "Desenvolvedor Pleno", empresa: "Empresa ABC", período: "2018-2020" },', class: 'object' },
            { text: '  ];', class: 'keyword' },
            { text: '}', class: 'function' },
          ];
          break;
        case 'frontend':
          codeContent = [
            { text: '// Habilidades Frontend', class: 'comment' },
            { text: 'import { React, Vue, Angular } from "frameworks";', class: 'import' },
            { text: 'import { HTML5, CSS3, JavaScript, TypeScript } from "languages";', class: 'import' },
            { text: '', class: '' },
            { text: 'const frontendTools = [', class: 'const' },
            { text: '  "Redux",', class: 'string' },
            { text: '  "Styled Components",', class: 'string' },
            { text: '  "Material UI",', class: 'string' },
            { text: '  "Tailwind CSS",', class: 'string' },
            { text: '  "Webpack",', class: 'string' },
            { text: '  "Jest"', class: 'string' },
            { text: '];', class: 'const' },
            { text: '', class: '' },
            { text: 'function buildUserInterface(design) {', class: 'function' },
            { text: '  const ui = new Interface(design);', class: 'const' },
            { text: '  ui.addResponsiveness();', class: 'method' },
            { text: '  ui.optimizePerformance();', class: 'method' },
            { text: '  return ui.render();', class: 'return' },
            { text: '}', class: 'function' },
          ];
          break;
        case 'calculadora':
          codeContent = [
            { text: '// Projeto: Calculadora', class: 'comment' },
            { text: 'class Calculadora extends React.Component {', class: 'class' },
            { text: '  /* Uma calculadora interativa com operações básicas', class: 'comment' },
            { text: '     e design inspirado em calculadoras clássicas */', class: 'comment' },
            { text: '', class: '' },
            { text: '  const tecnologias = [', class: 'const' },
            { text: '    "React",', class: 'string' },
            { text: '    "CSS Grid",', class: 'string' },
            { text: '    "Jest para testes"', class: 'string' },
            { text: '  ];', class: 'const' },
            { text: '', class: '' },
            { text: '  // Clique na calculadora ao lado para interagir', class: 'comment' },
            { text: '  // ou visite o repositório: github.com/seuusuario/calculadora', class: 'comment' },
            { text: '}', class: 'class' },
          ];
          break;
        default:
          codeContent = [
            { text: '// Bem-vindo ao meu portfólio!', class: 'comment' },
            { text: '/**', class: 'comment' },
            { text: ' * Este é um portfólio interativo no estilo de um editor de código.', class: 'comment' },
            { text: ' * Navegue pelo explorador à esquerda para ver diferentes seções.', class: 'comment' },
            { text: ' * Projetos específicos incluem uma preview interativa.', class: 'comment' },
            { text: ' */', class: 'comment' },
            { text: '', class: '' },
            { text: 'function iniciarPortfolio() {', class: 'function' },
            { text: '  console.log("Olá mundo! Sou [Seu Nome]");', class: 'console' },
            { text: '', class: '' },
            { text: '  // Selecione um item no menu para começar', class: 'comment' },
            { text: '  return {', class: 'return' },
            { text: '    código: "limpo",', class: 'property' },
            { text: '    design: "responsivo",', class: 'property' },
            { text: '    paixão: "infinita"', class: 'property' },
            { text: '  };', class: 'return' },
            { text: '}', class: 'function' },
          ];
      }
    }

    // Notificar o componente pai sobre a quantidade de linhas
    if (onContentChange) {
      onContentChange(codeContent.length);
    }

    // Reset typing animation when changing sections
    setContent([]);
    currentIndexRef.current = 0;
    setIsTyping(true);

    // Limpa qualquer intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (currentIndexRef.current < codeContent.length) {
        const currentLine = codeContent[currentIndexRef.current];
        
        // Verificar se a linha existe antes de tentar acessar suas propriedades
        if (currentLine) {
          setContent(prev => [
            ...prev, 
            {
              text: currentLine.text || '',
              class: currentLine.class || ''
            }
          ]);
        } else {
          // Se a linha não existir, adicionar uma linha vazia
          setContent(prev => [
            ...prev,
            { text: '', class: '' }
          ]);
        }
        
        currentIndexRef.current += 1;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsTyping(false);
      }
    }, 50); // Velocidade da digitação

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSection, onContentChange]);

  return (
    <div className={styles.code}>
      {content && content.length > 0 ? (
        content.map((line, index) => (
          <div key={index} className={styles.codeLine}>
            <span className={line && line.class && styles[line.class] ? styles[line.class] : ''}>
              {line && line.text ? line.text : ''}
            </span>
            {index === content.length - 1 && isTyping && (
              <span className={styles.cursor}>|</span>
            )}
          </div>
        ))
      ) : (
        // Mostrar um cursor piscando quando não houver conteúdo
        <div className={styles.codeLine}>
          <span className={styles.cursor}>|</span>
        </div>
      )}
    </div>
  );
} 