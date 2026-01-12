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

interface UserAddress {
  id: number;
  full_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  pickup_point_code?: string | null; // For InPost paczkomat
}

interface BonusInfo {
  current_status: {
    name: string;
    min_spent: number;
    max_spent: number;
    bonus_percent: number;
    description: string;
  };
  next_status: {
    name: string;
    min_spent: number;
    max_spent: number;
    bonus_percent: number;
    description: string;
  } | null;
  progress: {
    current: number;
    needed: number;
    next_status: string;
    percent: number;
  } | null;
  bonus_points: number;
  total_spent: number;
  can_use_bonus: boolean;
  max_bonus_percent: number;
}

interface UserOrder {
  id: number;
  order_number: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items_count: number;
  tracking_number?: string | null;
  tracking_url?: string | null;
}

interface TrackingInfo {
  status: string;
  events: Array<{
    timestamp: string;
    status: string;
    description: string;
    location?: string;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [bonusInfo, setBonusInfo] = useState<BonusInfo | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [trackingData, setTrackingData] = useState<Record<string, TrackingInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserData();
    
    // Auto-refresh tracking every 30 seconds
    const trackingInterval = setInterval(() => {
      refreshTracking();
    }, 30000);

    return () => clearInterval(trackingInterval);
  }, [router]);

  const fetchUserData = async () => {
    await Promise.all([
      fetchUserProfile(),
      fetchUserAddresses(),
      fetchBonusInfo(),
      fetchUserOrders(),
    ]);
  };

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

  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) return;

      const response = await fetch(getApiEndpoint('/api/v1/users/addresses'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const fetchBonusInfo = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) return;

      const response = await fetch(getApiEndpoint('/api/v1/users/me/bonus-info'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBonusInfo(data);
      }
    } catch (err) {
      console.error('Error fetching bonus info:', err);
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
        
        // Fetch tracking for orders with tracking numbers
        data.forEach((order: UserOrder) => {
          if (order.tracking_number) {
            fetchTracking(order.tracking_number, order.order_number);
          }
        });
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchTracking = async (trackingNumber: string, orderNumber: string) => {
    try {
      // Try to determine provider from tracking number format
      // InPost: usually starts with specific format
      let provider = 'inpost';
      if (trackingNumber.includes('DHL')) {
        provider = 'dhl';
      } else if (trackingNumber.includes('NP')) {
        provider = 'nova_poshta';
      } else if (trackingNumber.length === 13) {
        provider = 'poczta_polska';
      }

      const response = await fetch(
        getApiEndpoint(`/api/v1/shipping/track/${trackingNumber}?provider=${provider}`)
      );

      if (response.ok) {
        const data = await response.json();
        setTrackingData((prev) => ({
          ...prev,
          [orderNumber]: data,
        }));
      }
    } catch (err) {
      console.error('Error fetching tracking:', err);
    }
  };

  const refreshTracking = () => {
    orders.forEach((order) => {
      if (order.tracking_number) {
        fetchTracking(order.tracking_number, order.order_number);
      }
    });
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

  const defaultAddress = addresses.find((addr) => addr.is_default) || addresses[0];
  const getLoyaltyStatusName = (status: string | null) => {
    switch (status) {
      case 'human': return 'Людина';
      case 'elf': return 'Ельф';
      case 'dwarf': return 'Гном/Дворф';
      return 'Людина';
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

          {/* Personal Info Card */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="font-rutenia text-2xl text-ivory mb-2">
                  {user.full_name || user.email}
                </h2>
                <div className="space-y-1 text-sage text-sm">
                  <p>📧 {user.email}</p>
                  {defaultAddress?.phone && (
                    <p>📞 {defaultAddress.phone}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="mt-4 md:mt-0"
              >
                Вийти
              </Button>
            </div>

            {/* Shipping Address / Paczkomat */}
            {defaultAddress && (
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4 mb-6">
                <h3 className="text-ivory font-semibold mb-2">Адреса доставки</h3>
                {defaultAddress.pickup_point_code ? (
                  <div className="text-sage text-sm">
                    <p className="font-semibold text-ivory">InPost Paczkomat: {defaultAddress.pickup_point_code}</p>
                    {defaultAddress.address_line1 && (
                      <p>{defaultAddress.address_line1}</p>
                    )}
                    <p>{defaultAddress.city}, {defaultAddress.postal_code}</p>
                    <p>{defaultAddress.country}</p>
                  </div>
                ) : (
                  <div className="text-sage text-sm">
                    <p>{defaultAddress.full_name}</p>
                    <p>{defaultAddress.address_line1}</p>
                    {defaultAddress.address_line2 && <p>{defaultAddress.address_line2}</p>}
                    <p>{defaultAddress.city}, {defaultAddress.postal_code}</p>
                    <p>{defaultAddress.country}</p>
                    {defaultAddress.phone && <p className="mt-2">📞 {defaultAddress.phone}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Loyalty Status with Progress Bar */}
            {bonusInfo && (
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-ivory font-semibold mb-1">
                      Статус лояльності: {bonusInfo.current_status.name}
                    </h3>
                    <p className="text-sage text-xs">{bonusInfo.current_status.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-ivory font-semibold text-lg">
                      {bonusInfo.bonus_points.toFixed(2)} балів
                    </div>
                    <div className="text-sage text-xs">Бонусні бали</div>
                  </div>
                </div>
                
                {bonusInfo.progress && bonusInfo.next_status && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-sage mb-2">
                      <span>До статусу "{bonusInfo.progress.next_status}"</span>
                      <span>{bonusInfo.progress.current.toFixed(2)} / {bonusInfo.next_status.min_spent} zł</span>
                    </div>
                    <div className="w-full bg-deep-black rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-oxblood h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, bonusInfo.progress.percent)}%` }}
                      />
                    </div>
                    <p className="text-sage text-xs mt-2">
                      Залишилось: {bonusInfo.progress.needed.toFixed(2)} zł
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">Всього замовлень</div>
                <div className="text-ivory font-semibold text-lg">{user.total_orders}</div>
              </div>
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4">
                <div className="text-sage text-sm mb-1">В обробці</div>
                <div className="text-ivory font-semibold text-lg">{user.pending_orders}</div>
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
                {orders.map((order) => {
                  const tracking = trackingData[order.order_number];
                  return (
                    <div
                      key={order.id}
                      className="bg-deep-black/50 border border-sage/20 rounded-sm p-4 hover:border-sage/40 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
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
                              order.status === 'completed' || order.status === 'delivered'
                                ? 'bg-sage/20 text-sage' 
                                : 'bg-oxblood/20 text-oxblood'
                            }`}>
                              {order.status === 'completed' || order.status === 'delivered' 
                                ? 'Завершено' 
                                : order.status === 'shipped' 
                                ? 'Відправлено' 
                                : 'В обробці'}
                            </span>
                            <span className={`px-3 py-1 rounded-sm text-xs ${
                              order.payment_status === 'paid' || order.payment_status === 'completed'
                                ? 'bg-sage/20 text-sage' 
                                : 'bg-oxblood/20 text-oxblood'
                            }`}>
                              {order.payment_status === 'paid' || order.payment_status === 'completed' 
                                ? 'Оплачено' 
                                : 'Не оплачено'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.tracking_number && (
                        <div className="mt-4 pt-4 border-t border-sage/20">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-ivory text-sm font-semibold">
                                Відстеження: {order.tracking_number}
                              </p>
                              {order.tracking_url && (
                                <a
                                  href={order.tracking_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-oxblood hover:text-oxblood/80 text-xs underline"
                                >
                                  Відкрити на сайті перевізника
                                </a>
                              )}
                            </div>
                          </div>
                          
                          {tracking && tracking.events && tracking.events.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-sage text-xs font-semibold">Історія відстеження:</p>
                              <div className="space-y-1">
                                {tracking.events.slice(0, 3).map((event, idx) => (
                                  <div key={idx} className="text-sage text-xs pl-4 border-l-2 border-sage/30">
                                    <p className="text-ivory">{event.description || event.status}</p>
                                    <p className="text-sage/70">
                                      {new Date(event.timestamp).toLocaleString('uk-UA')}
                                      {event.location && ` • ${event.location}`}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
