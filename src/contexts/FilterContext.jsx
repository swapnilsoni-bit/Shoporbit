import React, { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    category: null,
    searchQuery: '',
    sortBy: 'asc',
  });

  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  const updateMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      category: null,
      searchQuery: '',
      sortBy: 'asc',
    });
  }, []);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.minPrice > 0 ||
      filters.maxPrice < 1000 ||
      filters.minRating > 0 ||
      filters.category ||
      filters.searchQuery.trim().length > 0
    );
  }, [filters]);

  const value = {
    filters,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
    hasActiveFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider');
  }
  return context;
};
