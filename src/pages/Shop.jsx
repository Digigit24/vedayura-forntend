import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, Search, X, ChevronRight } from 'lucide-react';
import './Shop.css';

// Import Marquee for smooth ticker effect
import Marquee from 'react-fast-marquee';

const Shop = () => {
    const { products } = useShop();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialCategory = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
    const [priceRange, setPriceRange] = useState(2000);
    const [sortBy, setSortBy] = useState('featured');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [activeSearch, setActiveSearch] = useState(searchQuery || '');

    const categories = ['All', 'Liquid', 'Powder', 'Capsules'];

    useEffect(() => {
        let result = products;

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Filter by Search Query
        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        }

        // Filter by Price
        result = result.filter(p => (p.discount_price || p.price) <= priceRange);

        // Sort
        if (sortBy === 'price-low') {
            result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        }
        // 'featured' is default order in data

        setFilteredProducts(result);
    }, [selectedCategory, activeSearch, priceRange, sortBy, products]);

    useEffect(() => {
        if (initialCategory) {
            setSelectedCategory(initialCategory);
        } else {
            setSelectedCategory('All');
        }
        if (searchQuery) {
            setActiveSearch(searchQuery);
        }
    }, [initialCategory, searchQuery]);

    return (
        <div className="shop-page">
            {/* Shop Hero Banner */}
            <div className="shop-hero">
                <div className="container shop-hero-inner">
                    <div className="hero-left">
                        <h1 className="vedayura-title">Our Collection</h1>
                        <div className="shop-divider"></div>
                        <p className="text-large">
                            Pure. Potent. Authentic. <br /> Explore our range of Ayurvedic essentials designed for holistic healing.
                        </p>
                    </div>

                    <div className="hero-right">
                        <Marquee
                            speed={40}
                            pauseOnHover={true}
                            gradient={false}
                        >
                            {[
                                '/assets/product-placeholder.jpeg',
                                '/assets/product-placeholder.jpeg',
                                '/assets/product-placeholder.jpeg',
                                '/assets/product-placeholder.jpeg'
                            ].map((img, i) => (
                                <div key={`primary-${i}`} className="slider-item">
                                    <img src={img} alt={`Ayurvedic Product ${i}`} />
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </div>
            </div>

            <div className="container section">
                <div className="shop-layout">
                    {/* Sidebar Filters */}
                    {isMobileFiltersOpen && (
                        <div
                            className="sidebar-backdrop hidden-desktop"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        ></div>
                    )}
                    <aside className={`shop-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
                        <div className="sidebar-header flex justify-between items-center hidden-desktop mb-lg">
                            <h3>Filter Products</h3>
                            <button className="p-sm" onClick={() => setIsMobileFiltersOpen(false)}><X /></button>
                        </div>

                        {/* Categories in Sidebar */}
                        <div className="filter-group">
                            <h3>Categories</h3>
                            <ul className="category-list">
                                {categories.map(cat => {
                                    const count = cat === 'All'
                                        ? products.length
                                        : products.filter(p => p.category === cat).length;

                                    return (
                                        <li key={cat}>
                                            <button
                                                className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                                                onClick={() => setSelectedCategory(cat)}
                                            >
                                                <span className="category-name">{cat}</span>
                                                <span className="category-count">({count})</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div className="filter-group">
                            <h3>Price Range</h3>
                            <div className="price-slider">
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    step="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                />
                                <div className="flex justify-between text-sm text-secondary mt-xs">
                                    <span>₹0</span>
                                    <span className="font-bold text-primary">₹{priceRange}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="shop-main" data-category={selectedCategory}>

                        <div className="shop-toolbar">
                            <div className="toolbar-top">
                                <div className="controls-left">
                                    <button
                                        className="filter-toggle-btn hidden-desktop btn-vedayura btn-vedayura-outline"
                                        onClick={() => setIsMobileFiltersOpen(true)}
                                    >
                                        <Filter size={16} /> Filters
                                    </button>
                                    <div className="results-info hidden-mobile">
                                        {filteredProducts.length} Products
                                    </div>
                                </div>

                                <div className="controls-right">
                                    <div className="sort-wrapper">
                                        <label className="sort-label hidden-mobile">Sort by:</label>
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

                            {/* Active Filters Display */}
                            {(selectedCategory !== 'All' || priceRange < 2000 || activeSearch) && (
                                <div className="active-filters">
                                    <span className="filter-label">Active Filters:</span>
                                    {selectedCategory !== 'All' && (
                                        <button className="filter-chip" onClick={() => setSelectedCategory('All')}>
                                            {selectedCategory} <X size={14} />
                                        </button>
                                    )}
                                    {priceRange < 2000 && (
                                        <button className="filter-chip" onClick={() => setPriceRange(2000)}>
                                            Under ₹{priceRange} <X size={14} />
                                        </button>
                                    )}
                                    {activeSearch && (
                                        <button className="filter-chip" onClick={() => setActiveSearch('')}>
                                            "{activeSearch}" <X size={14} />
                                        </button>
                                    )}
                                    <button
                                        className="clear-all-filters"
                                        onClick={() => { setSelectedCategory('All'); setPriceRange(2000); setActiveSearch(''); }}
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Search Bar Refined */}
                        <div className="shop-search-premium">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="Looking for something specific?"
                                    value={activeSearch}
                                    onChange={(e) => setActiveSearch(e.target.value)}
                                />
                                {activeSearch && (
                                    <button className="clear-search" onClick={() => setActiveSearch('')}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <>
                                <div className="product-grid-wrapper animate-fade-in">
                                    <div className="product-grid">
                                        {filteredProducts.map(product => (
                                            <ProductCard key={product.id} product={product} activeCategory={selectedCategory} />
                                        ))}
                                    </div>
                                </div>

                                {/* Mock Pagination */}
                                <div className="pagination">
                                    <button disabled className="btn-vedayura btn-vedayura-outline disabled">Prev</button>
                                    <button className="btn-vedayura btn-vedayura-primary">1</button>
                                    <button className="btn-vedayura btn-vedayura-outline">2</button>
                                    <button className="btn-vedayura btn-vedayura-outline">Next</button>
                                </div>
                            </>
                        ) : (
                            <div className="no-products-premium">
                                <div className="no-products-icon">
                                    <Search size={48} />
                                </div>
                                <h3>No matching products found</h3>
                                <p>We couldn't find any products matching your current filters or search query. Try broadening your selection or checking for typos.</p>
                                <div className="no-products-actions">
                                    <button
                                        className="btn-vedayura btn-vedayura-primary"
                                        onClick={() => { setSelectedCategory('All'); setPriceRange(2000); setSortBy('featured'); setActiveSearch(''); }}
                                    >
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
