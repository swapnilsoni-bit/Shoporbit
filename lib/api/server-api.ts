// Server-side API calls using Axios
// This file is used in Server Components (page.tsx)
// DEPRECATED: Use productService from './services/productService' instead
import axiosInstance from './base-api';
import { Product } from '@/types';

export const fakeStoreAPI = {
  // Get all products
  getAllProducts: async (limit: number = 20): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get(`/products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await axiosInstance.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get products with sorting
  getProductsSorted: async (sort: string = 'asc', limit: number = 20): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get(`/products?sort=${sort}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      throw error;
    }
  },
};

export default fakeStoreAPI;

