import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Cart.css';

const Cart = () => {
  const {
    cart = [],
    updateQuantity,
    removeFromCart,
    closeDrawer,
  } = useShop();

  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.discount_price || item.price) * item.quantity,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={48} className="text-muted" strokeWidth={1.5} />
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>

        <button
          className="btn btn-outline"
          onClick={() => {
            closeDrawer();
            navigate('/shop');
          }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-drawer-content">
      {/* Header */}
      <div className="cart-drawer-header">
        <h3>My Cart</h3>
        <button className="drawer-close" onClick={closeDrawer}>
    <X size={22} />
  </button>
      </div>

      {/* Items */}
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.images[0]} alt={item.name} />

            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <span className="price">
                ₹{item.discount_price || item.price}
              </span>

              <div className="qty-controls">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  <Minus size={14} />
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="cart-summary">
        <div className="row">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Shipping Charge</span>
          <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
        </div>

        <div className="row total">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            closeDrawer();
            navigate('/checkout');
          }}
        >
          Checkout Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
