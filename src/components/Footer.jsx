import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone, Leaf, ShieldCheck, ArrowRight, Lock, Award, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">

            {/* Watermark */}
            <div className="footer-watermark" aria-hidden="true">VEDAYURA</div>

            {/* Top botanical border */}
            <div className="footer-vine">
                <svg viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48 Q180 16 360 38 Q540 58 720 28 Q900 0 1080 32 Q1260 58 1440 24" stroke="#2d6b44" strokeWidth="1.5" fill="none" opacity="0.4"/>
                    {[60,180,300,420,540,660,780,900,1020,1140,1260,1380].map((x, i) => (
                        <ellipse key={i}
                            cx={x}
                            cy={28 + Math.sin(i) * 14}
                            rx="14" ry="7"
                            transform={`rotate(${i % 2 === 0 ? -25 : 25} ${x} ${28 + Math.sin(i)*14})`}
                            fill="#1db04c" opacity="0.14"
                        />
                    ))}
                    {[120,360,600,840,1080,1320].map((x, i) => (
                        <circle key={i} cx={x} cy={20 + i * 4 % 20} r="2.5" fill="#c8a96e" opacity="0.4"/>
                    ))}
                </svg>
            </div>

            {/* Main grid */}
            <div className="footer-inner">

                {/* Brand col */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <img src="/logo-03.png" alt="Vedayura" />
                    </Link>
                    <p className="footer-desc">
                        Handcrafted Ayurvedic formulations for modern wellness — pure ingredients, ancient knowledge, real results.
                    </p>
                    <div className="footer-socials">
                        <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
                        <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
                        <a href="#" aria-label="YouTube"><Youtube size={16} /></a>
                    </div>
                </div>

                {/* Explore */}
                <div className="footer-col">
                    <h4><span>Explore</span></h4>
                    <ul>
                        <li><Link to="/"><ArrowRight size={11} /><span>Home</span></Link></li>
                        <li><Link to="/shop"><ArrowRight size={11} /><span>Shop</span></Link></li>
                        <li><Link to="/catalog"><ArrowRight size={11} /><span>Catalog</span></Link></li>
                        <li><Link to="/about"><ArrowRight size={11} /><span>About Us</span></Link></li>
                        <li><Link to="/contact"><ArrowRight size={11} /><span>Contact</span></Link></li>
                    </ul>
                </div>

                {/* Account */}
                <div className="footer-col">
                    <h4><span>Account</span></h4>
                    <ul>
                        <li><Link to="/login"><ArrowRight size={11} /><span>Login</span></Link></li>
                        <li><Link to="/profile"><ArrowRight size={11} /><span>My Profile</span></Link></li>
                        <li><Link to="/checkout"><ArrowRight size={11} /><span>Checkout</span></Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4><span>Get in Touch</span></h4>
                    <ul className="footer-contact-list">
                        <li>
                            <span className="contact-icon"><MapPin size={13} /></span>
                            <span>305/4, Gajanan Colony, Sangli</span>
                        </li>
                        <li>
                            <span className="contact-icon"><Phone size={13} /></span>
                            <a href="tel:+918009500992">+91 80095 00992</a>
                        </li>
                        <li>
                            <span className="contact-icon"><Mail size={13} /></span>
                            <a href="mailto:care@vedayura.com">care@vedayura.com</a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Trust row */}
            <div className="footer-trust">
                <div className="footer-trust-inner">
                    {[
                        { icon: <ShieldCheck size={16} />, title: 'GMP Certified' },
                        { icon: <Award size={16} />,       title: 'AYUSH Approved' },
                        { icon: <Leaf size={16} />,        title: '100% Vegetarian' },
                        { icon: <Heart size={16} />,       title: 'Cruelty Free' },
                        { icon: <Lock size={16} />,        title: 'Secure Payments' },
                    ].map((b, i) => (
                        <div className="trust-card" key={i}>
                            <div className="trust-card-icon">{b.icon}</div>
                            <span className="trust-title">{b.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <p>&copy; {new Date().getFullYear()} VedAyura Wellness Pvt Ltd. All rights reserved.</p>
                    <div className="footer-bottom-center">
                        <Leaf size={11} className="bottom-leaf" />
                    </div>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Refunds</a>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
