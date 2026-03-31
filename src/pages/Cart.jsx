import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import EmptyState from '../components/EmptyState';
import './Cart.css';

const normalizeItem = (item) => {
  const product = item.product || item;
  const productId = product.id || item.productId || item.id;
  return {
    id: productId,
    cartItemId: item.id,
    name: product.name || item.name || 'Unknown Product',
    variant: product.variant || item.variant || null,
    image: product.imageUrls?.[0] || product.images?.[0] || item.images?.[0] || item.image || '/assets/product-placeholder.png',
    price: product.discountedPrice || product.price || item.discount_price || item.price || 0,
    quantity: item.quantity || 1,
    stock: product.stockQuantity ?? product.stock ?? item.stock,
  };
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.055, duration: 0.28, ease: 'easeOut' } }),
  exit:   { opacity: 0, x: 40, transition: { duration: 0.22, ease: 'easeIn' } },
};

const Cart = () => {
  const { cart = [], updateQuantity, removeFromCart, closeDrawer } = useShop();
  const navigate = useNavigate();

  const normalizedCart = cart.map(normalizeItem);
  const subtotal = normalizedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (normalizedCart.length === 0) {
    return (
      <EmptyState
        variant="cart"
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Browse our Ayurvedic formulations and find what your body needs."
        action={{ label: 'Start Shopping', onClick: () => { closeDrawer(); navigate('/shop'); } }}
      />
    );
  }

  return (
    <div className="cart-drawer-content">
      {/* Header */}
      <div className="cart-drawer-header">
        <h3>
          My Cart
          <span className="cart-header-meta">{normalizedCart.length} item{normalizedCart.length !== 1 ? 's' : ''}</span>
        </h3>
      </div>

      {/* Items */}
      <div className="cart-items">
        <AnimatePresence initial={false}>
          {normalizedCart.map((item, i) => (
            <motion.div
              key={item.cartItemId || item.id}
              className="cart-item"
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <img src={item.image} alt={item.name} loading="lazy" />

              <div className="cart-item-info">
                <h4>
                  {item.name}
                  {item.variant && (
                    <span className="cart-item-variant"> — {item.variant.charAt(0) + item.variant.slice(1).toLowerCase()}</span>
                  )}
                </h4>
                <span className="price">₹{item.price.toLocaleString()}</span>

                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus size={13} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <motion.div
        className="cart-summary"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.28 }}
      >
        <div className="row">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className={`row${shipping === 0 ? ' free' : ''}`}>
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
        </div>

        {shipping > 0 && (
          <div className="free-shipping-notice">
            Add ₹{(999 - subtotal + 1).toLocaleString()} more for free shipping
          </div>
        )}

        <div className="row total">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        <button
          className="btn-checkout"
          onClick={() => { closeDrawer(); navigate('/checkout'); }}
        >
          Checkout <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
};

export default Cart;
