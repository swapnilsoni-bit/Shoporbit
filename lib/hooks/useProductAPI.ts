'use client';

import { useState, useCallback } from 'react';
import { Product } from '@/types';
import { clientFakeStoreAPI } from '@/lib/api/client-api';

export const useProductAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (limit: number = 20): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const products = await clientFakeStoreAPI.getAllProducts(limit);
      return products;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProduct = useCallback(async (id: number): Promise<Product> => {
    setLoading(true);
    setError(null);
    try {
      const product = await clientFakeStoreAPI.getProduct(id);
      return product;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    try {
      const categories = await clientFakeStoreAPI.getCategories();
      return categories;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchProducts,
    fetchProduct,
    fetchCategories,
  };
};

