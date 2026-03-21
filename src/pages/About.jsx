import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Sun, Droplets, Heart, Sprout, BookOpen, Globe, Award, Zap, Shield, Wind, Coffee } from 'lucide-react';
import './About.css';

const About = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
    };

    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
    };

    const values = [
        { icon: <Sun size={22} />, title: "Sun-Kissed Herbs", text: "Harvested at peak potency under the natural sun, following lunar cycles that ancient texts prescribe for optimal plant vitality." },
        { icon: <Droplets size={22} />, title: "Pure Formulations", text: "No synthetic additives, no artificial colours — only what nature intended. Every ingredient traceable to its source." },
        { icon: <Heart size={22} />, title: "Conscious Care", text: "Formulations kind to your body and the planet — from Boswellia for joints to Kutki for liver, each herb chosen with purpose." }
    ];

    const stats = [
        { number: "15+", label: "Healing Formulations" },
        { number: "3", label: "Product Forms" },
        { number: "50K+", label: "Lives Transformed" },
        { number: "100%", label: "Authentically Ayurvedic" },
    ];

    const team = [
        { name: "Dr. Priya Sharma", role: "Chief Ayurvedic Physician", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" },
        { name: "Arun Vaidya", role: "Master Herbalist", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop" },
        { name: "Dr. Meera Iyer", role: "Research & Formulation", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
    ];

    const timeline = [
        { year: "2008", title: "The Seed is Planted", text: "A small family kitchen in Kerala becomes the birthplace of VedAyura, guided by generations of Vaidya knowledge." },
        { year: "2013", title: "First Formulations", text: "Our flagship Arthroplus and Diabocare blends receive recognition from the Ayurvedic Practitioners Association of India." },
        { year: "2018", title: "Science Meets Tradition", text: "We establish our research lab, partnering with ayurvedic universities to validate ancient formulas through modern clinical study." },
        { year: "2024", title: "A Complete Wellness Range", text: "VedAyura now offers 15+ formulations — from joint care and blood sugar support to liver health, digestion, and immunity." },
    ];

    const productCategories = [
        {
            icon: <Shield size={24} />,
            name: "Joint & Bone Care",
            description: "Arthroplus harnesses Shallaki (Boswellia serrata) and Shuddha Guggul to ease inflammation, restore flexibility, and strengthen connective tissue.",
            tag: "Capsules",
            color: "#E8F0E9"
        },
        {
            icon: <Droplets size={24} />,
            name: "Blood Sugar Support",
            description: "Diabocare blends Karela, Jamun seed, Guduchi, and Ashwagandha — a time-tested combination for homeostasis and controlled sugar levels.",
            tag: "Juice & Capsules",
            color: "#EAF0E8"
        },
        {
            icon: <Wind size={24} />,
            name: "Digestive Health",
            description: "Digestive Churna with Triphala, Ajwain, Jeera, and Kutaj relieves gas, bloating, and acidity while restoring natural digestive rhythm.",
            tag: "Powder",
            color: "#F0EDE8"
        },
        {
            icon: <Zap size={24} />,
            name: "Weight Management",
            description: "Garcinia Plus uses Vriksamla (Garcinia cambogia), Triphala, and Trikatu to prevent fat storage, curb cravings, and boost metabolism.",
            tag: "Juice & Capsules",
            color: "#EDE8F0"
        },
        {
            icon: <Heart size={24} />,
            name: "Liver & Heart Care",
            description: "L-Care with Kutki and Punarnava shields the liver from toxins, while H-Care capsules support healthy circulation and balanced cholesterol.",
            tag: "Juice & Capsules",
            color: "#F0E8E8"
        },
        {
            icon: <Sun size={24} />,
            name: "Immunity & Energy",
            description: "Our Immunity Booster and Ayurvedic Coffee — crafted with Ashwagandha, Tulsi, Arjun bark, and adaptogens — fuel daily vitality naturally.",
            tag: "Coffee & Capsules",
            color: "#F0EFE8"
        },
    ];

    return (
        <div className="about-page">

            {/* HERO */}
            <section className="ethereal-hero" ref={heroRef}>
                <motion.div className="hero-bg-img" style={{ y: heroY }}>
                    <img src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2940&auto=format&fit=crop" alt="Ayurvedic Forest" />
                    <div className="hero-overlay" />
                </motion.div>

                <motion.div className="hero-content" style={{ opacity: heroOpacity }}>
                    <motion.div
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.div
                            className="hero-eyebrow"
                            initial={{ opacity: 0, letterSpacing: "0.1em" }}
                            animate={{ opacity: 1, letterSpacing: "0.3em" }}
                            transition={{ duration: 1.4, delay: 0.3 }}
                        >
                            <span className="eyebrow-line" />
                            <span>VEDAYURA</span>
                            <span className="eyebrow-line" />
                        </motion.div>

                        <h1 className="hero-title">
                            <span>Healing through</span>
                            <em>Authentic Ayurveda</em>
                        </h1>
                        <p className="hero-subtitle">
                            At VedAyura, we honor the sacred tradition of Ayurvedic healing — seamlessly blending ancient wisdom with modern practices to deliver true purity and profound health.
                        </p>

                        <motion.div
                            className="hero-leaf-icon"
                            animate={{ rotate: [0, 8, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Leaf size={32} />
                        </motion.div>
                    </motion.div>
                </motion.div>

                <div className="hero-scroll-hint">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="scroll-dot"
                    />
                </div>
            </section>

            {/* STATS BAND */}
            <section className="stats-band">
                <div className="container">
                    <motion.div
                        className="stats-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {stats.map((s, i) => (
                            <motion.div key={i} className="stat-item" variants={fadeInUp}>
                                <span className="stat-number">{s.number}</span>
                                <span className="stat-label">{s.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section className="section fluid-section">
                <div className="container">
                    <div className="fluid-grid">
                        <motion.div
                            className="fluid-img-wrapper"
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="img-frame">
                                <img
                                    src="https://wallpapersok.com/images/hd/ayurveda-hd-herbal-medicine-ota5ofqs76loufud.jpg"
                                    alt="Ayurvedic Oils"
                                    className="fluid-img"
                                />
                                <div className="img-badge">
                                    <Sprout size={18} />
                                    <span>100% Organic</span>
                                </div>
                            </div>
                            <motion.div
                                className="organic-circle"
                                animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="organic-circle-sm"
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                        </motion.div>

                        <motion.div
                            className="fluid-content"
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="soft-tag">Our Philosophy</span>
                            <h2>Rooted in Tradition,<br />Perfected by Science</h2>
                            <p>
                                Founded in the heart of traditional healing hubs, VedAyura began as a small family-led initiative dedicated to preserving the time-honored art of authentic Ayurvedic formulations.
                            </p>
                            <p>
                                Today, we unite ancient Ayurvedic texts with the latest scientific innovations. Our goal is clear: to offer products that are not just "natural" but truly "Ayurvedic" — crafted with the utmost respect for the Charaka Samhita.
                            </p>
                            <div className="philosophy-pillars">
                                {[
                                    { icon: <BookOpen size={16} />, text: "Guided by Charaka Samhita" },
                                    { icon: <Globe size={16} />, text: "Ethically sourced ingredients" },
                                    { icon: <Award size={16} />, text: "GMP Certified facilities" },
                                ].map((p, i) => (
                                    <div key={i} className="pillar-item">
                                        {p.icon}
                                        <span>{p.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="section values-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="soft-tag" style={{ textAlign: 'center', display: 'block' }}>What We Stand For</span>
                        <h2>The VedAyura Promise</h2>
                    </motion.div>

                    <motion.div
                        className="soft-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {values.map((item, index) => (
                            <motion.div
                                key={index}
                                className="soft-card"
                                variants={fadeInUp}
                                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                            >
                                <div className="soft-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                                <div className="card-accent" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* PRODUCT RANGE */}
            <section className="section products-overview-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="soft-tag" style={{ textAlign: 'center', display: 'block' }}>What We Make</span>
                        <h2>Six Pillars of Wellness</h2>
                        <p className="section-desc">
                            Every VedAyura formulation targets a specific concern — available as capsules, juices, powders, or coffee — so your healing path is never one-size-fits-all.
                        </p>
                    </motion.div>

                    <motion.div
                        className="products-overview-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {productCategories.map((cat, i) => (
                            <motion.div
                                key={i}
                                className="product-overview-card"
                                variants={fadeInUp}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                style={{ '--card-bg': cat.color }}
                            >
                                <div className="po-icon">{cat.icon}</div>
                                <div className="po-tag">{cat.tag}</div>
                                <h3>{cat.name}</h3>
                                <p>{cat.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="section timeline-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="soft-tag" style={{ textAlign: 'center', display: 'block' }}>Our Journey</span>
                        <h2>From Roots to Reach</h2>
                    </motion.div>

                    <div className="timeline">
                        <div className="timeline-spine" />
                        {timeline.map((item, i) => (
                            <motion.div
                                key={i}
                                className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <div className="timeline-card">
                                    <span className="timeline-year">{item.year}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                                <div className="timeline-dot" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM */}
            <section className="section team-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="soft-tag" style={{ textAlign: 'center', display: 'block' }}>The Healers</span>
                        <h2>Guided by Masters</h2>
                    </motion.div>

                    <motion.div
                        className="team-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {team.map((member, i) => (
                            <motion.div key={i} className="team-card" variants={fadeInUp}>
                                <div className="team-img-wrap">
                                    <img src={member.img} alt={member.name} />
                                    <div className="team-img-overlay" />
                                </div>
                                <div className="team-info">
                                    <h3>{member.name}</h3>
                                    <span>{member.role}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-bg-img">
                    <img src="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=1800&fit=crop" alt="Ayurvedic herbs" />
                    <div className="cta-overlay" />
                </div>
                <motion.div
                    className="cta-content"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                >
                    <Leaf size={40} className="cta-leaf" />
                    <h2>Begin Your Healing Journey</h2>
                    <p>Discover formulations that have stood the test of centuries — now available for you.</p>
                   
                </motion.div>
            </section>

        </div>
    );
};

export default About;