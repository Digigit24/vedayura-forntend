import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Package, Heart, Settings, LogOut, RotateCcw,
    Truck, FileText, X, ShoppingBag,
    ShoppingCart, Trash2, CheckCircle2, MapPin, User, ChevronRight, Palette, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/index';
import { requestRefund, getMyRefundRequests } from '../api/refundService';
import { trackOrder } from '../api/shippingService';
import SettingsPanel from '../components/SettingsPanel';
import { THEMES, applyTheme } from '../utils/theme';
import './Profile.css';
import generateInvoice from '../utils/generateInvoice';

const Profile = () => {
    const { user, logout, wishlist, removeFromWishlist, addToCart } = useShop();
    const [orders, setOrders]   = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [showSettings, setShowSettings] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showTheme, setShowTheme] = useState(false);
    const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('vedayura_theme') || 'forest');
    const themeRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => { if (themeRef.current && !themeRef.current.contains(e.target)) setShowTheme(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleThemeChange = (id) => { setActiveTheme(id); applyTheme(id); setShowTheme(false); };

    const [refundModal, setRefundModal]   = useState({ open: false, orderId: null });
    const [refundReason, setRefundReason] = useState('');
    const [inlineRefund, setInlineRefund] = useState({ orderId: '', reason: '', submitting: false });
    const [trackingModal, setTrackingModal] = useState({ open: false, order: null, tracking: null });

    const toastStyle = {
        borderRadius: '14px', background: '#1e293b', color: '#f8fafc',
        padding: '12px 20px', fontSize: '0.9rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    };

    const loadRefunds = useCallback(async () => {
        try {
            const data = await getMyRefundRequests();
            if (data?.success) setRefunds(data.refunds || []);
        } catch { /* silent */ }
    }, []);

    useEffect(() => { if (user) loadRefunds(); }, [user, loadRefunds]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await api.orders.getAll();
                if (res?.orders) setOrders(res.orders);
                else if (Array.isArray(res)) setOrders(res);
            } catch { /* silent */ }
            finally { setIsLoading(false); }
        })();
    }, []);

    useEffect(() => {
        if (!user) navigate('/login', { replace: true });
    }, [user, navigate]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        toast.success('Logged out', { style: toastStyle, icon: '👋' });
        navigate('/');
    };

    const handleTrackOrder = async (order) => {
        const fallback = (status) => ({
            currentStatus: status || 'Processing',
            estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
            timeline: [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Processing',   date: order.createdAt, completed: true },
                { status: 'Shipped',      date: null, completed: ['SHIPPED','DELIVERED'].includes((order.status||'').toUpperCase()) },
                { status: 'Delivered',    date: null, completed: (order.status||'').toUpperCase() === 'DELIVERED' },
            ]
        });
        try {
            const data = await trackOrder(order.id);
            setTrackingModal({ open: true, order, tracking: data.success && data.tracking ? data.tracking : fallback(order.status) });
        } catch {
            setTrackingModal({ open: true, order, tracking: fallback(order.status) });
        }
    };

    const handleInvoice = (id) => {
        const order = orders.find(o => o.id === id);
        if (!order) { toast.error('Order not found', { style: toastStyle }); return; }
        generateInvoice(order);
        toast.success('Invoice downloaded!', { style: toastStyle, icon: '📄' });
    };

    const handleRequestRefund = (orderId) => { setRefundReason(''); setRefundModal({ open: true, orderId }); };

    const handleSubmitRefund = async () => {
        if (!refundReason.trim()) { toast.error('Please enter a reason.', { style: toastStyle, icon: '⚠️' }); return; }
        const { orderId } = refundModal;
        setRefundModal({ open: false, orderId: null });
        try {
            const result = await requestRefund({ orderId, reason: refundReason, userNote: refundReason });
            if (result.success) { toast.success('Refund requested!', { style: toastStyle, icon: '✅' }); loadRefunds(); }
        } catch {
            const order = orders.find(o => o.id === orderId);
            setRefunds(prev => [{ id: `refund-${Date.now()}`, orderId, amount: order?.totalAmount || order?.total || 0, reason: refundReason, status: 'REQUESTED', createdAt: new Date().toISOString() }, ...prev]);
            toast.success('Refund requested!', { style: toastStyle, icon: '✅' });
        }
    };

    const handleInlineRefund = async (e) => {
        e.preventDefault();
        if (!inlineRefund.orderId) { toast.error('Please select an order.', { style: toastStyle, icon: '⚠️' }); return; }
        if (!inlineRefund.reason.trim()) { toast.error('Please enter a reason.', { style: toastStyle, icon: '⚠️' }); return; }
        setInlineRefund(p => ({ ...p, submitting: true }));
        try {
            const result = await requestRefund({ orderId: inlineRefund.orderId, reason: inlineRefund.reason, userNote: inlineRefund.reason });
            if (result.success) { toast.success('Refund requested!', { style: toastStyle, icon: '✅' }); loadRefunds(); }
        } catch {
            const order = orders.find(o => String(o.id) === String(inlineRefund.orderId));
            setRefunds(prev => [{ id: `refund-${Date.now()}`, orderId: inlineRefund.orderId, amount: order?.totalAmount || order?.total || 0, reason: inlineRefund.reason, status: 'REQUESTED', createdAt: new Date().toISOString() }, ...prev]);
            toast.success('Refund requested!', { style: toastStyle, icon: '✅' });
        } finally {
            setInlineRefund({ orderId: '', reason: '', submitting: false });
        }
    };

    const handleWishlistCardClick = (item) => {
        const id = item.id || item.productId;
        if (id) navigate(`/product/${id}`);
    };

    const formatDate     = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

    const getTier = (n) => {
        if (n === 0) return { label: 'New Member', next: 1,   progress: 0   };
        if (n < 4)  return { label: 'Explorer',next: 4,   progress: Math.round((n/4)*100)  };
        if (n < 9)  return { label: 'Enthusiast', next: 9,   progress: Math.round((n/9)*100)  };
        return              { label: 'Champion', next: null, progress: 100 };
    };

    const tier      = getTier(orders.length);
    const firstName = (user?.name || 'there').split(' ')[0];

    const isCod = (order) => ['COD', 'CASH'].includes((order.paymentMethod || order.payment_method || '').toUpperCase());

    // Payment is captured when: UPI→PAID status, COD→DELIVERED status
    const isPaymentDone = (order) => {
        const status = (order.status || '').toUpperCase();
        return isCod(order) ? status === 'DELIVERED' : status === 'PAID' || status === 'SHIPPED' || status === 'DELIVERED';
    };

    const kanban = {
        pending:   orders.filter(o => (o.status||'').toUpperCase() === 'PENDING'),
        paid:      orders.filter(o => (o.status||'').toUpperCase() === 'PAID'),
        shipped:   orders.filter(o => (o.status||'').toUpperCase() === 'SHIPPED'),
        delivered: orders.filter(o => (o.status||'').toUpperCase() === 'DELIVERED'),
        cancelled: orders.filter(o => (o.status||'').toUpperCase() === 'CANCELLED'),
    };

    const navItems = [
        { key: 'orders',   label: 'Orders',   icon: <Package size={18}/>,   count: orders.length  },
        { key: 'wishlist', label: 'Wishlist',  icon: <Heart size={18}/>,     count: wishlist.length },
        { key: 'refunds',  label: 'Refunds',   icon: <RotateCcw size={18}/>, count: refunds.length },
    ];

    return (
        <div className="pp-page">
            <div className="pp-layout">

                {/* ══ SIDEBAR ══ */}
                <aside className="pp-sidebar">
                    <nav className="pp-nav">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                className={`pp-nav-item ${activeTab === item.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.key)}
                            >
                                <span className="pp-nav-icon">{item.icon}</span>
                                <span className="pp-nav-label">{item.label}</span>
                                {item.count > 0 && <span className="pp-nav-badge">{item.count}</span>}
                            </button>
                        ))}

                        <div className="pp-nav-sep"/>

                        <button className="pp-nav-item" onClick={() => setShowSettings(true)}>
                            <span className="pp-nav-icon"><User size={18}/></span>
                            <span className="pp-nav-label">Profile</span>
                        </button>
                        <button className="pp-nav-item" onClick={() => setShowSettings(true)}>
                            <span className="pp-nav-icon"><MapPin size={18}/></span>
                            <span className="pp-nav-label">Addresses</span>
                        </button>
                        <Link to="/shop" className="pp-nav-item">
                            <span className="pp-nav-icon"><ShoppingBag size={18}/></span>
                            <span className="pp-nav-label">Shop</span>
                        </Link>
                    </nav>

                </aside>

                {/* ══ MAIN ══ */}
                <main className="pp-main">

                    {/* Cover hero */}
                    <div className="pp-cover">
                        <div className="pp-cover-bg"/>
                        <div className="pp-cover-inner">
                            <div className="pp-cover-left">
                                <div className="pp-cover-avatar">
                                    {user?.avatar || user?.profileImage
                                        ? <img src={user.avatar || user.profileImage} alt={user.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                                        : null
                                    }
                                    <span className="pp-cover-avatar-fallback">
                                        <User size={38} strokeWidth={1.5}/>
                                    </span>
                                </div>
                                <div className="pp-cover-info">
                                    <div className="pp-cover-tier">{tier.icon} {tier.label}</div>
                                    <h1 className="pp-cover-name">{user?.name || firstName}</h1>
                                    <p className="pp-cover-email">{user?.email}</p>
                                </div>
                            </div>
                            <div className="pp-cover-right">
                                <div className="pp-cover-stats">
                                    <div className="pp-cover-stat">
                                        <span className="pp-cover-stat-num">{orders.length}</span>
                                        <span className="pp-cover-stat-lbl">Orders</span>
                                    </div>
                                    <div className="pp-cover-stat-sep"/>
                                    <div className="pp-cover-stat">
                                        <span className="pp-cover-stat-num">{kanban.pending.length + kanban.paid.length + kanban.shipped.length}</span>
                                        <span className="pp-cover-stat-lbl">Active</span>
                                    </div>
                                    <div className="pp-cover-stat-sep"/>
                                    <div className="pp-cover-stat">
                                        <span className="pp-cover-stat-num">{wishlist.length}</span>
                                        <span className="pp-cover-stat-lbl">Wishlist</span>
                                    </div>
                                </div>
                                <div className="pp-cover-btns">
                                    {/* Theme picker */}
                                    <div className="pp-theme-picker" ref={themeRef}>
                                        <button className="pp-cover-settings-btn pp-theme-btn" onClick={() => setShowTheme(v => !v)}>
                                            <Palette size={14}/>
                                            <span>{THEMES.find(t => t.id === activeTheme)?.name}</span>
                                        </button>
                                        {showTheme && (
                                            <div className="pp-theme-dropdown">
                                                <p className="pp-theme-dropdown-label">Choose Theme</p>
                                                <div className="pp-theme-swatches">
                                                    {THEMES.map(t => (
                                                        <button key={t.id} className={`pp-theme-swatch-btn ${activeTheme === t.id ? 'active' : ''}`} onClick={() => handleThemeChange(t.id)} title={t.name}>
                                                            <span className="pp-theme-swatch-circle" style={{ background: `linear-gradient(135deg, ${t.primaryDark} 50%, ${t.primaryLight} 100%)` }}>
                                                                {activeTheme === t.id && <Check size={12}/>}
                                                            </span>
                                                            <span className="pp-theme-swatch-name">{t.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button className="pp-cover-settings-btn" onClick={() => setShowSettings(true)}>
                                        <Settings size={14}/> Settings
                                    </button>
                                    <button className="pp-cover-logout-btn" onClick={handleLogout}>
                                        <LogOut size={14}/> 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pp-content">

                        {/* Tab bar */}
                        <div className="pp-tabs">
                            {navItems.map(t => (
                                <button
                                    key={t.key}
                                    className={`pp-tab ${activeTab === t.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(t.key)}
                                >
                                    {t.icon} {t.label}
                                    {t.count > 0 && <span className="pp-tab-badge">{t.count}</span>}
                                </button>
                            ))}
                        </div>

                        {/* ── ORDERS ── */}
                        {activeTab === 'orders' && (
                            isLoading ? (
                                <div className="pp-loading"><div className="pp-spinner"/><p>Loading orders…</p></div>
                            ) : orders.length > 0 ? (
                                <div className="pp-kanban">
                                    {[
                                        { key: 'pending',   label: 'Pending',    cls: 'col-pending',    items: kanban.pending   },
                                        { key: 'paid',      label: 'Confirmed',  cls: 'col-processing', items: kanban.paid      },
                                        { key: 'shipped',   label: 'Shipped',    cls: 'col-shipped',    items: kanban.shipped   },
                                        { key: 'delivered', label: 'Delivered',  cls: 'col-delivered',  items: kanban.delivered },
                                        ...(kanban.cancelled.length > 0 ? [{ key: 'cancelled', label: 'Cancelled', cls: 'col-cancelled', items: kanban.cancelled }] : []),
                                    ].map(col => (
                                        <div key={col.key} className="pp-col">
                                            <div className={`pp-col-head ${col.cls}`}>
                                                <span className="pp-col-dot"/>{col.label}
                                                <span className="pp-col-badge">{col.items.length}</span>
                                            </div>
                                            <div className="pp-col-body">
                                                {col.items.length === 0
                                                    ? <p className="pp-col-empty">Nothing here</p>
                                                    : col.items.map(order => (
                                                        <div key={order.id} className={`pp-kcard ${col.key === 'cancelled' ? 'pp-kcard-muted' : ''}`}>
                                                            <div className="pp-kcard-top">
                                                                <span className="pp-kcard-id">#{String(order.id).slice(0,10)}</span>
                                                                <span className="pp-kcard-date">{formatDate(order.createdAt)}</span>
                                                            </div>
                                                            <p className="pp-kcard-amt">₹{order.totalAmount || order.total || order.subtotalAmount || '—'}</p>
                                                            {order.items?.length > 0 && (
                                                                <p className="pp-kcard-items">
                                                                    {order.items.slice(0,2).map(i => i.name||i.productName).join(', ')}
                                                                    {order.items.length > 2 && ` +${order.items.length - 2}`}
                                                                </p>
                                                            )}
                                                            {col.key !== 'cancelled' && (
                                                                <div className="pp-kcard-actions">
                                                                    <button className="pp-kact pp-kact-green" onClick={() => handleTrackOrder(order)}><Truck size={11}/> Track</button>
                                                                    {col.key === 'delivered' && (
                                                                        <button className="pp-kact pp-kact-gray" onClick={() => handleInvoice(order.id)}><FileText size={11}/> Invoice</button>
                                                                    )}
                                                                    {isPaymentDone(order) && col.key !== 'delivered' && (
                                                                        <button className="pp-kact pp-kact-gold" onClick={() => handleRequestRefund(order.id)}><RotateCcw size={11}/> Refund</button>
                                                                    )}
                                                                    {col.key === 'delivered' && isCod(order) && (
                                                                        <button className="pp-kact pp-kact-gold" onClick={() => handleRequestRefund(order.id)}><RotateCcw size={11}/> Refund</button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="pp-empty">
                                    <Package size={40} strokeWidth={1.2}/>
                                    <h3>No orders yet</h3>
                                    <p>Your order history will appear here once you place an order.</p>
                                    <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                                </div>
                            )
                        )}

                        {/* ── WISHLIST ── */}
                        {activeTab === 'wishlist' && (
                            wishlist.length > 0 ? (
                                <div className="pp-wish-grid">
                                    {wishlist.map(rawItem => {
                                        const p = rawItem.product || rawItem;
                                        const item = {
                                            id: p.id || rawItem.productId || rawItem.id,
                                            name: p.name || rawItem.name,
                                            image: p.imageUrls?.[0] || p.image || rawItem.image,
                                            category: p.category?.name || (typeof p.category === 'string' ? p.category : null) || rawItem.category || 'Ayurvedic',
                                            price: p.discountedPrice || p.realPrice || p.price || rawItem.price,
                                            originalPrice: p.realPrice || rawItem.originalPrice,
                                        };
                                        return (
                                            <div key={item.id || rawItem.id} className="pp-wish-card" onClick={() => handleWishlistCardClick(item)}>
                                                <div className="pp-wish-img">
                                                    <img src={item.image || '/assets/product-placeholder.png'} alt={item.name} loading="lazy" onError={e => { e.target.src = '/assets/product-placeholder.png'; }}/>
                                                </div>
                                                <div className="pp-wish-info">
                                                    <p className="pp-wish-cat">{item.category}</p>
                                                    <h4 className="pp-wish-name">{item.name}</h4>
                                                    <p className="pp-wish-price">₹{item.price}</p>
                                                </div>
                                                <div className="pp-wish-actions" onClick={e => e.stopPropagation()}>
                                                    <button className="pp-wish-btn pp-wish-btn-cart" onClick={() => { addToCart(item); toast.success(`${item.name} added!`, { style: toastStyle, icon: '🛒' }); }} title="Add to cart"><ShoppingCart size={14}/></button>
                                                    <button className="pp-wish-btn pp-wish-btn-remove" onClick={() => { removeFromWishlist(item.id); toast.success('Removed', { style: toastStyle, icon: '💔' }); }} title="Remove"><Trash2 size={14}/></button>
                                                </div>
                                                <ChevronRight size={14} className="pp-wish-arrow"/>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="pp-empty">
                                    <Heart size={40} strokeWidth={1.2}/>
                                    <h3>Wishlist is empty</h3>
                                    <p>Save products you love and find them here easily.</p>
                                    <Link to="/shop" className="btn btn-primary">Explore Products</Link>
                                </div>
                            )
                        )}

                        {/* ── REFUNDS ── */}
                        {activeTab === 'refunds' && (
                            <div className="pp-refunds-wrap">

                                {/* New request form */}
                                <div className="pp-refund-form-card">
                                    <div className="pp-refund-form-header">
                                        <RotateCcw size={16}/>
                                        <span>Request a Refund</span>
                                    </div>
                                    <form onSubmit={handleInlineRefund} className="pp-refund-form">
                                        <div className="pp-refund-row">
                                            <div className="pp-refund-field">
                                                <label>Select Order</label>
                                                <select
                                                    value={inlineRefund.orderId}
                                                    onChange={e => setInlineRefund(p => ({ ...p, orderId: e.target.value }))}
                                                    disabled={inlineRefund.submitting || orders.length === 0}
                                                >
                                                    <option value="">— Choose an order —</option>
                                                    {orders.filter(isPaymentDone).map(o => (
                                                        <option key={o.id} value={o.id}>
                                                            #{String(o.id).slice(0, 10)} · ₹{o.totalAmount || o.total || '—'} · {formatDate(o.createdAt)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="pp-refund-field">
                                            <label>Reason</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Describe the issue with your order…"
                                                value={inlineRefund.reason}
                                                onChange={e => setInlineRefund(p => ({ ...p, reason: e.target.value }))}
                                                disabled={inlineRefund.submitting}
                                            />
                                        </div>
                                        <button type="submit" className="pp-refund-submit" disabled={inlineRefund.submitting}>
                                            {inlineRefund.submitting ? 'Submitting…' : <><RotateCcw size={13}/> Submit Request</>}
                                        </button>
                                    </form>
                                </div>

                                {/* History */}
                                {refunds.length > 0 ? (
                                    <div className="pp-table">
                                        <div className="pp-table-head">
                                            <span>Order</span><span>Reason</span><span>Amount</span><span>Status</span>
                                        </div>
                                        {refunds.map(r => (
                                            <div key={r.id} className="pp-table-row">
                                                <span className="pp-table-id">#{String(r.orderId).slice(0,10)}</span>
                                                <span className="pp-table-reason">{r.reason}</span>
                                                <span className="pp-table-amt">₹{r.amount}</span>
                                                <span className={`pp-pill ${r.status === 'COMPLETED' ? 'pill-green' : r.status === 'REJECTED' ? 'pill-red' : 'pill-amber'}`}>{r.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="pp-empty" style={{paddingTop:'1.5rem'}}>
                                        <RotateCcw size={32} strokeWidth={1.2}/>
                                        <h3>No requests yet</h3>
                                        <p>Submitted refund requests will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* ══ SETTINGS DRAWER ══ */}
            {showSettings && (
                <div className="pp-overlay" onClick={() => setShowSettings(false)}>
                    <div className="pp-drawer" onClick={e => e.stopPropagation()}>
                        <div className="pp-drawer-bar">
                            <div className="pp-drawer-bar-left">
                                <div className="pp-drawer-bar-icon"><Settings size={15}/></div>
                                <span>Account Settings</span>
                            </div>
                            <button className="pp-drawer-close" onClick={() => setShowSettings(false)}><X size={16}/></button>
                        </div>
                        <SettingsPanel onClose={() => setShowSettings(false)}/>
                    </div>
                </div>
            )}

            {/* ══ REFUND MODAL ══ */}
            {refundModal.open && (
                <div className="pp-modal-overlay" onClick={() => setRefundModal({ open: false, orderId: null })}>
                    <div className="pp-modal" onClick={e => e.stopPropagation()}>
                        <button className="pp-modal-close" onClick={() => setRefundModal({ open: false, orderId: null })}><X size={14}/></button>
                        <p className="pp-modal-eyebrow">Refund Request</p>
                        <h3 className="pp-modal-title">Order #{String(refundModal.orderId).slice(0,12)}</h3>
                        <textarea className="pp-modal-textarea" placeholder="Tell us why you'd like a refund…" value={refundReason} onChange={e => setRefundReason(e.target.value)} rows={4} autoFocus/>
                        <div className="pp-modal-actions">
                            <button className="pp-modal-btn-ghost" onClick={() => setRefundModal({ open: false, orderId: null })}>Cancel</button>
                            <button className="pp-modal-btn-primary" onClick={handleSubmitRefund}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ TRACKING MODAL ══ */}
            {trackingModal.open && (
                <div className="pp-modal-overlay" onClick={() => setTrackingModal({ open: false, order: null, tracking: null })}>
                    <div className="pp-modal pp-modal-track" onClick={e => e.stopPropagation()}>
                        <button className="pp-modal-close" onClick={() => setTrackingModal({ open: false, order: null, tracking: null })}><X size={14}/></button>
                        <p className="pp-modal-eyebrow">Order Tracking</p>
                        <h3 className="pp-modal-title">#{String(trackingModal.order?.id).slice(0,12)}</h3>
                        <div className="pp-tracking-status">
                            <span className="pp-tracking-badge">{trackingModal.tracking?.currentStatus}</span>
                            {trackingModal.tracking?.estimatedDelivery && <span className="pp-tracking-eta">Est. {formatDate(trackingModal.tracking.estimatedDelivery)}</span>}
                        </div>
                        <div className="pp-timeline">
                            {trackingModal.tracking?.timeline?.map((step, i) => (
                                <div key={i} className={`pp-timeline-step ${step.completed ? 'done' : ''}`}>
                                    <div className="pp-timeline-dot">{step.completed ? <CheckCircle2 size={14}/> : <span/>}</div>
                                    <div className="pp-timeline-content">
                                        <span className="pp-timeline-label">{step.status}</span>
                                        {step.date && <span className="pp-timeline-date">{formatDateTime(step.date)}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="pp-modal-btn-primary" style={{width:'100%'}} onClick={() => setTrackingModal({ open: false, order: null, tracking: null })}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
