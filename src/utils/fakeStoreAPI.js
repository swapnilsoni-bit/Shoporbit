// All API calls to Fake Store API
const API_BASE = 'https://fakestoreapi.com';

export const fakeStoreAPI = {
  // Get all products
  getAllProducts: async (limit = 20) => {
    try {
      const response = await fetch(`${API_BASE}/products?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE}/products/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE}/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products by category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get products with sorting
  getProductsSorted: async (sort = 'asc', limit = 20) => {
    try {
      const response = await fetch(`${API_BASE}/products?sort=${sort}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch sorted products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      throw error;
    }
  },

  // Get all users (for cart history, optional)
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Get carts
  getCarts: async () => {
    try {
      const response = await fetch(`${API_BASE}/carts`);
      if (!response.ok) throw new Error('Failed to fetch carts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching carts:', error);
      return [];
    }
  },
};

export default fakeStoreAPI;
