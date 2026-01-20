'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartManager, CartItem } from '@/lib/cart';
import { trackAddToCart } from '@/lib/facebook-conversions';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  subtotalBeforeDiscount: number;
  discountPercent: number;
  discountAmount: number;
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
    setItems(CartManager.getItems()); // Update state
    setIsCartOpen(true); // Auto-open cart when item added
    
    // Meta Pixel: Track AddToCart event (client-side)
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'AddToCart', {
        content_name: item.title,
        content_ids: [item.id],
        content_type: 'product',
        value: item.price * item.quantity,
        currency: item.currency || 'PLN',
      });
    }
    
    // Facebook Conversions API: Track AddToCart event (server-side)
    trackAddToCart({
      content_name: item.title,
      content_ids: [item.id],
      value: item.price * item.quantity,
      currency: item.currency || 'PLN',
    }).catch(() => {
      // Fail silently
    });
  };

  const removeItem = (itemId: string) => {
    CartManager.removeItem(itemId);
    setItems(CartManager.getItems()); // Update state
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    CartManager.updateQuantity(itemId, quantity);
    setItems(CartManager.getItems()); // Update state
  };

  const clearCart = () => {
    CartManager.clearCart();
    setItems([]); // Update state
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculate totals - recalculate when items change
  const totals = React.useMemo(() => CartManager.getTotals(), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: totals.itemCount,
        subtotal: totals.subtotal,
        subtotalBeforeDiscount: totals.subtotalBeforeDiscount,
        discountPercent: totals.discountPercent,
        discountAmount: totals.discountAmount,
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
