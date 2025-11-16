'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Zap,
  Search,
  LogIn,
  ShoppingCart
} from 'lucide-react';
import PriceRangeFilter from '@/components/PriceRangeFilter';
import SortDropdown from '@/components/SortDropdown';
import RatingDisplay from '@/components/RatingDisplay';
import StockBadge from '@/components/StockBadge';
import Toast from '@/components/Toast';
import { useFilter } from '@/lib/hooks/reduxHooks';
import { useFilters } from '@/lib/hooks/useFilters';
import { useAuth } from '@/lib/hooks/reduxHooks';
import { useCart } from '@/lib/hooks/reduxHooks';
import { useAddToCartMutation } from '@/lib/hooks/useCartMutations';
import { Product } from '@/types';
import { staggerContainer, staggerItem, cardHover, buttonHover, buttonTap, fadeIn, slideUp } from '@/lib/utils/animations';

interface HomeProps {
  initialProducts: Product[];
  initialCategories: string[];
  initialError: string | null;
}

export default function Home({ initialProducts, initialCategories, initialError }: HomeProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<string[]>(initialCategories);
  const [error] = useState<string | null>(initialError);
  // No loading state - all data fetched on server!
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const { filters, resetFilters, hasActiveFilters, updateFilter } = useFilter();
  const { applyFilters } = useFilters();
  const { isGuest } = useAuth();
  const { addToCart } = useCart();
  const addToCartMutation = useAddToCartMutation(); // Optimistic updates

  // Track client-side mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
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

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleCategoryChange = (category: string) => {
    updateFilter('category', category === 'all' ? null : category);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShowMobileFilter(false);
  };

  // Handle Add to Cart (with guest check and optimistic updates)
  const handleAddToCart = (product: Product) => {
    if (isGuest) {
      setToast({
        message: '🔐 Login required to add items to cart',
        type: 'warning'
      });
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    // Use optimistic mutation for instant UI feedback
    addToCartMutation.mutate(
      { product, quantity: 1 },
      {
        onSuccess: () => {
          // Also update Redux for consistency
          addToCart(product, 1);
          setToast({
            message: `✓ ${product.title} added to cart!`,
            type: 'success'
          });
        },
        onError: () => {
          setToast({
            message: 'Failed to add to cart. Please try again.',
            type: 'error'
          });
        },
      }
    );
  };

  // Early return if no products and error (show error state)
  if (products.length === 0 && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Products</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 font-sans">
      {/* Compact Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Left: Title and Description - Aligned to left */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-300 font-semibold text-xs uppercase tracking-wide">
                    Premium Shopping
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 leading-tight whitespace-nowrap">
                  Discover Amazing{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    Products
                  </span>
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                  Shop our exclusive collection with advanced filters and smart search
                </p>
              </div>

              {/* Right: Stats Bar - Takes remaining space equally */}
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <div className="flex items-center justify-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex-1">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold text-sm">{products.length}+</span>
                  <span className="text-blue-200 text-xs">Products</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex-1">
                  <Search className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold text-sm">Smart</span>
                  <span className="text-blue-200 text-xs">Search</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex-1">
                  <ShoppingCart className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold text-sm">Fast</span>
                  <span className="text-blue-200 text-xs">Checkout</span>
                </div>
              </div>
            </div>
            
            {/* Guest Mode Notice - Compact */}
            {isMounted && isGuest && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2.5 bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/50 rounded-lg inline-block"
              >
                <p className="text-yellow-100 font-semibold flex items-center gap-2 text-sm">
                  👀 Browsing as Guest -{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="underline hover:no-underline font-bold text-yellow-200 hover:text-white transition-colors"
                  >
                    Login to Shop
                  </button>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 max-w-4xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border-2 border-slate-200 hover:border-blue-300 transition-all">
              <div className="flex items-center">
                <Search className="absolute left-6 w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search products by name, description, category..."
                  value={searchInput}
                  onChange={handleSearch}
                  className="w-full pl-16 pr-16 py-4 text-slate-900 font-medium text-lg rounded-2xl focus:outline-none placeholder:text-slate-400"
                />
                {searchInput && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={handleClearSearch}
                    className="absolute right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Category Filter Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-bold text-slate-900">Shop by Category</h4>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* All Products Button */}
            <motion.button
              onClick={() => handleCategoryChange('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-sm ${
                !filters.category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
              }`}
            >
              All Products
            </motion.button>

            {/* Category Buttons */}
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-sm capitalize ${
                  filters.category === category
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 hover:from-slate-100 hover:to-slate-200 hover:shadow-md border border-slate-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Filter Modal - ONLY SHOW ON TABLET AND MOBILE */}
        <AnimatePresence>
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 2xl:hidden">
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilter(false)}
              ></motion.div>

              {/* Filter Slide-in Panel */}
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Price Filter
                  </h3>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Price Filter */}
                <PriceRangeFilter
                  onPriceChange={() => setCurrentPage(1)}
                />

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
                      <p className="text-xs mt-1">
                        📁 Category: {filters.category}
                      </p>
                    )}
                    {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                      <p className="text-xs mt-1">
                        💰 Price: ${filters.minPrice} - ${filters.maxPrice}
                      </p>
                    )}
                    {filters.searchQuery && (
                      <p className="text-xs mt-1">
                        🔍 Search: "{filters.searchQuery}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>

        {/* Main Content - Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
          {/* Price Filter Sidebar - VISIBLE ONLY ON DESKTOP */}
          <div className="hidden 2xl:block 2xl:col-span-1">
            <div className="sticky top-16 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
              {/* Price Filter */}
              <PriceRangeFilter
                onPriceChange={() => setCurrentPage(1)}
              />

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
                    <p className="text-xs mt-1">
                      📁 Category: {filters.category}
                    </p>
                  )}
                  {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                    <p className="text-xs mt-1">
                      💰 Price: ${filters.minPrice} - ${filters.maxPrice}
                    </p>
                  )}
                  {filters.searchQuery && (
                    <p className="text-xs mt-1">
                      🔍 Search: "{filters.searchQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Area - Full Width */}
          <div className="2xl:col-span-4">
            {/* Enhanced Top Actions Bar */}
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-slate-200">
              <div className="flex items-center gap-4">
                {/* Filter Button - ONLY SHOW ON TABLET AND MOBILE */}
                <motion.button
                  onClick={() =>
                    setShowMobileFilter(!showMobileFilter)
                  }
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="2xl:hidden px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg shadow-blue-500/30 transition-all"
                >
                  <Filter className="w-4 h-4" />
                  Price Filter
                </motion.button>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-slate-700 font-semibold text-base sm:text-lg">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-extrabold text-xl">
                      {filteredProducts.length}
                    </span>{' '}
                    <span className="text-slate-600">products found</span>
                    {filters.category && (
                      <span className="text-slate-500"> in <span className="font-bold text-slate-700 capitalize">{filters.category}</span></span>
                    )}
                    {searchInput && (
                      <span className="text-slate-500"> for <span className="font-bold text-slate-700">"{searchInput}"</span></span>
                    )}
                  </p>
                </div>
              </div>
              <SortDropdown onSortChange={() => setCurrentPage(1)} />
            </div>

            {/* No loading state - all data fetched on server! */}
            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">
                ⚠️ {error}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                {/* Enhanced Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  {currentProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={cardHover}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300"
                    >
                      {/* Product Image - Clickable */}
                      <div
                        onClick={() => handleProductClick(product)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleProductClick(product);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View details for ${product.title}`}
                        className="relative h-72 bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100 overflow-hidden flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 group-hover:from-blue-50 group-hover:via-indigo-50/50 group-hover:to-purple-50 transition-all duration-300"
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-3"
                          loading="lazy"
                          quality={85}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          aria-label={`${product.title} product image`}
                        />
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/50">
                          <Zap className="w-3.5 h-3.5" />
                          NEW
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        {/* Title - Clickable */}
                        <h3
                          onClick={() => handleProductClick(product)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleProductClick(product);
                            }
                          }}
                          tabIndex={0}
                          role="link"
                          aria-label={`View details for ${product.title}`}
                          className="font-bold text-slate-900 text-lg line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded leading-tight"
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
                            stockCount={
                              // Deterministic stock count based on product ID to avoid hydration errors
                              ((product.id * 7) % 50) + 5
                            }
                          />
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-2xl text-slate-900">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-slate-500 line-through">
                              ${(product.price * 1.25).toFixed(2)}
                            </span>
                          </div>
                          <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full font-bold shadow-md">
                            Save 20%
                          </span>
                        </div>

                        {/* Add to Cart / Login Button */}
                        {!isMounted ? (
                          // Render a placeholder during SSR to prevent hydration mismatch
                          <div className="w-full px-4 py-3 bg-slate-200 rounded-lg font-bold flex items-center justify-center gap-2 animate-pulse">
                            <div className="w-5 h-5" />
                            <span className="text-slate-400">Loading...</span>
                          </div>
                        ) : isGuest ? (
                          <motion.button
                            onClick={() => {
                              setToast({
                                message:
                                  '🔐 Login required to add items to cart',
                                type: 'warning'
                              });
                              setTimeout(
                                () => router.push('/login'),
                                1500
                              );
                            }}
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                            className="w-full px-4 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transform hover:scale-[1.02]"
                          >
                            <LogIn className="w-5 h-5" />
                            Login to Buy
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() =>
                              handleAddToCart(product)
                            }
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                            aria-label={`Add ${product.title} to cart`}
                            className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02]"
                          >
                            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                            Add to Cart
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    className="flex items-center justify-center gap-2 mt-10 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      onClick={() =>
                        handlePageChange(
                          Math.max(1, currentPage - 1)
                        )
                      }
                      disabled={currentPage === 1}
                      whileHover={currentPage !== 1 ? buttonHover : {}}
                      whileTap={currentPage !== 1 ? buttonTap : {}}
                      className="p-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>

                    <div className="flex gap-2 flex-wrap">
                      {[...Array(totalPages)].map((_, i) => (
                        <motion.button
                          key={i + 1}
                          onClick={() =>
                            handlePageChange(i + 1)
                          }
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-12 h-12 rounded-xl font-bold transition-all ${
                            currentPage === i + 1
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-110'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md border border-slate-200'
                          }`}
                          title={`Go to page ${i + 1}`}
                        >
                          {i + 1}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      onClick={() =>
                        handlePageChange(
                          Math.min(totalPages, currentPage + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      whileHover={currentPage !== totalPages ? buttonHover : {}}
                      whileTap={currentPage !== totalPages ? buttonTap : {}}
                      className="p-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </>
            ) : (
              // No Results
              <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                <p className="text-slate-600 text-lg font-semibold mb-4">
                  No products found
                </p>
                <p className="text-slate-500 mb-6">
                  Try adjusting your filters or search query
                </p>
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

