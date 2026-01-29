import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product, activeCategory }) => {
  const { addToCart, addToWishlist, wishlist = [] } = useShop();

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="product-card" data-category={activeCategory}>
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <div className="product-image-wrapper">
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image"
            />
          </div>
        </Link>

      <div className="card-actions">
  <button
  className={`action-btn ${isAdded ? 'added' : ''}`}
  onClick={handleAddToCart}
  disabled={isAdded}
>
  {isAdded ? (
    <>
      <Check size={16} />
      Added
    </>
  ) : (
    <>
      <ShoppingBag size={16} />
      Add to Cart
    </>
  )}
</button>

</div>


        {product.discount_price < product.price && (
          <span className="discount-badge">
            -{Math.round(
              ((product.price - product.discount_price) / product.price) * 100
            )}%
          </span>
        )}

        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => addToWishlist(product)}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-accent"></div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-price">
          <span className="current-price">
            ₹{product.discount_price || product.price}
          </span>

          {product.discount_price && (
            <span className="original-price">₹{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
