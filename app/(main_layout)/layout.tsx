'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap in Suspense to handle router mounting gracefully
  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col bg-white"><main className="flex-1">{children}</main></div>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}

