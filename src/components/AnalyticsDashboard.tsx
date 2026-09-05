import { useMemo } from 'react';
import { Order } from '../types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DollarSign, TrendingUp, Package, ShoppingCart, ArrowUpRight, ArrowDownRight, Users, Clock } from 'lucide-react';

const COLORS = ['#1c1917', '#6B7280', '#D1D5DB', '#9CA3AF', '#F3F4F6'];
const STATUS_COLORS = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#8B5CF6',
  shipped: '#6366F1',
  delivered: '#10B981',
  cancelled: '#EF4444'
};

interface AnalyticsDashboardProps {
  orders: Order[];
  products: any[];
}

export default function AnalyticsDashboard({ orders, products }: AnalyticsDashboardProps) {
  // Revenue over time (last 30 days)
  const revenueData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyRevenue: Record<string, number> = {};
    const dailyOrders: Record<string, number> = {};

    orders.forEach(order => {
      const date = new Date(order.date).toISOString().split('T')[0];
      if (dailyRevenue[date] === undefined) dailyRevenue[date] = 0;
      if (dailyOrders[date] === undefined) dailyOrders[date] = 0;
      dailyRevenue[date] += order.total;
      dailyOrders[date] += 1;
    });

    return last30Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      revenue: dailyRevenue[date] || 0,
      orders: dailyOrders[date] || 0
    }));
  }, [orders]);

  // Top selling products
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; category: string; quantity: number; revenue: number; image?: string }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { name: item.name, category: item.category, quantity: 0, revenue: 0, image: item.image };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [orders]);

  // Category distribution
  const categoryData = useMemo(() => {
    const catStats: Record<string, { count: number; revenue: number }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!catStats[item.category]) {
          catStats[item.category] = { count: 0, revenue: 0 };
        }
        catStats[item.category].count += item.quantity;
        catStats[item.category].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(catStats).map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue
    }));
  }, [orders]);

  // Order status distribution
  const statusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280'
    }));
  }, [orders]);

  // Monthly comparison (last 6 months)
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date.toISOString().slice(0, 7);
    });

    const monthlyStats: Record<string, { revenue: number; orders: number }> = {};
    
    orders.forEach(order => {
      const month = order.date.slice(0, 7);
      if (!monthlyStats[month]) monthlyStats[month] = { revenue: 0, orders: 0 };
      monthlyStats[month].revenue += order.total;
      monthlyStats[month].orders += 1;
    });

    return months.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return {
        month: date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        revenue: monthlyStats[month]?.revenue || 0,
        orders: monthlyStats[month]?.orders || 0
      };
    });
  }, [orders]);

  // Key metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalProductsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Recent orders for table
  const recentOrders = orders.slice(0, 5);

  const formatCurrency = (value: number) => `GH₵${value.toLocaleString()}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-theme-surface border border-theme-border p-3 rounded-lg shadow-lg">
          <p className="text-xs text-theme-muted">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium text-theme-text" style={{ color: entry.color }}>
              {entry.name}: {entry.payload.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 12.5, positive: true }}
          description="vs last period"
        />
        <MetricCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={<ShoppingCart className="w-5 h-5" />}
          trend={{ value: 8.2, positive: true }}
          description="vs last period"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(avgOrderValue)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 3.1, positive: true }}
          description="vs last period"
        />
        <MetricCard
          title="Products Sold"
          value={totalProductsSold.toLocaleString()}
          icon={<Package className="w-5 h-5" />}
          trend={{ value: 15.7, positive: true }}
          description="vs last period"
        />
      </div>

      {/* Charts Row 1: Revenue & Orders Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend (30 Days)" subtitle="Daily revenue in GH₵">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1c1917" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1c1917" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `GH₵${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1c1917"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders Trend (30 Days)" subtitle="Daily order count">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2: Monthly Comparison & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Comparison (6 Months)" subtitle="Revenue vs Orders">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `GH₵${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue (GH₵)" fill="#1c1917" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" name="Orders" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Distribution" subtitle="By revenue share">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="revenue"
                nameKey="category"
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                labelProps={{ fontSize: 11, fill: '#374151' }}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 3: Order Status & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Order Status Distribution" subtitle="Current pipeline">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
                label={({ status, percent }) => `${status.charAt(0).toUpperCase() + status.slice(1)} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                labelProps={{ fontSize: 11, fill: '#374151' }}
              >
                {statusData.map((s, index) => (
                  <Cell key={`cell-${index}`} fill={s.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Orders']}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Selling Products" subtitle="By revenue">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {topProducts.length === 0 ? (
              <p className="text-theme-muted text-center py-8">No sales data yet</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3 p-2 hover:bg-theme-border/30 rounded-lg transition-colors">
                  <span className="w-6 text-center text-theme-muted font-medium">{index + 1}</span>
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded border border-theme-border/50" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-theme-text truncate">{product.name}</p>
                    <p className="text-xs text-theme-muted">{product.category} · {product.quantity} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-theme-text">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-theme-muted">{(product.revenue / totalRevenue * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ChartCard>
      </div>

      {/* Recent Orders Table */}
      <ChartCard title="Recent Orders" subtitle="Latest customer orders">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme-border">
                <th className="text-left py-3 px-2 font-medium text-theme-muted uppercase tracking-wider">Order ID</th>
                <th className="text-left py-3 px-2 font-medium text-theme-muted uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-2 font-medium text-theme-muted uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-2 font-medium text-theme-muted uppercase tracking-wider">Items</th>
                <th className="text-left py-3 px-2 font-medium text-theme-muted uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-2 font-medium text-theme-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-theme-muted">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-theme-border/50 hover:bg-theme-border/30">
                    <td className="py-3 px-2 font-mono text-theme-accent">#{order.id}</td>
                    <td className="py-3 px-2 text-theme-text">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-theme-text">{order.customerName || 'Walk-in'}</td>
                    <td className="py-3 px-2 text-theme-muted">{order.items.length} item(s)</td>
                    <td className="py-3 px-2 font-medium text-theme-text">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}10 text-${order.status === 'delivered' ? 'emerald' : order.status === 'cancelled' ? 'red' : order.status === 'pending' ? 'amber' : 'blue'}-600 border border-${order.status === 'delivered' ? 'emerald' : order.status === 'cancelled' ? 'red' : order.status === 'pending' ? 'amber' : 'blue'}-500/30`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Export Section */}
      <div className="bg-theme-surface border border-theme-border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-medium text-theme-text mb-1">Export Analytics Data</h3>
          <p className="text-xs text-theme-muted">Download CSV reports for external analysis</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportCSV('revenue', revenueData)}
            className="px-4 py-2 bg-theme-bg border border-theme-border text-sm font-medium text-theme-text hover:bg-theme-border/30 transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" /> Revenue CSV
          </button>
          <button
            onClick={() => exportCSV('products', topProducts)}
            className="px-4 py-2 bg-theme-bg border border-theme-border text-sm font-medium text-theme-text hover:bg-theme-border/30 transition-colors flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Products CSV
          </button>
          <button
            onClick={() => exportCSV('orders', orders)}
            className="px-4 py-2 bg-theme-bg border border-theme-border text-sm font-medium text-theme-text hover:bg-theme-border/30 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Orders CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, description }: any) {
  return (
    <div className="bg-theme-surface border border-theme-border p-6 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider text-theme-muted">{title}</p>
        <div className="w-10 h-10 bg-theme-border/30 rounded-lg flex items-center justify-center text-theme-text">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-['Playfair_Display'] text-theme-text mb-2">{value}</p>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend.value}%
        </span>
        <span className="text-xs text-theme-muted">{description}</span>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div className="bg-theme-surface border border-theme-border p-6 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-['Playfair_Display'] text-theme-text">{title}</h3>
        <p className="text-xs text-theme-muted">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function exportCSV(type: string, data: any[]) {
  let csv = '';
  let filename = '';

  switch (type) {
    case 'revenue':
      csv = ['Date,Revenue (GH₵),Orders'].concat(
        data.map(d => `${d.date},${d.revenue},${d.orders}`)
      ).join('\n');
      filename = `jabel_revenue_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'products':
      csv = ['Rank,Product,Category,Quantity Sold,Revenue (GH₵),Revenue Share %'].concat(
        data.map((d, i) => `${i+1},"${d.name}",${d.category},${d.quantity},${d.revenue},${(d.revenue / data.reduce((s, p) => s + p.revenue, 0) * 100).toFixed(2)}`)
      ).join('\n');
      filename = `jabel_top_products_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'orders':
      csv = ['Order ID,Date,Customer,Items,Total (GH₵),Status'].concat(
        data.map(o => `#${o.id},${new Date(o.date).toLocaleString()},"${o.customerName || 'Walk-in'}",${o.items.length},${o.total},${o.status}`)
      ).join('\n');
      filename = `jabel_orders_${new Date().toISOString().slice(0,10)}.csv`;
      break;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}