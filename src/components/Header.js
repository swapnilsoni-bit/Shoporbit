import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ showNotification }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const isActivePath = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md h-14">
      <div className="flex justify-between items-center h-full px-4 md:px-6">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleHomeClick}
          >
            <img
              src="/favicon.ico"
              alt="ShopOrbit Logo"
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="ml-2 text-base md:text-lg font-bold text-gray-800">
              ShopOrbit
            </span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Hamburger Menu for Mobile */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Right Section: Login/Logout Button */}
        <button
          onClick={handleLoginClick}
          className={`${
            isLoggedIn
              ? 'bg-red-600 hover:bg-red-500'
              : 'bg-blue-600 hover:bg-blue-500'
          } text-white py-1 px-4 rounded-md shadow-md transition-all font-medium`}
        >
          {isLoggedIn ? 'Sign Out' : 'Login'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <nav className="flex flex-col space-y-2 p-4">
            <button
              onClick={handleHomeClick}
              className={`transition-colors ${
                isActivePath('/home')
                  ? 'text-black font-bold'
                  : 'text-gray-500 hover:text-black font-medium'
              }`}
            >
              Home
            </button>
            <button
              onClick={handleCartClick}
              className={`transition-colors ${
                isActivePath('/cart')
                  ? 'text-black font-bold'
                  : 'text-gray-500 hover:text-black font-medium'
              }`}
            >
              Cart
            </button>
            <button
              onClick={handleWishListClick}
              className={`transition-colors ${
                isActivePath('/wishlist')
                  ? 'text-black font-bold'
                  : 'text-gray-500 hover:text-black font-medium'
              }`}
            >
              Wishlist
            </button>
          </nav>
        </div>
      )}

      {/* Notification */}
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
