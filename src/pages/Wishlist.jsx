import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
    const { wishlist } = useShop();

    if (wishlist.length === 0) {
        return (
            <div className="container section text-center py-2xl">
                <h2 className="mb-md">Your Wishlist is Empty</h2>
                <p className="text-secondary mb-lg">Save items you love here.</p>
                <Link to="/shop" className="btn btn-primary btn-txt">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container section">
            <h1 className="page-title mb-lg">My Wishlist</h1>
            <div className="product-grid">
                {wishlist.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
