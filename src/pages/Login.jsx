import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Loader, AlertCircle, Eye, EyeOff } from 'lucide-react';
import './Login.css';
import { color } from 'framer-motion';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login, register } = useShop();

    const validateEmail = (email) => {
        // Strict email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return false;

        // Block disposable/temporary email domains
        const blockedDomains = [
            'tempmail.com', 'throwaway.email', 'guerrillamail.com',
            'mailinator.com', 'yopmail.com', 'sharklasers.com',
            'guerrillamailblock.com', 'grr.la', 'dispostable.com',
            'trashmail.com', 'fakeinbox.com', 'tempail.com',
            'temp-mail.org', 'minutemail.com', 'maildrop.cc',
            'harakirimail.com', 'getairmail.com', 'meltmail.com',
            'binkmail.com', 'suremail.info', 'trashmail.net'
        ];

        const domain = email.split('@')[1].toLowerCase();
        if (blockedDomains.includes(domain)) return false;

        // Ensure domain has valid TLD (at least 2 chars)
        const tld = domain.split('.').pop();
        if (tld.length < 2) return false;

        return true;
    };

    const validatePhone = (phone) => {
        // Remove all spaces, dashes, and parentheses
        const cleaned = phone.replace(/[\s\-()]/g, '');

        // Indian mobile number validation
        // Must be 10 digits (without country code) or 12-13 digits (with +91 or 91)
        if (cleaned.startsWith('+91')) {
            const number = cleaned.slice(3);
            return /^[6-9]\d{9}$/.test(number);
        } else if (cleaned.startsWith('91') && cleaned.length === 12) {
            const number = cleaned.slice(2);
            return /^[6-9]\d{9}$/.test(number);
        } else if (cleaned.startsWith('0')) {
            const number = cleaned.slice(1);
            return /^[6-9]\d{9}$/.test(number);
        } else {
            // Plain 10-digit number starting with 6-9
            return /^[6-9]\d{9}$/.test(cleaned);
        }
    };

    const handlePhoneChange = (e) => {
        // Only allow digits, +, spaces, and dashes
        const value = e.target.value.replace(/[^0-9+\-\s]/g, '');
        setPhone(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Email validation
            if (!validateEmail(email)) {
                setError('Please enter a valid email address (disposable emails are not allowed)');
                setLoading(false);
                return;
            }

            if (isRegister) {
                // Registration validation
                if (!name.trim()) {
                    setError('Name is required');
                    setLoading(false);
                    return;
                }

                // Name should contain only letters and spaces, min 2 chars
                if (!/^[a-zA-Z\s]{2,50}$/.test(name.trim())) {
                    setError('Please enter a valid name (letters only, 2-50 characters)');
                    setLoading(false);
                    return;
                }

                // Phone validation (required for registration)
                if (!phone.trim()) {
                    setError('Phone number is required');
                    setLoading(false);
                    return;
                }

                if (!validatePhone(phone)) {
                    setError('Please enter a valid 10-digit Indian mobile number (starting with 6-9)');
                    setLoading(false);
                    return;
                }
                
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                // Format phone number with +91 prefix
                let formattedPhone = phone.trim().replace(/[\s\-()]/g, '');
                if (formattedPhone.startsWith('+91')) {
                    // already formatted
                } else if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
                    formattedPhone = '+' + formattedPhone;
                } else if (formattedPhone.startsWith('0')) {
                    formattedPhone = '+91' + formattedPhone.slice(1);
                } else {
                    formattedPhone = '+91' + formattedPhone;
                }

                const res = await register(name, email, password, formattedPhone);
                if (res && res.success) {
                    navigate('/profile');
                } else {
                    setError(res?.message || 'Registration failed. Please try again.');
                }
            } else {
                // Login
                const res = await login(email, password);
                if (res && res.success) {
                    const role = res.user?.role || '';
                    if (String(role).toLowerCase().includes('admin')) {
                        navigate('/admin');
                    } else {
                        navigate('/profile');
                    }
                } else {
                    setError(res?.message || 'Invalid email or password');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            if (err.message?.includes('Network') || err.message?.includes('fetch')) {
                setError('Cannot connect to server. Please check your connection.');
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🌿</div>
                    <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
                    <p className="auth-subtitle">
                        {isRegister 
                            ? 'Join the Vedayura family for natural wellness' 
                            : 'Sign in to continue your wellness journey'}
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Rahul Sharma"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number <span>*</span></label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="e.g. 9876543210"
                                    maxLength={13}
                                    required
                                    disabled={loading}
                                />
                                <small className="form-hint">Enter 10-digit Indian mobile number</small>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {!isRegister && (
                        <div className="form-footer">
                            <button type="button" className="link-btn">
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-auth"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader size={18} className="spinner" />
                                {isRegister ? 'Creating Account...' : 'Signing In...'}
                            </>
                        ) : (
                            isRegister ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <p className="auth-switch">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        className="link-btn link-primary"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                            setEmail('');
                            setPassword('');
                            setName('');
                            setPhone('');
                        }}
                    >
                        {isRegister ? 'Sign In' : 'Create Account'}
                    </button>
                </p>

                {!isRegister && (
                    <div className="demo-credentials">
                        <p>Demo Credentials:</p>
                        <code>admin@gmail.com / admin</code>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;