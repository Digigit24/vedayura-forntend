import React from "react";
import { ShoppingBag, Heart, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";

const Wishlist = () => {
  const { wishlist = [], addToCart, toggleWishlist } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="drawer-empty">
        <Heart size={48} className="text-muted" strokeWidth={1.5} />
        <h3>Your wishlist is empty</h3>
        <p>Add products you love to your wishlist ❤️</p>
      </div>
    );
  }

  return (
    <div className="cart-drawer-content">
      <div className="cart-drawer-header">
        <h3>My Wishlist</h3>
      </div>

      <div className="cart-items">
        {wishlist.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />

            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <span className="price">₹{item.discount_price || item.price}</span>

              <button
                className="add-to-cart-small"
                onClick={() => addToCart(item)}
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>

            <button
              className="remove-btn"
              onClick={() => toggleWishlist(item)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
