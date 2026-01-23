import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, ChevronDown } from 'lucide-react'; // Ensure this is imported
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, addToCart, wishlist } = useShop();
    const [quantity, setQuantity] = useState(1);

    // Default active tab is ingredients
    const [activeTab, setActiveTab] = useState('ingredients');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const product = products.find(p => p.id === parseInt(id));

    // Mock related products
    const relatedProducts = products
        .filter(p => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4);

    if (!product) {
        return (
            <div className="container section text-center">
                <h2>Product not found</h2>
                <Link to="/shop" className="btn btn-primary btn-txt mt-md">Back to Shop</Link>
            </div>
        );
    }

    // 1. Quantity Logic
    const handleQuantityChange = (val) => {
        // Prevent going below 1
        if (quantity + val >= 1) {
            setQuantity(quantity + val);
        }
    };

    // 2. Add to Cart Logic
    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added ${quantity} ${product.name} to cart!`); // Optional feedback
    };

    return (
        <div className="product-details-page">
            <div className="container section">
                <div className="product-layout">

                    {/* Gallery Section */}
                    <div className="product-gallery-section">
                        <div className="product-gallery">
                            <div className="main-image-wrapper">
                                <img src={product.image} alt="Main Product" />
                            </div>
                            <div className="thumbnails-grid">
                                {/* Static placeholders for now based on your code */}
                                <div className="thumb-item active"><img src="/assets/product-placeholder.jpeg" alt="View 1" /></div>
                                <div className="thumb-item"><img src="/assets/product-placeholder.jpeg" alt="View 2" /></div>
                                <div className="thumb-item"><img src="/assets/product-placeholder.jpeg" alt="View 3" /></div>
                                <div className="thumb-item"><img src="/assets/product-placeholder.jpeg" alt="View 4" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="product-info-section">
                        <div className="breadcrumbs">Home / <Link to="/shop">Shop</Link> / {product.category}</div>

                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-price-block">
                            <span className="current-price">₹ {product.price}</span>
                        </div>

                        {/* Sticky Actions */}
                        <div className="product-actions-sticky">
                            <div className="quantity-wrapper">
                                {/* Wired up decrease button */}
                                <button onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">-</button>

                                {/* Display dynamic quantity */}
                                <span>{quantity}</span>

                                {/* Wired up increase button */}
                                <button onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">+</button>
                            </div>

                            {/* Wired up Add to Cart */}
                            <button className="btn-add-cart" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>

                        {/* Interactive Tabs Section */}
                        <div className="details-tabs">
                            <div className="tab-headers">
                                {/* Clickable Ingredients Tab */}
                                <div
                                    className={`tab-link ${activeTab === 'ingredients' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('ingredients')}
                                >
                                    Ingredients
                                </div>

                                {/* Clickable Benefits Tab */}
                                <div
                                    className={`tab-link ${activeTab === 'benefits' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('benefits')}
                                >
                                    Benefits
                                </div>
                            </div>

                            <div className="tab-content">
                                {/* Conditional Rendering based on activeTab */}
                                {activeTab === 'ingredients' ? (
                                    <div className="animate-fade">
                                        <p style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                                            {product.Ingredients}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="animate-fade">
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {/* Map through the Benefits array */}
                                            {product.Benefits && product.Benefits.map((benefit, index) => (
                                                <li key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                                                    <ShieldCheck size={18} color="green" style={{ flexShrink: 0, marginTop: '3px' }} />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products mt-2xl pt-2xl border-t">
                        <h2 className="section-title text-center mb-xl">You May Also Like</h2>
                        <div className="product-grid">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AccordionItem = ({ title, isOpen, onClick, children }) => (
    <div className="border-b border-gray-200">
        <button
            className="w-full flex justify-between items-center py-4 text-left focus:outline-none bg-transparent hover:bg-transparent"
            onClick={onClick}
        >
            <span className="text-lg font-medium text-primary">{title}</span>
            <ChevronDown
                size={20}
                className={`transition-transform duration-300 text-secondary ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
        >
            {children}
        </div>
    </div>
);

export default ProductDetails;