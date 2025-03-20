import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Erro capturado por ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return this.props.fallback || (
        <div style={{ 
          padding: '20px', 
          color: '#e74c3c', 
          background: '#111',
          border: '1px solid #333',
          borderRadius: '4px'
        }}>
          <h2>Algo deu errado</h2>
          <p>Ocorreu um erro ao renderizar este componente.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 12px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 