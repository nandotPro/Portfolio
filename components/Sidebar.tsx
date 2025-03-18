'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  setActiveProject: (project: string | null) => void;
}

type SectionName = 'about' | 'skills' | 'projects';

export default function Sidebar({ setActiveProject }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    skills: true,
    projects: true
  });

  const projects = [
    { id: 'calculadora', name: 'Calculadora', tech: 'React' },
    { id: 'todoapp', name: 'Todo App', tech: 'Next.js' },
    // Adicione mais projetos conforme necessário
  ];

  const toggleSection = (section: SectionName) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.explorerHeader}>
        EXPLORER
      </div>
      
      <div className={styles.sectionHeader} onClick={() => toggleSection('about')}>
        {expandedSections.about ? '▼' : '►'} SOBRE MIM
      </div>
      {expandedSections.about && (
        <div className={styles.fileList}>
          <div className={styles.file} onClick={() => setActiveProject('about')}>
            📄 sobre.js
          </div>
          <div className={styles.file} onClick={() => setActiveProject('contact')}>
            📄 contato.js
          </div>
        </div>
      )}

      <div className={styles.sectionHeader} onClick={() => toggleSection('skills')}>
        {expandedSections.skills ? '▼' : '►'} HABILIDADES
      </div>
      {expandedSections.skills && (
        <div className={styles.fileList}>
          <div className={styles.file} onClick={() => setActiveProject('frontend')}>
            📄 frontend.js
          </div>
          <div className={styles.file} onClick={() => setActiveProject('backend')}>
            📄 backend.js
          </div>
        </div>
      )}

      <div className={styles.sectionHeader} onClick={() => toggleSection('projects')}>
        {expandedSections.projects ? '▼' : '►'} PROJETOS
      </div>
      {expandedSections.projects && (
        <div className={styles.fileList}>
          {projects.map(project => (
            <div 
              key={project.id} 
              className={styles.file}
              onClick={() => setActiveProject(project.id)}
            >
              📄 {project.name}.js
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 