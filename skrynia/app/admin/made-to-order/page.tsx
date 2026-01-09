'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';

interface MadeToOrderRequest {
  id: number;
  product_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  custom_text: string | null;
  description: string | null;
  status: string;
  is_read: boolean;
  admin_notes: string | null;
  created_at: string;
  product?: {
    title_uk: string;
    slug: string;
  };
}

export default function MadeToOrderPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<MadeToOrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const url = filter === 'all' 
        ? 'http://localhost:8000/api/v1/made-to-order/'
        : `http://localhost:8000/api/v1/made-to-order/?status=${filter}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Fetch product info for each request
        const requestsWithProducts = await Promise.all(
          data.map(async (req: MadeToOrderRequest) => {
            try {
              const productRes = await fetch(`http://localhost:8000/api/v1/products/by-id/${req.product_id}`);
              if (productRes.ok) {
                const product = await productRes.json();
                return { ...req, product: { title_uk: product.title_uk, slug: product.slug } };
              }
            } catch (error) {
              console.error('Failed to fetch product:', error);
            }
            return req;
          })
        );
        setRequests(requestsWithProducts);
      } else if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:8000/api/v1/made-to-order/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, is_read: true }),
      });

      if (res.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

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

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <h1 className="font-cinzel text-4xl text-ivory">Замовлення Під Замовлення</h1>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 bg-footer-black border border-sage/30 text-ivory rounded-sm font-inter"
            >
              <option value="all">Всі</option>
              <option value="new">Нові</option>
              <option value="in_progress">В роботі</option>
              <option value="completed">Завершені</option>
            </select>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-footer-black border border-sage/20 rounded-sm p-8 text-center">
                <p className="text-sage">Немає замовлень</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-footer-black border rounded-sm p-6 ${
                    !request.is_read ? 'border-oxblood shadow-oxblood-glow' : 'border-sage/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-cinzel text-xl text-ivory">
                          {request.product?.title_uk || `Товар #${request.product_id}`}
                        </h3>
                        {!request.is_read && (
                          <span className="px-2 py-1 bg-oxblood/20 text-oxblood text-xs rounded-sm">
                            Новий
                          </span>
                        )}
                      </div>
                      <p className="text-sage text-sm">
                        <strong>Клієнт:</strong> {request.customer_name} ({request.customer_email})
                        {request.customer_phone && ` - ${request.customer_phone}`}
                      </p>
                      <p className="text-sage text-xs mt-1">
                        {new Date(request.created_at).toLocaleString('uk-UA')}
                      </p>
                    </div>
                    <select
                      value={request.status}
                      onChange={(e) => updateStatus(request.id, e.target.value)}
                      className="px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm text-sm"
                    >
                      <option value="new">Новий</option>
                      <option value="in_progress">В роботі</option>
                      <option value="completed">Завершено</option>
                      <option value="cancelled">Скасовано</option>
                    </select>
                  </div>

                  {request.custom_text && (
                    <div className="mb-3">
                      <p className="text-sage text-sm mb-1">
                        <strong>Текст для нанесення:</strong>
                      </p>
                      <p className="text-ivory bg-deep-black/50 border border-sage/20 rounded-sm p-3">
                        {request.custom_text}
                      </p>
                    </div>
                  )}

                  {request.description && (
                    <div className="mb-3">
                      <p className="text-sage text-sm mb-1">
                        <strong>Опис / Коментар:</strong>
                      </p>
                      <p className="text-ivory bg-deep-black/50 border border-sage/20 rounded-sm p-3 whitespace-pre-wrap">
                        {request.description}
                      </p>
                    </div>
                  )}

                  {request.admin_notes && (
                    <div className="mt-3 pt-3 border-t border-sage/20">
                      <p className="text-sage text-sm mb-1">
                        <strong>Примітки адміна:</strong>
                      </p>
                      <p className="text-ivory text-sm">{request.admin_notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

