import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useProductsDispatch } from '../contexts/ProductsContext';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

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
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  );

  if (status === 'loading' && !selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <p className="text-red-500 text-xl mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Products</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Filter className="w-6 h-6 mr-2" />
                Filters
              </h2>
              <div>
                <h3 className="font-semibold mb-4 text-lg">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                        className="rounded text-blue-500 focus:ring-blue-500 h-5 w-5"
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
          </div>

          <div className="flex-1">
            {status === 'loading' && selectedCategory ? (
              <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="aspect-w-1 aspect-h-1 mb-6">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-contain rounded-lg"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 h-14">{product.title}</h3>
                      <p className="text-gray-700 text-2xl font-semibold">${product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === index + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

