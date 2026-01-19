import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity } = useShop();
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + (item.discount_price || item.price) * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    if (cart.length === 0) {
        return (
            <div className="cart-page container section text-center py-2xl">
                <h2 className="mb-md">Your Cart is Empty</h2>
                <p className="text-secondary mb-lg">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-page container section">
            <h1 className="page-title mb-lg">Shopping Cart ({cart.length} items)</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-img-wrapper">
                                <img src={item.image} alt={item.name} />
                            </div>

                            <div className="cart-item-details">
                                <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                                <p className="text-secondary text-sm">{item.category}</p>
                                <div className="item-price mobile-only">₹{item.discount_price || item.price}</div>
                            </div>

                            <div className="quantity-controls">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={16} /></button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                            </div>

                            <div className="item-price desktop-only">
                                ₹{(item.discount_price || item.price) * item.quantity}
                            </div>

                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    <Link to="/shop" className="continue-shopping flex items-center gap-sm mt-lg text-primary">
                        <ArrowLeft size={18} /> Continue Shopping
                    </Link>
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping}`}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                    <button className="btn btn-primary w-full mt-lg" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
