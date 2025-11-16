'use client';

import { useEffect, useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { clientFakeStoreAPI } from '@/lib/api/client-api';
import { getRelatedProducts } from '@/lib/utils/filterHelpers';
import { Product } from '@/types';

interface RelatedProductsProps {
  currentProduct: Product;
  onProductClick: (product: Product) => void;
}

export default function RelatedProducts({ currentProduct, onProductClick }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const allProducts = await clientFakeStoreAPI.getAllProducts(50);
        const related = getRelatedProducts(allProducts, currentProduct, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchRelated();
    }
  }, [currentProduct]);

  if (loading) {
    return <div className="text-center py-8">Loading related products...</div>;
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Products</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-8px] cursor-pointer border border-slate-100"
          >
            {/* Image */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-4"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h4>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating?.rate || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-600 ml-1">
                  {product.rating?.rate.toFixed(1)}
                </span>
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

