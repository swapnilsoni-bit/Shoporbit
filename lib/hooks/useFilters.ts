'use client';

import { useCallback } from 'react';
import { useFilter } from '@/lib/hooks/reduxHooks';
import {
  filterByPrice,
  filterByRating,
  sortProducts,
  searchProducts,
  filterByCategory,
} from '@/lib/utils/filterHelpers';
import { Product } from '@/types';

export const useFilters = () => {
  const { filters } = useFilter();

  const applyFilters = useCallback(
    (products: Product[]): Product[] => {
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

