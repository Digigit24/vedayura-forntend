import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CreditCard, Truck, CheckCircle, ChevronRight, MapPin, ShieldCheck } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
    const { cart, clearCart } = useShop();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    const subtotal = cart.reduce((acc, item) => acc + (item.discount_price || item.price) * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePayment = () => {
        // Mock processing
        setTimeout(() => {
            clearCart();
            setStep(3);
            window.scrollTo(0, 0);
        }, 1500);
    };

    if (step === 3) {
        return (
            <div className="container">
                <div className="success-card">
                    <div className="success-icon">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="mb-sm">Order Placed!</h1>
                    <p className="text-secondary mb-xl">
                        Thank you for choosing Vedayura. Your order <strong>#VU-{Math.floor(100000 + Math.random() * 900000)}</strong> has been received and is being prepared with care.
                    </p>
                    <div className="flex justify-center gap-md">
                        <button onClick={() => navigate('/')} className="btn btn-primary">Continue Shopping</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            {/* Progress Bar */}
            <div className="checkout-steps">
                <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                    <div className="step-circle">{step > 1 ? <CheckCircle size={18} /> : '1'}</div>
                    <span className="step-label">Shipping</span>
                </div>
                <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
                    <div className="step-circle">{step > 2 ? <CheckCircle size={18} /> : '2'}</div>
                    <span className="step-label">Payment</span>
                </div>
                <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>
                    <div className="step-circle">3</div>
                    <span className="step-label">Done</span>
                </div>
            </div>

            <div className="checkout-layout">
                <div className="checkout-main">
                    {step === 1 && (
                        <div className="checkout-section">
                            <div className="section-head">
                                <MapPin size={24} className="text-primary" />
                                <h2>Shipping Details</h2>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" required className="form-input" placeholder="e.g. Rahul" />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" required className="form-input" placeholder="e.g. Sharma" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" required className="form-input" placeholder="rahul@example.com" />
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" required className="form-input" placeholder="House no, Building name, Street" />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" required className="form-input" placeholder="e.g. Mumbai" />
                                    </div>
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input type="text" required className="form-input" placeholder="400001" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" required className="form-input" placeholder="+91 98765 43210" />
                                </div>
                                <button type="submit" className="checkout-btn flex items-center justify-center gap-sm">
                                    Continue to Payment <ChevronRight size={20} />
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="checkout-section">
                            <div className="section-head">
                                <ShieldCheck size={24} className="text-primary" />
                                <h2>Payment Method</h2>
                            </div>

                            <div className="payment-grid">
                                <div
                                    className={`payment-card ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('razorpay')}
                                >
                                    <div className="payment-dot"></div>
                                    <div className="flex items-center gap-md flex-1">
                                        <CreditCard size={24} className="text-primary" />
                                        <div>
                                            <h4 className="font-bold">Razorpay Secure</h4>
                                            <p className="text-secondary text-sm">UPI, Cards, Netbanking & Wallets</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <div className="payment-dot"></div>
                                    <div className="flex items-center gap-md flex-1">
                                        <Truck size={24} className="text-secondary" />
                                        <div>
                                            <h4 className="font-bold">Cash on Delivery</h4>
                                            <p className="text-secondary text-sm">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-light p-md rounded-lg mt-lg border border-dashed text-sm text-secondary">
                                <p className="flex items-center gap-xs">
                                    <ShieldCheck size={16} className="text-success" />
                                    Your transaction is secured with 256-bit SSL encryption.
                                </p>
                            </div>

                            <div className="flex gap-md mt-xl">
                                <button className="btn btn-outline" onClick={() => setStep(1)} style={{ marginTop: 0 }}>Back</button>
                                <button className="checkout-btn flex-1" onClick={handlePayment} style={{ marginTop: 0 }}>
                                    Place Order ₹{total.toLocaleString()}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="checkout-sidebar">
                    <div className="sidebar-sticky">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-list">
                                <div className="summary-item">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-success font-bold' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="total-row">
                                    <span>Total Amount</span>
                                    <span className="amount">₹{total.toLocaleString()}</span>
                                </div>
                                <p className="text-xs opacity-60 mt-sm">Inclusive of all duties and taxes</p>
                            </div>
                        </div>

                        <div className="p-md text-center">
                            <p className="text-secondary text-sm flex items-center justify-center gap-xs">
                                <ShieldCheck size={14} /> 100% Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
