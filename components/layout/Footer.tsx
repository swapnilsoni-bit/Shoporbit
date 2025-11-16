'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [pathname, setPathname] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only access window after component is mounted
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
      
      // Listen for pathname changes
      const handleLocationChange = () => {
        setPathname(window.location.pathname);
      };
      
      window.addEventListener('popstate', handleLocationChange);
      
      return () => {
        window.removeEventListener('popstate', handleLocationChange);
      };
    }
  }, []);

  // Don't render until mounted
  if (!isMounted) {
    return null;
  }

  // Hide footer on login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-16 border-t border-slate-700">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/favicon.ico"
                alt="ShopOrbit Logo"
                className="h-10 w-10 rounded-lg object-cover"
              />
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
                <Link href="/home" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/home" className="hover:text-white transition">
                  Shop
                </Link>
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
            &copy; 2025 ShopOrbit. All rights reserved. |{' '}
            <button type="button" className="hover:text-white ml-2 transition">
              Privacy Policy
            </button>{' '}
            |{' '}
            <button type="button" className="hover:text-white ml-2 transition">
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}

