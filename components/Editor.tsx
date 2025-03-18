'use client';

import styles from './Editor.module.css';
import ProjectPreview from './ProjectPreview';
import CodeContent from './CodeContent';
import { useState, useEffect } from 'react';

interface EditorProps {
  activeProject: string | null;
  children?: React.ReactNode;
}

export default function Editor({ activeProject, children }: EditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Se um projeto está ativo, mostra o preview
    if (activeProject && 
        activeProject !== 'about' && 
        activeProject !== 'contact' && 
        activeProject !== 'frontend' && 
        activeProject !== 'backend') {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [activeProject]);

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.tabsBar}>
        {activeProject && (
          <div className={styles.tab}>
            {activeProject}.js
            <span className={styles.closeTab}>×</span>
          </div>
        )}
      </div>
      
      <div className={styles.editorContainer}>
        <div className={styles.codeArea}>
          <div className={styles.lineNumbers}>
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className={styles.lineNumber}>{i + 1}</div>
            ))}
          </div>
          <div className={styles.codeContent}>
            <CodeContent activeSection={activeProject} />
          </div>
        </div>

        {showPreview && (
          <ProjectPreview projectId={activeProject} />
        )}
      </div>
    </div>
  );
} 