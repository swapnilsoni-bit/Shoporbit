import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const ProductsContext = createContext();
const ProductsDispatchContext = createContext();

export const ACTIONS = {
  FETCH_START: 'FETCH_PRODUCTS_START',
  FETCH_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_ERROR: 'FETCH_PRODUCTS_ERROR',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY'
};

const initialState = {
  products: [],
  categories: [],
  selectedCategory: null,
  status: 'idle',
  error: null,
};

function productsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, status: 'loading' };
    case ACTIONS.FETCH_SUCCESS:
      return { 
        ...state, 
        status: 'succeeded', 
        products: action.payload,
        error: null 
      };
    case ACTIONS.FETCH_ERROR:
      return { 
        ...state, 
        status: 'failed', 
        error: action.payload,
        products: []
      };
    case ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case ACTIONS.SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    default:
      return state;
  }
}

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const initialized = useRef(false);

  const fetchProducts = async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const userData = localStorage.getItem('user');
      const token = userData ? JSON.parse(userData).token : null;
      const headers = token
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };

      const response = await fetch('https://fakestoreapi.com/products', { headers });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: data });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductsByCategory = async (category) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchProducts();
      fetchCategories();
    }
  }, []);

  return (
    <ProductsContext.Provider value={{ ...state, fetchProducts, fetchProductsByCategory }}>
      <ProductsDispatchContext.Provider value={dispatch}>
        {children}
      </ProductsDispatchContext.Provider>
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}

export function useProductsDispatch() {
  const context = useContext(ProductsDispatchContext);
  if (context === undefined) {
    throw new Error('useProductsDispatch must be used within a ProductsProvider');
  }
  return context;
}