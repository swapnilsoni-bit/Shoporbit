import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '@/types';

interface ReviewsState {
  [productId: number]: Review[];
}

// Load reviews from localStorage on initialization
const loadReviewsFromStorage = (): ReviewsState => {
  if (typeof window !== 'undefined') {
    const savedReviews = localStorage.getItem('product_reviews');
    if (savedReviews) {
      try {
        return JSON.parse(savedReviews);
      } catch (error) {
        console.error('Error loading reviews from localStorage:', error);
      }
    }
  }
  return {};
};

const initialState: ReviewsState = loadReviewsFromStorage();

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<{ productId: number; review: Omit<Review, 'id' | 'date' | 'productId'> }>) => {
      const { productId, review } = action.payload;
      const productReviews = state[productId] || [];
      const newReview: Review = {
        id: Date.now().toString(),
        productId,
        ...review,
        date: new Date().toISOString(),
      };
      state[productId] = [...productReviews, newReview];
      if (typeof window !== 'undefined') {
        localStorage.setItem('product_reviews', JSON.stringify(state));
      }
    },
    deleteReview: (state, action: PayloadAction<{ productId: number; reviewId: string }>) => {
      const { productId, reviewId } = action.payload;
      if (state[productId]) {
        state[productId] = state[productId].filter((r) => r.id !== reviewId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('product_reviews', JSON.stringify(state));
        }
      }
    },
  },
});

export const { addReview, deleteReview } = reviewSlice.actions;

// Selectors
export const selectProductReviews = (state: { review: ReviewsState }, productId: number) =>
  state.review[productId] || [];

export const selectAverageRating = (state: { review: ReviewsState }, productId: number) => {
  const reviews = state.review[productId] || [];
  if (reviews.length === 0) return '0';
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export default reviewSlice.reducer;

