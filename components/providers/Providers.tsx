'use client';

import { ReduxProvider } from './ReduxProvider';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

