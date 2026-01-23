import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product, activeCategory }) => {
    const { addToCart, addToWishlist } = useShop();
    const { wishlist = [] } = useShop();
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const [isAdded, setIsAdded] = React.useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000); // Reset after 2s
    };

    return (
        <div className="product-card" data-category={activeCategory}>

            <div className="product-image-container">
                <Link to={`/product/${product.id}`} className="product-image-link">
                    <div className="product-image-wrapper">
                        <img src={product.image} alt={product.name} className="product-image" />
                    </div>
                </Link>

                {/* Quick Overlay */}
                <div className="card-overlay">
                    <Link to={`/product/${product.id}`} className="quick-view-btn">
                        <Star size={18} /> <span>View Details</span>
                    </Link>
                </div>


                {product.discount_price < product.price && (
                    <span className="discount-badge">
                        -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
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
                    <span className="current-price">₹{product.discount_price || product.price}</span>
                    {product.discount_price && (
                        <span className="original-price">₹{product.price}</span>
                    )}
                </div>

                <button
                    className={`btn btn-outline btn-sm add-to-cart-btn ${isAdded ? 'added' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAdded}>
                    {isAdded ? (
                        <>
                            <Star size={16} /> Added
                        </>
                    ) : (
                        <>
                            <ShoppingBag size={16} /> Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
