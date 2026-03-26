import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Leaf } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import MapSection from '../components/MapSection';
import './Contact.css';

const ease = [0.22, 1, 0.36, 1];

const CONTACT_CARDS = [
    {
        icon: <Phone size={18} />,
        label: 'Call Us',
        value: '+91 80095 00992',
        hint: 'Mon–Sat, 9am–6pm',
        href: 'tel:+918009500992',
    },
    {
        icon: <Mail size={18} />,
        label: 'Email',
        value: 'customercare@vedayura.com',
        hint: 'Reply within 24 hours',
        href: 'mailto:customercare@vedayura.com',
    },
    {
        icon: <MapPin size={18} />,
        label: 'Visit Us',
        value: '305/4, Gajanan Colony',
        hint: 'Sangli, Maharashtra 416416',
        href: null,
    },
    {
        icon: <Clock size={18} />,
        label: 'Working Hours',
        value: 'Mon – Saturday',
        hint: '9:00 AM – 6:00 PM IST',
        href: null,
    },
];

const Contact = () => {
    return (
        <div className="ct-page">

            {/* ── HERO ── */}
            <section className="ct-hero">
                <div className="ct-dot-grid" aria-hidden="true" />
                <div className="ct-glow-blob" aria-hidden="true" />

                <div className="ct-container">

                    {/* LEFT — form */}
                    <motion.div
                        className="ct-right"
                        initial={{ opacity: 0, x: -48 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.75, ease }}
                    >
                        <div className="ct-form-card">
                            <div className="ct-form-header">
                                <h2>Send a Message</h2>
                                <p>Fill in the form below and we'll get back to you shortly.</p>
                            </div>
                            <ContactForm />
                        </div>
                    </motion.div>

                    {/* RIGHT — info */}
                    <motion.div
                        className="ct-left"
                        initial={{ opacity: 0, x: 48 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.75, delay: 0.15, ease }}
                    >
                        <span className="ct-eyebrow"><Leaf size={11} /> Reach Out to Us</span>

                        <h1 className="ct-title">
                            We'd love to<br /><em>hear from you.</em>
                        </h1>

                        <p className="ct-subtitle">
                            Questions about our Ayurvedic products, consultations, or orders —
                            our dedicated team is here to help.
                        </p>

                        <div className="ct-cards">
                            {CONTACT_CARDS.map((c, i) => {
                                const inner = (
                                    <>
                                        <span className="ct-card-icon">{c.icon}</span>
                                        <div className="ct-card-body">
                                            <span className="ct-card-label">{c.label}</span>
                                            <span className="ct-card-value">{c.value}</span>
                                            <span className="ct-card-hint">{c.hint}</span>
                                        </div>
                                    </>
                                );
                                return c.href ? (
                                    <motion.a
                                        key={i}
                                        href={c.href}
                                        className="ct-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                                    >
                                        {inner}
                                    </motion.a>
                                ) : (
                                    <motion.div
                                        key={i}
                                        className="ct-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                                    >
                                        {inner}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* ── MAP ── */}
            <div className="ct-map-wrap">
                <div className="ct-map-label">
                    <MapPin size={15} />
                    <span>Sangli, Maharashtra — Find us on the map</span>
                </div>
                <MapSection />
            </div>

        </div>
    );
};

export default Contact;
