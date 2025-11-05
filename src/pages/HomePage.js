import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, X, Zap, Search, LogIn, ShoppingCart } from 'lucide-react';
import fakeStoreAPI from '../utils/fakeStoreAPI';
import PriceRangeFilter from '../components/PriceRangeFilter';
import SortDropdown from '../components/SortDropdown';
import RatingDisplay from '../components/RatingDisplay';
import StockBadge from '../components/StockBadge';
import Toast from '../components/Toast';
import { useFilter } from '../contexts/FilterContext';
import { useFilters } from '../hooks/useFilters';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { APP_CONFIG } from '../utils/constants';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();
  const { filters, resetFilters, hasActiveFilters, updateFilter } = useFilter();
  const { applyFilters } = useFilters();
  const { isAuthenticated, isGuest } = useAuth(); // ✅ NEW - Get auth state
  const { addToCart } = useCart(); // ✅ NEW - Get cart function

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fakeStoreAPI.getAllProducts(APP_CONFIG.PRODUCTS_LIMIT),
          fakeStoreAPI.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData || []);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // SCROLL TO TOP when page or filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, filters]);

  // Apply filters
  const filteredProducts = applyFilters(products);
  const productsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const endIdx = startIdx + productsPerPage;
  const currentProducts = filteredProducts.slice(startIdx, endIdx);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleCategoryChange = (category) => {
    updateFilter('category', category === 'all' ? null : category);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    updateFilter('searchQuery', value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateFilter('searchQuery', '');
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    resetFilters();
    setSearchInput('');
    setCurrentPage(1);
    setToast({ message: 'Filters cleared', type: 'info' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowMobileFilter(false);
  };

  // ✅ NEW - Handle Add to Cart (with guest check)
  const handleAddToCart = (product) => {
    if (isGuest) {
      setToast({ 
        message: '🔐 Login required to add items to cart', 
        type: 'warning' 
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    addToCart(product, 1);
    setToast({ 
      message: `✓ ${product.title} added to cart!`, 
      type: 'success' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Discover Amazing Products</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Shop our exclusive collection with advanced filters, search, and smart sorting features
          </p>
          {/* ✅ NEW - Guest Mode Notice */}
          {isGuest && (
            <div className="mt-4 p-3 bg-yellow-400 bg-opacity-20 border border-yellow-300 rounded-lg inline-block">
              <p className="text-yellow-100 font-semibold flex items-center gap-2">
                👀 Browsing as Guest - <button onClick={() => navigate('/login')} className="underline hover:no-underline">Login to Shop</button>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6 max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, description, category..."
              value={searchInput}
              onChange={handleSearch}
              className="w-full pl-12 pr-12 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-slate-900 font-medium"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Row */}
        <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Categories</h4>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {/* All Products Button */}
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
                !filters.category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              All Products
            </button>

            {/* Category Buttons */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm capitalize ${
                  filters.category === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Modal - ONLY SHOW ON TABLET AND MOBILE */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 2xl:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setShowMobileFilter(false)}
            ></div>

            {/* Filter Slide-in Panel */}
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Price Filter</h3>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Price Filter */}
                <PriceRangeFilter onPriceChange={() => setCurrentPage(1)} />

                {/* Clear Filters */}
                {hasActiveFilters() && (
                  <button
                    onClick={() => {
                      handleClearFilters();
                      setShowMobileFilter(false);
                    }}
                    className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}

                {/* Active Filters Info */}
                {hasActiveFilters() && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                    <p className="font-medium">Active filters:</p>
                    {filters.category && (
                      <p className="text-xs mt-1">📁 Category: {filters.category}</p>
                    )}
                    {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                      <p className="text-xs mt-1">💰 Price: ${filters.minPrice} - ${filters.maxPrice}</p>
                    )}
                    {filters.searchQuery && (
                      <p className="text-xs mt-1">🔍 Search: "{filters.searchQuery}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
          {/* Price Filter Sidebar - VISIBLE ONLY ON DESKTOP */}
          <div className="hidden 2xl:block 2xl:col-span-1">
            <div className="sticky top-16 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
              {/* Price Filter */}
              <PriceRangeFilter onPriceChange={() => setCurrentPage(1)} />

              {/* Clear Filters */}
              {hasActiveFilters() && (
                <button
                  onClick={() => handleClearFilters()}
                  className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}

              {/* Active Filters */}
              {hasActiveFilters() && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 mt-4">
                  <p className="font-medium">Active filters:</p>
                  {filters.category && (
                    <p className="text-xs mt-1">📁 Category: {filters.category}</p>
                  )}
                  {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                    <p className="text-xs mt-1">💰 Price: ${filters.minPrice} - ${filters.maxPrice}</p>
                  )}
                  {filters.searchQuery && (
                    <p className="text-xs mt-1">🔍 Search: "{filters.searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Area - Full Width */}
          <div className="2xl:col-span-4">
            {/* Top Actions Bar */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Filter Button - ONLY SHOW ON TABLET AND MOBILE */}
                <button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="2xl:hidden px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Filter className="w-4 h-4" />
                  Price Filter
                </button>
                <p className="text-slate-700 font-semibold text-sm sm:text-base">
                  <span className="text-blue-600 font-bold">{filteredProducts.length}</span> products
                  {filters.category && ` in ${filters.category}`}
                  {searchInput && ` for "${searchInput}"`}
                </p>
              </div>
              <SortDropdown onSortChange={() => setCurrentPage(1)} />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-600 font-medium">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">
                ⚠️ {error}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-6px] border border-slate-100"
                    >
                      {/* Product Image - Clickable */}
                      <div 
                        onClick={() => handleProductClick(product)}
                        className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-3"
                        />
                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          NEW
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title - Clickable */}
                        <h3 
                          onClick={() => handleProductClick(product)}
                          className="font-bold text-slate-900 text-base line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="mb-3">
                          <RatingDisplay
                            rate={product.rating?.rate || 0}
                            count={product.rating?.count || 0}
                            size="sm"
                            showCount={true}
                          />
                        </div>

                        {/* Stock */}
                        <div className="mb-4">
                          <StockBadge 
                            inStock={true} 
                            stockCount={Math.floor(Math.random() * 50) + 5} 
                          />
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-lg text-slate-900">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded font-bold">
                            Save 20%
                          </span>
                        </div>

                        {/* ✅ NEW - Add to Cart / Login Button */}
                        {isGuest ? (
                          <button
                            onClick={() => {
                              setToast({ 
                                message: '🔐 Login required to add items to cart', 
                                type: 'warning' 
                              });
                              setTimeout(() => navigate('/login'), 1500);
                            }}
                            className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                          >
                            <LogIn className="w-5 h-5" />
                            Login to Buy
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2 flex-wrap">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                          title={`Go to page ${i + 1}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              // No Results
              <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                <p className="text-slate-600 text-lg font-semibold mb-4">No products found</p>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
