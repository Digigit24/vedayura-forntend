import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CreditCard, Truck, CheckCircle, ChevronRight, MapPin, ShieldCheck, Loader } from 'lucide-react';
import { calculateCartShipping, createOrderWithShipping, verifyPaymentAndCreateShipment } from '../api/shippingService';
import './Checkout.css';

const Checkout = () => {
    const { cart, clearCart } = useShop();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [shippingCost, setShippingCost] = useState(0); // Default to 0 until calculated
    const [loading, setLoading] = useState(false);
    const [pincode, setPincode] = useState('');

    const subtotal = cart.reduce((acc, item) => acc + (item.discount_price || item.price) * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const [addressForm, setAddressForm] = useState({ firstName: '', lastName: '', email: '', street: '', city: '', zip: '', phone: '' });
    const [addressId, setAddressId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // create address on server if possible
        try {
            const payload = {
                street: addressForm.street,
                city: addressForm.city,
                state: '',
                pincode: addressForm.zip,
                country: 'India',
                isDefault: true
            };
            const res = await api.addresses.add(payload);
            if (res && (res.id || res.address)) {
                const id = res.id || (res.address && res.address.id);
                setAddressId(id);
            }
        } catch (err) {
            console.error('Address save failed', err);
        }
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const payload = { addressId: addressId };
            const res = await api.orders.checkout(payload);
            // If checkout succeeds, clear cart and show success
            clearCart();
            setStep(3);
        } catch (err) {
            console.error('Checkout failed', err);
            alert('Payment/checkout failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
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
                                            <input type="text" required className="form-input" value={addressForm.firstName} onChange={(e) => setAddressForm(prev => ({ ...prev, firstName: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                            <input type="text" required className="form-input" value={addressForm.lastName} onChange={(e) => setAddressForm(prev => ({ ...prev, lastName: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" required className="form-input" value={addressForm.email} onChange={(e) => setAddressForm(prev => ({ ...prev, email: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" required className="form-input" value={addressForm.street} onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))} />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>City</label>
                                            <input type="text" required className="form-input" value={addressForm.city} onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Zip Code</label>
                                            <input type="text" required className="form-input" value={addressForm.zip} onChange={(e) => setAddressForm(prev => ({ ...prev, zip: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" required className="form-input" value={addressForm.phone} onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))} />
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
                                <button className="checkout-btn flex-1 flex justify-center items-center gap-sm" onClick={handlePayment} style={{ marginTop: 0 }} disabled={loading}>
                                    {loading ? <Loader className="animate-spin" size={20} /> : `Place Order ₹${total.toLocaleString()}`}
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
                                    <span className={shippingCost === 0 ? 'text-success font-bold' : ''}>
                                        {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
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
