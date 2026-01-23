import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Users, Heart, ShieldCheck, Zap } from 'lucide-react';
import './About.css';

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
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

    return (
        <div className="about-page">
            {/* Minimalist Hero Section */}
            <section className="vedayura-hero vedayura-hero-light">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="about-hero-content"
                    >
                        <span className="vedayura-tagline">Our Heritage</span>
                        <h1 className="about-title">Healing through <span className="text-secondary-themed">Authentic Ayurveda</span></h1>
                        <p className="vedayura-desc">
                            At VedAyura, we honor the sacred tradition of Ayurvedic healing. We seamlessly blend ancient wisdom with modern practices to deliver products that offer true purity and profound health benefits.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story - Image & Text */}
            <section className="section about-story">
                <div className="container grid-2-col-about items-center gap-2xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="about-img-box"
                    >
                        <img
                            src="https://wallpapersok.com/images/hd/ayurveda-hd-herbal-medicine-ota5ofqs76loufud.jpg"
                            alt="Ayurvedic preparation"
                        />
                        <div className="experience-badge">
                            <span className="number">25+</span>
                            <span className="text">Years of <br />Legacy</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="about-text-box"
                    >
                        <motion.h2 variants={fadeIn}>Rooted in Tradition,<br />Perfected by Science</motion.h2>
                        <motion.p variants={fadeIn}>
                            Founded in the heart of traditional healing hubs, VedAyura began as a small family-led initiative dedicated to preserving the time-honored art of authentic Ayurvedic formulations.
                        </motion.p>
                        <motion.p variants={fadeIn}>
                            Today, we unite ancient Ayurvedic texts with the latest scientific innovations. Our goal is clear: to offer products that are not just "natural" but truly "Ayurvedic"—crafted with the utmost respect for the ancient Charaka Samhita.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Core Values - Grid Icons */}
            <section className="section bg-light-themed values-section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mb-2xl"
                    >
                        <h2 className="section-title">The VedAyura Promise</h2>
                        <p className="section-subtitle">What sets us apart in the world of wellness</p>
                    </motion.div>

                    <motion.div
                        className="values-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {[
                            { icon: <Leaf size={32} />, title: "Ethical Sourcing", desc: "We partner with local farmers who uphold sustainable practices, ensuring our herbs are ethically sourced." },
                            { icon: <Award size={32} />, title: "Certified Purity", desc: "Each product is tested rigorously to meet the highest standards of purity, free from harmful chemicals." },
                            { icon: <ShieldCheck size={32} />, title: "Zero Synthetic", desc: "We do not use artificial colors, fragrances, or preservatives. Just pure, natural ingredients." },
                            { icon: <Zap size={32} />, title: "High Bio-Availability", desc: "Our products are formulated to ensure maximum absorption, delivering the most effective results." }
                        ].map((v, i) => (
                            <motion.div key={i} className="value-card" variants={fadeIn}>
                                <div className="value-icon">{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>

    );
};

export default About;
