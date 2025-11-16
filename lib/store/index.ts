// Export store and types
export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';

// Export auth actions and selectors
export {
  loginAsync,
  registerAsync,
  logout,
  setLoading,
  setError,
  setGuest,
  selectAuth,
} from './slices/authSlice';

// Export cart actions and selectors
export {
  addToCart,
  removeFromCart,
  updateQuantity,
  emptyCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
} from './slices/cartSlice';

// Export wishlist actions and selectors
export {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
} from './slices/wishlistSlice';

// Export filter actions and selectors
export {
  updateFilter,
  updateMultipleFilters,
  resetFilters,
  selectFilters,
  selectHasActiveFilters,
} from './slices/filterSlice';

// Export review actions and selectors
export {
  addReview,
  deleteReview,
  selectProductReviews,
  selectAverageRating,
} from './slices/reviewSlice';

// Export comparison actions and selectors
export {
  addToComparison,
  removeFromComparison,
  clearComparison,
  selectComparisonItems,
  selectComparisonCount,
  selectIsInComparison,
} from './slices/comparisonSlice';

