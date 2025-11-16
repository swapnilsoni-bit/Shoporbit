import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';
import { COMPARISON_MAX_ITEMS } from '@/lib/utils/constants';

interface ComparisonState {
  items: Product[];
}

// Load comparison from localStorage on initialization
const loadComparisonFromStorage = (): Product[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('comparison_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading comparison from localStorage:', error);
      }
    }
  }
  return [];
};

const initialState: ComparisonState = {
  items: loadComparisonFromStorage(),
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToComparison: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!state.items.find((p) => p.id === product.id) && state.items.length < COMPARISON_MAX_ITEMS) {
        state.items.push(product);
        if (typeof window !== 'undefined') {
          localStorage.setItem('comparison_list', JSON.stringify(state.items));
        }
      }
    },
    removeFromComparison: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('comparison_list', JSON.stringify(state.items));
      }
    },
    clearComparison: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('comparison_list', JSON.stringify(state.items));
      }
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions;

// Selectors
export const selectComparisonItems = (state: { comparison: ComparisonState }) => state.comparison.items;
export const selectComparisonCount = (state: { comparison: ComparisonState }) => state.comparison.items.length;
export const selectIsInComparison = (state: { comparison: ComparisonState }, productId: number) =>
  state.comparison.items.some((p) => p.id === productId);

export default comparisonSlice.reducer;

