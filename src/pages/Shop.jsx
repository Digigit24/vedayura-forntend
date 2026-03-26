import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Search, X, SlidersHorizontal, Leaf, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './Shop.css';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
    })
};

const cardVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.45, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const CATS = ['All', 'Kit', 'Juice', 'Capsules', 'Powder', 'Coffee', 'Personal Care'];
const PER_PAGE = 12;

const Shop = () => {
    const { products } = useShop();
    const location  = useLocation();
    const params    = new URLSearchParams(location.search);
    const tabsRef   = useRef(null);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const imgScale   = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
    const imgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const [filtered,  setFiltered]  = useState(products);
    const [cat,       setCat]       = useState(params.get('category') || 'All');
    const [price,     setPrice]     = useState(2000);
    const [sort,      setSort]      = useState('featured');
    const [query,     setQuery]     = useState(params.get('search') || '');
    const [drawer,    setDrawer]    = useState(false);
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });
    const [page,      setPage]      = useState(1);

    /* sliding tab indicator */
    useEffect(() => {
        if (!tabsRef.current) return;
        const btn = tabsRef.current.querySelector('.cat-tab.active');
        if (!btn) return;
        const parent = tabsRef.current.getBoundingClientRect();
        const rect   = btn.getBoundingClientRect();
        setIndicator({ left: rect.left - parent.left, width: rect.width });
    }, [cat]);

    useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : ''; }, [drawer]);

    useEffect(() => {
        let r = [...products];
        if (cat !== 'All') r = r.filter(p => p.category === cat);
        if (query) {
            const q = query.toLowerCase();
            r = r.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
        }
        r = r.filter(p => (p.discount_price || p.price || 0) <= price);
        if (sort === 'price-low')  r.sort((a, b) => (a.discount_price||a.price||0) - (b.discount_price||b.price||0));
        if (sort === 'price-high') r.sort((a, b) => (b.discount_price||b.price||0) - (a.discount_price||a.price||0));
        const seen = new Set();
        r = r.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
        setFiltered(r);
        setPage(1);
    }, [cat, query, price, sort, products]);

    useEffect(() => {
        const c = params.get('category'), q = params.get('search');
        if (c) setCat(c);
        if (q) setQuery(q);
    }, [location.search]);

    const reset      = () => { setCat('All'); setPrice(2000); setSort('featured'); setQuery(''); };
    const hasFilters = cat !== 'All' || price < 2000 || sort !== 'featured' || query;

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const goToPage = (n) => {
        setPage(n);
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
    };

    return (
        <div className="shop-page">

            {/* ── PAGE HEADER ── */}
            <header className="shop-header" ref={heroRef}>
                <motion.div className="sh-text" initial="hidden" animate="visible">
                    <motion.span className="sh-eyebrow" variants={fadeUp} custom={0}>✦ Ayurvedic Wellness</motion.span>
                    <motion.h1 className="sh-heading" variants={fadeUp} custom={0.1}>
                        Our<br /><em>Collection.</em>
                    </motion.h1>
                    <motion.p className="sh-tagline" variants={fadeUp} custom={0.2}>15+ handcrafted formulations — capsules, juices, powders &amp; more.</motion.p>
                </motion.div>

                <motion.div
                    className="sh-hero-img-wrap"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ scale: imgScale, opacity: imgOpacity, transformOrigin: 'center bottom' }}
                >
                    <motion.img
                        src="/assets/all-products-tr.png"
                        alt="Vedayura product range"
                        className="sh-hero-img"
                        animate={{ y: [0, -14, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>

                <motion.div
                    className="sh-scroll-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                >
                    <motion.div
                        animate={{ y: [0, 7, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ChevronDown size={22} />
                    </motion.div>
                </motion.div>
            </header>

            {/* ── STICKY CONTROLS BAR (search + filter + category tabs) ── */}
            <div className="shop-bar">
                {/* row 1: search + filter */}
                <div className="bar-top-row">
                    <div className="bar-search">
                        <Search size={14} />
                        <input
                            placeholder="Search products…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {query && <button className="bar-clear" onClick={() => setQuery('')}><X size={12} /></button>}
                    </div>
                    <button className={`bar-filter${hasFilters ? ' on' : ''}`} onClick={() => setDrawer(true)}>
                        <SlidersHorizontal size={14} />
                        <span>Filter & Sort</span>
                        {hasFilters && <em className="bar-dot" />}
                    </button>
                    <p className="cat-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
                </div>

                {/* row 2: category tabs */}
                <div className="cat-tabs" ref={tabsRef}>
                    <span
                        className="cat-indicator"
                        style={{ left: indicator.left, width: indicator.width }}
                    />
                    {CATS.map(c => {
                        const n = c === 'All' ? products.length : products.filter(p => p.category === c).length;
                        return (
                            <button
                                key={c}
                                className={`cat-tab${cat === c ? ' active' : ''}`}
                                onClick={() => setCat(c)}
                            >
                                {c}
                                <span className="cat-n">{n}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── GRID ── */}
            <main className="shop-main">
                {filtered.length > 0 ? (
                    <>
                        <div className="product-grid">
                            <AnimatePresence>
                                {paged.map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        custom={i}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <ProductCard product={p} activeCategory={cat} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pg-btn"
                                    disabled={page === 1}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    ← Prev
                                </button>

                                <div className="pg-pages">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
                                        const isEdge = n === 1 || n === totalPages;
                                        const isNear = Math.abs(n - page) <= 1;
                                        if (!isEdge && !isNear) {
                                            if (n === 2 || n === totalPages - 1) return <span key={n} className="pg-ellipsis">…</span>;
                                            return null;
                                        }
                                        return (
                                            <button
                                                key={n}
                                                className={`pg-num${page === n ? ' active' : ''}`}
                                                onClick={() => goToPage(n)}
                                            >
                                                {n}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    className="pg-btn"
                                    disabled={page === totalPages}
                                    onClick={() => goToPage(page + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Search size={28} strokeWidth={1} />
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filters.</p>
                        <button onClick={reset}>Reset</button>
                    </motion.div>
                )}
            </main>

            {/* ── FILTER DRAWER (left) ── */}
            <div className={`drw-bg${drawer ? ' on' : ''}`} onClick={() => setDrawer(false)} />
            <div className={`drw${drawer ? ' on' : ''}`}>
                <div className="drw-head">
                    <h3>Filter & Sort</h3>
                    <button onClick={() => setDrawer(false)}><X size={18} /></button>
                </div>

                <div className="drw-body">
                    {/* Category */}
                    <div className="drw-sec">
                        <p className="drw-lbl">Category</p>
                        {CATS.map(c => {
                            const n = c === 'All' ? products.length : products.filter(p => p.category === c).length;
                            return (
                                <button
                                    key={c}
                                    className={`drw-row${cat === c ? ' on' : ''}`}
                                    onClick={() => setCat(c)}
                                >
                                    <span>{c}</span>
                                    <span className="drw-n">{n}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort */}
                    <div className="drw-sec">
                        <p className="drw-lbl">Sort By</p>
                        {[
                            ['featured',   'Featured'],
                            ['price-low',  'Price: Low → High'],
                            ['price-high', 'Price: High → Low'],
                        ].map(([v, l]) => (
                            <button key={v} className={`drw-row${sort === v ? ' on' : ''}`} onClick={() => setSort(v)}>
                                <span>{l}</span>
                                {sort === v && <span className="drw-tick">✓</span>}
                            </button>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="drw-sec">
                        <div className="drw-row-between">
                            <p className="drw-lbl">Max Price</p>
                            <span className="drw-pval">₹{price}</span>
                        </div>
                        <input
                            type="range" min="0" max="2000" step="100"
                            value={price}
                            onChange={e => setPrice(Number(e.target.value))}
                            className="drw-range"
                        />
                        <div className="drw-range-ends"><span>₹0</span><span>₹2,000</span></div>
                    </div>

                    {/* Trust */}
                    <div className="drw-trust">
                        <span><Leaf size={11} /> 100% Natural</span>
                        <span><ShieldCheck size={11} /> GMP Certified</span>
                    </div>
                </div>

                <div className="drw-foot">
                    {hasFilters && <button className="drw-reset" onClick={reset}>Clear All</button>}
                    <button className="drw-apply" onClick={() => setDrawer(false)}>
                        Show {filtered.length} Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Shop;
