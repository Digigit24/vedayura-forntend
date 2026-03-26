import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { Search, X, Leaf, ShieldCheck, Star } from 'lucide-react';
import './Catalog.css';

const CATEGORIES = ['Kit', 'Juice', 'Capsules', 'Powder', 'Coffee', 'Personal Care'];

const MARQUEE_ITEMS = [
    '100% Ayurvedic', 'GMP Certified', 'Handcrafted', 'Ancient Wisdom',
    'Modern Purity', 'Natural Ingredients', 'Vedayura Collection', 'Wellness Redefined',
];

const Catalog = () => {
    const { products } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeNav, setActiveNav] = useState(null);
    const sectionRefs = useRef({});

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleCategories = CATEGORIES.filter(cat =>
        filteredProducts.some(p => p.category === cat)
    );

    const scrollTo = (cat) => {
        setActiveNav(cat);
        sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="cl-page">

            {/* ── TOP ACCENT BAR ── */}
            <div className="cl-top-bar" />

            {/* ── HERO ── */}
            <section className="cl-hero">
                {/* decorative rings */}
                <div className="cl-ring cl-ring-1" />
                <div className="cl-ring cl-ring-2" />
                <div className="cl-ring cl-ring-3" />

                {/* giant ghost word */}
                <div className="cl-hero-ghost" aria-hidden="true">Catalog</div>

                <div className="cl-hero-content">
                    <motion.span
                        className="cl-eyebrow"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                    >
                        ✦ Vedayura — Product Catalog
                    </motion.span>

                    <motion.h1
                        className="cl-hero-title"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        The Complete<br /><em>Collection.</em>
                    </motion.h1>

                    <motion.p
                        className="cl-hero-sub"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Handcrafted Ayurvedic formulations — ancient knowledge, modern purity standards.
                    </motion.p>

                    {/* stats row */}
                    <motion.div
                        className="cl-hero-stats"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.28 }}
                    >
                        <div className="cl-hstat">
                            <span className="cl-hstat-n">{products.length}+</span>
                            <span className="cl-hstat-l">Products</span>
                        </div>
                        <div className="cl-hstat-sep" />
                        <div className="cl-hstat">
                            <span className="cl-hstat-n">{CATEGORIES.length}</span>
                            <span className="cl-hstat-l">Categories</span>
                        </div>
                        <div className="cl-hstat-sep" />
                        <div className="cl-hstat">
                            <span className="cl-hstat-n">100%</span>
                            <span className="cl-hstat-l">Ayurvedic</span>
                        </div>
                        <div className="cl-hstat-sep" />
                        <div className="cl-hstat">
                            <span className="cl-hstat-n">GMP</span>
                            <span className="cl-hstat-l">Certified</span>
                        </div>
                    </motion.div>

                    {/* search */}
                    <motion.div
                        className="cl-search"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.35 }}
                    >
                        <Search size={15} className="cl-search-icon" />
                        <input
                            placeholder="Search products…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="cl-search-x" onClick={() => setSearchTerm('')}>
                                <X size={13} />
                            </button>
                        )}
                    </motion.div>

                    {/* category jump pills */}
                    <motion.div
                        className="cl-pills"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.44 }}
                    >
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`cl-pill${activeNav === cat ? ' active' : ''}`}
                                onClick={() => scrollTo(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── MARQUEE STRIP ── */}
            <div className="cl-marquee-strip">
                <Marquee speed={38} gradient={false} pauseOnHover>
                    {MARQUEE_ITEMS.map((item, i) => (
                        <span key={i} className="cl-marquee-item">
                            <span className="cl-marquee-dot">✦</span>
                            {item}
                        </span>
                    ))}
                </Marquee>
            </div>

            {/* ── CHAPTERS ── */}
            <div className="cl-body">
                <AnimatePresence>
                    {visibleCategories.map((cat, idx) => {
                        const catProducts = filteredProducts.filter(p => p.category === cat);
                        return (
                            <section
                                key={cat}
                                className="cl-chapter"
                                ref={el => sectionRefs.current[cat] = el}
                            >
                                {/* giant ghost category name */}
                                <div className="cl-chapter-ghost" aria-hidden="true">{cat}</div>

                                {/* chapter band */}
                                <div className="cl-band">
                                    <div className="cl-band-left">
                                        <span className="cl-band-num">{String(idx + 1).padStart(2, '0')}</span>
                                        <div className="cl-band-vline" />
                                    </div>
                                    <div className="cl-band-center">
                                        <h2 className="cl-band-name">{cat}</h2>
                                        <p className="cl-band-desc">
                                            {catProducts.length} handcrafted formulations
                                        </p>
                                    </div>
                                    <div className="cl-band-right">
                                        <span className="cl-band-badge">
                                            <Leaf size={10} /> Natural
                                        </span>
                                        <span className="cl-band-badge">
                                            <ShieldCheck size={10} /> Certified
                                        </span>
                                    </div>
                                </div>

                                {/* horizontal rule */}
                                <div className="cl-chapter-rule">
                                    <div className="cl-rule-line" />
                                    <span className="cl-rule-dot">◆</span>
                                    <div className="cl-rule-line" />
                                </div>

                                {/* product grid */}
                                <motion.div
                                    className="cl-grid"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-60px' }}
                                    variants={{
                                        hidden: {},
                                        visible: { transition: { staggerChildren: 0.06 } }
                                    }}
                                >
                                    {catProducts.map(product => (
                                        <motion.div
                                            key={product.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 28 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                                            }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </section>
                        );
                    })}
                </AnimatePresence>

                {filteredProducts.length === 0 && (
                    <motion.div
                        className="cl-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35 }}
                    >
                        <Search size={30} strokeWidth={1} />
                        <p>No products match <strong>"{searchTerm}"</strong></p>
                        <button onClick={() => setSearchTerm('')}>Clear search</button>
                    </motion.div>
                )}
            </div>

            {/* ── BOTTOM CTA ── */}
            <section className="cl-cta">
                <div className="cl-cta-inner">
                    <div className="cl-cta-glow" />
                    <span className="cl-eyebrow">✦ Personalised Wellness</span>
                    <h2 className="cl-cta-title">Healing tailored <em>to you.</em></h2>
                    <p className="cl-cta-sub">
                        Ayurveda treats the individual, not just the disease.<br />
                        Consult our Vaidyas for a custom wellness plan.
                    </p>
                    <div className="cl-cta-badges">
                        <span><Leaf size={12} /> 100% Natural</span>
                        <span><ShieldCheck size={12} /> GMP Certified</span>
                        <span><Star size={12} /> 500+ Happy Customers</span>
                    </div>
                    <button className="cl-cta-btn">Book Appointment →</button>
                </div>
            </section>
        </div>
    );
};

export default Catalog;
