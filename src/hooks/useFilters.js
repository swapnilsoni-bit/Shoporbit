import { useCallback } from 'react';
import { useFilter } from '../contexts/FilterContext';
import {
  filterByPrice,
  filterByRating,
  sortProducts,
  searchProducts,
  filterByCategory,
} from '../utils/filterHelpers';

export const useFilters = () => {
  const { filters } = useFilter();

  const applyFilters = useCallback(
    (products) => {
      let filtered = [...products];

      // 1. Apply category filter FIRST
      if (filters.category) {
        filtered = filterByCategory(filtered, filters.category);
      }

      // 2. Apply search filter
      filtered = searchProducts(filtered, filters.searchQuery);

      // 3. Apply price filter
      filtered = filterByPrice(filtered, filters.minPrice, filters.maxPrice);

      // 4. Apply rating filter
      if (filters.minRating > 0) {
        filtered = filterByRating(filtered, filters.minRating);
      }

      // 5. Apply sorting
      filtered = sortProducts(filtered, filters.sortBy);

      return filtered;
    },
    [filters]
  );

  return { applyFilters, filters };
};
