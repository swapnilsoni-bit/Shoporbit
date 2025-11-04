import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useFilter } from '../contexts/FilterContext';

const SearchBar = ({ onSearch, placeholder = 'Search products...' }) => {
  const { filters, updateFilter } = useFilter();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(
    (e) => {
      const query = e.target.value;
      updateFilter('searchQuery', query);
      onSearch?.(query);
    },
    [updateFilter, onSearch]
  );

  const handleClear = useCallback(() => {
    updateFilter('searchQuery', '');
    onSearch?.('');
  }, [updateFilter, onSearch]);

  return (
    <div className={`relative flex items-center gap-2 bg-white rounded-lg px-4 py-3 border-2 transition-all ${
      isFocused ? 'border-blue-600 shadow-lg' : 'border-slate-200'
    }`}>
      <Search className="w-5 h-5 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={filters.searchQuery}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 outline-none text-slate-900 placeholder-slate-400 text-sm"
      />
      {filters.searchQuery && (
        <button
          onClick={handleClear}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
