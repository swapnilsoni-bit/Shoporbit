import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import ProductComparison from '../components/ProductComparison';

const ComparisonPage = () => {
  const navigate = useNavigate();
  const { comparisonList, clearComparison } = useComparison();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compare Products</h1>
            <p className="text-slate-600 mt-1">
              {comparisonList.length} product{comparisonList.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          {comparisonList.length > 0 && (
            <button
              onClick={clearComparison}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <ProductComparison />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
