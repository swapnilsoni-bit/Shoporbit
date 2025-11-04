import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishListContext';
import { FilterProvider } from './contexts/FilterContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ShoppingCart, Heart, BarChart3, LogOut, User, Menu, X, Home } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import WishListPage from './pages/WishListPage';
import LoginPage from './pages/LoginPage';
import ComparisonPage from './pages/ComparisonPage';

// Hooks
import { useCart } from './contexts/CartContext';
import { useWishlist } from './contexts/WishListContext';
import { useComparison } from './contexts/ComparisonContext';

const Header = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { getComparisonCount } = useComparison();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024 && showSidebar) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const comparisonCount = getComparisonCount();

  const handleLogout = () => {
    logout();
    setShowSidebar(false);
    window.location.href = '/login';
  };

  useEffect(() => {
    setShowSidebar(false);
  }, [location]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  {showSidebar ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              )}

              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
                <img 
                  src="/favicon.ico" 
                  alt="ShopOrbit Logo" 
                  className="h-10 w-10 rounded-lg shadow-lg object-cover bg-white"
                />
                <span className="font-bold text-lg text-white hidden sm:inline">ShopOrbit</span>
              </Link>
            </div>

            <nav className={`${isMobile ? 'hidden' : 'flex'} items-center gap-8`}>
              <Link to="/" className="hover:text-blue-100 font-medium transition">
                Shop
              </Link>
              <Link to="/wishlist" className="hover:text-blue-100 font-medium transition">
                Wishlist
              </Link>
              <Link to="/comparison" className="hover:text-blue-100 font-medium transition">
                Compare
              </Link>
            </nav>

            <div className="flex items-center gap-6">
              <Link
                to="/comparison"
                className="relative p-2 hover:bg-white/10 rounded-lg transition"
                title="Comparison"
              >
                <BarChart3 className="w-6 h-6" />
                {comparisonCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {comparisonCount}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className="relative p-2 hover:bg-white/10 rounded-lg transition"
                title="Wishlist"
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 hover:bg-white/10 rounded-lg transition"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {!isMobile && user && (
                <div className="flex items-center gap-2 pl-6 border-l border-white/30">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{user.username}</span>
                </div>
              )}

              {!isMobile && user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showSidebar && isMobile && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />

          <div className="fixed left-0 top-0 bottom-0 w-72 max-w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img 
                    src="/favicon.ico" 
                    alt="ShopOrbit Logo" 
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                  <h3 className="text-lg font-bold text-slate-900">ShopOrbit</h3>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-3">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg"
                  onClick={() => setShowSidebar(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-semibold">Home</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg"
                  onClick={() => setShowSidebar(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/comparison"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg"
                  onClick={() => setShowSidebar(false)}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-semibold">Compare</span>
                  {comparisonCount > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2">
                      {comparisonCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg"
                  onClick={() => setShowSidebar(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold">Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-yellow-400 text-slate-900 text-xs font-bold rounded-full px-2">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {user && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-8 h-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
                    <div>
                      <p className="font-bold text-slate-900">{user.username}</p>
                      <p className="text-sm text-slate-600">User Profile</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/favicon.ico" 
                alt="ShopOrbit Logo" 
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="font-bold text-lg">ShopOrbit</span>
            </div>
            <p className="text-slate-400 text-sm">
              Premium e-commerce platform with advanced filtering and product comparison.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <button 
                  type="button"
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Returns
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <button 
                  type="button"
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Facebook
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Twitter
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Instagram
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; 2025 ShopOrbit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProtectedRoute>
                <ProductDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comparison"
            element={
              <ProtectedRoute>
                <ComparisonPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <FilterProvider>
              <ReviewProvider>
                <ComparisonProvider>
                  <AppContent />
                </ComparisonProvider>
              </ReviewProvider>
            </FilterProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
