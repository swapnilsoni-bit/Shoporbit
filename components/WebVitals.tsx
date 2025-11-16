/**
 * Web Vitals Component
 * Performance monitoring
 */

'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/utils/performance';

export default function WebVitals() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}

