'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, isCartOpen, openCart, closeCart } = useCart();
  const { t } = useLanguage();

  // Open cart drawer when page loads
  React.useEffect(() => {
    if (!isCartOpen) {
      openCart();
    }
  }, [isCartOpen, openCart]);

  return (
    <div className="min-h-screen bg-deep-black">
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      {/* Fallback content if drawer doesn't open */}
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-rutenia text-4xl text-ivory mb-4">{t.cart.title}</h1>
          <p className="text-sage">{t.cart.empty || 'Ваш кошик порожній'}</p>
        </div>
      </div>
    </div>
  );
}

