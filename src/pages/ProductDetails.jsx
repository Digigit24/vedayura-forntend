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
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import TopMarquee from "../components/TopMarquee";
import { useShop } from '../context/ShopContext';
import './ProductDetails.css';

const SLIDE_DURATION = 600;

const VARIANT_LABELS = {
    CAPSULES: 'Capsules',
    LIQUID: 'Liquid',
    POWDER: 'Powder',
    OTHER: 'Other',
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, toggleWishlist, wishlist = [] } = useShop();

    const [product, setProduct] = useState(null);
    const [otherVariants, setOtherVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Slider state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(null);
    const [slideDirection, setSlideDirection] = useState(null);
    const [slidePhase, setSlidePhase] = useState('idle');
    const [isHovered, setIsHovered] = useState(false);
    const nextImageRef = useRef(null);

    // Video modal
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);

    // Touch/swipe support
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const isInWishlist = wishlist.some(item =>
        String(item.id) === String(product?.id) ||
        String(item.productId) === String(product?.id) ||
        String(item.product?.id) === String(product?.id)
    );

    const normalizeProduct = (p) => {
        if (!p) return null;
        const images = p.imageUrls || p.images || (p.image ? [p.image] : ['/assets/product-placeholder.png']);
        const mainImage = images[0] || '/assets/product-placeholder.png';
        return {
            id: p.id,
            name: p.name,
            description: p.description || '',
            image: mainImage,
            images: Array.isArray(images) ? images : [images],
            videos: p.videoUrls || p.videos || [],
            category: p.category?.name || (typeof p.category === 'string' ? p.category : 'Uncategorized'),
            price: Number(p.discountedPrice || p.realPrice || p.price || 0),
            realPrice: Number(p.realPrice || p.price || 0),
            discount_price: Number(p.discountedPrice || p.price || 0),
            stock: Number(p.stockQuantity ?? p.stock ?? 0),
            ingredients: p.ingredients || p.Ingredients || '',
            benefits: Array.isArray(p.benefits || p.Benefits) ? (p.benefits || p.Benefits) : [],
            howToUse: p.howToUse || p.usage || '',
            productType: p.productType || '',
            variant: p.variant || null,
            features: p.features || [],
            specifications: p.specifications || {},
            weight: p.weight || '',
            shelfLife: p.shelfLife || '',
            manufacturer: p.manufacturer || '',
            countryOfOrigin: p.countryOfOrigin || '',
        };
    };

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setOtherVariants([]);
            let contextProduct = null;
            if (products && products.length > 0) {
                const found = products.find(p => String(p.id) === String(id));
                if (found) {
                    contextProduct = normalizeProduct(found);
                    setProduct(contextProduct);
                    if (contextProduct.description && contextProduct.benefits?.length > 0) {
                        setLoading(false);
                    }
                }
            }
            try {
                const res = await api.products.getById(id);
                if (res?.product) {
                    setProduct(normalizeProduct(res.product));
                    setOtherVariants(res.product.otherVariants || []);
                } else if (!contextProduct) {
                    setProduct(null);
                }
            } catch (err) {
                console.error('Failed to load product:', err);
                if (!contextProduct) setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id, products]);

    useEffect(() => {
        if (products && products.length > 0 && !product) {
            const found = products.find(p => String(p.id) === String(id));
            if (found) setProduct(normalizeProduct(found));
        }
    }, [products, id, product]);

    const galleryImages = product?.images?.length > 0
        ? product.images
        : [product?.image || '/assets/product-placeholder.png'];

    const productVideos = product?.videos || [];

    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentIndex(0);
        setNextIndex(null);
        setSlideDirection(null);
        setSlidePhase('idle');
        setQuantity(1);
        setActiveTab('description');
        setShowVideoModal(false);
    }, [id]);

    const slideTo = useCallback((targetIndex, direction) => {
        if (slidePhase !== 'idle' || galleryImages.length <= 1) return;
        if (targetIndex === currentIndex) return;
        setNextIndex(targetIndex);
        setSlideDirection(direction);
        setSlidePhase('ready');
    }, [slidePhase, galleryImages.length, currentIndex]);

    useEffect(() => {
        if (slidePhase !== 'ready') return;
        const el = nextImageRef.current;
        if (el) el.getBoundingClientRect();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setSlidePhase('animating');
            });
        });
    }, [slidePhase]);

    useEffect(() => {
        if (slidePhase !== 'animating') return;
        const timer = setTimeout(() => {
            setCurrentIndex(nextIndex);
            setNextIndex(null);
            setSlideDirection(null);
            setSlidePhase('idle');
        }, SLIDE_DURATION);
        return () => clearTimeout(timer);
    }, [slidePhase, nextIndex]);

    const nextSlide = useCallback(() => {
        const target = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
        slideTo(target, 'right');
    }, [currentIndex, galleryImages.length, slideTo]);

    const prevSlide = useCallback(() => {
        const target = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
        slideTo(target, 'left');
    }, [currentIndex, galleryImages.length, slideTo]);

    const goToSlide = useCallback((index) => {
        const direction = index > currentIndex ? 'right' : 'left';
        slideTo(index, direction);
    }, [currentIndex, slideTo]);

    useEffect(() => {
        if (isHovered || galleryImages.length <= 1) return;
        const interval = setInterval(nextSlide, 4500);
        return () => clearInterval(interval);
    }, [isHovered, nextSlide, galleryImages.length]);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
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

    const relatedProducts = products
        .filter(p => p.category === product.category && String(p.id) !== String(product.id))
        .slice(0, 4);

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 50;

    const productFeatures = product.features?.length > 0
        ? product.features
        : [
            { icon: 'leaf', label: '100% Natural Ingredients' },
            { icon: 'shield', label: 'GMP Certified' },
            { icon: 'droplet', label: 'No Artificial Additives' },
        ];

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

    const handleWishlistToggle = () => {
        toggleWishlist(product);
        if (isInWishlist) {
            toast.success('Removed from wishlist', {
                style: { borderRadius: '12px', background: '#22371f', color: '#fff' },
            });
        } else {
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

    const handleVariantSwitch = (variantId) => {
        navigate(`/product/${variantId}`);
    };

    const tabs = [
        { key: 'description', label: 'Description', icon: <BookOpen size={16} /> },
        { key: 'benefits', label: 'Benefits', icon: <CheckCircle size={16} /> },
        { key: 'ingredients', label: 'Ingredients', icon: <Leaf size={16} /> },
    ];

    const getCurrentImageClass = () => {
        if (slidePhase === 'animating') {
            return slideDirection === 'right' ? 'slider-image slide-exit-left' : 'slider-image slide-exit-right';
        }
        return 'slider-image slide-center';
    };

    const getNextImageClass = () => {
        if (slidePhase === 'ready') {
            return slideDirection === 'right' ? 'slider-image slide-start-right' : 'slider-image slide-start-left';
        }
        if (slidePhase === 'animating') {
            return 'slider-image slide-center';
        }
        return 'slider-image';
    };

    // Build variant list: current product + other variants
    const allVariants = [];
    if (product.variant) {
        allVariants.push({
            id: product.id,
            variant: product.variant,
            price: product.price,
            stockQuantity: product.stock,
        });
    }
    otherVariants.forEach(v => {
        allVariants.push({
            id: v.id,
            variant: v.variant,
            price: Number(v.discountedPrice || v.realPrice || 0),
            stockQuantity: Number(v.stockQuantity ?? 0),
        });
    });

    const hasVariants = allVariants.length > 1;

    return (
        <div className="product-details-page">
            <TopMarquee />

            <div className="container">

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

                        <div
                            className="pd-main-image-card"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
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

                            <div
                                style={{
                                    position: "absolute",
                                    top: "16px",
                                    right: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    zIndex: 5
                                }}
                            >
                                <button
                                    onClick={handleWishlistToggle}
                                    title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                    aria-label="Toggle Wishlist"
                                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                                >
                                    <Heart size={28} stroke="#ef4444" fill={isInWishlist ? "#ef4444" : "none"} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    title="Share"
                                    aria-label="Share Product"
                                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                                >
                                    <Share2 size={28} stroke="#000000" />
                                </button>
                            </div>

                            {galleryImages.length > 1 && (
                                <button className="slider-arrow arrow-left" onClick={prevSlide}>
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            <div className="slider-frame">
                                <img
                                    key={`current-${currentIndex}`}
                                    src={galleryImages[currentIndex]}
                                    alt={product.name}
                                    className={getCurrentImageClass()}
                                />
                                {nextIndex !== null && (
                                    <img
                                        key={`next-${nextIndex}`}
                                        ref={nextImageRef}
                                        src={galleryImages[nextIndex]}
                                        alt={product.name}
                                        className={getNextImageClass()}
                                    />
                                )}
                            </div>

                            {galleryImages.length > 1 && (
                                <button className="slider-arrow arrow-right" onClick={nextSlide}>
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>

                        <div className="pd-thumbnails-grid">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={`img-${idx}`}
                                    className={`btn pd-thumb-btn ${currentIndex === idx ? 'active' : ''}`}
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

                        <div className="pd-header">
                            <h1 className="pd-title">
                                {product.name}
                                {product.productType && <span className="pd-product-type">({product.productType})</span>}
                            </h1>
                        </div>

                        {/* ── Variant Toggle Buttons ── */}
                        {hasVariants && (
                            <div className="pd-variant-toggle">
                                <span className="pd-variant-label">Available In:</span>
                                <div className="pd-variant-buttons">
                                    {allVariants.map((v) => (
                                        <button
                                            key={v.id}
                                            className={`pd-variant-btn ${v.id === product.id ? 'active' : ''} ${v.stockQuantity === 0 ? 'out-of-stock' : ''}`}
                                            onClick={() => {
                                                if (v.id !== product.id) handleVariantSwitch(v.id);
                                            }}
                                            disabled={v.stockQuantity === 0}
                                            title={v.stockQuantity === 0 ? 'Out of stock' : `Switch to ${VARIANT_LABELS[v.variant] || v.variant}`}
                                        >
                                            <span className="pd-variant-btn-name">
                                                {VARIANT_LABELS[v.variant] || v.variant}
                                            </span>
                                            <span className="pd-variant-btn-price">₹{v.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pd-price-block">
                            <span className="price-label">MRP (Inclusive of taxes)</span>
                            <div className="price-row">
                                <span className="amount">₹{product.price}</span>
                            </div>
                        </div>

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
                                {activeTab === 'description' && (
                                    <div className="tab-description">
                                        {product.description ? (
                                            <p>{product.description}</p>
                                        ) : (
                                            <p className="tab-empty">No description available.</p>
                                        )}
                                    </div>
                                )}

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
                                        <div className="pd-video-play-overlay"><Play size={40} /></div>
                                        {video.duration && (
                                            <span className="pd-video-duration"><Clock size={12} /> {video.duration}</span>
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

                {showVideoModal && activeVideo && (
                    <div className="pd-video-modal-overlay" onClick={() => setShowVideoModal(false)}>
                        <div className="pd-video-modal" onClick={e => e.stopPropagation()}>
                            <button className="btn btn-icon pd-video-modal-close" onClick={() => setShowVideoModal(false)}>
                                <X size={24} />
                            </button>
                            <video src={activeVideo.url} controls autoPlay className="pd-video-player" />
                            {activeVideo.title && (
                                <div className="pd-video-modal-info">
                                    <h3>{activeVideo.title}</h3>
                                    {activeVideo.description && <p>{activeVideo.description}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}

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