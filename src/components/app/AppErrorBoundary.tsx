import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application crashed in React boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-shell" role="alert" aria-live="assertive">
          <section className="hero-frame" style={{ display: 'grid', placeItems: 'center' }}>
            <p>Something went wrong. Please refresh the page.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
