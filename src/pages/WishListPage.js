import React, { useState } from 'react';
import { useWishlist } from '../contexts/WishListContext';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import Toast from '../components/Toast';

function WishListPage() {
  const { wishlist, removeFromWishlist, addAllToCart } = useWishlist();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    setToast({
      message: 'Removed from wishlist',
      type: 'info',
    });
  };

  const handleShopAll = () => {
    if (wishlist.length > 0) {
      addAllToCart();
      setToast({
        message: `${wishlist.length} items added to cart!`,
        type: 'success',
      });
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                <p className="text-slate-600 text-sm mt-1">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-slate-100 rounded-full mb-6">
              <Heart className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-600 mb-8 text-center max-w-md">
              Start adding your favorite items to your wishlist and they'll appear here
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-4px] border border-slate-100"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => handleProductClick(product)}
                    className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-4"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      onClick={() => handleProductClick(product)}
                      className="font-semibold text-slate-900 text-sm line-clamp-2 hover:text-red-600 cursor-pointer transition-colors mb-2"
                    >
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-slate-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProductClick(product)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shop All Button */}
            <div className="flex justify-center">
              <button
                onClick={handleShopAll}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                Add All to Cart
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
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

export default WishListPage;
