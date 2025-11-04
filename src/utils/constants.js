// App constants and configuration
export const APP_CONFIG = {
  APP_NAME: 'E-Commerce Store',
  API_BASE_URL: 'https://fakestoreapi.com',
  PRODUCTS_PER_PAGE: 12,
  PRODUCTS_LIMIT: 50,
  MAX_PRICE: 1000,
  MIN_PRICE: 0,
  TAX_RATE: 0.1,
  SHIPPING_COST: 10,
  FREE_SHIPPING_ABOVE: 50,
};

export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'asc' },
  { label: 'Price: High to Low', value: 'desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Best Rated', value: 'rated' },
];

export const FILTER_TYPES = {
  PRICE: 'price',
  CATEGORY: 'category',
  RATING: 'rating',
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const COMPARISON_MAX_ITEMS = 3;

export const STAR_RATINGS = [5, 4, 3, 2, 1];
