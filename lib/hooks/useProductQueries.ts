'use client';

/**
 * React Query hooks for product data fetching
 * Provides caching, background refetching, and automatic request deduplication
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/api/services/productService';
import { Product } from '@/types';

// Query keys for React Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  byCategory: (category: string) => [...productKeys.all, 'category', category] as const,
};

/**
 * Hook to fetch all products with React Query caching
 */
export function useProducts(limit: number = 20) {
  return useQuery({
    queryKey: productKeys.list({ limit }),
    queryFn: () => productService.getAllProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single product with React Query caching
 */
export function useProduct(productId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.getProduct(productId),
    enabled: enabled && productId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch categories with React Query caching
 */
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch products by category with React Query caching
 */
export function useProductsByCategory(category: string, enabled: boolean = true) {
  return useQuery({
    queryKey: productKeys.byCategory(category),
    queryFn: () => productService.getProductsByCategory(category),
    enabled: enabled && !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch sorted products with React Query caching
 */
export function useProductsSorted(sort: string = 'asc', limit: number = 20) {
  return useQuery({
    queryKey: productKeys.list({ sort, limit }),
    queryFn: () => productService.getProductsSorted(sort, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

