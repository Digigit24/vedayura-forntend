import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Heart, Settings, Bell, LogOut, RotateCcw } from 'lucide-react';
import api from '../api';
import { requestRefund, getMyRefundRequests } from '../api/refundService';
import { trackOrder } from '../api/shippingService';

const Profile = () => {
    const { user, logout, wishlist } = useShop();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [refunds, setRefunds] = useState([]);

    const loadRefunds = async () => {
        try {
            const data = await getMyRefundRequests();
            if (data && data.success) {
                setRefunds(data.refunds || []);
            }
        } catch (error) {
            console.error("Failed to load refunds", error);
        }
    };

    useEffect(() => {
        if (user) {
            (async () => { await loadRefunds(); })();
        }
    }, [user]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.orders.getAll();
                if (res && res.orders) setOrders(res.orders);
                else if (Array.isArray(res)) setOrders(res);
            } catch (err) {
                console.error('Failed to load orders', err);
            }
        })();
    }, []);

    if (!user) {
        navigate('/login');
        return null; // Prevent flicker
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleTrackOrder = async (id) => {
        try {
            // alert(`Tracking Order #${id}...`);
            const data = await trackOrder(id);
            if (data.success && data.tracking) {
                alert(`Status: ${data.tracking.currentStatus}\nLocation: ${data.tracking.trackingUrl}`);
            } else {
                alert("Tracking info not available yet.");
            }
        } catch (e) {
            // Fallback for mock orders
            console.warn("Tracking API failed (likely mock ID)", e);
            alert(`Tracking Order #${id}...\nCurrent Status: In Transit (Mock)`);
        }
    };

    const handleInvoice = (id) => {
        alert(`Downloading Invoice for Order #${id}...`);
    };

    const handleRequestRefund = async (orderId) => {
        const reason = window.prompt("Please enter the reason for refund:");
        if (reason) {
            try {
                // Mock user note as reason for now
                const result = await requestRefund({ orderId, reason, userNote: reason });
                if (result.success) {
                    alert("Refund requested successfully!");
                    loadRefunds(); // Refresh list
                }
            } catch (error) {
                console.error("Refund request failed", error);

                // Fallback for demo if API fails (likely due to mock order ID)
                // In a real app we wouldn't do this, but for the user's "mock" environment:
                if (orderId.startsWith('AYU')) {
                    const mockRefund = {
                        id: `refund-${Date.now()}`,
                        orderId: orderId,
                        amount: 4500, // Mock amount
                        reason: reason,
                        status: 'REQUESTED'
                    };
                    setRefunds(prev => [mockRefund, ...prev]);
                    alert("Refund requested successfully! (Mocked)");
                } else {
                    alert("Failed to request refund. " + (error.response?.data?.message || ""));
                }
            }
        }
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
                            {orders && orders.length > 0 ? (
                                orders.map(order => (
                                    <div key={order.id} className="order-item border rounded-lg p-md hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-md gap-sm">
                                            <div>
                                                <p className="font-bold text-lg text-dark">Order #{String(order.id)}</p>
                                                <p className="text-sm text-secondary">Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'} • ₹{order.totalAmount || order.total || order.subtotalAmount || '—'}</p>
                                            </div>
                                            <span className="self-start sm:self-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide" style={{background: order.status === 'DELIVERED' ? '#ecfdf6' : '#fff7ed', color: order.status === 'DELIVERED' ? '#166534' : '#92400e'}}>{order.status || 'PROCESSING'}</span>
                                        </div>
                                        <div className="flex gap-md pt-sm border-t border-dashed">
                                            <button onClick={() => handleInvoice(order.id)} className="btn btn-sm btn-outline text-xs flex-1 sm:flex-none">Download Invoice</button>
                                            <button onClick={() => handleTrackOrder(order.id)} className="btn btn-sm btn-primary btn-txt text-xs flex-1 sm:flex-none">Track Order</button>
                                            <button onClick={() => handleRequestRefund(order.id)} className="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs flex-1 sm:flex-none">Request Refund</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
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
                                            <button onClick={() => handleTrackOrder('AYU1024')} className="btn btn-sm btn-primary btn-txt text-xs flex-1 sm:flex-none">Track Order</button>
                                            <button onClick={() => handleRequestRefund('AYU1024')} className="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs flex-1 sm:flex-none">Request Refund</button>
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
                                            <button onClick={() => handleTrackOrder('AYU1020')} className="btn btn-sm btn-primary btn-txt text-xs flex-1 sm:flex-none">Track Order</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Refund Requests - New Section */}
                    <div className="card p-xl border rounded-xl bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-lg">
                            <h3 className="font-bold text-xl flex items-center gap-sm"><RotateCcw size={22} /> Refund Requests</h3>
                        </div>
                        {refunds.length > 0 ? (
                            <div className="space-y-md">
                                {refunds.map(refund => (
                                    <div key={refund.id} className="border rounded-lg p-md bg-gray-50">
                                        <div className="flex justify-between">
                                            <p className="font-bold text-sm">Order #{refund.orderId.substring(0, 8)}...</p>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${refund.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                {refund.status}
                                            </span>
                                        </div>
                                        <p className="text-sm mt-xs">Expected: ₹{refund.amount}</p>
                                        <p className="text-xs text-secondary mt-xs">Reason: {refund.reason}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-secondary text-sm">No active refund requests.</p>
                        )}
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
                                        <img src={item.image || item.imageUrls?.[0]} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium truncate text-dark">{item.name}</p>
                                            <p className="text-xs text-primary font-bold">₹{item.price || item.discountedPrice}</p>
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
