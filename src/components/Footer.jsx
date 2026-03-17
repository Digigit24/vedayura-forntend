import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Leaf, ShieldCheck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-inner">

                {/* Brand col */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <img src="/logo-03.png" alt="Vedayura" />
                    </Link>
                    <p className="footer-desc">
                        Handcrafted Ayurvedic formulations for modern wellness — pure ingredients, ancient knowledge, real results.
                    </p>
                    <div className="footer-certs">
                        <span><Leaf size={12} /> 100% Natural</span>
                        <span><ShieldCheck size={12} /> GMP Certified</span>
                    </div>
                    <div className="footer-socials">
                        <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
                        <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
                    </div>
                </div>

                {/* Explore */}
                <div className="footer-col">
                    <h4>Explore</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/catalog">Catalog</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Account */}
                <div className="footer-col">
                    <h4>Account</h4>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/profile">My Profile</Link></li>
                        <li><Link to="/checkout">Checkout</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4>Contact</h4>
                    <ul className="footer-contact-list">
                        <li><MapPin size={14} /><span>305/4, Gajanan Colony, Sangli</span></li>
                        <li><Phone size={14} /><span>+91 80095 00992</span></li>
                        <li><Mail size={14} /><span>care@vedayura.com</span></li>
                    </ul>
                </div>

            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} VedAyura Wellness Pvt Ltd. All rights reserved.</p>
                <p>100% Secure Payments</p>
            </div>

        </footer>
    );
};

export default Footer;
