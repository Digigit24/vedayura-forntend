import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Login.css';
import axios from 'axios';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await axios.post('http://localhost:5000/auth/login', {
            email,
            password
        });

        console.log(res.data);
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

                    <button type="submit" className="btn btn-premium w-full mt-md">
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