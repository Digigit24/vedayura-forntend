import {
    AlertTriangle,
    Award,
    BookOpen,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Droplet,
    Heart,
    Leaf,
    Minus,
    Package,
    Play,
    Plus,
    Share2,
    ShieldCheck,
    Truck,
    X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import TopMarquee from "../components/TopMarquee";
import { useShop } from '../context/ShopContext';
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

    // Wishlist check
    const isInWishlist = wishlist.some(item => String(item.id) === String(product?.id));

    // ─── Normalize helper ───────────────────────────────────────
    const normalizeProduct = (p) => {
        if (!p) return null;
        return {
            id: p.id,
            name: p.name,
            description: p.description || '',
            image: p.imageUrls?.[0] || '/assets/product-placeholder.png',
            images: p.imageUrls || ['/assets/product-placeholder.png'],
            videos: p.videoUrls || [],
            category: p.category?.name || (typeof p.category === 'string' ? p.category : 'Uncategorized'),
            price: p.discountedPrice || p.realPrice,
            realPrice: p.realPrice,
            discount_price: p.discountedPrice,
            stock: p.stockQuantity ?? p.stock, // Handle both if already normalized or raw
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
        };
    };

    // ─── Load product ───────────────────────────────────────────
    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);

            let contextProduct = null;
            if (products.length > 0) {
                const found = products.find(p => String(p.id) === String(id));
                if (found) {
                    contextProduct = normalizeProduct(found);
                    setProduct(contextProduct);
                }
            }

            // If we found a product in context that looks "complete" (has description & benefits), 
            // we can skip the API call to save bandwidth/time.
            // However, since the user reported missing details, we'll be aggressive and fetch 
            // unless we are 100% sure we have data.
            if (contextProduct && contextProduct.description && contextProduct.benefits?.length > 0) {
                setLoading(false);
                return;
            }

            // Fallback: Fetch from API (either not in context, or context data is incomplete)
            try {
                const res = await api.products.getById(id);
                if (res?.product) {
                    setProduct(normalizeProduct(res.product));
                } else {
                    // If API fails to find it, but we had a context product, keep the context product
                    if (!contextProduct) {
                        setProduct(null);
                    }
                }
            } catch (err) {
                console.error('Failed to load product:', err);
                // If API error, but we had context product, keep it
                if (!contextProduct) {
                    setProduct(null);
                }
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id, products]); // Re-run if ID or products context changes

    // ─── Retry when products load after initial render ──────────
    // This is useful if the user lands on the page, API fetch fails/is slow, 
    // but then the global context loads the products list successfully.
    useEffect(() => {
        if (products.length > 0) {
            // We only want to "upgrade" form context if we don't have a full product yet
            // OR if the current product is missing data that the context might have.
            const found = products.find(p => String(p.id) === String(id));
            if (found) {
                const normalizedFound = normalizeProduct(found);
                setProduct(prev => {
                    if (!prev) return normalizedFound;
                    // If we already have a description, assume we have good data (fetched from API)
                    // But if current state is missing description, update it from context
                    if (!prev.description && normalizedFound.description) {
                        return normalizedFound;
                    }
                    return prev;
                });
            }
        }
    }, [products, id]);

    // ─── Gallery images ─────────────────────────────────────────
    const galleryImages = product?.images?.length > 0
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
                        <Link to="/shop" className="btn btn-vedayura btn-vedayura-primary">
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
                                    className={`btn btn-icon pd-icon-btn ${isInWishlist ? 'active' : ''}`}
                                    onClick={handleWishlistToggle}
                                    title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                >
                                    <Heart size={20} fill={isInWishlist ? '#ef4444' : 'none'} color={isInWishlist ? '#ef4444' : '#fff'} />
                                </button>
                                <button className="btn btn-icon pd-icon-btn" onClick={handleShare} title="Share">
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
                                    className={`btn pd-thumb-btn ${currentImageIndex === idx ? 'active' : ''}`}
                                    onClick={() => goToSlide(idx)}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} />
                                </button>
                            ))}
                            {productVideos.map((video, idx) => (
                                <button
                                    key={`vid-${idx}`}
                                    className="btn pd-thumb-btn pd-thumb-video"
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
                                        className="btn btn-vedayura btn-vedayura-primary full-width"
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
                                        className={`btn tab-btn ${activeTab === tab.key ? 'active' : ''}`}
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
                            <button className="btn btn-icon pd-video-modal-close" onClick={() => setShowVideoModal(false)}>
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