import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Login.css';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login, register } = useShop();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            const res = await register(name, email, password);
            if (res && res.success) {
                navigate('/profile');
            }
        } else {
            const res = await login(email, password);
            if (res && res.success) {
                const role = res.user?.role || '';
                if (String(role).toLowerCase().includes('admin') || email === 'admin@ayurveda.com') {
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
                <h1 className="text-center mb-lg">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h1>

                {message && <p className="alert success">{message}</p>}
                {error && <p className="alert error">{error}</p>}

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

                    <button type="submit" className="btn btn-primary w-full mt-md">
                        {isRegister ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-lg text-sm">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        className="text-primary font-bold"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>

                {!isRegister && (
                    <div className="mt-md text-center">
                        <p className="text-xs text-secondary">
                            Demo Admin: admin@gmail.com / admin
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;