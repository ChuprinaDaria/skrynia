'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartManager, CartItem } from '@/lib/cart';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart on mount
  useEffect(() => {
    setItems(CartManager.getItems());

    // Listen for cart updates
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>;
      setItems(customEvent.detail);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    CartManager.addItem(item);
    setIsCartOpen(true); // Auto-open cart when item added
  };

  const removeItem = (itemId: string) => {
    CartManager.removeItem(itemId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    CartManager.updateQuantity(itemId, quantity);
  };

  const clearCart = () => {
    CartManager.clearCart();
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculate totals
  const totals = CartManager.getTotals();

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: totals.itemCount,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        total: totals.total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
