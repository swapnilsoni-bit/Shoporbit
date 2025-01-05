import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishListContext';
import { useProductDetails } from '../contexts/ProductDetailsContext';

function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, status, error, fetchProductDetails } = useProductDetails();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId, fetchProductDetails]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
      addToCart(product, quantity);
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
  };

  const handleWishlistToggle = () => {
    const userData = localStorage.getItem('user');  
    const token = userData ? JSON.parse(userData).token : null; 
  
    if (!token) {
      navigate('/login');  
    } else {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);  
      } else {
        addToWishlist(product);  
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-square relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart
                className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current text-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-3xl font-medium">{product.title}</h1>
            <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Quantity</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>

              <div className="text-sm text-gray-500 space-y-1">
                <p>Free standard shipping</p>
                <p>Free returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNotification && (
        <div
          className="fixed top-14 right-5 bg-green-500 text-white py-2 px-6 rounded shadow-lg z-50 flex items-center justify-center transition-opacity duration-300"
          style={{ opacity: showNotification ? 1 : 0 }}
        >
          <p className="text-sm font-medium">Added to cart</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsPage;
