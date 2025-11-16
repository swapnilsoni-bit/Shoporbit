'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, BarChart3, LogOut, User, Menu, X, Home } from 'lucide-react';
import { useCart } from '@/lib/hooks/reduxHooks';
import { useWishlist } from '@/lib/hooks/reduxHooks';
import { useComparison } from '@/lib/hooks/reduxHooks';
import { useAuth } from '@/lib/hooks/reduxHooks';
import { slideDown, fadeIn, buttonHover, buttonTap } from '@/lib/utils/animations';

function HeaderContent({ pathname }: { pathname: string | null }) {
  const { cart, cartCount } = useCart();
  const { wishlist, wishlistCount } = useWishlist();
  const { getComparisonCount } = useComparison();
  const { user, logout, isGuest } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Track client-side mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024 && showSidebar) {
        setShowSidebar(false);
      }
    };

    setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  const comparisonCount = getComparisonCount();

  const handleLogout = () => {
    logout();
    setShowSidebar(false);
    window.location.href = '/home';
  };

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  // During SSR, render header with safe defaults to prevent hydration mismatch
  // After mount, use actual auth state
  const shouldShowHeader = isMounted ? (user || isGuest) : true;
  
  if (!shouldShowHeader) {
    return null;
  }

  return (
    <>
      <motion.header 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
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

              <Link href="/home" className="flex items-center gap-2 hover:opacity-90 transition">
                <Image
                  src="/favicon.ico"
                  alt="ShopOrbit Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg shadow-lg object-cover bg-white"
                  priority
                />
                <span className="font-bold text-lg text-white hidden sm:inline">ShopOrbit</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={`${isMobile ? 'hidden' : 'flex'} items-center gap-8`}>
              <Link href="/home" className="hover:text-blue-100 font-medium transition flex items-center gap-2">
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link href="/wishlist" className="hover:text-blue-100 font-medium transition">
                Wishlist
              </Link>
              <Link href="/comparison" className="hover:text-blue-100 font-medium transition">
                Compare
              </Link>
            </nav>

            {/* Right Icons & User Info */}
            <div className="flex items-center gap-6">
              {/* Comparison Icon (accessible to all, guests will be redirected) */}
              <Link
                href="/comparison"
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

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
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
                  href="/cart"
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
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition"
                >
                  <User className="w-5 h-5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && isMobile && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSidebar(false)}
          />

          <motion.div 
            className="fixed left-0 top-0 bottom-0 w-72 max-w-full bg-white shadow-xl overflow-y-auto"
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6 space-y-6">
              {/* Logo in Sidebar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Image
                    src="/favicon.ico"
                    alt="ShopOrbit Logo"
                    width={32}
                    height={32}
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

              {/* Guest Mode Notice */}
              {isGuest && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm font-semibold flex items-center gap-2">
                  <span>👀</span>
                  <span>Browsing as Guest</span>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href="/home"
                  className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold"
                  onClick={() => setShowSidebar(false)}
                >
                  <Home className="w-5 h-5" />
                  Home
                </Link>

                {/* Comparison (accessible to all) */}
                <Link
                  href="/comparison"
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

                <Link
                  href="/wishlist"
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

                {/* Cart (authenticated only) */}
                {!isGuest && (
                  <Link
                    href="/cart"
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
                  href="/login"
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-center block"
                  onClick={() => setShowSidebar(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Header() {
  // Use a safe pathname that doesn't require router to be mounted
  const [pathname, setPathname] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only access window after component is mounted
    setIsMounted(true);
    // Use window.location as fallback (safe, doesn't require router)
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
      
      // Listen for pathname changes
      const handleLocationChange = () => {
        setPathname(window.location.pathname);
      };
      
      // Listen to popstate for browser navigation
      window.addEventListener('popstate', handleLocationChange);
      
      return () => {
        window.removeEventListener('popstate', handleLocationChange);
      };
    }
  }, []);

  // Don't render until mounted to avoid SSR/client mismatch
  if (!isMounted) {
    return (
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex items-center gap-2">
              <span className="text-xl font-bold">ShopOrbit</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Hide header on login page
  if (pathname === '/login') {
    return null;
  }

  return <HeaderContent pathname={pathname} />;
}

