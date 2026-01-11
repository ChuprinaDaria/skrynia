'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { Search, Package, DollarSign, Calendar, User, Mail, MapPin, Edit } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_country: string;
  shipping_city: string;
  created_at: string;
  items?: Array<{
    product_title: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      const res = await fetch(getApiEndpoint('/api/v1/orders?limit=1000'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const ordersData = await res.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(getApiEndpoint(`/api/v1/orders/${orderId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const updatePaymentStatus = async (orderId: number, payment_status: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(getApiEndpoint(`/api/v1/orders/${orderId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_status }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'paid':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'shipped':
        return 'text-purple-400 bg-purple-400/20 border-purple-400/50';
      case 'delivered':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      default:
        return 'text-sage bg-sage/20 border-sage/50';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'completed':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'failed':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'refunded':
        return 'text-orange-400 bg-orange-400/20 border-orange-400/50';
      default:
        return 'text-sage bg-sage/20 border-sage/50';
    }
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-4xl text-ivory mb-2">Замовлення</h1>
            <p className="text-sage/70">Управління всіма замовленнями</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage/50" />
              <input
                type="text"
                placeholder="Пошук за номером, ім'ям або email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
            >
              <option value="all">Всі статуси</option>
              <option value="pending">Очікує</option>
              <option value="paid">Оплачено</option>
              <option value="shipped">Відправлено</option>
              <option value="delivered">Доставлено</option>
              <option value="cancelled">Скасовано</option>
            </select>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="text-center py-12 text-sage/70">Завантаження...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-sage/70">
              Замовлення не знайдено.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-sage/30">
                  <tr>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Номер</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Клієнт</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Сума</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Статус</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Оплата</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Дата</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-sage/10 hover:bg-deep-black/50">
                      <td className="py-3 px-4 text-ivory font-mono text-sm">
                        {order.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-ivory flex items-center gap-2">
                            <User className="w-4 h-4 text-sage/50" />
                            {order.customer_name}
                          </div>
                          <div className="text-sage/70 text-sm flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {order.customer_email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-ivory flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-sage/50" />
                        {order.total.toFixed(2)} PLN
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-sm text-xs border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-sm text-xs border ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sage/70 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-sage hover:text-oxblood transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Редагувати
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stats */}
          {!loading && orders.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-footer-black border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-2 font-inter">Всього замовлень</div>
                <div className="text-ivory text-2xl font-cinzel font-bold">{orders.length}</div>
              </div>
              <div className="bg-footer-black border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-2 font-inter">Загальна сума</div>
                <div className="text-ivory text-2xl font-cinzel font-bold">
                  {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)} PLN
                </div>
              </div>
              <div className="bg-footer-black border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-2 font-inter">Очікують</div>
                <div className="text-ivory text-2xl font-cinzel font-bold">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
              </div>
              <div className="bg-footer-black border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-2 font-inter">Оплачено</div>
                <div className="text-ivory text-2xl font-cinzel font-bold">
                  {orders.filter(o => o.payment_status === 'completed').length}
                </div>
              </div>
            </div>
          )}

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-deep-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-footer-black border border-sage/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-cinzel text-2xl text-ivory">
                      Замовлення {selectedOrder.order_number}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-sage hover:text-oxblood transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                      <h3 className="font-cinzel text-lg text-ivory mb-3">Інформація про клієнта</h3>
                      <div className="space-y-2 text-sage">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {selectedOrder.customer_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedOrder.customer_email}
                        </div>
                        {selectedOrder.shipping_city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {selectedOrder.shipping_city}, {selectedOrder.shipping_country}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                      <h3 className="font-cinzel text-lg text-ivory mb-3">Деталі замовлення</h3>
                      <div className="space-y-2 text-sage">
                        <div className="flex justify-between">
                          <span>Підсумок:</span>
                          <span className="text-ivory">{selectedOrder.subtotal.toFixed(2)} PLN</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Доставка:</span>
                          <span className="text-ivory">{selectedOrder.shipping_cost.toFixed(2)} PLN</span>
                        </div>
                        <div className="flex justify-between border-t border-sage/20 pt-2">
                          <span className="text-ivory font-semibold">Всього:</span>
                          <span className="text-oxblood font-semibold">{selectedOrder.total.toFixed(2)} PLN</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Updates */}
                    <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                      <h3 className="font-cinzel text-lg text-ivory mb-3">Оновити статус</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sage text-sm mb-2">Статус замовлення</label>
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => {
                              updateOrderStatus(selectedOrder.id, e.target.value);
                            }}
                            className="w-full px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                          >
                            <option value="pending">Очікує</option>
                            <option value="paid">Оплачено</option>
                            <option value="shipped">Відправлено</option>
                            <option value="delivered">Доставлено</option>
                            <option value="cancelled">Скасовано</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sage text-sm mb-2">Статус оплати</label>
                          <select
                            value={selectedOrder.payment_status}
                            onChange={(e) => {
                              updatePaymentStatus(selectedOrder.id, e.target.value);
                            }}
                            className="w-full px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                          >
                            <option value="pending">Очікує</option>
                            <option value="completed">Оплачено</option>
                            <option value="failed">Помилка</option>
                            <option value="refunded">Повернено</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

