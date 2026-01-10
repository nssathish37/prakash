import { createContext, useEffect, useState } from "react";

export const ContextProvider = createContext();

const Context = ({ children }) => {
  // 🔐 AUTH STATE
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // 🛒 CART & ❤️ WISHLIST
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // 🔁 Restore auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsAuth(true);
      setToken(token);
      setRole(role);
    }
  }, []);

  // 🔑 LOGIN
  const login = (token, role) => {
    setIsAuth(true);
    setToken(token);
    setRole(role);

    localStorage.setItem("access_token", token);
    localStorage.setItem("role", role);
  };

  // 🚪 LOGOUT
  const logout = () => {
    setIsAuth(false);
    setToken(null);
    setRole(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
  };

  // 🖼️ IMAGE NORMALIZER (🔥 CORE FIX)
  const toFullImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000${img}`;
  };

  // 🧠 NORMALIZE PRODUCT BEFORE STORING
  const normalizeProduct = (product) => ({
    ...product,
    image: toFullImageUrl(product.image || product.image_1),
  });

  // 🛒 ADD TO CART
  const addToCart = (product) => {
    const normalized = normalizeProduct(product);

    const exist = cartItems.find((x) => x.id === normalized.id);
    if (exist) {
      alert("Item already in Cart!");
    } else {
      setCartItems([...cartItems, { ...normalized, qty: 1 }]);
    }
  };

  // 🗑️ REMOVE FROM CART
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.id !== id));
  };

  // ❤️ ADD TO WISHLIST
  const addToWishlist = (product) => {
    const normalized = normalizeProduct(product);

    const exist = wishlistItems.find((x) => x.id === normalized.id);
    if (exist) {
      alert("Item already in Wishlist!");
    } else {
      setWishlistItems([...wishlistItems, normalized]);
    }
  };

  // ❌ REMOVE FROM WISHLIST
  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((x) => x.id !== id));
  };

  return (
    <ContextProvider.Provider
      value={{
        // 🔐 AUTH
        isAuth,
        setIsAuth,
        token,
        setToken,
        role,
        login,
        logout,

        // 🛒 CART
        cartItems,
        addToCart,
        removeFromCart,

        // ❤️ WISHLIST
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
};

export default Context;
