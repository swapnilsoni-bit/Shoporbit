import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Check, X, BarChart3 } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();

  const handleRemove = (productId) => {
    removeFromComparison(productId);
  };

  if (!comparisonList || comparisonList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
          
          <div className="text-center py-20">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">No Products to Compare</h1>
            <p className="text-lg text-slate-600 mb-8">Start adding products to comparison to see side-by-side analysis</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Product Comparison</h1>
              <p className="text-slate-600 mt-2 text-lg">
                Analyzing <span className="font-semibold text-blue-600">{comparisonList.length}</span> product{comparisonList.length !== 1 ? 's' : ''}
              </p>
            </div>
            {comparisonList.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-6 py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="text-left py-6 px-6 font-bold text-base sticky left-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600">Features</th>
                  {comparisonList.map(product => (
                    <th key={product.id} className="text-center py-6 px-6 font-bold">
                      <div className="flex flex-col items-center gap-4 min-w-max">
                        <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-white">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                        <p className="text-sm line-clamp-2 max-w-xs text-white">{product.title}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Price Row */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-900 bg-slate-50 sticky left-0 z-10">
                    Price
                  </td>
                  {comparisonList.map(product => (
                    <td key={`price-${product.id}`} className="py-5 px-6 text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price?.toFixed(2) || 'N/A'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-900 bg-slate-50 sticky left-0 z-10">
                    Rating
                  </td>
                  {comparisonList.map(product => (
                    <td key={`rating-${product.id}`} className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">⭐</span>
                        <span className="font-bold text-slate-900">
                          {product.rating?.rate || 'N/A'}
                        </span>
                        <span className="text-sm text-slate-500">
                          ({product.rating?.count || 0})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-900 bg-slate-50 sticky left-0 z-10">
                    Category
                  </td>
                  {comparisonList.map(product => (
                    <td key={`category-${product.id}`} className="py-5 px-6 text-center">
                      <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold text-sm capitalize">
                        {product.category || 'N/A'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <td className="py-5 px-6 font-bold text-slate-900 bg-slate-50 sticky left-0 z-10">
                    Action
                  </td>
                  {comparisonList.map(product => (
                    <td key={`action-${product.id}`} className="py-5 px-6 text-center">
                      <button 
                        onClick={() => handleRemove(product.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2 mx-auto group"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Remove
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            {comparisonList.map((product, index) => (
              <div
                key={product.id}
                className={`p-6 border-b border-slate-200 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <div className="mb-4 flex flex-col items-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <h3 className="font-bold text-center line-clamp-2 text-slate-900">
                    {product.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Price:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${product.price?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">⭐</span>
                      <span className="font-bold text-slate-900">
                        {product.rating?.rate || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Category:</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold capitalize">
                      {product.category || 'N/A'}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
