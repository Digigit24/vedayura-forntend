import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Loader, AlertCircle, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isForgot, setIsForgot] = useState(false);

    // login / register fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // forgot-password fields
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();
    const { login, register, resetPassword } = useShop();

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
    const newPasswordStrength = isForgot ? getPasswordStrength(newPassword) : null;

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

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(resetEmail)) {
            setError('Please enter a valid email address');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword(resetEmail, newPassword);
            if (res && res.success) {
                setResetDone(true);
            } else {
                setError(res?.message || 'Reset failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openForgot = () => {
        setIsForgot(true);
        setResetDone(false);
        setResetEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    const closeForgot = () => {
        setIsForgot(false);
        setResetDone(false);
        setError('');
    };

    const switchMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
    };

    const ease = [0.22, 1, 0.36, 1];

    const fieldVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
    };
    const fieldItem = {
        hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
        show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.45, ease } },
    };

    return (
        <div className="login-page">

                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 32, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    transition={{ duration: 0.55, ease }}
                >
                    <div className="auth-form-inner">
                        <motion.div
                            className="auth-logo-top"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.45 }}
                        >
                            <img src="/logo-03.png" alt="Vedayura" className="auth-logo-img" />
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {isForgot ? (

                                /* ── FORGOT PASSWORD PANEL ── */
                                <motion.div
                                    key="forgot-panel"
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ duration: 0.28, ease }}
                                >
                                    <div className="forgot-header">
                                        <button
                                            type="button"
                                            className="back-btn"
                                            onClick={closeForgot}
                                            aria-label="Back to sign in"
                                        >
                                            <ArrowLeft size={15} />
                                            Back to Sign In
                                        </button>
                                        <h2 className="forgot-title">Reset Password</h2>
                                        <p className="auth-subtitle">Enter your email and choose a new password</p>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                key="reset-error"
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

                                    {resetDone ? (
                                        <motion.div
                                            className="reset-success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, ease }}
                                        >
                                            <CheckCircle size={40} className="reset-success-icon" />
                                            <p className="reset-success-title">Password Updated!</p>
                                            <p className="reset-success-sub">You can now sign in with your new password.</p>
                                            <button
                                                type="button"
                                                className="btn-auth"
                                                style={{ marginTop: '1.25rem' }}
                                                onClick={closeForgot}
                                            >
                                                Sign In <ArrowRight size={18} />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleResetSubmit}>
                                            <div className={`form-group ${focusedField === 'reset-email' ? 'focused' : ''}`}>
                                                <label className="form-label1">Email Address</label>
                                                <div className="input-icon-wrap">
                                                    <Mail size={16} className="input-icon" />
                                                    <input
                                                        type="email"
                                                        className="form-input with-icon"
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        onFocus={() => setFocusedField('reset-email')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="you@example.com"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>

                                            <div className={`form-group ${focusedField === 'new-password' ? 'focused' : ''}`}>
                                                <label className="form-label1">New Password</label>
                                                <div className="input-icon-wrap password-input-wrapper">
                                                    <Lock size={16} className="input-icon" />
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        className="form-input with-icon"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        onFocus={() => setFocusedField('new-password')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="••••••••"
                                                        required
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        tabIndex={-1}
                                                    >
                                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                {newPasswordStrength && (
                                                    <div className="password-strength">
                                                        <div className="strength-bar">
                                                            <div
                                                                className="strength-fill"
                                                                style={{ width: newPasswordStrength.width, background: newPasswordStrength.color }}
                                                            />
                                                        </div>
                                                        <span className="strength-label" style={{ color: newPasswordStrength.color }}>
                                                            {newPasswordStrength.label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`form-group ${focusedField === 'confirm-password' ? 'focused' : ''}`}>
                                                <label className="form-label1">Confirm New Password</label>
                                                <div className="input-icon-wrap password-input-wrapper">
                                                    <Lock size={16} className="input-icon" />
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        className="form-input with-icon"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        onFocus={() => setFocusedField('confirm-password')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="••••••••"
                                                        required
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        tabIndex={-1}
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                {confirmPassword && newPassword !== confirmPassword && (
                                                    <small className="form-hint" style={{ color: '#ef4444' }}>Passwords do not match</small>
                                                )}
                                            </div>

                                            <motion.button
                                                type="submit"
                                                className="btn-auth"
                                                disabled={loading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {loading ? (
                                                    <><Loader size={18} className="spinner" /> Updating Password...</>
                                                ) : (
                                                    <>Update Password <ArrowRight size={18} /></>
                                                )}
                                            </motion.button>
                                        </form>
                                    )}
                                </motion.div>

                            ) : (

                                /* ── LOGIN / REGISTER PANEL ── */
                                <motion.div
                                    key="auth-panel"
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 40 }}
                                    transition={{ duration: 0.28, ease }}
                                >
                                    <div className="auth-tabs">
                                        <button
                                            type="button"
                                            className={`auth-tab ${!isRegister ? 'active' : ''}`}
                                            onClick={() => !isRegister || switchMode()}
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            type="button"
                                            className={`auth-tab ${isRegister ? 'active' : ''}`}
                                            onClick={() => isRegister || switchMode()}
                                        >
                                            Create Account
                                        </button>
                                        <motion.div
                                            className="auth-tab-indicator"
                                            animate={{ x: isRegister ? '100%' : '0%' }}
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isRegister ? 'reg-header' : 'login-header'}
                                            className="auth-header"
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -14 }}
                                            transition={{ duration: 0.28, ease }}
                                        >
                                            <p className="auth-subtitle">
                                                {isRegister
                                                    ? 'Join the Vedayura family for natural wellness'
                                                    : 'Sign in to continue your wellness journey'}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>

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

                                    <motion.form
                                        onSubmit={handleSubmit}
                                        variants={fieldVariants}
                                        initial="hidden"
                                        animate="show"
                                    >
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

                                        <motion.div variants={fieldItem} className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
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
                                        </motion.div>

                                        <motion.div variants={fieldItem} className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
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
                                        </motion.div>

                                        {!isRegister && (
                                            <motion.div variants={fieldItem} className="form-footer">
                                                <button type="button" className="link-btn" onClick={openForgot}>
                                                    Forgot Password?
                                                </button>
                                            </motion.div>
                                        )}

                                        <motion.button
                                            variants={fieldItem}
                                            type="submit"
                                            className="btn-auth"
                                            disabled={loading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
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
                                        </motion.button>
                                    </motion.form>

                                    {!isRegister && (
                                        <div className="demo-credentials">
                                            <p>Demo Credentials</p>
                                            <code>admin@gmail.com / admin</code>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </motion.div>
        </div>
    );
};


export default Login;
