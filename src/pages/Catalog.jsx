import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import './Catalog.css';

const Catalog = () => {
    const { products } = useShop();
    const categories = ['Liquid', 'Powder', 'Capsules'];

    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="catalog-page">
            {/* Redesigned Hero: Zen Minimalist */}
            <section className="catalog-hero-v2 vedayura-hero-dark">
                <div className="hero-v2-bg">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>

                <div className="container hero-v2-container">
                    <motion.div
                        className="hero-v2-content"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span className="vedayura-tagline" variants={fadeIn}>
                            The Vedayura Collection
                        </motion.span>
                        <motion.h1 className="vedayura-title" variants={fadeIn}>
                            Curated Natural <br /><span>Wellness Library</span>
                        </motion.h1>
                        <motion.p className="vedayura-desc" variants={fadeIn}>
                            Deep dive into our handcrafted Ayurvedic solutions. Each formulation is a result of years of tradition combined with modern purity standards.
                        </motion.p>

                        <motion.div className="hero-v2-search-wrapper" variants={fadeIn}>
                            <div className="search-input-group">
                                <Search size={22} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Looking for something specific?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-v2-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <img src="/assets/catalog-bg.png" alt="Ayurvedic Excellence" />
                        <div className="floating-card">
                            <span>Pure & Organic</span>
                        </div>
                    </motion.div>
                </div>

                <div className="scroll-indicator">
                    <ChevronDown size={24} />
                </div>
            </section>

            {/* Catalog Grid View */}
            <div className="catalog-grid-container">
                {categories.map((cat, idx) => {
                    const catProducts = filteredProducts.filter(p => p.category === cat);
                    if (catProducts.length === 0) return null;

                    return (
                        <section key={cat} className="catalog-category-section">
                            <div className="container">
                                <motion.div
                                    className="category-header"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="category-info">
                                        <span className="cat-index">#0{idx + 1}</span>
                                        <h2>{cat} Collections</h2>
                                    </div>
                                    <div className="category-line"></div>
                                </motion.div>

                                <motion.div
                                    className="catalog-products-grid"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={staggerContainer}
                                >
                                    {catProducts.map(product => (
                                        <motion.div key={product.id} variants={fadeIn}>
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </section>
                    );
                })}

                {filteredProducts.length === 0 && (
                    <div className="container text-center py-2xl">
                        <div className="no-res-box">
                            <Search size={48} className="mb-md opacity-20" />
                            <h3>No matches found in our library</h3>
                            <button className="btn btn-primary btn-txt mt-md" onClick={() => setSearchTerm('')}>Reset View</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Catalog Footer Promo */}
            <section className="catalog-promo">
                <div className="container">
                    <div className="promo-card">
                        <div className="promo-content">
                            <h2>Expert Consultation</h2>
                            <p>Not sure which formulation suits your body type? Our expert Vaidyas are here to help you choose.</p>
                            <button className="btn-vedayura btn-vedayura-white">Book Appointment</button>
                        </div>
                        <div className="promo-visual">
                            <img src="/assets/hero-img.png" alt="Consultation" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Catalog;
