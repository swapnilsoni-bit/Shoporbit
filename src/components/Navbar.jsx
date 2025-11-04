import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishListContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-white rounded-lg p-2">
              <span className="text-2xl font-bold text-blue-600">ShopOrbit</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{user?.name}</span>
                </div>

                {/* Wishlist */}
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition relative"
                  onClick={() => navigate('/wishlist')}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>

                {/* Cart */}
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition relative"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition"
          >
            {showMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4 space-y-3 pt-4 border-t border-blue-400">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{user?.name}</span>
                </div>

                <button
                  onClick={() => {
                    navigate('/wishlist');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-700 rounded-lg transition"
                >
                  <Heart className="w-5 h-5" />
                  Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                </button>

                <button
                  onClick={() => {
                    navigate('/cart');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-700 rounded-lg transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart {cart.length > 0 && `(${cart.length})`}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
