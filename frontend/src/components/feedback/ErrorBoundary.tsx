import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow">
          <h1 className="text-xl font-bold text-slate-950">
            문제가 발생했습니다
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            화면을 새로고침한 뒤 다시 시도해 주세요.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            새로고침
          </Button>
        </div>
      </div>
    );
  }
}
