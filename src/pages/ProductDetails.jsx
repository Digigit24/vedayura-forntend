import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Heart, Minus, Plus, Truck, ShieldCheck, Star, ChevronDown } from 'lucide-react';
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

    const product = products.find(p => p.id == id);
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

                        <div className="py-4 border-b border-gray-100 mb-6">
                            <p className="text-secondary text-lg leading-relaxed mb-4">
                                {product.description}
                            </p>
                            
                            {/* Visible Highlights */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-2">Key Highlights</h3>
                                <ul className="grid grid-cols-1 gap-2">
                                    <li className="flex items-center text-secondary text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                                        100% Natural Instructions
                                    </li>
                                    <li className="flex items-center text-secondary text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                                        Contains pure {product.ingredients.split(',')[0]}
                                    </li>
                                    <li className="flex items-center text-secondary text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                                        Suitable for daily wellness
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="product-actions-sticky mb-xl bg-white rounded-lg">
                            <div className="flex gap-md flex-wrap items-center">
                                <div className="quantity-wrapper flex items-center border rounded-md">
                                    <button className="px-md py-sm hover:bg-light transition-colors" onClick={() => handleQuantityChange(-1)}><Minus size={18} /></button>
                                    <span className="px-lg font-bold text-lg">{quantity}</span>
                                    <button className="px-md py-sm hover:bg-light transition-colors" onClick={() => handleQuantityChange(1)}><Plus size={18} /></button>
                                </div>
                                <button
                                    className="btn btn-primary btn-txt flex-1 py-md text-lg shadow-lg hover:shadow-xl transition-all btn-add-cart"
                                    onClick={() => addToCart(product, quantity)}
                                >
                                    <ShoppingBag className="mr-sm" size={20} /> Add to Cart
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-xs text-secondary px-1">
                                <div className="flex items-center gap-1">
                                    <Truck size={14} className="text-primary"/> Free Delivery over ₹999
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck size={14} className="text-primary"/> Genuine Product
                                </div>
                            </div>
                        </div>

                        {/* Product Meta Accordions */}
                        <div className="product-accordions border-t border-gray-200 mt-xl">
                            <AccordionItem title="Description" isOpen={activeTab === 'description'} onClick={() => setActiveTab(activeTab === 'description' ? '' : 'description')}>
                                <p className="text-secondary leading-relaxed">{product.description}</p>
                                <p className="mt-4 text-secondary">Experience the purity of nature with every use.</p>
                            </AccordionItem>
                            
                            <AccordionItem title="Ingredients" isOpen={activeTab === 'ingredients'} onClick={() => setActiveTab(activeTab === 'ingredients' ? '' : 'ingredients')}>
                                <ul className="list-disc pl-5 space-y-2 text-secondary">
                                    {product.ingredients.split(',').map((ing, i) => (
                                        <li key={i}>{ing.trim()}</li>
                                    ))}
                                </ul>
                            </AccordionItem>

                            <AccordionItem title="How to Use" isOpen={activeTab === 'usage'} onClick={() => setActiveTab(activeTab === 'usage' ? '' : 'usage')}>
                                <div className="prose text-secondary">
                                    <p>{product.usage}</p>
                                </div>
                            </AccordionItem>
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
