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

// ✅ Header Component with Guest Mode Support
const Header = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { getComparisonCount } = useComparison();
  const { isAuthenticated, user, logout, isGuest } = useAuth();
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
    window.location.href = '/';
  };

  useEffect(() => {
    setShowSidebar(false);
  }, [location]);

  // ✅ Hide header on login page
  if (location.pathname === '/login') {
    return null;
  }

  // ✅ Show header for both guests and authenticated users
  if (!isAuthenticated && !isGuest) {
    return null;
  }

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Menu Button */}
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label="Toggle menu"
                >
                  {showSidebar ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              )}

              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
                <div className="h-10 w-10 rounded-lg shadow-lg bg-white flex items-center justify-center font-bold text-blue-600">
                  SO
                </div>
                <span className="font-bold text-lg text-white hidden sm:inline">ShopOrbit</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={`${isMobile ? 'hidden' : 'flex'} items-center gap-8`}>
              <Link to="/" className="hover:text-blue-100 font-medium transition">
                Shop
              </Link>
              <Link to="/wishlist" className="hover:text-blue-100 font-medium transition">
                Wishlist
              </Link>
              {!isGuest && (
                <Link to="/comparison" className="hover:text-blue-100 font-medium transition">
                  Compare
                </Link>
              )}
            </nav>

            {/* Right Icons & User Info */}
            <div className="flex items-center gap-6">
              {/* Comparison Icon (authenticated only) */}
              {!isGuest && (
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
              )}

              {/* Wishlist Icon */}
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

              {/* Cart Icon (authenticated only) */}
              {!isGuest && (
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
              )}

              {/* Guest Mode Badge */}
              {isGuest && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-full border border-yellow-400">
                  <span className="text-xs font-bold">👤 Guest</span>
                </div>
              )}

              {/* User Info & Logout (authenticated only) */}
              {!isGuest && user && (
                <>
                  {!isMobile && (
                    <div className="flex items-center gap-2 pl-6 border-l border-white/30">
                      <User className="w-5 h-5" />
                      <span className="font-semibold">{user.username || user.name}</span>
                    </div>
                  )}

                  {!isMobile && (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  )}
                </>
              )}

              {/* Login Button for Guests */}
              {isGuest && (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition"
                >
                  <User className="w-5 h-5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
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
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    SO
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">ShopOrbit</h3>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Guest Mode Notice */}
              {isGuest && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm font-semibold flex items-center gap-2">
                  <span>👀</span>
                  <span>Browsing as Guest</span>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold"
                  onClick={() => setShowSidebar(false)}
                >
                  <Home className="w-5 h-5" />
                  Home
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg font-semibold"
                  onClick={() => setShowSidebar(false)}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full px-2">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Comparison (authenticated only) */}
                {!isGuest && (
                  <Link
                    to="/comparison"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg font-semibold"
                    onClick={() => setShowSidebar(false)}
                  >
                    <BarChart3 className="w-5 h-5" />
                    Compare
                    {comparisonCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full px-2">
                        {comparisonCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Cart (authenticated only) */}
                {!isGuest && (
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg font-semibold"
                    onClick={() => setShowSidebar(false)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-yellow-400 text-slate-900 text-xs font-bold rounded-full px-2">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* User Profile or Login */}
              {!isGuest && user && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-8 h-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
                    <div>
                      <p className="font-bold text-slate-900">{user.username || user.name}</p>
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

              {/* Login for Guests */}
              {isGuest && (
                <Link
                  to="/login"
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-center block"
                  onClick={() => setShowSidebar(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ✅ Footer Component
const Footer = () => {
  const location = useLocation();

  // Hide footer on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-16 border-t border-slate-700">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                SO
              </div>
              <span className="font-bold text-lg">ShopOrbit</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium e-commerce platform with advanced filtering and product comparison.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition">
                  Wishlist
                </Link>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
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

          {/* Follow */}
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

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          <p className="text-center text-slate-400 text-sm">
            &copy; 2025 ShopOrbit. All rights reserved. | 
            <button type="button" className="hover:text-white ml-2 transition">
              Privacy Policy
            </button> | 
            <button type="button" className="hover:text-white ml-2 transition">
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
};

// ✅ Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires auth and user is guest, redirect
  if (requireAuth && isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Main App Content
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* Public Route - Login (no navbar/footer) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Public Routes - Guests can browse */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/wishlist" element={<WishListPage />} />

          {/* Protected Routes - Login required */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute requireAuth={true}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comparison"
            element={
              <ProtectedRoute requireAuth={true}>
                <ComparisonPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// ✅ Main App with Providers
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
