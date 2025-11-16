// Server Component - Fetches product and related products on the server (NO LOADERS)
import { productService } from '@/lib/api/services/productService';
import { getRelatedProducts } from '@/lib/utils/filterHelpers';
import ProductDetails from './_components/ProductDetails';
import { notFound } from 'next/navigation';
import { Product } from '@/types';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    const product = await productService.getProduct(productId);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const productUrl = `${siteUrl}/product/${product.id}`;
    const imageUrl = product.image || `${siteUrl}/og-image.png`;

    return {
      title: product.title,
      description: product.description || `Buy ${product.title} for $${product.price.toFixed(2)}. ${product.category} with ${product.rating?.rate || 0} star rating.`,
      keywords: [product.category, product.title, 'buy online', 'e-commerce'],
      openGraph: {
        type: 'website',
        url: productUrl,
        title: product.title,
        description: product.description || `Buy ${product.title} for $${product.price.toFixed(2)}`,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.description || `Buy ${product.title} for $${product.price.toFixed(2)}`,
        images: [imageUrl],
      },
      alternates: {
        canonical: productUrl,
      },
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': 'USD',
        'product:availability': 'in stock',
        'product:condition': 'new',
        'product:retailer': 'ShopOrbit',
      },
    };
  } catch (error) {
    return {
      title: 'Product Details',
      description: 'View product details on ShopOrbit',
    };
  }
}

// Enable ISR (Incremental Static Regeneration) - Revalidate every hour
export const revalidate = 3600; // 1 hour in seconds

// Generate static params for top products (ISR)
export async function generateStaticParams() {
  try {
    // Pre-render top 20 products at build time
    const products = await productService.getAllProducts(20);
    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductDetailsPage({ params }: PageProps) {
  let product: Product | null = null;
  let relatedProducts: Product[] = [];
  let error: string | null = null;

  try {
    // In Next.js 15, params is a Promise
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      notFound();
    }

    // Fetch product and all products in parallel for related products
    const [productResult, allProductsResult] = await Promise.allSettled([
      productService.getProduct(productId),
      productService.getAllProducts(50), // Get more products for better related selection
    ]);

    // Handle product (critical)
    if (productResult.status === 'fulfilled') {
      product = productResult.value;
    } else {
      console.error('Error fetching product:', productResult.reason);
      error = 'Failed to load product details';
    }

    // Handle related products (non-critical)
    if (allProductsResult.status === 'fulfilled' && product) {
      relatedProducts = getRelatedProducts(allProductsResult.value, product, 4);
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    error = 'Failed to load product details';
  }

  if (!product && !error) {
    notFound();
  }

  // Generate structured data (JSON-LD) for SEO
  const structuredData = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    sku: product.id.toString(),
    brand: {
      '@type': 'Brand',
      name: 'ShopOrbit',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    category: product.category,
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ProductDetails
        initialProduct={product}
        initialRelatedProducts={relatedProducts}
        initialError={error}
      />
    </>
  );
}

