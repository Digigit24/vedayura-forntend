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
                        <h1 className="vedayura-title">Healing through <span className="text-secondary-themed">Authentic Ayurveda</span></h1>
                        <p className="vedayura-desc">We bridge the gap between ancient Vedic wisdom and modern wellness lifestyles, ensuring purity in every drop.</p>
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
                        <img src="https://wallpapersok.com/images/hd/ayurveda-hd-herbal-medicine-ota5ofqs76loufud.jpg" alt="Ayurvedic preparation" />
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
                            Founded in the heart of traditional healing hubs, Vedayura started as a small family-led initiative to preserve the dying art of authentic Ayurvedic formulation.
                        </motion.p>
                        <motion.p variants={fadeIn}>
                            Today, we combine centuries-old manuscripts with state-of-the-art extraction technology. Our mission is simple: to provide products that are not just "natural," but "Ayurvedic" in the truest sense—following the strict protocols of Charaka Samhita.
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
                        <h2 className="section-title">The Vedayura Promise</h2>
                        <p className="section-subtitle">What makes us stand apart in the world of wellness</p>
                    </motion.div>

                    <motion.div
                        className="values-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {[
                            { icon: <Leaf size={32} />, title: "Ethical Sourcing", desc: "We source our herbs directly from farmers at fair prices, ensuring sustainability." },
                            { icon: <Award size={32} />, title: "Certified Purity", desc: "Every batch undergoes rigorous quality checks and heavy metal testing." },
                            { icon: <ShieldCheck size={32} />, title: "Zero Synthetic", desc: "No artificial colors, fragrances, or parabens. Just pure herbs." },
                            { icon: <Zap size={32} />, title: "High Bio-Availability", desc: "Formulated for maximum absorption by the human body." }
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
