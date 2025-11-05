import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ Import all Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishListContext';
import { FilterProvider } from './contexts/FilterContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { ComparisonProvider } from './contexts/ComparisonContext';

/**
 * ✅ Provider Hierarchy Order (IMPORTANT):
 * 1. AuthProvider (Must be first - needed by other providers)
 * 2. CartProvider (Uses Cart functionality)
 * 3. WishlistProvider (Uses Wishlist functionality)
 * 4. FilterProvider (Product filtering)
 * 5. ReviewProvider (Product reviews)
 * 6. ComparisonProvider (Product comparison)
 * 7. App (Main application)
 */

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Authentication Provider - Must wrap everything */}
    <AuthProvider>
      {/* Cart Management */}
      <CartProvider>
        {/* Wishlist Management */}
        <WishlistProvider>
          {/* Product Filters */}
          <FilterProvider>
            {/* Product Reviews */}
            <ReviewProvider>
              {/* Product Comparison */}
              <ComparisonProvider>
                {/* Main Application */}
                <App />
              </ComparisonProvider>
            </ReviewProvider>
          </FilterProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Report web vitals for performance monitoring
reportWebVitals();
