import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2, ArrowRight, AlertCircle, ShoppingCart, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth(); // ✅ REMOVED: isAuthenticated (unused)
  const { cart, removeFromCart, calculateSubtotal, emptyCart } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState(null);

  // ✅ Redirect guests to login
  useEffect(() => {
    if (isGuest) {
      setToast({
        message: '🔐 Please login to access cart',
        type: 'warning'
      });
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [isGuest, navigate]);

  // ✅ If guest, show locked message
  if (isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="p-4 bg-red-100 rounded-full mx-auto mb-6 w-fit">
            <Lock className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Cart Access Locked</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Please login or register to view and manage your shopping cart.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Go to Login
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = 10;
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      setToast({
        message: 'Add items to cart before checkout',
        type: 'warning'
      });
      return;
    }
    console.log('Proceeding to checkout with', cart.length, 'items');
    setToast({
      message: '✓ Checkout process started!',
      type: 'success'
    });
    // Navigate to checkout page when ready
    // navigate('/checkout');
  };

  const handleRemoveItem = (productId, productTitle) => {
    removeFromCart(productId);
    setToast({
      message: `🗑️ ${productTitle} removed from cart`,
      type: 'info'
    });
  };

  const handleConfirmEmptyCart = () => {
    emptyCart();
    setShowConfirmModal(false);
    setToast({
      message: '✓ Cart cleared successfully',
      type: 'success'
    });
  };

  // ✅ Empty cart state
  if (cart.length === 0 && !showConfirmModal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="p-4 bg-slate-100 rounded-full mx-auto mb-6 w-fit">
            <ShoppingCart className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Ready to find your perfect products? Let's go shopping!
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
              <p className="text-slate-600 mt-1">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center gap-2"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items Column */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex gap-6 items-start flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-contain p-3 hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between min-h-28">
                      <div
                        className="cursor-pointer"
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      >
                        <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                          {item.product.title}
                        </h3>
                        <p className="text-slate-600 text-sm">Category: {item.product.category}</p>
                      </div>

                      {/* Price */}
                      <p className="text-slate-700 font-semibold text-lg">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Right Side - Quantity & Delete */}
                    <div className="flex flex-col items-end justify-between min-h-28 gap-4 w-full sm:w-auto">
                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          handleRemoveItem(item.product.id, item.product.title)
                        }
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 transform hover:scale-110"
                        title="Remove from cart"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      {/* Quantity Display */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 px-4 py-3 bg-white border-2 border-blue-400 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Qty
                          </p>
                          <p className="text-center text-2xl font-bold text-blue-600">
                            {item.quantity}
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="text-center">
                          <p className="text-xs text-slate-600 font-medium">Total</p>
                          <p className="font-bold text-slate-900 text-lg">
                            ${(
                              parseFloat(item.product.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Return Policy Info */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Easy Returns & Support
                </h4>
                <p className="text-blue-700 text-sm">
                  30-day money-back guarantee on all items. Free shipping on
                  orders over $50.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 sticky top-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Order Summary
              </h2>

              {/* Breakdown */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                {/* Continue Shopping Button */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                >
                  Continue Shopping
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full text-red-600 py-2 font-semibold hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Clear Cart
                </button>
              </div>

              {/* Guarantee Badge */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <div className="text-green-600 font-bold text-2xl">✓</div>
                <div>
                  <p className="text-sm text-green-700 font-semibold">
                    Money-Back Guarantee
                  </p>
                  <p className="text-xs text-green-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in scale-in-95">
            <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Clear Cart?
            </h2>
            <p className="text-slate-600 text-center mb-6">
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEmptyCart}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

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
};

export default CartPage;
