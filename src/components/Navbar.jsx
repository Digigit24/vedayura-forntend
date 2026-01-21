import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { cart = [], wishlist = [], openCart, openWishlist } = useShop();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="top-bar py-xs text-sm">
        <div className="container flex justify-center items-center">
          <p>🌿 Free Shipping on Orders Over ₹999 | Pure Ayurvedic Healing</p>
        </div>
      </div>

      {/* Header */}
      <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container flex justify-between items-center">

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn hidden-desktop"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/logo-03.png" alt="Vedayura" style={{ height: 50 }} />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav hidden-mobile">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About Us</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions flex items-center">
            <form onSubmit={handleSearch} className="search-form hidden-mobile">
              <button type="submit">
                <Search size={18} />
              </button>
              <input
                type="text"
                placeholder="Search wellness..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="flex items-center gap-md">
              <button onClick={openWishlist} className="icon-link">
                <Heart size={22} />
                {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
              </button>

              <button onClick={openCart} className="icon-link">
                <ShoppingBag size={22} />
                {cart.length > 0 && <span className="badge">{cart.length}</span>}
              </button>

              <Link to="/login" className="icon-link">
                <User size={22} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
          >
            <nav className="flex flex-col">
              <Link to="/" onClick={toggleMenu}>Home</Link>
              <Link to="/shop" onClick={toggleMenu}>Shop</Link>
              <Link to="/about" onClick={toggleMenu}>About</Link>
              <Link to="/catalog" onClick={toggleMenu}>Catalog</Link>
              <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            </nav>

            <div className="mt-auto pt-lg border-t text-center">
              <p className="text-secondary text-sm">🌿 Authentic Vedic Wisdom</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
