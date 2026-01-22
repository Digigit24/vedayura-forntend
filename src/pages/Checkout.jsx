import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
    const { cart, clearCart } = useShop();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success

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
            <div className="container section text-center py-2xl">
                <CheckCircle size={64} className="text-success mx-auto mb-md" />
                <h1 className="mb-md">Order Placed Successfully!</h1>
                <p className="text-secondary mb-lg">Thank you for shopping with AyurvedaMart. Your order #AYU{Math.floor(Math.random() * 10000)} is confirmed.</p>
                <button onClick={() => navigate('/')} className="btn btn-primary btn-txt">Back to Home</button>
            </div>
        );
    }

    return (
        <div className="checkout-page container section">
            <h1 className="page-title mb-xl">Checkout</h1>

            <div className="checkout-layout">
                <div className="checkout-form-container">
                    {step === 1 && (
                        <div className="step-content">
                            <div className="step-header">
                                <div className="step-number">1</div>
                                <h2>Shipping Address</h2>
                            </div>
                            <form id="address-form" onSubmit={handleSubmit}>
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
                                <button type="submit" className="btn btn-primary btn-txt mt-lg">Continue to Payment</button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content">
                            <div className="step-header">
                                <div className="step-number">2</div>
                                <h2>Payment Method</h2>
                            </div>

                            <div className="payment-options">
                                <div className="payment-option selected">
                                    <div className="radio-circle inner"></div>
                                    <div className="flex items-center gap-md">
                                        <CreditCard size={24} className="text-primary" />
                                        <div>
                                            <h4 className="font-bold">Razorpay Secure</h4>
                                            <p className="text-secondary text-sm">Cards, UPI, Netbanking, Wallets</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="payment-option">
                                    <div className="radio-circle"></div>
                                    <div className="flex items-center gap-md">
                                        <Truck size={24} />
                                        <div>
                                            <h4 className="font-bold">Cash on Delivery</h4>
                                            <p className="text-secondary text-sm">Pay when you receive</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="payment-form mt-lg p-lg bg-light rounded-sm border">
                                <p className="text-sm text-secondary mb-md"><CheckCircle size={16} className="inline mr-xs" /> You will be redirected to Razorpay's secure payment gateway to complete your transaction.</p>
                                <div className="flex gap-sm">
                                    {/* Mock payment icons */}
                                    <div className="w-10 h-6 bg-white border rounded"></div>
                                    <div className="w-10 h-6 bg-white border rounded"></div>
                                    <div className="w-10 h-6 bg-white border rounded"></div>
                                </div>
                            </div>

                            <div className="flex gap-md mt-lg">
                                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                                <button className="btn btn-primary btn-txt flex-1" onClick={handlePayment}>Pay ₹{total}</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="order-summary-sidebar">
                    <h3>Order Summary</h3>
                    <ul className="checkout-items">
                        {cart.map(item => (
                            <li key={item.id} className="checkout-item">
                                <div className="flex gap-sm">
                                    <img src={item.image} alt="" className="checkout-thumb" />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span>₹{(item.discount_price || item.price) * item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="summary-divider"></div>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
