import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);

  const addToCart = (laptop) => {
    setCart([...cart, { ...laptop, quantity: 1 }]);
  };

  const removeFromCart = (laptopId) => {
    setCart(cart.filter(item => item._id !== laptopId));
  };

  const addToWishlist = (laptop) => {
    if (!wishlist.find(item => item._id === laptop._id)) {
      setWishlist([...wishlist, laptop]);
    }
  };

  const removeFromWishlist = (laptopId) => {
    setWishlist(wishlist.filter(item => item._id !== laptopId));
  };

  const toggleCompare = (laptop) => {
    if (compareList.find(item => item._id === laptop._id)) {
      setCompareList(compareList.filter(item => item._id !== laptop._id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, laptop]);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      compareList,
      addToCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      toggleCompare
    }}>
      {children}
    </CartContext.Provider>
  );
};