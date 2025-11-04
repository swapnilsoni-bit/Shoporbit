import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const StockBadge = ({ inStock = true, stockCount = null }) => {
  if (inStock) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full border border-green-300">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-xs font-semibold text-green-700">
          {stockCount ? `${stockCount} in stock` : 'In Stock'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-full border border-red-300">
      <AlertCircle className="w-4 h-4 text-red-600" />
      <span className="text-xs font-semibold text-red-700">Out of Stock</span>
    </div>
  );
};

export default StockBadge;
