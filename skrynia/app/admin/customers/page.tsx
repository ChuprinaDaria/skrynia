'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { Search, Mail, User, Package, DollarSign } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface Customer {
  email: string;
  name: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
}

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Fetch orders to get customer list
      const res = await fetch(getApiEndpoint('/api/v1/orders?limit=1000'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const orders = await res.json();
        
        // Group by customer email
        const customerMap = new Map<string, Customer>();
        
        orders.forEach((order: any) => {
          const email = order.customer_email;
          if (!customerMap.has(email)) {
            customerMap.set(email, {
              email: email,
              name: order.customer_name,
              total_orders: 0,
              total_spent: 0,
              last_order_date: null,
            });
          }
          
          const customer = customerMap.get(email)!;
          customer.total_orders += 1;
          customer.total_spent += order.total || 0;
          
          const orderDate = new Date(order.created_at);
          if (!customer.last_order_date || orderDate > new Date(customer.last_order_date)) {
            customer.last_order_date = order.created_at;
          }
        });
        
        const customerList = Array.from(customerMap.values()).sort(
          (a, b) => (b.total_spent || 0) - (a.total_spent || 0)
        );
        
        setCustomers(customerList);
      } else if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-0 lg:ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-4xl text-ivory mb-2">Клієнти</h1>
            <p className="text-sage/70">Список всіх клієнтів та їх замовлень</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage/50" />
              <input
                type="text"
                placeholder="Пошук за email або іменем..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
              />
            </div>
          </div>

          {/* Customers Table */}
          {loading ? (
            <div className="text-center py-12 text-sage/70">Завантаження...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-sage/70">
              Клієнти не знайдено.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-sage/30">
                  <tr>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Email</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Ім'я</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Замовлень</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Сума замовлень</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Останнє замовлення</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={customer.email} className="border-b border-sage/10 hover:bg-deep-black/50">
                      <td className="py-3 px-4 text-ivory flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sage/50" />
                        {customer.email}
                      </td>
                      <td className="py-3 px-4 text-ivory flex items-center gap-2">
                        <User className="w-4 h-4 text-sage/50" />
                        {customer.name}
                      </td>
                      <td className="py-3 px-4 text-ivory flex items-center gap-2">
                        <Package className="w-4 h-4 text-sage/50" />
                        {customer.total_orders}
                      </td>
                      <td className="py-3 px-4 text-ivory flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-sage/50" />
                        {customer.total_spent.toFixed(2)} PLN
                      </td>
                      <td className="py-3 px-4 text-sage/70">
                        {formatDate(customer.last_order_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stats */}
          {!loading && customers.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-footer-black border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-2 font-inter">Всього клієнтів</div>
                <div className="text-ivory text-2xl font-cinzel font-bold">{customers.length}</div>
              </div>
              <div className="bg-footer-black border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-2 font-inter">Всього замовлень</div>
                <div className="text-ivory text-2xl font-cinzel font-bold">
                  {customers.reduce((sum, c) => sum + c.total_orders, 0)}
                </div>
              </div>
              <div className="bg-footer-black border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-2 font-inter">Загальна сума</div>
                <div className="text-ivory text-2xl font-cinzel font-bold">
                  {customers.reduce((sum, c) => sum + c.total_spent, 0).toFixed(2)} PLN
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

