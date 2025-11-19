"use client";

import React, { Component, ReactNode } from "react";

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error that was caught */
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 * Displays a fallback UI instead of crashing the entire application
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development only
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // TODO: Send error to logging service in production
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Resets the error boundary state
   */
  private reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      // Default fallback UI
      return (
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-red-900">
            Oops! Something went wrong
          </h1>
          <p className="mb-4 text-red-700">
            {this.state.error.message || "An unexpected error occurred"}
          </p>
          <details className="mb-6 rounded bg-red-100 p-4 text-left text-sm">
            <summary className="cursor-pointer font-semibold text-red-900">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-red-800">
              {this.state.error.stack}
            </pre>
          </details>
          <button
            onClick={this.reset}
            className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
