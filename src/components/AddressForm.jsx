import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import './AddressForm.css';

const AddressForm = ({ address, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        type: 'Home',
        isDefault: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (address) {
            setFormData(address);
        }
    }, [address]);

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pinCode.trim()) {
            newErrors.pinCode = 'PIN code is required';
        } else if (!/^\d{6}$/.test(formData.pinCode)) {
            newErrors.pinCode = 'PIN code must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="address-form-overlay" onClick={onCancel}>
            <div className="address-form-container" onClick={(e) => e.stopPropagation()}>
                <div className="form-header">
                    <div className="header-title">
                        <MapPin size={24} className="text-primary" />
                        <h3>{address ? 'Edit Address' : 'Add New Address'}</h3>
                    </div>
                    <button className="close-btn" onClick={onCancel}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="address-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name*</label>
                            <input
                                type="text"
                                className={`form-input ${errors.firstName ? 'error' : ''}`}
                                placeholder="Rahul"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Last Name*</label>
                            <input
                                type="text"
                                className={`form-input ${errors.lastName ? 'error' : ''}`}
                                placeholder="Kumar"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                            {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address*</label>
                            <input
                                type="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="rahul@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            {errors.email && <span className="error-msg">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number*</label>
                            <input
                                type="tel"
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                placeholder="9876543210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            {errors.phone && <span className="error-msg">{errors.phone}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Street Address*</label>
                        <textarea
                            className={`form-input ${errors.street ? 'error' : ''}`}
                            placeholder="Flat No, Wing, Street Name"
                            rows="2"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        ></textarea>
                        {errors.street && <span className="error-msg">{errors.street}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City*</label>
                            <input
                                type="text"
                                className={`form-input ${errors.city ? 'error' : ''}`}
                                placeholder="Mumbai"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                            {errors.city && <span className="error-msg">{errors.city}</span>}
                        </div>
                        <div className="form-group">
                            <label>State*</label>
                            <input
                                type="text"
                                className={`form-input ${errors.state ? 'error' : ''}`}
                                placeholder="Maharashtra"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                            {errors.state && <span className="error-msg">{errors.state}</span>}
                        </div>
                        <div className="form-group">
                            <label>PIN Code*</label>
                            <input
                                type="text"
                                className={`form-input ${errors.pinCode ? 'error' : ''}`}
                                placeholder="400001"
                                value={formData.pinCode}
                                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                            />
                            {errors.pinCode && <span className="error-msg">{errors.pinCode}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address Type</label>
                        <div className="address-type-selector">
                            {['Home', 'Office', 'Other'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`type-btn ${formData.type === type ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, type })}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        />
                        <label htmlFor="isDefault">Set as default address</label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="btn-save">
                            <Save size={18} />
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;
