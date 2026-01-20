'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { getApiEndpoint } from '@/lib/api';
import { trackPurchase } from '@/lib/facebook-conversions';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { clearCart } = useCart();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      // Fetch order details
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  // Meta Pixel: Track Purchase when order is loaded
  useEffect(() => {
    if (order) {
      const contentIds = order.items?.map((item: any) => item.product_id?.toString() || item.product_sku) || [];
      const contents = order.items?.map((item: any) => ({
        id: item.product_id?.toString() || item.product_sku,
        quantity: item.quantity,
        item_price: item.price,
      })) || [];
      const numItems = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      const currency = order.currency || 'PLN';
      
      // Client-side tracking (Meta Pixel)
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Purchase', {
          content_ids: contentIds,
          contents: contents,
          value: order.total,
          currency: currency,
          num_items: numItems,
        });
      }
      
      // Server-side tracking (Conversions API)
      // Include user email if available for better matching
      const userData = order.customer_email ? {
        email: order.customer_email,
        external_id: order.customer_email, // Use email as external_id
      } : undefined;
      
      trackPurchase({
        content_ids: contentIds,
        contents: contents,
        value: order.total,
        currency: currency,
        num_items: numItems,
        user_data: userData,
      }).catch(() => {
        // Fail silently
      });
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(getApiEndpoint(`/api/v1/orders/${orderNumber}`), {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        
        // Clear cart when payment is successful (check both status and payment_status)
        // This ensures cart is cleared after successful payment
        const isPaid = data.payment_status === 'paid_partially' || 
                       data.payment_status === 'paid_fully' || 
                       data.payment_status === 'completed' ||
                       data.status === 'paid' || 
                       data.status === 'completed' || 
                       data.status === 'processing';
        
        if (isPaid) {
          clearCart();
          // Clear pending order number from sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('pendingOrderNumber');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-ivory text-xl font-cinzel">{t.orderSuccess.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-sage/20 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-sage"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
              {t.orderSuccess.title}
            </h1>
            {orderNumber && (
              <p className="text-sage font-inter text-lg">
                {t.orderSuccess.orderNumber}: <span className="text-ivory font-semibold">{orderNumber}</span>
              </p>
            )}
          </div>

          <div className="bg-footer-black border border-sage/20 rounded-sm p-8 mb-8 text-left">
            <p className="text-ivory font-inter mb-4">
              {t.orderSuccess.thankYou}
            </p>
            {order && (
              <div className="space-y-3 text-sage font-inter text-sm">
                <p>
                  <strong className="text-ivory">{t.orderSuccess.status}:</strong> {order.status}
                </p>
                <p>
                  <strong className="text-ivory">{t.orderSuccess.paymentMethod}:</strong> {order.payment_method}
                </p>
                <p>
                  <strong className="text-ivory">{t.orderSuccess.total}:</strong> {order.total} {order.currency}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary">{t.orderSuccess.backToHome}</Button>
            </Link>
            <Link href="/collections">
              <Button variant="secondary">{t.orderSuccess.viewCollections}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-ivory text-xl font-cinzel">Завантаження...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

