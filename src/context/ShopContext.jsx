import { createContext, useContext, useState } from "react";
import productsData from "../data/products";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products] = useState(productsData);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [drawerType, setDrawerType] = useState(null);

  const openCart = () => setDrawerType("cart");
  const openWishlist = () => setDrawerType("wishlist");
  const closeDrawer = () => setDrawerType(null);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    openCart();
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isWishlisted = prev.find((item) => item.id === product.id);
      if (isWishlisted) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        setCart,
        wishlist,
        setWishlist,
        drawerType,
        openCart,
        openWishlist,
        closeDrawer,
        closeCart: closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        addToWishlist: toggleWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
