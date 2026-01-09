import { createContext, useState } from "react";

export const ContextProvider = createContext();

const Context = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

    const addToCart = (product) => {
      const exist = cartItems.find((x) => x.id === product.id);
      if (exist) {
        alert("Item already in Cart!");
      } else {
        setCartItems([...cartItems, { ...product, qty: 1 }]);
      }
    };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.id !== id));
  };

  const addToWishlist = (product) => {
    const exist = wishlistItems.find((x) => x.id === product.id);
    if (exist) {
      alert("Item already in Wishlist!");
    } else {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((x) => x.id !== id));
  };

  return (
    <ContextProvider.Provider
      value={{
        isAuth,
        setIsAuth,
        token,
        setToken,
        cartItems,
        addToCart,
        removeFromCart,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
};

export default Context; // ✅ THIS FIXES THE ERROR
