import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Loader, AlertCircle, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();
    const { login, register } = useShop();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return false;

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

        const tld = domain.split('.').pop();
        if (tld.length < 2) return false;

        return true;
    };

    const validatePhone = (phone) => {
        const cleaned = phone.replace(/[\s\-()]/g, '');
        if (cleaned.startsWith('+91')) {
            return /^[6-9]\d{9}$/.test(cleaned.slice(3));
        } else if (cleaned.startsWith('91') && cleaned.length === 12) {
            return /^[6-9]\d{9}$/.test(cleaned.slice(2));
        } else if (cleaned.startsWith('0')) {
            return /^[6-9]\d{9}$/.test(cleaned.slice(1));
        } else {
            return /^[6-9]\d{9}$/.test(cleaned);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9+\-\s]/g, '');
        setPhone(value);
    };

    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return { label: 'Weak', color: '#ef4444', width: '33%' };
        if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Fair', color: '#f59e0b', width: '66%' };
        return { label: 'Strong', color: '#22c55e', width: '100%' };
    };

    const passwordStrength = isRegister ? getPasswordStrength(password) : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!validateEmail(email)) {
                setError('Please enter a valid email address (disposable emails are not allowed)');
                setLoading(false);
                return;
            }

            if (isRegister) {
                if (!name.trim()) {
                    setError('Name is required');
                    setLoading(false);
                    return;
                }

                if (!/^[a-zA-Z\s]{2,50}$/.test(name.trim())) {
                    setError('Please enter a valid name (letters only, 2-50 characters)');
                    setLoading(false);
                    return;
                }

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

    const switchMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
    };

    return (
        <div className="login-page">
            <div className="bg-blob bg-blob-1" />
            <div className="bg-blob bg-blob-2" />
            <div className="bg-blob bg-blob-3" />

            <div className="auth-container">
                <div className="auth-form-panel">
                    <div className="auth-form-inner">
                        <div className="auth-logo-top">
                            <div className="auth-logo-badge">🌿</div>
                        </div>
                        <div className="auth-header">
                            <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
                            <p className="auth-subtitle">
                                {isRegister
                                    ? 'Join the Vedayura family for natural wellness'
                                    : 'Sign in to continue your wellness journey'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="alert alert-error"
                                >
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {isRegister && (
                                    <motion.div
                                        key="register-fields"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div className={`form-group ${focusedField === 'name' ? 'focused' : ''}`}>
                                            <label className="form-label1">Full Name</label>
                                            <div className="input-icon-wrap">
                                                <User size={16} className="input-icon" />
                                                <input
                                                    type="text"
                                                    className="form-input with-icon"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    onFocus={() => setFocusedField('name')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="e.g. Rahul Sharma"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>

                                        <div className={`form-group1 ${focusedField === 'phone' ? 'focused' : ''}`}>
                                            <label className="form-label1">Phone Number <span className="required-star">*</span></label>
                                            <div className="input-icon-wrap">
                                                <Phone size={16} className="input-icon" />
                                                <input
                                                    type="tel"
                                                    className="form-input with-icon"
                                                    value={phone}
                                                    onChange={handlePhoneChange}
                                                    onFocus={() => setFocusedField('phone')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="e.g. 9876543210"
                                                    maxLength={13}
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <small className="form-hint">10-digit Indian mobile number</small>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
                                <label className="form-label1">Email Address</label>
                                <div className="input-icon-wrap">
                                    <Mail size={16} className="input-icon" />
                                    <input
                                        type="email"
                                        className="form-input with-icon"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="you@example.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
                                <label className="form-label1">Password</label>
                                <div className="input-icon-wrap password-input-wrapper">
                                    <Lock size={16} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input with-icon"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
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
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordStrength && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div
                                                className="strength-fill"
                                                style={{ width: passwordStrength.width, background: passwordStrength.color }}
                                            />
                                        </div>
                                        <span className="strength-label" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
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
                                className="btn-auth"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={18} className="spinner" />
                                        {isRegister ? 'Creating Account...' : 'Signing In...'}
                                    </>
                                ) : (
                                    <>
                                        {isRegister ? 'Create Account' : 'Sign In'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-divider"><span>or</span></div>

                        <p className="auth-switch">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button type="button" className="link-btn link-primary" onClick={switchMode}>
                                {isRegister ? 'Sign In' : 'Create Account'}
                            </button>
                        </p>

                        {!isRegister && (
                            <div className="demo-credentials">
                                <p>Demo Credentials</p>
                                <code>admin@gmail.com / admin</code>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Login;
