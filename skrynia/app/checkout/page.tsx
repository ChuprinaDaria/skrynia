'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';
import { InPostGeowidget, InPostPoint } from '@/components/shipping/InPostGeowidget';
import { trackInitiateCheckout } from '@/lib/facebook-conversions';

type DeliveryMethod = 'inpost' | 'novaposhta' | 'poczta' | 'courier';

// InPost supported countries (including international)
const INPOST_SUPPORTED_COUNTRIES = ['PL', 'BE', 'IT', 'FR', 'LU', 'PT', 'ES', 'NL'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, total, closeCart } = useCart();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('inpost');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState('');
  const [showInPostMap, setShowInPostMap] = useState(false);
  const [selectedInPostPoint, setSelectedInPostPoint] = useState<InPostPoint | null>(null);
  
  // Get InPost token from environment (available at build time)
  const inpostToken = process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN || '';
  const hasInPostToken = !!inpostToken;

  // Close cart drawer when on checkout page (to avoid confusion)
  useEffect(() => {
    closeCart();
  }, [closeCart]);

  // Meta Pixel: Track InitiateCheckout when page loads
  useEffect(() => {
    if (items.length > 0) {
      const contentIds = items.map(item => item.id);
      const contents = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price,
      }));
      const numItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const currency = items[0]?.currency || 'PLN';
      
      // Client-side tracking (Meta Pixel)
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_ids: contentIds,
          contents: contents,
          value: total,
          currency: currency,
          num_items: numItems,
        });
      }
      
      // Server-side tracking (Conversions API)
      trackInitiateCheckout({
        content_ids: contentIds,
        contents: contents,
        value: total,
        currency: currency,
        num_items: numItems,
      }).catch(() => {
        // Fail silently
      });
    }
  }, []); // Only run once on mount

  // Form state - moved before functions that use it
  const [formData, setFormData] = useState({
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_country: 'PL',
    billing_same_as_shipping: true,
    billing_address_line1: '',
    billing_address_line2: '',
    billing_city: '',
    billing_postal_code: '',
    billing_country: 'PL',
    payment_method: 'stripe', // Only Stripe is supported
    customer_notes: '',
    bonus_points_used: 0,
  });

  // Calculate package size based on cart items (simplified)
  const calculatePackageSize = () => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    if (itemCount <= 2) return 'small'; // A
    if (itemCount <= 5) return 'medium'; // B
    return 'large'; // C
  };

  // Calculate shipping cost based on method, destination, and package size
  const calculateShippingCost = () => {
    const packageSize = calculatePackageSize();
    const country = formData.shipping_country;

    switch (deliveryMethod) {
      case 'inpost':
        // InPost Paczkomat prices (Poland) - only Size A available
        if (country === 'PL') {
          return 16.99; // Size A only for Poland
        }
        // InPost international prices (EU countries) - only Size B available in PLN
        return 49.99; // Size B only for international

      case 'poczta':
        // Poczta Polska
        if (country === 'PL') return 14.99;
        return 25; // EU countries

      case 'courier':
        // Courier delivery
        if (country === 'PL') return 20;
        return 80; // EU courier delivery

      default:
        return 50;
    }
  };

  const shipping = calculateShippingCost();
  const checkoutTotal = subtotal + shipping;

  // Redirect if cart is empty (but not during checkout process or if there's an error)
  useEffect(() => {
    // Don't redirect if:
    // 1. Currently processing checkout (loading)
    // 2. There's an error (user should see the error)
    // 3. We have a pending order (checkout in progress)
    const hasPendingOrder = typeof window !== 'undefined' && sessionStorage.getItem('pendingOrderNumber');
    if (items.length === 0 && !loading && !error && !hasPendingOrder) {
      router.push('/cart');
    }
  }, [items, router, loading, error]);

  // Load user profile data if logged in
  useEffect(() => {
    const loadUserData = async () => {
      const userToken = localStorage.getItem('user_token');
      if (!userToken) return;

      try {
        const response = await fetch(getApiEndpoint('/api/v1/users/me'), {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Load default address (if exists)
          // Use userData.default_address if available (from /users/me endpoint)
          if (userData.default_address) {
            const addressData = userData.default_address;
            setFormData(prev => ({
              ...prev,
              customer_email: userData.email || prev.customer_email,
              customer_name: userData.full_name || prev.customer_name,
              customer_phone: addressData.phone || userData.phone || prev.customer_phone,
              shipping_address_line1: addressData.address_line1 || prev.shipping_address_line1,
              shipping_address_line2: addressData.address_line2 || prev.shipping_address_line2,
              shipping_city: addressData.city || prev.shipping_city,
              shipping_postal_code: addressData.postal_code || prev.shipping_postal_code,
              shipping_country: addressData.country || prev.shipping_country,
            }));

            // Set delivery method based on country and InPost support
            if (addressData.country && INPOST_SUPPORTED_COUNTRIES.includes(addressData.country)) {
              setDeliveryMethod('inpost');
            }

            // If InPost locker is selected
            if (addressData.inpost_locker_id) {
              setSelectedPickupPoint(addressData.inpost_locker_id);
            }
          } else {
            // No default address - use user data only
            setFormData(prev => ({
              ...prev,
              customer_email: userData.email || prev.customer_email,
              customer_name: userData.full_name || prev.customer_name,
              customer_phone: userData.phone || prev.customer_phone,
            }));
          }
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    loadUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Log for debugging
    console.log('[Checkout] Starting checkout process, items count:', items.length);

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      // Prepare order data
      const orderData = {
        customer_email: formData.customer_email,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone || null,
        shipping_address_line1: formData.shipping_address_line1,
        shipping_address_line2: formData.shipping_address_line2 || null,
        shipping_city: formData.shipping_city,
        shipping_postal_code: formData.shipping_postal_code,
        shipping_country: formData.shipping_country,
        billing_address_line1: formData.billing_same_as_shipping 
          ? formData.shipping_address_line1 
          : (formData.billing_address_line1 || null),
        billing_address_line2: formData.billing_same_as_shipping 
          ? formData.shipping_address_line2 
          : (formData.billing_address_line2 || null),
        billing_city: formData.billing_same_as_shipping 
          ? formData.shipping_city 
          : (formData.billing_city || null),
        billing_postal_code: formData.billing_same_as_shipping 
          ? formData.shipping_postal_code 
          : (formData.billing_postal_code || null),
        billing_country: formData.billing_same_as_shipping 
          ? formData.shipping_country 
          : (formData.billing_country || null),
        payment_method: formData.payment_method,
        customer_notes: formData.customer_notes || null,
        bonus_points_used: formData.bonus_points_used || 0,
        items: orderItems,
      };

      // Get user token if logged in
      const userToken = localStorage.getItem('user_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }

      // Create order
      const response = await fetch(getApiEndpoint('/api/v1/orders/'), {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.checkout.errors.defaultError);
      }

      const order = await response.json();
      console.log('[Checkout] Order created:', order.order_number, 'Items count before checkout session:', items.length);

      // NEVER clear cart in checkout - only after successful payment
      // Store order number for cart clearing after payment
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingOrderNumber', order.order_number);
      }

      // Create Stripe checkout session
      const checkoutResponse = await fetch(getApiEndpoint('/api/v1/payments/create-checkout-session'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {}),
        },
        body: JSON.stringify({ order_id: order.id }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.detail || 'Failed to create payment session');
      }

      const { checkout_url } = await checkoutResponse.json();
      console.log('[Checkout] Checkout session created, redirecting to:', checkout_url);
      console.log('[Checkout] Items count before redirect:', items.length);
      
      // Redirect to Stripe checkout
      // Use window.location.replace to prevent back button issues
      if (checkout_url) {
        // Small delay to ensure state is saved
        setTimeout(() => {
          window.location.replace(checkout_url);
        }, 100);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      // On error, don't clear cart and show error message
      setError(err instanceof Error ? err.message : t.checkout.errors.defaultError);
      console.error('Checkout error:', err);
      // Clear pending order flag on error
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pendingOrderNumber');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-8">
            {t.checkout.title}
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <h2 className="font-rutenia text-2xl text-ivory mb-6">{t.checkout.contactInfo}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      {t.checkout.email} <span className="text-oxblood">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      {t.checkout.fullName} <span className="text-oxblood">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">{t.checkout.phone}</label>
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method & Address */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <h2 className="font-rutenia text-2xl text-ivory mb-6">{t.checkout.delivery}</h2>
                <div className="space-y-6">
                  {/* Country Selection */}
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      {t.checkout.country} <span className="text-oxblood">*</span>
                    </label>
                    <select
                      required
                      value={formData.shipping_country}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setFormData({ ...formData, shipping_country: newCountry });
                        // Auto-select appropriate delivery method for country
                        if (INPOST_SUPPORTED_COUNTRIES.includes(newCountry) && !['inpost', 'poczta', 'courier'].includes(deliveryMethod)) {
                          setDeliveryMethod('inpost');
                        } else if (!INPOST_SUPPORTED_COUNTRIES.includes(newCountry) && deliveryMethod === 'inpost') {
                          setDeliveryMethod('courier');
                        }
                      }}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    >
                      {/* EU Countries Only */}
                      <option value="AT">{t.checkout.countries.AT}</option>
                      <option value="BE">{t.checkout.countries.BE}</option>
                      <option value="BG">{t.checkout.countries.BG}</option>
                      <option value="HR">{t.checkout.countries.HR}</option>
                      <option value="CY">{t.checkout.countries.CY}</option>
                      <option value="CZ">{t.checkout.countries.CZ}</option>
                      <option value="DK">{t.checkout.countries.DK}</option>
                      <option value="EE">{t.checkout.countries.EE}</option>
                      <option value="FI">{t.checkout.countries.FI}</option>
                      <option value="FR">{t.checkout.countries.FR}</option>
                      <option value="DE">{t.checkout.countries.DE}</option>
                      <option value="GR">{t.checkout.countries.GR}</option>
                      <option value="HU">{t.checkout.countries.HU}</option>
                      <option value="IE">{t.checkout.countries.IE}</option>
                      <option value="IT">{t.checkout.countries.IT}</option>
                      <option value="LV">{t.checkout.countries.LV}</option>
                      <option value="LT">{t.checkout.countries.LT}</option>
                      <option value="LU">{t.checkout.countries.LU}</option>
                      <option value="MT">{t.checkout.countries.MT}</option>
                      <option value="NL">{t.checkout.countries.NL}</option>
                      <option value="PL">{t.checkout.countries.PL}</option>
                      <option value="PT">{t.checkout.countries.PT}</option>
                      <option value="RO">{t.checkout.countries.RO}</option>
                      <option value="SK">{t.checkout.countries.SK}</option>
                      <option value="SI">{t.checkout.countries.SI}</option>
                      <option value="ES">{t.checkout.countries.ES}</option>
                      <option value="SE">{t.checkout.countries.SE}</option>
                    </select>
                    <p className="text-sage text-xs mt-2">
                      {t.checkout.euOnlyDelivery || 'Доставка тільки по країнах ЄС. Для медіа-запитів звертайтесь на email.'}
                    </p>
                  </div>

                  {/* Delivery Method Selection */}
                  <div>
                    <label className="block text-ivory font-inter mb-3">
                      {t.checkout.deliveryMethod} <span className="text-oxblood">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* InPost Paczkomat */}
                      {INPOST_SUPPORTED_COUNTRIES.includes(formData.shipping_country) && (
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('inpost')}
                          className={`p-4 border-2 rounded-sm text-left transition-all ${
                            deliveryMethod === 'inpost'
                              ? 'border-oxblood bg-oxblood/10'
                              : 'border-sage/30 hover:border-sage/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                              deliveryMethod === 'inpost' ? 'border-oxblood bg-oxblood' : 'border-sage/50'
                            }`}>
                              {deliveryMethod === 'inpost' && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-ivory"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-ivory font-semibold mb-1">InPost Paczkomat</p>
                              <p className="text-sage text-xs">
                                {formData.shipping_country === 'PL' 
                                  ? `Odbiór z paczkomatu • ${calculateShippingCost()} zł`
                                  : `InPost pickup point • ${calculateShippingCost()} PLN`
                                }
                              </p>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Poczta Polska */}
                      {formData.shipping_country === 'PL' && (
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('poczta')}
                          className={`p-4 border-2 rounded-sm text-left transition-all ${
                            deliveryMethod === 'poczta'
                              ? 'border-oxblood bg-oxblood/10'
                              : 'border-sage/30 hover:border-sage/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                              deliveryMethod === 'poczta' ? 'border-oxblood bg-oxblood' : 'border-sage/50'
                            }`}>
                              {deliveryMethod === 'poczta' && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-ivory"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-ivory font-semibold mb-1">Poczta Polska</p>
                              <p className="text-sage text-xs">Dostawa do domu • 14.99 zł</p>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Courier */}
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('courier')}
                        className={`p-4 border-2 rounded-sm text-left transition-all ${
                          deliveryMethod === 'courier'
                            ? 'border-oxblood bg-oxblood/10'
                            : 'border-sage/30 hover:border-sage/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                            deliveryMethod === 'courier' ? 'border-oxblood bg-oxblood' : 'border-sage/50'
                          }`}>
                            {deliveryMethod === 'courier' && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-ivory"></div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-ivory font-semibold mb-1">
                              {formData.shipping_country === 'PL' ? 'Kurier' : 'Courier'}
                            </p>
                            <p className="text-sage text-xs">
                              {formData.shipping_country === 'PL' ? 'Dostawa kurierem • 20 zł' : `Courier delivery • ${calculateShippingCost()} zł`}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* InPost Pickup Point Selection */}
                  {deliveryMethod === 'inpost' && (
                    <div>
                      <label className="block text-ivory font-inter mb-2">
                        {deliveryMethod === 'inpost' ? 'Paczkomat' : 'Відділення'} <span className="text-oxblood">*</span>
                      </label>
                      <div className="space-y-3">
                        {deliveryMethod === 'inpost' ? (
                          <>
                            {/* InPost Map Widget */}
                            {showInPostMap && hasInPostToken ? (
                              <div className="space-y-3">
                                <div 
                                  className="border border-sage/30 rounded-sm"
                                  style={{ 
                                    height: '600px',
                                    width: '100%',
                                    position: 'relative',
                                    overflow: 'visible'
                                  }}
                                >
                                  <div style={{ height: '100%', width: '100%' }}>
                                    <InPostGeowidget
                                      token={inpostToken}
                                      version={formData.shipping_country === 'PL' ? 'v5' : 'international'}
                                      country={formData.shipping_country === 'PL' ? undefined : INPOST_SUPPORTED_COUNTRIES.join(',')}
                      language={
                        language === 'EN' ? 'en' : 
                        language === 'FR' ? 'fr' : 
                        language === 'PL' ? 'pl' : 
                        ['IT', 'ES', 'PT'].includes(language as string) ? (language as string).toLowerCase() as 'it' | 'es' | 'pt' :
                        language === 'DE' ? 'en' : 
                        language === 'SE' ? 'en' : 
                        language === 'NO' ? 'en' : 
                        language === 'DK' ? 'en' : 
                        'pl'
                      }
                                      config="parcelCollect"
                                      sandbox={process.env.NEXT_PUBLIC_INPOST_SANDBOX === 'true'}
                                      onPointSelect={(point: InPostPoint) => {
                                        setSelectedInPostPoint(point);
                                        // Extract point code from name (e.g., "WAW01M" from "Paczkomat InPost WAW01M")
                                        // Try different patterns for different countries
                                        const pointCode = point.name.match(/[A-Z]{3}\d{2}[A-Z]/)?.[0] 
                                          || point.name.match(/[A-Z]{2,4}\d{2,3}[A-Z]?/)?.[0] 
                                          || point.name.split(' ').pop() 
                                          || point.name;
                                        setSelectedPickupPoint(pointCode);
                                        setShowInPostMap(false);
                                      }}
                                    />
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setShowInPostMap(false)}
                                  className="w-full"
                                >
                                  {t.checkout.cancel || 'Скасувати'}
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    required
                                    value={selectedPickupPoint}
                                    onChange={(e) => setSelectedPickupPoint(e.target.value)}
                                    placeholder="Wpisz kod paczkomatu (np. WAW01M) lub wybierz z mapy"
                                    className="flex-1 px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                                  />
                                  {hasInPostToken && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() => setShowInPostMap(true)}
                                      className="whitespace-nowrap"
                                    >
                                      {selectedInPostPoint ? t.checkout.changePoint || 'Змінити' : t.checkout.selectFromMap || 'Вибрати з карти'}
                                    </Button>
                                  )}
                                </div>
                                {selectedInPostPoint && (
                                  <div className="p-3 bg-sage/10 border border-sage/30 rounded-sm">
                                    <p className="text-sage text-sm">
                                      <strong className="text-ivory">Вибрано:</strong> {selectedInPostPoint.name}
                                      <br />
                                      <span className="text-xs">
                                        {selectedInPostPoint.address.street}, {selectedInPostPoint.address.city} {selectedInPostPoint.address.post_code}
                                      </span>
                                    </p>
                                  </div>
                                )}
                                {!hasInPostToken && (
                                  <div className="p-3 bg-sage/10 border border-sage/30 rounded-sm">
                                    <p className="text-sage text-xs">
                                      {t.checkout.paczkomatHint}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Full Address (for Courier and Poczta Polska) */}
                  {(deliveryMethod === 'courier' || deliveryMethod === 'poczta') && (
                    <>
                      <div>
                        <label className="block text-ivory font-inter mb-2">
                          {t.checkout.address || 'Adres'} <span className="text-oxblood">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shipping_address_line1}
                          onChange={(e) => setFormData({ ...formData, shipping_address_line1: e.target.value })}
                          placeholder={t.checkout.addressPlaceholder || 'ul. Główna 1'}
                          className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                        />
                      </div>
                      <div>
                        <label className="block text-ivory font-inter mb-2">
                          {t.checkout.address2 || 'Adres (dodatkowy)'}
                        </label>
                        <input
                          type="text"
                          value={formData.shipping_address_line2}
                          onChange={(e) => setFormData({ ...formData, shipping_address_line2: e.target.value })}
                          placeholder={t.checkout.address2Placeholder || 'Mieszkanie, biuro'}
                          className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-ivory font-inter mb-2">
                            {t.checkout.city || 'Miasto'} <span className="text-oxblood">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.shipping_city}
                            onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                            placeholder={t.checkout.cityPlaceholder || 'Warszawa'}
                            className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                          />
                        </div>
                        <div>
                          <label className="block text-ivory font-inter mb-2">
                            {t.checkout.postalCode || 'Kod pocztowy'} <span className="text-oxblood">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.shipping_postal_code}
                            onChange={(e) => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                            placeholder={t.checkout.postalCodePlaceholder || '00-001'}
                            className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                          />
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="billing_same"
                    checked={formData.billing_same_as_shipping}
                    onChange={(e) => setFormData({ ...formData, billing_same_as_shipping: e.target.checked })}
                    className="w-5 h-5 accent-oxblood"
                  />
                  <label htmlFor="billing_same" className="text-ivory font-inter cursor-pointer">
                    {t.checkout.billingSameAsShipping}
                  </label>
                </div>
                {!formData.billing_same_as_shipping && (
                  <div className="space-y-4">
                    <h3 className="font-rutenia text-xl text-ivory mb-4">{t.checkout.billingAddress}</h3>
                    <div>
                      <label className="block text-ivory font-inter mb-2">{t.checkout.address}</label>
                      <input
                        type="text"
                        value={formData.billing_address_line1}
                        onChange={(e) => setFormData({ ...formData, billing_address_line1: e.target.value })}
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-ivory font-inter mb-2">{t.checkout.city}</label>
                        <input
                          type="text"
                          value={formData.billing_city}
                          onChange={(e) => setFormData({ ...formData, billing_city: e.target.value })}
                          className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                        />
                      </div>
                      <div>
                        <label className="block text-ivory font-inter mb-2">{t.checkout.postalCode}</label>
                        <input
                          type="text"
                          value={formData.billing_postal_code}
                          onChange={(e) => setFormData({ ...formData, billing_postal_code: e.target.value })}
                          className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method - Stripe only, no UI needed */}

              {/* Notes */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <label className="block text-ivory font-inter mb-2">{t.checkout.orderNotes}</label>
                <textarea
                  rows={4}
                  value={formData.customer_notes}
                  onChange={(e) => setFormData({ ...formData, customer_notes: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 resize-none"
                  placeholder={t.checkout.orderNotesPlaceholder}
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6 sticky top-24">
                <h2 className="font-rutenia text-2xl text-ivory mb-6">{t.checkout.orderSummary}</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-deep-black rounded-sm overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-sage/40 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-ivory font-inter text-sm line-clamp-2">{item.title}</p>
                        <p className="text-sage font-inter text-xs">
                          {item.quantity} × {item.price} {item.currency}
                        </p>
                      </div>
                      <p className="text-ivory font-inter font-semibold text-sm">
                        {item.price * item.quantity} {item.currency}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pt-6 border-t border-sage/20">
                  <div className="flex justify-between font-inter text-sm">
                    <span className="text-sage">{t.checkout.subtotal}</span>
                    <span className="text-ivory">{subtotal} zł</span>
                  </div>
                  <div className="flex justify-between font-inter text-sm">
                    <span className="text-sage">{t.checkout.shipping}</span>
                    <span className="text-ivory">
                      {shipping} zł
                    </span>
                  </div>
                  <div className="h-px bg-sage/20" />
                  <div className="flex justify-between font-inter text-lg">
                    <span className="text-ivory font-semibold">{t.checkout.total}</span>
                    <span className="text-ivory font-bold">{checkoutTotal} zł</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-oxblood/20 border border-oxblood/50 rounded-sm text-oxblood text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={loading}
                  className="mb-4"
                >
                  {loading ? t.checkout.submitting : t.checkout.submit}
                </Button>

                <Link
                  href="/cart"
                  className="block text-center text-sage hover:text-ivory font-inter text-sm transition-colors"
                >
                  {t.checkout.backToCart}
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

