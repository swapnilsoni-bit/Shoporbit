import React from 'react';
import { X } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import RatingDisplay from './RatingDisplay';

const ProductComparison = () => {
  const { comparisonList, removeFromComparison } = useComparison();

  if (comparisonList.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-600 font-medium">No products to compare</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b-2 border-slate-300">
            <th className="px-4 py-3 text-left font-bold text-slate-900">Feature</th>
            {comparisonList.map((product) => (
              <th key={product.id} className="px-4 py-3 text-left relative">
                <button
                  onClick={() => removeFromComparison(product.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="max-w-xs">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 object-contain mb-2"
                  />
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {product.title}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Price Row */}
          <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="px-4 py-3 font-semibold text-slate-700">Price</td>
            {comparisonList.map((product) => (
              <td key={product.id} className="px-4 py-3 text-slate-900 font-bold text-lg">
                ${product.price.toFixed(2)}
              </td>
            ))}
          </tr>

          {/* Rating Row */}
          <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="px-4 py-3 font-semibold text-slate-700">Rating</td>
            {comparisonList.map((product) => (
              <td key={product.id} className="px-4 py-3">
                <RatingDisplay
                  rate={product.rating?.rate || 0}
                  count={product.rating?.count || 0}
                  size="sm"
                />
              </td>
            ))}
          </tr>

          {/* Category Row */}
          <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="px-4 py-3 font-semibold text-slate-700">Category</td>
            {comparisonList.map((product) => (
              <td key={product.id} className="px-4 py-3 text-slate-900 capitalize">
                {product.category}
              </td>
            ))}
          </tr>

          {/* Description Row */}
          <tr className="hover:bg-slate-50">
            <td className="px-4 py-3 font-semibold text-slate-700 align-top">Description</td>
            {comparisonList.map((product) => (
              <td key={product.id} className="px-4 py-3">
                <p className="text-sm text-slate-700 line-clamp-3">
                  {product.description}
                </p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparison;
