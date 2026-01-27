"use client";
import React from 'react';
import { Button } from '@/Components/ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-black text-white">
          <h2 className="text-3xl font-bold mb-4 text-red-500">Something went wrong</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            We apologize for the inconvenience. The application encountered an unexpected error.
          </p>
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/20 mb-8 max-w-lg w-full text-left overflow-auto max-h-40">
            <code className="text-red-300 text-sm font-mono">
              {this.state.error?.toString()}
            </code>
          </div>
          <Button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            variant="primary"
            className="bg-white text-black hover:bg-gray-200"
          >
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
