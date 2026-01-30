import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import TopMarquee from "../components/TopMarquee";
import {
    ShieldCheck,
    CheckCircle,
    Truck,
    Package,
    Star,
    ChevronRight,
    ChevronLeft,
    Minus,
    Plus,
    Leaf,
    Droplet
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, addToCart } = useShop();

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('benefits');

    // Slider state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState("right");

    const product = products.find(p => p.id === parseInt(id));

    // Gallery images from product data
    const galleryImages =
        product?.images && product.images.length > 0
            ? product.images
            : ["https://m.media-amazon.com/images/I/710nAJeVFlL.jpg"];

    // Reset on product change
    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentImageIndex(0);
        setIsAnimating(false);
        setDirection("right");
        setQuantity(1);
        setActiveTab('benefits');
    }, [id]);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setDirection("right");
        setIsAnimating(true);

        setTimeout(() => {
            setCurrentImageIndex(prev =>
                prev === galleryImages.length - 1 ? 0 : prev + 1
            );
            setIsAnimating(false);
        }, 350);
    }, [galleryImages.length, isAnimating]);

    const prevSlide = () => {
        if (isAnimating) return;
        setDirection("left");
        setIsAnimating(true);

        setTimeout(() => {
            setCurrentImageIndex(prev =>
                prev === 0 ? galleryImages.length - 1 : prev - 1
            );
            setIsAnimating(false);
        }, 350);
    };

    const goToSlide = (index) => {
        if (isAnimating) return;
        setCurrentImageIndex(index);
    };

    // Auto-slide
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isHovered, nextSlide]);

    // Related products
    const relatedProducts = products
        .filter(p => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4);

    if (!product) {
        return (
            <div className="pd-not-found">
                <h2>Product not found</h2>
                <Link to="/shop" className="btn-vedayura btn-vedayura-primary">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) setQuantity(quantity + val);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    return (
        <div className="product-details-page">
            <TopMarquee />

            <div className="container">

                {/* Breadcrumbs */}
                <nav className="pd-breadcrumbs">
                    <Link to="/">Home</Link> <ChevronRight size={14} />
                    <Link to="/shop">Shop</Link> <ChevronRight size={14} />
                    <span className="current">{product.name}</span>
                </nav>

                <div className="pd-layout">

                    {/* LEFT COLUMN */}
                    <div className="pd-gallery-wrapper">
                        <div
                            className="pd-main-image-card"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="pd-badge-overlay">
                                {product.stock < 50 && (
                                    <span className="badge-low-stock">Low Stock</span>
                                )}
                               <span
  className="badge-type"
  style={{
    backgroundColor:
      product.category === 'Liquid'
        ? '#22c1478f'      // soft teal
        : product.category === 'Powder'
        ? '#a0512d89'       // soft earthy red
        : '#9604fe70'     // capsules blue
  }}
>
  {product.category}
</span>

                            </div>

                            <button className="slider-arrow arrow-left" onClick={prevSlide}>
                                <ChevronLeft size={24} />
                            </button>

                            <div className="slider-frame">
                                <img
                                    src={galleryImages[currentImageIndex]}
                                    alt={product.name}
                                    className={`slider-image current ${
                                        isAnimating ? `exit-${direction}` : ""
                                    }`}
                                />

                                {isAnimating && (
                                    <img
                                        src={
                                            direction === "right"
                                                ? galleryImages[(currentImageIndex + 1) % galleryImages.length]
                                                : galleryImages[
                                                    (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
                                                ]
                                        }
                                        alt={product.name}
                                        className={`slider-image next enter-${direction}`}
                                    />
                                )}
                            </div>

                            <button className="slider-arrow arrow-right" onClick={nextSlide}>
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="pd-thumbnails-grid">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`pd-thumb-btn ${currentImageIndex === idx ? 'active' : ''}`}
                                    onClick={() => goToSlide(idx)}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="pd-info-wrapper">

                        {/* Header */}
                        <div className="pd-header">
                            <h1 className="pd-title">{product.name}<span>({product.productType})</span></h1>

                            <div className="pd-rating-row">
                                <Star size={18} fill="#22c55e" color="#22c55e" />
                                <strong>4.8</strong>
                                <span className="review-count">| 124 Reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="pd-price-block">
                            <span className="price-label">MRP (Inclusive of taxes)</span>
                            <div className="price-row">
                                <span className="amount">₹{product.price}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="pd-features-list">
                            <li><Leaf size={18} /> 100% Natural Ingredients</li>
                            <li><ShieldCheck size={18} /> GMP Certified</li>
                            <li><Droplet size={18} /> No Artificial Additives</li>
                        </ul>

                        {/* Actions */}
                        <div className="pd-actions-card">
                            <div className="pd-quantity-control">
                                <span className="qty-label">Quantity</span>
                                <div className="qty-counter">
                                    <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                        <Minus size={16} />
                                    </button>
                                    <span>{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)}>
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <button
                                className="btn-vedayura btn-vedayura-primary full-width"
                                onClick={handleAddToCart}
                            >
                                Add to Cart — ₹{(product.price * quantity).toFixed(2)}
                            </button>

                            <div className="pd-trust-badges">
                                <div className="trust-item"><Truck size={20} /><span>Free Shipping</span></div>
                                <div className="trust-item"><ShieldCheck size={20} /><span>Secure Checkout</span></div>
                                <div className="trust-item"><Package size={20} /><span>Discrete Packaging</span></div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="pd-info-tabs">
                            <div className="pd-tab-headers">
                                <button
                                    className={`tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('benefits')}
                                >
                                    Benefits
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('ingredients')}
                                >
                                    Ingredients
                                </button>
                            </div>

                            <div className="pd-tab-content">
                                {activeTab === 'benefits' && (
                                    <ul className="benefits-list">
                                        {product.Benefits?.length > 0
                                            ? product.Benefits.map((b, i) => (
                                                <li key={i}>
                                                    <CheckCircle size={20} />
                                                    <span>{b}</span>
                                                </li>
                                            ))
                                            : <p>No benefits listed.</p>}
                                    </ul>
                                )}

                                {activeTab === 'ingredients' && (
                                    <p className="ingredients-text">
                                        {product.Ingredients || "Natural herbal ingredients."}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="pd-related">
                        <h2 className="section-title">You May Also Like</h2>
                        <div className="product-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetails;
