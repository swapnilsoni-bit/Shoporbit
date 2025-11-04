import { useCallback } from 'react';
import { useComparison } from '../contexts/ComparisonContext';

export const useComparisonLogic = () => {
  const { comparisonList, addToComparison, removeFromComparison } = useComparison();

  const toggleComparison = useCallback(
    (product) => {
      const isInList = comparisonList.some(p => p.id === product.id);
      if (isInList) {
        removeFromComparison(product.id);
      } else {
        addToComparison(product);
      }
    },
    [comparisonList, addToComparison, removeFromComparison]
  );

  return { toggleComparison, comparisonList };
};
