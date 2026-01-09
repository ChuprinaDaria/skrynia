'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, isCartOpen, openCart, closeCart } = useCart();
  const { t } = useLanguage();

  // Open cart drawer when page loads
  React.useEffect(() => {
    if (!isCartOpen) {
      openCart();
    }
  }, [isCartOpen, openCart]);

  // Handle cart close - redirect to home
  const handleCloseCart = () => {
    closeCart();
    // Wait a bit for drawer animation, then redirect to home
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  const breadcrumbs = [
    { label: t.product.breadcrumb.home, href: '/' },
    { label: t.cart.title, href: '/cart' },
  ];

  return (
    <div className="min-h-screen bg-deep-black">
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      {/* Fallback content if drawer doesn't open */}
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-20">
        <Breadcrumbs items={breadcrumbs} />
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-rutenia text-4xl text-ivory mb-4">{t.cart.title}</h1>
          <p className="text-sage mb-6">{t.cart.empty.message || 'Ваш кошик порожній'}</p>
          <Link href="/">
            <Button variant="primary">
              {t.cart.empty.continue || 'Повернутися на головну'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

