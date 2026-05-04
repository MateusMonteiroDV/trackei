import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50">
          <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">Ops! Algo deu errado.</h2>
          <p className="text-sm text-red-700 dark:text-red-400 mb-6 max-w-xs">
            Ocorreu um erro ao carregar este componente. Tente atualizar a página.
          </p>
          <Button 
            variant="outline" 
            className="border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Recarregar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
