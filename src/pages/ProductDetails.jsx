import {
  AlertTriangle, Award, CheckCircle,
  ChevronLeft, ChevronRight, Clock,
  FlaskConical, Heart, Minus,
  Package, Play, Plus, RotateCcw, Share2,
  ShieldCheck, Sparkles, Star, Truck, X, Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import TopMarquee from '../components/TopMarquee';
import { useShop } from '../context/ShopContext';
import './ProductDetails.css';

const SLIDE_DURATION = 500;
const VARIANT_LABELS = { CAPSULES: 'Capsules', LIQUID: 'Liquid', POWDER: 'Powder', OTHER: 'Other' };

const Stars = ({ rating = 4.5 }) => (
  <div className="pd-stars">
    {[1,2,3,4,5].map(n => (
      <Star key={n} size={13} className={n <= Math.floor(rating) ? 'star-filled' : n - rating < 1 ? 'star-half' : 'star-empty'} />
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist = [], user } = useShop();

  const [product, setProduct]           = useState(null);
  const [otherVariants, setOtherVariants] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [quantity, setQuantity]         = useState(1);
  const [activeTab, setActiveTab]       = useState('overview');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex]       = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);
  const [slidePhase, setSlidePhase]     = useState('idle');
  const nextImageRef = useRef(null);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideo, setActiveVideo]       = useState(null);

  const [reviews, setReviews]             = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating]   = useState(0);
  const [reviewHover, setReviewHover]     = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isInWishlist = wishlist.some(item =>
    String(item.id) === String(product?.id) ||
    String(item.productId) === String(product?.id) ||
    String(item.product?.id) === String(product?.id)
  );

  const normalizeProduct = (p) => {
    if (!p) return null;
    const images = p.imageUrls || p.images || (p.image ? [p.image] : ['/assets/product-placeholder.png']);
    return {
      id: p.id, name: p.name,
      description: p.description || '',
      image: images[0] || '/assets/product-placeholder.png',
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
      weight: p.weight || '',
      shelfLife: p.shelfLife || '',
      manufacturer: p.manufacturer || '',
      countryOfOrigin: p.countryOfOrigin || '',
    };
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true); setOtherVariants([]);
      let ctx = null;
      if (products?.length) {
        const found = products.find(p => String(p.id) === String(id));
        if (found) { ctx = normalizeProduct(found); setProduct(ctx); if (ctx.description && ctx.benefits?.length) setLoading(false); }
      }
      try {
        const res = await api.products.getById(id);
        if (res?.product) { setProduct(normalizeProduct(res.product)); setOtherVariants(res.product.otherVariants || []); }
        else if (!ctx) setProduct(null);
      } catch { if (!ctx) setProduct(null); }
      finally { setLoading(false); }
    };
    load();
  }, [id, products]);

  useEffect(() => {
    if (products?.length && !product) {
      const found = products.find(p => String(p.id) === String(id));
      if (found) setProduct(normalizeProduct(found));
    }
  }, [products, id, product]);

  const galleryImages = product?.images?.length ? product.images : [product?.image || '/assets/product-placeholder.png'];
  const productVideos = product?.videos || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentIndex(0); setNextIndex(null); setSlideDirection(null); setSlidePhase('idle');
    setQuantity(1); setShowVideoModal(false); setActiveTab('overview');
    setReviews([]); setReviewRating(0); setReviewComment('');
  }, [id]);

  useEffect(() => {
    if (!product?.id) return;
    setReviewsLoading(true);
    api.reviews.getByProduct(product.id)
      .then(data => setReviews(Array.isArray(data) ? data : data?.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [product?.id]);

  const slideTo = useCallback((target, dir) => {
    if (slidePhase !== 'idle' || galleryImages.length <= 1 || target === currentIndex) return;
    setNextIndex(target); setSlideDirection(dir); setSlidePhase('ready');
  }, [slidePhase, galleryImages.length, currentIndex]);

  useEffect(() => {
    if (slidePhase !== 'ready') return;
    const el = nextImageRef.current;
    if (el) el.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => setSlidePhase('animating')));
  }, [slidePhase]);

  useEffect(() => {
    if (slidePhase !== 'animating') return;
    const t = setTimeout(() => { setCurrentIndex(nextIndex); setNextIndex(null); setSlideDirection(null); setSlidePhase('idle'); }, SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [slidePhase, nextIndex]);

  const nextSlide = useCallback(() => slideTo(currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1, 'right'), [currentIndex, galleryImages.length, slideTo]);
  const prevSlide = useCallback(() => slideTo(currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1, 'left'), [currentIndex, galleryImages.length, slideTo]);
  const goToSlide = useCallback(i => slideTo(i, i > currentIndex ? 'right' : 'left'), [currentIndex, slideTo]);

  const getCurClass = () => slidePhase === 'animating'
    ? `slider-img ${slideDirection === 'right' ? 'exit-left' : 'exit-right'}`
    : 'slider-img center';

  const getNxtClass = () => {
    if (slidePhase === 'ready') return `slider-img ${slideDirection === 'right' ? 'enter-right' : 'enter-left'}`;
    if (slidePhase === 'animating') return 'slider-img center';
    return 'slider-img';
  };

  const ts = { borderRadius: '8px', background: '#111', color: '#fff', fontSize: '0.82rem' };

  if (loading) return (
    <div className="pd-page">
      <TopMarquee />
      <div className="pd-loading"><div className="pd-spinner" /><p>Loading</p></div>
    </div>
  );

  if (!product) return (
    <div className="pd-page">
      <TopMarquee />
      <div className="pd-not-found">
        <Package size={36} strokeWidth={1.2} />
        <h2>Product not found</h2>
        <p>This product doesn't exist or has been removed.</p>
        <Link to="/shop" className="pd-btn-dark">Back to Shop</Link>
      </div>
    </div>
  );

  const isOutOfStock  = product.stock === 0;
  const isLowStock    = product.stock > 0 && product.stock < 50;
  const discountPct   = product.realPrice > product.discount_price ? Math.round((1 - product.discount_price / product.realPrice) * 100) : 0;
  const savingsAmount = product.realPrice > product.discount_price ? (product.realPrice - product.discount_price).toFixed(0) : 0;

  const allVariants = [];
  if (product.variant) allVariants.push({ id: product.id, variant: product.variant, price: product.price, stockQuantity: product.stock });
  otherVariants.forEach(v => allVariants.push({ id: v.id, variant: v.variant, price: Number(v.discountedPrice || v.realPrice || 0), stockQuantity: Number(v.stockQuantity ?? 0) }));
  const hasVariants = allVariants.length > 1;

  const productFeatures = product.features?.length ? product.features : [
    { label: '100% Natural & Pure' },
    { label: 'GMP Certified Facility' },
    { label: 'No Artificial Additives' },
  ];

  const howToUseSteps = product.howToUse
    ? product.howToUse.split(/\.\s+|\n/).filter(s => s.trim().length > 3).slice(0, 6)
    : [];

  const specs = [
    product.weight        && { key: 'Net Weight',         val: product.weight },
    product.shelfLife     && { key: 'Shelf Life',          val: product.shelfLife },
    product.manufacturer  && { key: 'Manufactured By',     val: product.manufacturer },
    product.countryOfOrigin && { key: 'Country of Origin', val: product.countryOfOrigin },
    { key: 'Category', val: product.category },
    product.productType   && { key: 'Form',                val: product.productType },
  ].filter(Boolean);

  const relatedProducts = products.filter(p => p.category === product.category && String(p.id) !== String(product.id)).slice(0, 4);

  const handleShare    = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); toast.success('Link copied!', { style: ts }); }
    } catch {}
  };
  const handleWishlist    = () => { toggleWishlist(product); toast.success(isInWishlist ? 'Removed from wishlist' : 'Saved to wishlist', { style: ts }); };
  const handleQty         = val => { const n = quantity + val; if (n >= 1 && n <= (product.stock || 99)) setQuantity(n); };
  const handleAddToCart   = () => { if (isOutOfStock) return; addToCart(product, quantity); toast.success(`Added to cart`, { style: ts, icon: '✓' }); };

  // Review stats
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;
  const starCounts = [5,4,3,2,1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100) : 0,
  }));

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { toast.error('Please select a star rating', { style: ts }); return; }
    setSubmittingReview(true);
    try {
      const saved = await api.reviews.create(product.id, { rating: reviewRating, comment: reviewComment.trim() });
      const newReview = saved?.review || saved;
      setReviews(prev => [{ ...newReview, user: { name: user?.name || 'You' } }, ...prev]);
      setReviewRating(0); setReviewComment('');
      toast.success('Review submitted!', { style: ts });
    } catch {
      toast.error('Could not submit review', { style: ts });
    } finally {
      setSubmittingReview(false);
    }
  };

  // tabs config
  const tabs = [
    product.description || product.benefits?.length ? { id: 'overview', label: 'Overview' } : null,
    product.ingredients                             ? { id: 'ingredients', label: 'Ingredients' } : null,
    howToUseSteps.length                            ? { id: 'usage', label: 'How to Use' } : null,
    specs.length                                    ? { id: 'details', label: 'Details' } : null,
    { id: 'reviews', label: `Reviews${reviews.length ? ` (${reviews.length})` : ''}` },
  ].filter(Boolean);

  return (
    <div className="pd-page">
      <TopMarquee />

      {/* Breadcrumb */}
      <div className="pd-breadcrumb-bar">
        <div className="pd-breadcrumb-inner">
          <nav className="pd-breadcrumbs">
            <Link to="/">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop">Shop</Link>
            {product.category && <><ChevronRight size={10} /><Link to={`/shop?category=${product.category}`}>{product.category}</Link></>}
            <ChevronRight size={10} />
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── 2-COL HERO ── */}
      <div className="pd-hero-wrap">
        <div className="pd-hero">

          {/* LEFT: Gallery */}
          <div className="pd-gallery">
            {/* Main image */}
            <div className="pd-main-img-box">
              {/* Badges */}
              <div className="pd-badges">
                {discountPct > 0 && <span className="pd-badge pd-badge-sale">{discountPct}% off</span>}
                {isOutOfStock && <span className="pd-badge pd-badge-oos">Sold Out</span>}
                {isLowStock && !isOutOfStock && <span className="pd-badge pd-badge-low"><Zap size={9} /> Low Stock</span>}
              </div>

              {/* Floating actions */}
              <div className="pd-img-actions">
                <button className={`pd-img-btn${isInWishlist ? ' wished' : ''}`} onClick={handleWishlist}>
                  <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
                </button>
                <button className="pd-img-btn" onClick={handleShare}>
                  <Share2 size={16} />
                </button>
              </div>

              {/* Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button className="pd-arrow pd-arrow-prev" onClick={prevSlide}><ChevronLeft size={18} /></button>
                  <button className="pd-arrow pd-arrow-next" onClick={nextSlide}><ChevronRight size={18} /></button>
                </>
              )}

              {/* Slider */}
              <div className="pd-img-frame">
                <img key={`c-${currentIndex}`} src={galleryImages[currentIndex]} alt={product.name} className={getCurClass()} />
                {nextIndex !== null && (
                  <img key={`n-${nextIndex}`} ref={nextImageRef} src={galleryImages[nextIndex]} alt={product.name} className={getNxtClass()} />
                )}
              </div>

              {/* Dot indicators */}
              {galleryImages.length > 1 && (
                <div className="pd-dots">
                  {galleryImages.map((_, i) => (
                    <button key={i} className={`pd-dot${currentIndex === i ? ' active' : ''}`} onClick={() => goToSlide(i)} />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails row */}
            <div className="pd-thumbs">
              {galleryImages.slice(0, 5).map((img, i) => (
                <button key={i} className={`pd-thumb${currentIndex === i ? ' active' : ''}`} onClick={() => goToSlide(i)}>
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
              {productVideos.slice(0, 1).map((v, i) => (
                <button key={`v${i}`} className="pd-thumb pd-thumb-vid" onClick={() => { setActiveVideo(v); setShowVideoModal(true); }}>
                  <img src={v.thumbnail || galleryImages[0]} alt="Video" />
                  <span className="pd-thumb-play-icon"><Play size={10} /></span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="pd-info">
            {/* Category + type */}
            <div className="pd-info-meta">
              <span className="pd-meta-cat">{product.category}</span>
              {product.productType && <span className="pd-meta-type">{product.productType}</span>}
            </div>

            {/* Title */}
            <h1 className="pd-title">{product.name}</h1>

            {/* Rating */}
            <div className="pd-rating-row">
              <Stars rating={avgRating || 4.5} />
              <span className="pd-rating-val">{avgRating || '—'}</span>
              <span className="pd-rating-count">{reviews.length ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet'}</span>
            </div>

            <div className="pd-info-divider" />

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price">₹{product.discount_price || product.price}</span>
              {product.realPrice > product.discount_price && (
                <span className="pd-price-mrp">₹{product.realPrice}</span>
              )}
              {savingsAmount > 0 && (
                <span className="pd-price-save">Save ₹{savingsAmount}</span>
              )}
            </div>
            <span className="pd-tax-note">Inclusive of all taxes</span>

            {/* Short description */}
            {product.description && (
              <p className="pd-info-desc">{product.description}</p>
            )}

            {/* Variants */}
            {hasVariants && (
              <div className="pd-variants">
                <span className="pd-field-label">Variant</span>
                <div className="pd-variant-list">
                  {allVariants.map(v => (
                    <button
                      key={v.id}
                      className={`pd-variant-btn${v.id === product.id ? ' active' : ''}${v.stockQuantity === 0 ? ' oos' : ''}`}
                      onClick={() => { if (v.id !== product.id && v.stockQuantity > 0) navigate(`/product/${v.id}`); }}
                      disabled={v.stockQuantity === 0}
                    >
                      {VARIANT_LABELS[v.variant] || v.variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features checklist */}
            <ul className="pd-features-list">
              {productFeatures.slice(0, 4).map((f, i) => (
                <li key={i}>
                  <CheckCircle size={13} />
                  <span>{typeof f === 'string' ? f : f.label}</span>
                </li>
              ))}
            </ul>

            {/* Highlights row */}
            <div className="pd-highlights-row">
              <div className="pd-highlight">
                <FlaskConical size={16} />
                <span>Lab Tested</span>
              </div>
              <div className="pd-highlight">
                <Award size={16} />
                <span>GMP Certified</span>
              </div>
              <div className="pd-highlight">
                <ShieldCheck size={16} />
                <span>100% Natural</span>
              </div>
              <div className="pd-highlight">
                <Zap size={16} />
                <span>Fast Acting</span>
              </div>
            </div>

            <div className="pd-info-divider" />

            {/* Stock */}
            {!isOutOfStock && (
              <div className="pd-stock-line">
                <span className={`pd-stock-dot${isLowStock ? ' low' : ''}`} />
                <span>{isLowStock ? `Only ${product.stock} left` : 'In Stock'}</span>
              </div>
            )}

            {/* OOS */}
            {isOutOfStock ? (
              <div className="pd-oos-msg">
                <AlertTriangle size={15} />
                <span>Currently unavailable</span>
              </div>
            ) : (
              <>
                {/* Qty */}
                <div className="pd-qty-row">
                  <span className="pd-field-label">Quantity</span>
                  <div className="pd-qty">
                    <button onClick={() => handleQty(-1)} disabled={quantity <= 1}><Minus size={13} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => handleQty(1)} disabled={quantity >= product.stock}><Plus size={13} /></button>
                  </div>
                </div>

                {/* CTA */}
                <button className="pd-cta" onClick={handleAddToCart}>
                  Add to Cart
                  <span className="pd-cta-price">₹{(product.price * quantity).toFixed(0)}</span>
                </button>
              </>
            )}

            {/* Wishlist */}
            <button className={`pd-wishlist-btn${isInWishlist ? ' active' : ''}`} onClick={handleWishlist}>
              <Heart size={14} fill={isInWishlist ? 'currentColor' : 'none'} />
              {isInWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Delivery */}
            <div className="pd-delivery-strip">
              <div className="pd-delivery-item">
                <Truck size={14} />
                <span>Free delivery over ₹999</span>
              </div>
              <div className="pd-delivery-item">
                <RotateCcw size={14} />
                <span>7-day returns</span>
              </div>
              <div className="pd-delivery-item">
                <ShieldCheck size={14} />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL-WIDTH TAB PANEL ── */}
      {tabs.length > 0 && (
        <div className="pd-tabs-section">
          <div className="pd-tabs-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`pd-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pd-tab-body">
            <div className="pd-tab-content-wrap">
              <div className="pd-tab-layout">

                {/* ── Main content ── */}
                <div className="pd-tab-main">

                  {/* OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="pd-tab-pane">
                      {product.description && (
                        <div className="pd-tab-block">
                          <h3 className="pd-tab-sub">About this product</h3>
                          <p className="pd-overview-text">{product.description}</p>
                        </div>
                      )}
                      {product.benefits?.length > 0 && (
                        <div className="pd-tab-block">
                          <h3 className="pd-tab-sub">Key Benefits</h3>
                          <div className="pd-benefits-grid">
                            {product.benefits.map((b, i) => (
                              <div key={i} className="pd-benefit-card">
                                <Sparkles size={13} />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* INGREDIENTS */}
                  {activeTab === 'ingredients' && (
                    <div className="pd-tab-pane">
                      <div className="pd-tab-block">
                        <h3 className="pd-tab-sub">Ingredients</h3>
                        <p className="pd-ingredients-text">{product.ingredients}</p>
                      </div>
                      <div className="pd-ingr-notice">
                        <ShieldCheck size={14} />
                        <span>All ingredients are sourced from certified organic farms and tested for purity before use.</span>
                      </div>
                    </div>
                  )}

                  {/* HOW TO USE */}
                  {activeTab === 'usage' && (
                    <div className="pd-tab-pane">
                      <div className="pd-tab-block">
                        <h3 className="pd-tab-sub">How to Use</h3>
                        <ol className="pd-steps">
                          {howToUseSteps.map((step, i) => (
                            <li key={i}>
                              <span className="pd-step-num">{i + 1}</span>
                              <p>{step.trim()}{step.trim().endsWith('.') ? '' : '.'}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="pd-usage-tip">
                        <span className="pd-usage-tip-label">Pro Tip</span>
                        <span>For best results, use consistently for at least 4–6 weeks as part of your daily wellness routine.</span>
                      </div>
                    </div>
                  )}

                  {/* DETAILS */}
                  {activeTab === 'details' && (
                    <div className="pd-tab-pane">
                      <div className="pd-tab-block">
                        <h3 className="pd-tab-sub">Product Specifications</h3>
                        <table className="pd-specs-table">
                          <tbody>
                            {specs.map((s, i) => (
                              <tr key={i}>
                                <td className="spec-key">{s.key}</td>
                                <td className="spec-val">{s.val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* REVIEWS */}
                  {activeTab === 'reviews' && (
                    <div className="pd-tab-pane">

                      {/* Rating summary */}
                      {reviews.length > 0 && (
                        <div className="pd-reviews-summary">
                          <div className="pd-reviews-score">
                            <span className="pd-score-big">{avgRating.toFixed(1)}</span>
                            <Stars rating={avgRating} />
                            <span className="pd-score-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="pd-rating-bars">
                            {starCounts.map(({ star, count, pct }) => (
                              <div key={star} className="pd-bar-row">
                                <span className="pd-bar-label">{star}</span>
                                <Star size={11} className="pd-bar-star" />
                                <div className="pd-bar-track">
                                  <div className="pd-bar-fill" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="pd-bar-count">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Review list */}
                      {reviewsLoading ? (
                        <div className="pd-reviews-loading">
                          <div className="pd-spinner" />
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="pd-reviews-empty">
                          <Star size={32} strokeWidth={1.2} />
                          <p>No reviews yet. Be the first to share your experience!</p>
                        </div>
                      ) : (
                        <div className="pd-review-list">
                          {reviews.map((r, i) => {
                            const name = r.user?.name || r.userName || 'Anonymous';
                            const initial = name.charAt(0).toUpperCase();
                            const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                            return (
                              <div key={r.id || i} className="pd-review-card">
                                <div className="pd-review-header">
                                  <span className="pd-review-avatar">{initial}</span>
                                  <div className="pd-review-meta">
                                    <span className="pd-review-name">{name}</span>
                                    <div className="pd-review-stars">
                                      {[1,2,3,4,5].map(n => (
                                        <Star key={n} size={11} className={n <= r.rating ? 'star-filled' : 'star-empty'} />
                                      ))}
                                    </div>
                                  </div>
                                  {date && <span className="pd-review-date">{date}</span>}
                                </div>
                                {r.comment && <p className="pd-review-body">{r.comment}</p>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Submit review */}
                      {user ? (
                        <form className="pd-review-form" onSubmit={handleSubmitReview}>
                          <h3 className="pd-tab-sub" style={{ marginBottom: '14px' }}>Write a Review</h3>
                          <div className="pd-star-picker">
                            <span className="pd-star-label">Your rating</span>
                            <div className="pd-star-inputs">
                              {[1,2,3,4,5].map(n => (
                                <button
                                  key={n} type="button"
                                  className={`pd-star-btn${(reviewHover || reviewRating) >= n ? ' lit' : ''}`}
                                  onMouseEnter={() => setReviewHover(n)}
                                  onMouseLeave={() => setReviewHover(0)}
                                  onClick={() => setReviewRating(n)}
                                >
                                  <Star size={22} fill={(reviewHover || reviewRating) >= n ? 'currentColor' : 'none'} />
                                </button>
                              ))}
                              {reviewRating > 0 && (
                                <span className="pd-star-hint">{['','Poor','Fair','Good','Very Good','Excellent'][reviewRating]}</span>
                              )}
                            </div>
                          </div>
                          <textarea
                            className="pd-review-textarea"
                            placeholder="Share your experience with this product (optional)"
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            rows={4}
                          />
                          <button type="submit" className="pd-review-submit" disabled={submittingReview}>
                            {submittingReview ? 'Submitting…' : 'Submit Review'}
                          </button>
                        </form>
                      ) : (
                        <div className="pd-review-login-prompt">
                          <span>Please <a href="/login">sign in</a> to leave a review.</span>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* ── Sticky sidebar ── */}
                <aside className="pd-tab-sidebar">
                  <div className="pd-sidebar-card">
                    <img src={galleryImages[0]} alt={product.name} className="pd-sidebar-img" />
                    <div className="pd-sidebar-body">
                      <p className="pd-sidebar-name">{product.name}</p>
                      <div className="pd-sidebar-price-row">
                        <span className="pd-sidebar-price">₹{product.discount_price || product.price}</span>
                        {product.realPrice > product.discount_price && (
                          <span className="pd-sidebar-mrp">₹{product.realPrice}</span>
                        )}
                      </div>
                      {isOutOfStock ? (
                        <div className="pd-sidebar-oos">Currently unavailable</div>
                      ) : (
                        <button className="pd-sidebar-cta" onClick={handleAddToCart}>Add to Cart</button>
                      )}
                      <div className="pd-sidebar-meta">
                        <span><Truck size={12} /> Free delivery over ₹999</span>
                        <span><RotateCcw size={12} /> 7-day returns</span>
                      </div>
                    </div>
                  </div>
                </aside>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust strip */}
      <div className="pd-trust-strip">
        {[
          { icon: <ShieldCheck size={18} />, label: 'Secure Checkout', sub: '256-bit SSL' },
          { icon: <RotateCcw size={18} />,   label: 'Easy Returns',     sub: '7-day policy' },
          { icon: <Package size={18} />,     label: 'Discreet Packing', sub: 'Unmarked boxes' },
          { icon: <Award size={18} />,       label: 'GMP Certified',    sub: 'Quality assured' },
        ].map((t, i) => (
          <div key={i} className="pd-trust-item">
            {t.icon}
            <div>
              <strong>{t.label}</strong>
              <span>{t.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Videos */}
      {productVideos.length > 0 && (
        <div className="pd-section-wrap">
          <h2 className="pd-section-heading">Product Videos</h2>
          <div className="pd-videos-grid">
            {productVideos.map((video, i) => (
              <div key={i} className="pd-video-card" onClick={() => { setActiveVideo(video); setShowVideoModal(true); }}>
                <div className="pd-video-thumb">
                  <img src={video.thumbnail || galleryImages[0]} alt={video.title || `Video ${i + 1}`} />
                  <div className="pd-video-play"><Play size={20} /></div>
                  {video.duration && <span className="pd-video-dur"><Clock size={9} /> {video.duration}</span>}
                </div>
                <p className="pd-video-title">{video.title || `Video ${i + 1}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video modal */}
      {showVideoModal && activeVideo && (
        <div className="pd-modal-backdrop" onClick={() => setShowVideoModal(false)}>
          <div className="pd-modal" onClick={e => e.stopPropagation()}>
            <button className="pd-modal-close" onClick={() => setShowVideoModal(false)}><X size={18} /></button>
            <video src={activeVideo.url} controls autoPlay className="pd-modal-video" />
          </div>
        </div>
      )}

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="pd-section-wrap pd-related">
          <h2 className="pd-section-heading">You May Also Like</h2>
          <div className="pd-product-grid">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Mobile sticky bar */}
      <div className="pd-mobile-bar">
        <div className="pd-mobile-price-col">
          <span className="pd-mobile-price">₹{product.discount_price || product.price}</span>
          {product.realPrice > product.discount_price && <span className="pd-mobile-mrp">₹{product.realPrice}</span>}
        </div>
        {isOutOfStock
          ? <div className="pd-mobile-oos"><AlertTriangle size={14} /> Sold Out</div>
          : <button className="pd-mobile-cta" onClick={handleAddToCart}>Add to Cart</button>
        }
      </div>
    </div>
  );
};

export default ProductDetails;
