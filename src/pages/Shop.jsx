import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import './Shop.css';

// Import React Slick and Slick styles
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

    const categories = ['All', 'Skincare', 'Haircare', 'Ayurvedic Tablets', 'Wellness Oils'];

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
                {/* Smaller div */}
                <div className="container hero-left">
                    <h1 className="shop-title">Our Collection</h1>
                    <div className="shop-divider"></div>
                    <p className="text-large">
                        Pure. Potent. Authentic. <br /> Explore our range of Ayurvedic essentials.
                    </p>
                </div>

                {/* Bigger div with Image Slider */}
                <div className="hero-right">
    <Slider
        dots={true}  // Display dots for navigation
        infinite={true}  // Infinite scrolling
        speed={500}  // Transition speed
        slidesToShow={1}  // Show one slide at a time
        slidesToScroll={1}  // Scroll one slide at a time
        autoplay={true}  // Enable autoplay
        autoplaySpeed={3000}  // Speed of autoplay
    >
        {filteredProducts.map((product) => (
            <div key={product.id}>
                <img src={product.image} alt={product.name} />
            </div>
        ))}
    </Slider>
</div>

            </div>

            <div className="container section">
                <div className="shop-layout">
                    {/* Sidebar Filters */}
                    <aside className={`shop-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
                        <div className="sidebar-header flex justify-between items-center hidden-desktop mb-lg">
                            <h3>Filters</h3>
                            <button onClick={() => setIsMobileFiltersOpen(false)}><X /></button>
                        </div>

                        <div className="filter-group">
                            <h3>Categories</h3>
                            <ul>
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <button
                                            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                            onClick={() => { setSelectedCategory(cat); setIsMobileFiltersOpen(false); }}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

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

                        <div className="shop-controls p-20 flex justify-between items-center mb-xl">

                            <p className="text-secondary shop-results hidden-mobile">{filteredProducts.length} Results</p>

                            <div className="sort-wrapper flex items-center gap-sm">
                                <span className="text-secondary text-sm hidden-mobile">Sort By:</span>
                                <div className="select-wrapper">
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                    <ChevronDown size={18} className="select-icon" />
                                </div>
                            </div>
                        </div>

                        {/* Search Bar for Shop (In Page) */}
                        <div className="shop-search mb-xl">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search within products..."
                                value={activeSearch}
                                onChange={(e) => setActiveSearch(e.target.value)}
                            />
                        </div>

                        {filteredProducts.length > 0 ? (
                            <>
                                <div className="product-grid">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} activeCategory={selectedCategory} />
                                    ))}
                                </div>

                                {/* Mock Pagination */}
                                <div className="pagination flex justify-center mt-2xl gap-sm">
                                    <button disabled className="btn btn-outline disabled">Prev</button>
                                    <button className="btn btn-primary btn-txt btn-txt">1</button>
                                    <button className="btn btn-outline">2</button>
                                    <button className="btn btn-outline">Next</button>
                                </div>
                            </>
                        ) : (
                            <div className="no-products text-center py-2xl">
                                <h3>No products found.</h3>
                                <p className="text-secondary mb-md">Try adjusting your search or filters.</p>
                                <button
                                    className="btn btn-primary btn-txt btn-txt"
                                    onClick={() => { setSelectedCategory('All'); setPriceRange(2000); setSortBy('featured'); setActiveSearch(''); }}
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
