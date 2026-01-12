'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

interface UserProfile {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_admin: boolean;
  email_verified: boolean;
  loyalty_status: string | null;
  bonus_points: number;
  total_spent: number;
  created_at: string;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  default_address: any | null;
}

interface UserOrder {
  id: number;
  order_number: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items_count: number;
}

export default function AccountPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserProfile();
    fetchUserOrders();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(getApiEndpoint('/api/v1/users/me'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('user_token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Не вдалося завантажити профіль');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) return;

      const response = await fetch(getApiEndpoint('/api/v1/users/me/orders'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-ivory text-lg">Завантаження...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-oxblood text-lg">{error || 'Помилка завантаження профілю'}</div>
      </div>
    );
  }

  const getLoyaltyStatusName = (status: string | null) => {
    switch (status) {
      case 'human': return 'Людина';
      case 'elf': return 'Ельф';
      case 'dwarf': return 'Гном/Дворф';
      default: return 'Людина';
    }
  };

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
              Особистий кабінет
            </h1>
            <p className="font-inter text-sage text-lg">
              Керуйте своїм профілем та замовленнями
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="font-rutenia text-2xl text-ivory mb-2">
                  {user.full_name || user.email}
                </h2>
                <p className="text-sage text-sm">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="mt-4 md:mt-0"
              >
                Вийти
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">Статус</div>
                <div className="text-ivory font-semibold">
                  {getLoyaltyStatusName(user.loyalty_status)}
                </div>
              </div>
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">Бонусні бали</div>
                <div className="text-ivory font-semibold">{user.bonus_points.toFixed(2)}</div>
              </div>
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">Всього замовлень</div>
                <div className="text-ivory font-semibold">{user.total_orders}</div>
              </div>
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">Витрачено</div>
                <div className="text-ivory font-semibold">{user.total_spent.toFixed(2)} zł</div>
              </div>
            </div>

            {/* Order Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">В обробці</div>
                <div className="text-ivory font-semibold text-lg">{user.pending_orders}</div>
              </div>
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">Завершені</div>
                <div className="text-ivory font-semibold text-lg">{user.completed_orders}</div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6 md:p-8">
            <h2 className="font-rutenia text-2xl text-ivory mb-6">Мої замовлення</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sage mb-4">У вас поки немає замовлень</p>
                <Link href="/collections">
                  <Button>Перейти до каталогу</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-deep-black/50 border border-sage/20 rounded-sm p-4 hover:border-sage/40 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="text-ivory font-semibold mb-1">
                          Замовлення #{order.order_number}
                        </div>
                        <div className="text-sage text-sm">
                          {new Date(order.created_at).toLocaleDateString('uk-UA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-sage text-sm mt-1">
                          {order.items_count} {order.items_count === 1 ? 'товар' : 'товарів'}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="text-ivory font-semibold text-lg">
                          {order.total.toFixed(2)} zł
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-sm text-xs ${
                            order.status === 'completed' 
                              ? 'bg-sage/20 text-sage' 
                              : 'bg-oxblood/20 text-oxblood'
                          }`}>
                            {order.status === 'completed' ? 'Завершено' : 'В обробці'}
                          </span>
                          <span className={`px-3 py-1 rounded-sm text-xs ${
                            order.payment_status === 'paid' 
                              ? 'bg-sage/20 text-sage' 
                              : 'bg-oxblood/20 text-oxblood'
                          }`}>
                            {order.payment_status === 'paid' ? 'Оплачено' : 'Не оплачено'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

