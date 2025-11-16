import axiosInstance from '../base-api';
import { Product } from '@/types';
import { retryWithBackoff } from '../utils/retry';
import { deduplicateRequest, generateRequestKey } from '../utils/requestDeduplication';
import { getCancelToken, cleanupRequest } from '../utils/requestCancellation';

/**
 * Product Service - Unified API service for product operations
 * Works on both server and client side
 */
class ProductService {
  private baseUrl = '/products';

  /**
   * Get all products
   * @param limit - Number of products to fetch
   * @returns Promise<Product[]>
   */
  async getAllProducts(limit: number = 20): Promise<Product[]> {
    const url = `${this.baseUrl}?limit=${limit}`;
    const key = generateRequestKey(url);
    
    // Only use cancellation on client side (not server-side)
    const isServer = typeof window === 'undefined';
    const cancelToken = isServer ? undefined : getCancelToken(key);
    
    return deduplicateRequest(key, () =>
      retryWithBackoff(async () => {
        try {
          const response = await axiosInstance.get<Product[]>(url, cancelToken ? { cancelToken } : undefined);
          return response.data;
        } finally {
          if (!isServer) {
            cleanupRequest(key);
          }
        }
      })
    );
  }

  /**
   * Get single product by ID
   * @param id - Product ID
   * @returns Promise<Product>
   */
  async getProduct(id: number): Promise<Product> {
    const url = `${this.baseUrl}/${id}`;
    const key = generateRequestKey(url);
    
    // Only use cancellation on client side (not server-side)
    // Server-side requests run in parallel and shouldn't cancel each other
    const isServer = typeof window === 'undefined';
    const cancelToken = isServer ? undefined : getCancelToken(key);
    
    return deduplicateRequest(key, () =>
      retryWithBackoff(async () => {
        try {
          const response = await axiosInstance.get<Product>(url, cancelToken ? { cancelToken } : undefined);
          return response.data;
        } finally {
          if (!isServer) {
            cleanupRequest(key);
          }
        }
      })
    );
  }

  /**
   * Get all categories
   * @returns Promise<string[]>
   */
  async getCategories(): Promise<string[]> {
    const url = `${this.baseUrl}/categories`;
    const key = generateRequestKey(url);
    
    // Only use cancellation on client side (not server-side)
    const isServer = typeof window === 'undefined';
    const cancelToken = isServer ? undefined : getCancelToken(key);
    
    return deduplicateRequest(key, () =>
      retryWithBackoff(async () => {
        try {
          const response = await axiosInstance.get<string[]>(url, cancelToken ? { cancelToken } : undefined);
          return response.data;
        } finally {
          if (!isServer) {
            cleanupRequest(key);
          }
        }
      })
    );
  }

  /**
   * Get products by category
   * @param category - Category name
   * @returns Promise<Product[]>
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    const url = `${this.baseUrl}/category/${category}`;
    const key = generateRequestKey(url);
    
    // Only use cancellation on client side (not server-side)
    const isServer = typeof window === 'undefined';
    const cancelToken = isServer ? undefined : getCancelToken(key);
    
    return deduplicateRequest(key, () =>
      retryWithBackoff(async () => {
        try {
          const response = await axiosInstance.get<Product[]>(url, cancelToken ? { cancelToken } : undefined);
          return response.data;
        } finally {
          if (!isServer) {
            cleanupRequest(key);
          }
        }
      })
    );
  }

  /**
   * Get products with sorting
   * @param sort - Sort order (asc/desc)
   * @param limit - Number of products
   * @returns Promise<Product[]>
   */
  async getProductsSorted(sort: string = 'asc', limit: number = 20): Promise<Product[]> {
    const url = `${this.baseUrl}?sort=${sort}&limit=${limit}`;
    const key = generateRequestKey(url);
    
    // Only use cancellation on client side (not server-side)
    const isServer = typeof window === 'undefined';
    const cancelToken = isServer ? undefined : getCancelToken(key);
    
    return deduplicateRequest(key, () =>
      retryWithBackoff(async () => {
        try {
          const response = await axiosInstance.get<Product[]>(url, cancelToken ? { cancelToken } : undefined);
          return response.data;
        } finally {
          if (!isServer) {
            cleanupRequest(key);
          }
        }
      })
    );
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;

