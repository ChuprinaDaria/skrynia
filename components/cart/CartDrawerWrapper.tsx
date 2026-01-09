'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

/**
 * Wrapper component to connect CartDrawer with CartContext
 */
export default function CartDrawerWrapper() {
  const cart = useCart();

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
