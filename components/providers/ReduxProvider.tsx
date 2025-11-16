'use client';

import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { getStore } from '@/lib/store/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Create store only on client side
  const store = useMemo(() => getStore(), []);
  return <Provider store={store}>{children}</Provider>;
}

