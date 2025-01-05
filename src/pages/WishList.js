import React, { useState } from 'react';
import { useWishlist } from '../contexts/WishListContext';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

function WishListPage() {
  const { wishlist, removeFromWishlist, addAllToCart } = useWishlist();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  const handleProductClick = (product) => {
    navigate(`/${product.title.toLowerCase().replace(/\s+/g, '-')}/${product.id}`, {
      state: { product },
    });
  };

  const handleShopAll = () => {
    if (wishlist.length > 0) {
      addAllToCart();
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
        navigate('/cart'); 
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Wish List</h1>

        {wishlist.length > 0 && (
          <button
            onClick={handleShopAll}
            className="mb-6 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-all duration-200"
          >
            Shop All
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow relative">
              <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-contain mb-4"
                />
                <h3 className="text-lg font-medium mb-2">{product.title}</h3>
                <p className="text-gray-900 font-semibold">${product.price}</p>
              </div>

              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-4 right-4 p-2"
              >
                <Heart className="w-6 h-6 fill-current" />
              </button>
            </div>
          ))}
        </div>

        {wishlist.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          </div>
        )}

        {showNotification && (
          <div 
          className="fixed top-14 right-5 bg-green-500 text-white py-2 px-6 rounded shadow-lg z-50 flex items-center justify-center transition-opacity duration-300">
            All items added to cart!
          </div>
        )}
      </div>
    </div>
  );
}

export default WishListPage;
