import { ShoppingBag, Heart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "../context/ShopContext";
import toast from "react-hot-toast";

const normalizeItem = (item) => {
  const product = item.product || item;
  return {
    id: product.id || item.id,
    name: product.name || item.name || "Unknown Product",
    variant: product.variant || item.variant || null,
    image: product.imageUrls?.[0] || product.images?.[0] || item.images?.[0] || item.image || "/assets/product-placeholder.png",
    price: product.discountedPrice || product.price || item.discount_price || item.price || 0,
    stock: product.stockQuantity ?? product.stock ?? item.stock,
    _original: item,
    _cartItem: {
      id: product.id || item.id,
      name: product.name || item.name,
      price: product.discountedPrice || product.price || item.discount_price || item.price || 0,
      image: product.imageUrls?.[0] || product.images?.[0] || item.images?.[0] || item.image || "/assets/product-placeholder.png",
      images: product.imageUrls || product.images || item.images || [item.image || "/assets/product-placeholder.png"],
      stock: product.stockQuantity ?? product.stock ?? item.stock,
    },
  };
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.055, duration: 0.28, ease: 'easeOut' } }),
  exit:   { opacity: 0, x: 40, transition: { duration: 0.22, ease: 'easeIn' } },
};

const Wishlist = () => {
  const { wishlist = [], addToCart, toggleWishlist, closeDrawer } = useShop();

  const handleRemove = (id) => {
    toggleWishlist({ id });
    toast.success('Removed from wishlist', {
      style: { borderRadius: '10px', background: '#111', color: '#fff', fontSize: '0.85rem' },
    });
  };

  if (wishlist.length === 0) {
    return (
      <motion.div
        className="drawer-empty"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Heart size={44} strokeWidth={1.2} />
        <h3>Your wishlist is empty</h3>
        <p>Save products you love and come back to them anytime.</p>
      </motion.div>
    );
  }

  return (
    <div className="cart-drawer-content">
      <div className="cart-drawer-header">
        <h3>
          Wishlist
          <span className="cart-header-meta">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
        </h3>
      </div>

      <div className="cart-items">
        <AnimatePresence initial={false}>
          {wishlist.map((item, i) => {
            const normalized = normalizeItem(item);
            return (
              <motion.div
                key={item.id}
                className="cart-item"
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <img src={normalized.image} alt={normalized.name} />

                <div className="cart-item-info">
                  <h4>
                    {normalized.name}
                    {normalized.variant && (
                      <span className="cart-item-variant"> — {normalized.variant.charAt(0) + normalized.variant.slice(1).toLowerCase()}</span>
                    )}
                  </h4>
                  <span className="price">₹{normalized.price.toLocaleString()}</span>

                  <button className="add-to-cart-small" onClick={() => addToCart(normalized._cartItem)}>
                    <ShoppingBag size={13} /> Add to Cart
                  </button>
                </div>

                <button className="remove-btn" onClick={() => handleRemove(normalized.id)}>
                  <Trash2 size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
