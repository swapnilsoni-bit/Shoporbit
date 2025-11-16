'use client';

import { ChevronDown } from 'lucide-react';
import { useFilter } from '@/lib/hooks/reduxHooks';
import { SORT_OPTIONS } from '@/lib/utils/constants';

interface SortDropdownProps {
  onSortChange?: (value?: string) => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
  const { filters, updateFilter } = useFilter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateFilter('sortBy', value);
    onSortChange?.(value);
  };

  return (
    <div className="relative">
      <select
        value={filters.sortBy}
        onChange={handleSortChange}
        className="w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none cursor-pointer transition-all"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
  );
}

