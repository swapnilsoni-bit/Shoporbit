import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
}

// Load wishlist from localStorage on initialization
const loadWishlistFromStorage = (): Product[] => {
  if (typeof window !== 'undefined') {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        return JSON.parse(savedWishlist);
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }
  return [];
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!state.items.find((item) => item.id === product.id)) {
        state.items.push(product);
        if (typeof window !== 'undefined') {
          localStorage.setItem('wishlist', JSON.stringify(state.items));
        }
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.items.length;
export const selectIsInWishlist = (state: { wishlist: WishlistState }, productId: number) =>
  state.wishlist.items.some((item) => item.id === productId);

export default wishlistSlice.reducer;

