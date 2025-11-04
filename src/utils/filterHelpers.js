// Helper functions for filtering and sorting

export const filterByPrice = (products, minPrice, maxPrice) => {
  return products.filter(
    product => parseFloat(product.price) >= minPrice && parseFloat(product.price) <= maxPrice
  );
};

export const filterByRating = (products, minRating) => {
  return products.filter(
    product => product.rating && product.rating.rate >= minRating
  );
};

export const filterByCategory = (products, category) => {
  if (!category) return products;
  return products.filter(
    product => product.category && product.category.toLowerCase() === category.toLowerCase()
  );
};

export const sortProducts = (products, sortType) => {
  const sorted = [...products];

  switch (sortType) {
    case 'asc':
      return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case 'desc':
      return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
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

export const searchProducts = (products, query) => {
  if (!query.trim()) return products;

  const lowercaseQuery = query.toLowerCase().trim();
  return products.filter(
    product =>
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      (product.category && product.category.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRelatedProducts = (products, currentProduct, limit = 4) => {
  return products
    .filter(
      product =>
        product.category === currentProduct.category && product.id !== currentProduct.id
    )
    .slice(0, limit);
};

export const getPriceRange = (products) => {
  if (products.length === 0) return { min: 0, max: 0 };

  const prices = products.map(p => parseFloat(p.price));
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
