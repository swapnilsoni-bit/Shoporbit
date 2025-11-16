import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/SkipLink';
import Analytics from '@/components/Analytics';
import WebVitals from '@/components/WebVitals';
import PWARegister from '@/components/PWARegister';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ShopOrbit - Premium E-commerce Platform',
    template: '%s | ShopOrbit',
  },
  description: 'Premium e-commerce platform with advanced filtering, product comparison, and seamless shopping experience. Discover amazing products with smart search and filters.',
  keywords: ['e-commerce', 'shopping', 'products', 'online store', 'buy online', 'shopping cart', 'product comparison', 'wishlist'],
  authors: [{ name: 'ShopOrbit Team' }],
  creator: 'ShopOrbit',
  publisher: 'ShopOrbit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ShopOrbit',
    title: 'ShopOrbit - Premium E-commerce Platform',
    description: 'Premium e-commerce platform with advanced filtering and product comparison',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShopOrbit - Premium E-commerce Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopOrbit - Premium E-commerce Platform',
    description: 'Premium e-commerce platform with advanced filtering and product comparison',
    images: ['/og-image.png'],
    creator: '@shoporbit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <SkipLink />
        <Analytics />
        <WebVitals />
        <PWARegister />
        <Providers>
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

