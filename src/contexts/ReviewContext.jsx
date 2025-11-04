import React, { createContext, useContext, useState, useCallback } from 'react';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    try {
      const savedReviews = localStorage.getItem('product_reviews');
      return savedReviews ? JSON.parse(savedReviews) : {};
    } catch {
      return {};
    }
  });

  const addReview = useCallback((productId, review) => {
    setReviews(prev => {
      const productReviews = prev[productId] || [];
      const newReview = {
        id: Date.now(),
        ...review,
        date: new Date().toISOString(),
      };
      const updated = {
        ...prev,
        [productId]: [...productReviews, newReview],
      };
      localStorage.setItem('product_reviews', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getProductReviews = useCallback((productId) => {
    return reviews[productId] || [];
  }, [reviews]);

  const deleteReview = useCallback((productId, reviewId) => {
    setReviews(prev => {
      const updated = {
        ...prev,
        [productId]: (prev[productId] || []).filter(r => r.id !== reviewId),
      };
      localStorage.setItem('product_reviews', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getAverageRating = useCallback((productId) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  }, [reviews]);

  const value = {
    reviews,
    addReview,
    getProductReviews,
    deleteReview,
    getAverageRating,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within ReviewProvider');
  }
  return context;
};
