import { FileNode } from '../store/editorStore';

export const initialFileTree: FileNode = {
  id: 'root',
  name: 'main',
  isFolder: true,
  isOpen: true,
  path: '',
  children: [
    {
      id: 'about-me',
      name: 'about-me.ts',
      isFolder: false,
      path: 'about',
      fileType: 'ts'
    },
    {
      id: 'contact',
      name: 'contact.ts',
      isFolder: false,
      path: 'contact',
      fileType: 'ts'
    },
    {
      id: 'projects',
      name: 'projects',
      isFolder: true,
      isOpen: false,
      path: 'projects',
      children: [
        {
          id: 'backend-api',
          name: 'backend-api.ts',
          isFolder: false,
          path: 'backend',
          fileType: 'ts'
        },
        {
          id: 'devops-pipeline',
          name: 'devops-pipeline.ts',
          isFolder: false,
          path: 'devops',
          fileType: 'ts'
        },
        {
          id: 'ai-project',
          name: 'ai-project.ts',
          isFolder: false,
          path: 'ai',
          fileType: 'ts'
        }
      ]
    },
    {
      id: 'skills',
      name: 'skills',
      isFolder: true,
      isOpen: false,
      path: 'skills',
      children: [
        {
          id: 'tech-stack',
          name: 'tech-stack.ts',
          isFolder: false,
          path: 'tech',
          fileType: 'ts'
        },
        {
          id: 'tools',
          name: 'tools.ts',
          isFolder: false,
          path: 'tools',
          fileType: 'ts'
        }
      ]
    }
  ]
}; 