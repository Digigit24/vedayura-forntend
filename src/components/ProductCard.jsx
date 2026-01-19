import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, wishlist } = useShop();
    const isWishlisted = wishlist.some(item => item.id === product.id);

    return (
        <div className="product-card">
            <div className="product-image-container">
                <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="product-image" />
                </Link>
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
                    className="btn btn-outline btn-sm add-to-cart-btn"
                    onClick={() => addToCart(product)}
                >
                    <ShoppingBag size={16} /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
