'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Editor from './Editor';
import styles from './Layout.module.css';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <Sidebar setActiveProject={setActiveProject} />
        <Editor activeProject={activeProject}>
          {children}
        </Editor>
      </div>
    </div>
  );
} 