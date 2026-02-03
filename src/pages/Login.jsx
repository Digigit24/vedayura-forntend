import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Loader, AlertCircle, Eye, EyeOff } from 'lucide-react';
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

    const navigate = useNavigate();
    const { login, register } = useShop();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                // Validation
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                // Format phone number with +91 prefix if needed
                let formattedPhone = phone.trim();
                if (formattedPhone && !formattedPhone.startsWith('+')) {
                    formattedPhone = '+91-' + formattedPhone.replace(/^0+/, '');
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
            setError('Something went wrong. Please try again.');
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
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 9876543210"
                                    disabled={loading}
                                />
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