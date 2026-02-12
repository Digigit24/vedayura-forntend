import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { User, Mail, Phone, Save, CheckCircle } from 'lucide-react';
import './ProfileForm.css';

const ProfileForm = () => {
    const { user, updateProfile } = useShop();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSaving(true);
            try {
                await updateProfile(formData);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } catch (error) {
                console.error('Failed to update profile', error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="profile-form-wrapper">
            <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="form-group">
                    <label>
                        <User size={16} />
                        Full Name
                    </label>
                    <input
                        type="text"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>
                        <Mail size={16} />
                        Email Address
                    </label>
                    <input
                        type="email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>
                        <Phone size={16} />
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>

                <button type="submit" className="btn-save-profile" disabled={isSaving}>
                    <Save size={18} />
                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>

            {showToast && (
                <div className="success-toast">
                    <CheckCircle size={20} />
                    <span>Profile updated successfully!</span>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;
