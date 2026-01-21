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
                // Redirect based on role handled in ShopContext or here
                if (email === 'admin@ayurveda.com') {
                    navigate('/admin');
                } else {
                    navigate('/profile');
                }
            }
        }
    };

    return (
        <div className="login-page container section">
            <div className="auth-card">
                <h1 className="text-center mb-lg">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-premium btn-txt w-full mt-md">
                        {isRegister ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-lg text-sm">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"} <button className="text-primary font-bold" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>

                {!isRegister && (
                    <div className="mt-md text-center">
                        <p className="text-xs text-secondary">Demo Admin: admin@vedayura.com / admin</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
