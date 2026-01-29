import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
// Added SlidersHorizontal for the filter button icon
import { ChevronDown, Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import './Shop.css';
import Marquee from 'react-fast-marquee';

const Shop = () => {
    const { products } = useShop();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialCategory = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    // Filter States
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
    const [priceRange, setPriceRange] = useState(2000);
    const [sortBy, setSortBy] = useState('featured');
    const [activeSearch, setActiveSearch] = useState(searchQuery || '');
    
    // UI State: Drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, activeSearch, priceRange, sortBy]);

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const categories = ['All', 'Liquid', 'Powder', 'Capsules'];

    // Filter Logic
    useEffect(() => {
        let result = products;
        
        // 1. Category
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }
        
        // 2. Search
        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q)) ||
                (p.Ingredients && p.Ingredients.toLowerCase().includes(q))
            );
        }
        
        // 3. Price
        result = result.filter(p => (p.discount_price || p.price) <= priceRange);

        // 4. Sort
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
    };

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isDrawerOpen]);

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
                                Discover our collection of Ayurvedic products crafted to restore balance.
                            </p>
                        </div>
                        <div className="hero-right">
                            <Marquee speed={40} pauseOnHover={true} gradient={false}>
                                {['/assets/product-placeholder.jpeg', '/assets/product-placeholder.jpeg', '/assets/product-placeholder.jpeg'].map((img, i) => (
                                    <div key={`hero-img-${i}`} className="slider-item">
                                        <img src={img} alt={`Product ${i}`} />
                                    </div>
                                ))}
                            </Marquee>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container section">
                
                <div className="shop-layout">
                    {/* UPDATED TOOLBAR: Search + Filter Button */}
                    <div className="shop-toolbar sticky-toolbar">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Search...."
                                value={activeSearch}
                                onChange={(e) => setActiveSearch(e.target.value)}
                            />
                            {activeSearch && (
                                <button className="clear-search" onClick={() => setActiveSearch('')}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        
                        <button 
                            className={`btn-filter-trigger ${isDrawerOpen ? 'active' : ''}`}
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <SlidersHorizontal size={18} />
                            <span>Filters</span>
                            {/* Dot indicator if filters are active */}
                            {(selectedCategory !== 'All' || priceRange < 2000 || sortBy !== 'featured') && 
                                <span className="filter-badge"></span>
                            }
                        </button>
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

                                {/* Pagination */}
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
                                <button className="btn-shop btn-shop-primary" onClick={resetFilters}>
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* =========================================
               BOTTOM DRAWER (Hidden until clicked)
               ========================================= */}
            <div 
                className={`drawer-backdrop ${isDrawerOpen ? 'open' : ''}`} 
                onClick={() => setIsDrawerOpen(false)}
            ></div>
            
            <div className={`bottom-drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>Filter & Sort</h3>
                    <button className="btn-close-drawer" onClick={() => setIsDrawerOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="drawer-body">
                    {/* Categories */}
                    <div className="drawer-section">
                        <h4>Categories</h4>
                        <div className="drawer-chips">
                            {categories.map(cat => {
                                const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat} <span className="chip-count">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="drawer-section">
                        <div className="drawer-row-between">
                            <h4>Max Price</h4>
                            <span className="price-tag">₹{priceRange}</span>
                        </div>
                        <input
                            type="range"
                            className="styled-range"
                            min="0"
                            max="2000"
                            step="100"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                        />
                    </div>

                    {/* Sort By */}
                    <div className="drawer-section">
                        <h4>Sort By</h4>
                        <div className="select-wrapper">
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)} 
                                className="drawer-select"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                            <ChevronDown size={16} className="select-icon" />
                        </div>
                    </div>
                </div>

                <div className="drawer-footer">
                    <button className="btn-drawer-reset" onClick={resetFilters}>
                        Reset
                    </button>
                    <button className="btn-drawer-apply" onClick={() => setIsDrawerOpen(false)}>
                        Show {filteredProducts.length} Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Shop;