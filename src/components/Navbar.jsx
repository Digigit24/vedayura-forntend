import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { cart = [], wishlist = [], openCart, openWishlist } = useShop();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to detect route changes

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Handle Scroll Effect for Header Background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. KEY FIX: Lock Body Scroll when Menu is Open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      document.body.style.overflow = 'unset'; // Unlock scroll
    }

    // Cleanup function: Unlock scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // 3. Close menu automatically when route changes (clicking a link)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false); // Close menu on search
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
            style={{ zIndex: 3000, position: 'relative' }} // Ensure button stays on top
          >
            {isMenuOpen ? <X size={24} color="#175333" /> : <Menu size={24} />}
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
    <>
      {/* Backdrop */}
      <motion.div 
          className="mobile-menu-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Slide-in Menu */}
      <motion.div
        className="mobile-menu"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
      >
        {/* --- NEW CLOSE BUTTON --- */}
        <button 
          className="mobile-menu-close" 
          onClick={() => setIsMenuOpen(false)}
        >
          <X size={28} />
        </button>
        {/* ------------------------ */}

        <div className="mobile-menu-content">
          {/* ... existing search and links ... */}
          <div className="mobile-search-container">
             {/* ... search input code ... */}
          </div>

          <nav className="mobile-nav-links">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop Collection</Link>
            <Link to="/about">Our Story</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/login">My Account</Link>
          </nav>

          <div className="mobile-menu-footer">
            <p className="text-secondary text-sm">🌿 Authentic Vedic Wisdom</p>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </>
  );
};

export default Navbar;