import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">

                <div className="footer-grid">
                    {/* Brand Info */}
                    <div className="footer-col brand-col">
                        <Link to="/" className="footer-logo">
                            <img src="/logo-03.png" alt="Vedayura" />
                        </Link>
                        <p className="footer-desc">
                            Authentic Ayurvedic formulations. Pure, potent, and sustainably sourced.
                        </p>
                        <div className="social-icons-row">
                            <a href="#"><Instagram size={18} /></a>
                            <a href="#"><Facebook size={18} /></a>
                            <a href="#"><Twitter size={18} /></a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                       <ul className="footer-links">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/catalog">Catalog</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        </ul>

                    </div>

                    {/* Support Links */}
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul className="footer-links">
                            <li><Link to="/track-order">Track Order</Link></li>
                            <li><Link to="/shipping">Shipping Policy</Link></li>
                            <li><Link to="/returns">Returns & Refunds</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <div className="contact-info">
                            <div className="contact-item"><MapPin size={20} /> <span>305/4, Gajanan Colony, Sangli</span></div>
                            <div className="contact-item"><Phone size={20} /> <span>+91 80095 00992</span></div>
                            <div className="contact-item"><Mail size={20} /> <span>care@vedayura.com</span></div>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Bar */}
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} VedAyura Wellness Pvt Ltd. All rights reserved.</p>
                    <div className="payment-methods">
                        {/* Placeholder for payment icons */}
                        <span className="text-xs text-secondary">100% Secure Payments</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
