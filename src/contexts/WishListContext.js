// WishListContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { useCart } from './CartContext';

const WishListContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  const addToWishlist = useCallback((product) => {
    setWishlist(prevWishlist => {
      if (prevWishlist.find(item => item.id === product.id)) {
        return prevWishlist;
      }
      return [...prevWishlist, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prevWishlist => 
      prevWishlist.filter(item => item.id !== productId)
    );
  }, []);

  const addAllToCart = useCallback(() => {
    const addItemsSequentially = async () => {
      for (const product of wishlist) {
        await new Promise(resolve => setTimeout(resolve, 100));
        addToCart(product, 1);
      }
      setWishlist([]);
    };
    addItemsSequentially();
  }, [wishlist, addToCart]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  return (
    <WishListContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        addAllToCart,
        isInWishlist,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
};

export const useWishlist = () => useContext(WishListContext);