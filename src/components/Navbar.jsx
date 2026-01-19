import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
    const { cart, user, logout, products, wishlist } = useShop();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${searchQuery}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <div className="top-bar bg-primary text-white py-xs text-sm font-medium">
                <div className="container flex justify-between items-center">
                    <p className="text-white">🌿 Free Shipping on Orders Over ₹999 | 100% Authentic Ayurvedic Products</p>
                    <div className="top-links hidden-mobile space-x-lg">
                        <Link to="/contact" className="text-white hover:text-white/80">Contact</Link>
                        <Link to="/faq" className="text-white hover:text-white/80">FAQ</Link>
                    </div>
                </div>
            </div>

            <header className="main-header">
                <div className="container flex justify-between items-center">
                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn hidden-desktop" onClick={toggleMenu}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="logo">
                        <img src="/logo-03.png" alt="Vedayura" className="h-16 w-auto" style={{ maxHeight: '60px' }} />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav hidden-mobile">
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/shop?category=Skincare">Skincare</Link>
                        <Link to="/shop?category=Haircare">Haircare</Link>
                        <Link to="/shop?category=Wellness">Wellness</Link>
                    </nav>

                    {/* Icons & Actions */}
                    <div className="header-actions flex items-center gap-md">
                        <form onSubmit={handleSearch} className="search-form hidden-mobile">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit"><Search size={18} /></button>
                        </form>

                        <Link to="/wishlist" className="icon-link relative">
                            <Heart size={24} />
                            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                        </Link>

                        <Link to="/cart" className="icon-link relative">
                            <ShoppingBag size={24} />
                            {cartCount > 0 && <span className="badge">{cartCount}</span>}
                        </Link>

                        {user ? (
                            <div className="user-menu relative">
                                <Link to={user.role === 'admin' ? "/admin" : "/profile"} className="icon-link">
                                    <User size={24} />
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-login hidden-mobile">Login</Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <nav className="flex flex-col gap-md">
                        <Link to="/" onClick={toggleMenu}>Home</Link>
                        <Link to="/shop" onClick={toggleMenu}>Shop</Link>
                        <Link to="/shop?category=Skincare" onClick={toggleMenu}>Skincare</Link>
                        <Link to="/shop?category=Haircare" onClick={toggleMenu}>Haircare</Link>
                        <Link to="/shop?category=Wellness" onClick={toggleMenu}>Wellness</Link>
                        <hr />
                        {user ? (
                            <>
                                <Link to="/profile" onClick={toggleMenu}>My Account</Link>
                                <button onClick={() => { logout(); toggleMenu(); }}>Logout</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={toggleMenu}>Login / Register</Link>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
