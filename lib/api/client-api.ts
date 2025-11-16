'use client';

// Client-side API calls using Axios
// This file is used in Client Components
import axiosInstance from './axios-instance';
import { Product, User } from '@/types';

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const clientFakeStoreAPI = {
  // Search products (client-side)
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get(`/products`);
      const products = response.data;
      // Filter products by query (since API doesn't support search)
      return products.filter((product: Product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Login
  login: async (username: string, password: string): Promise<{ token: string }> => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get all products (client-side)
  getAllProducts: async (limit: number = 20): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get(`/products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product (client-side)
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get categories (client-side)
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await axiosInstance.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get products by category (client-side)
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },
};

export default clientFakeStoreAPI;

