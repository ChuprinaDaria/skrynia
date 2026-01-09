'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminNav from '@/components/admin/AdminNav';
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

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        // No token - redirect to login
        window.location.href = '/admin/login';
        return;
      }

      // Fetch dashboard stats
      const statsRes = await fetch(`http://localhost:8000/api/v1/admin/dashboard?days=${days}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else if (statsRes.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
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
  }, [days]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black">
        <AdminNav />
        <div className="ml-64 pt-20 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-ivory text-xl font-cinzel">Завантаження...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    // Check if we have a token - if yes, it might be a DB error
    const token = localStorage.getItem('admin_token');
    if (token) {
      return (
        <div className="min-h-screen bg-deep-black">
          <AdminNav />
          <div className="ml-64 pt-20 pb-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-md mx-auto">
                <div className="text-ivory text-xl font-cinzel mb-4">Помилка підключення до БД</div>
                <p className="text-sage mb-6">
                  Бекенд не може підключитися до бази даних. Перевірте налаштування БД або створіть БД та користувача.
                </p>
                <div className="bg-footer-black/50 border border-sage/20 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sage text-sm mb-2">Для створення БД виконайте:</p>
                  <code className="text-xs text-ivory block bg-deep-black/50 p-2 rounded">
                    psql -h localhost -p 5433 -U postgres<br/>
                    CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';<br/>
                    CREATE DATABASE skrynia_db OWNER skrynia_user;<br/>
                    GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;
                  </code>
                </div>
                <a
                  href="/admin/login"
                  className="inline-block font-inter font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-oxblood focus:ring-offset-2 focus:ring-offset-deep-black bg-oxblood text-ivory hover:bg-oxblood/90 hover:shadow-oxblood-glow active:scale-[0.98] px-6 py-3 text-base"
                >
                  Спробувати знову
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // No token - redirect happens in useEffect, but show login prompt
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-ivory text-xl font-cinzel mb-4">Потрібна авторизація</div>
          <p className="text-sage mb-6">Будь ласка, увійдіть в систему для доступу до адмін-панелі</p>
          <a
            href="/admin/login"
            className="inline-block font-inter font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-oxblood focus:ring-offset-2 focus:ring-offset-deep-black bg-oxblood text-ivory hover:bg-oxblood/90 hover:shadow-oxblood-glow active:scale-[0.98] px-6 py-3 text-base"
          >
            Увійти
          </a>
        </div>
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
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-cinzel text-4xl text-ivory">Admin Dashboard</h1>

          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <a
              href="/admin/products"
              className="px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors font-inter font-semibold flex items-center gap-2"
            >
              <span>Управління Товарами</span>
            </a>

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

        {/* Quick Actions */}
        <div className="mb-8 bg-footer-black border border-sage/20 rounded-sm p-6">
          <h2 className="font-cinzel text-2xl text-ivory mb-4">Швидкі Дії</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/admin/products/editor"
              className="px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors font-inter font-semibold flex items-center gap-2"
            >
              <span>+ Додати Новий Товар</span>
            </a>
            <a
              href="/admin/products"
              className="px-6 py-3 bg-footer-black border border-sage/30 text-ivory hover:border-sage rounded-sm transition-colors font-inter font-semibold"
            >
              Переглянути Всі Товари
            </a>
          </div>
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
    </div>
  );
}
