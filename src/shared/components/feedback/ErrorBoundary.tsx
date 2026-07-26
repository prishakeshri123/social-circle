import { Component, type ReactNode } from 'react';
import { ErrorFallback } from '@/shared/components/feedback/ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error): void {
    console.error('ErrorBoundary caught an error:', error);
  }

  private handleRetry = () => this.setState({ hasError: false });

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
