// Server Component - Fetches product data on the server
import { fakeStoreAPI } from '@/lib/api/server-api';
import ProductDetails from './_components/ProductDetails';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  let product = null;
  let error = null;

  try {
    // In Next.js 15, params is a Promise
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      notFound();
    }
    product = await fakeStoreAPI.getProduct(productId);
  } catch (err) {
    console.error('Error fetching product:', err);
    error = 'Failed to load product details';
  }

  if (!product && !error) {
    notFound();
  }

  return <ProductDetails initialProduct={product} initialError={error} />;
}

