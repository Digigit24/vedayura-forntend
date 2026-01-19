import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Heart, Settings, Bell, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, logout, wishlist } = useShop();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null; // Prevent flicker
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleTrackOrder = (id) => {
        alert(`Tracking Order #${id}...\nCurrent Status: In Transit`);
    };

    const handleInvoice = (id) => {
        alert(`Downloading Invoice for Order #${id}...`);
    };

    return (
        <div className="container section page-min-height">
            <div className="flex justify-between items-center mb-xl border-b pb-md">
                <div>
                    <h1 className="page-title mb-xs">My Account</h1>
                    <p className="text-secondary text-sm">Manage your profile, orders, and preferences.</p>
                </div>
                <button onClick={handleLogout} className="btn btn-outline flex items-center gap-sm hover:text-red-600 hover:border-red-200">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="profile-layout grid grid-cols-1 md:grid-cols-3 gap-xl">
                {/* Left Column: User Profile & Quick Stats */}
                <div className="profile-sidebar space-y-lg">
                    <div className="card p-xl border rounded-xl bg-white shadow-sm text-center">
                        <div className="avatar mx-auto bg-primary-light text-white w-20 h-20 flex items-center justify-center rounded-full text-3xl font-bold mb-md shadow-md">
                            {user.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold mb-xs">{user.name}</h3>
                        <p className="text-secondary text-sm mb-lg">{user.email}</p>
                        <button className="btn btn-sm btn-outline w-full flex items-center justify-center gap-sm">
                            <Settings size={16} /> Edit Profile
                        </button>
                    </div>

                    <div className="card p-lg border rounded-xl bg-white shadow-sm">
                        <h3 className="mb-md font-bold text-lg flex items-center gap-sm"><Bell size={18} /> Notifications</h3>
                        <ul className="text-sm space-y-sm">
                            <li className="p-sm bg-gray-50 rounded text-secondary border border-transparent hover:border-gray-200 transition-all">🌿 Welcome to Vedayura Family!</li>
                            <li className="p-sm bg-gray-50 rounded text-secondary border border-transparent hover:border-gray-200 transition-all">🎉 Get 10% off on your first order.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Orders & Wishlist */}
                <div className="profile-content md:col-span-2 space-y-xl">
                    {/* Order History */}
                    <div className="card p-xl border rounded-xl bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-lg">
                            <h3 className="font-bold text-xl flex items-center gap-sm"><Package size={22} /> Recent Orders</h3>
                            <button className="text-primary text-sm font-medium hover:underline">View All</button>
                        </div>

                        <div className="space-y-lg">
                            {/* Mock Order 1 */}
                            <div className="order-item border rounded-lg p-md hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-md gap-sm">
                                    <div>
                                        <p className="font-bold text-lg text-dark">Order #AYU1024</p>
                                        <p className="text-sm text-secondary">Placed on 12 Jan 2026 • ₹4,500</p>
                                    </div>
                                    <span className="self-start sm:self-center text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full uppercase tracking-wide">Delivered</span>
                                </div>
                                <div className="flex gap-md pt-sm border-t border-dashed">
                                    <button onClick={() => handleInvoice('AYU1024')} className="btn btn-sm btn-outline text-xs flex-1 sm:flex-none">Download Invoice</button>
                                    <button onClick={() => handleTrackOrder('AYU1024')} className="btn btn-sm btn-primary text-xs flex-1 sm:flex-none">Track Order</button>
                                </div>
                            </div>

                            {/* Mock Order 2 */}
                            <div className="order-item border rounded-lg p-md hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-md gap-sm">
                                    <div>
                                        <p className="font-bold text-lg text-dark">Order #AYU1020</p>
                                        <p className="text-sm text-secondary">Placed on 05 Jan 2026 • ₹1,200</p>
                                    </div>
                                    <span className="self-start sm:self-center text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full uppercase tracking-wide">Processing</span>
                                </div>
                                <div className="flex gap-md pt-sm border-t border-dashed">
                                    <button onClick={() => handleInvoice('AYU1020')} className="btn btn-sm btn-outline text-xs flex-1 sm:flex-none">Download Invoice</button>
                                    <button onClick={() => handleTrackOrder('AYU1020')} className="btn btn-sm btn-primary text-xs flex-1 sm:flex-none">Track Order</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wishlist Preview */}
                    <div className="card p-xl border rounded-xl bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-lg">
                            <h3 className="font-bold text-xl flex items-center gap-sm"><Heart size={22} /> My Wishlist ({wishlist.length})</h3>
                            <Link to="/wishlist" className="text-primary text-sm font-medium hover:underline">View Full Wishlist</Link>
                        </div>

                        {wishlist.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                                {wishlist.slice(0, 3).map(item => (
                                    <div key={item.id} className="flex gap-md items-center border p-sm rounded-lg hover:border-primary transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium truncate text-dark">{item.name}</p>
                                            <p className="text-xs text-primary font-bold">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-lg bg-gray-50 rounded-lg border border-dashed">
                                <Heart className="mx-auto text-gray-300 mb-sm" size={32} />
                                <p className="text-secondary text-sm">Your wishlist is empty.</p>
                                <Link to="/shop" className="text-primary text-xs font-bold mt-xs block hover:underline">Start Shopping</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
