'use client';

import React, { useState, useEffect } from 'react';
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
} from 'recharts';

interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  pending_orders: number;
  recent_orders: any[];
  top_products: any[];
  revenue_by_payment_method: Record<string, number>;
  orders_by_status: Record<string, number>;
}

interface SalesChartData {
  labels: string[];
  revenue: number[];
  orders: number[];
}

const COLORS = ['#660000', '#7A8B8B', '#C77966', '#FFFFF0'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<SalesChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchDashboardData();
  }, [days]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsRes = await fetch(`http://localhost:8000/api/v1/admin/dashboard?days=${days}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch chart data
      const chartRes = await fetch(`http://localhost:8000/api/v1/admin/sales-chart?days=${days}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (chartRes.ok) {
        const chartData = await chartRes.json();
        setChartData(chartData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-ivory text-xl font-cinzel">Завантаження...</div>
      </div>
    );
  }

  // Prepare chart data
  const salesData = chartData
    ? chartData.labels.map((label, index) => ({
        date: label,
        revenue: chartData.revenue[index],
        orders: chartData.orders[index],
      }))
    : [];

  const paymentData = Object.entries(stats.revenue_by_payment_method).map(([key, value]) => ({
    name: key,
    value,
  }));

  const statusData = Object.entries(stats.orders_by_status).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-cinzel text-4xl text-ivory">Admin Dashboard</h1>

          {/* Time period selector */}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 bg-footer-black border border-sage/30 text-ivory rounded-sm font-inter"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: `${stats.total_revenue.toFixed(2)} zł`, color: 'oxblood' },
            { label: 'Total Orders', value: stats.total_orders, color: 'sage' },
            { label: 'Products', value: stats.total_products, color: 'coral' },
            { label: 'Customers', value: stats.total_customers, color: 'ivory' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-footer-black border border-sage/20 rounded-sm p-6 hover:border-oxblood transition-colors"
            >
              <div className="text-sage text-sm mb-2 font-inter">{stat.label}</div>
              <div className={`text-${stat.color} text-3xl font-cinzel font-bold`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Sales Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#7A8B8B33" />
                <XAxis dataKey="date" stroke="#7A8B8B" tick={{ fill: '#7A8B8B' }} />
                <YAxis stroke="#7A8B8B" tick={{ fill: '#7A8B8B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1C20', border: '1px solid #7A8B8B' }}
                  labelStyle={{ color: '#FFFFF0' }}
                />
                <Legend wrapperStyle={{ color: '#FFFFF0' }} />
                <Line type="monotone" dataKey="revenue" stroke="#660000" strokeWidth={2} name="Revenue (zł)" />
                <Line type="monotone" dataKey="orders" stroke="#C77966" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Revenue by Payment Method</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(0)} zł`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A1C20', border: '1px solid #7A8B8B' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Top Products</h2>
            <div className="space-y-4">
              {stats.top_products.map((product, index) => (
                <div key={index} className="flex items-center justify-between border-b border-sage/10 pb-3">
                  <div>
                    <div className="text-ivory font-inter">{product.title}</div>
                    <div className="text-sage text-sm">{product.sold} sold</div>
                  </div>
                  <div className="text-oxblood font-semibold">{product.revenue.toFixed(2)} zł</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {stats.recent_orders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between border-b border-sage/10 pb-3">
                  <div>
                    <div className="text-ivory font-inter">{order.order_number}</div>
                    <div className="text-sage text-sm">{order.customer_name}</div>
                  </div>
                  <div>
                    <div className="text-oxblood font-semibold">{order.total.toFixed(2)} zł</div>
                    <div className="text-sage text-xs text-right">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
