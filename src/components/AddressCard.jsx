import React, { useState } from 'react';
import { MapPin, Pencil, Trash2, CheckCircle } from 'lucide-react';
import './AddressCard.css';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className={`address-card ${address.isDefault ? 'default' : ''}`}>
            {address.isDefault && (
                <div className="default-badge">
                    <CheckCircle size={12} />
                    <span>Default</span>
                </div>
            )}

            <div className="address-type">
                <MapPin size={18} className="type-icon" />
                <span className="type-label">{address.type || 'Home'}</span>
            </div>

            <div className="address-details">
                <p className="address-name">{address.firstName} {address.lastName}</p>
                <p className="address-text">{address.street}</p>
                <p className="address-city">{address.city}, {address.state} - {address.pinCode}</p>
                <p className="address-phone">{address.phone}</p>
            </div>

            <div className="address-actions">
                <button
                    className="addr-btn edit"
                    onClick={() => onEdit(address)}
                    title="Edit Address"
                >
                    <Pencil size={16} />
                    <span>Edit</span>
                </button>

                {!address.isDefault && (
                    <button
                        className="addr-btn set-default"
                        onClick={() => onSetDefault(address.id)}
                    >
                        Set as Default
                    </button>
                )}

                <button
                    className="addr-btn delete"
                    onClick={() => setShowConfirm(true)}
                    title="Delete Address"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {showConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <h4>Delete Address?</h4>
                        <p>Are you sure you want to remove this address?</p>
                        <div className="confirm-actions">
                            <button className="confirm-btn cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="confirm-btn delete" onClick={() => {
                                onDelete(address.id);
                                setShowConfirm(false);
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressCard;
