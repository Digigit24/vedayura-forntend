import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { cart = [], wishlist = [], openCart, openWishlist, user, logout, setGuestMode } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const userBtnRef = React.useRef(null);
  const guestBtnRef = React.useRef(null);

  // Check if user is in guest mode (stored in localStorage or context)
  const isGuest = !user && localStorage.getItem('guestMode') === 'true';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserDropdown(false);
    setShowGuestDropdown(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('guestMode');
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleContinueAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    if (setGuestMode) setGuestMode(true);
    setShowGuestDropdown(false);
    setIsMenuOpen(false);
  };

  const handleExitGuestMode = () => {
    localStorage.removeItem('guestMode');
    if (setGuestMode) setGuestMode(false);
    setShowGuestDropdown(false);
    navigate('/login');
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
            style={{ zIndex: 3000, position: 'sticky' }}
          >
            {isMenuOpen ? <X size={24} color="#175333" /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/logo-03.png" alt="Vedayura" style={{ height: 50 }} />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav hidden-mobile">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? "active" : ""}>Shop</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink>
            <NavLink to="/catalog" className={({ isActive }) => isActive ? "active" : ""}>Catalog</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink>
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

              {/* User Auth Button */}
              {user ? (
                /* --- Logged-in User --- */
                <div className="nav-user-wrapper">
                  <button
                    ref={userBtnRef}
                    className="nav-user-btn"
                    onClick={() => {
                      if (!showUserDropdown && userBtnRef.current) {
                        const rect = userBtnRef.current.getBoundingClientRect();
                        setDropdownPos({
                          top: rect.bottom + 8,
                          right: window.innerWidth - rect.right,
                        });
                      }
                      setShowUserDropdown(!showUserDropdown);
                    }}
                  >
                    <div className="nav-user-avatar">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="nav-user-name hidden-mobile">{user.name?.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown via Portal */}
                  {showUserDropdown && createPortal(
                    <>
                      <div
                        className="nav-dropdown-backdrop"
                        onClick={() => setShowUserDropdown(false)}
                      />
                      <div
                        className="nav-user-dropdown"
                        style={{ top: dropdownPos.top, right: dropdownPos.right }}
                      >
                        <div className="nav-dropdown-header">
                          <div className="nav-dropdown-avatar">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="nav-dropdown-name">{user.name}</p>
                            <p className="nav-dropdown-email">{user.email}</p>
                          </div>
                        </div>
                        <div className="nav-dropdown-divider"></div>
                        <Link to="/profile" className="nav-dropdown-item" onClick={() => setShowUserDropdown(false)}>
                          <User size={16} />
                          My Profile
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link to="/admin" className="nav-dropdown-item" onClick={() => setShowUserDropdown(false)}>
                            <Menu size={16} />
                            Admin Panel
                          </Link>
                        )}
                        <div className="nav-dropdown-divider"></div>
                        <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              ) : isGuest ? (
                /* --- Guest Mode --- */
                <div className="nav-user-wrapper">
                  <button
                    ref={guestBtnRef}
                    className="nav-guest-btn"
                    onClick={() => {
                      if (!showGuestDropdown && guestBtnRef.current) {
                        const rect = guestBtnRef.current.getBoundingClientRect();
                        setDropdownPos({
                          top: rect.bottom + 8,
                          right: window.innerWidth - rect.right,
                        });
                      }
                      setShowGuestDropdown(!showGuestDropdown);
                    }}
                  >
                    <div className="nav-guest-avatar">
                      <UserCircle size={20} />
                    </div>
                    <span className="nav-user-name hidden-mobile">Guest</span>
                  </button>

                  {showGuestDropdown && createPortal(
                    <>
                      <div
                        className="nav-dropdown-backdrop"
                        onClick={() => setShowGuestDropdown(false)}
                      />
                      <div
                        className="nav-user-dropdown"
                        style={{ top: dropdownPos.top, right: dropdownPos.right }}
                      >
                        <div className="nav-dropdown-header">
                          <div className="nav-guest-avatar-lg">
                            <UserCircle size={24} />
                          </div>
                          <div>
                            <p className="nav-dropdown-name">Guest User</p>
                            <p className="nav-dropdown-email nav-guest-hint">Sign in for full features</p>
                          </div>
                        </div>
                        <div className="nav-dropdown-divider"></div>
                        <Link to="/login" className="nav-dropdown-item" onClick={() => setShowGuestDropdown(false)}>
                          <User size={16} />
                          Sign In / Register
                        </Link>
                        <div className="nav-dropdown-divider"></div>
                        <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleExitGuestMode}>
                          <LogOut size={16} />
                          Exit Guest Mode
                        </button>
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              ) : (
                /* --- Not logged in, not guest: show auth options --- */
                <div className="nav-user-wrapper">
                  <button
                    ref={guestBtnRef}
                    className="nav-auth-btn"
                    onClick={() => {
                      if (!showGuestDropdown && guestBtnRef.current) {
                        const rect = guestBtnRef.current.getBoundingClientRect();
                        setDropdownPos({
                          top: rect.bottom + 8,
                          right: window.innerWidth - rect.right,
                        });
                      }
                      setShowGuestDropdown(!showGuestDropdown);
                    }}
                  >
                    <User size={22} />
                  </button>

                  {showGuestDropdown && createPortal(
                    <>
                      <div
                        className="nav-dropdown-backdrop"
                        onClick={() => setShowGuestDropdown(false)}
                      />
                      <div
                        className="nav-user-dropdown nav-auth-dropdown"
                        style={{ top: dropdownPos.top, right: dropdownPos.right }}
                      >
                        <div className="nav-auth-dropdown-header">
                          <p className="nav-auth-title">Welcome to Vedayura</p>
                          <p className="nav-auth-subtitle">Choose how you'd like to continue</p>
                        </div>
                        <div className="nav-dropdown-divider"></div>
                        <Link
                          to="/login"
                          className="nav-dropdown-item nav-auth-signin"
                          onClick={() => setShowGuestDropdown(false)}
                        >
                          <User size={16} />
                          Sign In / Register
                        </Link>
                        <button
                          className="nav-dropdown-item nav-auth-guest"
                          onClick={handleContinueAsGuest}
                        >
                          <UserCircle size={16} />
                          Continue as Guest
                        </button>
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              )}
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
              <button
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={28} />
              </button>

              <div className="mobile-menu-content">
                {/* Mobile User Info */}
                {user ? (
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="mobile-user-name">{user.name}</p>
                      <p className="mobile-user-email">{user.email}</p>
                    </div>
                  </div>
                ) : isGuest ? (
                  <div className="mobile-user-info mobile-guest-info">
                    <div className="mobile-guest-avatar">
                      <UserCircle size={24} />
                    </div>
                    <div>
                      <p className="mobile-user-name">Guest User</p>
                      <p className="mobile-user-email">Browsing as guest</p>
                    </div>
                  </div>
                ) : null}

                <div className="mobile-search-container">
                  <form onSubmit={handleSearch}>
                    <div className="mobile-search-input">
                      <Search size={18} />
                      <input
                        type="text"
                        placeholder="Search wellness..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </div>

                <nav className="mobile-nav-links">
                  <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                  <NavLink to="/shop" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMenuOpen(false)}>Shop Collection</NavLink>
                  <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMenuOpen(false)}>Our Story</NavLink>
                  <NavLink to="/catalog" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMenuOpen(false)}>Catalog</NavLink>
                  <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMenuOpen(false)}>Contact Us</NavLink>
                </nav>

                {/* Mobile Auth Links */}
                <div className="mobile-auth-links">
                  {user ? (
                    <>
                      <NavLink to="/profile" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>
                        <User size={18} />
                        My Profile
                      </NavLink>
                      {user.role === 'ADMIN' && (
                        <NavLink to="/admin" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>
                          <Menu size={18} />
                          Admin Panel
                        </NavLink>
                      )}
                      <button className="mobile-auth-link mobile-logout-btn" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                        <LogOut size={18} />
                        Logout
                      </button>
                    </>
                  ) : isGuest ? (
                    <>
                      <NavLink to="/login" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>
                        <User size={18} />
                        Sign In / Register
                      </NavLink>
                      <button className="mobile-auth-link mobile-logout-btn" onClick={() => { handleExitGuestMode(); setIsMenuOpen(false); }}>
                        <LogOut size={18} />
                        Exit Guest Mode
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>
                        <User size={18} />
                        Sign In / Register
                      </NavLink>
                      <button className="mobile-auth-link mobile-guest-btn" onClick={handleContinueAsGuest}>
                        <UserCircle size={18} />
                        Continue as Guest
                      </button>
                    </>
                  )}
                </div>

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