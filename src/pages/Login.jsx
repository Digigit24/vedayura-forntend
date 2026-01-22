import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Login.css';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register } = useShop();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            if (register(name, email, password)) {
                navigate('/profile');
            }
        } else {
            if (login(email, password)) {
                if (email === 'admin@ayurveda.com') {
                    navigate('/admin');
                } else {
                    navigate('/profile');
                }
            }
        }
    };

    return (
        <div className="login-page">
            <div className="auth-card">
                <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="auth-subtitle">
                    {isRegister ? 'Join our community of wellness' : 'Enter your details to access your account'}
                </p>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>
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
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        {isRegister ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button 
                            className="auth-link-btn" 
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? 'Login' : 'Register'}
                        </button>
                    </p>
                </div>

                {!isRegister && (
                    <div className="demo-credentials">
                        <p>Demo Admin: admin@vedayura.com / admin</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;