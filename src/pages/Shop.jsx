import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
// 1. IMPORT CHEVRONS HERE
import { ChevronDown, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Shop.css';
import Marquee from 'react-fast-marquee';

const Shop = () => {
    // ... (All your existing state and logic remains exactly the same) ...
    const { products } = useShop();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialCategory = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
    const [priceRange, setPriceRange] = useState(2000);
    const [sortBy, setSortBy] = useState('featured');
    const [activeSearch, setActiveSearch] = useState(searchQuery || '');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8); // Show 8 products per page

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, activeSearch, priceRange, sortBy]);

    // Calculate Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const categories = ['All', 'Liquid', 'Powder', 'Capsules'];

    useEffect(() => {
        let result = products;
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }
        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q)) ||
                (p.Ingredients && p.Ingredients.toLowerCase().includes(q))
            );
        }
        result = result.filter(p => (p.discount_price || p.price) <= priceRange);

        if (sortBy === 'price-low') {
            result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        }
        setFilteredProducts(result);
    }, [selectedCategory, activeSearch, priceRange, sortBy, products]);

    useEffect(() => {
        if (initialCategory) setSelectedCategory(initialCategory);
        if (searchQuery) setActiveSearch(searchQuery);
    }, [initialCategory, searchQuery]);

    const resetFilters = () => {
        setSelectedCategory('All');
        setPriceRange(2000);
        setSortBy('featured');
        setActiveSearch('');
    };

    return (
        <div className="shop-page">
            {/* Hero Section (Unchanged) */}
            <div className="container" style={{ padding: 0 }}>
                <div className="shop-hero">
                    <div className="shop-hero-inner">
                        <div className="hero-left">
                            <h1 className="vedayura-title">Our Collection</h1>
                            <div className="shop-divider"></div>
                            <p className="text-large">
                                Natural. Powerful. Timeless. <br />
                                Discover our collection of Ayurvedic products crafted to restore balance and support your well-being.
                            </p>
                        </div>
                        <div className="hero-right">
                            <Marquee speed={40} pauseOnHover={true} gradient={false}>
                                {['/assets/product-placeholder.jpeg', '/assets/product-placeholder.jpeg', '/assets/product-placeholder.jpeg', '/assets/product-placeholder.jpeg'].map((img, i) => (
                                    <div key={`hero-img-${i}`} className="slider-item">
                                        <img src={img} alt={`Ayurvedic Product ${i}`} />
                                    </div>
                                ))}
                            </Marquee>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container section">
                {/* Category Pills */}
                <div className="shop-category-nav">
                    <div className="category-scroll-wrapper">
                        {categories.map(cat => {
                            const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                            return (
                                <button
                                    key={cat}
                                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    <span className="pill-text">{cat}</span>
                                    <span className="pill-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Layout */}
                <div className="shop-layout">
                    {/* Toolbar */}
                    <div className="shop-toolbar">
                        <div className="toolbar-top">
                            <div className="shop-search-centered">
                                <div className="search-input-wrapper">
                                    <Search className="search-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search for herbs..."
                                        value={activeSearch}
                                        onChange={(e) => setActiveSearch(e.target.value)}
                                    />
                                    {activeSearch && (
                                        <button className="clear-search" onClick={() => setActiveSearch('')}>
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="controls-right">
                                <div className="price-filter-compact">
                                    <span>Max Price: <strong>₹{priceRange}</strong></span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        step="100"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                    />
                                </div>
                                <div className="sort-wrapper">
                                    <div className="select-wrapper">
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                                            <option value="featured">Featured</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                        </select>
                                        <ChevronDown size={16} className="select-icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <main className="shop-main">
                        {filteredProducts.length > 0 ? (
                            <>
                                <div className="product-grid-wrapper animate-fade-in">
                                    <div className="product-grid">
                                        {currentProducts.map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                activeCategory={selectedCategory}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className={`btn-shop btn-shop-outline ${currentPage === 1 ? 'disabled' : ''}`}
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                className={`btn-shop ${currentPage === i + 1 ? 'btn-shop-primary' : 'btn-shop-outline'}`}
                                                onClick={() => paginate(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            className={`btn-shop btn-shop-outline ${currentPage === totalPages ? 'disabled' : ''}`}
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-products-premium">
                                <div className="no-products-icon">
                                    <Search size={48} />
                                </div>
                                <h3>No matching products found</h3>
                                <p>Try adjusting your search or filters.</p>
                                <div className="no-products-actions">
                                    <button className="btn-shop btn-shop-primary" onClick={resetFilters}>
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;