// Server Component - Fetches data on the server
import { fakeStoreAPI } from '@/lib/api/server-api';
import { APP_CONFIG } from '@/lib/utils/constants';
import Home from './_components/Home';

import { Product } from '@/types';

export default async function HomePage() {
  // Server-side data fetching
  let products: Product[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    // Fetch products and categories separately to handle timeouts gracefully
    // Products are critical, categories can fail without breaking the page
    const [productsResult, categoriesResult] = await Promise.allSettled([
      fakeStoreAPI.getAllProducts(APP_CONFIG.PRODUCTS_LIMIT),
      fakeStoreAPI.getCategories(),
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

  // Pass data to client component
  return (
    <Home
      initialProducts={products}
      initialCategories={categories}
      initialError={error}
    />
  );
}

