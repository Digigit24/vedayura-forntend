import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sun, Droplets, Heart } from 'lucide-react';
import './About.css';

const About = () => {
    // Floating animation for a weightless feel
    const float = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: "easeOut" } 
        }
    };

    return (
        <div className="about-page">
            
            {/* HERO: Background Image with Glass Overlay */}
            <section className="ethereal-hero">
                <div className="hero-bg-img">
                    <img src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2940&auto=format&fit=crop"/>
                </div>
                
                <div className="container hero-container">
                    <motion.div 
                        className="glass-card hero-card"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <div className="icon-crown">
                            <Leaf size={2} />
                        </div>
                        <h1>Healing through Authentic Ayurveda</h1>
                        <p>
                           At VedAyura, we honor the sacred tradition of Ayurvedic healing. We seamlessly blend ancient wisdom with modern practices to deliver products that offer true purity and profound health benefits.
                        </p>

                    </motion.div>
                </div>
            </section>

            {/* PHILOSOPHY: Fluid Layout */}
            <section className="section fluid-section">
                <div className="container">
                    <div className="fluid-grid">
                        <motion.div 
                            className="fluid-img-wrapper"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <img 
                                src="https://wallpapersok.com/images/hd/ayurveda-hd-herbal-medicine-ota5ofqs76loufud.jpg" 
                                alt="Ayurvedic Oils" 
                                className="fluid-img" 
                            />
                            {/* Decorative organic circle */}
                            <motion.div className="organic-circle" variants={float} animate="animate"></motion.div>
                        </motion.div>

                        <motion.div 
                            className="fluid-content"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="soft-tag">Our Philosophy</span>
                            <h2>Rooted in Tradition,<br />Perfected by Science</h2>
                            <p>
                               Founded in the heart of traditional healing hubs, VedAyura began as a small family-led initiative dedicated to preserving the time-honored art of authentic Ayurvedic formulations.
                            </p>
                            <p>
                               Today, we unite ancient Ayurvedic texts with the latest scientific innovations. Our goal is clear: to offer products that are not just "natural" but truly "Ayurvedic"—crafted with the utmost respect for the ancient Charaka Samhita.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* VALUES: Horizontal Scroll / Soft Cards */}
            <section className="section values-section">
                <div className="container">
                    <motion.div 
                        className="values-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2>The VedAyura Promise</h2>
                    </motion.div>

                    <div className="soft-grid">
                        {[
                            { icon: <Sun />, title: "Sun-Kissed Herbs", text: "Harvested at peak potency under the natural sun." },
                            { icon: <Droplets />, title: "Essential Oils", text: "Cold-pressed extraction to retain 100% of nutrients." },
                            { icon: <Heart />, title: "Conscious Care", text: "Formulations that are kind to your body and the planet." }
                        ].map((item, index) => (
                            <motion.div 
                                key={index} 
                                className="soft-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="soft-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;