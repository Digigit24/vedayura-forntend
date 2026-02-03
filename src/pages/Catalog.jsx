import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import './Catalog.css';

const Catalog = () => {
    const { products } = useShop();
    
    // ✅ ADDED "Oils" to the categories array here
    const categories = ['Liquid', 'Powder', 'Capsules', 'Other'];
    
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: "easeOut" } 
        }
    };

    return (
        <div className="catalog-page-dark">
            
            {/* HERO: Dark & Immersive */}
            <section className="dark-hero">
                <div className="hero-bg-glow"></div>
                <div className="container hero-content-center">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="text-center"
                    >
                        <span className="gold-subtitle">The Vedayura Collection</span>
                        <h1 className="display-title">Curated Natural Wellness Library</h1>
                        <p className="hero-desc">
                           Deep dive into our handcrafted Ayurvedic solutions. Each formulation is a result of years of tradition combined with modern purity standards.
                        </p>

                        {/* Glowing Search Bar */}
                        <div className="dark-search-wrapper">
                            <Search className="search-icon-dark" size={20} />
                            <input
                                type="text"
                                placeholder="Search remedies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CATALOG GRID */}
            <div className="catalog-body-dark">
                {categories.map((cat, idx) => {
                    // Filter products for this specific category
                    const catProducts = filteredProducts.filter(p => p.category === cat);
                    
                    // If no products exist for this category (and no search is active), hide the section
                    if (catProducts.length === 0) return null;

                    return (
                        <section key={cat} className="category-block">
                            <div className="container">
                                <div className="category-header-dark">
                                    <h2>{cat}</h2>
                                    <div className="line-dec"></div>
                                    <span className="count-badge">{catProducts.length} items</span>
                                </div>

                                <motion.div
                                    className="dark-grid"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={{
                                        visible: { transition: { staggerChildren: 0.1 } }
                                    }}
                                >
                                    {catProducts.map(product => (
                                        <motion.div key={product.id} variants={fadeUp} className="dark-card-wrapper">
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </section>
                    );
                })}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="container empty-dark">
                        <h3>No matching elixirs found.</h3>
                        <button onClick={() => setSearchTerm('')}>View All Products</button>
                    </div>
                )}
            </div>

            {/* DARK PROMO */}
            <section className="dark-promo-section">
                <div className="container">
                    <div className="promo-banner-dark">
                        <div className="promo-text-side">
                            <h2>Personalized Healing</h2>
                            <p>Ayurveda treats the individual, not just the disease. Consult our Vaidyas for a custom plan.</p>
                            <button className="btn-gold">
                                Book Appointment <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="promo-visual-side">
                            <div className="glow-circle"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Catalog;