import { FileNode } from '../store/editorStore';

export const initialFileTree: FileNode = {
  id: 'main',
  name: 'main',
  isFolder: true,
  path: '/',
  isOpen: true,
  children: [
    {
      id: 'readme',
      name: 'README.md',
      isFolder: false,
      path: '/readme',
      fileType: 'md'
    },
    {
      id: 'about',
      name: 'about.json',
      isFolder: false,
      path: '/about',
      fileType: 'json'
    },
    {
      id: 'contact',
      name: 'contact.ts',
      isFolder: false,
      path: '/contact',
      fileType: 'ts'
    },
    {
      id: 'projects',
      name: 'projects',
      isFolder: true,
      path: '/projects',
      isOpen: false,
      children: [
        {
          id: 'node-react',
          name: 'Node-React.tsx',
          isFolder: false,
          path: '/projects/node-react',
          fileType: 'tsx'
        },
        {
          id: 'python-ai',
          name: 'python-AI.tsx',
          isFolder: false,
          path: '/projects/python-ai',
          fileType: 'tsx'
        },
        {
          id: 'devops',
          name: 'DevOps.tsx',
          isFolder: false,
          path: '/projects/devops',
          fileType: 'tsx'
        }
      ]
    },
    {
      id: 'skills',
      name: 'skills',
      isFolder: true,
      path: '/skills',
      isOpen: false,
      children: [
        {
          id: 'stack',
          name: 'stack.ts',
          isFolder: false,
          path: '/skills/stack',
          fileType: 'ts'
        },
        {
          id: 'tools',
          name: 'tools.ts',
          isFolder: false,
          path: '/skills/tools',
          fileType: 'ts'
        }
      ]
    }
  ]
}; 