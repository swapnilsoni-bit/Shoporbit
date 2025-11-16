'use client';

/**
 * React Query mutations for wishlist operations with optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWishlist as useReduxWishlist } from './reduxHooks';
import { Product } from '@/types';

/**
 * Hook for adding to wishlist with optimistic updates
 */
export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();
  const { addToWishlist: reduxAddToWishlist } = useReduxWishlist();

  return useMutation({
    mutationFn: async (product: Product) => {
      reduxAddToWishlist(product);
      return product;
    },
    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData(['wishlist']);

      queryClient.setQueryData(['wishlist'], (old: any) => {
        if (!old) return [product];
        if (old.find((item: Product) => item.id === product.id)) {
          return old; // Already in wishlist
        }
        return [...old, product];
      });

      return { previousWishlist };
    },
    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

/**
 * Hook for removing from wishlist with optimistic updates
 */
export function useRemoveFromWishlistMutation() {
  const queryClient = useQueryClient();
  const { removeFromWishlist: reduxRemoveFromWishlist } = useReduxWishlist();

  return useMutation({
    mutationFn: async (productId: number) => {
      reduxRemoveFromWishlist(productId);
      return productId;
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData(['wishlist']);

      queryClient.setQueryData(['wishlist'], (old: any) => {
        if (!old) return [];
        return old.filter((item: Product) => item.id !== productId);
      });

      return { previousWishlist };
    },
    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

