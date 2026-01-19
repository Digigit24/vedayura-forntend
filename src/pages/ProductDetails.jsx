import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Heart, Minus, Plus, Truck, ShieldCheck, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard'; // For related products if needed
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, addToCart, addToWishlist, wishlist } = useShop();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const product = products.find(p => p.id === parseInt(id));
    const isWishlisted = product ? wishlist.some(item => item.id === product.id) : false;

    // Mock related products
    const relatedProducts = products
        .filter(p => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4);

    if (!product) {
        return <div className="container section text-center"><h2>Product not found</h2><Link to="/shop" className="btn btn-primary btn-txt mt-md">Back to Shop</Link></div>;
    }

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) setQuantity(quantity + val);
    };

    return (
        <div className="product-details-page">
            <div className="container section">
                <div className="product-layout items-start">
                    {/* Gallery Section */}
                    <div className="product-gallery-section">
                        <div className="main-image-wrapper bg-light rounded-xl overflow-hidden relative group">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <button
                                className={`absolute top-4 right-4 p-3 rounded-full bg-white shadow-md transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                onClick={() => addToWishlist(product)}
                            >
                                <Heart fill={isWishlisted ? 'currentColor' : 'none'} size={24} />
                            </button>
                            {product.discount_price && (
                                <span className="absolute top-4 left-4 bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-sm">
                                    -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                                </span>
                            )}
                        </div>
                        <div className="thumbnails-grid mt-md">
                            {[product.image, product.image, product.image].map((img, i) => (
                                <div key={i} className={`thumb-item rounded-lg overflow-hidden border-2 cursor-pointer ${i === 0 ? 'border-primary' : 'border-transparent'}`}>
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="product-info-section pl-lg">
                        <nav className="breadcrumbs text-sm text-secondary mb-md font-medium">
                            <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <span className="text-primary">{product.category}</span>
                        </nav>

                        <h1 className="product-title text-4xl font-bold mb-xs text-dark">{product.name}</h1>
                        <div className="flex items-center gap-sm mb-md">
                            <div className="flex text-yellow-400">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                            <span className="text-sm text-secondary">(120 Reviews)</span>
                        </div>

                        <div className="product-price-block mb-lg p-md bg-light rounded-lg inline-block w-full">
                            <div className="flex items-baseline gap-md">
                                <span className="text-3xl font-bold text-primary">₹{product.discount_price || product.price}</span>
                                {product.discount_price && <span className="text-xl text-secondary line-through">₹{product.price}</span>}
                            </div>
                            <p className="text-sm text-success mt-xs">Inclusive of all taxes</p>
                        </div>

                        <p className="product-description text-secondary text-lg mb-xl leading-relaxed">
                            {product.description}
                        </p>

                        <div className="product-actions-sticky mb-xl p-md border rounded-lg bg-white shadow-sm">
                            <div className="flex gap-md flex-wrap">
                                <div className="quantity-wrapper flex items-center border rounded-md">
                                    <button className="px-md py-sm hover:bg-light" onClick={() => handleQuantityChange(-1)}><Minus size={18} /></button>
                                    <span className="px-lg font-bold text-lg">{quantity}</span>
                                    <button className="px-md py-sm hover:bg-light" onClick={() => handleQuantityChange(1)}><Plus size={18} /></button>
                                </div>
                                <button
                                    className="btn btn-primary btn-txt flex-1 py-md text-lg shadow-lg hover:shadow-xl transition-all"
                                    onClick={() => addToCart(product, quantity)}
                                >
                                    <ShoppingBag className="mr-sm" /> Add to Cart
                                </button>
                            </div>
                        </div>

                        <div className="benefits-grid grid grid-cols-2 gap-md mb-xl">
                            <div className="benefit-item flex items-center gap-sm p-sm rounded bg-light border border-transparent hover:border-primary transition-all">
                                <Truck className="text-primary" />
                                <div>
                                    <p className="font-bold text-sm">Free Delivery</p>
                                    <p className="text-xs text-secondary">Orders over ₹999</p>
                                </div>
                            </div>
                            <div className="benefit-item flex items-center gap-sm p-sm rounded bg-light border border-transparent hover:border-primary transition-all">
                                <ShieldCheck className="text-primary" />
                                <div>
                                    <p className="font-bold text-sm">Authentic</p>
                                    <p className="text-xs text-secondary">100% Original</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="details-tabs mt-xl">
                            <div className="flex border-b mb-md overflow-x-auto">
                                {['Description', 'Ingredients', 'How to Use', 'Video'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`px-lg py-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.toLowerCase().replace(/ /g, '') || (tab === 'How to Use' && activeTab === 'usage') ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
                                        onClick={() => setActiveTab(tab === 'How to Use' ? 'usage' : tab.toLowerCase())}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="tab-content text-secondary leading-relaxed bg-light p-lg rounded-lg">
                                {(activeTab === 'description') && <p>{product.description} Experience the purity of nature with every use.</p>}
                                {activeTab === 'ingredients' && <ul className="list-disc pl-md space-y-xs">
                                    {product.ingredients.split(',').map((ing, i) => <li key={i}>{ing.trim()}</li>)}
                                </ul>}
                                {activeTab === 'usage' && <p>{product.usage}</p>}
                                {activeTab === 'video' && (
                                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white min-h-[300px]">
                                        <p>Video Demonstration Placeholder for {product.name}</p>
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

export default ProductDetails;
