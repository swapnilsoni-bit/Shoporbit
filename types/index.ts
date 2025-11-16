// Product types
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// User types
export interface User {
  id?: number;
  username?: string;
  name?: string;
  email?: string;
  token?: string;
  loginTime?: string;
  isGuest?: boolean;
  guestId?: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Filter types
export interface FilterState {
  category: string | null;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  searchQuery: string;
}

// Review types
export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  message: string;
  type: ToastType;
}

// Sort options
export interface SortOption {
  label: string;
  value: string;
}

