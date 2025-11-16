import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '@/types';

interface FilterSliceState extends FilterState {
  sortBy: string;
}

const initialState: FilterSliceState = {
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  category: null,
  priceRange: [0, 1000],
  searchQuery: '',
  sortBy: 'asc',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    updateFilter: (state, action: PayloadAction<{ name: keyof FilterSliceState; value: any }>) => {
      const { name, value } = action.payload;
      (state as any)[name] = value;
    },
    updateMultipleFilters: (state, action: PayloadAction<Partial<FilterSliceState>>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { updateFilter, updateMultipleFilters, resetFilters } = filterSlice.actions;

// Selectors
export const selectFilters = (state: { filter: FilterSliceState }) => state.filter;
export const selectHasActiveFilters = (state: { filter: FilterSliceState }) => {
  const filters = state.filter;
  return (
    filters.minPrice > 0 ||
    filters.maxPrice < 1000 ||
    filters.minRating > 0 ||
    filters.category !== null ||
    filters.searchQuery.trim().length > 0
  );
};

export default filterSlice.reducer;

