'use client';

/**
 * React Query mutations for cart operations with optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCart as useReduxCart } from './reduxHooks';
import { Product } from '@/types';

/**
 * Hook for adding to cart with optimistic updates
 */
export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  const { addToCart: reduxAddToCart } = useReduxCart();

  return useMutation({
    mutationFn: async ({ product, quantity }: { product: Product; quantity: number }) => {
      // In a real app, this would call an API
      // For now, we use Redux for local state
      // useCart's addToCart expects (product, quantity) as separate arguments
      reduxAddToCart(product, quantity);
      return { product, quantity };
    },
    onMutate: async ({ product, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update the cart
      queryClient.setQueryData(['cart'], (old: any) => {
        if (!old) return [{ product, quantity }];
        const existingIndex = old.findIndex((item: any) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...old];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...old, { product, quantity }];
      });

      // Return context with the previous value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

/**
 * Hook for removing from cart with optimistic updates
 */
export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient();
  const { removeFromCart: reduxRemoveFromCart } = useReduxCart();

  return useMutation({
    mutationFn: async (productId: number) => {
      reduxRemoveFromCart(productId);
      return productId;
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], (old: any) => {
        if (!old) return [];
        return old.filter((item: any) => item.product.id !== productId);
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

