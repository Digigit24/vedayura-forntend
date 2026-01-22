import { createContext, useContext, useState, useEffect } from "react";
import productsData from "../data/products";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlistService";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products] = useState(productsData);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [drawerType, setDrawerType] = useState(null);
  const [user, setUser] = useState(null); // Simple user state for now

  // Check for token and load wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Mock user for now or decode token if needed
      setUser({ name: "User", email: "user@example.com" });
      loadWishlist();
    }
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      if (data.success && data.wishlist) {
        // Map API wishlist items to match frontend product structure if needed
        // API returns items: [{ id, product: { ... } }]
        // Frontend expects array of products
        const validItems = data.wishlist.items.map(item => ({
          ...item.product,
          wishlistItemId: item.id // Store the wishlist item ID for removal
        }));
        setWishlist(validItems);
      }
    } catch (error) {
      console.error("Failed to load wishlist", error);
    }
  };

  const openCart = () => setDrawerType("cart");
  const openWishlist = () => setDrawerType("wishlist");
  const closeDrawer = () => setDrawerType(null);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setWishlist([]);
  };

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

  const toggleWishlist = async (product) => {
    // Optimistic update
    const isWishlisted = wishlist.find((item) => item.id === product.id);

    // UI Update
    setWishlist((prev) => {
      if (isWishlisted) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, { ...product, wishlistItemId: 'temp-' + Date.now() }];
    });

    try {
      if (isWishlisted) {
        // We need the wishlistItemId, which should be in the product object if loaded from API
        if (isWishlisted.wishlistItemId && !isWishlisted.wishlistItemId.startsWith('temp-')) {
          await removeFromWishlist(isWishlisted.wishlistItemId);
        } else {
          // Fallback or if it was just added locally (and we don't have ID yet)
          // This is tricky without real sync. 
          // We'll assume the API load handles the IDs.
          console.warn("Cannot remove item without ID, reloading...");
          loadWishlist();
        }
      } else {
        const res = await addToWishlist(product.id);
        if (res.success) {
          // Update with real ID
          setWishlist(prev => prev.map(p =>
            p.id === product.id ? { ...p, wishlistItemId: res.wishlistItem.id } : p
          ));
        }
      }
    } catch (err) {
      console.error("Wishlist sync failed", err);
      // Revert on failure could be implemented here
      loadWishlist(); // Reload to be safe
    }
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
        user,
        logout
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
