import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    LogOut, Grid, Package, ShoppingCart,
    DollarSign, TrendingUp, AlertCircle, TrendingDown,
    Users, Truck, FileText, Settings, Search, Bell,
    Plus, Trash2, Edit2, X, Check, Eye
} from 'lucide-react';
import './Admin.css';

// NavItem Component moved outside to prevent re-creation on render
const NavItem = ({ tab, activeTab, setActiveTab, icon: Icon, label }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`admin-nav-item ${activeTab === tab ? 'active' : ''}`}
    >
        <Icon size={20} />
        <span>{label}</span>
        {activeTab === tab && <div className="active-indicator"></div>}
    </button>
);

const Admin = () => {
    const { user, logout, products, addProduct, updateProduct, deleteProduct } = useShop();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Safety check for products
    if (!products) {
        return <div className="p-xl text-center">Loading Admin Panel...</div>;
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-xl border rounded-lg shadow-sm bg-white">
                    <h2 className="text-xl font-bold mb-md text-error">Access Restricted</h2>
                    <p className="mb-md text-secondary">You must be an administrator to view this page.</p>
                    <Link to="/login" className="btn btn-primary btn-txt ">Login as Admin</Link>
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
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = {
            id: editingProduct ? editingProduct.id : Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            price: Number(formData.get('price')),
            stock: Number(formData.get('stock')),
            image: formData.get('image') || 'https://picsum.photos/400',
            description: formData.get('description'),
        };

        if (editingProduct) {
            await updateProduct(productData);
        } else {
            await addProduct(productData);
        }
        setIsProductModalOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardHome products={products} />;
            case 'inventory': return (
                <Inventory
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onAdd={handleAddProduct}
                />
            );
            case 'orders': return <Orders />;
            case 'finance': return <Finance />;
            default: return <DashboardHome products={products} />;
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar hidden-mobile">
                <div className="sidebar-header">
                    <div className="admin-brand">
                        <span className="text-2xl">🌿</span>
                        <span className="font-heading font-bold text-xl tracking-tight">Vedayura<span className="text-xs align-top opacity-70">Admin</span></span>
                    </div>
                </div>

                <div className="sidebar-content">
                    <div className="user-mini-profile mb-xl">
                        <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center font-bold text-lg">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-white">{user.name}</p>
                            <p className="text-xs text-white opacity-60">Administrator</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-xs">
                        <p className="text-xs uppercase tracking-wider text-white opacity-40 mb-xs pl-md font-bold">Main Menu</p>
                        <NavItem tab="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={Grid} label="Dashboard" />
                        <NavItem tab="inventory" activeTab={activeTab} setActiveTab={setActiveTab} icon={Package} label="Inventory" />
                        <NavItem tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} icon={ShoppingCart} label="Orders" />
                        <NavItem tab="finance" activeTab={activeTab} setActiveTab={setActiveTab} icon={DollarSign} label="Finance" />
                    </nav>

                    <nav className="flex flex-col gap-xs mt-xl">
                        <p className="text-xs uppercase tracking-wider text-white opacity-40 mb-xs pl-md font-bold">System</p>
                        <button className="admin-nav-item"><Settings size={20} /> <span>Settings</span></button>
                        <button onClick={handleLogout} className="admin-nav-item text-red-300 hover:text-red-100"><LogOut size={20} /> <span>Logout</span></button>
                    </nav>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <div className="admin-mobile-header hidden-desktop">
                <h2 className="font-bold flex items-center gap-sm">🌿 Admin</h2>
                <div className="flex gap-sm">
                    <button onClick={() => setActiveTab('dashboard')} className={`p-sm rounded ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-light'}`}><Grid size={20} /></button>
                    <button onClick={() => setActiveTab('inventory')} className={`p-sm rounded ${activeTab === 'inventory' ? 'bg-primary text-white' : 'bg-light'}`}><Package size={20} /></button>
                    <button onClick={() => setActiveTab('orders')} className={`p-sm rounded ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-light'}`}><ShoppingCart size={20} /></button>
                    <button onClick={() => setActiveTab('finance')} className={`p-sm rounded ${activeTab === 'finance' ? 'bg-primary text-white' : 'bg-light'}`}><DollarSign size={20} /></button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-topbar sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-lg py-md flex justify-end items-center gap-lg">
                    <div className="search-bar-mini flex items-center gap-sm bg-light px-md py-xs rounded-full border border-transparent focus-within:border-primary transition-all">
                        <Search size={16} className="text-secondary" />
                        <input type="text" placeholder="Search..." className="bg-transparent border-none text-sm focus:outline-none w-48" />
                    </div>
                    <button className="relative text-secondary hover:text-primary transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </header>

                <div className="admin-content-wrapper p-lg">
                    {renderContent()}
                </div>
            </main>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-xl shadow-2xl p-xl w-full max-w-lg m-md border overflow-hidden animate-fade-in">
                        <div className="flex justify-between items-center mb-lg border-b pb-md">
                            <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-secondary hover:text-dark p-xs rounded hover:bg-light"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="space-y-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase mb-xs">Name</label>
                                    <input name="name" defaultValue={editingProduct?.name} required className="w-full p-sm border rounded focus:border-primary outline-none" placeholder="Product Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase mb-xs">Category</label>
                                    <select name="category" defaultValue={editingProduct?.category || 'Skincare'} className="w-full p-sm border rounded focus:border-primary outline-none">
                                        <option value="Skincare">Skincare</option>
                                        <option value="Haircare">Haircare</option>
                                        <option value="Ayurvedic Tablets">Ayurvedic Tablets</option>
                                        <option value="Wellness Oils">Wellness Oils</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase mb-xs">Price (₹)</label>
                                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full p-sm border rounded focus:border-primary outline-none" min="0" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase mb-xs">Stock</label>
                                    <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full p-sm border rounded focus:border-primary outline-none" min="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase mb-xs">Image URL</label>
                                <input name="image" defaultValue={editingProduct?.image} className="w-full p-sm border rounded focus:border-primary outline-none" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase mb-xs">Description</label>
                                <textarea name="description" defaultValue={editingProduct?.description} rows="3" className="w-full p-sm border rounded focus:border-primary outline-none" ></textarea>
                            </div>
                            <div className="flex justify-end gap-sm pt-md">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary btn-txt">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- Sub Components --- */

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
    <div className="stat-card bg-white p-lg rounded-xl border border-transparent hover:border-light shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-sm">
            <div className={`p-sm rounded-lg ${colorClass} bg-opacity-10 text-${colorClass.split('-')[1]}-600`}>
                <Icon size={24} />
            </div>
            {trend && <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trend > 0 ? '+' : ''}{trend}%</span>}
        </div>
        <div>
            <p className="text-secondary text-sm font-medium mb-xs">{title}</p>
            <h3 className="text-2xl font-bold text-dark">{value}</h3>
            {subtext && <p className="text-xs text-secondary mt-xs flex items-center gap-xs">{subtext}</p>}
        </div>
    </div>
);

const DashboardHome = ({ products }) => (
    <div className="animate-fade-in space-y-lg">
        <div>
            <h2 className="text-2xl font-bold text-dark mb-sm">Dashboard Overview</h2>
            <p className="text-secondary">Welcome back, here's what's happening with your store today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
            <StatCard title="Total Revenue" value="₹8,45,000" icon={Users} colorClass="bg-emerald-500 text-emerald-600" trend={12} />
            <StatCard title="Total Orders" value="1,245" icon={ShoppingCart} colorClass="bg-blue-500 text-blue-600" trend={8} />
            <StatCard title="Total Products" value={products.length} icon={Package} colorClass="bg-purple-500 text-purple-600" subtext={`${products.filter(p => p.stock < 20).length} Low Stock alert`} />
            <StatCard title="Active Users" value="8,432" icon={Users} colorClass="bg-orange-500 text-orange-600" trend={-2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-2 bg-white p-xl rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-bold text-lg">Sales Analytics (Weekly)</h3>
                </div>
                {/* CSS Based Bar Chart */}
                <div className="h-64 flex items-end justify-between gap-md px-md border-b border-dashed pb-4">
                    {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                        <div key={i} className="group relative flex-1 bg-primary opacity-20 hover:opacity-100 transition-all rounded-t-sm" style={{ height: `${h}%` }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">₹{h}k Revenue</div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-secondary mt-md uppercase font-bold tracking-wider">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>

            <div className="bg-white p-xl rounded-xl border shadow-sm">
                <h3 className="font-bold text-lg mb-lg">Recent Operations</h3>
                <div className="space-y-md relative">
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    <div className="relative pl-lg">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white bg-green-500 shadow-sm"></div>
                        <p className="text-sm font-bold text-dark">Order #1024 Delivered</p>
                        <p className="text-xs text-secondary">2 hours ago</p>
                    </div>
                    <div className="relative pl-lg">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm"></div>
                        <p className="text-sm font-bold text-dark">New Stock Added</p>
                        <p className="text-xs text-secondary">Ashwagandha (50 units)</p>
                    </div>
                    <div className="relative pl-lg">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white bg-yellow-500 shadow-sm"></div>
                        <p className="text-sm font-bold text-dark">New User Registered</p>
                        <p className="text-xs text-secondary">Rahul Sharma</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Inventory = ({ products, onEdit, onDelete, onAdd }) => (
    <div className="animate-fade-in bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-lg border-b flex justify-between items-center bg-gray-50/50">
            <div>
                <h2 className="text-lg font-bold">Inventory Management</h2>
                <p className="text-xs text-secondary">Manage {products.length} products</p>
            </div>
            <div className="flex gap-sm">
                <button onClick={onAdd} className="btn btn-primary btn-txt text-sm gap-xs"><Plus size={16} /> Add Product</button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-secondary text-xs uppercase tracking-wider font-semibold">
                    <tr>
                        <th className="px-lg py-md">Product</th>
                        <th className="px-lg py-md">Category</th>
                        <th className="px-lg py-md">Price</th>
                        <th className="px-lg py-md">Stock</th>
                        <th className="px-lg py-md">Status</th>
                        <th className="px-lg py-md text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-lg py-md">
                                <div className="flex items-center gap-md">
                                    <img src={p.image} alt="" className="w-10 h-10 rounded-md object-cover border" />
                                    <div>
                                        <p className="font-medium text-sm text-dark">{p.name}</p>
                                        <p className="text-xs text-secondary">ID: #{p.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-lg py-md text-sm text-secondary">{p.category}</td>
                            <td className="px-lg py-md text-sm font-medium">₹{p.price}</td>
                            <td className="px-lg py-md text-sm font-mono">{p.stock}</td>
                            <td className="px-lg py-md">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock < 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {p.stock < 30 ? 'Low Stock' : 'In Stock'}
                                </span>
                            </td>
                            <td className="px-lg py-md text-right">
                                <div className="flex items-center justify-end gap-xs">
                                    <button onClick={() => onEdit(p)} className="text-secondary hover:text-primary p-sm rounded hover:bg-light" title="Edit"><Edit2 size={16} /></button>
                                    <button onClick={() => onDelete(p.id)} className="text-secondary hover:text-red-600 p-sm rounded hover:bg-light" title="Delete"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const Orders = () => {
    const [orders, setOrders] = useState([
        { id: 1, status: 'Processing', paid: true },
        { id: 2, status: 'Shipped', paid: true },
        { id: 3, status: 'Processing', paid: true }
    ]);

    const handleShip = (id) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: 'Shipped' } : o));
        alert(`Order #AYU102${id} marked as Shipped!`);
    };

    const handleInvoice = (id) => {
        alert(`Generating Invoice for Order #AYU102${id}... (Download would start here)`);
    };

    const handleTrack = (id) => {
        alert(`Tracking Order #AYU102${id}\nCurrent Location: New Delhi Distribution Hub\nExpected Delivery: Tomorrow`);
    };

    return (
        <div className="animate-fade-in space-y-lg">
            <div className="flex justify-between items-center mb-md">
                <h2 className="text-xl font-bold">Order Management</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button className="px-md py-xs rounded-md bg-white shadow-sm text-sm font-medium text-primary">All</button>
                    <button className="px-md py-xs rounded-md text-sm font-medium text-secondary hover:text-dark">Processing</button>
                    <button className="px-md py-xs rounded-md text-sm font-medium text-secondary hover:text-dark">Shipped</button>
                </div>
            </div>

            <div className="space-y-md">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl border shadow-sm p-lg hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-md">
                            <div className="flex gap-md items-center">
                                <div className={`p-md rounded-full ${order.status === 'Shipped' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-dark text-lg group-hover:text-primary transition-colors">Order #AYU102{order.id}</h4>
                                    <p className="text-sm text-secondary">Placed on Jan {10 + order.id}, 2026 by <span className="text-dark font-medium">Customer {order.id}</span></p>
                                </div>
                            </div>
                            <span className={`px-md py-xs rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="pl-[60px] grid grid-cols-1 md:grid-cols-3 gap-md border-t pt-md mt-sm">
                            <div>
                                <p className="text-xs text-secondary uppercase font-bold mb-xs">Amount</p>
                                <p className="font-mono text-dark font-medium">₹2,499.00</p>
                            </div>
                            <div>
                                <p className="text-xs text-secondary uppercase font-bold mb-xs">Payment</p>
                                <div className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-green-500"></div> <span className="text-sm">Paid (Razorpay)</span></div>
                            </div>
                            <div className="flex justify-end gap-sm items-center">
                                <button onClick={() => handleInvoice(order.id)} className="btn btn-outline btn-sm text-xs">Invoice</button>
                                {order.status === 'Shipped' ? (
                                    <button onClick={() => handleTrack(order.id)} className="btn btn-outline text-blue-600 border-blue-200 hover:bg-blue-50 btn-sm text-xs gap-xs flex items-center"><Truck size={14} /> Track Shipment</button>
                                ) : (
                                    <button onClick={() => handleShip(order.id)} className="btn btn-primary btn-txt btn-sm text-xs">Ship Now</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Finance = () => (
    <div className="animate-fade-in">
        <div className="mb-lg">
            <h2 className="text-2xl font-bold">Financial Performance</h2>
            <p className="text-secondary">Track your income, expenses, and overall profitability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-xl rounded-xl border border-emerald-100 flex flex-col justify-between h-48">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-emerald-700 font-medium mb-xs">Total Income</p>
                        <h2 className="text-4xl font-bold text-emerald-900">₹8.45L</h2>
                    </div>
                    <div className="p-sm bg-white rounded-lg shadow-sm text-emerald-600"><TrendingUp /></div>
                </div>
                <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[70%]"></div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-xl rounded-xl border border-rose-100 flex flex-col justify-between h-48">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-rose-700 font-medium mb-xs">Total Expenses</p>
                        <h2 className="text-4xl font-bold text-rose-900">₹3.20L</h2>
                    </div>
                    <div className="p-sm bg-white rounded-lg shadow-sm text-rose-600"><TrendingDown /></div>
                </div>
                <div className="w-full bg-rose-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-600 h-full w-[40%]"></div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-xl">
            <h3 className="font-bold text-lg mb-lg">Expense Breakdown</h3>
            <div className="space-y-lg">
                <div className="flex items-center group">
                    <div className="w-full">
                        <div className="flex justify-between mb-xs">
                            <div className="flex items-center gap-sm">
                                <div className="p-xs bg-blue-100 text-blue-600 rounded"><Truck size={14} /></div>
                                <span className="font-medium text-sm">Logistics</span>
                            </div>
                            <span className="text-sm font-bold">₹45,000</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[35%]"></div></div>
                    </div>
                </div>

                <div className="flex items-center group">
                    <div className="w-full">
                        <div className="flex justify-between mb-xs">
                            <div className="flex items-center gap-sm">
                                <div className="p-xs bg-purple-100 text-purple-600 rounded"><Users size={14} /></div>
                                <span className="font-medium text-sm">Marketing</span>
                            </div>
                            <span className="text-sm font-bold">₹1,10,000</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[65%]"></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Admin;
