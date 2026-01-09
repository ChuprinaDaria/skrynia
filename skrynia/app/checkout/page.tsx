'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

type PaymentMethod = 'stripe' | 'przelewy24' | 'blik' | 'bank_transfer';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
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
        throw new Error(errorData.detail || 'Помилка створення замовлення');
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
      setError(err instanceof Error ? err.message : 'Помилка оформлення замовлення');
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
            Оформлення замовлення
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <h2 className="font-rutenia text-2xl text-ivory mb-6">Контактна інформація</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Email <span className="text-oxblood">*</span>
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
                      Ім'я та прізвище <span className="text-oxblood">*</span>
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
                    <label className="block text-ivory font-inter mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <h2 className="font-rutenia text-2xl text-ivory mb-6">Адреса доставки</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Адреса <span className="text-oxblood">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shipping_address_line1}
                      onChange={(e) => setFormData({ ...formData, shipping_address_line1: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">Адреса (додатково)</label>
                    <input
                      type="text"
                      value={formData.shipping_address_line2}
                      onChange={(e) => setFormData({ ...formData, shipping_address_line2: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ivory font-inter mb-2">
                        Місто <span className="text-oxblood">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping_city}
                        onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                      />
                    </div>
                    <div>
                      <label className="block text-ivory font-inter mb-2">
                        Поштовий індекс <span className="text-oxblood">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping_postal_code}
                        onChange={(e) => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Країна <span className="text-oxblood">*</span>
                    </label>
                    <select
                      required
                      value={formData.shipping_country}
                      onChange={(e) => setFormData({ ...formData, shipping_country: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                    >
                      <option value="PL">Польща</option>
                      <option value="UA">Україна</option>
                      <option value="DE">Німеччина</option>
                      <option value="GB">Великобританія</option>
                      <option value="US">США</option>
                    </select>
                  </div>
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
                    Адреса оплати така ж, як адреса доставки
                  </label>
                </div>
                {!formData.billing_same_as_shipping && (
                  <div className="space-y-4">
                    <h3 className="font-rutenia text-xl text-ivory mb-4">Адреса оплати</h3>
                    <div>
                      <label className="block text-ivory font-inter mb-2">Адреса</label>
                      <input
                        type="text"
                        value={formData.billing_address_line1}
                        onChange={(e) => setFormData({ ...formData, billing_address_line1: e.target.value })}
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-ivory font-inter mb-2">Місто</label>
                        <input
                          type="text"
                          value={formData.billing_city}
                          onChange={(e) => setFormData({ ...formData, billing_city: e.target.value })}
                          className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50"
                        />
                      </div>
                      <div>
                        <label className="block text-ivory font-inter mb-2">Поштовий індекс</label>
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
                <h2 className="font-rutenia text-2xl text-ivory mb-6">Спосіб оплати</h2>
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
                    <span className="text-ivory font-inter">Przelewy24</span>
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
                    <span className="text-ivory font-inter">Stripe (Картка)</span>
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
                    <span className="text-ivory font-inter">BLIK</span>
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
                    <span className="text-ivory font-inter">Банківський переказ</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <label className="block text-ivory font-inter mb-2">Примітки до замовлення</label>
                <textarea
                  rows={4}
                  value={formData.customer_notes}
                  onChange={(e) => setFormData({ ...formData, customer_notes: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 resize-none"
                  placeholder="Додаткові побажання або інформація..."
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6 sticky top-24">
                <h2 className="font-rutenia text-2xl text-ivory mb-6">Ваше замовлення</h2>
                
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
                    <span className="text-sage">Підсумок</span>
                    <span className="text-ivory">{subtotal} zł</span>
                  </div>
                  <div className="flex justify-between font-inter text-sm">
                    <span className="text-sage">Доставка</span>
                    <span className="text-ivory">
                      {shipping === 0 ? 'Безкоштовно' : `${shipping} zł`}
                    </span>
                  </div>
                  <div className="h-px bg-sage/20" />
                  <div className="flex justify-between font-inter text-lg">
                    <span className="text-ivory font-semibold">Всього</span>
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
                  {loading ? 'Обробка...' : 'Оформити замовлення'}
                </Button>

                <Link
                  href="/cart"
                  className="block text-center text-sage hover:text-ivory font-inter text-sm transition-colors"
                >
                  ← Повернутися до кошика
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

