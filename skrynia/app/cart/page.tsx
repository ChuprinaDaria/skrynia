'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, isCartOpen, openCart, closeCart } = useCart();

  // Open cart drawer when page loads
  React.useEffect(() => {
    openCart();
    // Redirect to home after opening drawer
    const timer = setTimeout(() => {
      router.push('/');
    }, 100);
    return () => clearTimeout(timer);
  }, [openCart, router]);

  // Handle cart close - redirect to home
  const handleCloseCart = () => {
    closeCart();
    // Wait a bit for drawer animation, then redirect to home
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  return (
    <CartDrawer
      isOpen={isCartOpen}
      onClose={handleCloseCart}
      items={items}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
    />
  );
}

