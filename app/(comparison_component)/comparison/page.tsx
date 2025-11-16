'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/reduxHooks';
import Comparison from './_components/Comparison';

export default function ComparisonPage() {
  const router = useRouter();
  const { isGuest } = useAuth();

  useEffect(() => {
    if (isGuest) {
      router.push('/login');
    }
  }, [isGuest, router]);

  if (isGuest) {
    return null; // Will redirect
  }

  return <Comparison />;
}

