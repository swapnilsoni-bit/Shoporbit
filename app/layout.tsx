import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopOrbit - Premium E-commerce Platform',
  description: 'Premium e-commerce platform with advanced filtering and product comparison',
  keywords: 'e-commerce, shopping, products, online store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center">Loading...</div></div>}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}

