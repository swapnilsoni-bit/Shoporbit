// Helper functions for filtering and sorting
import { Product } from '@/types';

export const filterByPrice = (products: Product[], minPrice: number, maxPrice: number): Product[] => {
  return products.filter(
    (product) => parseFloat(product.price.toString()) >= minPrice && parseFloat(product.price.toString()) <= maxPrice
  );
};

export const filterByRating = (products: Product[], minRating: number): Product[] => {
  return products.filter(
    (product) => product.rating && product.rating.rate >= minRating
  );
};

export const filterByCategory = (products: Product[], category: string | null): Product[] => {
  if (!category) return products;
  return products.filter(
    (product) => product.category && product.category.toLowerCase() === category.toLowerCase()
  );
};

export const sortProducts = (products: Product[], sortType: string): Product[] => {
  const sorted = [...products];

  switch (sortType) {
    case 'asc':
      return sorted.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
    case 'desc':
      return sorted.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()));
    case 'rated':
      return sorted.sort((a, b) => {
        const rateA = a.rating?.rate || 0;
        const rateB = b.rating?.rate || 0;
        return rateB - rateA;
      });
    default:
      return sorted;
  }
};

export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return products;

  const lowercaseQuery = query.toLowerCase().trim();
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      (product.category && product.category.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRelatedProducts = (products: Product[], currentProduct: Product, limit: number = 4): Product[] => {
  return products
    .filter(
      (product) =>
        product.category === currentProduct.category && product.id !== currentProduct.id
    )
    .slice(0, limit);
};

export const getPriceRange = (products: Product[]): { min: number; max: number } => {
  if (products.length === 0) return { min: 0, max: 0 };

  const prices = products.map((p) => parseFloat(p.price.toString()));
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

