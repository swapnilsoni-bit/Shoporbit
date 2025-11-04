import React, { createContext, useContext, useState, useCallback } from 'react';
import { COMPARISON_MAX_ITEMS } from '../utils/constants';

const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [comparisonList, setComparisonList] = useState(() => {
    try {
      const saved = localStorage.getItem('comparison_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToComparison = useCallback((product) => {
    setComparisonList(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      if (prev.length >= COMPARISON_MAX_ITEMS) return prev;

      const updated = [...prev, product];
      localStorage.setItem('comparison_list', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromComparison = useCallback((productId) => {
    setComparisonList(prev => {
      const updated = prev.filter(p => p.id !== productId);
      localStorage.setItem('comparison_list', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
    localStorage.removeItem('comparison_list');
  }, []);

  const isInComparison = useCallback((productId) => {
    return comparisonList.some(p => p.id === productId);
  }, [comparisonList]);

  const getComparisonCount = useCallback(() => {
    return comparisonList.length;
  }, [comparisonList]);

  const value = {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonCount,
    maxItems: COMPARISON_MAX_ITEMS,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};
