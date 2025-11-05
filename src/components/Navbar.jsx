import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, LogOut, Menu, X, User, BarChart3, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishListContext';
import { useComparison } from '../contexts/ComparisonContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isGuest } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { getComparisonCount } = useComparison();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl border-b-4 border-blue-500 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity group"
            onClick={() => {
              navigate('/');
              setShowMenu(false);
            }}
          >
            <div className="bg-white rounded-xl p-2 shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SO</span>
            </div>
            <span className="text-2xl font-bold hidden sm:inline">ShopOrbit</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">Home</span>
            </button>

            {isAuthenticated && !isGuest ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                  <User className="w-5 h-5" />
                  <span className="font-semibold text-sm">{user?.name || user?.username}</span>
                </div>

                {/* Comparison */}
                <button
                  onClick={() => navigate('/comparison')}
                  className="relative flex items-center gap-2 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all group"
                  title="Compare Products"
                >
                  <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm">Compare</span>
                  {getComparisonCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {getComparisonCount()}
                    </span>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => navigate('/wishlist')}
                  className="relative flex items-center gap-2 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all group"
                  title="View Wishlist"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm">Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative flex items-center gap-2 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all group"
                  title="View Cart"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Guest Mode - Can View Products & Wishlist & Comparison */}
                {isGuest && (
                  <>
                    {/* Comparison (Guests can view) */}
                    <button
                      onClick={() => navigate('/comparison')}
                      className="relative flex items-center gap-2 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all group"
                      title="Compare Products"
                    >
                      <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">Compare</span>
                      {getComparisonCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                          {getComparisonCount()}
                        </span>
                      )}
                    </button>

                    {/* Wishlist (Guests can view) */}
                    <button
                      onClick={() => navigate('/wishlist')}
                      className="relative flex items-center gap-2 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all group"
                      title="View Wishlist"
                    >
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">Wishlist</span>
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  </>
                )}

                {/* Login Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            aria-label="Toggle menu"
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
          <div className="md:hidden mt-4 space-y-2 pt-4 border-t-2 border-blue-400 pb-4 animate-in fade-in">
            {/* Home */}
            <button
              onClick={() => {
                navigate('/');
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all font-semibold"
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            {isAuthenticated && !isGuest ? (
              <>
                {/* User Info */}
                <div className="px-4 py-2 bg-white bg-opacity-10 rounded-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{user?.name || user?.username}</span>
                </div>

                {/* Comparison Mobile */}
                <button
                  onClick={() => {
                    navigate('/comparison');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all font-semibold relative"
                >
                  <BarChart3 className="w-5 h-5" />
                  Compare
                  {getComparisonCount() > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {getComparisonCount()}
                    </span>
                  )}
                </button>

                {/* Wishlist Mobile */}
                <button
                  onClick={() => {
                    navigate('/wishlist');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all font-semibold"
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart Mobile */}
                <button
                  onClick={() => {
                    navigate('/cart');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all font-semibold"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                  {cart.length > 0 && (
                    <span className="ml-auto bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Logout Mobile */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Guest Mode Mobile */}
                {isGuest && (
                  <>
                    {/* Comparison Mobile */}
                    <button
                      onClick={() => {
                        navigate('/comparison');
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all font-semibold relative"
                    >
                      <BarChart3 className="w-5 h-5" />
                      Compare
                      {getComparisonCount() > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                          {getComparisonCount()}
                        </span>
                      )}
                    </button>

                    {/* Wishlist Mobile */}
                    <button
                      onClick={() => {
                        navigate('/wishlist');
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all font-semibold"
                    >
                      <Heart className="w-5 h-5" />
                      Wishlist
                      {wishlist.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                          {wishlist.length}
                        </span>
                      )}
                    </button>

                    {/* Notification */}
                    <div className="px-4 py-3 bg-yellow-500 bg-opacity-20 border-l-4 border-yellow-400 rounded text-sm font-semibold">
                      📝 Login to add items to cart
                    </div>
                  </>
                )}

                {/* Login Mobile */}
                <button
                  onClick={() => {
                    navigate('/login');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Login / Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
