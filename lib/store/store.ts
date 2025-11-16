import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import filterReducer from './slices/filterSlice';
import reviewReducer from './slices/reviewSlice';
import comparisonReducer from './slices/comparisonSlice';

const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      filter: filterReducer,
      review: reviewReducer,
      comparison: comparisonReducer,
    },
  });
};

// Create store instance - only on client side
let storeInstance: ReturnType<typeof makeStore> | undefined;

export const getStore = () => {
  if (typeof window === 'undefined') {
    // Return a minimal store for SSR
    return makeStore();
  }
  if (!storeInstance) {
    storeInstance = makeStore();
  }
  return storeInstance;
};

// Export store for backward compatibility, but use getStore() in providers
export const store = typeof window !== 'undefined' ? getStore() : makeStore();

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];

