import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ACTIONS = {
  FETCH_START: 'FETCH_PRODUCT_START',
  FETCH_SUCCESS: 'FETCH_PRODUCT_SUCCESS',
  FETCH_ERROR: 'FETCH_PRODUCT_ERROR',
  CLEAR_PRODUCT: 'CLEAR_PRODUCT',
};

const initialState = {
  product: null,
  status: 'idle',
  error: null,
};

const ProductDetailsContext = createContext();

function productDetailsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, status: 'loading', error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { product: action.payload, status: 'succeeded', error: null };
    case ACTIONS.FETCH_ERROR:
      return { ...state, status: 'failed', error: action.payload };
    case ACTIONS.CLEAR_PRODUCT:
      return initialState;
    default:
      return state;
  }
}

export function ProductDetailsProvider({ children }) {
  const [state, dispatch] = useReducer(productDetailsReducer, initialState);

  const fetchProductDetails = useCallback(async (productId) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
     
      const userData = localStorage.getItem('user');
      const token = userData ? JSON.parse(userData).token : null;

      const headers = token
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };

      const response = await fetch(`https://fakestoreapi.com/products/${productId}`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  }, []);

  const clearProduct = () => {
    dispatch({ type: ACTIONS.CLEAR_PRODUCT });
  };

  const value = {
    ...state,
    fetchProductDetails,
    clearProduct,
  };

  return <ProductDetailsContext.Provider value={value}>{children}</ProductDetailsContext.Provider>;
}

export function useProductDetails() {
  const context = useContext(ProductDetailsContext);
  if (context === undefined) {
    throw new Error('useProductDetails must be used within a ProductDetailsProvider');
  }
  return context;
}
