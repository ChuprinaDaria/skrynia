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

type PaymentMethod = 'stripe' | 'przelewy24' | 'blik' | 'bank_transfer';
type DeliveryMethod = 'inpost' | 'novaposhta' | 'poczta' | 'courier';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('inpost');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState('');
  const [showInPostMap, setShowInPostMap] = useState(false);
  const [selectedInPostPoint, setSelectedInPostPoint] = useState<InPostPoint | null>(null);
  
  // Get InPost token from environment (available at build time)
  const inpostToken = process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN || '';
  const hasInPostToken = !!inpostToken;

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
    payment_method: 'przelewy24' as PaymentMethod,
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
        // InPost Paczkomat prices (Poland)
        if (country === 'PL') {
          if (packageSize === 'small') return 13.99;
          if (packageSize === 'medium') return 15.99;
          return 18.99;
        }
        return 25; // InPost international

      case 'novaposhta':
        // Nova Poshta (Ukraine)
        if (country === 'UA') {
          if (packageSize === 'small') return 45;
          if (packageSize === 'medium') return 55;
          return 70;
        }
        return 0; // Not available for other countries

      case 'poczta':
        // Poczta Polska
        if (country === 'PL') return 14.99;
        if (country === 'UA') return 35;
        return 25; // EU countries

      case 'courier':
        // Courier delivery
        if (country === 'PL') return 20;
        if (country === 'UA') return 50;
        return 35; // EU countries

      default:
        return 50;
    }
  };

  const shipping = calculateShippingCost();
  const total = subtotal + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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

      // Clear cart
      clearCart();

      // Redirect to payment or success page
      if (order.payment_intent_id) {
        // Redirect to payment page
        router.push(`/payment/${order.payment_intent_id}`);
      } else {
        // Redirect to success page
        router.push(`/order-success?order=${order.order_number}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.checkout.errors.defaultError);
      console.error('Checkout error:', err);
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
                        if (newCountry === 'PL' && deliveryMethod !== 'inpost' && deliveryMethod !== 'poczta' && deliveryMethod !== 'courier') {
                          setDeliveryMethod('inpost');
                        } else if (newCountry === 'UA' && deliveryMethod !== 'novaposhta' && deliveryMethod !== 'courier') {
                          setDeliveryMethod('novaposhta');
                        }
                      }}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    >
                      {/* EU Countries */}
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
                      {/* Non-EU */}
                      <option value="UA">{t.checkout.countries.UA}</option>
                      <option value="GB">{t.checkout.countries.GB}</option>
                      <option value="US">{t.checkout.countries.US}</option>
                    </select>
                  </div>

                  {/* Delivery Method Selection */}
                  <div>
                    <label className="block text-ivory font-inter mb-3">
                      {t.checkout.deliveryMethod} <span className="text-oxblood">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* InPost Paczkomat */}
                      {formData.shipping_country === 'PL' && (
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
                                Odbiór z paczkomatu • {calculatePackageSize() === 'small' ? '13.99' : calculatePackageSize() === 'medium' ? '15.99' : '18.99'} zł
                              </p>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Nova Poshta */}
                      {formData.shipping_country === 'UA' && (
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('novaposhta')}
                          className={`p-4 border-2 rounded-sm text-left transition-all ${
                            deliveryMethod === 'novaposhta'
                              ? 'border-oxblood bg-oxblood/10'
                              : 'border-sage/30 hover:border-sage/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                              deliveryMethod === 'novaposhta' ? 'border-oxblood bg-oxblood' : 'border-sage/50'
                            }`}>
                              {deliveryMethod === 'novaposhta' && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-ivory"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-ivory font-semibold mb-1">Нова Пошта</p>
                              <p className="text-sage text-xs">
                                Відділення Нової Пошти • {calculatePackageSize() === 'small' ? '45' : calculatePackageSize() === 'medium' ? '55' : '70'} грн
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
                              {formData.shipping_country === 'UA' ? 'Кур\'єр' : 'Kurier'}
                            </p>
                            <p className="text-sage text-xs">
                              {formData.shipping_country === 'PL' && 'Dostawa kurierem • 20 zł'}
                              {formData.shipping_country === 'UA' && 'Кур\'єрська доставка • 50 грн'}
                              {formData.shipping_country !== 'PL' && formData.shipping_country !== 'UA' && 'Courier delivery • 35 zł'}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* InPost / Nova Poshta Pickup Point Selection */}
                  {(deliveryMethod === 'inpost' || deliveryMethod === 'novaposhta') && (
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
                                <div className="border border-sage/30 rounded-sm overflow-hidden" style={{ minHeight: '500px' }}>
                                  <InPostGeowidget
                                    token={inpostToken}
                                    version="international"
                                    country="PL"
                                    language="pl"
                                    config="parcelCollect"
                                    sandbox={process.env.NEXT_PUBLIC_INPOST_SANDBOX === 'true'}
                                    onPointSelect={(point: InPostPoint) => {
                                      setSelectedInPostPoint(point);
                                      // Extract point code from name (e.g., "WAW01M" from "Paczkomat InPost WAW01M")
                                      const pointCode = point.name.match(/[A-Z]{3}\d{2}[A-Z]/)?.[0] || point.name;
                                      setSelectedPickupPoint(pointCode);
                                      setShowInPostMap(false);
                                    }}
                                  />
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
                        ) : (
                          <>
                            {/* Nova Poshta - manual input for now */}
                            <input
                              type="text"
                              required
                              value={selectedPickupPoint}
                              onChange={(e) => setSelectedPickupPoint(e.target.value)}
                              placeholder="Введіть номер відділення (напр. Відділення №1)"
                              className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                            />
                            <div className="p-3 bg-sage/10 border border-sage/30 rounded-sm">
                              <p className="text-sage text-xs">
                                💡 Незабаром ви зможете обрати відділення з карти.
                                Поки що введіть адресу відділення вручну.
                              </p>
                            </div>
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
                          {formData.shipping_country === 'UA' ? 'Адреса' : 'Adres'} <span className="text-oxblood">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shipping_address_line1}
                          onChange={(e) => setFormData({ ...formData, shipping_address_line1: e.target.value })}
                          placeholder={formData.shipping_country === 'UA' ? 'вул. Хрещатик, 1' : 'ul. Główna 1'}
                          className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                        />
                      </div>
                      <div>
                        <label className="block text-ivory font-inter mb-2">
                          {formData.shipping_country === 'UA' ? 'Адреса (додатково)' : 'Adres (dodatkowy)'}
                        </label>
                        <input
                          type="text"
                          value={formData.shipping_address_line2}
                          onChange={(e) => setFormData({ ...formData, shipping_address_line2: e.target.value })}
                          placeholder={formData.shipping_country === 'UA' ? 'Квартира, офіс' : 'Mieszkanie, biuro'}
                          className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-ivory font-inter mb-2">
                            {formData.shipping_country === 'UA' ? 'Місто' : 'Miasto'} <span className="text-oxblood">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.shipping_city}
                            onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                            placeholder={formData.shipping_country === 'UA' ? 'Київ' : 'Warszawa'}
                            className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                          />
                        </div>
                        <div>
                          <label className="block text-ivory font-inter mb-2">
                            {formData.shipping_country === 'UA' ? 'Поштовий індекс' : 'Kod pocztowy'} <span className="text-oxblood">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.shipping_postal_code}
                            onChange={(e) => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                            placeholder={formData.shipping_country === 'UA' ? '01001' : '00-001'}
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

              {/* Payment Method */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <h2 className="font-rutenia text-2xl text-ivory mb-6">{t.checkout.paymentMethod}</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-sage/30 rounded-sm cursor-pointer hover:border-oxblood/50 transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="przelewy24"
                      checked={formData.payment_method === 'przelewy24'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                      className="w-5 h-5 accent-oxblood"
                    />
                    <span className="text-ivory font-inter">{t.checkout.paymentP24}</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-sage/30 rounded-sm cursor-pointer hover:border-oxblood/50 transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="stripe"
                      checked={formData.payment_method === 'stripe'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                      className="w-5 h-5 accent-oxblood"
                    />
                    <span className="text-ivory font-inter">{t.checkout.paymentStripe}</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-sage/30 rounded-sm cursor-pointer hover:border-oxblood/50 transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="blik"
                      checked={formData.payment_method === 'blik'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                      className="w-5 h-5 accent-oxblood"
                    />
                    <span className="text-ivory font-inter">{t.checkout.paymentBLIK}</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-sage/30 rounded-sm cursor-pointer hover:border-oxblood/50 transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      checked={formData.payment_method === 'bank_transfer'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                      className="w-5 h-5 accent-oxblood"
                    />
                    <span className="text-ivory font-inter">{t.checkout.paymentBankTransfer}</span>
                  </label>
                </div>
              </div>

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
                    <span className="text-ivory font-bold">{total} zł</span>
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

