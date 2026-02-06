import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, Grid, Package, ShoppingCart,
  DollarSign, Settings, Search, Bell, Eye,
  Plus, Trash2, Edit2, X, RotateCcw, Users
} from 'lucide-react';
import './Admin.css';
import { getAllRefunds } from '../api/refundService';
import { getAllCategories } from '../api/categoryService';
import api from '../api';
import StockManagement from '../components/StockManagement';
import '../components/StockManagement.css'

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
  const [saving, setSaving] = useState(false);

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

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
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
        const result = await updateProduct(editingProduct.id, productData);
        console.log('✅ Product updated in database:', result);
      } else {
        const result = await addProduct(productData);
        console.log('✅ Product created in database:', result);
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
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
        return <UserManagement />;
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
        <div className="admxx-sidebar-header">🌿 Vedayura Admin</div>

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
          </nav>

          <div className="admxx-nav-system">
            <button className="admxx-nav-item"><Settings size={20} /> <span>Settings</span></button>
            <button onClick={handleLogout} className="admxx-nav-item admxx-logout"><LogOut size={20} /> <span>Logout</span></button>
          </div>
        </div>
      </aside>

      <main className="admxx-main">
        <header className="admxx-topbar">
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

      {/* Mobile Bottom Navigation */}
      <div className="admxx-mobile-nav">
        <button
          className={activeTab === 'dashboard' ? 'admxx-active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <Grid />
          <span>Home</span>
        </button>
        <button
          className={activeTab === 'inventory' ? 'admxx-active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          <Package />
          <span>Items</span>
        </button>
        <button
          className={activeTab === 'orders' ? 'admxx-active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingCart />
          <span>Orders</span>
        </button>

        <button
  className={activeTab === 'stock' ? 'admxx-active' : ''}
  onClick={() => setActiveTab('stock')}
>
  <Package />
  <span>Stock</span>
</button>

        <button
          className={activeTab === 'users' ? 'admxx-active' : ''}
          onClick={() => setActiveTab('users')}
        >
          <Users />
          <span>Users</span>
        </button>
        <button
          className={activeTab === 'refunds' ? 'admxx-active' : ''}
          onClick={() => setActiveTab('refunds')}
        >
          <RotateCcw />
          <span>Refunds</span>
        </button>
        <button className="admxx-mobile-logout" onClick={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// ====== SUB COMPONENTS ======

const DashboardHome = ({ products }) => (
  <div className="admxx-section">
    <h2>Dashboard</h2>
    <p>Total Products: {products.length}</p>
  </div>
);

const Inventory = ({ products, searchQuery, onEdit, onDelete, onAdd, onView }) => {
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    );
  });

  return (
    <div className="admxx-section">
      <div className="admxx-section-header">
        <h2>Inventory</h2>
        <button onClick={onAdd}><Plus size={16} /> Add</button>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="admxx-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => onView(p)} title="View"><Eye size={16} /></button>
                  <button onClick={() => onEdit(p)} title="Edit"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(p.id)} title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Orders = () => (
  <div className="admxx-section">
    <h2>Orders</h2>
    <p>Orders module placeholder</p>
  </div>
);

// ====== USER MANAGEMENT COMPONENT ======
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) {
      return;
    }

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
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
    }
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

  return (
    <div className="admxx-section">
      <div className="admxx-section-header">
        <h2>Users ({users.length})</h2>
      </div>

      {/* Search */}
      <div className="admxx-user-search">
        <div className="admxx-search" style={{ maxWidth: '350px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="admxx-search-clear" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="admxx-user-stats">
        <div className="admxx-user-stat-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <strong>{users.filter((u) => u.role === 'USER').length}</strong> Customers
        </div>
        <div className="admxx-user-stat-card" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
          <strong>{users.filter((u) => u.role === 'ADMIN').length}</strong> Admins
        </div>
        <div className="admxx-user-stat-card" style={{ background: '#ede9fe', border: '1px solid #c4b5fd' }}>
          <strong>{users.length}</strong> Total
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <p className="admxx-no-data">No users found.</p>
      ) : (
        <table className="admxx-table admxx-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Cart</th>
              <th>Wishlist</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="admxx-user-cell">
                    <div
                      className="admxx-user-cell-avatar"
                      style={{ background: u.role === 'ADMIN' ? '#fde68a' : '#bbf7d0' }}
                    >
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="admxx-user-cell-info">
                      <span className="admxx-user-cell-name">{u.name}</span>
                      <span className="admxx-user-cell-email">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td>
                  <span className={`admxx-role-badge ${u.role === 'ADMIN' ? 'admin' : 'user'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{u.cartItemCount || 0}</td>
                <td>{u.wishlistItemCount || 0}</td>
                <td>{u._count?.orders || 0}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>
                  <button onClick={() => handleViewUser(u)} title="View"><Eye size={16} /></button>
                  {u.role !== 'ADMIN' && (
                    <button onClick={() => handleDeleteUser(u.id, u.name)} title="Delete"><Trash2 size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

            {/* Cart Items */}
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

                {/* Wishlist Items */}
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

                {/* Orders */}
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

                {/* Reviews */}
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

                {/* Addresses */}
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

                {/* Empty state */}
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

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    try {
      const data = await getAllRefunds();
      if (data.success) setRefunds(data.refunds);
    } catch {
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admxx-section">
      <h2>Refunds</h2>
      {loading
        ? 'Loading...'
        : refunds.length === 0
        ? 'No refunds'
        : refunds.map((r) => (
            <div key={r.id}>
              {r.orderId} - {r.status}
            </div>
          ))}
    </div>
  );
};

const Finance = () => (
  <div className="admxx-section">
    <h2>Finance</h2>
    <p>Finance dashboard placeholder</p>
  </div>
);

export default Admin;