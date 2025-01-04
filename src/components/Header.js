import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ showNotification }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track current route
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleHomeClick = () => navigate('/home');
  const handleCartClick = () => navigate('/cart');
  const handleWishListClick = () => navigate('/wishlist');
  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  // Helper function to determine if a path is active
  const isActivePath = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md h-12">
      <div className="flex justify-between items-center h-full px-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center cursor-pointer" onClick={handleHomeClick}>
            <img
              src="/favicon.ico"
              alt="ShopOrbit Logo"
              className="w-10 h-10"
            />
            <span className="ml-2 text-lg font-bold text-gray-800">ShopOrbit</span>
          </div>

          <nav className="hidden md:flex space-x-4">
            <button
              onClick={handleHomeClick}
              className={`transition-colors ${
                isActivePath('/home')
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-gray-500 hover:text-black font-medium'
              }`}
            >
              Home
            </button>
            <button
              onClick={handleCartClick}
              className={`transition-colors ${
                isActivePath('/cart')
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-gray-500 hover:text-black font-medium'
              }`}
            >
              Cart
            </button>
            <button
              onClick={handleWishListClick}
              className={`transition-colors ${
                isActivePath('/wishlist')
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-gray-500 hover:text-black font-medium'
              }`}
            >
              Wishlist
            </button>
          </nav>
        </div>

        <button
          onClick={handleLoginClick}
          className={`${
            isLoggedIn ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
          } text-white py-1 px-4 rounded-md shadow-md transition-all font-medium`}
        >
          {isLoggedIn ? 'Sign Out' : 'Login'}
        </button>
      </div>

      {showNotification && (
        <div
          className="fixed top-16 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-2xl transition-opacity duration-300"
          style={{ opacity: showNotification ? 1 : 0 }}
        >
          <p>Product added to cart!</p>
        </div>
      )}
    </header>
  );
};

export default Header;