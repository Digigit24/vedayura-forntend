import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
  const { cart = [], wishlist = [], openCart, openWishlist } = useShop();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const cartCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="top-bar bg-primary text-white py-xs text-sm">
        <div className="container flex justify-between items-center">
          <p>🌿 Free Shipping on Orders Over ₹999</p>
        </div>
      </div>

      {/* Header */}
      <header className="main-header">
        <div className="container flex justify-between items-center">

          {/* Mobile Menu */}
          <button
            className="mobile-menu-btn hidden-desktop"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/logo-03.png" alt="Vedayura" style={{ height: 50 }} />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav hidden-mobile">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/shop?category=Products">Products</Link>
            <Link to="/shop?category=Catalog">Catalog</Link>
            <Link to="/shop?category=Categories">Categories</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions flex items-center gap-md">
            <form onSubmit={handleSearch} className="search-form hidden-mobile">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <Search size={18} />
              </button>
            </form>

            <button onClick={openWishlist} className="icon-link relative">
  <Heart size={24} />
  {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
</button>

<button onClick={openCart} className="icon-link relative">
  <ShoppingBag size={24} />
  {cart.length > 0 && <span className="badge">{cart.length}</span>}
</button>

            {/* User */}
            <Link to="/login" className="icon-link">
              <User size={24} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="flex flex-col gap-md">
            <Link to="/" onClick={toggleMenu}>Home</Link>
            <Link to="/shop" onClick={toggleMenu}>Shop</Link>
            <Link to="/shop?category=Skincare" onClick={toggleMenu}>Skincare</Link>
            <Link to="/shop?category=Haircare" onClick={toggleMenu}>Haircare</Link>
            <Link to="/shop?category=Wellness" onClick={toggleMenu}>Wellness</Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
