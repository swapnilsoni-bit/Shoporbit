import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useProductsDispatch } from '../contexts/ProductsContext';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();
  const {
    products,
    categories,
    selectedCategory,
    status,
    error,
    fetchProductsByCategory,
    fetchProducts,
  } = useProducts();
  const dispatch = useProductsDispatch();

  // Memoize pagination calculations
  const { totalPages, currentProducts } = useMemo(() => {
    const total = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const current = products.slice(startIndex, startIndex + productsPerPage);
    return { totalPages: total, currentProducts: current };
  }, [products, currentPage, productsPerPage]);

  const handleCategoryChange = async (category) => {
    if (selectedCategory === category) {
      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: null });
      await fetchProducts();
    } else {
      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
      await fetchProductsByCategory(category);
    }
    setCurrentPage(1);
  };

  const handleProductClick = (product) => {
    navigate(`/${product.title}/${product.id}`, { state: { product } });
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  );

  if (status === 'loading' && !selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                    disabled={status === 'loading' && selectedCategory}
                  />
                  <span
                    className={`text-gray-700 capitalize ${
                      status === 'loading' && selectedCategory ? 'text-gray-400' : ''
                    }`}
                  >
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {status === 'loading' && selectedCategory ? (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-contain rounded-lg mb-6"
                      loading="lazy"
                    />
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{product.title}</h3>
                    <p className="text-gray-700 text-lg">${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
