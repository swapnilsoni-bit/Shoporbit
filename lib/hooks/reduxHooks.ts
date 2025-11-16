'use client';

// Redux hooks for components
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  // Auth
  loginAsync,
  registerAsync,
  logout,
  selectAuth,
  // Cart
  addToCart,
  removeFromCart,
  updateQuantity,
  emptyCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  // Wishlist
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
  // Filter
  updateFilter,
  updateMultipleFilters,
  resetFilters,
  selectFilters,
  selectHasActiveFilters,
  // Review
  addReview,
  deleteReview,
  selectProductReviews,
  selectAverageRating,
  // Comparison
  addToComparison,
  removeFromComparison,
  clearComparison,
  selectComparisonItems,
  selectComparisonCount,
  selectIsInComparison,
} from '@/lib/store';
import { COMPARISON_MAX_ITEMS } from '@/lib/utils/constants';

// Auth hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const handleLogin = async (username: string, password: string) => {
    const result = await dispatch(loginAsync({ username, password }));
    return loginAsync.fulfilled.match(result);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const result = await dispatch(registerAsync({ name, email, password }));
    return registerAsync.fulfilled.match(result);
  };

  return {
    ...auth,
    login: handleLogin,
    register: handleRegister,
    logout: () => dispatch(logout()),
  };
};

// Cart hooks
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);

  return {
    cart,
    cartCount,
    calculateSubtotal: () => subtotal,
    addToCart: (product: any, quantity: number) => dispatch(addToCart({ product, quantity })),
    removeFromCart: (productId: number) => dispatch(removeFromCart(productId)),
    updateQuantity: (productId: number, quantity: number) => dispatch(updateQuantity({ productId, quantity })),
    emptyCart: () => dispatch(emptyCart()),
  };
};

// Wishlist hooks
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(selectWishlistItems);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const addAllToCart = () => {
    wishlist.forEach((product) => {
      dispatch(addToCart({ product, quantity: 1 }));
    });
    dispatch(clearWishlist());
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  return {
    wishlist,
    wishlistCount,
    isInWishlist,
    addToWishlist: (product: any) => dispatch(addToWishlist(product)),
    removeFromWishlist: (productId: number) => dispatch(removeFromWishlist(productId)),
    clearWishlist: () => dispatch(clearWishlist()),
    addAllToCart,
  };
};

// Filter hooks
export const useFilter = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  return {
    filters,
    hasActiveFilters: () => hasActiveFilters,
    updateFilter: (name: keyof typeof filters, value: any) => dispatch(updateFilter({ name, value })),
    updateMultipleFilters: (newFilters: Partial<typeof filters>) => dispatch(updateMultipleFilters(newFilters)),
    resetFilters: () => dispatch(resetFilters()),
  };
};

// Review hooks - accepts optional productId for direct access
export const useReview = (productId?: number) => {
  const dispatch = useAppDispatch();
  const allReviews = useAppSelector((state) => state.review);

  const getProductReviews = (id: number) => {
    return allReviews[id] || [];
  };

  const getAverageRating = (id: number) => {
    const reviews = allReviews[id] || [];
    if (reviews.length === 0) return '0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return {
    addReview: (id: number, review: any) => dispatch(addReview({ productId: id, review })),
    deleteReview: (id: number, reviewId: string) => dispatch(deleteReview({ productId: id, reviewId })),
    getProductReviews,
    getAverageRating,
    // Direct access if productId provided
    reviews: productId ? getProductReviews(productId) : undefined,
    averageRating: productId ? getAverageRating(productId) : undefined,
  };
};

// Comparison hooks
export const useComparison = () => {
  const dispatch = useAppDispatch();
  const comparisonList = useAppSelector(selectComparisonItems);
  const comparisonCount = useAppSelector(selectComparisonCount);

  const isInComparison = (productId: number) => {
    return comparisonList.some((p) => p.id === productId);
  };

  return {
    comparisonList,
    getComparisonCount: () => comparisonCount,
    isInComparison,
    addToComparison: (product: any) => dispatch(addToComparison(product)),
    removeFromComparison: (productId: number) => dispatch(removeFromComparison(productId)),
    clearComparison: () => dispatch(clearComparison()),
    maxItems: COMPARISON_MAX_ITEMS,
  };
};

