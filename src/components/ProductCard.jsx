import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product, activeCategory }) => {
  const { addToCart, addToWishlist, wishlist = [] } = useShop();
  const [isHovered, setIsHovered] = React.useState(false);



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
  src={isHovered ? product.images[3] : product.images[0]}
  alt={product.name}
  className="product-image"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
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
      <p
  className="product-category-diagonal"
  style={{
    backgroundColor:'#5b3d20',
         padding: '4px 3rem',
    left: '30px',                // position in the middle
    transform: 'translateX(-50%) rotate(-45deg)', // center + rotate
  }}
>
  {product.category}
</p>


        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => addToWishlist(product)}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-accent"></div>

      <div className="product-info">

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
