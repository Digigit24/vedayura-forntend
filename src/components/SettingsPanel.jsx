import React, { useState } from 'react';
import { User, MapPin, ArrowLeft, Plus, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProfileForm from './ProfileForm';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import './SettingsPanel.css';

const SettingsPanel = ({ onClose }) => {
    const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useShop();
    const [activeTab, setActiveTab] = useState('profile');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setShowAddressForm(true);
    };

    const handleEditAddress = (addr) => {
        setEditingAddress(addr);
        setShowAddressForm(true);
    };

    const handleSaveAddress = (addressData) => {
        if (editingAddress) {
            updateAddress(editingAddress.id, addressData);
        } else {
            addAddress(addressData);
        }
        setShowAddressForm(false);
    };

    return (
        <div className="settings-panel">
            <div className="settings-header">
                <button className="back-btn" onClick={onClose} title="Back to Profile">
                    <ArrowLeft size={20} />
                    <span>Back to Profile</span>
                </button>
                <h2 className="settings-title">Account Settings</h2>
                <button className="close-x" onClick={onClose} title="Close">
                    <X size={24} />
                </button>
            </div>

            <div className="settings-tabs">
                <button
                    className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <User size={18} />
                    Edit Profile
                </button>
                <button
                    className={`settings-tab ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                >
                    <MapPin size={18} />
                    Addresses
                </button>
            </div>

            <div className="settings-content">
                {activeTab === 'profile' && (
                    <div className="settings-section">
                        <ProfileForm />
                    </div>
                )}

                {activeTab === 'addresses' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <p className="section-desc">Manage your delivery addresses for a faster checkout experience.</p>
                            <button className="btn-add-address" onClick={handleAddAddress}>
                                <Plus size={18} />
                                Add New Address
                            </button>
                        </div>

                        {addresses.length > 0 ? (
                            <div className="addresses-grid">
                                {addresses.map(addr => (
                                    <AddressCard
                                        key={addr.id}
                                        address={addr}
                                        onEdit={handleEditAddress}
                                        onDelete={deleteAddress}
                                        onSetDefault={setDefaultAddress}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-addresses">
                                <MapPin size={48} className="empty-icon" />
                                <h3>No Addresses Found</h3>
                                <p>You haven't added any addresses yet.</p>
                                <button className="btn btn-primary" onClick={handleAddAddress}>
                                    Add Your First Address
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {showAddressForm && (
                <AddressForm
                    address={editingAddress}
                    onSave={handleSaveAddress}
                    onCancel={() => setShowAddressForm(false)}
                />
            )}
        </div>
    );
};

export default SettingsPanel;
