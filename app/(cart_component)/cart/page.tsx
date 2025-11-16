'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/reduxHooks';
import Cart from './_components/Cart';

export default function CartPage() {
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

  return <Cart />;
}

