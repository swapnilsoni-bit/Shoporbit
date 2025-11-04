import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishListContext';
import { useComparison } from '../contexts/ComparisonContext';
import { 
  Heart, ShoppingCart, Truck, RotateCcw, Shield, 
  ArrowLeft, BarChart3, Star, LoaderCircle, X 
} from 'lucide-react';
import fakeStoreAPI from '../utils/fakeStoreAPI';
import Toast from '../components/Toast';
import RatingDisplay from '../components/RatingDisplay';
import ReviewForm from '../components/ReviewForm';
import ReviewSection from '../components/ReviewSection';
import RelatedProducts from '../components/RelatedProducts';
import StockBadge from '../components/StockBadge';


function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Cart, Wishlist, Comparison Context
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison, getComparisonCount } = useComparison();

  // Product States
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('reviews');

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await fakeStoreAPI.getProduct(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Cart Handlers
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setToast({ message: `✓ Added ${quantity} item(s) to cart!`, type: 'success' });
    setQuantity(1);
  };

  // Wishlist Handlers
  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setToast({ message: '✓ Removed from wishlist', type: 'info' });
    } else {
      addToWishlist(product);
      setToast({ message: '✓ Added to wishlist!', type: 'success' });
    }
  };

  // Comparison Handlers
  const handleComparison = () => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
      setToast({ message: '✓ Removed from comparison', type: 'info' });
    } else {
      if (getComparisonCount() >= 3) {
        setToast({ message: '⚠️ Maximum 3 products in comparison', type: 'warning' });
      } else {
        addToComparison(product);
        setToast({ message: '✓ Added to comparison!', type: 'success' });
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="space-y-6 text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
          <LoaderCircle className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          <p className="text-xl text-slate-900 font-semibold">Loading product details...</p>
          <p className="text-slate-500 font-medium">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  // Error/Not Found State
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100">
          <Star className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-600 mb-8 text-lg">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-4px] transition-transform" />
            Back to Products
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image - HEIGHT KEPT SAME */}
          <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 min-h-[400px] shadow-lg border border-slate-300">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-96 object-contain drop-shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Title - TEXT SIZE REDUCED */}
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-slate-900 mb-3 leading-snug">
                {product.title}
              </h1>

              {/* Category */}
              <div className="mb-4 inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                {product.category}
              </div>

              {/* Rating */}
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <RatingDisplay
                  rate={product.rating?.rate || 0}
                  count={product.rating?.count || 0}
                  size="md"
                  showCount={true}
                />
              </div>

              {/* Price */}
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-bold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-slate-500 line-through">
                    ${(product.price * 1.25).toFixed(2)}
                  </span>
                  <span className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold">
                    Save 20%
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-green-700 font-bold text-sm flex items-center gap-2">
                    ✓ In Stock
                  </p>
                  <p className="text-slate-600 text-sm">Free shipping on orders over $50</p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About this product</h3>
                  <p className="text-slate-700 text-base leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Free Shipping</h4>
                    <p className="text-slate-600 text-xs mt-1">Orders over $50</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                  <RotateCcw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Free Returns</h4>
                    <p className="text-slate-600 text-xs mt-1">30-day policy</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Secure Payment</h4>
                    <p className="text-slate-600 text-xs mt-1">SSL encrypted</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-4 border-t-2 border-slate-200 pt-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-700 whitespace-nowrap">Quantity:</span>
                <div className="flex items-center border-2 border-slate-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 transition font-bold text-lg"
                    title="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center font-bold text-slate-900 border-l-2 border-r-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 transition font-bold text-lg"
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className={`px-4 py-3.5 rounded-lg font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                    isInWishlist(product.id)
                      ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Compare Button */}
                <button
                  onClick={handleComparison}
                  className={`px-4 py-3.5 rounded-lg font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                    isInComparison(product.id)
                      ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Add to comparison"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Reviews & Ratings
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'related'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Related Products
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ReviewForm productId={product.id} />
                <ReviewSection productId={product.id} />
              </div>
            )}

            {activeTab === 'related' && (
              <RelatedProducts
                currentProduct={product}
                onProductClick={(prod) => {
                  setProduct(prod);
                  navigate(`/product/${prod.id}`);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
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
}

export default ProductDetailsPage;
