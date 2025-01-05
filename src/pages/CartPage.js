import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

const CartPage = () => {
  const { cart, removeFromCart, calculateSubtotal, emptyCart } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const shippingCost = 10;
  const subtotal = calculateSubtotal();
  const total = subtotal + shippingCost;
  const navigate = useNavigate();  

  const handleEmptyCart = () => {
    setShowConfirmModal(true);
  };

  const confirmEmptyCart = () => {
    emptyCart();
    setShowConfirmModal(false);
  };

 
  const handleCheckout = () => {
    const userData = localStorage.getItem('user');  
    const token = userData ? JSON.parse(userData).token : null;

    if (!token) {
     
      navigate('/login');
    } else {
    
      console.log('Proceeding to checkout');
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium">Your cart</h1>
          {cart.length > 0 && (
            <button
              onClick={handleEmptyCart}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Empty Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-500">Not ready to checkout? Continue Shopping</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 border-b">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">by Vendor Name</p>
                      </div>
                      <p className="font-medium">${item.product.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 space-y-4">
                <h2 className="text-lg font-medium">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout} 
                  className="w-full bg-black text-white py-3 rounded-full shadow-2xl hover:bg-gray-600 transition-all"
                >
                  Continue to Checkout
                </button>
              </div>

              {/* Order Information */}
              <div className="mt-8 space-y-4">
                <h3 className="font-medium">Order Information</h3>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>
                    This is our standard return policy which is everything you need to know
                    about our returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-red-50 mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Empty Your Cart</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmEmptyCart}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
              >
                Empty Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
