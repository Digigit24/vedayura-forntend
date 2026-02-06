import React from "react";
import { ShoppingBag, Heart, Trash2, X } from "lucide-react";
import { useShop } from "../context/ShopContext";

const Wishlist = () => {
  const { wishlist = [], addToCart, toggleWishlist, closeDrawer } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="drawer-empty">
        <Heart size={48} className="text-muted" strokeWidth={1.5} />
        <h3>Your wishlist is empty</h3>
        <p>Add products you love to your wishlist ❤️</p>
      </div>
    );
  }

  // Normalize wishlist items to a consistent shape
  // Server items: { id, productId, product: { id, name, imageUrls, ... } }
  // Local items:  { id, name, images, price, discount_price, ... }
  const normalizeItem = (item) => {
    const product = item.product || item;
    return {
      id: product.id || item.id,
      name: product.name || item.name || "Unknown Product",
      image: product.imageUrls?.[0] || product.images?.[0] || item.images?.[0] || item.image || "/assets/product-placeholder.png",
      price: product.discountedPrice || product.price || item.discount_price || item.price || 0,
      stock: product.stockQuantity ?? product.stock ?? item.stock,
      // Keep the original item for toggleWishlist/addToCart
      _original: item,
      // Build a cart-compatible object
      _cartItem: {
        id: product.id || item.id,
        name: product.name || item.name,
        price: product.discountedPrice || product.price || item.discount_price || item.price || 0,
        image: product.imageUrls?.[0] || product.images?.[0] || item.images?.[0] || item.image || "/assets/product-placeholder.png",
        images: product.imageUrls || product.images || item.images || [product.imageUrls?.[0] || item.image || "/assets/product-placeholder.png"],
        stock: product.stockQuantity ?? product.stock ?? item.stock,
      },
    };
  };

  return (
    <div className="cart-drawer-content">
      <div className="cart-drawer-header">
        <h3>My Wishlist</h3>
        <button className="drawer-close" onClick={closeDrawer}>
          <X size={22} />
        </button>
      </div>

      <div className="cart-items">
        {wishlist.map((item) => {
          const normalized = normalizeItem(item);
          return (
            <div key={item.id} className="cart-item">
              <img src={normalized.image} alt={normalized.name} />

              <div className="cart-item-info">
                <h4>{normalized.name}</h4>
                <span className="price">₹{normalized.price}</span>

                <button
                  className="add-to-cart-small"
                  onClick={() => addToCart(normalized._cartItem)}
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() => toggleWishlist({ id: normalized.id })}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;