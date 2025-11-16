'use client';

import { useState, useEffect } from 'react';
import { useFilter } from '@/lib/hooks/reduxHooks';
import { clientFakeStoreAPI } from '@/lib/api/client-api';

interface CategoryFilterProps {
  onCategoryChange?: () => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters, updateFilter } = useFilter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await clientFakeStoreAPI.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (category: string) => {
    updateFilter('category', category === 'all' ? null : category);
    onCategoryChange?.();
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Loading categories...</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-slate-900 text-lg">Categories</h3>

      {/* All Categories Button */}
      <button
        onClick={() => handleCategoryChange('all')}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all text-left ${
          !filters.category
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
        }`}
      >
        ✓ All Products
      </button>

      {/* Category Buttons */}
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all text-left capitalize flex items-center justify-between group ${
              filters.category === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            <span>{category}</span>
            {filters.category === category && (
              <span className="text-sm">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

