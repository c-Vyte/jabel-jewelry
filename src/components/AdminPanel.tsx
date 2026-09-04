import React, { useState, useEffect, useMemo } from 'react';
import { Product, Order, OrderStatus, OrderItem } from '../types';
import { products as initialProducts } from '../data';
import { Plus, Trash2, Edit2, Save, X, Camera, Download, Upload, RotateCcw, Package, ShoppingCart, CheckSquare, Square, LayoutDashboard, TrendingUp, DollarSign, Tag, MessageSquare, Mail, Send, RefreshCw, ChevronDown, ChevronUp, Eye, Clock, CheckCircle, Truck, Package as PackageIcon, AlertCircle, Cloud, BarChart2, PieChart, Users, ArrowUpRight, ArrowDownRight, Sparkles, Zap } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import OptimizedImage from './OptimizedImage';
import AnalyticsDashboard from './AnalyticsDashboard';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30', icon: <Clock className="w-3 h-3" />, description: 'Order received, awaiting confirmation' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30', icon: <CheckCircle className="w-3 h-3" />, description: 'Order confirmed, preparing for processing' },
  processing: { label: 'Processing', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30', icon: <RefreshCw className="w-3 h-3 animate-spin" />, description: 'Order being prepared and packaged' },
  shipped: { label: 'Shipped', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30', icon: <Truck className="w-3 h-3" />, description: 'Order shipped, in transit to customer' },
  delivered: { label: 'Delivered', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', icon: <PackageIcon className="w-3 h-3" />, description: 'Order delivered to customer' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 border-red-500/30', icon: <AlertCircle className="w-3 h-3" />, description: 'Order cancelled' }
};

export default function AdminPanel({ products, setProducts }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'analytics'>('overview');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderStatus, setEditOrderStatus] = useState<OrderStatus>('pending');
  const [showOrderDetail, setShowOrderDetail] = useState<Order | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('jabel_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        // Migrate old orders to new format
        const migrated = parsed.map((o: any) => ({
          ...o,
          status: o.status || 'pending',
          statusHistory: o.statusHistory || [{ status: o.status || 'pending', timestamp: o.date }],
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerEmail: o.customerEmail,
          shippingAddress: o.shippingAddress,
          notes: o.notes
        }));
        setOrders(migrated);
      }
    } catch {}
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updated = {
          ...order,
          status: newStatus,
          statusHistory: [...order.statusHistory, { status: newStatus, timestamp: new Date().toISOString() }]
        };
        // Send notifications
        sendWhatsAppNotification(updated);
        sendEmailNotification(updated);
        return updated;
      }
      return order;
    }));
    // Persist to localStorage
    setTimeout(() => {
      try {
        const current = JSON.parse(localStorage.getItem('jabel_orders') || '[]');
        const updated = current.map((o: any) => o.id === orderId ? { ...o, status: newStatus, statusHistory: [...(o.statusHistory || []), { status: newStatus, timestamp: new Date().toISOString() }] } : o);
        localStorage.setItem('jabel_orders', JSON.stringify(updated));
      } catch {}
    }, 0);
  };

  const sendWhatsAppNotification = (order: Order) => {
    const statusConfig = STATUS_CONFIG[order.status];
    let message = `*Order Update - #${order.id}*\n\n`;
    message += `Status: ${statusConfig.label}\n`;
    message += `${statusConfig.description}\n\n`;
    message += `Customer: ${order.customerName || 'N/A'}\n`;
    if (order.customerPhone) message += `Phone: ${order.customerPhone}\n`;
    if (order.customerEmail) message += `Email: ${order.customerEmail}\n`;
    message += `\nItems:\n`;
    order.items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (GH₵${item.price.toLocaleString()})\n`;
    });
    message += `\n*Total:* GH₵${order.total.toLocaleString()}\n`;
    if (order.shippingAddress) message += `\nShipping to: ${order.shippingAddress}\n`;
    message += `\nUpdated: ${new Date().toLocaleString()}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/233241129815?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendEmailNotification = (order: Order) => {
    const statusConfig = STATUS_CONFIG[order.status];
    const subject = encodeURIComponent(`Order Update - #${order.id} - ${statusConfig.label}`);
    const body = encodeURIComponent(
      `Order #${order.id}\n` +
      `Status: ${statusConfig.label}\n` +
      `${statusConfig.description}\n` +
      `Date: ${new Date(order.date).toLocaleString()}\n` +
      `Updated: ${new Date().toLocaleString()}\n` +
      `Customer: ${order.customerName || 'N/A'}\n` +
      `Phone: ${order.customerPhone || 'N/A'}\n` +
      `Email: ${order.customerEmail || 'N/A'}\n` +
      `Address: ${order.shippingAddress || 'N/A'}\n\n` +
      `Items:\n` +
      order.items.map(i => `- ${i.quantity}x ${i.name} (GH₵${i.price.toLocaleString()})`).join('\n') +
      `\n\nTotal: GH₵${order.total.toLocaleString()}\n\n` +
      `Status History:\n` +
      order.statusHistory.map(h => `- ${h.status.toUpperCase()}: ${new Date(h.timestamp).toLocaleString()}`).join('\n')
    );
    window.open(`mailto:${order.customerEmail || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleViewOrder = (order: Order) => {
    setShowOrderDetail(order);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setEditOrderStatus(order.status);
  };

  const handleSaveOrderStatus = () => {
    if (editingOrderId) {
      updateOrderStatus(editingOrderId, editOrderStatus);
      setEditingOrderId(null);
    }
  };

  const deleteOrder = (id: string) => {
    if (confirm('Are you sure you want to delete this order record?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
      try {
        const current = JSON.parse(localStorage.getItem('jabel_orders') || '[]');
        localStorage.setItem('jabel_orders', JSON.stringify(current.filter((o: any) => o.id !== id)));
      } catch {}
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
    setActiveTab('inventory');
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.price || !editForm.image) {
      alert("Please fill in the required fields (Name, Price, Image).");
      return;
    }

    if (editingId && editingId !== 'new') {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...editForm } as Product : p));
      setEditingId(null);
    } else {
      const newProduct = {
        ...editForm,
        id: Math.random().toString(36).substr(2, 9),
      } as Product;
      setProducts([newProduct, ...products]);
      setEditingId(null);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!editForm.name || !editForm.category) {
      alert("Please fill in Product Name and Category first.");
      return;
    }
    if (!editForm.description?.trim()) {
      alert("Please enter a basic description first to enhance.");
      return;
    }

    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editForm.description,
          productName: editForm.name,
          category: editForm.category
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enhance description');
      
      setEditForm(prev => ({ ...prev, description: data.enhanced }));
    } catch (err: any) {
      alert(`Enhancement failed: ${err.message}`);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      setProducts(products.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkToggleNew = () => {
    setProducts(products.map(p => {
      if (selectedIds.includes(p.id)) {
        return { ...p, isNew: !p.isNew };
      }
      return p;
    }));
    setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAdminProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAdminProducts.map(p => p.id));
    }
  };

  const handleAddNew = () => {
    setEditingId('new');
    setEditForm({
      name: '',
      price: 0,
      category: 'Necklaces',
      image: '',
      description: ''
    });
    setActiveTab('inventory');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jabel_inventory_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            setProducts(imported);
            alert("Inventory successfully imported!");
          } else {
            alert("Invalid JSON format for inventory.");
          }
        } catch {
          alert("Failed to parse JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset inventory to default catalog items?")) {
      setProducts(initialProducts);
      setSelectedIds([]);
    }
  };

  const totalValue = products.reduce((acc, p) => acc + p.price, 0);
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;

  const categoryBreakdown = ['Rings', 'Necklaces', 'Watches', 'Accessories', 'Perfumes'].map(cat => {
    const count = products.filter(p => p.category === cat).length;
    const valuation = products.filter(p => p.category === cat).reduce((sum, p) => sum + p.price, 0);
    return { category: cat, count, valuation };
  });

  const filteredAdminProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(adminSearch.toLowerCase()) || p.category.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesCat = adminCategoryFilter === 'All' || p.category === adminCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-theme-border pb-4 gap-4 transition-colors">
        <div>
          <h1 className="text-3xl font-['Playfair_Display'] text-theme-text transition-colors">Admin Dashboard</h1>
          <p className="text-theme-muted text-sm mt-1 transition-colors">Comprehensive store metrics, inventory management, AI tagging, and customer orders in GH₵</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExportJson}
            className="flex items-center gap-1.5 bg-theme-surface border border-theme-border text-theme-text px-3 py-2 text-xs font-medium uppercase tracking-wider hover:bg-theme-border/30 transition-colors cursor-pointer"
            title="Export Inventory JSON"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <label className="flex items-center gap-1.5 bg-theme-surface border border-theme-border text-theme-text px-3 py-2 text-xs font-medium uppercase tracking-wider hover:bg-theme-border/30 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Import
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button 
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 bg-theme-surface border border-theme-border text-theme-text px-3 py-2 text-xs font-medium uppercase tracking-wider hover:bg-theme-border/30 transition-colors cursor-pointer"
            title="Reset to Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-theme-accent text-theme-accent-fg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-theme-border mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-theme-accent text-theme-text' 
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics' 
              ? 'border-theme-accent text-theme-text' 
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics Dashboard
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory' 
              ? 'border-theme-accent text-theme-text' 
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          <Package className="w-4 h-4" /> Inventory Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'orders' 
              ? 'border-theme-accent text-theme-text' 
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          <ShoppingCart className="w-4 h-4" /> Customer Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-theme-surface border border-theme-border p-6 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-theme-muted">Total Revenue</p>
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-3xl font-['Playfair_Display'] text-theme-text">GH₵{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-theme-muted mt-2">From {orders.length} completed order requests</p>
            </div>

            <div className="bg-theme-surface border border-theme-border p-6 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-theme-muted">Total Products</p>
                <Package className="w-4 h-4 text-theme-accent" />
              </div>
              <p className="text-3xl font-['Playfair_Display'] text-theme-text">{products.length}</p>
              <p className="text-xs text-theme-muted mt-2">Across {categoriesCount} active categories</p>
            </div>

            <div className="bg-theme-surface border border-theme-border p-6 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-theme-muted">Inventory Valuation</p>
                <TrendingUp className="w-4 h-4 text-theme-accent" />
              </div>
              <p className="text-3xl font-['Playfair_Display'] text-theme-text">GH₵{totalValue.toLocaleString()}</p>
              <p className="text-xs text-theme-muted mt-2">Combined retail asset worth</p>
            </div>

            <div className="bg-theme-surface border border-theme-border p-6 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-theme-muted">Customer Orders</p>
                <ShoppingCart className="w-4 h-4 text-theme-accent" />
              </div>
              <p className="text-3xl font-['Playfair_Display'] text-theme-text">{orders.length}</p>
              <p className="text-xs text-theme-muted mt-2">WhatsApp checkout logs</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-theme-surface border border-theme-border p-6 sm:p-8">
            <h3 className="text-lg font-['Playfair_Display'] text-theme-text mb-6 flex items-center gap-2">
              <Tag className="w-4 h-4 text-theme-accent" /> Category Distribution & Valuation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryBreakdown.map(cat => (
                <div key={cat.category} className="bg-theme-bg border border-theme-border p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-theme-text">{cat.category}</h4>
                    <span className="text-xs px-2 py-0.5 bg-theme-border/40 text-theme-text">{cat.count} items</span>
                  </div>
                  <p className="text-lg font-['Playfair_Display'] text-theme-text">GH₵{cat.valuation.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Preview in Overview */}
          <div className="bg-theme-surface border border-theme-border p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-['Playfair_Display'] text-theme-text">Recent Order Summaries</h3>
              <button 
                onClick={() => setActiveTab('orders')} 
                className="text-xs font-medium text-theme-accent hover:underline uppercase tracking-wider cursor-pointer"
              >
                View All Orders &rarr;
              </button>
            </div>
            {orders.length === 0 ? (
              <p className="text-xs text-theme-muted">No orders recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="border border-theme-border p-4 bg-theme-bg flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono text-theme-accent font-semibold mr-3">#{order.id}</span>
                      <span className="text-xs text-theme-text">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                    </div>
                    <span className="text-sm font-semibold text-theme-text">GH₵{order.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input 
              type="text"
              placeholder="Search wares in inventory..."
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
              className="flex-1 bg-theme-surface border border-theme-border px-4 py-2.5 text-sm text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent transition-colors"
            />
            <select 
              value={adminCategoryFilter}
              onChange={e => setAdminCategoryFilter(e.target.value)}
              className="bg-theme-surface border border-theme-border px-4 py-2.5 text-sm text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent transition-colors cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Watches">Watches</option>
              <option value="Rings">Rings</option>
              <option value="Accessories">Accessories</option>
              <option value="Perfumes">Perfumes</option>
              <option value="Earrings">Earrings</option>
            </select>
          </div>

          {/* Select All & Bulk Actions Bar */}
          <div className="flex items-center justify-between bg-theme-surface border border-theme-border px-4 py-3 mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSelectAll}
                className="text-xs font-medium text-theme-text flex items-center gap-2 hover:text-theme-muted transition-colors cursor-pointer"
              >
                {selectedIds.length > 0 && selectedIds.length === filteredAdminProducts.length ? (
                  <CheckSquare className="w-4 h-4 text-theme-accent" />
                ) : (
                  <Square className="w-4 h-4 text-theme-muted" />
                )}
                Select All ({filteredAdminProducts.length})
              </button>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-theme-muted">
                  {selectedIds.length} selected
                </span>
                <button
                  onClick={handleBulkToggleNew}
                  className="px-3 py-1 bg-theme-border/30 border border-theme-border text-theme-text text-xs font-medium uppercase tracking-wider hover:bg-theme-border/50 transition-colors cursor-pointer"
                >
                  Toggle "New" Badge
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium uppercase tracking-wider hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {editingId === 'new' && (
              <div className="bg-theme-surface p-6 border border-theme-border shadow-sm transition-colors">
                <h3 className="text-lg font-medium text-theme-text mb-4 transition-colors">Add New Product</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <input 
                    placeholder="Product Name *" 
                    value={editForm.name || ''} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text transition-colors"
                  />
                  <input 
                    type="number"
                    placeholder="Price (GH₵) *" 
                    value={editForm.price || ''} 
                    onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                    className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text transition-colors"
                  />
                  <select 
                    value={editForm.category || 'Necklaces'} 
                    onChange={e => setEditForm({...editForm, category: e.target.value as any})}
                    className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text transition-colors cursor-pointer"
                  >
                    <option value="Necklaces">Necklaces</option>
                    <option value="Watches">Watches</option>
                    <option value="Rings">Rings</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Perfumes">Perfumes</option>
                    <option value="Earrings">Earrings</option>
                  </select>
                  <div className="w-full sm:col-span-2">
                    <CloudinaryUpload
                      value={editForm.image || ''}
                      onChange={(url) => setEditForm(prev => ({ ...prev, image: url }))}
                      onRemove={() => setEditForm(prev => ({ ...prev, image: '' }))}
                      folder="jabel-products"
                    />
                  </div>

                  <textarea 
                    placeholder="Description (Optional)"
                    value={editForm.description || ''}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text sm:col-span-2 h-24 resize-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleEnhanceDescription}
                    disabled={isEnhancing || !editForm.name || !editForm.category || !editForm.description?.trim()}
                    className="w-full sm:col-span-2 py-2 px-4 bg-purple-500/10 border border-purple-500/30 text-purple-700 rounded-md text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4" />
                    {isEnhancing ? "Enhancing with Grok..." : "✨ Enhance Description with Grok"}
                  </button>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 text-theme-muted hover:text-theme-text px-4 py-2 text-sm transition-colors cursor-pointer">
                    <X className="w-4 h-4"/> Cancel
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1.5 bg-theme-accent text-theme-accent-fg px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
                    <Save className="w-4 h-4"/> Save Product
                  </button>
                </div>
              </div>
            )}

            {filteredAdminProducts.map(product => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <div key={product.id} className={`bg-theme-surface border p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors ${isSelected ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border hover:border-theme-muted/50'}`}>
                  {editingId === product.id ? (
                    <div className="w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <input 
                          value={editForm.name || ''} 
                          onChange={e => setEditForm({...editForm, name: e.target.value})}
                          className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text transition-colors"
                        />
                        <input 
                          type="number"
                          value={editForm.price || ''} 
                          onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                          className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text transition-colors"
                        />
                        <select 
                          value={editForm.category || ''} 
                          onChange={e => setEditForm({...editForm, category: e.target.value as any})}
                          className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text transition-colors cursor-pointer"
                        >
                          <option value="Necklaces">Necklaces</option>
                          <option value="Watches">Watches</option>
                          <option value="Rings">Rings</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Perfumes">Perfumes</option>
                          <option value="Earrings">Earrings</option>
                        </select>
                        <div className="w-full sm:col-span-2">
                          <CloudinaryUpload
                            value={editForm.image || ''}
                            onChange={(url) => setEditForm(prev => ({ ...prev, image: url }))}
                            onRemove={() => setEditForm(prev => ({ ...prev, image: '' }))}
                            folder="jabel-products"
                          />
                        </div>

<textarea 
                          placeholder="Description (Optional)"
                          value={editForm.description || ''}
                          onChange={e => setEditForm({...editForm, description: e.target.value})}
                          className="w-full border border-theme-border p-2.5 text-sm bg-theme-bg text-theme-text sm:col-span-2 h-24 resize-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={handleEnhanceDescription}
                          disabled={isEnhancing || !editForm.name || !editForm.category || !editForm.description?.trim()}
                          className="w-full sm:col-span-2 py-2 px-4 bg-purple-500/10 border border-purple-500/30 text-purple-700 rounded-md text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Zap className="w-4 h-4" />
                          {isEnhancing ? "Enhancing with Grok..." : "✨ Enhance Description with Grok"}
                        </button>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 text-theme-muted hover:text-theme-text px-4 py-2 text-sm transition-colors cursor-pointer">
                          <X className="w-4 h-4"/> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-1.5 bg-theme-accent text-theme-accent-fg px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
                          <Save className="w-4 h-4"/> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleToggleSelect(product.id)}
                          className="text-theme-muted hover:text-theme-text transition-colors cursor-pointer p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-theme-accent" />
                          ) : (
                            <Square className="w-5 h-5 text-theme-muted" />
                          )}
                        </button>
                        <div className="w-16 h-16 bg-theme-border/30 overflow-hidden flex-shrink-0 border border-theme-border/50">
                          <OptimizedImage
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-theme-text transition-colors">{product.name}</h4>
                            {product.isNew && (
                              <span className="px-2 py-0.5 bg-theme-border/40 text-[10px] font-medium uppercase tracking-wider text-theme-text rounded">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-theme-muted mt-0.5 transition-colors">{product.category} &bull; <span className="font-medium text-theme-text">GH₵{product.price.toLocaleString()}</span></p>
                          {product.description && <p className="text-xs text-theme-muted mt-1 line-clamp-1">{product.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-theme-muted hover:text-theme-text border border-theme-border hover:border-theme-muted transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:text-red-600 border border-theme-border hover:border-red-300 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Detail Modal */}
          {showOrderDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowOrderDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-theme-surface border border-theme-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-theme-border flex justify-between items-center">
                  <h3 className="font-['Playfair_Display'] text-xl text-theme-text">Order #{showOrderDetail.id}</h3>
                  <button onClick={() => setShowOrderDetail(null)} className="p-2 text-theme-muted hover:text-theme-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-theme-muted">Order Date</p>
                      <p className="text-sm font-medium text-theme-text">{new Date(showOrderDetail.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-theme-muted">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_CONFIG[showOrderDetail.status].color}`}>
                        {STATUS_CONFIG[showOrderDetail.status].icon}
                        {STATUS_CONFIG[showOrderDetail.status].label}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-theme-muted">Customer</p>
                      <p className="text-sm font-medium text-theme-text">{showOrderDetail.customerName || 'Walk-in'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-theme-muted">Phone</p>
                      <p className="text-sm font-medium text-theme-text">{showOrderDetail.customerPhone || 'N/A'}</p>
                    </div>
                    {showOrderDetail.customerEmail && (
                      <div>
                        <p className="text-xs text-theme-muted">Email</p>
                        <p className="text-sm font-medium text-theme-text">{showOrderDetail.customerEmail}</p>
                      </div>
                    )}
                    {showOrderDetail.shippingAddress && (
                      <div className="col-span-2">
                        <p className="text-xs text-theme-muted">Shipping Address</p>
                        <p className="text-sm font-medium text-theme-text">{showOrderDetail.shippingAddress}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-theme-border pt-4">
                    <h4 className="text-sm font-medium text-theme-text mb-3">Items</h4>
                    <div className="space-y-2">
                      {showOrderDetail.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-theme-border/50">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <OptimizedImage
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded border border-theme-border/50"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-theme-text">{item.name}</p>
                              <p className="text-xs text-theme-muted">{item.category} · Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-theme-text">GH₵{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-theme-border">
                    <span className="text-theme-muted">Total</span>
                    <span className="text-xl font-['Playfair_Display'] text-theme-text">GH₵{showOrderDetail.total.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-theme-border pt-4">
                    <h4 className="text-sm font-medium text-theme-text mb-3">Status History</h4>
                    <div className="space-y-2">
                      {showOrderDetail.statusHistory.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className={`w-2 h-2 rounded-full ${i === showOrderDetail.statusHistory.length - 1 ? 'bg-theme-accent' : 'bg-theme-muted'}`} />
                          <span className="text-theme-text capitalize">{h.status}</span>
                          <span className="text-theme-muted ml-auto">{new Date(h.timestamp).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-theme-border">
                    <button
                      onClick={() => handleEditOrder(showOrderDetail)}
                      className="flex-1 px-4 py-2 bg-theme-surface border border-theme-border text-sm font-medium text-theme-text hover:bg-theme-border/30 transition-colors"
                    >
                      Edit Status
                    </button>
                    <button
                      onClick={() => sendWhatsAppNotification(showOrderDetail)}
                      className="flex-1 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-600 text-sm font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp
                    </button>
                    <button
                      onClick={() => sendEmailNotification(showOrderDetail)}
                      className="flex-1 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-600 text-sm font-medium hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Edit Status Modal */}
          {editingOrderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => { setEditingOrderId(null); setEditOrderStatus('pending'); }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-theme-surface border border-theme-border rounded-xl max-w-md w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="font-['Playfair_Display'] text-xl text-theme-text mb-4">Update Order Status</h3>
                <div className="space-y-3 mb-6">
                  {ORDER_STATUSES.map(status => {
                    const config = STATUS_CONFIG[status];
                    return (
                      <label key={status} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${editOrderStatus === status ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border hover:border-theme-muted/50'}`}>
                        <input
                          type="radio"
                          name="orderStatus"
                          value={status}
                          checked={editOrderStatus === status}
                          onChange={() => setEditOrderStatus(status)}
                          className="w-4 h-4 accent-theme-accent"
                        />
                        <span className="flex-1">{config.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-theme-text capitalize">{config.label}</p>
                          <p className="text-xs text-theme-muted">{config.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditingOrderId(null); setEditOrderStatus('pending'); }}
                    className="flex-1 px-4 py-2 border border-theme-border text-theme-text text-sm font-medium hover:bg-theme-border/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveOrderStatus}
                    className="flex-1 px-4 py-2 bg-theme-accent text-theme-accent-fg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Save Status
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          <div className="bg-theme-surface border border-theme-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-['Playfair_Display'] text-theme-text">Customer Order Logs</h3>
              <div className="flex items-center gap-2">
                <select
                  value={adminCategoryFilter}
                  onChange={(e) => setAdminCategoryFilter(e.target.value)}
                  className="bg-theme-bg border border-theme-border px-3 py-2 text-sm text-theme-text focus:outline-none focus:ring-1 focus:ring-theme-accent"
                >
                  <option value="All">All Statuses</option>
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-theme-muted mb-6">Orders placed via WhatsApp checkout. Update status to notify customers automatically.</p>
            
            {orders.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-theme-border">
                <p className="text-theme-muted text-sm">No customer orders recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter(order => adminCategoryFilter === 'All' || order.status === adminCategoryFilter)
                  .map(order => {
                    const config = STATUS_CONFIG[order.status];
                    return (
                      <div key={order.id} className="border border-theme-border bg-theme-bg overflow-hidden transition-colors hover:border-theme-muted/50">
                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="text-theme-muted hover:text-theme-text p-1"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-xs font-mono text-theme-accent font-semibold">#{order.id}</span>
                                  <span className="text-xs text-theme-muted">{new Date(order.date).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-theme-text font-medium line-clamp-1">
                                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                </p>
                                {(order.customerName || order.customerPhone) && (
                                  <p className="text-xs text-theme-muted mt-1">
                                    {order.customerName && <span className="font-medium">{order.customerName}</span>}
                                    {order.customerPhone && <span className="ml-2">{order.customerPhone}</span>}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:ml-auto">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${config.color}`}>
                              {config.icon}
                              {config.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditOrder(order)}
                                className="p-2 text-theme-muted hover:text-theme-text border border-theme-border hover:border-theme-muted rounded-lg transition-colors"
                                title="Edit Status"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => sendWhatsAppNotification(order)}
                                className="p-2 text-green-600 hover:bg-green-500/10 border border-green-500/30 rounded-lg transition-colors"
                                title="Notify via WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => sendEmailNotification(order)}
                                className="p-2 text-blue-600 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-colors"
                                title="Notify via Email"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-theme-border/20 px-4 sm:px-6 py-3 sm:py-4 border-t border-theme-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <p className="text-sm font-semibold text-theme-text">GH₵{order.total.toLocaleString()}</p>
                          <div className="flex items-center gap-2 text-xs text-theme-muted">
                            <ChevronDown className="w-3 h-3" />
                            Click to view full details & history
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboard orders={orders} products={products} />
      )}
    </div>
  );
}
