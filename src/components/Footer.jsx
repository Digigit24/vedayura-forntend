import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <Link to="/" className="footer-logo-link block mb-4">
                            <img src="/logo-03.png" alt="Vedayura" className="h-16 w-auto brightness-0 invert opacity-90" style={{ maxHeight: '70px', filter: 'brightness(0) invert(1)' }} />
                        </Link>
                        <p className="footer-desc">
                            Your trusted source for authentic Ayurvedic products. Experience the ancient wisdom of natural healing with our premium collection of skincare, haircare, and wellness essentials.
                        </p>
                        <div className="social-icons">
                            <a href="#"><Instagram size={20} /></a>
                            <a href="#"><Facebook size={20} /></a>
                            <a href="#"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/blog">Ayurvedic Blog</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Customer Care</h4>
                        <ul className="footer-links">
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/cart">Track Order</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/shipping">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul className="contact-info">
                            <li><MapPin size={18} /> <span>Shop No. 4, Green Valley, Ravet, Pune, Maharashtra 412101</span></li>
                            <li><Phone size={18} /> <span>+91 99999 00000 (Demo)</span></li>
                            <li><Mail size={18} /> <span>care@vedayura.com</span></li>
                        </ul>
                        <div className="newsletter">
                            <h5>Subscribe to our Newsletter</h5>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Your email address" />
                                <button type="submit">Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Vedayura. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
