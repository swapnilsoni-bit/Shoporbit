
import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product, quantity) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.product.id === product.id 
      );

      if (existingProductIndex > -1) {
        return prevCart.map((item, index) => 
          index === existingProductIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const emptyCart = useCallback(() => {
    setCart([]);
  }, []);

  const calculateSubtotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      emptyCart,
      calculateSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);