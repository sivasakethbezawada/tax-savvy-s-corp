
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-8 rounded-lg border bg-card text-card-foreground shadow-lg">
              <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
              <p className="mb-4 text-muted-foreground">
                An unexpected error has occurred. Please refresh the page or try again later.
              </p>
              <pre className="p-4 bg-muted rounded-md overflow-auto text-sm mb-4">
                {this.state.error?.message || "Unknown error"}
              </pre>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
