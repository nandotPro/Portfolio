'use client';

import styles from '../styles/modules/projectPreview.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProjectPreviewProps {
  projectId: string | null;
}

type Project = {
  title: string;
  image: string;
  description: string;
  link: string;
};

export default function ProjectPreview({ projectId }: ProjectPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  
  // Reset error state when projectId changes
  useEffect(() => {
    setImgError(false);
    setLoading(true);
  }, [projectId]);
  
  // Simule dados de projeto (em produção, você pode usar uma API ou dados estáticos)
  const projects: Record<string, Project> = {
    calculadora: {
      title: "Calculadora",
      image: "/projects/calculadora.png", // Mudamos para .png
      description: "Uma calculadora interativa feita com React",
      link: "https://github.com/seuusuario/calculadora"
    },
    todoapp: {
      title: "Todo App",
      image: "/projects/todoapp.png", // Mudamos para .png
      description: "Aplicativo de lista de tarefas com Next.js",
      link: "https://github.com/seuusuario/todoapp"
    },
    // Adicione mais projetos conforme necessário
  };

  const project = projectId && projects[projectId] ? projects[projectId] : null;

  // Se o projeto não for encontrado, não tente renderizar
  if (!project) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.noProject}>
          Selecione um projeto para visualizar
        </div>
      </div>
    );
  }

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <h3>Preview: {project.title}</h3>
      </div>
      <div className={styles.previewContent}>
        {loading && !imgError && <div className={styles.loading}>Carregando preview...</div>}
        <div className={styles.imageContainer}>
          {!imgError ? (
            <Image 
              src={project.image} 
              alt={project.title}
              width={400}
              height={300}
              onLoad={() => setLoading(false)}
              onError={() => {
                console.log('Erro ao carregar imagem:', project.image);
                setImgError(true);
                setLoading(false);
              }}
              style={{ opacity: loading ? 0 : 1 }}
              unoptimized // Adiciona essa propriedade para evitar otimização que pode causar problemas
            />
          ) : (
            <div className={styles.placeholderImage}>
              <div className={styles.placeholderText}>
                {project.title}
              </div>
            </div>
          )}
        </div>
        <p className={styles.description}>{project.description}</p>
        <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
          Ver Projeto →
        </a>
      </div>
    </div>
  );
} 