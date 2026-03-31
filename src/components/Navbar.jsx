import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, UserCircle, Leaf } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { cart = [], wishlist = [], openCart, openWishlist, user, logout, setGuestMode, products = [] } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const userBtnRef = React.useRef(null);
  const guestBtnRef = React.useRef(null);
  const searchBarRef = useRef(null);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return products
      .filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery, products]);

  const isGuest = !user && localStorage.getItem('guestMode') === 'true';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserDropdown(false);
    setShowGuestDropdown(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setSearchOpen(false);
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

  const openDropdown = (ref, setter) => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 10, right: window.innerWidth - r.right });
    }
    setter(v => !v);
  };

  return (
    <>
      <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
        {/* ── Desktop ── */}
        <div className="nav-container hidden-mobile">

          {/* Logo — left */}
          <Link to="/" className="nav-logo">
            <img src="/logo-03.png" alt="Vedayura" />
          </Link>

          {/* Nav links — center */}
          <nav className="nav-links-center">
            <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
            <NavLink to="/shop" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Shop</NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>About</NavLink>
            <NavLink to="/catalog" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Catalog</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink>
          </nav>

          {/* Actions — right */}
          <div className="nav-actions">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(v => !v)} aria-label="Search">
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            <button className="nav-icon-btn" onClick={openWishlist} aria-label="Wishlist">
              <Heart size={18} />
              {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
            </button>

            <button className="nav-icon-btn" onClick={openCart} aria-label="Cart">
              <ShoppingBag size={18} />
              {cart.length > 0 && <span className="nav-badge">{cart.length}</span>}
            </button>

            {user ? (
              <div className="nav-user-wrapper">
                <button ref={userBtnRef} className="nav-avatar-btn" onClick={() => openDropdown(userBtnRef, setShowUserDropdown)}>
                  <div className="nav-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                </button>
                {showUserDropdown && createPortal(
                  <>
                    <div className="nav-dropdown-backdrop" onClick={() => setShowUserDropdown(false)} />
                    <div className="nav-dropdown" style={{ top: dropdownPos.top, right: dropdownPos.right }}>
                      <div className="nav-dropdown-profile">
                        <div className="nav-dropdown-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                          <p className="nav-dropdown-name">{user.name}</p>
                          <p className="nav-dropdown-email">{user.email}</p>
                        </div>
                      </div>
                      <div className="nav-dropdown-divider" />
                      {!String(user.role || '').toLowerCase().includes('admin') && (
                        <Link to="/profile" className="nav-dropdown-item" onClick={() => setShowUserDropdown(false)}><User size={14} /> My Profile</Link>
                      )}
                      {String(user.role || '').toLowerCase().includes('admin') && (
                        <Link to="/admin" className="nav-dropdown-item" onClick={() => setShowUserDropdown(false)}><Menu size={14} /> Admin Panel</Link>
                      )}
                      <div className="nav-dropdown-divider" />
                      <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}><LogOut size={14} /> Logout</button>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            ) : isGuest ? (
              <div className="nav-user-wrapper">
                <button ref={guestBtnRef} className="nav-icon-btn" onClick={() => openDropdown(guestBtnRef, setShowGuestDropdown)}>
                  <UserCircle size={18} />
                </button>
                {showGuestDropdown && createPortal(
                  <>
                    <div className="nav-dropdown-backdrop" onClick={() => setShowGuestDropdown(false)} />
                    <div className="nav-dropdown" style={{ top: dropdownPos.top, right: dropdownPos.right }}>
                      <div className="nav-dropdown-profile">
                        <div className="nav-dropdown-avatar nav-guest-icon"><UserCircle size={18} /></div>
                        <div>
                          <p className="nav-dropdown-name">Guest User</p>
                          <p className="nav-dropdown-email">Sign in for full access</p>
                        </div>
                      </div>
                      <div className="nav-dropdown-divider" />
                      <Link to="/login" className="nav-dropdown-item" onClick={() => setShowGuestDropdown(false)}><User size={14} /> Sign In / Register</Link>
                      <div className="nav-dropdown-divider" />
                      <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleExitGuestMode}><LogOut size={14} /> Exit Guest Mode</button>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            ) : (
              <div className="nav-user-wrapper">
                <button ref={guestBtnRef} className="nav-icon-btn" onClick={() => openDropdown(guestBtnRef, setShowGuestDropdown)}>
                  <User size={18} />
                </button>
                {showGuestDropdown && createPortal(
                  <>
                    <div className="nav-dropdown-backdrop" onClick={() => setShowGuestDropdown(false)} />
                    <div className="nav-dropdown" style={{ top: dropdownPos.top, right: dropdownPos.right }}>
                      <div className="nav-auth-header">
                        <p className="nav-auth-title">Welcome to Vedayura</p>
                        <p className="nav-auth-sub">How would you like to continue?</p>
                      </div>
                      <div className="nav-dropdown-divider" />
                      <Link to="/login" className="nav-dropdown-item nav-signin-item" onClick={() => setShowGuestDropdown(false)}><User size={14} /> Sign In / Register</Link>
                      <button className="nav-dropdown-item" onClick={handleContinueAsGuest}><UserCircle size={14} /> Continue as Guest</button>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile bar ── */}
        <div className="nav-mobile hidden-desktop">
          <button className="nav-icon-btn" onClick={() => setIsMenuOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
          <Link to="/" className="nav-logo">
            <img src="/logo-03.png" alt="Vedayura" />
          </Link>
          <div style={{ display: 'flex', gap: 2 }}>
            <button className="nav-icon-btn" onClick={openWishlist} aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
            </button>
            <button className="nav-icon-btn" onClick={openCart} aria-label="Cart">
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="nav-badge">{cart.length}</span>}
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="nav-search-bar"
              ref={searchBarRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSearch} className="nav-search-form">
                <Search size={16} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for Ayurvedic products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    className="nav-search-results"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {searchResults.map(p => {
                      const image = p.imageUrls?.[0] || p.images?.[0] || p.image || '/assets/product-placeholder.png';
                      const price = p.discountedPrice || p.discount_price || p.price || 0;
                      return (
                        <button
                          key={p.id}
                          className="nav-search-result-item"
                          onClick={() => { navigate(`/product/${p.id}`); setSearchQuery(''); setSearchOpen(false); }}
                        >
                          <img src={image} alt={p.name} />
                          <div className="nav-search-result-info">
                            <span className="nav-search-result-name">{p.name}</span>
                            {p.category && <span className="nav-search-result-cat">{p.category}</span>}
                          </div>
                          <span className="nav-search-result-price">₹{Number(price).toLocaleString()}</span>
                        </button>
                      );
                    })}
                    <button className="nav-search-view-all" onClick={handleSearch}>
                      View all results for "{searchQuery}" →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div className="mobile-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div className="mobile-drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
            >
              <div className="drawer-header">
                <img src="/logo-03.png" alt="Vedayura" className="drawer-logo" />
                <button className="drawer-close" onClick={() => setIsMenuOpen(false)}><X size={20} /></button>
              </div>

              {user ? (
                <div className="drawer-user-card">
                  <div className="drawer-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                  <div>
                    <p className="drawer-user-name">{user.name}</p>
                    <p className="drawer-user-email">{user.email}</p>
                  </div>
                </div>
              ) : isGuest ? (
                <div className="drawer-user-card drawer-guest-card">
                  <div className="drawer-avatar drawer-guest-avatar"><UserCircle size={20} /></div>
                  <div>
                    <p className="drawer-user-name">Guest User</p>
                    <p className="drawer-user-email">Browsing as guest</p>
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSearch} className="drawer-search">
                <Search size={15} />
                <input type="text" placeholder="Search wellness..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </form>

              <nav className="drawer-nav">
                <NavLink to="/" className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                <NavLink to="/shop" className={({ isActive }) => `drawer-link drawer-shop${isActive ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>Shop Collection</NavLink>
                <NavLink to="/about" className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
                <NavLink to="/catalog" className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>Catalog</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
              </nav>

              <div className="drawer-divider" />

              <div className="drawer-auth">
                {user ? (
                  <>
                    {!String(user.role || '').toLowerCase().includes('admin') && (
                      <NavLink to="/profile" className="drawer-auth-link" onClick={() => setIsMenuOpen(false)}><User size={15} /> My Profile</NavLink>
                    )}
                    {String(user.role || '').toLowerCase().includes('admin') && (
                      <NavLink to="/admin" className="drawer-auth-link" onClick={() => setIsMenuOpen(false)}><Menu size={15} /> Admin Panel</NavLink>
                    )}
                    <button className="drawer-auth-link drawer-logout" onClick={() => { handleLogout(); setIsMenuOpen(false); }}><LogOut size={15} /> Logout</button>
                  </>
                ) : isGuest ? (
                  <>
                    <NavLink to="/login" className="drawer-auth-link" onClick={() => setIsMenuOpen(false)}><User size={15} /> Sign In / Register</NavLink>
                    <button className="drawer-auth-link drawer-logout" onClick={() => { handleExitGuestMode(); setIsMenuOpen(false); }}><LogOut size={15} /> Exit Guest Mode</button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="drawer-auth-link" onClick={() => setIsMenuOpen(false)}><User size={15} /> Sign In / Register</NavLink>
                    <button className="drawer-auth-link" onClick={handleContinueAsGuest}><UserCircle size={15} /> Continue as Guest</button>
                  </>
                )}
              </div>

              <div className="drawer-footer"><Leaf size={12} /> Authentic Vedic Wellness</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
