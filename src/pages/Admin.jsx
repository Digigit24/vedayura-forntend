import { useState, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, Grid, Package, ShoppingCart,
  DollarSign, Settings, Search, Bell, Eye,
  Plus, Trash2, Edit2, X, RotateCcw, Users, AlertTriangle,
  RefreshCw, TrendingUp, Clock, CheckCircle, XCircle, Truck, MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';
import { getAllRefunds, approveRefund, rejectRefund, checkRefundStatus } from '../api/refundService';
import { getAllCategories } from '../api/categoryService';
import api from '../api';
import axiosClient from '../api/axiosClient';
import StockManagement from '../components/StockManagement';
import '../components/StockManagement.css';

const toastStyle = {
  borderRadius: '14px',
  background: '#1e293b',
  color: '#f8fafc',
  padding: '12px 20px',
  fontSize: '0.9rem',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
};

// ====== CONFIRM MODAL (replaces window.confirm) ======
const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) => {
  if (!open) return null;
  return (
    <div className="admxx-confirm-overlay" onClick={onCancel}>
      <div className="admxx-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`admxx-confirm-icon ${danger ? 'danger' : ''}`}>
          <AlertTriangle size={28} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admxx-confirm-actions">
          <button className="admxx-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className={`admxx-confirm-btn ${danger ? 'danger' : ''}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// NavItem Component
const NavItem = ({ tab, activeTab, setActiveTab, icon: Icon, label }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`admxx-nav-item ${activeTab === tab ? 'admxx-active' : ''}`}
  >
    <Icon size={20} />
    <span>{label}</span>
    {activeTab === tab && <div className="admxx-active-indicator"></div>}
  </button>
);

const Admin = () => {
  const { user, logout, products, addProduct, updateProduct, deleteProduct } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingProduct, setViewingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    open: false, title: '', message: '', onConfirm: null, confirmLabel: 'Confirm', danger: false
  });

  const showConfirm = ({ title, message, onConfirm, confirmLabel = 'Confirm', danger = false }) => {
    setConfirmModal({ open: true, title, message, onConfirm, confirmLabel, danger });
  };

  const closeConfirm = () => {
    setConfirmModal({ open: false, title: '', message: '', onConfirm: null, confirmLabel: 'Confirm', danger: false });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCategories();
        if (res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    })();
  }, []);

  if (!products || !Array.isArray(products)) {
    return (
      <div className="admxx-loading-wrap">
        <div className="admxx-loading-text">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
    return (
      <div className="admxx-access-wrap">
        <div className="admxx-access-card">
          <h2 className="admxx-access-title">Access Restricted</h2>
          <p className="admxx-access-text">You must be an administrator to view this page.</p>
          <Link to="/login" className="admxx-btn admxx-btn-primary">Login as Admin</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    showConfirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await deleteProduct(id);
          toast.success('Product deleted successfully', {
            style: toastStyle,
            icon: '🗑️',
            position: 'top-center',
          });
        } catch (error) {
          console.error('Failed to delete product:', error);
          toast.error('Failed to delete product. Please try again.', {
            style: toastStyle,
            icon: '❌',
            position: 'top-center',
          });
        }
      },
    });
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);

    const benefitsText = formData.get('benefits') || '';
    const benefitsArray = benefitsText.split(',').map((b) => b.trim()).filter(Boolean);

    const price = formData.get('price');
    const stock = formData.get('stock');

    const productData = {
      name: formData.get('name'),
      categoryId: formData.get('categoryId'),
      price: price ? Number(price) : undefined,
      stock: stock ? Number(stock) : undefined,
      image: formData.get('image') || 'https://picsum.photos/400',
      ingredients: formData.get('ingredients') || '',
      benefits: benefitsArray,
    };

    Object.keys(productData).forEach((key) => {
      if (productData[key] === undefined) delete productData[key];
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully!', {
          style: toastStyle,
          icon: '✅',
          position: 'top-center',
        });
      } else {
        await addProduct(productData);
        toast.success('Product created successfully!', {
          style: toastStyle,
          icon: '✅',
          position: 'top-center',
        });
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product. Please try again.', {
        style: toastStyle,
        icon: '❌',
        position: 'top-center',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome products={products} />;
      case 'inventory':
        return (
          <Inventory
            products={products}
            searchQuery={searchQuery}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdd={handleAddProduct}
            onView={handleViewProduct}
          />
        );
      case 'orders':
        return <Orders />;
      case 'stock':
        return <StockManagement products={products} />;
      case 'users':
        return <UserManagement showConfirm={showConfirm} closeConfirm={closeConfirm} />;
      case 'refunds':
        return <Refunds />;
      case 'finance':
        return <Finance />;
      default:
        return <DashboardHome products={products} />;
    }
  };

  return (
    <div className="admxx-layout">
      <aside className="admxx-sidebar">
        <div className="admxx-sidebar-header">
          <img src="/logo-03.png" alt="Vedayura" className="admxx-logo-img" />
        </div>

        <div className="admxx-sidebar-content">
          <div className="admxx-user-mini">
            <div className="admxx-user-avatar">{user.name.charAt(0)}</div>
            <div>
              <p className="admxx-user-name">{user.name}</p>
              <p className="admxx-user-role">Administrator</p>
            </div>
          </div>

          <nav className="admxx-nav">
            <NavItem tab="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={Grid} label="Dashboard" />
            <NavItem tab="inventory" activeTab={activeTab} setActiveTab={setActiveTab} icon={Package} label="Inventory" />
            <NavItem tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} icon={ShoppingCart} label="Orders" />
            <NavItem tab="stock" activeTab={activeTab} setActiveTab={setActiveTab} icon={Package} label="Stock In/Out" />
            <NavItem tab="users" activeTab={activeTab} setActiveTab={setActiveTab} icon={Users} label="Users" />
            <NavItem tab="refunds" activeTab={activeTab} setActiveTab={setActiveTab} icon={RotateCcw} label="Refunds" />
            <NavItem tab="finance" activeTab={activeTab} setActiveTab={setActiveTab} icon={DollarSign} label="Finance" />
            <div className="admxx-nav-divider" />
            <button className="admxx-nav-item" onClick={() => setIsSettingsOpen(true)}><Settings size={20} /> <span>Settings</span></button>
            <button onClick={handleLogout} className="admxx-nav-item admxx-logout"><LogOut size={20} /> <span>Logout</span></button>
          </nav>
        </div>
      </aside>

      <main className="admxx-main">
        <header className="admxx-topbar">
          <div className="admxx-topbar-left">
            <div className="admxx-page-title">
              {{
                dashboard: 'Dashboard',
                inventory: 'Inventory',
                orders: 'Orders',
                stock: 'Stock In / Out',
                users: 'Users',
                refunds: 'Refunds',
                finance: 'Finance',
              }[activeTab] ?? 'Admin'}
            </div>
          </div>
          <div className="admxx-topbar-right">
            <div className="admxx-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="admxx-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <button className="admxx-bell">
              <Bell size={20} />
              <span className="admxx-bell-dot"></span>
            </button>
          </div>
        </header>

        <div className="admxx-content">
          {renderContent()}
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {isProductModalOpen && (
        <div className="admxx-modal-backdrop">
          <div className="admxx-modal">
            <div className="admxx-modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setIsProductModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="admxx-form" key={editingProduct?.id || 'new'}>
              <input name="name" defaultValue={editingProduct?.name} placeholder="Name" required />
              <select
                name="categoryId"
                defaultValue={editingProduct?.categoryId || ''}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input name="price" type="number" defaultValue={editingProduct?.price} placeholder="Price" required />
              <input name="stock" type="number" defaultValue={editingProduct?.stock} placeholder="Stock" required />
              <input name="image" defaultValue={editingProduct?.image} placeholder="Image URL" />
              <textarea name="ingredients" defaultValue={editingProduct?.ingredients} placeholder="Ingredients"></textarea>
              <textarea name="benefits" defaultValue={editingProduct?.benefits?.join(', ')} placeholder="Benefits (comma separated)"></textarea>

              <div className="admxx-form-actions">
                <button type="button" onClick={() => setIsProductModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="admxx-modal-backdrop">
          <div className="admxx-modal">
            <div className="admxx-modal-header">
              <h3>Product Details</h3>
              <button onClick={() => setViewingProduct(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="admxx-view-image-wrap">
              <img
                src={viewingProduct.image || 'https://picsum.photos/400'}
                alt={viewingProduct.name}
                className="admxx-view-image"
              />
            </div>

            <div className="admxx-view-grid">
              <div><strong>Name:</strong> {viewingProduct.name}</div>
              <div><strong>Category:</strong> {viewingProduct.category}</div>
              <div><strong>Price:</strong> ₹{viewingProduct.price}</div>
              <div><strong>Stock:</strong> {viewingProduct.stock}</div>
              <div><strong>Ingredients:</strong> {viewingProduct.ingredients || '-'}</div>
              <div>
                <strong>Benefits:</strong>
                <ul>
                  {(viewingProduct.benefits || []).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Settings Panel */}
      {isSettingsOpen && (
        <AdminSettings onClose={() => setIsSettingsOpen(false)} user={user} />
      )}

      {/* Confirm Modal (replaces all window.confirm calls) */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
        confirmLabel={confirmModal.confirmLabel}
        danger={confirmModal.danger}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} onSettings={() => setIsSettingsOpen(true)} />
    </div>
  );
};

// ====== MOBILE NAV ======
const MobileNav = ({ activeTab, setActiveTab, onLogout, onSettings }) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const primary = [
    { tab: 'dashboard', icon: Grid,         label: 'Home' },
    { tab: 'inventory', icon: Package,      label: 'Items' },
    { tab: 'orders',    icon: ShoppingCart, label: 'Orders' },
    { tab: 'users',     icon: Users,        label: 'Users' },
  ];

  const more = [
    { tab: 'stock',   icon: Package,    label: 'Stock' },
    { tab: 'refunds', icon: RotateCcw,  label: 'Refunds' },
    { tab: 'finance', icon: DollarSign, label: 'Finance' },
  ];

  const moreActive = more.some((m) => m.tab === activeTab);

  return (
    <>
      {moreOpen && (
        <div className="admxx-more-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="admxx-more-drawer" onClick={(e) => e.stopPropagation()}>
            {more.map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                className={activeTab === tab ? 'admxx-active' : ''}
                onClick={() => { setActiveTab(tab); setMoreOpen(false); }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
            <div className="admxx-more-divider" />
            <button onClick={() => { onSettings(); setMoreOpen(false); }}>
              <Settings size={18} /><span>Settings</span>
            </button>
            <button onClick={onLogout}>
              <LogOut size={18} /><span>Logout</span>
            </button>
          </div>
        </div>
      )}
      <div className="admxx-mobile-nav">
        {primary.map(({ tab, icon: Icon, label }) => (
          <button
            key={tab}
            className={activeTab === tab ? 'admxx-active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
        <button
          className={moreActive ? 'admxx-active' : ''}
          onClick={() => setMoreOpen((v) => !v)}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </div>
    </>
  );
};

// ====== SUB COMPONENTS ======

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
};

const DashboardHome = ({ products }) => {
  const [orders, setOrders]   = useState([]);
  const [users, setUsers]     = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ordRes, usrRes, refRes] = await Promise.all([
          axiosClient.get('/admin/orders').catch(() => ({ data: {} })),
          fetch('/api/users', { headers: { Authorization: `Bearer ${localStorage.getItem('ayurveda_token')}` } })
            .then((r) => r.json()).catch(() => ({})),
          getAllRefunds().catch(() => ({})),
        ]);
        setOrders(ordRes.data?.orders ?? ordRes.data?.data ?? []);
        setUsers(usrRes?.users ?? []);
        setRefunds(refRes?.refunds ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const paid         = orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'PENDING');
  const revenue      = paid.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  const pending      = orders.filter((o) => o.status === 'PENDING' || o.status === 'PAID').length;
  const delivered    = orders.filter((o) => o.status === 'DELIVERED').length;
  const lowStock     = products.filter((p) => p.stock > 0 && p.stock <= 20).length;
  const outStock     = products.filter((p) => p.stock === 0).length;
  const pendingRefunds = refunds.filter((r) => r.status === 'REQUESTED' || r.status === 'PENDING').length;
  const todayStr     = new Date().toDateString();
  const todayRevenue = paid
    .filter((o) => new Date(o.createdAt).toDateString() === todayStr)
    .reduce((s, o) => s + Number(o.totalAmount || 0), 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const STATUS_COLORS = {
    PENDING:   { bg: '#fef3c7', color: '#92400e' },
    PAID:      { bg: '#dbeafe', color: '#1e40af' },
    SHIPPED:   { bg: '#ede9fe', color: '#5b21b6' },
    DELIVERED: { bg: '#dcfce7', color: '#166534' },
    CANCELLED: { bg: '#fef2f2', color: '#991b1b' },
  };

  const kpis = [
    {
      label: 'Total Revenue',
      value: loading ? '—' : fmt(revenue),
      sub: `${paid.length} paid orders`,
      icon: DollarSign,
      iconColor: '#1b5c30',
      iconBg: '#dcfce7',
      accent: '#1b5c30',
    },
    {
      label: 'Total Orders',
      value: loading ? '—' : orders.length,
      sub: `${pending} pending`,
      icon: ShoppingCart,
      iconColor: '#0369a1',
      iconBg: '#e0f2fe',
      accent: '#0369a1',
    },
    {
      label: 'Products',
      value: products.length,
      sub: `${delivered} delivered`,
      icon: Package,
      iconColor: '#7c3aed',
      iconBg: '#ede9fe',
      accent: '#7c3aed',
    },
    {
      label: 'Customers',
      value: loading ? '—' : users.filter((u) => u.role !== 'ADMIN').length,
      sub: `${users.length} total users`,
      icon: Users,
      iconColor: '#0f766e',
      iconBg: '#ccfbf1',
      accent: '#0f766e',
    },
    {
      label: 'Stock Alerts',
      value: outStock + lowStock,
      sub: `${outStock} out · ${lowStock} low`,
      icon: AlertTriangle,
      iconColor: outStock > 0 ? '#dc2626' : '#d97706',
      iconBg: outStock > 0 ? '#fef2f2' : '#fef9c3',
      accent: outStock > 0 ? '#dc2626' : '#d97706',
    },
    {
      label: 'Pending Refunds',
      value: loading ? '—' : pendingRefunds,
      sub: `${refunds.length} total`,
      icon: RotateCcw,
      iconColor: pendingRefunds > 0 ? '#dc2626' : '#8b4a14',
      iconBg: pendingRefunds > 0 ? '#fef2f2' : '#fdf4ec',
      accent: pendingRefunds > 0 ? '#dc2626' : '#8b4a14',
    },
  ];

  return (
    <div className="admxx-dash">

      {/* Welcome Banner */}
      <div className="admxx-dash-banner">
        <div className="admxx-dash-banner-left">
          <h2 className="admxx-dash-greeting">Good {getTimeOfDay()} 👋</h2>
          <p className="admxx-dash-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="admxx-dash-banner-right">
          <div className="admxx-dash-today-card">
            <span>Today's Revenue</span>
            <strong>{loading ? '—' : fmt(todayRevenue)}</strong>
          </div>
          <div className="admxx-dash-today-card">
            <span>Total Orders</span>
            <strong>{loading ? '—' : orders.length}</strong>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="admxx-dash-kpis">
        {kpis.map((k) => (
          <div key={k.label} className="admxx-dash-kpi">
            <div className="admxx-dash-kpi-icon" style={{ background: k.iconBg, color: k.iconColor }}>
              <k.icon size={22} />
            </div>
            <div className="admxx-dash-kpi-body">
              <span className="admxx-dash-kpi-label">{k.label}</span>
              <strong className="admxx-dash-kpi-value" style={{ color: k.accent }}>{k.value}</strong>
              <small className="admxx-dash-kpi-sub">{k.sub}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="admxx-dash-row">

        {/* Recent Orders */}
        <div className="admxx-dash-panel" style={{ flex: 2, minWidth: 0 }}>
          <div className="admxx-dash-panel-header">
            <div className="admxx-dash-panel-title">
              <ShoppingCart size={16} />
              Recent Orders
            </div>
          </div>
          {loading ? (
            <p className="admxx-no-data">Loading...</p>
          ) : recentOrders.length === 0 ? (
            <p className="admxx-no-data">No orders yet.</p>
          ) : (
            <table className="admxx-table admxx-recent-orders-table">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const sc = STATUS_COLORS[o.status] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <tr key={o.id}>
                      <td className="admxx-order-id">#{o.id?.slice(0, 8).toUpperCase()}</td>
                      <td style={{ textAlign: 'left' }}>{o.user?.name || '—'}</td>
                      <td style={{ fontWeight: 600 }}>₹{Number(o.totalAmount || 0).toFixed(0)}</td>
                      <td>
                        <span className="admxx-status-chip" style={{ background: sc.bg, color: sc.color }}>
                          {o.status}
                        </span>
                      </td>
                      <td className="admxx-order-date">{formatDate(o.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Stock Alerts */}
        <div className="admxx-dash-panel" style={{ flex: 1, minWidth: 0 }}>
          <div className="admxx-dash-panel-header">
            <div className="admxx-dash-panel-title">
              <AlertTriangle size={16} />
              Stock Alerts
            </div>
            {(outStock + lowStock) > 0 && (
              <span className="admxx-dash-alert-count">{outStock + lowStock}</span>
            )}
          </div>
          {outStock === 0 && lowStock === 0 ? (
            <div className="admxx-dash-stock-ok">
              <CheckCircle size={18} color="#16a34a" />
              All stock healthy
            </div>
          ) : (
            <div className="admxx-dash-stock-list">
              {products
                .filter((p) => p.stock === 0 || p.stock <= 20)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 6)
                .map((p) => (
                  <div key={p.id} className="admxx-dash-stock-row">
                    <div className="admxx-dash-stock-info">
                      <img
                        src={p.image || p.imageUrls?.[0] || 'https://picsum.photos/32'}
                        alt={p.name}
                        className="admxx-dash-stock-img"
                      />
                      <span className="admxx-dash-stock-name">{p.name}</span>
                    </div>
                    <span
                      className="admxx-status-chip"
                      style={{
                        background: p.stock === 0 ? '#fef2f2' : '#fef3c7',
                        color:      p.stock === 0 ? '#991b1b' : '#92400e',
                        flexShrink: 0,
                      }}
                    >
                      {p.stock === 0 ? 'Out' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const Inventory = ({ products, searchQuery, onEdit, onDelete, onAdd, onView }) => {
  const [catFilter, setCatFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return cats.sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = localSearch.toLowerCase();
    return products.filter((p) => {
      const matchQ = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || String(p.id).includes(q);
      const matchCat = catFilter === 'ALL' || p.category === catFilter;
      const matchStock =
        stockFilter === 'ALL' ? true :
        stockFilter === 'LOW' ? p.stock > 0 && p.stock <= 20 :
        stockFilter === 'OUT' ? p.stock === 0 :
        p.stock > 20;
      return matchQ && matchCat && matchStock;
    });
  }, [products, localSearch, catFilter, stockFilter]);

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 20).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const stockBadge = (stock) => {
    if (stock === 0) return { label: 'Out', cls: 'admxx-inv-badge-out' };
    if (stock <= 20) return { label: `${stock} Low`, cls: 'admxx-inv-badge-low' };
    return { label: stock, cls: 'admxx-inv-badge-ok' };
  };

  return (
    <div className="admxx-inv-wrap">
      {/* Stats bar */}
      <div className="admxx-inv-stats">
        <div className="admxx-inv-stat">
          <span className="admxx-inv-stat-val">{totalProducts}</span>
          <span className="admxx-inv-stat-lbl">Total Products</span>
        </div>
        <div className="admxx-inv-stat">
          <span className="admxx-inv-stat-val admxx-inv-stat-low">{lowStock}</span>
          <span className="admxx-inv-stat-lbl">Low Stock</span>
        </div>
        <div className="admxx-inv-stat">
          <span className="admxx-inv-stat-val admxx-inv-stat-out">{outOfStock}</span>
          <span className="admxx-inv-stat-lbl">Out of Stock</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admxx-inv-toolbar">
        <div className="admxx-inv-search">
          <Search size={15} />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products…"
          />
        </div>
        <div className="admxx-inv-filters">
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="ALL">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="ALL">All Stock</option>
            <option value="OK">In Stock</option>
            <option value="LOW">Low Stock</option>
            <option value="OUT">Out of Stock</option>
          </select>
        </div>
        <button className="admxx-inv-add-btn" onClick={onAdd}><Plus size={16} /> Add Product</button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="admxx-inv-empty">No products match your filters.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="admxx-inv-table-wrap">
            <table className="admxx-inv-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const badge = stockBadge(p.stock);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="admxx-inv-product-cell">
                          <img
                            src={p.image || p.imageUrls?.[0] || '/logo-03.png'}
                            alt={p.name}
                            className="admxx-inv-thumb"
                          />
                          <span className="admxx-inv-product-name">{p.name}</span>
                        </div>
                      </td>
                      <td><span className="admxx-inv-cat-chip">{p.category || '—'}</span></td>
                      <td className="admxx-inv-price">₹{Number(p.price).toLocaleString()}</td>
                      <td><span className={`admxx-inv-badge ${badge.cls}`}>{badge.label}</span></td>
                      <td>
                        <div className="admxx-inv-actions">
                          <button onClick={() => onView(p)} title="View"><Eye size={15} /></button>
                          <button onClick={() => onEdit(p)} title="Edit"><Edit2 size={15} /></button>
                          <button onClick={() => onDelete(p.id)} title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="admxx-inv-cards">
            {filtered.map((p) => {
              const badge = stockBadge(p.stock);
              return (
                <div key={p.id} className="admxx-inv-card">
                  <img
                    src={p.image || p.imageUrls?.[0] || '/logo-03.png'}
                    alt={p.name}
                    className="admxx-inv-card-img"
                  />
                  <div className="admxx-inv-card-body">
                    <p className="admxx-inv-card-name">{p.name}</p>
                    <p className="admxx-inv-card-cat">{p.category || '—'}</p>
                    <div className="admxx-inv-card-row">
                      <span className="admxx-inv-price">₹{Number(p.price).toLocaleString()}</span>
                      <span className={`admxx-inv-badge ${badge.cls}`}>{badge.label}</span>
                    </div>
                  </div>
                  <div className="admxx-inv-card-actions">
                    <button onClick={() => onView(p)} title="View"><Eye size={15} /></button>
                    <button onClick={() => onEdit(p)} title="Edit"><Edit2 size={15} /></button>
                    <button onClick={() => onDelete(p.id)} title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_META = {
  PENDING:   { bg: '#fef3c7', color: '#92400e',  icon: Clock },
  PAID:      { bg: '#dbeafe', color: '#1e40af',  icon: DollarSign },
  SHIPPED:   { bg: '#ede9fe', color: '#5b21b6',  icon: Truck },
  DELIVERED: { bg: '#f0fdf4', color: '#166534',  icon: CheckCircle },
  CANCELLED: { bg: '#fef2f2', color: '#991b1b',  icon: XCircle },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DATE_DESC');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [tracking, setTracking] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/orders');
      const data = res.data;
      const list = data?.orders ?? data?.data ?? (Array.isArray(data) ? data : []);
      setOrders(list);
    } catch (err) {
      console.error('[Admin] Failed to load orders:', err);
      setOrders([]);
      toast.error('Failed to load orders', { style: toastStyle, position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    setViewingOrder(order);
    setTracking(null);
    setDetailLoading(true);
    try {
      const data = await api.orders.getById(order.id);
      const full = data?.order || data?.data || data;
      if (full?.id) setViewingOrder(full);
    } catch {
      // keep the summary-level data we already have
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await axiosClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      const data = res.data;
      if (data?.success !== false) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
        setViewingOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
        toast.success('Status updated', { style: toastStyle, icon: '✅', position: 'top-center' });
      } else {
        toast.error(data?.message || 'Failed to update status', { style: toastStyle, icon: '❌', position: 'top-center' });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status', { style: toastStyle, icon: '❌', position: 'top-center' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!viewingOrder) return;
    setCancelling(true);
    try {
      const data = await api.orders.cancel(viewingOrder.id);
      if (data?.success !== false) {
        const updated = { ...viewingOrder, status: 'CANCELLED' };
        setViewingOrder(updated);
        setOrders((prev) => prev.map((o) => o.id === viewingOrder.id ? { ...o, status: 'CANCELLED' } : o));
        toast.success('Order cancelled successfully', { style: toastStyle, icon: '✅', position: 'top-center' });
      } else {
        toast.error(data?.message || 'Failed to cancel order', { style: toastStyle, icon: '❌', position: 'top-center' });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order', { style: toastStyle, icon: '❌', position: 'top-center' });
    } finally {
      setCancelling(false);
    }
  };

  const handleTrackOrder = async () => {
    if (!viewingOrder) return;
    setTrackLoading(true);
    setTracking(null);
    try {
      const data = await api.orders.track(viewingOrder.id);
      setTracking(data?.tracking || data?.data || data || {});
    } catch {
      toast.error('Tracking info unavailable', { style: toastStyle, position: 'top-center' });
    } finally {
      setTrackLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`;

  const canCancel = (status) => status === 'PENDING' || status === 'PAID';

  const stats = {
    total:     orders.length,
    active:    orders.filter((o) => o.status === 'PENDING' || o.status === 'PAID').length,
    shipped:   orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    revenue:   orders.filter((o) => o.status !== 'CANCELLED')
                     .reduce((s, o) => s + Number(o.totalAmount || 0), 0),
  };

  const filtered = orders
    .filter((o) => {
      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        o.id?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'DATE_ASC')    return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'AMOUNT_DESC') return Number(b.totalAmount) - Number(a.totalAmount);
      if (sortBy === 'AMOUNT_ASC')  return Number(a.totalAmount) - Number(b.totalAmount);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) return (
    <div className="admxx-section">
      <p className="admxx-no-data">Loading orders...</p>
    </div>
  );

  return (
    <div className="admxx-ord-layout">

      {/* ── Left: table panel ── */}
      <div className="admxx-ord-left">

        {/* Header */}
        <div className="admxx-ord-header">
          <h2 className="admxx-ord-title">Orders <span className="admxx-ord-count">{orders.length}</span></h2>
          <button className="admxx-ord-refresh" onClick={loadOrders} title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Filters */}
        <div className="admxx-ord-filters">
          <select
            className="admxx-ord-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Any status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()} ({orders.filter(o => o.status === s).length})
              </option>
            ))}
          </select>

          <div className="admxx-ord-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search order or customer…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          <select
            className="admxx-ord-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="DATE_DESC">Sort by Date ↓</option>
            <option value="DATE_ASC">Sort by Date ↑</option>
            <option value="AMOUNT_DESC">Highest Amount</option>
            <option value="AMOUNT_ASC">Lowest Amount</option>
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <p className="admxx-no-data" style={{ padding: '24px' }}>No orders found.</p>
        ) : (
          <div className="admxx-ord-table-wrap">
            <table className="admxx-ord-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const meta = STATUS_META[order.status] || { bg: '#f1f5f9', color: '#475569' };
                  const isSelected = viewingOrder?.id === order.id;
                  return (
                    <tr
                      key={order.id}
                      className={isSelected ? 'admxx-ord-row admxx-ord-row--selected' : 'admxx-ord-row'}
                      onClick={() => handleViewOrder(order)}
                    >
                      <td className="admxx-ord-id">#{order.id?.slice(0, 8).toUpperCase()}</td>
                      <td>
                        <div className="admxx-ord-customer">
                          <div className="admxx-ord-avatar">
                            {order.user?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="admxx-ord-customer-name">{order.user?.name || '—'}</div>
                            <div className="admxx-ord-customer-email">{order.user?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admxx-ord-chip" style={{ background: meta.bg, color: meta.color }}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="admxx-ord-amount">{formatCurrency(order.totalAmount)}</td>
                      <td className="admxx-ord-date">{formatDate(order.createdAt)}</td>
                      <td className="admxx-ord-more">···</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Right: detail panel ── */}
      {viewingOrder && (
        <div className="admxx-ord-backdrop" onClick={() => { setViewingOrder(null); setTracking(null); }} />
      )}
      {viewingOrder && (
        <div className="admxx-ord-detail">

          {/* Detail header */}
          <div className="admxx-ord-detail-header">
            <div>
              <h3 className="admxx-ord-detail-id">Order #{viewingOrder.id?.slice(0, 8).toUpperCase()}</h3>
              <div className="admxx-ord-detail-meta">
                {(() => {
                  const m = STATUS_META[viewingOrder.status] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <span className="admxx-ord-chip" style={{ background: m.bg, color: m.color }}>
                      {viewingOrder.status.charAt(0) + viewingOrder.status.slice(1).toLowerCase()}
                    </span>
                  );
                })()}
                <span className="admxx-ord-detail-date">{formatDate(viewingOrder.createdAt)}</span>
              </div>
            </div>
            <button className="admxx-ord-close" onClick={() => { setViewingOrder(null); setTracking(null); }}>
              <X size={18} />
            </button>
          </div>

          <div className="admxx-ord-detail-body">

            {detailLoading ? (
              <p className="admxx-no-data">Loading details…</p>
            ) : (
              <>
                {/* Customer card */}
                <div className="admxx-ord-customer-card">
                  <div className="admxx-ord-avatar admxx-ord-avatar--lg">
                    {viewingOrder.user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <h4 className="admxx-ord-customer-card-name">{viewingOrder.user?.name || '—'}</h4>
                  <p className="admxx-ord-customer-card-email">{viewingOrder.user?.email || ''}</p>
                </div>

                {/* Status update */}
                <div className="admxx-ord-status-row">
                  <label className="admxx-ord-status-label">Update Status</label>
                  <select
                    className="admxx-ord-status-select"
                    value={viewingOrder.status}
                    onChange={(e) => handleUpdateStatus(viewingOrder.id, e.target.value)}
                    disabled={updatingStatus}
                    style={{ borderColor: STATUS_META[viewingOrder.status]?.color }}
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {updatingStatus && <span className="admxx-ord-saving">Saving…</span>}
                </div>

                {/* Shipping address */}
                {viewingOrder.shippingAddress && (
                  <div className="admxx-ord-section">
                    <h5 className="admxx-ord-section-title">Shipping Address</h5>
                    <div className="admxx-ord-address">
                      {viewingOrder.shippingAddress.name && <div style={{ fontWeight: 600 }}>{viewingOrder.shippingAddress.name}</div>}
                      <div>{viewingOrder.shippingAddress.street}, {viewingOrder.shippingAddress.city}</div>
                      <div>{viewingOrder.shippingAddress.state} — {viewingOrder.shippingAddress.pincode}</div>
                      {viewingOrder.shippingAddress.phone && <div style={{ marginTop: 4, color: '#64748b' }}>📞 {viewingOrder.shippingAddress.phone}</div>}
                    </div>
                  </div>
                )}

                {/* Order items */}
                {viewingOrder.orderItems?.length > 0 && (
                  <div className="admxx-ord-section">
                    <h5 className="admxx-ord-section-title">Order items</h5>
                    <div className="admxx-ord-items">
                      {viewingOrder.orderItems.map((item, idx) => (
                        <div key={idx} className="admxx-ord-item">
                          {(item.product?.imageUrls?.[0] || item.product?.image) ? (
                            <img
                              src={item.product.imageUrls?.[0] || item.product.image}
                              alt={item.product?.name}
                              className="admxx-ord-item-img"
                            />
                          ) : (
                            <div className="admxx-ord-item-img admxx-ord-item-img--placeholder" />
                          )}
                          <div className="admxx-ord-item-info">
                            <span className="admxx-ord-item-name">{item.product?.name || item.productName || 'Product'}</span>
                            <span className="admxx-ord-item-price">
                              {formatCurrency(item.price ?? item.product?.price)} × {item.quantity}
                            </span>
                          </div>
                          <span className="admxx-ord-item-total">
                            {formatCurrency((item.price ?? item.product?.price ?? 0) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracking info */}
                {tracking && (
                  <div className="admxx-ord-section">
                    <h5 className="admxx-ord-section-title">Shipment Tracking</h5>
                    <div className="admxx-ord-address" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                      {tracking.awbCode && <div><strong>AWB:</strong> {tracking.awbCode}</div>}
                      {tracking.courierName && <div><strong>Courier:</strong> {tracking.courierName}</div>}
                      {tracking.currentStatus && <div><strong>Status:</strong> {tracking.currentStatus}</div>}
                      {tracking.expectedDelivery && <div><strong>ETA:</strong> {formatDate(tracking.expectedDelivery)}</div>}
                      {tracking.shipmentTrackActivities?.length > 0 && (
                        <div className="admxx-orders-track-timeline" style={{ marginTop: 10 }}>
                          {tracking.shipmentTrackActivities.map((act, i) => (
                            <div key={i} className="admxx-orders-track-event">
                              <div className="admxx-orders-track-dot" />
                              <div>
                                <div style={{ fontWeight: 600 }}>{act.activity || act.status}</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>
                                  {act.location && `${act.location} · `}{act.date && formatDateTime(act.date)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="admxx-ord-totals">
                  {viewingOrder.subtotal != null && (
                    <div className="admxx-ord-total-row">
                      <span>Subtotal</span><span>{formatCurrency(viewingOrder.subtotal)}</span>
                    </div>
                  )}
                  {viewingOrder.shippingCost != null && (
                    <div className="admxx-ord-total-row">
                      <span>Shipping</span>
                      <span>{viewingOrder.shippingCost === 0 ? 'Free' : formatCurrency(viewingOrder.shippingCost)}</span>
                    </div>
                  )}
                  <div className="admxx-ord-total-row admxx-ord-total-row--final">
                    <span>Total</span>
                    <strong>{formatCurrency(viewingOrder.totalAmount)}</strong>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action buttons pinned to bottom */}
          <div className="admxx-ord-detail-actions">
            {viewingOrder.status === 'SHIPPED' && (
              <button
                className="admxx-ord-btn admxx-ord-btn--track"
                onClick={handleTrackOrder}
                disabled={trackLoading}
              >
                <Truck size={15} />
                {trackLoading ? 'Loading…' : 'Track'}
              </button>
            )}
            {canCancel(viewingOrder.status) && (
              <button
                className="admxx-ord-btn admxx-ord-btn--cancel"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                <XCircle size={15} />
                {cancelling ? 'Cancelling…' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ====== USER MANAGEMENT COMPONENT ======
const UserManagement = ({ showConfirm, closeConfirm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [viewingUser, setViewingUser] = useState(null);
  const [viewingUserDetails, setViewingUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ayurveda_token');
      const res = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setViewingUser(user);
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem('ayurveda_token');
      const res = await fetch(`/api/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success) {
        setViewingUserDetails(data.user);
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    showConfirm({
      title: 'Delete User',
      message: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      confirmLabel: 'Delete User',
      danger: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          const token = localStorage.getItem('ayurveda_token');
          const res = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await res.json();

          if (data.success) {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            toast.success(`User "${userName}" deleted successfully`, {
              style: toastStyle,
              icon: '🗑️',
              position: 'top-center',
            });
          } else {
            toast.error(data.message || 'Failed to delete user', {
              style: toastStyle,
              icon: '❌',
              position: 'top-center',
            });
          }
        } catch (err) {
          console.error('Failed to delete user:', err);
          toast.error('Failed to delete user. Please try again.', {
            style: toastStyle,
            icon: '❌',
            position: 'top-center',
          });
        }
      },
    });
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="admxx-section">
        <h2>Users</h2>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admxx-section">
        <h2>Users</h2>
        <p style={{ color: '#e74c3c' }}>{error}</p>
        <button onClick={loadUsers}>Retry</button>
      </div>
    );
  }

  const displayUsers = filteredUsers.filter((u) =>
    roleFilter === 'ALL' ? true : u.role === roleFilter
  );

  const avatarColor = (role) => role === 'ADMIN'
    ? { bg: '#fef3c7', color: '#92400e' }
    : { bg: '#dcfce7', color: '#166534' };

  return (
    <div className="admxx-usr-wrap">

      {/* Stats */}
      <div className="admxx-usr-stats">
        <div className="admxx-usr-stat">
          <div className="admxx-usr-stat-icon" style={{ background: '#dcfce7', color: '#166534' }}>
            <Users size={20} />
          </div>
          <div>
            <span className="admxx-usr-stat-val">{users.filter((u) => u.role === 'USER').length}</span>
            <span className="admxx-usr-stat-lbl">Customers</span>
          </div>
        </div>
        <div className="admxx-usr-stat">
          <div className="admxx-usr-stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
            <Settings size={20} />
          </div>
          <div>
            <span className="admxx-usr-stat-val">{users.filter((u) => u.role === 'ADMIN').length}</span>
            <span className="admxx-usr-stat-lbl">Admins</span>
          </div>
        </div>
        <div className="admxx-usr-stat">
          <div className="admxx-usr-stat-icon" style={{ background: '#ede9fe', color: '#6d28d9' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="admxx-usr-stat-val">{users.reduce((s, u) => s + (u._count?.orders || 0), 0)}</span>
            <span className="admxx-usr-stat-lbl">Total Orders</span>
          </div>
        </div>
        <div className="admxx-usr-stat">
          <div className="admxx-usr-stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <ShoppingCart size={20} />
          </div>
          <div>
            <span className="admxx-usr-stat-val">{users.reduce((s, u) => s + (u.cartItemCount || 0), 0)}</span>
            <span className="admxx-usr-stat-lbl">Cart Items</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admxx-usr-toolbar">
        <div className="admxx-usr-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search name, email, phone…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="admxx-usr-clear" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
        <select className="admxx-usr-filter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="ALL">All Roles</option>
          <option value="USER">Customers</option>
          <option value="ADMIN">Admins</option>
        </select>
        <span className="admxx-usr-count">{displayUsers.length} users</span>
      </div>

      {displayUsers.length === 0 ? (
        <div className="admxx-usr-empty">No users match your search.</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="admxx-usr-table-wrap">
            <table className="admxx-usr-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Cart</th>
                  <th>Wishlist</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((u) => {
                  const av = avatarColor(u.role);
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="admxx-usr-cell">
                          <div className="admxx-usr-avatar" style={{ background: av.bg, color: av.color }}>
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="admxx-usr-info">
                            <span className="admxx-usr-name">{u.name}</span>
                            <span className="admxx-usr-email">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="admxx-usr-muted">{u.phone || '—'}</td>
                      <td>
                        <span className={`admxx-usr-role-badge ${u.role === 'ADMIN' ? 'admin' : 'user'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="admxx-usr-num">{u._count?.orders || 0}</td>
                      <td className="admxx-usr-num">{u.cartItemCount || 0}</td>
                      <td className="admxx-usr-num">{u.wishlistItemCount || 0}</td>
                      <td className="admxx-usr-muted">{formatDate(u.createdAt)}</td>
                      <td>
                        <div className="admxx-usr-actions">
                          <button onClick={() => handleViewUser(u)} title="View"><Eye size={15} /></button>
                          {u.role !== 'ADMIN' && (
                            <button onClick={() => handleDeleteUser(u.id, u.name)} title="Delete"><Trash2 size={15} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="admxx-usr-cards">
            {displayUsers.map((u) => {
              const av = avatarColor(u.role);
              return (
                <div key={u.id} className="admxx-usr-card">
                  <div className="admxx-usr-avatar" style={{ background: av.bg, color: av.color, width: 46, height: 46, fontSize: 18 }}>
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="admxx-usr-card-body">
                    <div className="admxx-usr-card-top">
                      <span className="admxx-usr-name">{u.name}</span>
                      <span className={`admxx-usr-role-badge ${u.role === 'ADMIN' ? 'admin' : 'user'}`}>{u.role}</span>
                    </div>
                    <span className="admxx-usr-email">{u.email}</span>
                    <div className="admxx-usr-card-chips">
                      <span><ShoppingCart size={11} /> {u._count?.orders || 0} orders</span>
                      <span><Package size={11} /> {u.cartItemCount || 0} cart</span>
                    </div>
                  </div>
                  <div className="admxx-usr-actions">
                    <button onClick={() => handleViewUser(u)} title="View"><Eye size={15} /></button>
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => handleDeleteUser(u.id, u.name)} title="Delete"><Trash2 size={15} /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <div className="admxx-modal-backdrop">
          <div className="admxx-modal">
            <div className="admxx-modal-header">
              <h3>User Details</h3>
              <button onClick={() => { setViewingUser(null); setViewingUserDetails(null); }}>
                <X size={20} />
              </button>
            </div>

            <div className="admxx-user-detail-header">
              <div
                className="admxx-user-detail-avatar"
                style={{ background: viewingUser.role === 'ADMIN' ? '#fde68a' : '#bbf7d0' }}
              >
                {viewingUser.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div className="admxx-user-detail-name">{viewingUser.name}</div>
                <div className="admxx-user-detail-role">
                  <span className={`admxx-role-badge ${viewingUser.role === 'ADMIN' ? 'admin' : 'user'}`}>
                    {viewingUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="admxx-user-detail-grid">
              <div><strong>Email</strong>{viewingUser.email}</div>
              <div><strong>Phone</strong>{viewingUser.phone || 'Not provided'}</div>
              <div><strong>Joined</strong>{formatDate(viewingUser.createdAt)}</div>
              <div><strong>Orders</strong>{viewingUser._count?.orders || 0}</div>
              <div><strong>Cart Items</strong>{viewingUser.cartItemCount || 0}</div>
              <div><strong>Wishlist Items</strong>{viewingUser.wishlistItemCount || 0}</div>
              <div><strong>Reviews</strong>{viewingUser._count?.reviews || 0}</div>
            </div>

            {loadingDetails ? (
              <p className="admxx-no-data">Loading details...</p>
            ) : (
              <>
                {viewingUserDetails?.cartItems?.length > 0 && (
                  <div className="admxx-user-orders-section">
                    <h4>🛒 Cart Items ({viewingUserDetails.cartItems.length})</h4>
                    <table className="admxx-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingUserDetails.cartItems.map((item) => (
                          <tr key={item.id}>
                            <td style={{ textAlign: 'left' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                  src={item.product?.imageUrls?.[0] || 'https://picsum.photos/40'}
                                  alt={item.product?.name}
                                  style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                                />
                                {item.product?.name}
                              </div>
                            </td>
                            <td>₹{Number(item.product?.discountedPrice || item.product?.realPrice || 0).toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>₹{(Number(item.product?.discountedPrice || item.product?.realPrice || 0) * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {viewingUserDetails?.wishlistItems?.length > 0 && (
                  <div className="admxx-user-orders-section">
                    <h4>❤️ Wishlist ({viewingUserDetails.wishlistItems.length})</h4>
                    <table className="admxx-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Added</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingUserDetails.wishlistItems.map((item) => (
                          <tr key={item.id}>
                            <td style={{ textAlign: 'left' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                  src={item.product?.imageUrls?.[0] || 'https://picsum.photos/40'}
                                  alt={item.product?.name}
                                  style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                                />
                                {item.product?.name}
                              </div>
                            </td>
                            <td>₹{Number(item.product?.discountedPrice || item.product?.realPrice || 0).toFixed(2)}</td>
                            <td>{formatDate(item.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {viewingUserDetails?.orders?.length > 0 ? (
                  <div className="admxx-user-orders-section">
                    <h4>📦 Recent Orders ({viewingUserDetails.orders.length})</h4>
                    <table className="admxx-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingUserDetails.orders.map((order) => (
                          <tr key={order.id}>
                            <td style={{ fontSize: '12px' }}>{order.id.slice(0, 8)}...</td>
                            <td>₹{Number(order.totalAmount).toFixed(2)}</td>
                            <td>
                              <span className={`admxx-role-badge ${
                                order.status === 'DELIVERED' ? 'user' : 'admin'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="admxx-no-data">No orders yet.</p>
                )}

                {viewingUserDetails?.reviews?.length > 0 && (
                  <div className="admxx-user-orders-section">
                    <h4>⭐ Reviews ({viewingUserDetails.reviews.length})</h4>
                    {viewingUserDetails.reviews.map((review) => (
                      <div key={review.id} className="admxx-address-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong>{review.product?.name}</strong>
                          <span>{'⭐'.repeat(review.rating)}</span>
                        </div>
                        {review.comment && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {viewingUserDetails?.addresses?.length > 0 && (
                  <div className="admxx-user-orders-section">
                    <h4>📍 Addresses</h4>
                    {viewingUserDetails.addresses.map((addr) => (
                      <div key={addr.id} className="admxx-address-card">
                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        {addr.isDefault && <span className="admxx-address-default">(Default)</span>}
                      </div>
                    ))}
                  </div>
                )}

                {!viewingUserDetails?.cartItems?.length &&
                 !viewingUserDetails?.wishlistItems?.length &&
                 !viewingUserDetails?.orders?.length &&
                 !viewingUserDetails?.reviews?.length &&
                 !viewingUserDetails?.addresses?.length && (
                  <p className="admxx-no-data">No activity found for this user.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const REFUND_STATUSES = ['ALL', 'REQUESTED', 'PENDING_ADMIN_APPROVAL', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'FAILED'];

const refundStatusMeta = {
  REQUESTED:               { bg: '#fef3c7', color: '#92400e', label: 'Requested' },
  PENDING_ADMIN_APPROVAL:  { bg: '#dbeafe', color: '#1e40af', label: 'Pending Approval' },
  APPROVED:                { bg: '#dcfce7', color: '#166534', label: 'Approved' },
  REJECTED:                { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
  PROCESSING:              { bg: '#e0e7ff', color: '#3730a3', label: 'Processing' },
  COMPLETED:               { bg: '#d1fae5', color: '#065f46', label: 'Completed' },
  FAILED:                  { bg: '#fce7f3', color: '#9d174d', label: 'Failed' },
};

const Refunds = () => {
  const [refunds, setRefunds]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL');
  const [page, setPage]         = useState(1);
  const [actionModal, setActionModal] = useState(null); // { type: 'approve'|'reject', refund }
  const [adminNote, setAdminNote]     = useState('');
  const [acting, setActing]           = useState(false);
  const [checkingId, setCheckingId]   = useState(null);
  const LIMIT = 20;

  const loadRefunds = async (status, pg = 1) => {
    setLoading(true);
    try {
      const data = await getAllRefunds(status === 'ALL' ? undefined : status, pg, LIMIT);
      if (data?.success) setRefunds(data.refunds ?? []);
      else setRefunds([]);
    } catch {
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRefunds(filter, page); }, [filter, page]);

  const openApprove = (r) => { setAdminNote(''); setActionModal({ type: 'approve', refund: r }); };
  const openReject  = (r) => { setAdminNote(''); setActionModal({ type: 'reject',  refund: r }); };
  const closeModal  = ()  => { setActionModal(null); setAdminNote(''); };

  const handleAction = async () => {
    if (!actionModal) return;
    if (actionModal.type === 'reject' && !adminNote.trim()) {
      toast.error('Rejection reason is required.', { style: toastStyle });
      return;
    }
    setActing(true);
    try {
      const fn = actionModal.type === 'approve' ? approveRefund : rejectRefund;
      const res = await fn(actionModal.refund.id, adminNote.trim() || undefined);
      if (res?.success) {
        toast.success(actionModal.type === 'approve' ? 'Refund approved!' : 'Refund rejected.', { style: toastStyle });
        closeModal();
        loadRefunds(filter, page);
      } else {
        toast.error(res?.message || 'Action failed.', { style: toastStyle });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed.', { style: toastStyle });
    } finally {
      setActing(false);
    }
  };

  const handleCheckStatus = async (refundId) => {
    setCheckingId(refundId);
    try {
      const res = await checkRefundStatus(refundId);
      if (res?.success) {
        toast.success(`Status: ${res.status || 'Updated'}`, { style: toastStyle });
        loadRefunds(filter, page);
      } else {
        toast.error(res?.message || 'Check failed.', { style: toastStyle });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Check failed.', { style: toastStyle });
    } finally {
      setCheckingId(null);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const actionable = (r) => ['REQUESTED', 'PENDING_ADMIN_APPROVAL'].includes(r.status);

  return (
    <div className="admxx-section">
      <div className="admxx-section-header">
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Refund Requests</h2>
        <button onClick={() => loadRefunds(filter, page)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14}/> Refresh
        </button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {REFUND_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            style={{
              padding: '5px 14px', borderRadius: 20, border: '1px solid',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
              background: filter === s ? '#0F3F2A' : 'transparent',
              color: filter === s ? '#fff' : '#0F3F2A',
              borderColor: filter === s ? '#0F3F2A' : 'rgba(15,63,42,0.25)',
              transition: 'all 0.15s',
            }}
          >
            {s === 'ALL' ? 'All' : (refundStatusMeta[s]?.label || s)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="admxx-no-data">Loading…</p>
      ) : refunds.length === 0 ? (
        <p className="admxx-no-data">No refund requests found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admxx-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map(r => {
                const meta = refundStatusMeta[r.status] || { bg: '#f3f4f6', color: '#374151', label: r.status };
                return (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>#{String(r.orderId).slice(0, 10)}</td>
                    <td style={{ fontSize: '0.83rem' }}>{r.user?.name || r.userName || '—'}</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(r.amount || 0).toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '0.8rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason || '—'}</td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{fmt(r.requestedAt || r.createdAt)}</td>
                    <td>
                      {actionable(r) && (
                        <>
                          <button onClick={() => openApprove(r)} title="Approve" style={{ color: '#16a34a' }}>
                            <CheckCircle size={15}/>
                          </button>
                          <button onClick={() => openReject(r)} title="Reject" style={{ color: '#dc2626' }}>
                            <XCircle size={15}/>
                          </button>
                        </>
                      )}
                      {['APPROVED', 'PROCESSING'].includes(r.status) && (
                        <button
                          onClick={() => handleCheckStatus(r.id)}
                          title="Sync with Razorpay"
                          disabled={checkingId === r.id}
                          style={{ color: '#0f85ed' }}
                        >
                          {checkingId === r.id ? <RotateCcw size={14} style={{ animation: 'spin 1s linear infinite' }}/> : <RefreshCw size={14}/>}
                        </button>
                      )}
                      {!actionable(r) && !['APPROVED','PROCESSING'].includes(r.status) && (
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {refunds.length === LIMIT && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          <span style={{ padding: '10px 0', fontSize: '0.85rem', color: '#6b7280' }}>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Approve / Reject Modal */}
      {actionModal && (
        <div className="admxx-modal-backdrop" onClick={closeModal}>
          <div className="admxx-modal" onClick={e => e.stopPropagation()}>
            <div className="admxx-modal-header">
              <h3>{actionModal.type === 'approve' ? 'Approve Refund' : 'Reject Refund'}</h3>
              <button onClick={closeModal} style={{ background: 'transparent', color: '#6b7280', border: 'none', padding: 4, cursor: 'pointer', margin: 0 }}><X size={16}/></button>
            </div>
            <div className="admxx-modal-body">
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 8 }}>
                Order: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>#{String(actionModal.refund.orderId).slice(0, 10)}</strong>
                &nbsp;·&nbsp; Amount: <strong style={{ color: '#0f172a' }}>₹{Number(actionModal.refund.amount || 0).toLocaleString('en-IN')}</strong>
              </p>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Admin Note {actionModal.type === 'reject' && <span style={{ color: '#dc2626' }}>*</span>}
              </label>
              <textarea
                rows={3}
                placeholder={actionModal.type === 'approve' ? 'Optional note…' : 'Reason for rejection (required)'}
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 10, fontSize: '0.88rem', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div className="admxx-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button onClick={closeModal} style={{ background: 'transparent', color: '#374151', border: '1px solid #d1d5db' }}>Cancel</button>
              <button
                onClick={handleAction}
                disabled={acting}
                style={{ background: actionModal.type === 'approve' ? '#16a34a' : '#dc2626', color: '#fff', border: 'none' }}
              >
                {acting ? 'Processing…' : actionModal.type === 'approve' ? 'Approve & Process' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Finance = () => {
  const [orders, setOrders]   = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [ordRes, refRes] = await Promise.all([
          axiosClient.get('/admin/orders'),
          getAllRefunds(),
        ]);
        setOrders(ordRes.data?.orders ?? ordRes.data?.data ?? (Array.isArray(ordRes.data) ? ordRes.data : []));
        setRefunds(refRes?.refunds ?? []);
      } catch (err) {
        console.error('[Finance] load error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="admxx-section"><h2>Finance</h2><p className="admxx-no-data">Loading...</p></div>
  );

  const fmt = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const paid     = orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'PENDING');
  const revenue  = paid.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  const avgOrder = paid.length ? revenue / paid.length : 0;
  const refundTotal = refunds
    .filter((r) => r.status === 'APPROVED')
    .reduce((s, r) => s + Number(r.amount || 0), 0);
  const netRevenue = revenue - refundTotal;

  // Status distribution
  const statusCounts = ORDER_STATUSES.map((s) => ({
    label: s,
    count: orders.filter((o) => o.status === s).length,
    meta:  STATUS_META[s],
  }));
  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

  // Payment method split
  const cod    = paid.filter((o) => o.paymentMethod === 'COD').length;
  const online = paid.filter((o) => o.paymentMethod !== 'COD').length;
  const codRevenue    = paid.filter((o) => o.paymentMethod === 'COD').reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  const onlineRevenue = paid.filter((o) => o.paymentMethod !== 'COD').reduce((s, o) => s + Number(o.totalAmount || 0), 0);

  // Monthly revenue (last 6 months)
  const monthlyMap = {};
  paid.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + Number(o.totalAmount || 0);
  });
  const months = Object.keys(monthlyMap).sort().slice(-6).map((key) => {
    const [yr, mo] = key.split('-');
    return {
      label: new Date(yr, mo - 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
      value: monthlyMap[key],
    };
  });
  const maxMonthly = Math.max(...months.map((m) => m.value), 1);

  // Refund stats
  const refundPending  = refunds.filter((r) => r.status === 'REQUESTED' || r.status === 'PENDING').length;
  const refundApproved = refunds.filter((r) => r.status === 'APPROVED').length;
  const refundRejected = refunds.filter((r) => r.status === 'REJECTED').length;

  const kpis = [
    { label: 'Gross Revenue',    value: fmt(revenue),       sub: `${paid.length} paid orders`,      iconBg: '#dcfce7', iconColor: '#166534', icon: DollarSign },
    { label: 'Net Revenue',      value: fmt(netRevenue),    sub: 'After refunds',                   iconBg: '#d1fae5', iconColor: '#059669', icon: TrendingUp },
    { label: 'Refunds Issued',   value: fmt(refundTotal),   sub: `${refundApproved} approved`,      iconBg: '#fee2e2', iconColor: '#dc2626', icon: RotateCcw  },
    { label: 'Avg Order Value',  value: fmt(avgOrder),      sub: 'Per paid order',                  iconBg: '#e0f2fe', iconColor: '#0369a1', icon: ShoppingCart},
    { label: 'Cancelled',        value: orders.filter((o) => o.status === 'CANCELLED').length, sub: `${orders.length ? Math.round((orders.filter((o)=>o.status==='CANCELLED').length/orders.length)*100):0}% of total`, iconBg: '#fef3c7', iconColor: '#d97706', icon: XCircle },
    { label: 'Pending Refunds',  value: refundPending,      sub: `${refundRejected} rejected`,      iconBg: refundPending > 0 ? '#fef3c7' : '#f0fdf4', iconColor: refundPending > 0 ? '#d97706' : '#166534', icon: Clock },
  ];

  return (
    <div className="admxx-fin-wrap">

      {/* KPI Grid */}
      <div className="admxx-fin-kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="admxx-fin-kpi-card">
            <div className="admxx-fin-kpi-icon" style={{ background: k.iconBg, color: k.iconColor }}>
              <k.icon size={20} />
            </div>
            <div className="admxx-fin-kpi-body">
              <span className="admxx-fin-kpi-label">{k.label}</span>
              <strong className="admxx-fin-kpi-value">{k.value}</strong>
              <small className="admxx-fin-kpi-sub">{k.sub}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="admxx-fin-charts-row">

        {/* Monthly Bar Chart */}
        <div className="admxx-fin-panel">
          <div className="admxx-fin-panel-header">
            <TrendingUp size={16} />
            Monthly Revenue
          </div>
          {months.length === 0 ? (
            <p className="admxx-no-data">No data yet</p>
          ) : (
            <div className="admxx-fin-bars">
              {months.map((m) => (
                <div key={m.label} className="admxx-fin-bar-col">
                  <span className="admxx-fin-bar-val">{fmt(m.value)}</span>
                  <div className="admxx-fin-bar-track">
                    <div
                      className="admxx-fin-bar"
                      style={{ height: `${Math.max(4, Math.round((m.value / maxMonthly) * 100))}%` }}
                    />
                  </div>
                  <span className="admxx-fin-bar-label">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="admxx-fin-panel">
          <div className="admxx-fin-panel-header">
            <CheckCircle size={16} />
            Order Status
          </div>
          <div className="admxx-fin-status-list">
            {statusCounts.map(({ label, count, meta }) => (
              <div key={label} className="admxx-fin-status-row">
                <div className="admxx-fin-status-info">
                  <span className="admxx-fin-status-dot" style={{ background: meta.color }} />
                  <span className="admxx-fin-status-name">{label}</span>
                  <span className="admxx-fin-status-count">{count}</span>
                </div>
                <div className="admxx-fin-status-track">
                  <div className="admxx-fin-status-fill" style={{ width: `${Math.round((count / maxCount) * 100)}%`, background: meta.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Split */}
      <div className="admxx-fin-pay-row">
        {[
          { label: 'Cash on Delivery', amount: codRevenue,    count: cod,    pct: paid.length ? Math.round((cod/paid.length)*100) : 0,    color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Online (Razorpay)', amount: onlineRevenue, count: online, pct: paid.length ? Math.round((online/paid.length)*100) : 0, color: '#0ea5e9', bg: '#e0f2fe' },
        ].map((p) => (
          <div key={p.label} className="admxx-fin-pay-card">
            <div className="admxx-fin-pay-top">
              <div className="admxx-fin-pay-icon" style={{ background: p.bg, color: p.color }}>
                <DollarSign size={18} />
              </div>
              <div>
                <p className="admxx-fin-pay-label">{p.label}</p>
                <p className="admxx-fin-pay-meta">{p.count} orders</p>
              </div>
              <span className="admxx-fin-pay-pct" style={{ color: p.color }}>{p.pct}%</span>
            </div>
            <strong className="admxx-fin-pay-amount">{fmt(p.amount)}</strong>
            <div className="admxx-fin-pay-track">
              <div className="admxx-fin-pay-fill" style={{ width: `${p.pct}%`, background: p.color }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

// ====== ADMIN SETTINGS ======
const defaultSettings = {
  store: {
    name: 'Vedayura',
    tagline: 'Pure Ayurvedic Wellness',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    currency: 'INR',
  },
  orders: {
    freeShippingThreshold: 999,
    codEnabled: true,
    onlineEnabled: true,
    autoCancelDays: 7,
    lowStockThreshold: 20,
  },
  notifications: {
    newOrder: true,
    lowStock: true,
    refundRequest: true,
    newUser: false,
    orderDelivered: false,
  },
};

const AdminSettings = ({ onClose, user }) => {
  const { updateProfile } = useShop();
  const [activeTab, setActiveTab] = useState('store');
  const [settings, setSettings] = useState(defaultSettings);
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axiosClient.get('/admin/settings');
        const incoming = res?.data?.settings;
        if (incoming) {
          const mapped = {
            store: {
              name: incoming.storeName ?? defaultSettings.store.name,
              tagline: incoming.tagline ?? '',
              email: incoming.email ?? '',
              phone: incoming.phone ?? '',
              address: incoming.address ?? '',
              gstin: incoming.gstin ?? '',
              currency: incoming.currency ?? defaultSettings.store.currency,
            },
            orders: {
              freeShippingThreshold: incoming.freeShippingThreshold ?? defaultSettings.orders.freeShippingThreshold,
              codEnabled: incoming.codEnabled ?? defaultSettings.orders.codEnabled,
              onlineEnabled: incoming.onlineEnabled ?? defaultSettings.orders.onlineEnabled,
              autoCancelDays: incoming.autoCancelDays ?? defaultSettings.orders.autoCancelDays,
              lowStockThreshold: incoming.lowStockThreshold ?? defaultSettings.orders.lowStockThreshold,
            },
            notifications: { ...defaultSettings.notifications },
          };
          setSettings((prev) => ({
            ...prev,
            ...mapped,
            store: { ...prev.store, ...mapped.store },
            orders: { ...prev.orders, ...mapped.orders },
            notifications: { ...prev.notifications, ...mapped.notifications },
          }));
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    loadSettings();
  }, []);

  const updateStore = (key, val) =>
    setSettings((s) => ({ ...s, store: { ...s.store, [key]: val } }));

  const updateOrders = (key, val) =>
    setSettings((s) => ({ ...s, orders: { ...s.orders, [key]: val } }));

  const updateNotification = (key, val) =>
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [key]: val } }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name: profileData.name, email: profileData.email, phone: profileData.phone });
      toast.success('Profile updated', { style: toastStyle, icon: '✅', position: 'top-center' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile', { style: toastStyle, icon: '❌', position: 'top-center' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSave = async () => {
    setSavingSettings(true);
    try {
      const payload = {
        storeName: settings.store.name,
        tagline: settings.store.tagline || null,
        email: settings.store.email || null,
        phone: settings.store.phone || null,
        address: settings.store.address || null,
        gstin: settings.store.gstin || null,
        currency: settings.store.currency,
        freeShippingThreshold: settings.orders.freeShippingThreshold,
        codEnabled: settings.orders.codEnabled,
        onlineEnabled: settings.orders.onlineEnabled,
        lowStockThreshold: settings.orders.lowStockThreshold,
      };
      await axiosClient.put('/admin/settings', payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('Settings saved', { style: toastStyle, icon: '✅', position: 'top-center' });
    } catch (err) {
      toast.error('Failed to save settings', { style: toastStyle, icon: '❌', position: 'top-center' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      toast.error('Passwords do not match', { style: toastStyle, icon: '❌', position: 'top-center' });
      return;
    }
    if (passwordData.newPass.length < 6) {
      toast.error('Password must be at least 6 characters', { style: toastStyle, icon: '❌', position: 'top-center' });
      return;
    }
    setSavingPassword(true);
    try {
      const res = await axiosClient.put('/auth/change-password', {
        currentPassword: passwordData.current,
        newPassword: passwordData.newPass,
      });
      if (res.data?.success !== false) {
        toast.success('Password updated successfully', { style: toastStyle, icon: '✅', position: 'top-center' });
        setPasswordData({ current: '', newPass: '', confirm: '' });
      } else {
        toast.error(res.data?.message || 'Failed to update password', { style: toastStyle, icon: '❌', position: 'top-center' });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update password', { style: toastStyle, icon: '❌', position: 'top-center' });
    } finally {
      setSavingPassword(false);
    }
  };

  const TABS = [
    { key: 'store',         label: 'Store',         icon: ShoppingCart },
    { key: 'orders',        label: 'Orders',        icon: Truck        },
    { key: 'notifications', label: 'Alerts',        icon: Bell         },
    { key: 'account',       label: 'Account',       icon: Users        },
  ];

  return (
    <div className="admxx-set-overlay" onClick={onClose}>
      <div className="admxx-set-panel" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="admxx-set-header">
          <div className="admxx-set-header-left">
            <div className="admxx-set-header-icon"><Settings size={20} /></div>
            <div>
              <h2>Settings</h2>
              <p>Manage your store configuration</p>
            </div>
          </div>
          <button className="admxx-set-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="admxx-set-body">
          {/* Sidebar */}
          <nav className="admxx-set-nav">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`admxx-set-tab${activeTab === key ? ' active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="admxx-set-content">

            {/* ── STORE INFO ── */}
            {activeTab === 'store' && (
              <div className="admxx-set-section">
                <div className="admxx-set-section-head">
                  <ShoppingCart size={18} />
                  <div>
                    <h3>Store Information</h3>
                    <p>Details shown on invoices and customer communications.</p>
                  </div>
                </div>

                <div className="admxx-set-card">
                  <div className="admxx-set-grid">
                    <div className="admxx-set-field">
                      <label>Store Name</label>
                      <input value={settings.store.name} onChange={(e) => updateStore('name', e.target.value)} placeholder="e.g. Vedayura" />
                    </div>
                    <div className="admxx-set-field">
                      <label>Tagline</label>
                      <input value={settings.store.tagline} onChange={(e) => updateStore('tagline', e.target.value)} placeholder="Pure Ayurvedic Wellness" />
                    </div>
                    <div className="admxx-set-field">
                      <label>Support Email</label>
                      <input type="email" value={settings.store.email} onChange={(e) => updateStore('email', e.target.value)} placeholder="support@vedayura.com" />
                    </div>
                    <div className="admxx-set-field">
                      <label>Support Phone</label>
                      <input value={settings.store.phone} onChange={(e) => updateStore('phone', e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div className="admxx-set-field admxx-set-field-full">
                      <label>Business Address</label>
                      <textarea rows={2} value={settings.store.address} onChange={(e) => updateStore('address', e.target.value)} placeholder="123 Wellness Street, Bangalore, Karnataka - 560001" />
                    </div>
                    <div className="admxx-set-field">
                      <label>GSTIN</label>
                      <input value={settings.store.gstin} onChange={(e) => updateStore('gstin', e.target.value)} placeholder="22AAAAA0000A1Z5" />
                    </div>
                    <div className="admxx-set-field">
                      <label>Currency</label>
                      <select value={settings.store.currency} onChange={(e) => updateStore('currency', e.target.value)}>
                        <option value="INR">INR — Indian Rupee (₹)</option>
                        <option value="USD">USD — US Dollar ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="admxx-set-footer">
                  <button className="admxx-set-save-btn" onClick={handleSave} disabled={savingSettings}>
                    {savingSettings ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ── ORDERS & SHIPPING ── */}
            {activeTab === 'orders' && (
              <div className="admxx-set-section">
                <div className="admxx-set-section-head">
                  <Truck size={18} />
                  <div>
                    <h3>Orders & Shipping</h3>
                    <p>Payment methods, shipping rules and order behaviour.</p>
                  </div>
                </div>

                <div className="admxx-set-card">
                  <p className="admxx-set-group-label">Payment Methods</p>
                  {[
                    { key: 'codEnabled',    label: 'Cash on Delivery',        desc: 'Allow customers to pay on delivery' },
                    { key: 'onlineEnabled', label: 'Online Payment (Razorpay)',desc: 'UPI, cards and netbanking' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="admxx-set-toggle-row">
                      <div className="admxx-set-toggle-info">
                        <span className="admxx-set-toggle-label">{label}</span>
                        <span className="admxx-set-toggle-desc">{desc}</span>
                      </div>
                      <label className="admxx-set-toggle">
                        <input type="checkbox" checked={settings.orders[key]} onChange={(e) => updateOrders(key, e.target.checked)} />
                        <span className="admxx-set-toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="admxx-set-card">
                  <p className="admxx-set-group-label">Shipping</p>
                  <div className="admxx-set-field">
                    <label>Free Shipping Threshold (₹)</label>
                    <input type="number" min="0" value={settings.orders.freeShippingThreshold}
                      onChange={(e) => updateOrders('freeShippingThreshold', Number(e.target.value))} />
                    <small>Orders above this amount get free shipping</small>
                  </div>
                </div>

                <div className="admxx-set-card">
                  <p className="admxx-set-group-label">Order Management</p>
                  <div className="admxx-set-grid">
                    <div className="admxx-set-field">
                      <label>Auto-Cancel After (days)</label>
                      <input type="number" min="1" max="30" value={settings.orders.autoCancelDays}
                        onChange={(e) => updateOrders('autoCancelDays', Number(e.target.value))} />
                    </div>
                    <div className="admxx-set-field">
                      <label>Low Stock Threshold (units)</label>
                      <input type="number" min="1" value={settings.orders.lowStockThreshold}
                        onChange={(e) => updateOrders('lowStockThreshold', Number(e.target.value))} />
                      <small>Triggers a low stock alert</small>
                    </div>
                  </div>
                </div>

                <div className="admxx-set-footer">
                  <button className="admxx-set-save-btn" onClick={handleSave} disabled={savingSettings}>
                    {savingSettings ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <div className="admxx-set-section">
                <div className="admxx-set-section-head">
                  <Bell size={18} />
                  <div>
                    <h3>Notification Preferences</h3>
                    <p>Choose which events trigger admin alerts.</p>
                  </div>
                </div>

                <div className="admxx-set-card">
                  {[
                    { key: 'newOrder',       label: 'New Order Placed',         desc: 'Alert when a customer places an order',          color: '#166534', bg: '#dcfce7' },
                    { key: 'lowStock',       label: 'Low Stock Warning',         desc: 'Alert when a product falls below threshold',     color: '#92400e', bg: '#fef3c7' },
                    { key: 'refundRequest',  label: 'Refund Request',            desc: 'Alert when a customer requests a refund',        color: '#dc2626', bg: '#fee2e2' },
                    { key: 'newUser',        label: 'New Customer Registration', desc: 'Alert when a new user signs up',                 color: '#0369a1', bg: '#e0f2fe' },
                    { key: 'orderDelivered', label: 'Order Delivered',           desc: 'Alert when an order is marked delivered',        color: '#6d28d9', bg: '#ede9fe' },
                  ].map(({ key, label, desc, color, bg }) => (
                    <div key={key} className="admxx-set-toggle-row">
                      <div className="admxx-set-notif-icon" style={{ background: bg, color }}>
                        <Bell size={14} />
                      </div>
                      <div className="admxx-set-toggle-info">
                        <span className="admxx-set-toggle-label">{label}</span>
                        <span className="admxx-set-toggle-desc">{desc}</span>
                      </div>
                      <label className="admxx-set-toggle">
                        <input type="checkbox" checked={settings.notifications[key]}
                          onChange={(e) => updateNotification(key, e.target.checked)} />
                        <span className="admxx-set-toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="admxx-set-footer">
                  <button className="admxx-set-save-btn" onClick={handleSave} disabled={savingSettings}>
                    {savingSettings ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {activeTab === 'account' && (
              <div className="admxx-set-section">
                <div className="admxx-set-section-head">
                  <Users size={18} />
                  <div>
                    <h3>Admin Account</h3>
                    <p>Your profile details and login credentials.</p>
                  </div>
                </div>

                {/* Profile card */}
                <div className="admxx-set-profile-banner">
                  <div className="admxx-set-profile-avatar">{profileData.name?.charAt(0)?.toUpperCase() || '?'}</div>
                  <div>
                    <strong>{profileData.name || '—'}</strong>
                    <span>{profileData.email || '—'}</span>
                    <span className="admxx-set-admin-badge">Administrator</span>
                  </div>
                </div>

                <div className="admxx-set-card">
                  <p className="admxx-set-group-label">Edit Profile</p>
                  <form onSubmit={handleSaveProfile} className="admxx-set-grid">
                    <div className="admxx-set-field">
                      <label>Full Name</label>
                      <input value={profileData.name} required
                        onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name" />
                    </div>
                    <div className="admxx-set-field">
                      <label>Phone</label>
                      <input value={profileData.phone}
                        onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 98765 43210" />
                    </div>
                    <div className="admxx-set-field admxx-set-field-full">
                      <label>Email Address</label>
                      <input type="email" required value={profileData.email}
                        onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="admin@vedayura.com" />
                    </div>
                    <div className="admxx-set-field-full">
                      <button type="submit" className="admxx-set-save-btn" disabled={savingProfile}>
                        {savingProfile ? 'Saving…' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="admxx-set-card">
                  <p className="admxx-set-group-label">Change Password</p>
                  <form onSubmit={handleChangePassword} className="admxx-set-grid">
                    <div className="admxx-set-field admxx-set-field-full">
                      <label>Current Password</label>
                      <input type="password" required value={passwordData.current}
                        onChange={(e) => setPasswordData((p) => ({ ...p, current: e.target.value }))}
                        placeholder="Enter current password" />
                    </div>
                    <div className="admxx-set-field">
                      <label>New Password</label>
                      <input type="password" required minLength={6} value={passwordData.newPass}
                        onChange={(e) => setPasswordData((p) => ({ ...p, newPass: e.target.value }))}
                        placeholder="Min. 6 characters" />
                    </div>
                    <div className="admxx-set-field">
                      <label>Confirm Password</label>
                      <input type="password" required value={passwordData.confirm}
                        onChange={(e) => setPasswordData((p) => ({ ...p, confirm: e.target.value }))}
                        placeholder="Repeat new password" />
                    </div>
                    <div className="admxx-set-field-full">
                      <button type="submit" className="admxx-set-save-btn" disabled={savingPassword}>
                        {savingPassword ? 'Updating…' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
