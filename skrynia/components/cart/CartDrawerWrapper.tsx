'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

/**
 * Wrapper component to connect CartDrawer with CartContext
 */
export default function CartDrawerWrapper() {
  const cart = useCart();

  // Auto-open cart after login if flag is set
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const openCartAfterLogin = sessionStorage.getItem('openCartAfterLogin');
      if (openCartAfterLogin === 'true') {
        sessionStorage.removeItem('openCartAfterLogin');
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          cart.openCart();
        }, 300);
      }
    }
  }, [cart]);

  return (
    <CartDrawer
      isOpen={cart.isCartOpen}
      onClose={cart.closeCart}
      items={cart.items}
      onUpdateQuantity={cart.updateQuantity}
      onRemoveItem={cart.removeItem}
    />
  );
}
