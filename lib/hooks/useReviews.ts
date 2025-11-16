'use client';

import { useReview } from '@/lib/hooks/reduxHooks';
import { Review } from '@/types';

export const useReviews = (productId: number) => {
  const { getProductReviews, addReview, deleteReview, getAverageRating } = useReview();

  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);

  const submitReview = (review: Omit<Review, 'id' | 'date' | 'productId'>) => {
    addReview(productId, review);
  };

  const removeReview = (reviewId: string) => {
    deleteReview(productId, reviewId);
  };

  return {
    reviews,
    averageRating,
    submitReview,
    removeReview,
  };
};

