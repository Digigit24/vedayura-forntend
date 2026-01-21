import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Leaf, ShieldCheck, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
    const { products } = useShop();
    const featuredProducts = products.slice(0, 4);

    // Animation variants
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
                staggerChildren: 0.2
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="home-page">
            {/* Premium Hero Section */}
            <section className="hero-section-premium">
                <div className="hero-overlay"></div>
                <div className="container hero-inner-premium">
                    <motion.div
                        className="hero-content-premium"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span className="hero-tagline-premium" variants={fadeIn}>
                            Pure • Potent • Authentic
                        </motion.span>
                        <motion.h1 className="hero-title-premium" variants={fadeIn}>
                            Rediscover the <br />
                            <span className="text-highlight-premium">Ancient Wisdom</span> of Vedas
                        </motion.h1>
                        <motion.p className="hero-subtitle-premium" variants={fadeIn}>
                            Handcrafted Ayurvedic formulations for holistic wellness, <br />
                            preserving tradition in every drop.
                        </motion.p>
                        <motion.div className="hero-actions-premium" variants={fadeIn}>
                            <Link to="/shop" className="btn-premium">Shop Collection</Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-image-container"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <motion.img
                            src="/assets/hero-img.png"
                            alt="Ayurvedic Product"
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="section about-section relative overflow-hidden">
                <div className="about-bg-leaf"></div>

                <div className="container grid-2-col items-center gap-xl relative z-10">
                    <motion.div
                        className="about-image-wrapper"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={imageVariants}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                            alt="Ayurvedic herbs"
                            className="rounded-lg shadow-lg"
                        />
                    </motion.div>

                    <motion.div
                        className="about-content"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h4 className="text-secondary uppercase tracking-wide text-sm font-bold mb-sm" variants={fadeIn}>
                            Our Story
                        </motion.h4>
                        <motion.div className="about-spine" variants={fadeIn}></motion.div>

                        <motion.h2 className="section-title text-left mb-md" variants={fadeIn}>
                            Ancient Wisdom, Modern Purity
                        </motion.h2>

                        <motion.p className="mb-md" variants={fadeIn}>
                            At Vedayura, we believe in the healing power of nature. Our journey began with a simple mission: to bring authentic, time-tested Ayurvedic remedies to the modern world without compromising on purity.
                        </motion.p>

                        <motion.p className="mb-lg" variants={fadeIn}>
                            Every product is crafted with sustainably sourced herbs, following traditional formulations that have been trusted for centuries. We are committed to holistic wellness that nurtures your body, mind, and soul.
                        </motion.p>

                        <motion.div className="features-mini-grid" variants={fadeIn}>
                            <div className="flex items-center gap-sm mb-sm">
                                <Leaf className="text-primary" size={24} />
                                <span>100% Natural Ingredients</span>
                            </div>
                            <div className="flex items-center gap-sm mb-sm">
                                <ShieldCheck className="text-primary" size={24} />
                                <span>Certified Authentic</span>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeIn}>
                            <Link to="/about" className="btn-vedayura btn-vedayura-outline mt-md">
                                Read More About Us
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="section">
                <div className="container">
                    <motion.div
                        className="text-center mb-xl"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title mb-sm">Featured Collections</h2>
                        <p className="text-secondary">Handpicked essentials for your daily wellness routine.</p>
                    </motion.div>

                    <motion.div
                        className="product-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                    >
                        {featuredProducts.map(product => (
                            <motion.div key={product.id} variants={fadeIn}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="text-center mt-2xl pt-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/shop" className="btn-vedayura btn-vedayura-primary">View All Products</Link>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section bg-secondary-light">
                <div className="container">
                    <motion.h2
                        className="section-title text-center mb-xl"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Stories of Healing
                    </motion.h2>
                    <motion.div
                        className="testimonials-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {[
                            { name: "Anjali Sharma", text: "I've tried many natural brands, but nothing comes close to the authenticity of Vedayura. The Saffron Night Cream is a game-changer!" },
                            { name: "Rahul Khanna", text: "Finally found Ashwagandha tablets that are pure and effective. My stress levels have significantly gone down." },
                            { name: "Priya Menon", text: "The hair oil is magic. Hairfall stopped in just 2 weeks. The earthy fragrance tells you it's the real deal." }
                        ].map((t, i) => (
                            <motion.div key={i} className="testimonial-card" variants={fadeIn} whileHover={{ y: -5 }}>
                                <div className="stars">★★★★★</div>
                                <p className="mb-md">"{t.text}"</p>
                                <h4 className="font-bold">- {t.name}</h4>
                                <span className="text-xs text-secondary">Verified Buyer</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="section newsletter-section bg-primary text-white overflow-hidden">
                <motion.div
                    className="container text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-white mb-sm">Join Our Wellness Community</h2>
                    <p className="text-white opacity-90 mb-lg">Subscribe to receive holistic health tips, exclusive offers, and early access to new launches.</p>
                    <form className="home-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" className="border-none" />
                        <button type="submit" className="btn-vedayura btn-vedayura-white">Join Now</button>
                    </form>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
