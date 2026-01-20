'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  phone: string | null;
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'PL',
    is_default: true,
  });
  const [savingAddress, setSavingAddress] = useState(false);

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
      setError(t.account.failedToLoad);
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

  const handleOpenAddressModal = (address?: UserAddress) => {
    if (address) {
      setEditingAddress(address);
      setAddressFormData({
        full_name: address.full_name || '',
        phone: address.phone || '',
        address_line1: address.address_line1 || '',
        address_line2: address.address_line2 || '',
        city: address.city || '',
        postal_code: address.postal_code || '',
        country: address.country || 'PL',
        is_default: address.is_default || false,
      });
    } else {
      setEditingAddress(null);
      setAddressFormData({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'PL',
        is_default: addresses.length === 0,
      });
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    try {
      const token = localStorage.getItem('user_token');
      if (!token) return;

      const url = editingAddress
        ? getApiEndpoint(`/api/v1/users/me/addresses/${editingAddress.id}`)
        : getApiEndpoint('/api/v1/users/me/addresses');
      
      const method = editingAddress ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressFormData),
      });

      if (response.ok) {
        await fetchUserAddresses();
        setIsAddressModalOpen(false);
        setEditingAddress(null);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to save address');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-ivory text-lg">{t.account.loading}</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-oxblood text-lg">{error || t.account.errorLoading}</div>
      </div>
    );
  }

  const defaultAddress = addresses.find((addr) => addr.is_default) || addresses[0];
  const getLoyaltyStatusName = (status: string | null): string => {
    switch (status) {
      case 'human': return t.account.loyaltyStatuses.human;
      case 'elf': return t.account.loyaltyStatuses.elf;
      case 'dwarf': return t.account.loyaltyStatuses.dwarf;
      default: return t.account.loyaltyStatuses.human;
    }
  };

  const getLoyaltyStatusImage = (status: string | null): string => {
    switch (status) {
      case 'human': return '/images/bonus/human.jpg';
      case 'elf': return '/images/bonus/elf.jpg';
      case 'dwarf': return '/images/bonus/dwarf.jpg';
      default: return '/images/bonus/human.jpg';
    }
  };

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
              {t.account.title}
            </h1>
            <p className="font-inter text-sage text-lg">
              {t.account.subtitle}
            </p>
          </div>

          {/* Personal Info Card */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-4 sm:p-6 md:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="font-rutenia text-xl sm:text-2xl text-ivory mb-2 break-words">
                  {user.full_name || user.email}
                </h2>
                <div className="space-y-1 text-sage text-xs sm:text-sm">
                  <p className="break-all">📧 {user.email}</p>
                  {defaultAddress?.phone && (
                    <p>📞 {defaultAddress.phone}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full sm:w-auto mt-2 sm:mt-0"
              >
                {t.account.logout}
              </Button>
            </div>

            {/* Shipping Address / Paczkomat */}
            <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-3 sm:p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-ivory font-semibold text-sm sm:text-base">{t.account.shippingAddress}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenAddressModal(defaultAddress || undefined)}
                  className="text-xs"
                >
                  {defaultAddress ? 'Редагувати' : 'Додати адресу'}
                </Button>
              </div>
              {defaultAddress ? (
                defaultAddress.pickup_point_code ? (
                  <div className="text-sage text-xs sm:text-sm space-y-1">
                    <p className="font-semibold text-ivory break-words">{t.account.inpostPaczkomat} {defaultAddress.pickup_point_code}</p>
                    {defaultAddress.address_line1 && (
                      <p className="break-words">{defaultAddress.address_line1}</p>
                    )}
                    <p className="break-words">{defaultAddress.city}, {defaultAddress.postal_code}</p>
                    <p>{defaultAddress.country}</p>
                  </div>
                ) : (
                  <div className="text-sage text-xs sm:text-sm space-y-1">
                    <p className="break-words">{defaultAddress.full_name}</p>
                    <p className="break-words">{defaultAddress.address_line1}</p>
                    {defaultAddress.address_line2 && <p className="break-words">{defaultAddress.address_line2}</p>}
                    <p className="break-words">{defaultAddress.city}, {defaultAddress.postal_code}</p>
                    <p>{defaultAddress.country}</p>
                    {defaultAddress.phone && <p className="mt-2">📞 {defaultAddress.phone}</p>}
                  </div>
                )
              ) : (
                <p className="text-sage text-xs sm:text-sm">Адреса не вказана</p>
              )}
            </div>

            {/* Loyalty Status with Progress Bar */}
            {bonusInfo && (
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-3">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Status Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-sage/30">
                        <Image
                          src={getLoyaltyStatusImage(bonusInfo.current_status.name)}
                          alt={getLoyaltyStatusName(bonusInfo.current_status.name)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>
                    </div>
                    {/* Status Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-ivory font-semibold mb-1 text-sm sm:text-base">
                        {t.account.loyaltyStatus} {getLoyaltyStatusName(bonusInfo.current_status.name)}
                      </h3>
                      <p className="text-sage text-xs line-clamp-2">{bonusInfo.current_status.description}</p>
                    </div>
                  </div>
                  {/* Bonus Points */}
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-ivory font-semibold text-base sm:text-lg">
                      {bonusInfo.bonus_points.toFixed(2)} {t.account.bonusPoints}
                    </div>
                    <div className="text-sage text-xs">{t.account.bonusPointsLabel}</div>
                  </div>
                </div>
                
                {bonusInfo.progress && bonusInfo.next_status && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-sage mb-2">
                      <span>{t.account.toStatus} "{bonusInfo.progress.next_status}"</span>
                      <span>{bonusInfo.progress.current.toFixed(2)} / {bonusInfo.next_status.min_spent} zł</span>
                    </div>
                    <div className="w-full bg-deep-black rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-oxblood h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, bonusInfo.progress.percent)}%` }}
                      />
                    </div>
                    <p className="text-sage text-xs mt-2">
                      {t.account.remaining} {bonusInfo.progress.needed.toFixed(2)} zł
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-3 sm:p-4">
                <div className="text-sage text-xs sm:text-sm mb-1">{t.account.totalOrders}</div>
                <div className="text-ivory font-semibold text-base sm:text-lg">{user.total_orders}</div>
              </div>
              <div className="bg-deep-black/50 border border-sage/20 rounded-sm p-3 sm:p-4">
                <div className="text-sage text-xs sm:text-sm mb-1">{t.account.inProcessing}</div>
                <div className="text-ivory font-semibold text-base sm:text-lg">{user.pending_orders}</div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-4 sm:p-6 md:p-8">
            <h2 className="font-rutenia text-xl sm:text-2xl text-ivory mb-4 sm:mb-6">{t.account.myOrders}</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sage mb-4">{t.account.noOrders}</p>
                <Link href="/collections">
                  <Button>{t.account.goToCatalog}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const tracking = trackingData[order.order_number];
                  return (
                    <div
                      key={order.id}
                      className="bg-deep-black/50 border border-sage/20 rounded-sm p-3 sm:p-4 hover:border-sage/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-ivory font-semibold mb-1 text-sm sm:text-base break-words">
                            {t.account.orderNumber}{order.order_number}
                          </div>
                          <div className="text-sage text-xs sm:text-sm">
                            {new Date(order.created_at).toLocaleDateString('uk-UA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-sage text-xs sm:text-sm mt-1">
                            {order.items_count} {order.items_count === 1 ? t.account.item : t.account.items}
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                          <div className="text-ivory font-semibold text-base sm:text-lg">
                            {order.total.toFixed(2)} zł
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2 sm:px-3 py-1 rounded-sm text-xs whitespace-nowrap ${
                              order.status === 'completed' || order.status === 'delivered'
                                ? 'bg-sage/20 text-sage' 
                                : 'bg-oxblood/20 text-oxblood'
                            }`}>
                              {order.status === 'completed' || order.status === 'delivered' 
                                ? t.account.status.completed
                                : order.status === 'shipped' 
                                ? t.account.status.shipped
                                : t.account.status.inProcessing}
                            </span>
                            <span className={`px-2 sm:px-3 py-1 rounded-sm text-xs whitespace-nowrap ${
                              order.payment_status === 'paid' || order.payment_status === 'completed'
                                ? 'bg-sage/20 text-sage' 
                                : 'bg-oxblood/20 text-oxblood'
                            }`}>
                              {order.payment_status === 'paid' || order.payment_status === 'completed' 
                                ? t.account.status.paid
                                : t.account.status.notPaid}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.tracking_number && (
                        <div className="mt-4 pt-4 border-t border-sage/20">
                          <div className="mb-2">
                            <p className="text-ivory text-xs sm:text-sm font-semibold break-words">
                              {t.account.tracking} {order.tracking_number}
                            </p>
                            {order.tracking_url && (
                              <a
                                href={order.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-oxblood hover:text-oxblood/80 text-xs underline break-words inline-block mt-1"
                              >
                                {t.account.openOnCarrierSite}
                              </a>
                            )}
                          </div>
                          
                          {tracking && tracking.events && tracking.events.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-sage text-xs font-semibold">{t.account.trackingHistory}</p>
                              <div className="space-y-1">
                                {tracking.events.slice(0, 3).map((event, idx) => (
                                  <div key={idx} className="text-sage text-xs pl-3 sm:pl-4 border-l-2 border-sage/30">
                                    <p className="text-ivory break-words">{event.description || event.status}</p>
                                    <p className="text-sage/70 text-xs break-words">
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

      {/* Address Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-deep-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-footer-black border border-sage/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-cinzel text-2xl text-ivory">
                  {editingAddress ? 'Редагувати адресу' : 'Додати адресу'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    setEditingAddress(null);
                  }}
                  className="text-sage hover:text-oxblood transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-ivory font-inter mb-2">
                    {t.checkout?.fullName || 'Повне ім\'я'} <span className="text-oxblood">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.full_name}
                    onChange={(e) => setAddressFormData({ ...addressFormData, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  />
                </div>

                <div>
                  <label className="block text-ivory font-inter mb-2">
                    {t.checkout?.phone || 'Телефон'}
                  </label>
                  <input
                    type="tel"
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  />
                </div>

                <div>
                  <label className="block text-ivory font-inter mb-2">
                    Адреса <span className="text-oxblood">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.address_line1}
                    onChange={(e) => setAddressFormData({ ...addressFormData, address_line1: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  />
                </div>

                <div>
                  <label className="block text-ivory font-inter mb-2">
                    Адреса (додатково)
                  </label>
                  <input
                    type="text"
                    value={addressFormData.address_line2}
                    onChange={(e) => setAddressFormData({ ...addressFormData, address_line2: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      {t.checkout?.city || 'Місто'} <span className="text-oxblood">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.city}
                      onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                    />
                  </div>

                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      {t.checkout?.postalCode || 'Поштовий індекс'} <span className="text-oxblood">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.postal_code}
                      onChange={(e) => setAddressFormData({ ...addressFormData, postal_code: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ivory font-inter mb-2">
                    {t.checkout?.country || 'Країна'} <span className="text-oxblood">*</span>
                  </label>
                  <select
                    required
                    value={addressFormData.country}
                    onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  >
                    <option value="PL">Poland</option>
                    <option value="UA">Ukraine</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="PT">Portugal</option>
                    <option value="LU">Luxembourg</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={addressFormData.is_default}
                    onChange={(e) => setAddressFormData({ ...addressFormData, is_default: e.target.checked })}
                    className="w-4 h-4 text-oxblood bg-deep-black border-sage/30 rounded focus:ring-oxblood"
                  />
                  <label htmlFor="is_default" className="text-ivory font-inter">
                    Встановити як адресу за замовчуванням
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    className="flex-1"
                  >
                    {savingAddress ? 'Збереження...' : 'Зберегти'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsAddressModalOpen(false);
                      setEditingAddress(null);
                    }}
                    className="flex-1"
                  >
                    Скасувати
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
