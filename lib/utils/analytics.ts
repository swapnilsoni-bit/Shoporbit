/**
 * Analytics Integration
 * Google Analytics 4 event tracking
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url,
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Track e-commerce events
 */
export const ecommerceEvents = {
  viewItem: (product: { id: string; name: string; price: number; category?: string }) => {
    trackEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category,
        },
      ],
    });
  },
  addToCart: (product: { id: string; name: string; price: number; quantity?: number }) => {
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price * (product.quantity || 1),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
        },
      ],
    });
  },
  removeFromCart: (product: { id: string; name: string; price: number }) => {
    trackEvent('remove_from_cart', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        },
      ],
    });
  },
  addToWishlist: (product: { id: string; name: string; price: number }) => {
    trackEvent('add_to_wishlist', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        },
      ],
    });
  },
  search: (searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm,
    });
  },
};

