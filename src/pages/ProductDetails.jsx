import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import TopMarquee from "../components/TopMarquee";
import toast from 'react-hot-toast';
import api from '../api';
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
    Droplet,
    Heart,
    Share2,
    Play,
    X,
    Clock,
    AlertTriangle,
    Award,
    BookOpen,
    Info,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    User
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, addToCart, addToWishlist, removeFromWishlist, wishlist = [] } = useShop();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Slider state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState("right");

    // Video modal
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);

    // Reviews
    const [reviewSort, setReviewSort] = useState('newest');
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Wishlist check
    const isInWishlist = wishlist.some(item => String(item.id) === String(product?.id));

    // ─── Load product ───────────────────────────────────────────
    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);

            const foundProduct = products.find(p => String(p.id) === String(id));
            if (foundProduct) {
                setProduct(foundProduct);
                setLoading(false);
                return;
            }

            // If products haven't loaded yet, don't fetch individually — wait for context
            if (products.length === 0) {
                setLoading(false);
                return;
            }

            // Products loaded but not found — try API
            try {
                const res = await api.products.getById(id);
                if (res?.product) {
                    const p = res.product;
                    setProduct({
                        id: p.id,
                        name: p.name,
                        description: p.description || '',
                        image: p.imageUrls?.[0] || '/assets/product-placeholder.png',
                        images: p.imageUrls || ['/assets/product-placeholder.png'],
                        videos: p.videoUrls || [],
                        category: p.category?.name || 'Uncategorized',
                        price: p.discountedPrice || p.realPrice,
                        realPrice: p.realPrice,
                        discount_price: p.discountedPrice,
                        stock: p.stockQuantity,
                        rating: p.averageRating || 0,
                        reviewCount: p.reviewCount || 0,
                        reviews: p.reviews || [],
                        ingredients: p.ingredients || '',
                        benefits: p.benefits || [],
                        howToUse: p.howToUse || p.usage || '',
                        productType: p.productType || '',
                        features: p.features || [],
                        specifications: p.specifications || {},
                        weight: p.weight || '',
                        shelfLife: p.shelfLife || '',
                        manufacturer: p.manufacturer || '',
                        countryOfOrigin: p.countryOfOrigin || '',
                    });
                } else {
                    setProduct(null);
                }
            } catch (err) {
                console.error('Failed to load product:', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id, products]);

    // ─── Retry when products load after initial render ──────────
    useEffect(() => {
        if (!product && !loading && products.length > 0) {
            const found = products.find(p => String(p.id) === String(id));
            if (found) {
                setProduct(found);
            }
        }
    }, [products, product, loading, id]);

    // ─── Gallery images ─────────────────────────────────────────
    const galleryImages =
        product?.images?.length > 0
            ? product.images
            : [product?.image || '/assets/product-placeholder.png'];

    // ─── Product videos ─────────────────────────────────────────
    const productVideos = product?.videos || [];

    // ─── Reset on product change ────────────────────────────────
    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentImageIndex(0);
        setIsAnimating(false);
        setDirection("right");
        setQuantity(1);
        setActiveTab('description');
        setShowVideoModal(false);
        setShowAllReviews(false);
    }, [id]);

    // ─── Slider controls ────────────────────────────────────────
    const nextSlide = useCallback(() => {
        if (isAnimating || galleryImages.length <= 1) return;
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
        if (isAnimating || galleryImages.length <= 1) return;
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
        if (isAnimating || index === currentImageIndex) return;
        setDirection(index > currentImageIndex ? "right" : "left");
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentImageIndex(index);
            setIsAnimating(false);
        }, 350);
    };

    // Auto-slide
    useEffect(() => {
        if (isHovered || galleryImages.length <= 1) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isHovered, nextSlide, galleryImages.length]);

    // ─── Render star rating ─────────────────────────────────────
    const renderStars = (rating, size = 16) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={size}
                fill={i < Math.round(rating) ? '#22c55e' : 'transparent'}
                color={i < Math.round(rating) ? '#22c55e' : '#d1d5db'}
            />
        ));
    };

    const featureIconMap = {
        leaf: <Leaf size={18} />,
        shield: <ShieldCheck size={18} />,
        droplet: <Droplet size={18} />,
        award: <Award size={18} />,
        check: <CheckCircle size={18} />,
        truck: <Truck size={18} />,
        clock: <Clock size={18} />,
    };

    // ─── Loading ────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="product-details-page">
                <TopMarquee />
                <div className="container">
                    <div className="pd-loading">
                        <div className="spinner"></div>
                        <p>Loading product...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Not found ──────────────────────────────────────────────
    if (!product) {
        return (
            <div className="product-details-page">
                <TopMarquee />
                <div className="container">
                    <div className="pd-not-found">
                        <h2>Product not found</h2>
                        <p>The product you're looking for doesn't exist or has been removed.</p>
                        <Link to="/shop" className="btn-vedayura btn-vedayura-primary">
                            Back to Shop
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ─── All product-dependent computations AFTER null check ────

    // Related products
    const relatedProducts = products
        .filter(p => p.category === product.category && String(p.id) !== String(product.id))
        .slice(0, 4);

    // Fixed price (no discount logic)
    const displayPrice = product.price;

    // Stock helpers
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 50;

    // Reviews helpers
    const reviews = product.reviews || [];
    const sortedReviews = [...reviews].sort((a, b) => {
        if (reviewSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (reviewSort === 'highest') return b.rating - a.rating;
        if (reviewSort === 'lowest') return a.rating - b.rating;
        return 0;
    });
    const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

    const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => Math.round(r.rating) === star).length,
        percent: reviews.length > 0
            ? Math.round((reviews.filter(r => Math.round(r.rating) === star).length / reviews.length) * 100)
            : 0
    }));

    // Specifications
    const specsData = {
        ...(product.weight && { 'Weight': product.weight }),
        ...(product.shelfLife && { 'Shelf Life': product.shelfLife }),
        ...(product.manufacturer && { 'Manufacturer': product.manufacturer }),
        ...(product.countryOfOrigin && { 'Country of Origin': product.countryOfOrigin }),
        ...(product.productType && { 'Product Type': product.productType }),
        ...(product.category && { 'Category': product.category }),
        ...(product.specifications || {})
    };

    // Dynamic features
    const productFeatures = product.features?.length > 0
        ? product.features
        : [
            { icon: 'leaf', label: '100% Natural Ingredients' },
            { icon: 'shield', label: 'GMP Certified' },
            { icon: 'droplet', label: 'No Artificial Additives' },
        ];

    // Share product
    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!', {
                    style: { borderRadius: '12px', background: '#22371f', color: '#fff' },
                });
            }
        } catch (err) {
            console.log('Share cancelled');
        }
    };

    // Wishlist toggle
    const handleWishlistToggle = () => {
        if (isInWishlist) {
            removeFromWishlist(product.id);
            toast.success('Removed from wishlist', {
                style: { borderRadius: '12px', background: '#22371f', color: '#fff' },
            });
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist', {
                style: { borderRadius: '12px', background: '#22371f', color: '#fff' },
            });
        }
    };

    const handleQuantityChange = (val) => {
        const newQty = quantity + val;
        if (newQty >= 1 && newQty <= (product.stock || 99)) {
            setQuantity(newQty);
        }
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart`, {
            style: { borderRadius: '12px', background: '#22371f', color: '#fff' },
        });
    };

    // ─── Tab config ─────────────────────────────────────────────
    const tabs = [
        { key: 'description', label: 'Description', icon: <BookOpen size={16} /> },
        { key: 'benefits', label: 'Benefits', icon: <CheckCircle size={16} /> },
        { key: 'ingredients', label: 'Ingredients', icon: <Leaf size={16} /> },
        { key: 'howToUse', label: 'How to Use', icon: <Info size={16} /> },
        { key: 'specifications', label: 'Specifications', icon: <Package size={16} /> },
        { key: 'reviews', label: `Reviews (${product.reviewCount || reviews.length || 0})`, icon: <MessageSquare size={16} /> },
    ];

    return (
        <div className="product-details-page">
            <TopMarquee />

            <div className="container">

                {/* ── Breadcrumbs ──────────────────────────────── */}
                <nav className="pd-breadcrumbs">
                    <Link to="/">Home</Link> <ChevronRight size={14} />
                    <Link to="/shop">Shop</Link> <ChevronRight size={14} />
                    {product.category && (
                        <>
                            <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
                            <ChevronRight size={14} />
                        </>
                    )}
                    <span className="current">{product.name}</span>
                </nav>

                <div className="pd-layout">

                    {/* ══════════ LEFT COLUMN ══════════ */}
                    <div className="pd-gallery-wrapper">

                        {/* Main image slider */}
                        <div
                            className="pd-main-image-card"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Badges */}
                            <div className="pd-badge-overlay">
                                {isOutOfStock && (
                                    <span className="badge-out-of-stock">Out of Stock</span>
                                )}
                                {isLowStock && !isOutOfStock && (
                                    <span className="badge-low-stock">
                                        <AlertTriangle size={12} /> Only {product.stock} left
                                    </span>
                                )}
                                <span
                                    className="badge-type"
                                    style={{
                                        backgroundColor:
                                            product.category === 'Liquid' ? '#02f83be9'
                                            : product.category === 'Powder' ? '#ff5100fb'
                                            : '#9500ff70'
                                    }}
                                >
                                    {product.category}
                                </span>
                            </div>

                            {/* Wishlist & Share buttons */}
                            <div className="pd-action-buttons-overlay">
                                <button
                                    className={`pd-icon-btn ${isInWishlist ? 'active' : ''}`}
                                    onClick={handleWishlistToggle}
                                    title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                >
                                    <Heart size={20} fill={isInWishlist ? '#ef4444' : 'none'} color={isInWishlist ? '#ef4444' : '#fff'} />
                                </button>
                                <button className="pd-icon-btn" onClick={handleShare} title="Share">
                                    <Share2 size={20} color="#fff" />
                                </button>
                            </div>

                            {galleryImages.length > 1 && (
                                <button className="slider-arrow arrow-left" onClick={prevSlide}>
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            <div className="slider-frame">
                                <img
                                    src={galleryImages[currentImageIndex]}
                                    alt={product.name}
                                    className={`slider-image current ${isAnimating ? `exit-${direction}` : ''}`}
                                />
                                {isAnimating && (
                                    <img
                                        src={
                                            direction === "right"
                                                ? galleryImages[(currentImageIndex + 1) % galleryImages.length]
                                                : galleryImages[(currentImageIndex - 1 + galleryImages.length) % galleryImages.length]
                                        }
                                        alt={product.name}
                                        className={`slider-image next enter-${direction}`}
                                    />
                                )}
                            </div>

                            {galleryImages.length > 1 && (
                                <button className="slider-arrow arrow-right" onClick={nextSlide}>
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>

                        {/* Thumbnails — images + video thumbnails */}
                        <div className="pd-thumbnails-grid">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={`img-${idx}`}
                                    className={`pd-thumb-btn ${currentImageIndex === idx ? 'active' : ''}`}
                                    onClick={() => goToSlide(idx)}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} />
                                </button>
                            ))}
                            {productVideos.map((video, idx) => (
                                <button
                                    key={`vid-${idx}`}
                                    className="pd-thumb-btn pd-thumb-video"
                                    onClick={() => { setActiveVideo(video); setShowVideoModal(true); }}
                                >
                                    <Play size={24} className="video-play-icon" />
                                    <img
                                        src={video.thumbnail || galleryImages[0]}
                                        alt={video.title || `Video ${idx + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ══════════ RIGHT COLUMN ══════════ */}
                    <div className="pd-info-wrapper">

                        {/* Header */}
                        <div className="pd-header">
                            <h1 className="pd-title">
                                {product.name}
                                {product.productType && <span className="pd-product-type">({product.productType})</span>}
                            </h1>

                            <div className="pd-rating-row">
                                <div className="pd-stars">
                                    {renderStars(product.rating, 18)}
                                </div>
                                {product.rating > 0 ? (
                                    <>
                                        <strong>{product.rating.toFixed(1)}</strong>
                                        <span className="review-count">
                                            | {product.reviewCount || reviews.length} {(product.reviewCount || reviews.length) === 1 ? 'Review' : 'Reviews'}
                                        </span>
                                    </>
                                ) : (
                                    <span className="review-count no-reviews">No reviews yet</span>
                                )}
                            </div>
                        </div>

                        {/* Price block */}
                        <div className="pd-price-block">
                            <span className="price-label">MRP (Inclusive of taxes)</span>
                            <div className="price-row">
                                <span className="amount">₹{product.price}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="pd-features-list">
                            {productFeatures.map((feat, i) => (
                                <li key={i}>
                                    {typeof feat === 'string' ? (
                                        <><CheckCircle size={18} /> {feat}</>
                                    ) : (
                                        <>{featureIconMap[feat.icon] || <CheckCircle size={18} />} {feat.label}</>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Actions card */}
                        <div className={`pd-actions-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
                            {isOutOfStock ? (
                                <div className="pd-out-of-stock-msg">
                                    <AlertTriangle size={20} />
                                    <span>This product is currently out of stock</span>
                                </div>
                            ) : (
                                <>
                                    <div className="pd-quantity-control">
                                        <span className="qty-label">Quantity</span>
                                        <div className="qty-counter">
                                            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                                <Minus size={16} />
                                            </button>
                                            <span>{quantity}</span>
                                            <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        {isLowStock && (
                                            <span className="stock-warning">Only {product.stock} left in stock</span>
                                        )}
                                    </div>

                                    <button
                                        className="btn-vedayura btn-vedayura-primary full-width"
                                        onClick={handleAddToCart}
                                    >
                                        Add to Cart — ₹{(product.price * quantity).toFixed(2)}
                                    </button>
                                </>
                            )}

                            <div className="pd-trust-badges">
                                <div className="trust-item"><Truck size={20} /><span>Free Shipping</span></div>
                                <div className="trust-item"><ShieldCheck size={20} /><span>Secure Checkout</span></div>
                                <div className="trust-item"><Package size={20} /><span>Discrete Packaging</span></div>
                            </div>
                        </div>

                        {/* ── Tabs ────────────────────────────────── */}
                        <div className="pd-info-tabs">
                            <div className="pd-tab-headers">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="pd-tab-content">

                                {/* Description */}
                                {activeTab === 'description' && (
                                    <div className="tab-description">
                                        {product.description ? (
                                            <p>{product.description}</p>
                                        ) : (
                                            <p className="tab-empty">No description available.</p>
                                        )}
                                    </div>
                                )}

                                {/* Benefits */}
                                {activeTab === 'benefits' && (
                                    <ul className="benefits-list">
                                        {product.benefits?.length > 0
                                            ? product.benefits.map((b, i) => (
                                                <li key={i}>
                                                    <CheckCircle size={20} />
                                                    <span>{b}</span>
                                                </li>
                                            ))
                                            : <p className="tab-empty">No benefits listed.</p>
                                        }
                                    </ul>
                                )}

                                {/* Ingredients */}
                                {activeTab === 'ingredients' && (
                                    <div className="tab-ingredients">
                                        {product.ingredients ? (
                                            <p className="ingredients-text">{product.ingredients}</p>
                                        ) : (
                                            <p className="tab-empty">Ingredients information not available.</p>
                                        )}
                                    </div>
                                )}

                                {/* How to Use */}
                                {activeTab === 'howToUse' && (
                                    <div className="tab-how-to-use">
                                        {product.howToUse ? (
                                            <p>{product.howToUse}</p>
                                        ) : (
                                            <p className="tab-empty">Usage instructions not available.</p>
                                        )}
                                    </div>
                                )}

                                {/* Specifications */}
                                {activeTab === 'specifications' && (
                                    <div className="tab-specifications">
                                        {Object.keys(specsData).length > 0 ? (
                                            <table className="specs-table">
                                                <tbody>
                                                    {Object.entries(specsData).map(([key, value]) => (
                                                        <tr key={key}>
                                                            <td className="spec-label">{key}</td>
                                                            <td className="spec-value">{value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="tab-empty">No specifications available.</p>
                                        )}
                                    </div>
                                )}

                                {/* Reviews */}
                                {activeTab === 'reviews' && (
                                    <div className="tab-reviews">

                                        {/* Rating overview */}
                                        {reviews.length > 0 ? (
                                            <>
                                                <div className="review-overview">
                                                    <div className="review-score-card">
                                                        <span className="big-rating">{product.rating?.toFixed(1) || '0.0'}</span>
                                                        <div className="review-score-stars">
                                                            {renderStars(product.rating, 20)}
                                                        </div>
                                                        <span className="total-reviews">
                                                            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                                        </span>
                                                    </div>
                                                    <div className="rating-bars">
                                                        {ratingBreakdown.map(({ star, count, percent }) => (
                                                            <div key={star} className="rating-bar-row">
                                                                <span className="bar-label">{star} ★</span>
                                                                <div className="bar-track">
                                                                    <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                                                                </div>
                                                                <span className="bar-count">{count}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Sort */}
                                                <div className="review-sort-row">
                                                    <label>Sort by:</label>
                                                    <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
                                                        <option value="newest">Newest First</option>
                                                        <option value="highest">Highest Rated</option>
                                                        <option value="lowest">Lowest Rated</option>
                                                    </select>
                                                </div>

                                                {/* Review cards */}
                                                <div className="review-list">
                                                    {visibleReviews.map((review, i) => (
                                                        <div key={review.id || i} className="review-card">
                                                            <div className="review-card-header">
                                                                <div className="review-user">
                                                                    <div className="review-avatar">
                                                                        <User size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <strong>{review.userName || 'Anonymous'}</strong>
                                                                        {review.verified && (
                                                                            <span className="verified-badge">
                                                                                <CheckCircle size={12} /> Verified Purchase
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span className="review-date">
                                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="review-stars">
                                                                {renderStars(review.rating, 14)}
                                                            </div>
                                                            {review.title && <h4 className="review-title">{review.title}</h4>}
                                                            <p className="review-text">{review.comment || review.text}</p>
                                                            {review.images?.length > 0 && (
                                                                <div className="review-images">
                                                                    {review.images.map((img, idx) => (
                                                                        <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="review-actions">
                                                                <button className="review-helpful-btn">
                                                                    <ThumbsUp size={14} /> Helpful ({review.helpfulCount || 0})
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {sortedReviews.length > 3 && (
                                                    <button
                                                        className="btn-show-all-reviews"
                                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                                    >
                                                        {showAllReviews ? 'Show Less' : `View All ${sortedReviews.length} Reviews`}
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <div className="no-reviews">
                                                <MessageSquare size={40} />
                                                <p>No reviews yet. Be the first to review this product!</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Video Section ───────────────────────────── */}
                {productVideos.length > 0 && (
                    <div className="pd-video-section">
                        <h2 className="section-title">Product Videos</h2>
                        <div className="pd-video-grid">
                            {productVideos.map((video, idx) => (
                                <div
                                    key={idx}
                                    className="pd-video-card"
                                    onClick={() => { setActiveVideo(video); setShowVideoModal(true); }}
                                >
                                    <div className="pd-video-thumb">
                                        <img src={video.thumbnail || galleryImages[0]} alt={video.title || `Video ${idx + 1}`} />
                                        <div className="pd-video-play-overlay">
                                            <Play size={40} />
                                        </div>
                                        {video.duration && (
                                            <span className="pd-video-duration">
                                                <Clock size={12} /> {video.duration}
                                            </span>
                                        )}
                                    </div>
                                    <div className="pd-video-info">
                                        <h4>{video.title || `Product Video ${idx + 1}`}</h4>
                                        {video.type && <span className="pd-video-type">{video.type}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Video Modal ─────────────────────────────── */}
                {showVideoModal && activeVideo && (
                    <div className="pd-video-modal-overlay" onClick={() => setShowVideoModal(false)}>
                        <div className="pd-video-modal" onClick={e => e.stopPropagation()}>
                            <button className="pd-video-modal-close" onClick={() => setShowVideoModal(false)}>
                                <X size={24} />
                            </button>
                            <video
                                src={activeVideo.url}
                                controls
                                autoPlay
                                className="pd-video-player"
                            />
                            {activeVideo.title && (
                                <div className="pd-video-modal-info">
                                    <h3>{activeVideo.title}</h3>
                                    {activeVideo.description && <p>{activeVideo.description}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Related Products ────────────────────────── */}
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