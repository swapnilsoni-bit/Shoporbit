'use client';

import { ReduxProvider } from './ReduxProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}

