import React, { useState, useEffect } from 'react';
import {
  Package, TrendingUp, TrendingDown, AlertTriangle,
  Plus, Minus, Search, X, Filter, Download,
  ArrowUpCircle, ArrowDownCircle, RotateCcw, Eye
} from 'lucide-react';
import api from '../api';

const REASON_OPTIONS = {
  IN: [
    { value: 'PO_RECEIVED', label: 'Purchase Order Received' },
    { value: 'RETURN', label: 'Customer Return' },
    { value: 'MANUAL', label: 'Manual Adjustment' },
  ],
  OUT: [
    { value: 'ORDER', label: 'Customer Order' },
    { value: 'DAMAGED', label: 'Damaged / Expired' },
    { value: 'MANUAL', label: 'Manual Adjustment' },
  ],
};

const LOW_STOCK_THRESHOLD = 20;

const StockManagement = ({ products = [] }) => {
  const [activeView, setActiveView] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustType, setAdjustType] = useState('IN');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [viewingHistory, setViewingHistory] = useState(null);
  const [saving, setSaving] = useState(false);

  // ====== FETCH TRANSACTIONS FROM BACKEND ======
  const loadTransactions = async (productId = null) => {
    setLoadingTransactions(true);
    try {
      const url = productId
        ? `/api/stock/transactions?productId=${productId}`
        : '/api/stock/transactions';
      const res = await api.get(url);
      if (res.data?.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load stock transactions:', err);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (viewingHistory) {
      loadTransactions(viewingHistory.id);
    } else {
      loadTransactions();
    }
  }, [viewingHistory]);

  // ====== CALCULATED STATS ======
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTransactions = transactions.filter(
    (t) => (t.date || t.createdAt || '').slice(0, 10) === todayStr
  );
  const todayStockIn = todayTransactions
    .filter((t) => t.type === 'IN')
    .reduce((sum, t) => sum + t.quantity, 0);
  const todayStockOut = todayTransactions
    .filter((t) => t.type === 'OUT')
    .reduce((sum, t) => sum + t.quantity, 0);

  // ====== FILTERED TRANSACTIONS ======
  const filteredTransactions = transactions.filter((t) => {
    const name = t.productName || t.product?.name || '';
    const ref = t.reference || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // ====== HANDLE STOCK ADJUSTMENT ======
  const handleStockAdjust = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);
    const productId = Number(formData.get('productId'));
    const quantity = Number(formData.get('quantity'));
    const reason = formData.get('reason');
    const reference = formData.get('reference') || '';

    if (!productId || !quantity) {
      setSaving(false);
      return;
    }

    try {
      const res = await api.post('/api/stock/adjust', {
        productId,
        type: adjustType,
        quantity,
        reason,
        reference,
      });

      if (res.data?.success) {
        setIsAdjustModalOpen(false);
        loadTransactions(viewingHistory?.id || null);
      } else {
        alert(res.data?.message || 'Failed to adjust stock');
      }
    } catch (err) {
      console.error('Stock adjustment failed:', err);
      alert('Failed to adjust stock. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const openStockIn = () => {
    setAdjustType('IN');
    setIsAdjustModalOpen(true);
  };

  const openStockOut = () => {
    setAdjustType('OUT');
    setIsAdjustModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReasonLabel = (reason) => {
    const labels = {
      PO_RECEIVED: 'PO Received',
      RETURN: 'Customer Return',
      ORDER: 'Customer Order',
      DAMAGED: 'Damaged / Expired',
      MANUAL: 'Manual Adjustment',
    };
    return labels[reason] || reason;
  };

  return (
    <div className="admxx-section">
      {/* Header */}
      <div className="admxx-section-header">
        <h2>
          {viewingHistory ? (
            <>
              <button
                onClick={() => setViewingHistory(null)}
                className="stk-back-btn"
                title="Back to Stock Overview"
              >
                ← Back
              </button>
              Stock History: {viewingHistory.name}
            </>
          ) : (
            'Stock Management'
          )}
        </h2>

        <div className="stk-header-actions">
          <button className="stk-btn stk-btn-in" onClick={openStockIn}>
            <ArrowDownCircle size={16} /> Stock In
          </button>
          <button className="stk-btn stk-btn-out" onClick={openStockOut}>
            <ArrowUpCircle size={16} /> Stock Out
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {!viewingHistory && (
        <div className="stk-stats">
          <div className="stk-stat-card stk-stat-total">
            <div className="stk-stat-icon"><Package size={20} /></div>
            <div>
              <span className="stk-stat-value">{products.length}</span>
              <span className="stk-stat-label">Total Products</span>
            </div>
          </div>

          <div className="stk-stat-card stk-stat-in">
            <div className="stk-stat-icon"><TrendingUp size={20} /></div>
            <div>
              <span className="stk-stat-value">{todayStockIn}</span>
              <span className="stk-stat-label">Stock In Today</span>
            </div>
          </div>

          <div className="stk-stat-card stk-stat-out">
            <div className="stk-stat-icon"><TrendingDown size={20} /></div>
            <div>
              <span className="stk-stat-value">{todayStockOut}</span>
              <span className="stk-stat-label">Stock Out Today</span>
            </div>
          </div>

          <div className="stk-stat-card stk-stat-low">
            <div className="stk-stat-icon"><AlertTriangle size={20} /></div>
            <div>
              <span className="stk-stat-value">{lowStockProducts.length}</span>
              <span className="stk-stat-label">Low Stock Items</span>
            </div>
          </div>
        </div>
      )}

      {/* View Tabs */}
      {!viewingHistory && (
        <div className="stk-tabs">
          <button
            className={`stk-tab ${activeView === 'overview' ? 'stk-tab-active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </button>
          <button
            className={`stk-tab ${activeView === 'history' ? 'stk-tab-active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            Transaction History
          </button>
          <button
            className={`stk-tab ${activeView === 'alerts' ? 'stk-tab-active' : ''}`}
            onClick={() => setActiveView('alerts')}
          >
            Alerts {lowStockProducts.length + outOfStockProducts.length > 0 && (
              <span className="stk-tab-badge">{lowStockProducts.length + outOfStockProducts.length}</span>
            )}
          </button>
        </div>
      )}

      {/* ====== OVERVIEW VIEW ====== */}
      {activeView === 'overview' && !viewingHistory && (
        <div className="stk-overview">
          <h3 className="stk-subtitle">Current Stock Levels</h3>

          <div className="stk-search-bar">
            <div className="admxx-search" style={{ maxWidth: '350px' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="admxx-search-clear" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>
          </div>

          <table className="admxx-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) =>
                  p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={p.image || p.imageUrls?.[0] || 'https://picsum.photos/36'}
                          alt={p.name}
                          style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        {p.name}
                      </div>
                    </td>
                    <td>{p.category || '-'}</td>
                    <td><strong>{p.stock}</strong></td>
                    <td>
                      {p.stock === 0 ? (
                        <span className="stk-badge stk-badge-danger">Out of Stock</span>
                      ) : p.stock <= LOW_STOCK_THRESHOLD ? (
                        <span className="stk-badge stk-badge-warning">Low Stock</span>
                      ) : (
                        <span className="stk-badge stk-badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setViewingHistory(p)}
                        title="View Stock History"
                        className="stk-action-btn"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ====== TRANSACTION HISTORY VIEW ====== */}
      {(activeView === 'history' || viewingHistory) && (
        <div className="stk-history">
          {!viewingHistory && <h3 className="stk-subtitle">All Stock Transactions</h3>}

          <div className="stk-history-filters">
            <div className="admxx-search" style={{ maxWidth: '300px' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by product or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="admxx-search-clear" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>

            <div className="stk-filter-group">
              <button
                className={`stk-filter-btn ${filterType === 'ALL' ? 'stk-filter-active' : ''}`}
                onClick={() => setFilterType('ALL')}
              >
                All
              </button>
              <button
                className={`stk-filter-btn stk-filter-in ${filterType === 'IN' ? 'stk-filter-active' : ''}`}
                onClick={() => setFilterType('IN')}
              >
                Stock In
              </button>
              <button
                className={`stk-filter-btn stk-filter-out ${filterType === 'OUT' ? 'stk-filter-active' : ''}`}
                onClick={() => setFilterType('OUT')}
              >
                Stock Out
              </button>
            </div>
          </div>

          {loadingTransactions ? (
            <p className="stk-no-data">Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="stk-no-data">No transactions found.</p>
          ) : (
            <table className="admxx-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Reason</th>
                  <th>Reference</th>
                  <th>Stock After</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {formatDate(t.date || t.createdAt)}
                    </td>
                    <td>{t.productName || t.product?.name || '-'}</td>
                    <td>
                      <span className={`stk-type-badge ${t.type === 'IN' ? 'stk-type-in' : 'stk-type-out'}`}>
                        {t.type === 'IN' ? '↓ IN' : '↑ OUT'}
                      </span>
                    </td>
                    <td><strong>{t.quantity}</strong></td>
                    <td>{getReasonLabel(t.reason)}</td>
                    <td style={{ fontSize: '13px' }}>{t.reference || '-'}</td>
                    <td>{t.stockAfter ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ====== ALERTS VIEW ====== */}
      {activeView === 'alerts' && !viewingHistory && (
        <div className="stk-alerts">
          {outOfStockProducts.length > 0 && (
            <>
              <h3 className="stk-subtitle stk-subtitle-danger">🔴 Out of Stock ({outOfStockProducts.length})</h3>
              <div className="stk-alert-cards">
                {outOfStockProducts.map((p) => (
                  <div key={p.id} className="stk-alert-card stk-alert-danger">
                    <div className="stk-alert-info">
                      <img
                        src={p.image || p.imageUrls?.[0] || 'https://picsum.photos/40'}
                        alt={p.name}
                        className="stk-alert-img"
                      />
                      <div>
                        <strong>{p.name}</strong>
                        <span className="stk-alert-category">{p.category}</span>
                      </div>
                    </div>
                    <div className="stk-alert-actions">
                      <span className="stk-badge stk-badge-danger">0 units</span>
                      <button className="stk-btn stk-btn-in stk-btn-sm" onClick={openStockIn}>
                        <Plus size={14} /> Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {lowStockProducts.length > 0 && (
            <>
              <h3 className="stk-subtitle stk-subtitle-warning">🟡 Low Stock ({lowStockProducts.length})</h3>
              <div className="stk-alert-cards">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="stk-alert-card stk-alert-warning">
                    <div className="stk-alert-info">
                      <img
                        src={p.image || p.imageUrls?.[0] || 'https://picsum.photos/40'}
                        alt={p.name}
                        className="stk-alert-img"
                      />
                      <div>
                        <strong>{p.name}</strong>
                        <span className="stk-alert-category">{p.category}</span>
                      </div>
                    </div>
                    <div className="stk-alert-actions">
                      <span className="stk-badge stk-badge-warning">{p.stock} units</span>
                      <button className="stk-btn stk-btn-in stk-btn-sm" onClick={openStockIn}>
                        <Plus size={14} /> Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
            <div className="stk-all-good">
              <span style={{ fontSize: '48px' }}>✅</span>
              <h3>All stock levels are healthy!</h3>
              <p>No products below the threshold of {LOW_STOCK_THRESHOLD} units.</p>
            </div>
          )}
        </div>
      )}

      {/* ====== STOCK ADJUST MODAL ====== */}
      {isAdjustModalOpen && (
        <div className="admxx-modal-backdrop">
          <div className="admxx-modal">
            <div className="admxx-modal-header">
              <h3>
                {adjustType === 'IN' ? (
                  <><ArrowDownCircle size={20} style={{ color: '#16a34a' }} /> Stock In</>
                ) : (
                  <><ArrowUpCircle size={20} style={{ color: '#dc2626' }} /> Stock Out</>
                )}
              </h3>
              <button onClick={() => setIsAdjustModalOpen(false)}><X size={20} /></button>
            </div>

            <div className="stk-toggle">
              <button
                className={`stk-toggle-btn ${adjustType === 'IN' ? 'stk-toggle-in' : ''}`}
                onClick={() => setAdjustType('IN')}
              >
                Stock In
              </button>
              <button
                className={`stk-toggle-btn ${adjustType === 'OUT' ? 'stk-toggle-out' : ''}`}
                onClick={() => setAdjustType('OUT')}
              >
                Stock Out
              </button>
            </div>

            <form onSubmit={handleStockAdjust} className="admxx-form">
              <label className="stk-form-label">Product</label>
              <select name="productId" required>
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current: {p.stock})
                  </option>
                ))}
              </select>

              <label className="stk-form-label">Quantity</label>
              <input name="quantity" type="number" min="1" placeholder="Enter quantity" required />

              <label className="stk-form-label">Reason</label>
              <select name="reason" required>
                <option value="">Select Reason</option>
                {REASON_OPTIONS[adjustType].map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <label className="stk-form-label">Reference (Optional)</label>
              <input name="reference" placeholder="e.g. PO-003 or ORD-1050" />

              <div className="admxx-form-actions">
                <button type="button" onClick={() => setIsAdjustModalOpen(false)}>Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
                  className={adjustType === 'IN' ? 'stk-submit-in' : 'stk-submit-out'}
                >
                  {saving ? 'Saving...' : adjustType === 'IN' ? 'Add Stock' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;