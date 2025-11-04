import React, { useState, useEffect } from 'react';
import { useFilter } from '../contexts/FilterContext';
import { APP_CONFIG } from '../utils/constants';

const PriceRangeFilter = ({ onPriceChange }) => {
  const { filters, updateFilter } = useFilter();
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  useEffect(() => {
    setLocalMin(filters.minPrice);
    setLocalMax(filters.maxPrice);
  }, [filters]);

  const handleMinChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value <= localMax) {
      setLocalMin(value);
      updateFilter('minPrice', value);
      onPriceChange?.(value, localMax);
    }
  };

  const handleMaxChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= localMin) {
      setLocalMax(value);
      updateFilter('maxPrice', value);
      onPriceChange?.(localMin, value);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-900 text-lg">Price Range</h3>

      {/* Display Values */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-blue-600">${localMin.toFixed(0)}</span>
        <span className="text-slate-500">to</span>
        <span className="font-semibold text-blue-600">${localMax.toFixed(0)}</span>
      </div>

      {/* Min Price Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Min Price</label>
        <input
          type="range"
          min={APP_CONFIG.MIN_PRICE}
          max={APP_CONFIG.MAX_PRICE}
          value={localMin}
          onChange={handleMinChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Max Price</label>
        <input
          type="range"
          min={APP_CONFIG.MIN_PRICE}
          max={APP_CONFIG.MAX_PRICE}
          value={localMax}
          onChange={handleMaxChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Input Fields */}
      <div className="flex gap-3 mt-4">
        <div className="flex-1">
          <input
            type="number"
            min={APP_CONFIG.MIN_PRICE}
            max={localMax}
            value={localMin}
            onChange={(e) => handleMinChange({ target: { value: e.target.value } })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Min"
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            min={localMin}
            max={APP_CONFIG.MAX_PRICE}
            value={localMax}
            onChange={(e) => handleMaxChange({ target: { value: e.target.value } })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
