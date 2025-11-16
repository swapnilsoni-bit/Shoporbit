// Server Component - Fetches data on the server (NO LOADERS - instant render)
import { productService } from '@/lib/api/services/productService';
import { APP_CONFIG } from '@/lib/utils/constants';
import Home from './_components/Home';
import { Product } from '@/types';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomeLoading from './loading';

// Enable ISR - Revalidate every 5 minutes
export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: 'Home',
  description: 'Discover amazing products with advanced filters, search, and smart sorting. Shop the best deals on electronics, jewelry, clothing, and more.',
  openGraph: {
    title: 'ShopOrbit - Discover Amazing Products',
    description: 'Discover amazing products with advanced filters, search, and smart sorting',
    type: 'website',
  },
};

export default async function HomePage() {
  // Server-side data fetching - All data fetched before page renders
  // This eliminates all loading states for users
  let products: Product[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    // Fetch products and categories in parallel for better performance
    // Using Promise.allSettled to handle failures gracefully
    const [productsResult, categoriesResult] = await Promise.allSettled([
      productService.getAllProducts(APP_CONFIG.PRODUCTS_LIMIT),
      productService.getCategories(),
    ]);

    // Handle products (critical)
    if (productsResult.status === 'fulfilled') {
      products = productsResult.value;
    } else {
      console.error('Error fetching products:', productsResult.reason);
      error = 'Failed to load products. Please try again.';
    }

    // Handle categories (non-critical, can fail gracefully)
    if (categoriesResult.status === 'fulfilled') {
      categories = categoriesResult.value;
    } else {
      console.error('Error fetching categories:', categoriesResult.reason);
      // Categories are non-critical, so we continue with empty array
      categories = [];
    }
  } catch (err) {
    console.error('Unexpected error fetching data:', err);
    error = 'Failed to load products. Please try again.';
  }

  // Generate structured data (JSON-LD) for SEO - CollectionPage schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ShopOrbit - Premium E-commerce Platform',
    description: 'Discover amazing products with advanced filters, search, and smart sorting',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          image: product.image,
          description: product.description,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/product/${product.id}`,
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        },
      ],
    },
  };

  // Pass data to client component - No loading state needed!
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Home
        initialProducts={products}
        initialCategories={categories}
        initialError={error}
      />
    </>
  );
}

